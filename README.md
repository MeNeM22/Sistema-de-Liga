
# ⚽ Football League Management API

A REST API for managing football teams, players, and league budgets, built with **TypeScript, Express, and Redis**.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white)

## Overview

This project implements a football league management system with REST endpoints for team registration, player signings, and squad management.

It focuses on **object-oriented design, business-rule validation, and separation of concerns**, using a ports-and-adapters architecture to decouple domain logic from data persistence.

## Key Features

- **Team Management:** Register teams, manage budgets, and retrieve squad information.
- **Player Signings:** Add players with specific positions, market values, and potential ratings.
- **Business Rules:** Enforce budget limits, squad capacity, and goalkeeper restrictions.
- **Performance Metrics:** Calculate offensive and defensive scores based on player attributes.
- **Data Persistence:** Store and retrieve league information using Redis.
- **Automated Testing:** Unit, integration, and end-to-end tests with Jest and Supertest.

### Business Rules

| Rule | Constraint |
|------|------------|
| Maximum teams | 10 |
| Total league budget | 10,000,000 |
| Maximum players per team | 32 |
| Maximum goalkeepers | 2 |
| Player potential | 0–5 |
| Player acquisition cost | Market value + 10% |

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express.js |
| Database | Redis |
| Testing | Jest, Supertest |
| Development | Docker Compose, ESLint, Prettier |

## Architecture

The application follows a **Ports and Adapters (Hexagonal Architecture)** approach, keeping business logic independent from infrastructure.

```text
HTTP Client
     |
     v
Express REST API
     |
     v
SistemaLiga
     |
     +---- Domain Models
     |     Liga, Equipo, Jugador
     |
     +---- Repository Interface
                 |
                 v
           Redis Adapter
                 |
                 v
               Redis
```

### Project Structure

```text
Sistema-de-Liga/
├── app/
│   ├── adaptadores/        # Redis persistence
│   ├── dominio/            # Business logic and entities
│   └── programa.ts         # REST API entry point
├── test/
│   ├── adaptadores/        # Integration tests
│   ├── dominio/            # Unit tests
│   └── programa.e2e-test.ts
├── compose.yml
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 22.18.0 (see `.nvmrc`)
- Yarn 1.x
- Docker and Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/MeNeM22/Sistema-de-Liga.git
cd Sistema-de-Liga
```

### 2. Install Dependencies

```bash
yarn install --frozen-lockfile
```

### 3. Start Redis

```bash
docker compose up -d redis-dev
```

Create a `.env` file in the project root:

```env
REDIS_URL=redis://127.0.0.1:6378
```

### 4. Run the Application

```bash
yarn start
```

The API will be available at:

`http://localhost:3000`

Verify the server:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{
  "version": "0.0.7"
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Retrieve application version |
| POST | `/equipos` | Register a new team |
| GET | `/equipos` | List all teams |
| GET | `/equipos/:id_equipo` | Retrieve team details |
| POST | `/equipos/:id_equipo/jugadores` | Sign a player |
| POST | `/reset` | Reset Redis database (development only) |

### Example: Register a Team

**Request:**

```bash
curl -X POST http://localhost:3000/equipos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Racing",
    "presupuesto": 500000
  }'
```

**Response (201 Created):**

```json
{
  "id": "e:<generated-uuid>",
  "nombre": "Racing",
  "presupuesto": 500000
}
```

### Example: Sign a Player

Replace `<team-id>` with the ID returned when registering a team.

```bash
curl -X POST http://localhost:3000/equipos/<team-id>/jugadores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Lautaro Martinez",
    "nacionalidad": "Argentina",
    "posicion": "delantero",
    "valor_de_mercado": 100000,
    "potencialidad": 4
  }'
```

Supported positions: `arquero`, `defensor`, `mediocampista`, `delantero`.

## Testing

The project includes three testing levels:

- **Unit Tests:** Validate domain entities and business rules.
- **Integration Tests:** Verify Redis persistence.
- **End-to-End Tests:** Validate HTTP endpoints using Supertest.

Run unit tests:

```bash
yarn test
```

Run integration and E2E tests using a dedicated test Redis instance:

```bash
docker compose up -d redis-test

REDIS_URL=redis://127.0.0.1:6379 yarn test:int
REDIS_URL=redis://127.0.0.1:6379 yarn test:e2e
```

Run static analysis:

```bash
yarn lint
```

> **Note:** Integration and E2E tests clear the selected Redis database. Always use an isolated, disposable test instance.

## Project Background

Developed as part of an academic Software Engineering project, using a course-provided TypeScript starter template.

The project demonstrates backend development concepts including domain modeling, REST API design, business-rule validation, data persistence, and automated testing.

**Maintained by:** [MeNeM22](https://github.com/MeNeM22)
