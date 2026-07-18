from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, Field


class CreatePaymentRequest(BaseModel):
    valor: Decimal = Field(gt=Decimal("0"))


class ConsumerTypeResponse(BaseModel):
    codigo: str
    descricao: str


class CostCenterResponse(BaseModel):
    tipo: str
    descricao: str


class ConsumerResponse(BaseModel):
    nome: str
    tipo_consumidor: ConsumerTypeResponse
    centro_custo: CostCenterResponse
    situacao: str


class BalanceResponse(BaseModel):
    credito_disponivel: float
    limite_recarga: float


class CreditAccountResponse(BaseModel):
    consumidor: ConsumerResponse
    saldo: BalanceResponse


class CreatedPaymentResponse(BaseModel):
    payment_id: int
    status: str
    status_detail: str | None
    qr_code: str
    qr_code_base64: str
    ticket_url: str
    expiration: str


class PaymentStatusResponse(BaseModel):
    payment_id: int
    status: str
    status_detail: str | None
    creditado: bool


class PaginationResponse(BaseModel):
    total: int
    currentPage: int
    perPage: int
    lastPage: int


class RechargeItemResponse(BaseModel):
    id: int
    valor: float
    metodo: str
    status: str
    data_hora: str


class RechargeHistoryResponse(BaseModel):
    data: list[RechargeItemResponse]
    pagination: PaginationResponse


class BranchResponse(BaseModel):
    codigo: str
    nome: str


class MealItemResponse(BaseModel):
    data_hora: str
    filial: BranchResponse
    quantidade: int
    valor_total: float
    gratuidade: bool
    tipo_consumidor: str


class MealHistoryResponse(BaseModel):
    data: list[MealItemResponse]
    pagination: PaginationResponse
