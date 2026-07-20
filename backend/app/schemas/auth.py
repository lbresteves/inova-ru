from __future__ import annotations

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    user: str = Field(min_length=11, max_length=11, pattern=r"^\d{11}$")
    password: str = Field(min_length=1)


class LoginUserResponse(BaseModel):
    nome: str
    email: str
    isAluno: int
    isColaborador: int


class LoginResponse(BaseModel):
    token: str
    usuario: LoginUserResponse
