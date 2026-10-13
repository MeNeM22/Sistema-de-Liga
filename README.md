
<h1 align="center">⚽ Football League Management API</h1>

<p align="center">
  <strong>A REST API for managing football teams, signing players, and enforcing league rules.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> ·
  <a href="#-try-the-api">Try the API</a> ·
  <a href="#-testing">Testing</a> ·
  <a href="#-architecture">Architecture</a>
</p>

<hr width="100%">

## 📖 Overview

**Football League Management API** is an academic backend project built with **TypeScript, Express, and Redis**. It provides HTTP endpoints to register teams, sign players, list squads, and calculate each team's spending and performance scores.

The project emphasizes **object-oriented domain modeling**, **business-rule validation**, **ports and adapters (hexagonal architecture)**, and **automated testing**.

> **Where is the application?** The football API lives in [`ejercicio_3/`](ejercicio_3/). The sibling `ejemplo-cli/` and `ejemplo-web/` directories are separate educational examples.

## ✨ Main Features

- Register football teams with an initial budget.
- Add players with a name, nationality, market value, potential, and position.
- Persist league data using Redis.
- List teams and retrieve complete squad details.
- Calculate spending, including a **10% player acquisition surcharge**.
- Calculate attacking and defensive scores from player potential and position.
- Enforce domain constraints with dedicated error classes.

### Business Rules

| Rule | Current implementation |
|---|---|
| Teams per league | Maximum **10** |
| Combined initial team budgets | Maximum **10,000,000** |
| Players per team | Maximum **32** |
| Goalkeepers per team | Maximum **2** |
| Player potential | From **0** to **5** |
| Acquisition cost | Market value **+ 10%** |
| Complete squad | **32 players**, including **exactly 2 goalkeepers** |

<hr width="100%">

## 🚀 Quick Start

### Requirements

- Git and `curl`
- **Node.js 22.18.0**, as specified in `ejercicio_3/.nvmrc` (using `nvm` is recommended)
- **Yarn 1.x**, pinned to 1.22.21 by `package.json`
- Docker and Docker Compose, for the Redis service

### 1. Clone the application branch

```bash
git clone --branch ejercicio_3 https://github.com/MeNeM22/Sistema-de-Liga.git
cd Sistema-de-Liga/ejercicio_3
```

### 2. Install dependencies

```bash
nvm install
nvm use
corepack enable
yarn install --frozen-lockfile
```

If you already have the required Node.js version, you can skip `nvm install`.

### 3. Start Redis (development only)

```bash
docker compose up -d redis-dev
docker compose ps
```

The existing Compose configuration exposes the **development Redis instance on `localhost:6378`**.

### 4. Configure the environment

Create a `.env` file inside `ejercicio_3/` containing:

```dotenv
REDIS_URL=redis://127.0.0.1:6378
```

Keep `.env` out of version control. Never use a Redis instance containing important data for the examples below.

### 5. Start the HTTP server

```bash
yarn start
```

The API listens on **http://localhost:3000**. Keep this terminal running and use a second terminal for the requests.

### 6. Verify the server

```bash
curl -i http://localhost:3000/
```

The root endpoint returns a JSON object containing the package version, for example:

```json
{"version":"0.0.7"}
```

<hr width="100%">

## 🧪 Try the API

The following walkthrough uses real routes and JSON fields from `ejercicio_3/app/programa.ts`.

### 1. Register a team

```bash
curl -i -X POST http://localhost:3000/equipos \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Racing","presupuesto":500000}'
```

**Expected status:** `201 Created`.

The response has this shape (the UUID varies):

```json
{
  "id": "e:<generated-uuid>",
  "nombre": "Racing",
  "presupuesto": 500000
}
```

Copy the returned `id` and save it in your terminal:

```bash
TEAM_ID='e:replace-with-the-actual-uuid'
```

### 2. Sign a player

```bash
curl -i -X POST "http://localhost:3000/equipos/$TEAM_ID/jugadores" \
  -H 'Content-Type: application/json' \
  -d '{
    "nombre":"Lautaro Martinez",
    "valor_de_mercado":100000,
    "nacionalidad":"Argentina",
    "potencialidad":4,
    "posicion":"delantero"
  }'
```

**Expected status:** `201 Created`.

The response includes the new player's ID and submitted attributes.

Accepted `posicion` values:

- `arquero`
- `defensor`
- `mediocampista`
- `delantero`

### 3. List all teams

```bash
curl -i http://localhost:3000/equipos
```

After the two preceding requests, the response contains an entry similar to:

```json
[
  {
    "id": "e:<generated-uuid>",
    "nombre": "Racing",
    "presupuesto": 500000,
    "presupuesto_ejecutado": 110000,
    "estado": "INCOMPLETO"
  }
]
```

The `110000` spent is the player's `100000` market value plus the 10% surcharge.

### 4. Get a team's details

```bash
curl -i "http://localhost:3000/equipos/$TEAM_ID"
```

