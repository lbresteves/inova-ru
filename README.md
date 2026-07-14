# Créditos do RU - UFMG

## Instalando dependências 

Na raiz do projeto, execute:

```bash
npm ci
```

```bash
npm install
```

## Executar o projeto

Abra dois terminais na raiz do projeto.

### 1. Iniciar o Mockoon

```bash
npm run mock
```

### 2. Iniciar o Expo

```bash
EXPO_PUBLIC_API_URL=http://<ip>:3000 npx expo start --clear
```

Substitua `<ip>` pelo endereço IP do computador na rede local.

Exemplo:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.11:3000 npx expo start --clear
```

O celular e o computador devem estar conectados à mesma rede Wi-Fi.
