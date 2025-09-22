from functools import lru_cache
import os
from pydantic import BaseModel


class Settings(BaseModel):
    env: str = os.getenv("ENV", "dev")
    port: int = int(os.getenv("PORT", "8080"))
    cors_origins: list[str] = (
        os.getenv("CORS_ORIGINS", "").split(",")
        if os.getenv("CORS_ORIGINS")
        else ["*"]
    )
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./serenitys_keys.db")

    stripe_secret_key: str | None = os.getenv("STRIPE_SECRET_KEY")
    stripe_webhook_secret: str | None = os.getenv("STRIPE_WEBHOOK_SECRET")
    price_ids: dict[str, str] = {
        "trial": os.getenv("PRODUCT_TRIAL_PRICE_ID", ""),
        "private": os.getenv("PRODUCT_PRIVATE_PRICE_ID", ""),
        "group": os.getenv("PRODUCT_GROUP_PRICE_ID", ""),
        "package5": os.getenv("PRODUCT_PACKAGE5_PRICE_ID", ""),
        "package10": os.getenv("PRODUCT_PACKAGE10_PRICE_ID", ""),
    }

    google_svc_email: str | None = os.getenv("GOOGLE_SVC_EMAIL")
    google_key_json_path: str | None = os.getenv("GOOGLE_SVC_KEY_JSON_PATH")
    google_calendar_id: str = os.getenv("GOOGLE_CALENDAR_ID", "primary")


@lru_cache
def get_settings() -> Settings:
    return Settings()