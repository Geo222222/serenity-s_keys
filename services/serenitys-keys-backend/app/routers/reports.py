from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Metric, Report, Student
from ..schemas import ReportGenRequest, ReportOut
from ..utils.reports_ai import compose_parent_summary

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/generate", response_model=ReportOut)
def generate_report(payload: ReportGenRequest, db: Session = Depends(get_db)) -> ReportOut:
    student = db.get(Student, payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    metrics = (
        db.query(Metric)
        .filter(Metric.student_id == payload.student_id)
        .filter(Metric.date >= payload.from_ts)
        .filter(Metric.date <= payload.to_ts)
        .order_by(Metric.date.asc())
        .all()
    )

    metrics_payload = [
        {"wpm": m.wpm, "accuracy": m.accuracy, "time_spent_min": m.time_spent_min, "date": m.date}
        for m in metrics
    ]

    summary_text = compose_parent_summary(student.name, metrics_payload)

    report = Report(
        student_id=student.id,
        period_start=payload.from_ts,
        period_end=payload.to_ts,
        summary_text=summary_text,
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ReportOut(
        student_id=report.student_id,
        period_start=report.period_start,
        period_end=report.period_end,
        summary_text=report.summary_text,
    )