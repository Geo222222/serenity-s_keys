"""ICS file utilities."""
from __future__ import annotations

from datetime import datetime
from urllib.parse import quote

from ..config import get_settings

settings = get_settings()


def make_ics(uid: str, title: str, start: datetime, end: datetime, meet_url: str) -> str:
    """Generate a barebones ICS calendar string."""

    dt_format = "%Y%m%dT%H%M%S"
    start_str = start.strftime(dt_format)
    end_str = end.strftime(dt_format)
    timezone = settings.timezone.replace("/", "\\/")

    return (
        "BEGIN:VCALENDAR\r\n"
        "VERSION:2.0\r\n"
        "PRODID:-//SerenitysKeys//EN\r\n"
        "BEGIN:VEVENT\r\n"
        f"UID:{uid}\r\n"
        f"SUMMARY:{title}\r\n"
        f"DTSTART;TZID={timezone}:{start_str}\r\n"
        f"DTEND;TZID={timezone}:{end_str}\r\n"
        f"DESCRIPTION:Join: {meet_url}\r\n"
        f"URL:{meet_url}\r\n"
        "END:VEVENT\r\n"
        "END:VCALENDAR\r\n"
    )


def ics_data_url(ics_content: str) -> str:
    """Return a data URI suitable for inline ICS downloads."""

    return f"data:text/calendar;charset=utf-8,{quote(ics_content)}"
