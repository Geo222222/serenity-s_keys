import os
import tempfile
from datetime import datetime

import pandas as pd
from sqlalchemy.orm import Session

from ..models import Metric


EXPECTED_COLUMNS = {"date", "wpm", "accuracy", "time_spent_min"}


def import_typing_csv(path: str, student_id: int, db: Session) -> int:
    df = pd.read_csv(path)
    missing = EXPECTED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {', '.join(sorted(missing))}")

    count = 0
    for _, row in df.iterrows():
        metric = Metric(
            student_id=student_id,
            date=pd.to_datetime(row["date"]).to_pydatetime()
            if "date" in row and not pd.isna(row["date"])
            else datetime.utcnow(),
            wpm=float(row["wpm"]),
            accuracy=float(row["accuracy"]),
            time_spent_min=float(row.get("time_spent_min", 0) or 0),
            raw_blob=row.to_dict(),
        )
        db.add(metric)
        count += 1

    db.commit()
    return count


def save_upload_to_tmp(upload) -> str:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
        tmp.write(upload)
        return tmp.name


def cleanup_tmp(path: str) -> None:
    if os.path.exists(path):
        os.remove(path)