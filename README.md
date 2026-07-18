<div align="center">
  <img width="104" height="104" alt="InovaRU App Icon" src="https://github.com/lbresteves/inova-ru/blob/main/assets/images/logo.png" />

  # InovaRU

  **Recarga e consulta de créditos dos Restaurantes Universitários da UFMG**

  <p>Aplicativo mobile desenvolvido para o Hackathon InovaRU - DACompSI/UFMG, DCC/UFMG e FUMP.</p>
</div>

---

## Sobre o projeto

O InovaRU é um aplicativo mobile criado para o Hackathon InovaRU UFMG. A proposta é reduzir filas nos Restaurantes Universitários da UFMG, permitindo que estudantes consultem saldo, façam recargas de créditos pelo próprio celular e se organizem para recarregar com antecedência.

O projeto foi pensado para induzir o comportamento de recarga antecipada e reduzir problemas recorrentes na fila, como espera excessiva, instabilidade de conexão no local e pagamentos feitos apenas no momento da refeição. Para isso, o app inclui notificações personalizáveis, configuradas por cada usuário de acordo com sua necessidade.

Este repositório contém o frontend mobile em Expo/React Native e uma API demo local em FastAPI. A API demo substitui o uso anterior do Mockoon e simula o contrato da API FUMP durante o desenvolvimento e a demonstração. Quando a API oficial da FUMP estiver disponível, o app deve apontar para a URL oficial mantendo o mesmo contrato de autenticação, saldo, pagamentos e históricos.

## Contexto do Hackathon

O Hackathon InovaRU faz parte de uma atividade de extensão e desenvolvimento tecnológico da UFMG, apoiada pelo Edital de Apoio a Iniciativas e Projetos do 1º Semestre de 2026 (DACompSI/UFMG), em parceria com o Departamento de Ciência da Computação (DCC/UFMG) e a Fundação Universitária Mendes Pimentel (FUMP).

Segundo o edital, o objetivo geral é desenvolver um protótipo de aplicativo móvel integrado a um sistema de recarga e débito de créditos para uso exclusivo nos Restaurantes Universitários da UFMG. O impacto esperado é combater longas filas, otimizar o tempo dos estudantes e modernizar o acesso às refeições utilizando o registro acadêmico.

A solução consome uma API RESTful compatível com o contrato da FUMP, com fluxo de autenticação, consulta de saldo, geração de pagamentos via PIX, polling do status do pagamento e consulta de históricos. O backend institucional previsto é Node.js com Express.js e banco SQL Server; neste repositório, usamos uma API demo em FastAPI para viabilizar o desenvolvimento local enquanto a API institucional não está disponível.

## Funcionalidades

- Login de usuário por CPF e senha
- Consulta de saldo de créditos
- Consulta dos dados do consumidor e situação cadastral
- Recarga de saldo via PIX
- Geração de QR Code e código PIX copia-e-cola
- Acompanhamento de status do pagamento por polling
- Confirmação de crédito somente após retorno da API
- Histórico de recargas com paginação
- Histórico de refeições com paginação e filtros
- Cardápio dos Restaurantes Universitários com dados locais provisórios
- Configuração de notificações personalizáveis
- Monitoramento de saldo baixo
- Cache local, sessão segura e cache de requisições para melhorar a experiência do usuário

## Tecnologias

**Aplicativo mobile**
- Expo 54
- React Native 0.81
- TypeScript
- Expo Router

**Dados e estado**
- React Query (`@tanstack/react-query`) - cache, revalidação, polling e paginação de dados remotos
- Zustand - estado global da sessão
- AsyncStorage / Expo Secure Store - persistência local e sessão segura

**UI e estilização**
- Emotion Native
- Expo Image, Expo Blur, Expo Symbols

**Notificações e tarefas em segundo plano**
- Expo Notifications
- Expo Background Task / Expo Task Manager

**API demo local**
- FastAPI
- Uvicorn
- PyJWT
- Pytest

## Estrutura do projeto

```text
app/                  Rotas do Expo Router
src/_app/             Bootstrap, providers e layout raiz do app
src/features/         Features da aplicação
src/shared/           Componentes, tema, API, storage e utilitários compartilhados
backend/              API demo local em FastAPI
docs/contract-fixtures/ Exemplos do contrato esperado da API
docs/current-manual-flow.md Fluxo manual de teste do app
```

## Requisitos

- Node.js instalado
- npm instalado
- Python 3.11+ instalado
- Android Studio/emulador Android ou dispositivo físico Android
- Expo Go ou dev client do Expo no dispositivo/emulador

> Para testar recursos como tarefas em segundo plano e notificações de forma mais próxima ao ambiente real, prefira usar um dev client. Para testar o fluxo principal de login, saldo, recarga e históricos, Expo Go é suficiente na maior parte dos casos.

## Instalação

Instale as dependências do app:

```bash
npm install
```

Crie o ambiente Python da API demo:

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -e backend
```

No Windows PowerShell:

```powershell
python -m venv backend/.venv
.\backend\.venv\Scripts\Activate.ps1
pip install -e backend
```

## Rodando com a API demo FastAPI

A API demo local substitui o mock antigo. Ela implementa as rotas oficiais consumidas pelo app e também expõe rotas `/demo` para preparar cenários de apresentação, como criar usuários, alterar saldo, registrar refeições, aprovar pagamentos, rejeitar pagamentos e invalidar sessões.

Abra um terminal e rode a API demo:

```bash
npm run demo-api
```

A API ficará disponível em:

```text
http://localhost:3000
```

Verifique se a API está ativa:

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "ok": true,
  "demo": true
}
```

Em outro terminal, inicie o Expo apontando para a API demo.

