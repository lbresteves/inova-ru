### Login
**Endpoint:** `POST /usuarios/login`
```bash
curl -X POST http://localhost:3000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"user": "12306767", "password": "password123"}'

```

### Refeições

**Endpoint:** `GET /creditos/refeicoes`

```bash
curl -X GET http://localhost:3000/creditos/refeicoes

```

### Recargas

**Endpoint:** `GET /creditos/recargas`

```bash
curl -X GET http://localhost:3000/creditos/recargas

```

### Saldo

**Endpoint:** `GET /creditos/saldo`

```bash
curl -X GET http://localhost:3000/creditos/saldo \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMwNjc2NyIsIm5hbWUiOiJKT8ODTyBEQSBTSUxWQSIsImlhdCI6MTcxMjkwMDAwMCwiZXhwIjoxNzEyOTEwMDAwfQ.X_FakeSignature_8923hjd823y"

```

### Pagamento

**Endpoint:** `POST /creditos/pagamento`

```bash
curl -X POST http://localhost:3000/creditos/pagamento \
  -H "Content-Type: application/json" \
  -d '{"valor": 50.00}'

```

### Status do Pagamento

**Endpoint:** `GET /creditos/pagamento/:paymentId/status`

```bash
curl -X GET http://localhost:3000/creditos/pagamento/123456789/status

```

```
