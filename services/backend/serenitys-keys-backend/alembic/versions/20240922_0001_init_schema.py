"""init schema"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20240922_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "parents",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("phone", sa.String(length=20), nullable=True),
    )

    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("parents.id", ondelete="SET NULL"), nullable=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("dob", sa.Date(), nullable=True),
        sa.Column("level", sa.String(length=50), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("typing_username", sa.String(length=100), nullable=True),
    )
    op.create_index("ix_students_name", "students", ["name"])
    op.create_index("ix_students_typing_username", "students", ["typing_username"], unique=False)

    op.create_table(
        "sessions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("course", sa.String(length=50), nullable=False),
        sa.Column("start_ts", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_ts", sa.DateTime(timezone=True), nullable=False),
        sa.Column("mode", sa.String(length=20), nullable=False, server_default="remote"),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("location", sa.String(length=100), nullable=False),
        sa.Column("meet_link", sa.String(length=255), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="scheduled"),
    )
    op.create_index("ix_sessions_course", "sessions", ["course"])
    op.create_index("ix_sessions_start_ts", "sessions", ["start_ts"])

    op.create_table(
        "enrollments",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False),
        sa.Column("session_id", sa.Integer(), sa.ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("payment_status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.UniqueConstraint("student_id", "session_id", name="uq_enrollment_student_session"),
    )
    op.create_index("ix_enrollments_student_id", "enrollments", ["student_id"])
    op.create_index("ix_enrollments_session_id", "enrollments", ["session_id"])

    op.create_table(
        "metrics",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("wpm", sa.Integer(), nullable=True),
        sa.Column("accuracy", sa.Float(), nullable=True),
        sa.Column("time_spent", sa.Float(), nullable=True),
        sa.Column("source", sa.String(length=50), nullable=True),
        sa.Column("raw_blob", sa.JSON(), nullable=True),
    )
    op.create_index("ix_metrics_student_id", "metrics", ["student_id"])
    op.create_index("ix_metrics_date", "metrics", ["date"])

    op.create_table(
        "reports",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("student_id", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False),
        sa.Column("period_start", sa.Date(), nullable=False),
        sa.Column("period_end", sa.Date(), nullable=False),
        sa.Column("summary_text", sa.Text(), nullable=True),
        sa.Column("pdf_url", sa.String(length=255), nullable=True),
    )
    op.create_index("ix_reports_student_id", "reports", ["student_id"])


def downgrade() -> None:
    op.drop_index("ix_reports_student_id", table_name="reports")
    op.drop_table("reports")

    op.drop_index("ix_metrics_date", table_name="metrics")
    op.drop_index("ix_metrics_student_id", table_name="metrics")
    op.drop_table("metrics")

    op.drop_index("ix_enrollments_session_id", table_name="enrollments")
    op.drop_index("ix_enrollments_student_id", table_name="enrollments")
    op.drop_table("enrollments")

    op.drop_index("ix_sessions_start_ts", table_name="sessions")
    op.drop_index("ix_sessions_course", table_name="sessions")
    op.drop_table("sessions")

    op.drop_index("ix_students_typing_username", table_name="students")
    op.drop_index("ix_students_name", table_name="students")
    op.drop_table("students")

    op.drop_table("parents")
