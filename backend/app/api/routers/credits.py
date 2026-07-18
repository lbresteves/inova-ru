from __future__ import annotations

from datetime import date
from decimal import Decimal
from math import ceil

from app.api.dependencies import current_token_key, current_user
from app.core.clock import now_utc, to_brasilia, to_iso_brasilia
from app.core.errors import ApiException
from app.core.rate_limit import rate_limiter
from app.domain.models import ConsumerSituation, MealHistoryItem, Payment, PaymentStatus, RechargeHistoryItem, User
from app.repositories.memory import cents, money, repository
from app.schemas.credits import CreatePaymentRequest
from fastapi import APIRouter, Depends, Query

router = APIRouter(prefix="/creditos", tags=["credits"])


def _ensure_consultable(user: User) -> None:
    if user.situacao == ConsumerSituation.INACTIVE:
        raise ApiException(404, "Consumidor não encontrado ou inativo.")


def _consumer_response(user: User) -> dict[str, object]:
    return {
        "nome": user.nome,
        "tipo_consumidor": {
            "codigo": user.tipo_consumidor.codigo,
            "descricao": user.tipo_consumidor.descricao,
        },
        "centro_custo": {
            "tipo": user.centro_custo.tipo,
            "descricao": user.centro_custo.descricao,
        },
        "situacao": user.situacao.value,
    }


def _balance_response(user: User) -> dict[str, object]:
    return {
        "credito_disponivel": money(user.balance_cents),
        "limite_recarga": money(user.limit_cents),
    }


def _payment_response(payment: Payment, include_credit: bool = False) -> dict[str, object]:
    response: dict[str, object] = {
        "payment_id": payment.payment_id,
        "status": payment.status.value,
        "status_detail": payment.status_detail,
    }
    if include_credit:
        response["creditado"] = payment.creditado
    else:
        response.update(
            {
                "qr_code": payment.qr_code,
                "qr_code_base64": payment.qr_code_base64,
                "ticket_url": payment.ticket_url,
                "expiration": to_iso_brasilia(payment.expiration),
            }
        )
    return response


def _refresh_expiration(payment: Payment) -> None:
    if payment.status == PaymentStatus.PENDING and now_utc() >= payment.expiration:
        payment.status = PaymentStatus.EXPIRED
        payment.status_detail = "expired"


def _paginate(items: list[object], page: int, per_page: int) -> tuple[list[object], dict[str, int]]:
    page = max(page, 1)
    per_page = min(max(per_page, 1), 100)
    total = len(items)
    last_page = max(1, ceil(total / per_page))
    start = (page - 1) * per_page
    return items[start : start + per_page], {
        "total": total,
        "currentPage": page,
        "perPage": per_page,
        "lastPage": last_page,
    }


def _date_in_range(value, data_inicio: date | None, data_fim: date | None) -> bool:
    local_date = to_brasilia(value).date()
    if data_inicio and local_date < data_inicio:
        return False
    if data_fim and local_date > data_fim:
        return False
    return True


@router.get("/saldo")
def get_balance(
    user: User = Depends(current_user),
    token_key: str = Depends(current_token_key),
) -> dict[str, object]:
    rate_limiter.check(f"get:{token_key}", limit=60)
    _ensure_consultable(user)
    return {"consumidor": _consumer_response(user), "saldo": _balance_response(user)}


@router.post("/pagamento", status_code=201)
def create_payment(
    payload: CreatePaymentRequest,
    user: User = Depends(current_user),
    token_key: str = Depends(current_token_key),
) -> dict[str, object]:
    rate_limiter.check(f"payment:{token_key}", limit=10)
    _ensure_consultable(user)
    if user.situacao == ConsumerSituation.BLOCKED:
        raise ApiException(422, "Recarga indisponível para consumidor bloqueado.")
    amount = cents(payload.valor)
    if amount < cents("5.00") or amount > cents("500.00"):
        raise ApiException(422, "Valor fora do limite permitido. Mínimo: R$ 5,00, Máximo: R$ 500,00")
    if user.balance_cents + amount > user.limit_cents:
        raise ApiException(422, "Valor fora do limite permitido pelo saldo máximo do consumidor.")
    payment = repository.create_payment(user.cpf, amount)
    return _payment_response(payment)


@router.get("/pagamento/{payment_id}/status")
def get_payment_status(
    payment_id: int,
    user: User = Depends(current_user),
    token_key: str = Depends(current_token_key),
) -> dict[str, object]:
    rate_limiter.check(f"get:{token_key}", limit=60)
    payment = repository.state.payments.get(payment_id)
    if payment is None:
        raise ApiException(404, "Pagamento não encontrado.")
    if payment.owner_cpf != user.cpf:
        raise ApiException(403, "Sem permissão para o recurso.")
    _refresh_expiration(payment)
    return _payment_response(payment, include_credit=True)


@router.get("/recargas")
def recharge_history(
    page: int = Query(default=1, ge=1),
    perPage: int = Query(default=20, ge=1, le=100),
    dataInicio: date | None = None,
    dataFim: date | None = None,
    user: User = Depends(current_user),
    token_key: str = Depends(current_token_key),
) -> dict[str, object]:
    rate_limiter.check(f"get:{token_key}", limit=60)
    items = [
        item
        for item in repository.state.recharges
        if item.owner_cpf == user.cpf and _date_in_range(item.data_hora, dataInicio, dataFim)
    ]
    page_items, pagination = _paginate(items, page, perPage)
    return {
        "data": [_recharge_item_response(item) for item in page_items],
        "pagination": pagination,
    }


@router.get("/refeicoes")
def meal_history(
    page: int = Query(default=1, ge=1),
    perPage: int = Query(default=20, ge=1, le=100),
    dataInicio: date | None = None,
    dataFim: date | None = None,
    filial: str | None = None,
    user: User = Depends(current_user),
    token_key: str = Depends(current_token_key),
) -> dict[str, object]:
    rate_limiter.check(f"get:{token_key}", limit=60)
    items = [
        item
        for item in repository.state.meals
        if item.owner_cpf == user.cpf
        and _date_in_range(item.data_hora, dataInicio, dataFim)
        and (filial is None or item.filial_codigo == filial)
    ]
    page_items, pagination = _paginate(items, page, perPage)
    return {
        "data": [_meal_item_response(item) for item in page_items],
        "pagination": pagination,
    }


def _recharge_item_response(item: RechargeHistoryItem) -> dict[str, object]:
    return {
        "id": item.id,
        "valor": money(item.valor_cents),
        "metodo": item.metodo,
        "status": item.status,
        "data_hora": to_iso_brasilia(item.data_hora),
    }


def _meal_item_response(item: MealHistoryItem) -> dict[str, object]:
    return {
        "data_hora": to_iso_brasilia(item.data_hora),
        "filial": {"codigo": item.filial_codigo, "nome": item.filial_nome},
        "quantidade": item.quantidade,
        "valor_total": money(item.valor_total_cents),
        "gratuidade": item.gratuidade,
        "tipo_consumidor": item.tipo_consumidor,
    }
