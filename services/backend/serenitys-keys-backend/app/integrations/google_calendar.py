"""Google Calendar integration helpers."""
from __future__ import annotations

import base64
import json
from datetime import datetime
from typing import Iterable, Optional, Sequence, Tuple

from ..config import get_settings

try:  # Optional dependency - handled gracefully if missing
    from google.oauth2 import service_account  # type: ignore
    from googleapiclient.discovery import build  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    service_account = None  # type: ignore
    build = None  # type: ignore


DEFAULT_PLACEHOLDER_LINK = "https://meet.google.com/dev-placeholder"


def _get_calendar_service():
    settings = get_settings()
    if not settings.google_calendar_configured or not service_account or not build:
        return None
    try:
        decoded = base64.b64decode(settings.google_service_account_json_base64)
        service_account_info = json.loads(decoded)
        credentials = service_account.Credentials.from_service_account_info(
            service_account_info,
            scopes=["https://www.googleapis.com/auth/calendar"],
        )
        return build("calendar", "v3", credentials=credentials)
    except Exception:  # pragma: no cover - external API failure fallback
        return None


def create_meet_event(
    summary: str,
    start_ts: datetime,
    end_ts: datetime,
    attendees: Sequence[str] | None = None,
) -> Tuple[str, Optional[str]]:
    """Create a Google Meet event and return the meeting link and event id."""

    service = _get_calendar_service()
    settings = get_settings()
    if not service:
        return DEFAULT_PLACEHOLDER_LINK, None

    event_body = {
        "summary": summary,
        "start": {"dateTime": start_ts.isoformat(), "timeZone": settings.timezone},
        "end": {"dateTime": end_ts.isoformat(), "timeZone": settings.timezone},
        "conferenceData": {
            "createRequest": {
                "requestId": f"serenitys-keys-{int(start_ts.timestamp())}",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }
    attendee_list = [email for email in (attendees or []) if email]
    if attendee_list:
        event_body["attendees"] = [{"email": email} for email in attendee_list]

    try:
        created = (
            service.events()
            .insert(
                calendarId=settings.google_calendar_id,
                body=event_body,
                conferenceDataVersion=1,
            )
            .execute()
        )
    except Exception:  # pragma: no cover - external API failure fallback
        return DEFAULT_PLACEHOLDER_LINK, None

    meeting_link = created.get("hangoutLink")
    if not meeting_link:
        conference = created.get("conferenceData", {}).get("entryPoints", [])
        meeting_link = next(
            (
                entry.get("uri")
                for entry in conference
                if entry.get("entryPointType") == "video" and entry.get("uri")
            ),
            None,
        )
    return meeting_link or DEFAULT_PLACEHOLDER_LINK, created.get("id")


def add_attendees(event_id: str | None, emails: Iterable[str]) -> None:
    """Add attendees to an existing Google Calendar event."""

    if not event_id:
        return

    service = _get_calendar_service()
    if not service:
        return

    settings = get_settings()

    try:
        event = service.events().get(calendarId=settings.google_calendar_id, eventId=event_id).execute()
    except Exception:  # pragma: no cover - propagation not desired
        return

    existing = event.get("attendees", []) or []
    existing_emails = {att.get("email") for att in existing if att.get("email")}

    updated = list(existing)
    for email in emails:
        if email and email not in existing_emails:
            updated.append({"email": email})
            existing_emails.add(email)

    event["attendees"] = updated

    try:
        service.events().update(
            calendarId=settings.google_calendar_id,
            eventId=event_id,
            body=event,
            conferenceDataVersion=1,
        ).execute()
    except Exception:  # pragma: no cover - ignore failures
        return
