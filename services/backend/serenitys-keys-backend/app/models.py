"""SQLAlchemy ORM models for Serenity's Keys."""
from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Parent(Base):
    __tablename__ = "parents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

    students: Mapped[List["Student"]] = relationship(back_populates="parent", cascade="all, delete-orphan")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"Parent(id={self.id!r}, name={self.name!r})"


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("parents.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    dob: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    typing_username: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)

    parent: Mapped[Optional[Parent]] = relationship(back_populates="students")
    enrollments: Mapped[List["Enrollment"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    metrics: Mapped[List["Metric"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    reports: Mapped[List["Report"]] = relationship(back_populates="student", cascade="all, delete-orphan")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"Student(id={self.id!r}, name={self.name!r})"


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    start_ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_ts: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    mode: Mapped[str] = mapped_column(String(20), nullable=False, default="remote")
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    meet_link: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    calendar_event_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="scheduled")

    enrollments: Mapped[List["Enrollment"]] = relationship(back_populates="session", cascade="all, delete-orphan")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"Session(id={self.id!r}, course={self.course!r}, start={self.start_ts!r})"


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("student_id", "session_id", name="uq_enrollment_student_session"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    payment_status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")

    student: Mapped[Student] = relationship(back_populates="enrollments")
    session: Mapped[Session] = relationship(back_populates="enrollments")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"Enrollment(id={self.id!r}, student_id={self.student_id!r}, session_id={self.session_id!r})"


class Metric(Base):
    __tablename__ = "metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    wpm: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    accuracy: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    time_spent: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    raw_blob: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    student: Mapped[Student] = relationship(back_populates="metrics")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"Metric(id={self.id!r}, student_id={self.student_id!r}, date={self.date!r})"


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    summary_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    pdf_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    student: Mapped[Student] = relationship(back_populates="reports")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"Report(id={self.id!r}, student_id={self.student_id!r})"
