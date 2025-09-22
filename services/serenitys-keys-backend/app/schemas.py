from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AvailabilityQuery(BaseModel):
    course_id: Optional[int] = None
    from_ts: Optional[datetime] = None
    to_ts: Optional[datetime] = None


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_id: int
    start_ts: datetime
    end_ts: datetime
    mode: str
    capacity: int
    seats_left: int
    meet_link: Optional[str] = None


class BookingRequest(BaseModel):
    student_id: int
    session_id: int
    product_key: str


class BookingConfirm(BaseModel):
    stripe_session_id: str


class ReportGenRequest(BaseModel):
    student_id: int
    from_ts: datetime
    to_ts: datetime


class ReportOut(BaseModel):
    student_id: int
    period_start: datetime
    period_end: datetime
    summary_text: str