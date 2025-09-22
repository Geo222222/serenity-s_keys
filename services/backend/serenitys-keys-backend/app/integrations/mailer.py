"""Simple email sender for transactional notices."""
from __future__ import annotations

import asyncio
import logging
from typing import Any

import httpx

from ..config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()


async def send_email(to: str, subject: str, html: str) -> bool:
    """Send an email via Resend, falling back to console logging in dev."""

    api_key = settings.resend_api_key
    if not api_key:
        logger.info("[dev-email] to=%s subject=%s", to, subject)
        logger.debug("Email body preview: %s", html[:500])
        return True

    payload: dict[str, Any] = {
        "from": settings.from_email or "no-reply@serenityskeys.com",
        "to": [to],
        "subject": subject,
        "html": html,
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
        )
        response.raise_for_status()
        logger.info("Email dispatched via Resend: %s", response.json().get("id", "unknown"))
        return True


def send_email_sync(to: str, subject: str, html: str) -> bool:
    """Convenience wrapper when running outside async contexts."""

    return asyncio.get_event_loop().run_until_complete(send_email(to, subject, html))
