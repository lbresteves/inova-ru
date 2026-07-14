# Sevidor Simulado (Mockoon) 

Antes de iniciar o Expo, é preciso definir a variavel de ambiente `EXPO_PUBLIC_API_URL`, usando .env ou export

## Login

**Endpoint:** `POST /usuarios/login`

```bash
curl -X POST http://localhost:3000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"user": "12306767", "password": "password123"}'
```

## Refeições

**Endpoint:** `GET /creditos/refeicoes`

```bash
curl http://localhost:3000/creditos/refeicoes
```

## Recargas

**Endpoint:** `GET /creditos/recargas`

```bash
curl http://localhost:3000/creditos/recargas
```

## Saldo

**Endpoint:** `GET /creditos/saldo`

```bash
curl http://localhost:3000/creditos/saldo \
  -H "Authorization: Bearer <token-do-login>"
```

## Criar pagamento

**Endpoint:** `POST /creditos/pagamento`

```bash
curl -X POST http://localhost:3000/creditos/pagamento \
  -H "Content-Type: application/json" \
  -d '{"valor": 50.00}'
```

## Status sequencial do pagamento

**Endpoint:** `GET /creditos/pagamento/:paymentId/status`

```bash
curl http://localhost:3000/creditos/pagamento/123456789/status
```

No endpoint de pagamento, os status foram colocados de forma sequencial, a primeira requisição vai ser aprovada a segundo rejeitada, a terceira cancelada e a quarta expirada
