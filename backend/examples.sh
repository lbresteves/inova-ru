#!/bin/bash

# Reseta completamente o estado da API (usuários, pagamentos, histórico)
curl -X POST "http://localhost:3000/demo/reset"

# Popular dados iniciais (idempotente)
curl -X POST "http://localhost:3000/demo/seed"

# Listar usuários da demo
curl "http://localhost:3000/demo/users"

# Criar um novo usuário de teste
curl -X POST "http://localhost:3000/demo/users" \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "44444444444",
    "password": "senha_do_usuario",
    "nome": "USUÁRIO TESTE",
    "email": "teste@ufmg.br",
    "situacao": "A",
    "saldo": 100.00,
    "limite_recarga": 300.00
  }'

# Alterar situação do usuário (A=ativo, B=bloqueado, I=inativo)
curl -X PATCH "http://localhost:3000/demo/users/12345678901/situation" \
  -H "Content-Type: application/json" \
  -d '{"situacao":"B"}'

# Ajustar saldo manualmente (valor positivo ou negativo)
curl -X POST "http://localhost:3000/demo/users/12345678901/balance-adjustments" \
  -H "Content-Type: application/json" \
  -d '{"valor":50.00,"reason":"teste"}'

# Invalidar TODAS as sessões do usuário (token deixa de funcionar)
curl -X POST "http://localhost:3000/demo/users/12345678901/sessions/invalidate"

# Fazer login e pegar token manualmente
curl -X POST "http://localhost:3000/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{
    "user": "12345678901",
    "password": "senha_do_usuario"
  }'

# Copie o token retornado e cole abaixo
TOKEN="COLE_O_TOKEN_AQUI"

# Consultar saldo do usuário autenticado
curl "http://localhost:3000/creditos/saldo" \
  -H "Authorization: Bearer $TOKEN"

# Criar pagamento (recarga)
curl -X POST "http://localhost:3000/creditos/pagamento" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"valor":50.00}'

# Após criar, copie o payment_id retornado
PAYMENT_ID=123456789

# Consultar status do pagamento
curl "http://localhost:3000/creditos/pagamento/$PAYMENT_ID/status" \
  -H "Authorization: Bearer $TOKEN"

# Aprovar pagamento (ainda não credita saldo)
curl -X POST "http://localhost:3000/demo/payments/$PAYMENT_ID/approve"

# Creditar pagamento (saldo é atualizado)
curl -X POST "http://localhost:3000/demo/payments/$PAYMENT_ID/credit"

# Rejeitar pagamento
curl -X POST "http://localhost:3000/demo/payments/$PAYMENT_ID/reject"

# Cancelar pagamento
curl -X POST "http://localhost:3000/demo/payments/$PAYMENT_ID/cancel"

# Expirar pagamento
curl -X POST "http://localhost:3000/demo/payments/$PAYMENT_ID/expire"


# Listar recargas (paginado)
curl "http://localhost:3000/creditos/recargas?page=1&perPage=20" \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por período
curl "http://localhost:3000/creditos/recargas?dataInicio=2026-07-01&dataFim=2026-07-31" \
  -H "Authorization: Bearer $TOKEN"

# Criar refeição paga (desconta saldo)
curl -X POST "http://localhost:3000/demo/users/12345678901/meals" \
  -H "Content-Type: application/json" \
  -d '{
    "filial": "0001",
    "quantidade": 1,
    "valor_total": 2.40,
    "gratuidade": false
  }'

# Criar refeição gratuita (não desconta saldo)
curl -X POST "http://localhost:3000/demo/users/12345678901/meals" \
  -H "Content-Type: application/json" \
  -d '{
    "filial": "0002",
    "quantidade": 1,
    "valor_total": 0,
    "gratuidade": true
  }'

# Listar histórico de refeições
curl "http://localhost:3000/creditos/refeicoes?page=1&perPage=20" \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por restaurante
curl "http://localhost:3000/creditos/refeicoes?filial=0001" \
  -H "Authorization: Bearer $TOKEN"
