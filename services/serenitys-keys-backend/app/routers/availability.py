from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Enrollment, Session as SessionModel
from ..schemas import AvailabilityQuery, SessionOut

router = APIRouter(prefix="/availability", tags=["availability"])


@router.post("", response_model=list[SessionOut])
def list_availability(payload: AvailabilityQuery, db: Session = Depends(get_db)) -> list[SessionOut]:
    query = db.query(SessionModel)
    now = datetime.utcnow()

    query = query.filter(SessionModel.start_ts >= (payload.from_ts or now))
    if payload.to_ts:
        query = query.filter(SessionModel.start_ts <= payload.to_ts)
    if payload.course_id:
        query = query.filter(SessionModel.course_id == payload.course_id)

    sessions = query.order_by(SessionModel.start_ts.asc()).all()

    results: list[SessionOut] = []
    for session in sessions:
        taken = db.query(Enrollment).filter(Enrollment.session_id == session.id).count()
        seats_left = max(0, session.capacity - taken)
        results.append(
            SessionOut(
                id=session.id,
                course_id=session.course_id,
                start_ts=session.start_ts,
                end_ts=session.end_ts,
                mode=session.mode,
                capacity=session.capacity,
                seats_left=seats_left,
                meet_link=session.meet_link,
            )
        )

    return results