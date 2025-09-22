"""Stripe checkout helper functions."""
from __future__ import annotations

from typing import Final, Optional
from urllib.parse import quote_plus

from ..config import get_settings

try:  # Optional dependency
    import stripe  # type: ignore
except ImportError:  # pragma: no cover - optional dependency missing
    stripe = None  # type: ignore


PLACEHOLDER_URL: Final[str] = "https://example.com/checkout/dev-placeholder"


def create_checkout_session(
    amount_cents: int,
    success_url: str,
    cancel_url: str,
    session_id: int,
    student_id: int,
    enrollment_id: Optional[int] = None,
    *,
    extra_metadata: Optional[dict[str, str]] = None,
) -> str:
    """Create a Stripe Checkout session or fall back to a placeholder URL."""

    settings = get_settings()

    base_metadata = {
        "session_id": str(session_id),
        "student_id": str(student_id),
        "enrollment_session_id": str(session_id),
        "enrollment_student_id": str(student_id),
    }
    if enrollment_id is not None:
        base_metadata["enrollment_id"] = str(enrollment_id)
    if extra_metadata:
        base_metadata.update({k: v for k, v in extra_metadata.items() if v is not None})

    if not settings.stripe_configured or not stripe:
        return _placeholder_url(session_id, student_id, enrollment_id, base_metadata)

    stripe.api_key = settings.stripe_secret_key

    try:
        checkout = stripe.checkout.Session.create(
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            payment_method_types=["card"],
            metadata=base_metadata,
            line_items=[
                {
                    "price_data": {
                        "currency": settings.currency,
                        "product_data": {"name": settings.product_name},
                        "unit_amount": amount_cents,
                    },
                    "quantity": 1,
                }
            ],
        )
    except Exception:  # pragma: no cover - external API failure fallback
        return _placeholder_url(session_id, student_id, enrollment_id, base_metadata)

    return checkout.get("url", PLACEHOLDER_URL)


def _placeholder_url(
    session_id: int,
    student_id: int,
    enrollment_id: Optional[int],
    metadata: dict[str, str],
) -> str:
    parts = [f"session_id={session_id}", f"student_id={student_id}"]
    if enrollment_id is not None:
        parts.append(f"enrollment_id={enrollment_id}")
    typing_username = metadata.get("typing_username")
    if typing_username:
        parts.append(f"typing_username={quote_plus(typing_username)}")
    suffix = "&".join(parts)
    return f"{PLACEHOLDER_URL}?{suffix}"
