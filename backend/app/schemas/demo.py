from __future__ import annotations

from decimal import Decimal
from pydantic import BaseModel, Field


class DemoUserCreate(BaseModel):
    cpf: str = Field(min_length=11, max_length=11, pattern=r"^\d{11}$")
    password: str = "senha_do_usuario"
    nome: str = Field(min_length=1)
    email: str = Field(min_length=3)
    situacao: str = "A"
    saldo: Decimal = Field(default=Decimal("0.00"), ge=Decimal("0.00"))
    limite_recarga: Decimal = Field(
        default=Decimal("500.00"),
        ge=Decimal("5.00"),
        le=Decimal("500.00"),
    )


class DemoSituationPatch(BaseModel):
    situacao: str


class DemoBalanceAdjustment(BaseModel):
    valor: Decimal
    reason: str | None = None


class DemoMealCreate(BaseModel):
    filial: str = Field(default="0003", pattern=r"^\d{4}$")
    filial_nome: str | None = None
    quantidade: int = Field(default=1, ge=1)
    valor_total: Decimal = Field(default=Decimal("2.40"), ge=Decimal("0.00"))
    gratuidade: bool = False