The response includes the team's `jugadores`, `presupuesto_ejecutado`, `estado`, `poder_ofensivo` and `poder_defensivo`.

### Available Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/` | Retrieve package version |
| `POST` | `/equipos` | Register a team |
| `GET` | `/equipos` | List teams |
| `GET` | `/equipos/:id_equipo` | Retrieve team details |
| `POST` | `/equipos/:id_equipo/jugadores` | Sign a player |
| `POST` | `/reset` | Reset the selected Redis database |

Invalid requests can return `400 Bad Request`; unknown team IDs can return `404 Not Found`.

Error messages are produced in Spanish by the current implementation.

> ⚠️ **Warning:** Do not use `POST /reset` on any shared Redis instance. The current implementation executes Redis `FLUSHDB`, deleting every key in the selected database, not just league data. This endpoint currently has no authentication.

<hr width="100%">

## 🏗️ Architecture

The project follows **Hexagonal Architecture (Ports and Adapters)** to separate business logic from external dependencies.

The main architectural layers are:

- **Domain Layer:** Entities, value objects, business rules, and domain errors.
- **Application Layer:** Coordination of league operations and use cases.
- **Ports:** Interfaces defining contracts between the application and external systems.
- **Adapters:** Implementations responsible for interacting with Redis.
- **HTTP Layer:** Express endpoints handling requests and responses.

### Architecture Diagram

```text
                  HTTP Client
                      |
                      v
              +----------------+
              |  Express API   |
              |   programa.ts  |
              +----------------+
                      |
                      v
              +----------------+
              | SistemaLiga    |
              | Application    |
              +----------------+
                      |
           +----------+----------+
           |                     |
           v                     v
    +--------------+     +----------------+
    | Domain Model |     | Repository Port|
    | Liga         |     | IRepositorio   |
    | Equipo       |     +----------------+
    | Jugador      |              |
    | Posicion     |              v
    +--------------+     +----------------+
                         | Redis Adapter  |
                         | RepositorioLiga|
                         +----------------+
                                  |
                                  v
                             +---------+
                             |  Redis  |
                             +---------+
```

### Project Structure

```text
Sistema-de-Liga/
├── README.md
├── ejemplo-cli/                 # Independent CLI example
├── ejemplo-web/                 # Independent web example
└── ejercicio_3/                 # Main API
    ├── app/
    │   ├── adaptadores/
    │   ├── dominio/
    │   │   └── clases-de-errores/
    │   └── programa.ts
    ├── test/
    │   ├── dominio/             # Domain unit tests
    │   ├── adaptadores/         # Redis integration tests
    │   └── programa.e2e-test.ts # HTTP end-to-end tests
    ├── compose.yml
    ├── package.json
    └── yarn.lock
```

### Design Principles

This project explores several software engineering principles:

**Separation of Concerns**

Business rules are implemented independently of the HTTP framework and database infrastructure.

**Dependency Inversion**

The application uses a repository contract rather than depending directly on the Redis implementation.

**Encapsulation**

Domain entities manage their internal state and enforce their own business rules.

**Testability**

The separation between domain logic and infrastructure makes it possible to test business behavior without requiring a live Redis connection.

<hr width="100%">

## ✅ Testing

The repository includes automated tests using **Jest**, **Supertest**, and mocked repository dependencies.

### Domain Unit Tests

Unit tests validate domain behavior without requiring Redis.

From the `ejercicio_3/` directory:

```bash
yarn test --testPathPattern=dominio
```

### Static Code Analysis

Run ESLint:

```bash
yarn lint
```

### Integration and End-to-End Tests

The project includes additional scripts:

```bash
yarn test:int
yarn test:e2e
```

These tests require a Redis instance.

> ⚠️ **Important:** Do not run integration or E2E tests against the development database.

The current configuration contains an inconsistency:

- `compose.yml` publishes the test Redis instance on port `6379`.
- The older internal README references port `6377`.
- The Redis client loads `.env` by default instead of `.env.test`.
- Integration and E2E tests execute `FLUSHDB`.

Before executing these test suites, configure and verify a dedicated, disposable Redis instance.

Full test execution and overall coverage have not yet been verified for this snapshot.

<hr width="100%">

## ⚠️ Known Limitations

This project was developed in an academic context and has several areas for future improvement:

- The reset endpoint currently has no access control.
- Redis integration and E2E testing require stronger environment isolation.
- The complete league is stored as a single JSON value, which may cause lost updates during concurrent operations.
- Request validation and HTTP error handling can be improved.
- The internal `ejercicio_3/README.md` and `pruebas.http` still contain outdated examples from a student-management application.

These improvements are planned as part of the project's continued development.

<hr width="100%">

## 👤 Author

**Agustín Menechino Castro**

Computer Engineering Student at Universidad Nacional de Tres de Febrero (UNTREF)

Interested in backend development, API design, software architecture, and automated testing.

<p align="center">
  <a href="https://github.com/MeNeM22">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/agustin-francisco-menechino-castro-b0362323a/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>
