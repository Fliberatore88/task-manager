# AI Collaboration Artifacts

**Developer:** federico.liberatore
**Tool:** Claude Code (claude-sonnet-4-6) via CLI
**Project:** Task Manager — Technical Assessment

---

## Approach

I used Claude Code as a pair programmer, not as a code generator. The architectural decisions were mine upfront — I came with a clear picture of Clean Architecture layers, the monorepo structure, and the technology tradeoffs. Claude's role was to implement those decisions at speed, flag edge cases, and validate my reasoning.

The key discipline: I never asked "build me a task manager." Every prompt was scoped to a specific layer or concern.

---

## Selected Prompts

These are representative of how I drove the session. Prompts were conversational, not scripts.

---

### Prompt 1 — Architecture design

> "I want a NestJS monorepo with strict Clean Architecture. Four layers: domain (entities + repository interfaces), application (use cases), infrastructure (Prisma implementations), presentation (controllers + DTOs). The domain must have zero framework dependencies — no NestJS decorators in entities. Design the folder structure and explain any tradeoffs vs a simpler service-based approach."

**Why this prompt:** Forces the AI to explain the tradeoffs out loud, which I can then validate. If it can't justify the structure, it's wrong.

**What I validated:** That the domain `ITaskRepository` uses a Symbol token for DI injection (`TASK_REPOSITORY`), so NestJS's IoC container wires the concrete Prisma implementation without the domain knowing it exists.

---

### Prompt 2 — TDD for the domain entity

> "Write the spec file for TaskEntity BEFORE writing the entity itself. I want tests covering: title min/max length validation, immutability (update returns new instance, doesn't mutate), isOverdue logic for completed vs pending tasks."

**Why this prompt:** TDD discipline. Writing the spec first forces the interface to be designed from the consumer's perspective, not the implementor's.

**What I validated:** That `update()` returns a `new TaskEntity(...)` rather than mutating `this`. Immutability in the domain is non-negotiable — it makes the entity predictable and testable without setup/teardown.

---

### Prompt 3 — Stats endpoint ordering gotcha

> "The route GET /api/tasks/stats must be registered before GET /api/tasks/:id in the NestJS controller. Confirm this is handled and explain why Express would misinterpret it otherwise."

**Why this prompt:** This is a classic Express routing bug. Registering `:id` first causes the framework to treat the literal string "stats" as an ID parameter, resulting in a 404 or a DB miss. In NestJS, method order in the controller class determines registration order.

---

### Prompt 4 — Shared Zod schemas

> "Create a shared package that exports Zod schemas for CreateTask, UpdateTask, TaskFilter, and Task. TypeScript types should be derived from the schemas using z.infer<> — I don't want types defined separately. Backend uses these for the ZodValidationPipe, frontend uses them as the zodResolver source for React Hook Form."

**Why this prompt:** Single source of truth. If the Task model changes (e.g., a new field), I update one Zod schema and both the API validation and the frontend form constraints update automatically.

---

### Prompt 5 — Frontend state architecture

> "The useTasks hook should own all server state: fetch, create, update, delete, and stats. Components get data and callbacks — no direct API calls from components. Use useCallback on fetch functions so useEffect dependency arrays are stable."

**Why this prompt:** Avoids the common pattern of scattering API calls across components, which makes testing and refactoring painful. The hook is the single boundary between server state and UI state.

---

### Prompt 6 — API access from any device without CORS or hardcoded IPs

> "The Docker setup works locally but accessing from another device requires rebuilding with a hardcoded IP — that doesn't scale. What's the production-grade pattern for a Next.js frontend proxying to a containerized API without coupling the build to the host machine's network?"

**Why this prompt:** The naive Docker setup embeds the host IP at build time, breaking on any other machine or when the IP changes. CORS configuration is the wrong layer to solve a networking topology problem.

**What I validated:** Using Next.js `rewrites()` in `next.config.ts` to proxy `/api/*` → `http://api:3001` (Docker's internal service name). The browser only ever talks to port 3000 — same origin, no CORS involved. The internal proxy target uses the Docker Compose service name, which is stable regardless of the host machine's IP.

**Tradeoff acknowledged:** `next.config.ts` rewrites are evaluated at build time (see lesson 7), so `API_URL` must be passed as a Docker build ARG, not a runtime environment variable.

---

## Lessons Learned

1. **Prompts that ask for justification produce better code.** Asking "explain the tradeoff" catches when the AI defaults to a simpler but wrong approach.

2. **TDD via AI works well for the domain layer.** The spec-first discipline forced clean interfaces on `TaskEntity` — especially immutability, which I might have skipped in a rush.

3. **The AI flagged the stats/id route ordering issue before I asked.** After I mentioned the endpoint list, it proactively noted the registration order risk. That's the kind of second-opinion value that justifies the tool.

4. **Shared package is the biggest DX win.** Writing Zod once and having it in both `ZodValidationPipe` (backend) and `zodResolver` (frontend) eliminated an entire class of backend/frontend type drift.

5. **The AI is a fast typist, not an architect.** Every structural decision in this project — Clean Architecture layers, monorepo shape, SQLite for zero-config, stats-before-id routing — was made before the first prompt. The AI executed those decisions efficiently.

6. **Next.js config is build-time, not runtime.** `next.config.ts` rewrites are evaluated during `next build` and baked into `.next/required-server-files.json`. Docker Compose `environment:` variables arrive at runtime — too late. The correct pattern is to pass the API URL as a Docker build `ARG`, which makes it available during the build stage where Next.js needs it. This is why `API_URL` is a build arg pointing to the internal Docker service name (`http://api:3001`) rather than a runtime env var.
