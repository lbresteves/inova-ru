from __future__ import annotations

from dataclasses import dataclass
from time import monotonic

from app.core.errors import ApiException
from fastapi import Request


@dataclass
class Bucket:
    window_start: float
    count: int


class RateLimiter:
    def __init__(self) -> None:
        self._buckets: dict[str, Bucket] = {}

    def check(self, key: str, limit: int, seconds: int = 60) -> None:
        now = monotonic()
        bucket = self._buckets.get(key)
        if bucket is None or now - bucket.window_start >= seconds:
            self._buckets[key] = Bucket(window_start=now, count=1)
            return
        if bucket.count >= limit:
            retry_after = max(1, seconds - int(now - bucket.window_start))
            raise ApiException(
                429,
                "Muitas tentativas, aguarde um momento.",
                headers={"Retry-After": str(retry_after)},
            )
        bucket.count += 1


rate_limiter = RateLimiter()


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",", 1)[0].strip()
    return request.client.host if request.client else "unknown"
