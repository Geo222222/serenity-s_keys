"""Seed sample sessions for the next two weeks."""
from __future__ import annotations

import asyncio
import sys
from datetime import date, datetime, time, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

BASE_DIR = Path(__file__).resolve().parents[1]
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from app.config import get_settings  # noqa: E402
from app.db import AsyncSessionLocal, Base, engine  # noqa: E402
from app.models import Session  # noqa: E402

settings = get_settings()

COURSE_GROUPS = [
    ("group:3-5", time(hour=15, minute=30), 30, 3),
    ("group:6-8", time(hour=16, minute=0), 45, 4),
    ("group:9-11", time(hour=16, minute=0), 45, 4),
    ("group:12-14", time(hour=16, minute=0), 45, 4),
]
PRIVATE_COURSE = ("private:all", time(hour=17, minute=0), 45, 1)


async def main() -> None:
    tz = settings.timezone_info
    today = datetime.now(tz).date()
    created = 0

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        for offset in range(14):
            target_date = today + timedelta(days=offset)
            weekday = target_date.weekday()  # Monday == 0

            if weekday in {0, 2, 4}:  # Mon/Wed/Fri
                for course, start_time, duration_minutes, capacity in COURSE_GROUPS:
                    created += await _ensure_session(
                        session=session,
                        course=course,
                        target_date=target_date,
                        start_time=start_time,
                        duration_minutes=duration_minutes,
                        capacity=capacity,
                        tz=tz,
                    )

            # Daily private slot
            course, start_time, duration_minutes, capacity = PRIVATE_COURSE
            created += await _ensure_session(
                session=session,
                course=course,
                target_date=target_date,
                start_time=start_time,
                duration_minutes=duration_minutes,
                capacity=capacity,
                tz=tz,
            )

        await session.commit()

    print(f"Seed complete. Sessions created: {created}")


async def _ensure_session(
    *,
    session: AsyncSession,
    course: str,
    target_date: date,
    start_time: time,
    duration_minutes: int,
    capacity: int,
    tz: ZoneInfo,
) -> int:
    start_dt = datetime.combine(target_date, start_time, tzinfo=tz)
    end_dt = start_dt + timedelta(minutes=duration_minutes)

    stmt = select(Session).where(Session.course == course, Session.start_ts == start_dt)
    existing = (await session.execute(stmt)).scalar_one_or_none()
    if existing:
        return 0

    new_session = Session(
        course=course,
        start_ts=start_dt,
        end_ts=end_dt,
        mode="remote",
        capacity=capacity,
        location="Google Meet",
        status="scheduled",
    )
    session.add(new_session)
    return 1


if __name__ == "__main__":
    asyncio.run(main())
