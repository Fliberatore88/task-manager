# Task Manager — Claude Code Instructions

## Project Overview
Full-stack task management application built as a technical assessment.
Monorepo with NestJS backend (Clean Architecture) and Next.js 16 frontend.

## Architecture Rules (IMPORTANT)
- **Never** import infrastructure or presentation concerns into the domain layer
- The domain layer must have zero framework dependencies (no NestJS decorators in entities)
- Repository interfaces live in `domain/repositories/` — implementations in `infrastructure/repositories/`
- Use cases receive and return **domain entities**, never raw Prisma objects
- The controller maps domain entities to DTOs via `TaskResponseDto.fromEntity()`

## Monorepo Structure
```
apps/api/         → NestJS backend (port 3001)
apps/web/         → Next.js frontend (port 3000)
packages/shared/  → Zod schemas + TypeScript types shared by both apps
```

## Key Conventions
- All validation uses Zod (shared schemas in `packages/shared`)
- `GET /api/tasks/stats` MUST be registered before `GET /api/tasks/:id` in the controller
- Database: SQLite via Prisma (`apps/api/prisma/dev.db`, gitignored)
- Tests: Jest, unit tests for domain entities and use cases, mock the repository interface

## Node Version — CRITICAL
Both apps require **Node 20+**. The system default may be Node 18.
Always run: `source ~/.nvm/nvm.sh && nvm use 20` before any npm/node/npx command.

## Running the project

```bash
# Both terminals — switch Node version first
source ~/.nvm/nvm.sh && nvm use 20

# Terminal 1 — API (from monorepo root)
npm run dev:api

# Terminal 2 — Web (from monorepo root)
npm run dev:web
```

## First-time setup
```bash
source ~/.nvm/nvm.sh && nvm use 20
npm install
cd packages/shared && npx tsc && cd ../..
cd apps/api && npx prisma migrate dev && cd ../..
```

## Tests
```bash
source ~/.nvm/nvm.sh && nvm use 20
npm test        # from monorepo root
npm run test:watch
```

## Known quirks
- `tsconfig.build.json` sets `incremental: false` intentionally — avoids stale `.tsbuildinfo` cache breaking the build when `dist/` is deleted by `deleteOutDir: true`
- `tsconfig.json` has `paths` pointing to shared package source (for IDE/type-checking); `tsconfig.build.json` overrides with empty `paths` so the production build resolves `@task-manager/shared` through the npm workspace symlink in `node_modules/`
- Next.js 16 uses Tailwind v4 syntax (`@import "tailwindcss"` instead of `@tailwind base/components/utilities`)
