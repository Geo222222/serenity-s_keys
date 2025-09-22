from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import get_settings
from ..db import get_db
from ..models import Enrollment, Session as SessionModel
from ..schemas import BookingConfirm, BookingRequest
from ..utils.google_calendar import create_meet_event
from ..utils.stripe_payments import create_checkout_session

router = APIRouter(prefix="/booking", tags=["booking"])
settings = get_settings()


@router.post("/checkout")
def checkout(req: BookingRequest, db: Session = Depends(get_db)) -> dict:
    if req.product_key not in settings.price_ids:
        raise HTTPException(status_code=400, detail="Unknown product key")

    session = db.get(SessionModel, req.session_id)
    if not session or session.status != "open":
        raise HTTPException(status_code=400, detail="Session not available")

    if session.start_ts <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Session already started")

    taken = db.query(Enrollment).filter(Enrollment.session_id == session.id).count()
    if taken >= session.capacity:
        raise HTTPException(status_code=409, detail="Session full")

    if not session.meet_link:
        session.meet_link = create_meet_event("Serenity's Keys", session.start_ts, session.end_ts)
        db.add(session)
        db.commit()
        db.refresh(session)

    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.session_id == session.id, Enrollment.student_id == req.student_id)
        .one_or_none()
    )
    if not enrollment:
        enrollment = Enrollment(
            student_id=req.student_id,
            session_id=session.id,
            payment_status="pending",
        )
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)

    checkout_session = create_checkout_session(
        req.product_key,
        {
            "student_id": str(req.student_id),
            "session_id": str(req.session_id),
            "price_id": settings.price_ids.get(req.product_key, ""),
        },
    )
    return {"stripe_session": checkout_session, "meet_link": session.meet_link}


@router.post("/confirm")
def confirm(req: BookingConfirm, db: Session = Depends(get_db)) -> dict:
    parts = req.stripe_session_id.split("_")
    if len(parts) < 4:
        raise HTTPException(status_code=400, detail="Malformed Stripe session id")

    try:
        student_id = int(parts[-2])
        session_id = int(parts[-1])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid session metadata") from exc

    session = db.get(SessionModel, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    enrollment = (
        db.query(Enrollment)
        .filter(Enrollment.session_id == session_id, Enrollment.student_id == student_id)
        .one_or_none()
    )

    if not enrollment:
        enrollment = Enrollment(
            student_id=student_id,
            session_id=session_id,
            payment_status="paid",
        )
        db.add(enrollment)
    else:
        enrollment.payment_status = "paid"

    db.commit()
    db.refresh(enrollment)

    return {"ok": True, "enrollment_id": enrollment.id}