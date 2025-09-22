"""Background scheduler for weekly reports."""
from __future__ import annotations

from datetime import datetime, timedelta

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select

from .db import AsyncSessionLocal
from .integrations.mailer import send_email
from .models import Metric, Parent, Student


async def weekly_reports() -> None:
    cutoff = datetime.utcnow().date() - timedelta(days=14)
    async with AsyncSessionLocal() as db:
        students = (await db.execute(select(Student))).scalars().all()
        for student in students:
            metric = (
                await db.execute(
                    select(Metric)
                    .where(Metric.student_id == student.id)
                    .order_by(Metric.date.desc())
                )
            ).scalars().first()
            if not metric or metric.date < cutoff:
                continue
            parent = await db.get(Parent, student.parent_id) if student.parent_id else None
            if not parent or not parent.email:
                continue
            html = (
                f"<p>{student.name} latest typing score: {metric.wpm or 'n/a'} WPM at "
                f"{metric.accuracy or 'n/a'}% accuracy. Keep going!</p>"
            )
            await send_email(parent.email, "Serenity's Keys - Weekly Update", html)


def start_scheduler(app) -> None:
    scheduler = AsyncIOScheduler(timezone="America/Chicago")
    scheduler.add_job(weekly_reports, "cron", day_of_week="sun", hour=17, minute=0)
    scheduler.start()
    app.state.scheduler = scheduler
