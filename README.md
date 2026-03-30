# Task Manager

Full-stack task management application built as a technical assessment.

**Stack:** NestJS · Next.js 16 · TypeScript · SQLite · Prisma · Zod · Tailwind CSS

---

## Architecture Decisions

### Clean Architecture (Backend)

The backend is organized into four strictly separated layers:

```
domain/           → Entities + repository interfaces. Zero framework dependencies.
application/      → Use cases. Orchestrate domain objects. No HTTP concerns.
infrastructure/   → Prisma repository implementations. The only layer that knows the DB exists.
presentation/     → NestJS controllers + DTOs. Maps HTTP ↔ domain.
```

**Why:** The dependency rule flows inward only. `TaskEntity` doesn't know Prisma exists. `CreateTaskUseCase` doesn't know it's called via HTTP. If tomorrow we swap SQLite for PostgreSQL, we only change `infrastructure/`. If we swap NestJS for Fastify, we only change `presentation/`. This is the point of clean architecture — the core business logic is insulated from I/O concerns.

**Tradeoff vs. simple service-based NestJS:** More files and indirection upfront. Worth it when the codebase grows or when you need to test business logic without spinning up a database.

### NestJS over Express

NestJS's module + DI system maps naturally to Clean Architecture: modules are boundaries, providers are injected, `@Inject(TASK_REPOSITORY)` implements dependency inversion without manual wiring.

Express would require the same structure built manually — same result, more boilerplate to maintain.

**Tradeoff:** NestJS has a steeper learning curve and more compile-time overhead. For a small API, Express would be simpler. For a production system that scales, NestJS's conventions enforce consistency across teams.

### SQLite + Prisma

SQLite requires zero infrastructure — no Docker, no connection strings, no migration servers. Prisma provides type-safe queries, declarative schema, and a one-line database swap (`provider = "postgresql"`).

**Tradeoff:** SQLite doesn't support concurrent writes at scale. In production, this would be PostgreSQL. Prisma makes that change trivial — only `schema.prisma` and the connection string change.

### Shared Zod Schemas

`packages/shared` exports Zod schemas consumed by both apps:
- Backend: `ZodValidationPipe` validates incoming requests
- Frontend: `zodResolver` wires the same schema to React Hook Form

Single source of truth for the Task model. Adding a field to the schema propagates validation to both API and form simultaneously.

### Monorepo (npm workspaces)

Two apps (`api`, `web`) and one shared package (`shared`) under a single root. No Turborepo or Nx — unnecessary complexity for two apps. npm workspaces provide symlinked `node_modules` and workspace scripts.

### Stats Endpoint Routing

`GET /api/tasks/stats` is registered **before** `GET /api/tasks/:id` in the controller. This is intentional — Express processes routes in registration order. If `:id` were registered first, the string `"stats"` would be interpreted as a task ID, producing a 404 or DB miss.

---

## Running the project

There are two ways to run the project. **Docker is recommended** — it requires no local Node setup and handles everything automatically.

---

### Option 1 — Docker (recommended)

**Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Mac/Windows) or Docker + Docker Compose (Linux).

```bash
docker compose up --build
```

That's it. The first build takes ~3–4 minutes (downloads Node image, installs dependencies, compiles TypeScript, runs migrations). Subsequent starts use the cached image and take a few seconds.

| Service | URL |
|---------|-----|
| Web app | http://localhost:3000 |
| REST API | http://localhost:3001 |
| Swagger docs | http://localhost:3001/api/docs |

Docker handles everything automatically:
- Correct Node.js version (20)
- All dependency installation
- Shared package compilation
- SQLite database creation
- Prisma migrations

The database persists in a named Docker volume (`db-data`) — data survives container restarts.

**Accessing from other devices on the same network** (phone, tablet):

Just use your machine's local IP or hostname — no extra configuration needed:

```
http://<your-ip>:3000
http://<your-hostname>.local:3000   # mDNS, works on most networks
```

The web container proxies all `/api/*` requests to the API internally via Docker's network (`http://api:3001`), so the host IP is irrelevant to the setup.

**Useful commands:**

```bash
docker compose up --build      # build images and start (first time or after code changes)
docker compose up              # start with existing images (faster)
docker compose down            # stop containers, preserve database
docker compose down -v         # stop containers and delete database volume
docker compose logs -f api     # tail API logs
docker compose logs -f web     # tail web logs
```

---

### Option 2 — Local (without Docker)

**Prerequisites:**
- **Node.js 20+** — required by both apps. If your system has an older default, use nvm.
- **nvm** — to switch Node versions
- **npm 10+**

