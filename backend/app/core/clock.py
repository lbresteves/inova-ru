from __future__ import annotations

from datetime import datetime, timedelta, timezone

BRASILIA_TZ = timezone(timedelta(hours=-3))


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def to_brasilia(value: datetime) -> datetime:
    return value.astimezone(BRASILIA_TZ)


def to_iso_brasilia(value: datetime) -> str:
    return to_brasilia(value).isoformat()
