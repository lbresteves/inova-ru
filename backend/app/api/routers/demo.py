from __future__ import annotations

from app.core.errors import ApiException
from app.core.rate_limit import rate_limiter
from app.domain.models import ConsumerSituation, Payment, PaymentStatus
from app.repositories.memory import RESTAURANTS, cents, money, repository
from app.schemas.demo import (
    DemoBalanceAdjustment,
    DemoMealCreate,
    DemoSituationPatch,
    DemoUserCreate,
)
from fastapi import APIRouter

router = APIRouter(prefix="/demo", tags=["demo"])


def _situation(value: str) -> ConsumerSituation:
    try:
        return ConsumerSituation(value.upper())
    except ValueError as exc:
        raise ApiException(422, "Situação do consumidor inválida.") from exc


def _user_payload(cpf: str) -> dict[str, object]:
    user = repository.state.users.get(cpf)
    if user is None:
        raise ApiException(404, "Consumidor não encontrado.")
    return {
        "cpf": user.cpf,
        "nome": user.nome,
        "email": user.email,
        "situacao": user.situacao.value,
        "saldo": money(user.balance_cents),
        "limite_recarga": money(user.limit_cents),
    }


def _reset_demo_state() -> None:
    repository.reset()
    rate_limiter.reset()


@router.post("/reset")
def reset() -> dict[str, object]:
    _reset_demo_state()
    return {"ok": True}


@router.post("/seed")
def seed() -> dict[str, object]:
    _reset_demo_state()
    return {"ok": True, "users": list(repository.state.users)}


@router.get("/users")
def list_users() -> dict[str, object]:
    return {"data": [_user_payload(cpf) for cpf in repository.state.users]}


@router.post("/users", status_code=201)
def create_user(payload: DemoUserCreate) -> dict[str, object]:
    if payload.cpf in repository.state.users:
        raise ApiException(422, "CPF já cadastrado.")
    repository.add_user(
        cpf=payload.cpf,
        password=payload.password,
        nome=payload.nome,
        email=payload.email,
        situacao=_situation(payload.situacao),
        balance_cents=cents(payload.saldo),
        limit_cents=cents(payload.limite_recarga),
    )
    return _user_payload(payload.cpf)


@router.get("/users/{cpf}")
def get_user(cpf: str) -> dict[str, object]:
    return _user_payload(cpf)


@router.patch("/users/{cpf}/situation")
def patch_situation(cpf: str, payload: DemoSituationPatch) -> dict[str, object]:
    user = repository.state.users.get(cpf)
    if user is None:
        raise ApiException(404, "Consumidor não encontrado.")
    user.situacao = _situation(payload.situacao)
    return _user_payload(cpf)


@router.post("/users/{cpf}/balance-adjustments")
def adjust_balance(cpf: str, payload: DemoBalanceAdjustment) -> dict[str, object]:
    user = repository.state.users.get(cpf)
    if user is None:
        raise ApiException(404, "Consumidor não encontrado.")
    adjusted = user.balance_cents + cents(payload.valor)
    if adjusted < 0:
        raise ApiException(422, "O ajuste deixaria o saldo negativo.")
    user.balance_cents = adjusted
    return _user_payload(cpf)


@router.post("/users/{cpf}/meals", status_code=201)
def create_meal(cpf: str, payload: DemoMealCreate) -> dict[str, object]:
    user = repository.state.users.get(cpf)
    if user is None or user.situacao == ConsumerSituation.INACTIVE:
        raise ApiException(404, "Consumidor não encontrado ou inativo.")
    if user.situacao == ConsumerSituation.BLOCKED:
        raise ApiException(422, "Consumo indisponível para consumidor bloqueado.")
    if payload.filial not in RESTAURANTS:
        raise ApiException(422, "Código de Restaurante Universitário inválido.")

    value_cents = cents(payload.valor_total)
    if not payload.gratuidade and value_cents > user.balance_cents:
        raise ApiException(422, "Saldo insuficiente para registrar a refeição.")

    item = repository.add_meal(
        cpf,
        payload.filial,
        RESTAURANTS[payload.filial],
        payload.quantidade,
        value_cents,
        payload.gratuidade,
    )
    return {"id": item.id, "saldo": money(user.balance_cents)}


@router.post("/users/{cpf}/sessions/invalidate")
def invalidate_sessions(cpf: str) -> dict[str, object]:
    if cpf not in repository.state.users:
        raise ApiException(404, "Consumidor não encontrado.")
    issued_jtis = repository.state.issued_jtis_by_cpf.get(cpf, set())
    repository.state.invalidated_jtis.update(issued_jtis)
    return {"ok": True, "invalidated": len(issued_jtis)}


@router.post("/sessions/{jti}/invalidate")
def invalidate_session(jti: str) -> dict[str, object]:
    repository.state.invalidated_jtis.add(jti)
    return {"ok": True}


def _payment(payment_id: int) -> Payment:
    payment = repository.state.payments.get(payment_id)
    if payment is None:
        raise ApiException(404, "Pagamento não encontrado.")
    return payment


def _payment_payload(payment_id: int) -> dict[str, object]:
    payment = _payment(payment_id)
    return {
        "payment_id": payment.payment_id,
        "owner_cpf": payment.owner_cpf,
        "amount": money(payment.amount_cents),
        "status": payment.status.value,
        "status_detail": payment.status_detail,
        "creditado": payment.creditado,
    }


@router.post("/payments/{payment_id}/approve")
def approve_payment(payment_id: int) -> dict[str, object]:
    payment = _payment(payment_id)
    if payment.status == PaymentStatus.APPROVED:
        return _payment_payload(payment_id)
    if payment.status != PaymentStatus.PENDING:
        raise ApiException(422, "Apenas pagamentos pendentes podem ser aprovados.")
    payment.status = PaymentStatus.APPROVED
    payment.status_detail = "accredited"
    return _payment_payload(payment_id)


@router.post("/payments/{payment_id}/credit")
def credit_payment(payment_id: int) -> dict[str, object]:
    payment = _payment(payment_id)
    if payment.status != PaymentStatus.APPROVED:
        raise ApiException(422, "Apenas pagamentos aprovados podem ser creditados.")
    repository.credit_payment(payment)
    return _payment_payload(payment_id)


@router.post("/payments/{payment_id}/reject")
def reject_payment(payment_id: int) -> dict[str, object]:
    return _terminal(payment_id, PaymentStatus.REJECTED, "rejected_by_bank")


@router.post("/payments/{payment_id}/cancel")
def cancel_payment(payment_id: int) -> dict[str, object]:
    return _terminal(payment_id, PaymentStatus.CANCELLED, "cancelled_by_user")


@router.post("/payments/{payment_id}/expire")
def expire_payment(payment_id: int) -> dict[str, object]:
    return _terminal(payment_id, PaymentStatus.EXPIRED, "expired")


def _terminal(payment_id: int, status: PaymentStatus, detail: str) -> dict[str, object]:
    payment = _payment(payment_id)
    if payment.status == status:
        return _payment_payload(payment_id)
    if payment.status != PaymentStatus.PENDING:
        raise ApiException(422, "Apenas pagamentos pendentes podem mudar para este estado.")
    payment.status = status
    payment.status_detail = detail
    return _payment_payload(payment_id)
