from typing import Any, Dict


def create_checkout_session(product_key: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Stripe Checkout stub.

    Drop in the official Stripe SDK call when credentials are ready. The
    response mirrors the fields the frontend expects and encodes the
    student/session identifiers so the confirmation endpoint can reconcile
    enrollments without a live Stripe webhook.
    """
    student_id = metadata.get("student_id", "0")
    session_id = metadata.get("session_id", "0")
    session_code = f"cs_test_{student_id}_{session_id}"
    return {
        "id": session_code,
        "url": "https://checkout.stripe.com/pay/demo",
        "status": "open",
        "product_key": product_key,
        "metadata": metadata,
    }