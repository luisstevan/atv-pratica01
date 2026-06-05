# Projeto Gestão Financeira - Entrega

## Usuário de teste
- E-mail: `luis@iesb.com`
- Senha: `123456`
- Token retornado pela API: `demo-token-gestao-financeira`

## Como rodar o backend
```bash
cd praticas/gestao-financeira-api
npm install
cp .env.example .env
# ajuste o DATABASE_URL no .env com seu MySQL
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Health-check esperado:
```json
{ "ok": true, "name": "gestao-financeira-api" }
```

## Como rodar o frontend
```bash
cd praticas/gestao-financeira
npm install
cp .env.example .env
npm start
```

No emulador Android, pode usar `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`.
Em celular físico, troque para o IP do computador na mesma rede, por exemplo `http://192.168.0.10:3000`.

## Funcionalidades implementadas
- Login com validação na API (`POST /auth/login`).
- Mensagem de boas-vindas na tela principal.
- CRUD de categorias customizadas no backend e criação/exclusão pelo app.
- CRUD de transações no backend.
- Listagem de transações persistidas no banco.
- Edição e exclusão de transações por toque longo com modal.
- Filtro por mês/ano nas telas de lista e resumo.
- Resumo por categoria.
- Gráfico tipo pizza/donut na aba de resumo.
- API Client HTTP no frontend (`services/api.js`).
- `.env.example` no frontend e backend.
- Collection do Postman em `praticas/gestao-financeira-api/postman/collection.json`.

## Rotas principais
- `GET /`
- `POST /auth/login`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /transactions`
- `POST /transactions`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

## Observação
O backend bloqueia a exclusão de categorias padrão com a mensagem:
```json
{ "error": "Categorias padrão não podem ser excluídas" }
```
Validações inválidas retornam:
```json
{ "error": "Dados inválidos", "details": [] }
```
