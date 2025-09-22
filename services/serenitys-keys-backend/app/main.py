from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .db import Base, engine
from .routers import availability, booking, health, reports, typing_data

settings = get_settings()

Base.metadata.create_all(bind=engine)

api = FastAPI(
    title="Serenity's Keys Backend",
    version="0.1.0",
    description="API surface for booking, metrics ingestion, and AI report hooks.",
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(health.router)
api.include_router(availability.router, prefix="/api")
api.include_router(booking.router, prefix="/api")
api.include_router(typing_data.router, prefix="/api")
api.include_router(reports.router, prefix="/api")


@api.get("/")
def root() -> dict[str, str]:
    return {"service": "serenitys-keys-backend", "status": "ok"}