from __future__ import annotations

from app.api.routers import auth, credits, demo
from app.core.config import settings
from app.core.errors import register_error_handlers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="InovaRU Demo API", version="0.1.0")
register_error_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(credits.router)
if settings.demo_api_enabled:
    app.include_router(demo.router)


@app.get("/health")
def health() -> dict[str, object]:
    return {"ok": True, "demo": settings.demo_api_enabled}
