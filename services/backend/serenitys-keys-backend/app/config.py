"""Application configuration via environment variables."""
from __future__ import annotations

from functools import lru_cache
from typing import List
from zoneinfo import ZoneInfo

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Strongly-typed application settings."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = Field(default="dev", alias="APP_ENV")
    app_host: str = Field(default="0.0.0.0", alias="APP_HOST")
    app_port: int = Field(default=8080, alias="APP_PORT")

    database_url: str = Field(default="sqlite+aiosqlite:///./serenitys_keys.db", alias="DATABASE_URL")

    stripe_public_key: str = Field(default="", alias="STRIPE_PUBLIC_KEY")
    stripe_secret_key: str = Field(default="", alias="STRIPE_SECRET_KEY")
    stripe_webhook_secret: str = Field(default="", alias="STRIPE_WEBHOOK_SECRET")
    currency: str = Field(default="usd", alias="CURRENCY")
    product_name: str = Field(default="Serenity's Keys Session", alias="PRODUCT_NAME")

    google_service_account_json_base64: str = Field(default="", alias="GOOGLE_SERVICE_ACCOUNT_JSON_BASE64")
    google_calendar_id: str = Field(default="primary", alias="GOOGLE_CALENDAR_ID")

    timezone: str = Field(default="America/Chicago", alias="TIMEZONE")

    sendgrid_api_key: str = Field(default="", alias="SENDGRID_API_KEY")
    resend_api_key: str = Field(default="", alias="RESEND_API_KEY")
    from_email: str = Field(default="no-reply@serenityskeys.com", alias="FROM_EMAIL")

    cors_allow_origins: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        alias="CORS_ALLOW_ORIGINS",
    )

    launchpad_base_url: str = Field(
        default="http://localhost:3000/launchpad",
        alias="LAUNCHPAD_BASE_URL",
    )
    admin_api_token: str = Field(default="dev", alias="ADMIN_API_TOKEN")
    admin_jwt_secret: str = Field(default="change-me", alias="ADMIN_JWT_SECRET")
    sentry_dsn: str = Field(default="", alias="SENTRY_DSN")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]

    @property
    def timezone_info(self) -> ZoneInfo:
        return ZoneInfo(self.timezone)

    @property
    def stripe_configured(self) -> bool:
        return bool(self.stripe_secret_key and self.stripe_public_key)

    @property
    def google_calendar_configured(self) -> bool:
        return bool(self.google_service_account_json_base64 and self.google_calendar_id)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
