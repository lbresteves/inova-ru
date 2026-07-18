from __future__ import annotations

from app.core.errors import ApiException
from app.core.security import authenticated_payload
from app.domain.models import User
from app.repositories.memory import repository
from fastapi import Depends


def current_user(payload: dict[str, object] = Depends(authenticated_payload)) -> User:
    cpf = payload.get("sub")
    if not isinstance(cpf, str) or cpf not in repository.state.users:
        raise ApiException(401, "Token ausente, inválido ou expirado.")
    return repository.state.users[cpf]


def current_token_key(payload: dict[str, object] = Depends(authenticated_payload)) -> str:
    jti = payload.get("jti")
    if not isinstance(jti, str):
        raise ApiException(401, "Token ausente, inválido ou expirado.")
    return jti
