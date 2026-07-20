from __future__ import annotations

from dataclasses import dataclass
import os


def _bool_env(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    demo_api_enabled: bool = _bool_env("DEMO_API_ENABLED", True)
    demo_api_secret: str = os.getenv("DEMO_API_SECRET", "local-demo-secret")
    jwt_secret: str = os.getenv("DEMO_JWT_SECRET", "local-dev-only-change-me-use-env-2026")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = int(os.getenv("DEMO_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


settings = Settings()
