from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def login(cpf: str = "12345678901") -> str:
    response = client.post(
        "/usuarios/login",
        json={"user": cpf, "password": "senha_do_usuario"},
    )
    assert response.status_code == 200, response.text
    return response.json()["token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_payment_is_not_credited_until_demo_credit() -> None:
    client.post("/demo/reset")
    token = login()

    before = client.get("/creditos/saldo", headers=auth_headers(token)).json()["saldo"]["credito_disponivel"]
    payment = client.post("/creditos/pagamento", json={"valor": 50.0}, headers=auth_headers(token))
    assert payment.status_code == 201, payment.text
    payment_id = payment.json()["payment_id"]

    after_create = client.get("/creditos/saldo", headers=auth_headers(token)).json()["saldo"]["credito_disponivel"]
    assert after_create == before

    client.post(f"/demo/payments/{payment_id}/approve")
    status = client.get(f"/creditos/pagamento/{payment_id}/status", headers=auth_headers(token)).json()
    assert status["status"] == "approved"
    assert status["creditado"] is False

    client.post(f"/demo/payments/{payment_id}/credit")
    status = client.get(f"/creditos/pagamento/{payment_id}/status", headers=auth_headers(token)).json()
    assert status["creditado"] is True

    after_credit = client.get("/creditos/saldo", headers=auth_headers(token)).json()["saldo"]["credito_disponivel"]
    assert after_credit == before + 50.0


def test_blocked_user_cannot_create_payment() -> None:
    client.post("/demo/reset")
    token = login("22222222222")
    response = client.post("/creditos/pagamento", json={"valor": 50.0}, headers=auth_headers(token))
    assert response.status_code == 422
    assert "message" in response.json()


def test_payment_ownership() -> None:
    client.post("/demo/reset")
    owner_token = login("12345678901")
    other_token = login("22222222222")
    payment_id = client.post(
        "/creditos/pagamento",
        json={"valor": 10.0},
        headers=auth_headers(owner_token),
    ).json()["payment_id"]

    response = client.get(f"/creditos/pagamento/{payment_id}/status", headers=auth_headers(other_token))
    assert response.status_code == 403
    assert "message" in response.json()
