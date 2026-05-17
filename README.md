# Pomodoro API

API REST para aplicação Pomodoro construída com **Express**, **Prisma** e **MySQL**.

---

## Pré-requisitos

- Node.js 18+
- MySQL rodando localmente na porta 3306

---

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/pomodoro_db"
PORT=3333
```

> **Atenção:** nunca suba o `.env` real para o repositório.

### 3. Criar o banco e rodar as migrations

```bash
npx prisma migrate dev --name init
```

### 4. Subir o servidor em modo desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`.

---

## Endpoints

| Método | Rota                        | Descrição                        |
|--------|-----------------------------|----------------------------------|
| GET    | /health                     | Verifica se a API está no ar     |
| GET    | /settings                   | Retorna as configurações         |
| PUT    | /settings                   | Atualiza as configurações        |
| GET    | /tasks                      | Lista todas as tasks             |
| POST   | /tasks                      | Cria uma nova task               |
| PATCH  | /tasks/:id/complete         | Marca a task como concluída      |
| PATCH  | /tasks/:id/interrupt        | Marca a task como interrompida   |
| DELETE | /tasks                      | Apaga todo o histórico de tasks  |

---

## Exemplos de requisição

### PUT /settings

```json
{
  "workTime": 25,
  "shortBreakTime": 5,
  "longBreakTime": 15
}
```

### POST /tasks

```json
{
  "id": "uuid-aqui",
  "name": "Estudar TypeScript",
  "duration": 25,
  "type": "work",
  "startDate": 1716000000000
}
```

### PATCH /tasks/:id/complete

```json
{
  "completeDate": 1716001500000
}
```

### PATCH /tasks/:id/interrupt

```json
{
  "interruptDate": 1716001000000
}
```

---

## Scripts disponíveis

| Script              | Descrição                              |
|---------------------|----------------------------------------|
| `npm run dev`       | Sobe o servidor com hot-reload         |
| `npm run build`     | Compila TypeScript para JavaScript     |
| `npm start`         | Roda a versão compilada em produção    |
| `npm run prisma:migrate` | Executa migrations pendentes    |
| `npm run prisma:studio`  | Abre o Prisma Studio no browser  |
