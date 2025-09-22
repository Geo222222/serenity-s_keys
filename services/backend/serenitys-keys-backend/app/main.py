"""FastAPI application bootstrap for Serenity's Keys backend."""
from __future__ import annotations

import csv
import io
import json
import logging
import os
import sys
import uuid
from datetime import date, datetime, time, timedelta
from typing import Any, Dict, List, Optional

from dateutil import parser as date_parser
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from fastapi import (
    Depends,
    FastAPI,
    File,
    Header,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .config import get_settings
from .db import Base, engine, get_session
from .integrations.google_calendar import add_attendees, create_meet_event
from .integrations.mailer import send_email
from .integrations.stripe_flow import create_checkout_session
from .scheduler import start_scheduler
from .security import make_admin_token, require_admin
from .models import Enrollment, Metric, Parent, Session, Student
from .schemas import (
    AdminLoginIn,
    AvailabilityQuery,
    CheckoutIn,
    CheckoutOut,
    ContactIn,
    MetricOut,
    ParentUpsertIn,
    ResendIn,
    SessionCreate,
    SessionOut,
)
from .utils.email_templates import confirmation_email_html
from .utils.ics import ics_data_url, make_ics

try:  # Optional dependency handling mirrors stripe helper
    import stripe  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    stripe = None  # type: ignore


logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(message)s")


def log(event: str, **kwargs: Any) -> None:
    print(json.dumps({"event": event, **kwargs}))


logger = logging.getLogger(__name__)

settings = get_settings()

sentry_dsn = settings.sentry_dsn or os.getenv("SENTRY_DSN", "")
if sentry_dsn:
    sentry_sdk.init(dsn=sentry_dsn, integrations=[FastApiIntegration()])

app = FastAPI(title="Serenity's Keys Backend", version="0.2.0")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(
    RateLimitExceeded, lambda request, exc: PlainTextResponse("Too Many Requests", status_code=429)
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ensured via create_all().")
    start_scheduler(app)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/availability", response_model=list[SessionOut])
async def availability(
    query: AvailabilityQuery,
    db: AsyncSession = Depends(get_session),
) -> list[SessionOut]:
    if query.start_date and query.end_date and query.start_date > query.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="start_date must be on or before end_date")

    tz = settings.timezone_info
    start_date = query.start_date or datetime.now(tz).date()
    end_date = query.end_date or (start_date + timedelta(days=30))
    start_dt = datetime.combine(start_date, time.min, tzinfo=tz)
    end_dt = datetime.combine(end_date, time.max, tzinfo=tz)

    stmt = (
        select(Session, func.count(Enrollment.id))
        .outerjoin(Enrollment)
        .where(Session.start_ts >= start_dt, Session.start_ts <= end_dt)
        .where(Session.status == "scheduled")
        .group_by(Session.id)
        .order_by(Session.start_ts.asc())
    )
    if query.course:
        stmt = stmt.where(Session.course == query.course)

    result = await db.execute(stmt)
    sessions: list[SessionOut] = []
    for session_obj, enrollment_count in result.all():
        seats_available = max(session_obj.capacity - (enrollment_count or 0), 0)
        sessions.append(
            SessionOut.model_validate(
                {
                    "id": session_obj.id,
                    "course": session_obj.course,
                    "start_ts": session_obj.start_ts,
                    "end_ts": session_obj.end_ts,
                    "mode": session_obj.mode,
                    "capacity": session_obj.capacity,
                    "location": session_obj.location,
                    "meet_link": session_obj.meet_link,
                    "status": session_obj.status,
                    "seats_available": seats_available,
                }
            )
        )
    return sessions


@app.get("/api/sessions/{session_id}", response_model=SessionOut)
async def get_session_detail(session_id: int, db: AsyncSession = Depends(get_session)) -> SessionOut:
    session_obj = await db.get(Session, session_id)
    if not session_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    enrollment_count = await _count_enrollments(db, session_obj.id)
    seats_available = max(session_obj.capacity - enrollment_count, 0)
    return SessionOut.model_validate(
        {
            "id": session_obj.id,
            "course": session_obj.course,
            "start_ts": session_obj.start_ts,
            "end_ts": session_obj.end_ts,
            "mode": session_obj.mode,
            "capacity": session_obj.capacity,
            "location": session_obj.location,
            "meet_link": session_obj.meet_link,
            "status": session_obj.status,
            "seats_available": seats_available,
        }
    )



@app.post("/api/profile/upsert")
async def upsert_profile(
    body: ParentUpsertIn,
    db: AsyncSession = Depends(get_session),
) -> dict[str, int]:
    normalized_email = body.parent_email.strip().lower()
    parent_stmt = select(Parent).where(func.lower(Parent.email) == normalized_email)
    parent = (await db.execute(parent_stmt)).scalars().first()

    if parent:
        parent.name = body.parent_name.strip()
        parent.phone = body.parent_phone.strip() if body.parent_phone else None
    else:
        parent = Parent(
            name=body.parent_name.strip(),
            email=normalized_email,
            phone=body.parent_phone.strip() if body.parent_phone else None,
        )
        db.add(parent)
        await db.flush()

    if body.student_id:
        student = await db.get(Student, body.student_id)
        if not student:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="student_id not found")
        student.name = body.student_name.strip()
        if not student.parent_id:
            student.parent_id = parent.id
    else:
        student = Student(parent_id=parent.id, name=body.student_name.strip())
        db.add(student)
        await db.flush()

    if not student.parent_id:
        student.parent_id = parent.id

    if body.typing_username:
        normalized_username = body.typing_username.strip()
        if normalized_username:
            student.typing_username = normalized_username

    await db.commit()

    return {"parent_id": parent.id, "student_id": student.id}


