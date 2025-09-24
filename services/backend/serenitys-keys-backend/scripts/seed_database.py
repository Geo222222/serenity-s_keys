"""Database seeding script for initial setup of Serenity's Keys backend."""
import asyncio
import logging
from datetime import datetime, time, timedelta
from typing import List
from zoneinfo import ZoneInfo

from sqlalchemy.ext.asyncio import AsyncSession

from app.db import async_session_maker, Base, engine
from app.models import Session
from app.config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# Course configurations
COURSES = [
    {
        "name": "Early Start Program",
        "durations": [45],  # Duration in minutes
        "capacity": 4,
        "modes": ["online", "in-person"],
    },
    {
        "name": "Typing Foundations",
        "durations": [60],
        "capacity": 6,
        "modes": ["online"],
    },
    {
        "name": "Advanced Typing",
        "durations": [60],
        "capacity": 4,
        "modes": ["online"],
    }
]

# Time slots configuration (in 24-hour format)
TIME_SLOTS = [
    # Morning slots
    {"hour": 9, "minute": 0},
    {"hour": 10, "minute": 0},
    {"hour": 11, "minute": 0},
    # Afternoon slots
    {"hour": 13, "minute": 0},
    {"hour": 14, "minute": 0},
    {"hour": 15, "minute": 0},
    {"hour": 16, "minute": 0},
    # Evening slots
    {"hour": 17, "minute": 0},
    {"hour": 18, "minute": 0},
]

def generate_session_times(
    start_date: datetime,
    days_ahead: int,
    tz: ZoneInfo
) -> List[datetime]:
    """Generate session start times for the given date range."""
    sessions = []
    current_date = start_date
    
    for _ in range(days_ahead):
        # Skip weekends
        if current_date.weekday() < 5:  # Monday = 0, Friday = 4
            for slot in TIME_SLOTS:
                session_time = datetime.combine(
                    current_date.date(),
                    time(hour=slot["hour"], minute=slot["minute"]),
                    tzinfo=tz
                )
                sessions.append(session_time)
        current_date += timedelta(days=1)
    
    return sessions

async def create_sessions(db: AsyncSession, start_date: datetime, days_ahead: int = 30) -> None:
    """Create session entries for all courses."""
    tz = settings.timezone_info
    session_times = generate_session_times(start_date, days_ahead, tz)
    
    for course in COURSES:
        for start_time in session_times:
            for mode in course["modes"]:
                for duration in course["durations"]:
                    end_time = start_time + timedelta(minutes=duration)
                    
                    session = Session(
                        course=course["name"],
                        start_ts=start_time,
                        end_ts=end_time,
                        mode=mode,
                        capacity=course["capacity"],
                        status="scheduled",
                        location="Remote" if mode == "online" else "Main Studio",
                    )
                    db.add(session)
    
    await db.commit()
    logger.info("Successfully created session entries")

async def main() -> None:
    """Main seeding function."""
    logger.info("Starting database seeding process...")
    
    # Ensure database tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    start_date = datetime.now(settings.timezone_info)
    
    async with async_session_maker() as session:
        await create_sessions(session, start_date)
    
    logger.info("Database seeding completed successfully")

if __name__ == "__main__":
    asyncio.run(main())