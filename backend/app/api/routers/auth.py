from __future__ import annotations

from app.core.errors import ApiException
from app.core.rate_limit import client_ip, rate_limiter
from app.core.security import create_access_token
from app.domain.models import User
from app.repositories.memory import repository
from app.schemas.auth import LoginRequest, LoginResponse
from fastapi import APIRouter, Request

router = APIRouter(prefix="/usuarios", tags=["auth"])


def user_response(user: User) -> dict[str, object]:
    return {
        "nome": user.nome,
        "email": user.email,
        "isAluno": user.is_aluno,
        "isColaborador": user.is_colaborador,
    }


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, request: Request) -> dict[str, object]:
    rate_limiter.check(f"login:{client_ip(request)}", limit=5)
    user = repository.state.users.get(payload.user)
    if user is None or user.password != payload.password:
        raise ApiException(401, "Usuário ou senha inválidos")
    return {"token": create_access_token(user.cpf), "usuario": user_response(user)}