@app.post("/api/booking/checkout", response_model=CheckoutOut)
async def booking_checkout(
    payload: CheckoutIn,
    db: AsyncSession = Depends(get_session),
) -> CheckoutOut:
    session_obj = await db.get(Session, payload.session_id)
    if not session_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    if session_obj.status != "scheduled":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Session not open for booking")

    student = await db.get(Student, payload.student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Student not found")

    enrolled_count = await _count_enrollments(db, session_obj.id)
    if enrolled_count >= session_obj.capacity:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Session is full")

    enrollment_stmt = select(Enrollment).where(
        Enrollment.session_id == session_obj.id,
        Enrollment.student_id == student.id,
    )
    existing_enrollment = (await db.execute(enrollment_stmt)).scalar_one_or_none()

    if existing_enrollment:
        enrollment = existing_enrollment
    else:
        enrollment = Enrollment(
            student_id=student.id,
            session_id=session_obj.id,
            status="pending",
            payment_status="pending",
        )
        db.add(enrollment)

    if not session_obj.meet_link or not session_obj.calendar_event_id:
        meet_link, event_id = create_meet_event(
            summary=f"Serenity's Keys - {session_obj.course}",
            start_ts=session_obj.start_ts,
            end_ts=session_obj.end_ts,
            attendees=[],
        )
        if meet_link:
            session_obj.meet_link = meet_link
        if event_id:
            session_obj.calendar_event_id = event_id
        db.add(session_obj)

    await db.flush()
    extra_meta: dict[str, str] = {}
    if payload.typing_username:
        extra_meta["typing_username"] = payload.typing_username.strip()

    checkout_url = create_checkout_session(
        amount_cents=payload.amount_cents,
        success_url=payload.success_url,
        cancel_url=payload.cancel_url,
        session_id=session_obj.id,
        student_id=student.id,
        enrollment_id=enrollment.id,
        extra_metadata=extra_meta,
    )

    await db.commit()
    return CheckoutOut(checkout_url=checkout_url, enrollment_id=enrollment.id)


@app.post("/webhooks/stripe")
@limiter.limit("10/minute")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_session)) -> dict[str, str]:
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature", "")

    event_data: dict[str, Any] | None = None

    if settings.stripe_webhook_secret and stripe:
        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=settings.stripe_webhook_secret,
            )
            event_data = event  # type: ignore[assignment]
        except Exception as exc:  # pragma: no cover - passthrough
            logger.warning("Stripe webhook signature verification failed: %s", exc)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")
    else:
        try:
            event_data = await request.json()
        except Exception as exc:  # pragma: no cover - fallback
            logger.error("Unable to decode webhook payload: %s", exc)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payload")

    event_type = event_data.get("type") if isinstance(event_data, dict) else None
    if event_type == "checkout.session.completed":
        await _handle_checkout_completed(event_data, db)
    else:
        logger.info("Unhandled Stripe webhook type: %s", event_type)

    return {"status": "ok"}


