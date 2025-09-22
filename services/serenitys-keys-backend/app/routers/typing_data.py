from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..db import get_db
from ..utils.typing_import import cleanup_tmp, import_typing_csv, save_upload_to_tmp

router = APIRouter(prefix="/typing", tags=["typing"])


@router.post("/import")
async def import_csv(
    student_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> dict:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Upload a CSV export from Typing.com")

    raw_bytes = await file.read()
    tmp_path = save_upload_to_tmp(raw_bytes)

    try:
        imported = import_typing_csv(tmp_path, student_id, db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        cleanup_tmp(tmp_path)

    return {"imported": imported}