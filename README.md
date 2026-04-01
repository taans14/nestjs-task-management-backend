# NestJS Task Management Backend

Production-oriented backend for a task/team management application built with NestJS, Prisma and PostgreSQL. Implements secure authentication (email/password + JWT), role-based authorization (USER / ADMIN), team membership rules, task lifecycle management, notifications, request context middleware, structured validation and centralized error handling.

---

## TL;DR

| Area | Highlights |
|------|-----------|
| Auth | Local email/password with Passport local + JWT. Global JWT guard applied; `JwtStrategy` validates tokens and resolves users via `UsersService`. Passwords hashed with `bcrypt`.
| Data | Prisma ORM with a PostgreSQL datasource. Models: User, Task, Team, TeamMember, Notification. Prisma client generated into `prisma/generated`.
| Code Quality | Validation via `class-validator` + global `ValidationPipe`; centralized Prisma exception filter and response interceptor for consistent API shapes.
| Security | JWT stateless tokens; role-based guards for admin/user and team role checks (OWNER / MEMBER). Defensive request validation and duplicate checks in services.
| Reliability | Jest unit & e2e setup present (`test/*`), and structured foldering by domain (auth, users, teams, tasks, notifications).
| Observability | Request logging with `morgan`; Swagger docs available at `/api` in dev.
| Deployment | `docker-compose.yml` includes PostgreSQL service; simple Dockerfile placeholder included for app containerization.
| Performance | Pagination & DTO-driven shape (project-level hooks available); easily extendable with caching layers (no Redis configured by default).

---

## Tech Stack

| Category | Choice |
|----------|--------|
| Language | TypeScript |
| Framework | NestJS (Modules, Guards, Interceptors, Pipes) |
| ORM | Prisma (PostgreSQL) |
| Auth | Passport (local + jwt), bcrypt |
| API Docs | Swagger (@nestjs/swagger) |
| Logging | morgan |
| Testing | Jest, Supertest (e2e) |
| Containerization | Docker / docker-compose |

---

## Core Domains

- Authentication & Identity (registration, login, JWT issuance)
- Users (profile management)
- Teams & Memberships (owner/member roles, join/leave flows)
- Tasks (CRUD, state transitions: TODO / DOING / DONE)
- Notifications (user-targeted messages persisted in DB)
- Infrastructure: request context middleware, global exception filter, response interceptor

---

## Quick Start

1. Clone and install dependencies

```bash
git clone <repo-url>
cd nestjs-task-management-backend
npm install
```

2. Configure environment (example `.env` variables)

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=taskdb
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskdb
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION_TIME=3600s
```

3. Start PostgreSQL (Docker)

```bash
docker compose up -d db
# or run a local Postgres container
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=taskdb -p 5432:5432 postgres:16
```

4. Generate Prisma client and run migrations

```bash
npx prisma generate
# if you have migrations:
npx prisma migrate dev --name init
```

5. Run the app (dev)

```bash
npm run start:dev
```

6. Run tests

```bash
npm test
npm run test:e2e
```

---

## Authentication & Authorization

- Auth endpoints exist under `src/auth` and are wired with Passport strategies defined in `src/auth/strategies` (`local.strategy.ts`, `jwt.strategy.ts`).
- A global `JwtAuthGuard` is registered via `APP_GUARD` in `AuthModule` to protect routes by default; public routes are opt-out via a `@Public()` decorator (see `src/auth/decorators/public.decorator.ts`).
- Roles: `USER` and `ADMIN` (see Prisma `UserRole` enum). Team roles are `OWNER` and `MEMBER` (see `TeamRole`).
- Passwords are hashed using `bcrypt` before persisting.

---

## REST API — Representative Endpoints

Legend: Public = unauthenticated; USER = authenticated user; ADMIN = requires admin role.

- Auth
  - POST /auth/signup — Public — register a new user
  - POST /auth/signin — Public — login, returns JWT

- Users
  - GET /users — ADMIN — list users (if implemented)
  - GET /users/profile — USER — get current user's profile

- Teams
  - POST /teams — USER — create a team
  - POST /teams/:id/members — USER/OWNER — add a member (owner only by policy)

- Tasks
  - POST /tasks — USER — create a task (requires team membership)
  - GET /tasks — USER — list tasks (filter by team/creator)
  - PATCH /tasks/:id — USER — update task (creator or team owner/member depending on guard)

- Notifications
  - GET /notifications — USER — list notifications for current user

For full shapes and DTOs, consult the DTO files under `src/**/dto` and model definitions in `prisma/schema.prisma`.

---

## Project Structure (high level)

- `src/auth` — authentication module, controllers, strategies, guards
- `src/users` — user service, controller, DTOs, guards
- `src/teams` — team creation, membership, roles
- `src/tasks` — task domain and state management
- `src/notifications` — notification creation and retrieval
- `src/common` — global pipes, filters, interceptors, middlewares (request context)
- `prisma` — schema + migrations + generated client

---

## Observability & Error Handling

- Request logging with `morgan` for development
- Swagger UI enabled at `/api` (see `src/main.ts`)
- Centralized PrismaExceptionFilter located at `src/common/filters/prisma-exception.filter.ts` to translate DB errors into structured HTTP responses

---

## Deployment Notes

- `docker-compose.yml` includes a Postgres service. The app can be containerized with a Dockerfile (placeholder present).
- For production, host the app with a process manager or container orchestrator, run a managed Postgres instance, secure `JWT_SECRET` and other env variables, and add a persistent volume for Postgres data.

---

## Contributing & Hygiene

- Follow the existing module pattern for new domains. Keep controllers thin; put business logic in services.
- Use DTOs and `class-validator` for request validation and `ValidationPipe` is configured globally.