@app.post("/api/contact")
async def submit_contact_form(_: ContactIn) -> dict[str, str]:
    # Stub handler for Phase 0; integrate email service in later phase.
    return {"status": "ok"}


@app.post("/api/typing/import")
async def import_typing_metrics(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_session),
) -> dict[str, int]:
    content = await file.read()
    try:
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    if reader.fieldnames is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV has no header row")

    header_map = _build_header_map([h or "" for h in reader.fieldnames])
    required_columns = {"student", "date", "wpm", "accuracy", "time_spent"}
    if not required_columns.issubset(header_map):
        missing = sorted(required_columns - set(header_map))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required columns: {', '.join(missing)}",
        )

    imported = 0
    for row in reader:
        student_name = _safe_strip(row.get(header_map["student"], ""))
        if not student_name:
            continue

        student = await _get_or_create_student(db, student_name)
        metric_date = _parse_date(row.get(header_map["date"], ""))
        if metric_date is None:
            continue
        metric = Metric(
            student_id=student.id,
            date=metric_date,
            wpm=_parse_int(row.get(header_map["wpm"])),
            accuracy=_parse_float(row.get(header_map["accuracy"])),
            time_spent=_parse_float(row.get(header_map["time_spent"])),
            source="typing.com",
            raw_blob={k: v for k, v in row.items()},
        )
        db.add(metric)
        imported += 1

    await db.commit()
    return {"imported": imported}


@app.get("/api/students/{student_id}/metrics", response_model=list[MetricOut])
async def list_student_metrics(
    student_id: int,
    db: AsyncSession = Depends(get_session),
) -> list[MetricOut]:
    stmt = (
        select(Metric)
        .where(Metric.student_id == student_id)
        .order_by(Metric.date.desc(), Metric.id.desc())
    )
    result = await db.execute(stmt)
    metrics = result.scalars().all()
    if not metrics:
        student = await db.get(Student, student_id)
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return [MetricOut.model_validate(metric) for metric in metrics]


@app.post("/api/admin/login")
async def admin_login(body: AdminLoginIn) -> dict[str, Any]:
    if body.password != settings.admin_api_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    token = make_admin_token()
    return {"token": token, "expires_in": 3600}





@app.get("/api/admin/sessions")
async def admin_list_sessions(
    db: AsyncSession = Depends(get_session),
    _: dict[str, Any] = Depends(require_admin),
) -> list[dict[str, Any]]:
    now = datetime.utcnow()
    stmt = (
        select(Session)
        .where(Session.start_ts >= now)
        .order_by(Session.start_ts.asc())
    )
    sessions = (await db.execute(stmt)).scalars().all()
    return [
        {
            "id": sess.id,
            "course": sess.course,
            "start_ts": sess.start_ts.isoformat(),
            "end_ts": sess.end_ts.isoformat(),
            "capacity": sess.capacity,
            "status": sess.status,
            "calendar_event_id": sess.calendar_event_id,
            "meet_link": sess.meet_link,
        }
        for sess in sessions
    ]