### Android emulador

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 npx expo start --clear
```

### Celular físico com Expo Go

O celular não consegue acessar `localhost` da sua máquina. Use o IP local do computador que está rodando a API.

No Linux/macOS:

```bash
EXPO_PUBLIC_API_URL=http://<host-ip>:3000 npx expo start --clear --lan
```

No Windows PowerShell, substitua o IP pelo endereço IPv4 da sua máquina:

```powershell
$env:EXPO_PUBLIC_API_URL="http://<host-ip>:3000"
npx expo start --clear --lan
```

O celular e o computador precisam estar na mesma rede.

### iOS simulator ou web

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npx expo start --clear
```

### Usando `.env` local

Como alternativa, crie um arquivo `.env.development.local` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://<host-ip>:3000
```

Depois, inicie o Expo:

```bash
npx expo start --clear
```

Arquivos `.env*.local` estão no `.gitignore`, então essa configuração fica apenas na sua máquina.

## Usuários de demonstração

Depois de iniciar ou resetar a API demo, estes usuários ficam disponíveis:

| Situação | CPF | Senha | Comportamento esperado |
|---|---|---|---|
| Ativo | `12345678901` | `passkey123` | Pode consultar saldo, recarregar e visualizar históricos |
| Bloqueado | `22222222222` | `passkey123` | Pode visualizar informações, mas recarga fica indisponível |
| Inativo | `33333333333` | `passkey123` | Operações retornam indisponibilidade/consumidor não encontrado |

Para resetar os dados da API demo:

```bash
curl -X POST http://localhost:3000/demo/reset
```

## API

A URL base usada pelo app vem da variável:

```text
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Endpoints oficiais consumidos pelo app

- `POST /usuarios/login`
- `GET /creditos/saldo`
- `POST /creditos/pagamento`
- `GET /creditos/pagamento/:paymentId/status`
- `GET /creditos/recargas`
- `GET /creditos/refeicoes`

### Rotas demo para desenvolvimento

As rotas `/demo` existem apenas para desenvolvimento local e demonstração. O aplicativo mobile não deve depender delas no fluxo normal.

Exemplos úteis:

- `POST /demo/reset`
- `POST /demo/seed`
- `POST /demo/users`
- `PATCH /demo/users/:cpf/situation`
- `POST /demo/users/:cpf/balance-adjustments`
- `POST /demo/users/:cpf/meals`
- `POST /demo/users/:cpf/sessions/invalidate`
- `POST /demo/payments/:paymentId/approve`
- `POST /demo/payments/:paymentId/credit`
- `POST /demo/payments/:paymentId/reject`
- `POST /demo/payments/:paymentId/cancel`
- `POST /demo/payments/:paymentId/expire`

## Testando o fluxo de recarga por terminal

```bash
BASE=http://localhost:3000

curl -s -X POST "$BASE/demo/reset"

TOKEN=$(curl -s -X POST "$BASE/usuarios/login" \
  -H "Content-Type: application/json" \
  -d '{"user":"12345678901","password":"passkey123"}' \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["token"])')

PAYMENT_RESPONSE=$(curl -s -X POST "$BASE/creditos/pagamento" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"valor":"10.00"}')

PAYMENT_ID=$(echo "$PAYMENT_RESPONSE" \
  | python3 -c 'import sys,json; print(json.load(sys.stdin)["payment_id"])')

curl -s "$BASE/creditos/pagamento/$PAYMENT_ID/status" \
  -H "Authorization: Bearer $TOKEN"

curl -s -X POST "$BASE/demo/payments/$PAYMENT_ID/approve"
curl -s -X POST "$BASE/demo/payments/$PAYMENT_ID/credit"

curl -s "$BASE/creditos/recargas?page=1&perPage=10" \
  -H "Authorization: Bearer $TOKEN"

curl -s "$BASE/creditos/saldo" \
  -H "Authorization: Bearer $TOKEN"
```

O saldo só deve ser alterado depois que o pagamento for aprovado e creditado pela API demo. O app não soma saldo localmente.

## Cache e persistência

O app utiliza cache para melhorar a experiência e reduzir chamadas desnecessárias:

- React Query mantém dados de saldo, pagamentos, status de pagamento e históricos.
- A sessão autenticada é persistida em armazenamento seguro.
- O pagamento ativo é persistido para permitir recuperação após reload ou fechamento do app.
- Após pagamento aprovado e creditado, o app invalida os dados de saldo e histórico de recargas para buscar o estado real na API.
- Configurações de notificação e monitoramento de saldo usam persistência local.

## Scripts

```bash
npm run start          # inicia o Expo
npm run android        # inicia o Expo para Android
npm run ios            # inicia o Expo para iOS
npm run web            # inicia o Expo para web
npm run lint           # executa o lint do projeto
npm run typecheck      # executa checagem TypeScript
npm run demo-api       # inicia a API demo FastAPI na porta 3000
npm run demo-api:test  # executa testes da API demo
```

## Observações de desenvolvimento

- O Cardápio ainda usa conteúdo local/hardcoded. A intenção é que esse conteúdo seja fornecido futuramente pela API demo ou por outra fonte definida pelo projeto.
- As rotas `/demo` devem ser usadas apenas para preparar cenários de teste e apresentação.
- A API demo é stateful em memória. Ao reiniciar o processo ou chamar `/demo/reset`, os dados voltam ao estado inicial.
- Em produção, o app deve apontar para a API oficial da FUMP e usar HTTPS.

## Licença

Este projeto está licenciado sob os termos da [MIT License](./LICENSE).

## Colaboradores

- [Letícia Braga](https://github.com/lbresteves)
- [Gabriel](https://github.com/GabrielRCMendonca)
- [Saulo](https://github.com/jlzht)
- [João](https://github.com/JFCalvao)
