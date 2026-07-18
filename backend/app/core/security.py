from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

import jwt
from app.core.clock import now_utc
from app.core.config import settings
from app.core.errors import ApiException
from app.repositories.memory import repository
from fastapi import Header


def create_access_token(cpf: str) -> str:
    expires_at = now_utc() + timedelta(minutes=settings.access_token_expire_minutes)
    jti = str(uuid4())
    payload = {
        "sub": cpf,
        "jti": jti,
        "exp": int(expires_at.timestamp()),
        "iat": int(now_utc().timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, object]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise ApiException(401, "Token ausente, inválido ou expirado.") from exc
    except jwt.PyJWTError as exc:
        raise ApiException(401, "Token ausente, inválido ou expirado.") from exc

    cpf = payload.get("sub")
    jti = payload.get("jti")
    if not isinstance(cpf, str) or not isinstance(jti, str):
        raise ApiException(401, "Token ausente, inválido ou expirado.")
    if jti in repository.state.invalidated_jtis:
        raise ApiException(401, "Token ausente, inválido ou expirado.")
    if cpf not in repository.state.users:
        raise ApiException(401, "Token ausente, inválido ou expirado.")
    return payload


def bearer_token(authorization: str | None = Header(default=None, alias="Authorization")) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise ApiException(401, "Token ausente, inválido ou expirado.")
    return authorization.split(" ", 1)[1].strip()


def authenticated_payload(authorization: str | None = Header(default=None, alias="Authorization")) -> dict[str, object]:
    return decode_access_token(bearer_token(authorization))
