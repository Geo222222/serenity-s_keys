"""Pydantic schemas for request/response bodies."""
from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl, PositiveInt


class AvailabilityQuery(BaseModel):
    course: Optional[str] = Field(default=None, description="Filter availability by course identifier.")
    start_date: Optional[date] = Field(default=None, description="Inclusive start date filter.")
    end_date: Optional[date] = Field(default=None, description="Inclusive end date filter.")


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course: str
    start_ts: datetime
    end_ts: datetime
    mode: str
    capacity: int
    location: str
    meet_link: Optional[str]
    status: str
    seats_available: int


class CheckoutIn(BaseModel):
    session_id: PositiveInt
    student_id: PositiveInt
    amount_cents: PositiveInt
    success_url: HttpUrl
    cancel_url: HttpUrl
    typing_username: Optional[str] = Field(default=None, max_length=150)


class CheckoutOut(BaseModel):
    checkout_url: HttpUrl
    enrollment_id: int


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str


class MetricIn(BaseModel):
    student_id: PositiveInt
    date: date
    wpm: Optional[int] = None
    accuracy: Optional[float] = None
    time_spent: Optional[float] = None
    source: Optional[str] = None
    raw_blob: Optional[dict] = None


class MetricOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    date: date
    wpm: Optional[int]
    accuracy: Optional[float]
    time_spent: Optional[float]
    source: Optional[str]
    raw_blob: Optional[dict]


class SessionCreate(BaseModel):
    course: str
    start_ts: datetime
    end_ts: datetime
    capacity: int = Field(default=4, ge=1)
    mode: str = Field(default="remote")
    location: str = Field(default="Google Meet")

class ParentUpsertIn(BaseModel):
    parent_name: str
    parent_email: EmailStr
    parent_phone: Optional[str] = None
    student_id: Optional[int] = None
    student_name: str
    typing_username: Optional[str] = Field(default=None, max_length=150)


class AdminLoginIn(BaseModel):
    password: str


class ResendIn(BaseModel):
    session_id: PositiveInt
    student_id: PositiveInt
