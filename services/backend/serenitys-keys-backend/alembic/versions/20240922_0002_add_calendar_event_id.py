"""add calendar_event_id to sessions"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20240922_0002"
down_revision = "20240922_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("sessions", sa.Column("calendar_event_id", sa.String(length=255), nullable=True))
    op.create_index("ix_sessions_calendar_event_id", "sessions", ["calendar_event_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_sessions_calendar_event_id", table_name="sessions")
    op.drop_column("sessions", "calendar_event_id")
