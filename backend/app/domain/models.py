from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum


class ConsumerSituation(str, Enum):
    ACTIVE = "A"
    INACTIVE = "I"
    BLOCKED = "B"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


@dataclass
class ConsumerType:
    codigo: str
    descricao: str


@dataclass
class CostCenter:
    tipo: str
    descricao: str


@dataclass
class User:
    cpf: str
    password: str
    nome: str
    email: str
    is_aluno: int
    is_colaborador: int
    tipo_consumidor: ConsumerType
    centro_custo: CostCenter
    situacao: ConsumerSituation
    balance_cents: int
    limit_cents: int


@dataclass
class Session:
    jti: str
    cpf: str
    expires_at: datetime
    invalidated: bool = False


@dataclass
class Payment:
    payment_id: int
    owner_cpf: str
    amount_cents: int
    status: PaymentStatus
    status_detail: str | None
    qr_code: str
    qr_code_base64: str
    ticket_url: str
    expiration: datetime
    created_at: datetime
    creditado: bool = False


@dataclass
class RechargeHistoryItem:
    id: int
    owner_cpf: str
    valor_cents: int
    metodo: str
    status: str
    data_hora: datetime
    payment_id: int | None = None


@dataclass
class MealHistoryItem:
    id: int
    owner_cpf: str
    data_hora: datetime
    filial_codigo: str
    filial_nome: str
    quantidade: int
    valor_total_cents: int
    gratuidade: bool
    tipo_consumidor: str


@dataclass
class DemoState:
    users: dict[str, User] = field(default_factory=dict)
    payments: dict[int, Payment] = field(default_factory=dict)
    recharges: list[RechargeHistoryItem] = field(default_factory=list)
    meals: list[MealHistoryItem] = field(default_factory=list)
    invalidated_jtis: set[str] = field(default_factory=set)
    next_payment_id: int = 123456789
    next_recharge_id: int = 1
    next_meal_id: int = 1
