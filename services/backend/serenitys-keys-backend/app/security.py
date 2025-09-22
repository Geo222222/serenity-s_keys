"""Admin authentication helpers."""
from __future__ import annotations

import time
from typing import Any

import jwt
from fastapi import Depends, Header, HTTPException

from .config import get_settings

settings = get_settings()


def make_admin_token(sub: str = "admin", ttl_seconds: int = 3600) -> str:
    payload: dict[str, Any] = {
        "sub": sub,
        "exp": int(time.time()) + ttl_seconds,
    }
    return jwt.encode(payload, settings.admin_jwt_secret, algorithm="HS256")


def require_admin(x_admin_token: str | None = Header(default=None)) -> dict[str, Any]:
    """FastAPI dependency that validates the admin JWT."""

    if not x_admin_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        decoded = jwt.decode(x_admin_token, settings.admin_jwt_secret, algorithms=["HS256"])
        return decoded
    except jwt.PyJWTError as exc:  # pragma: no cover - token failures
        raise HTTPException(status_code=401, detail="Unauthorized") from exc
