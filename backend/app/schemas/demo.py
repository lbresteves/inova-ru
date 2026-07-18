from __future__ import annotations

from decimal import Decimal
from pydantic import BaseModel, Field


class DemoUserCreate(BaseModel):
    cpf: str = Field(min_length=11, max_length=11, pattern=r"^\d{11}$")
    password: str = "senha_do_usuario"
    nome: str
    email: str
    situacao: str = "A"
    saldo: Decimal = Decimal("0.00")
    limite_recarga: Decimal = Decimal("500.00")


class DemoSituationPatch(BaseModel):
    situacao: str


class DemoBalanceAdjustment(BaseModel):
    valor: Decimal
    reason: str | None = None


class DemoMealCreate(BaseModel):
    filial: str = "0003"
    filial_nome: str = "RU Setorial 1"
    quantidade: int = Field(default=1, ge=1)
    valor_total: Decimal = Decimal("2.40")
    gratuidade: bool = False