@app.post("/api/admin/resend-confirmation")
async def admin_resend_confirmation(
    body: ResendIn,
    db: AsyncSession = Depends(get_session),
    _: dict[str, Any] = Depends(require_admin),
) -> dict[str, bool]:
    session_obj = await db.get(Session, body.session_id)
    student = await db.get(Student, body.student_id)
    parent = await db.get(Parent, student.parent_id) if student and student.parent_id else None
    if not (session_obj and student and parent and parent.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing data")

    meet_link = session_obj.meet_link or "https://meet.google.com/dev-placeholder"
    launchpad_url = f"{settings.launchpad_base_url}?session_id={session_obj.id}&student_id={student.id}"

    ics_content = make_ics(
        uid=f"sk-{session_obj.id}-{student.id}",
        title=f"Serenity's Keys - {session_obj.course}",
        start=session_obj.start_ts,
        end=session_obj.end_ts,
        meet_url=meet_link,
    )
    ics_link = ics_data_url(ics_content)

    html = confirmation_email_html(
        parent_name=parent.name if parent else None,
        child_name=student.name if student else None,
        when=session_obj.start_ts,
        meet_link=meet_link,
        launchpad_url=launchpad_url,
        ics_link=ics_link,
    )

    await send_email(
        to=parent.email,
        subject="Serenity's Keys: Your session is confirmed",
        html=html,
    )
    log("admin_resend_confirmation", session_id=session_obj.id, student_id=student.id)
    return {"ok": True}


@app.post("/api/admin/session", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
async def admin_create_session(
    body: SessionCreate,
    db: AsyncSession = Depends(get_session),
    _: dict[str, Any] = Depends(require_admin),
) -> SessionOut:
    start_ts = _ensure_timezone(body.start_ts)
    end_ts = _ensure_timezone(body.end_ts)

    session_obj = Session(
        course=body.course,
        start_ts=start_ts,
        end_ts=end_ts,
        capacity=body.capacity,
        mode=body.mode,
        location=body.location,
        status="scheduled",
        meet_link=None,
    )
    db.add(session_obj)
    await db.flush()
    seats_available = session_obj.capacity
    await db.commit()
    return SessionOut.model_validate(
        {
            "id": session_obj.id,
            "course": session_obj.course,
            "start_ts": session_obj.start_ts,
            "end_ts": session_obj.end_ts,
            "mode": session_obj.mode,
            "capacity": session_obj.capacity,
            "location": session_obj.location,
            "meet_link": session_obj.meet_link,
            "status": session_obj.status,
            "seats_available": seats_available,
        }
    )


def _ensure_timezone(dt: datetime) -> datetime:
    if dt.tzinfo:
        return dt.astimezone(settings.timezone_info)
    return dt.replace(tzinfo=settings.timezone_info)


async def _count_enrollments(db: AsyncSession, session_id: int) -> int:
    stmt = select(func.count(Enrollment.id)).where(Enrollment.session_id == session_id)
    result = await db.execute(stmt)
    return int(result.scalar_one() or 0)


async def _handle_checkout_completed(event_data: dict[str, Any], db: AsyncSession) -> None:
    session_object = event_data.get("data", {}).get("object", {})
    metadata: Dict[str, Any] = session_object.get("metadata", {})

    session_id_raw = metadata.get("session_id") or metadata.get("enrollment_session_id")
    student_id_raw = metadata.get("student_id") or metadata.get("enrollment_student_id")
    typing_username = metadata.get("typing_username") or metadata.get("typing_user")

    if not session_id_raw or not student_id_raw:
        logger.warning("Stripe checkout completed without session/student metadata: %s", metadata)
        return

    session_id = int(session_id_raw)
    student_id = int(student_id_raw)

    stmt = (
        select(Enrollment)
        .where(Enrollment.session_id == session_id, Enrollment.student_id == student_id)
        .limit(1)
    )
    enrollment = (await db.execute(stmt)).scalar_one_or_none()
    if enrollment:
        enrollment.payment_status = "paid"
        enrollment.status = "confirmed"
    else:
        enrollment = Enrollment(
            session_id=session_id,
            student_id=student_id,
            status="confirmed",
            payment_status="paid",
        )
        db.add(enrollment)

    await db.commit()

    session_obj = await db.get(Session, session_id)
    student = await db.get(Student, student_id)
    parent: Optional[Parent] = None
    if student and student.parent_id:
        parent = await db.get(Parent, student.parent_id)

    if not session_obj:
        logger.warning("Session missing when sending confirmation email: %s", session_id)
        return

    if session_obj.calendar_event_id and parent and parent.email:
        try:
            add_attendees(session_obj.calendar_event_id, [parent.email])
        except Exception as exc:  # pragma: no cover - best effort
            logger.warning("Unable to add calendar attendee: %s", exc)

    meet_link = session_obj.meet_link or "https://meet.google.com/dev-placeholder"
    launchpad_url = f"{settings.launchpad_base_url}?session_id={session_id}&student_id={student_id}"

    ics_content = make_ics(
        uid=f"sk-{session_id}-{student_id}",
        title=f"Serenity's Keys - {session_obj.course}",
        start=session_obj.start_ts,
        end=session_obj.end_ts,
        meet_url=meet_link,
    )
    ics_link = ics_data_url(ics_content)

    html = confirmation_email_html(
        parent_name=parent.name if parent else None,
        child_name=student.name if student else None,
        when=session_obj.start_ts,
        meet_link=meet_link,
        launchpad_url=launchpad_url,
        ics_link=ics_link,
    )

    recipient = parent.email if parent and parent.email else None
    if not recipient:
        logger.info("No parent email found for student_id=%s; skipping confirmation email", student_id)
        return

    try:
        await send_email(
            to=recipient,
            subject="Serenity's Keys: Your session is confirmed",
            html=html,
        )
        logger.info(
            "Confirmation email sent for session_id=%s student_id=%s typing_username=%s",
            session_id,
            student_id,
            typing_username,
        )
        log("confirmation_email_sent", session_id=session_id, student_id=student_id)
    except Exception as exc:  # pragma: no cover - external service failures
        logger.error("Unable to send confirmation email: %s", exc)


def _build_header_map(headers: List[str]) -> dict[str, str]:
    aliases = {
        "student": {"student", "student name", "name"},
        "date": {"date", "timestamp", "date/time", "datetime"},
        "wpm": {"wpm", "speed"},
        "accuracy": {"accuracy"},
        "time_spent": {"time", "minutes", "time_spent", "time (minutes)"},
    }
    mapping: dict[str, str] = {}
    canonical_headers = [h.strip().lower() for h in headers]
    for canonical, options in aliases.items():
        for idx, header in enumerate(canonical_headers):
            if header in options:
                mapping[canonical] = headers[idx]
                break
    return mapping


def _safe_strip(value: Optional[str]) -> str:
    return value.strip() if value else ""


def _parse_date(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    try:
        parsed = date_parser.parse(value)
        return parsed.date()
    except (ValueError, TypeError):  # pragma: no cover - parse failures fallback
        return None


def _parse_int(value: Optional[str]) -> Optional[int]:
    if not value:
        return None
    try:
        cleaned = value.replace("%", "").strip()
        return int(float(cleaned))
    except (ValueError, AttributeError):
        return None


def _parse_float(value: Optional[str]) -> Optional[float]:
    if not value:
        return None
    try:
        cleaned = value.replace("%", "").strip()
        return float(cleaned)
    except (ValueError, AttributeError):
        return None


async def _get_or_create_student(db: AsyncSession, name: str) -> Student:
    stmt = select(Student).where(func.lower(Student.name) == name.lower()).limit(1)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        return existing

    placeholder_parent = Parent(
        name="CSV Import Parent",
        email=f"placeholder+{uuid.uuid4().hex}@serenityskeys.com",
    )
    db.add(placeholder_parent)
    await db.flush()

    student = Student(name=name, parent_id=placeholder_parent.id)
    db.add(student)
    await db.flush()
    return student
