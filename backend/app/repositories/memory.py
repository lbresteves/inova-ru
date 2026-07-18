from __future__ import annotations

from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP

from app.core.clock import now_utc
from app.domain.models import (
    ConsumerSituation,
    ConsumerType,
    CostCenter,
    DemoState,
    MealHistoryItem,
    Payment,
    PaymentStatus,
    RechargeHistoryItem,
    User,
)

TINY_QR_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="


def cents(value: Decimal | str | int | float) -> int:
    decimal = Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return int(decimal * 100)


def money(value_cents: int) -> float:
    return float(Decimal(value_cents) / Decimal(100))


class MemoryRepository:
    def __init__(self) -> None:
        self.state = DemoState()
        self.seed()

    def reset(self) -> None:
        self.state = DemoState()
        self.seed()

    def seed(self) -> None:
        self.state.users.clear()
        self.add_user(
            cpf="12345678901",
            password="senha_do_usuario",
            nome="JOÃO DA SILVA",
            email="joao@ufmg.br",
            situacao=ConsumerSituation.ACTIVE,
            balance_cents=cents("45.50"),
        )
        self.add_user(
            cpf="22222222222",
            password="senha_do_usuario",
            nome="MARIA COSTA",
            email="maria@ufmg.br",
            situacao=ConsumerSituation.BLOCKED,
            balance_cents=cents("12.00"),
        )
        self.add_user(
            cpf="33333333333",
            password="senha_do_usuario",
            nome="PAULO INATIVO",
            email="paulo@ufmg.br",
            situacao=ConsumerSituation.INACTIVE,
            balance_cents=cents("0.00"),
        )
        self.add_recharge("12345678901", cents("50.00"), "aprovado")
        self.add_meal("12345678901", "0003", "RU Setorial 1", 1, cents("2.40"), False)

    def add_user(
        self,
        cpf: str,
        password: str,
        nome: str,
        email: str,
        situacao: ConsumerSituation = ConsumerSituation.ACTIVE,
        balance_cents: int = 0,
        limit_cents: int = cents("500.00"),
        tipo_codigo: str = "01",
        tipo_descricao: str = "ESTUDANTE REGULAR",
        centro_tipo: str = "Graduação",
        centro_descricao: str = "CIÊNCIA DA COMPUTAÇÃO",
    ) -> User:
        user = User(
            cpf=cpf,
            password=password,
            nome=nome,
            email=email,
            is_aluno=1,
            is_colaborador=0,
            tipo_consumidor=ConsumerType(tipo_codigo, tipo_descricao),
            centro_custo=CostCenter(centro_tipo, centro_descricao),
            situacao=situacao,
            balance_cents=balance_cents,
            limit_cents=limit_cents,
        )
        self.state.users[cpf] = user
        return user

    def add_recharge(self, cpf: str, amount_cents: int, status: str, payment_id: int | None = None) -> RechargeHistoryItem:
        item = RechargeHistoryItem(
            id=self.state.next_recharge_id,
            owner_cpf=cpf,
            valor_cents=amount_cents,
            metodo="pix",
            status=status,
            data_hora=now_utc(),
            payment_id=payment_id,
        )
        self.state.next_recharge_id += 1
        self.state.recharges.insert(0, item)
        return item

    def add_meal(
        self,
        cpf: str,
        filial_codigo: str,
        filial_nome: str,
        quantidade: int,
        valor_total_cents: int,
        gratuidade: bool,
    ) -> MealHistoryItem:
        user = self.state.users[cpf]
        if not gratuidade:
            user.balance_cents = max(0, user.balance_cents - valor_total_cents)
        item = MealHistoryItem(
            id=self.state.next_meal_id,
            owner_cpf=cpf,
            data_hora=now_utc(),
            filial_codigo=filial_codigo,
            filial_nome=filial_nome,
            quantidade=quantidade,
            valor_total_cents=valor_total_cents,
            gratuidade=gratuidade,
            tipo_consumidor=user.tipo_consumidor.descricao,
        )
        self.state.next_meal_id += 1
        self.state.meals.insert(0, item)
        return item

    def create_payment(self, cpf: str, amount_cents: int) -> Payment:
        payment_id = self.state.next_payment_id
        self.state.next_payment_id += 1
        expiration = now_utc() + timedelta(minutes=5)
        payment = Payment(
            payment_id=payment_id,
            owner_cpf=cpf,
            amount_cents=amount_cents,
            status=PaymentStatus.PENDING,
            status_detail=None,
            qr_code=f"000201-demo-pix-{payment_id}",
            qr_code_base64=TINY_QR_BASE64,
            ticket_url=f"https://www.mercadopago.com.br/payments/{payment_id}/ticket",
            expiration=expiration,
            created_at=now_utc(),
        )
        self.state.payments[payment_id] = payment
        return payment

    def credit_payment(self, payment: Payment) -> None:
        if payment.creditado:
            return
        if payment.status != PaymentStatus.APPROVED:
            raise ValueError("Only approved payments can be credited.")
        user = self.state.users[payment.owner_cpf]
        user.balance_cents += payment.amount_cents
        payment.creditado = True
        payment.status_detail = payment.status_detail or "accredited"
        self.add_recharge(payment.owner_cpf, payment.amount_cents, "aprovado", payment.payment_id)


repository = MemoryRepository()
