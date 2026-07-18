from __future__ import annotations

import base64
from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app.main import app

client = TestClient(app)


def reset() -> None:
    response = client.post("/demo/reset")
    assert response.status_code == 200, response.text


def login(cpf: str = "12345678901") -> str:
    response = client.post(
        "/usuarios/login",
        json={"user": cpf, "password": "senha_do_usuario"},
    )
    assert response.status_code == 200, response.text
    return response.json()["token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def create_payment(token: str, amount: float) -> dict[str, object]:
    response = client.post(
        "/creditos/pagamento",
        json={"valor": amount},
        headers=auth_headers(token),
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_payment_is_not_credited_until_demo_credit() -> None:
    reset()
    token = login()

    before = client.get(
        "/creditos/saldo", headers=auth_headers(token)
    ).json()["saldo"]["credito_disponivel"]
    payment_id = create_payment(token, 50.0)["payment_id"]

    after_create = client.get(
        "/creditos/saldo", headers=auth_headers(token)
    ).json()["saldo"]["credito_disponivel"]
    assert after_create == before

    client.post(f"/demo/payments/{payment_id}/approve")
    status = client.get(
        f"/creditos/pagamento/{payment_id}/status",
        headers=auth_headers(token),
    ).json()
    assert status["status"] == "approved"
    assert status["creditado"] is False

    client.post(f"/demo/payments/{payment_id}/credit")
    status = client.get(
        f"/creditos/pagamento/{payment_id}/status",
        headers=auth_headers(token),
    ).json()
    assert status["creditado"] is True

    after_credit = client.get(
        "/creditos/saldo", headers=auth_headers(token)
    ).json()["saldo"]["credito_disponivel"]
    assert after_credit == before + 50.0


def test_recharge_limit_is_per_payment_not_final_balance() -> None:
    reset()
    client.post(
        "/demo/users/12345678901/balance-adjustments",
        json={"valor": 404.5},
    )
    token = login()

    payment_id = create_payment(token, 500.0)["payment_id"]
    client.post(f"/demo/payments/{payment_id}/approve")
    client.post(f"/demo/payments/{payment_id}/credit")

    balance = client.get(
        "/creditos/saldo", headers=auth_headers(token)
    ).json()["saldo"]
    assert balance["credito_disponivel"] == 947.6
    assert balance["limite_recarga"] == 500.0


def test_recharge_boundaries_and_individual_limit() -> None:
    reset()
    token = login()

    below = client.post(
        "/creditos/pagamento",
        json={"valor": 4.99},
        headers=auth_headers(token),
    )
    assert below.status_code == 422

    assert create_payment(token, 5.0)["status"] == "pending"
    assert create_payment(token, 500.0)["status"] == "pending"

    above = client.post(
        "/creditos/pagamento",
        json={"valor": 500.01},
        headers=auth_headers(token),
    )
    assert above.status_code == 422

    created = client.post(
        "/demo/users",
        json={
            "cpf": "44444444444",
            "nome": "LIMITE MENOR",
            "email": "limite@ufmg.br",
            "limite_recarga": 300,
        },
    )
    assert created.status_code == 201
    limited_token = login("44444444444")
    assert create_payment(limited_token, 300.0)["status"] == "pending"
    denied = client.post(
        "/creditos/pagamento",
        json={"valor": 300.01},
        headers=auth_headers(limited_token),
    )
    assert denied.status_code == 422


def test_generated_qr_is_real_png_for_copy_paste_payload() -> None:
    reset()
    payment = create_payment(login(), 25.0)
    raw = base64.b64decode(payment["qr_code_base64"])
    image = Image.open(BytesIO(raw))

    assert image.format == "PNG"
    assert image.width >= 200
    assert image.height >= 200
    assert payment["qr_code"].startswith("INOVARU-DEMO-PIX|")
    assert image.convert("L").getextrema() == (0, 255)


def test_blocked_and_inactive_consumer_rules() -> None:
    reset()
    blocked_token = login("22222222222")
    balance = client.get("/creditos/saldo", headers=auth_headers(blocked_token))
    assert balance.status_code == 200
    payment = client.post(
        "/creditos/pagamento",
        json={"valor": 50.0},
        headers=auth_headers(blocked_token),
    )
    assert payment.status_code == 422

    inactive_token = login("33333333333")
    for path in ("/creditos/saldo", "/creditos/recargas", "/creditos/refeicoes"):
        response = client.get(path, headers=auth_headers(inactive_token))
        assert response.status_code == 404
        assert "message" in response.json()


def test_payment_ownership() -> None:
    reset()
    owner_token = login("12345678901")
    other_token = login("22222222222")
    payment_id = create_payment(owner_token, 10.0)["payment_id"]

    response = client.get(
        f"/creditos/pagamento/{payment_id}/status",
        headers=auth_headers(other_token),
    )
    assert response.status_code == 403
    assert "message" in response.json()


def test_credit_is_idempotent_and_history_is_not_duplicated() -> None:
    reset()
    token = login()
    payment_id = create_payment(token, 50.0)["payment_id"]
    client.post(f"/demo/payments/{payment_id}/approve")

    first = client.post(f"/demo/payments/{payment_id}/credit")
    second = client.post(f"/demo/payments/{payment_id}/credit")
    assert first.status_code == 200
    assert second.status_code == 200

    history = client.get(
        "/creditos/recargas", headers=auth_headers(token)
    ).json()["data"]
    matching = [item for item in history if item["valor"] == 50.0]
    assert len(matching) == 2  # one seeded item and one payment item


def test_session_invalidation_by_cpf() -> None:
    reset()
    old_token = login()
    invalidated = client.post("/demo/users/12345678901/sessions/invalidate")
    assert invalidated.status_code == 200
    assert invalidated.json()["invalidated"] == 1

    denied = client.get("/creditos/saldo", headers=auth_headers(old_token))
    assert denied.status_code == 401

    new_token = login()
    allowed = client.get("/creditos/saldo", headers=auth_headers(new_token))
    assert allowed.status_code == 200


def test_seed_is_deterministic() -> None:
    reset()
    first = client.post("/demo/seed")
    assert first.status_code == 200
    token = login()
    first_recharges = client.get(
        "/creditos/recargas", headers=auth_headers(token)
    ).json()
    first_meals = client.get(
        "/creditos/refeicoes", headers=auth_headers(token)
    ).json()

    client.post("/demo/seed")
    token = login()
    second_recharges = client.get(
        "/creditos/recargas", headers=auth_headers(token)
    ).json()
    second_meals = client.get(
        "/creditos/refeicoes", headers=auth_headers(token)
    ).json()

    assert first_recharges["pagination"]["total"] == 1
    assert second_recharges["pagination"]["total"] == 1
    assert first_meals["pagination"]["total"] == 1
    assert second_meals["pagination"]["total"] == 1


def test_history_validation_and_filtering() -> None:
    reset()
    token = login()

    invalid_range = client.get(
        "/creditos/recargas?dataInicio=2026-07-10&dataFim=2026-07-01",
        headers=auth_headers(token),
    )
    assert invalid_range.status_code == 422

    invalid_page_size = client.get(
        "/creditos/recargas?perPage=101",
        headers=auth_headers(token),
    )
    assert invalid_page_size.status_code == 422

    invalid_branch = client.get(
        "/creditos/refeicoes?filial=9999",
        headers=auth_headers(token),
    )
    assert invalid_branch.status_code == 422

    branch = client.get(
        "/creditos/refeicoes?filial=0003",
        headers=auth_headers(token),
    )
    assert branch.status_code == 200
    assert all(item["filial"]["codigo"] == "0003" for item in branch.json()["data"])


def test_all_framework_errors_use_message_envelope() -> None:
    reset()
    unknown = client.get("/route-that-does-not-exist")
    assert unknown.status_code == 404
    assert set(unknown.json()) == {"message"}

    invalid_method = client.put("/health")
    assert invalid_method.status_code == 405
    assert set(invalid_method.json()) == {"message"}

    invalid_payload = client.post("/usuarios/login", json={"user": "bad"})
    assert invalid_payload.status_code == 422
    assert set(invalid_payload.json()) == {"message"}