#### Step 1 — Create environment files

These files are gitignored and must be created manually.

**`apps/api/.env`**
```
DATABASE_URL="file:./dev.db"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**`apps/web/.env.local`**
```
# No required variables — Next.js proxies /api/* to the API in dev mode too.
# Add overrides here only if running the API on a non-default port.
```

#### Step 2 — Install and build

Run these commands once from the **monorepo root**:

```bash
# Switch to Node 20
source ~/.nvm/nvm.sh && nvm use 20

# Install all dependencies (all workspaces)
npm install

# Compile the shared Zod schemas package
cd packages/shared && npx tsc && cd ../..

# Create the SQLite database and run migrations
cd apps/api && npx prisma migrate dev && cd ../..
```

#### Step 3 — Start both servers

Open **two terminals** from the monorepo root, both with Node 20:

```bash
# Terminal 1 — API  →  http://localhost:3001
source ~/.nvm/nvm.sh && nvm use 20
npm run dev:api
```

```bash
# Terminal 2 — Web  →  http://localhost:3000
source ~/.nvm/nvm.sh && nvm use 20
npm run dev:web
```

> The API script runs `nest build` then starts the compiled output. After changing API source files, re-run `npm run dev:api` to pick up changes.

---

## Tests

Tests run against the backend only (unit tests for domain entities and use cases, with repository mocked). No database required.

```bash
source ~/.nvm/nvm.sh && nvm use 20
npm test             # run all tests once
npm run test:watch   # watch mode
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List tasks (filterable + sortable) |
| `GET` | `/api/tasks/stats` | Task counts by status and priority |
| `GET` | `/api/tasks/:id` | Get a single task |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

**Query params for `GET /api/tasks`:**

| Param | Values | Default |
|-------|--------|---------|
| `status` | `pending` · `in-progress` · `completed` | — |
| `priority` | `low` · `medium` · `high` | — |
| `assignee` | any string (partial match) | — |
| `sortBy` | `createdAt` · `dueDate` · `priority` | `createdAt` |
| `sortOrder` | `asc` · `desc` | `desc` |

Full interactive documentation available at **http://localhost:3001/api/docs** (Swagger UI).

---

## AI Collaboration

See [AI_COLLABORATION.md](./AI_COLLABORATION.md) for prompts, approach, and lessons learned.

---

## Reflection: AI Agent Effectiveness and TDD

Using Claude Code as a pair programmer accelerated implementation significantly — but the value came from how it was used, not just that it was used.

The key discipline was arriving at the tool with architectural decisions already made. Clean Architecture layers, the monorepo shape, the stats-before-id routing constraint, the shared Zod schema strategy — all of these were defined before the first prompt. Claude's role was to execute those decisions at speed and validate edge cases.

TDD worked particularly well for the domain layer. Writing the `TaskEntity` spec before the implementation forced a clean interface: the test revealed that `update()` needed to return a new instance (immutability), not mutate in place. Without the spec-first discipline, that decision might have been deferred and harder to retrofit. The AI's strength in TDD is generating comprehensive test cases quickly — it thought of the `isOverdue` edge case (completed tasks with past due dates) without being prompted.

The clearest limitation: the AI doesn't remember architectural decisions across context. Without explicit instructions in `CLAUDE.md`, it would drift toward simpler patterns (e.g., putting business logic in the controller). Persistent instruction files are essential for maintaining coherence in longer sessions.

The biggest DX win was the shared Zod package. That architectural decision — prompted explicitly — eliminated an entire class of frontend/backend type drift that would otherwise require manual synchronization.

**Estimated time saved:** ~60% of implementation time, mostly on boilerplate (Prisma wiring, Swagger decorators, form validation setup). Architecture and debugging remained human-driven.

---

## Project Structure

```
task-manager/
├── apps/
│   ├── api/                        ← NestJS backend
│   │   ├── src/
│   │   │   ├── domain/             ← Entities + repository interfaces
│   │   │   ├── application/        ← Use cases (with .spec.ts tests)
│   │   │   ├── infrastructure/     ← Prisma repositories
│   │   │   └── presentation/       ← Controllers + DTOs
│   │   └── prisma/schema.prisma
│   └── web/                        ← Next.js 16 frontend (App Router)
│       ├── app/                    ← Pages
│       ├── components/
│       │   ├── tasks/              ← Domain-specific components
│       │   └── ui/                 ← Generic UI primitives
│       ├── hooks/                  ← useTasks (all server state)
│       └── lib/api/                ← Axios API client
└── packages/
    └── shared/                     ← Zod schemas + TypeScript types
```
