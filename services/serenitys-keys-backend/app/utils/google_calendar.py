from datetime import datetime
from uuid import uuid4


def create_meet_event(summary: str, start_ts: datetime, end_ts: datetime) -> str:
    """Stub for Google Calendar API integration.

    Replace with real service-account powered call that creates an event and
    returns the generated Meet link. For now we hand back a stable pseudo URL
    so frontends can proceed end-to-end.
    """
    _ = (summary, start_ts, end_ts)
    token = uuid4().hex[:10]
    return f"https://meet.google.com/{token[:3]}-{token[3:6]}-{token[6:10]}"