# AIOS-Core MVP Verification

Verification date: 2026-06-28

## Summary

The current React + Spring Boot MVP was verified locally against Docker PostgreSQL.

Overall result: PASS

## Environment

- macOS
- Java 21.0.4
- Node.js 24.15.0
- npm 11.12.1
- Docker 29.5.3
- Docker Compose v5.1.4
- PostgreSQL image: `pgvector/pgvector:pg16`

## Commands Executed

### Repository

```bash
git status -sb
find . -maxdepth 2 -type f -not -path './.git/*' -not -path './frontend/node_modules/*' -not -path './frontend/dist/*' -not -path './backend/.gradle/*' -not -path './backend/build/*' -print
```

Result: PASS

- Repository was clean before verification.
- Expected top-level structure exists: `frontend/`, `backend/`, `docker/`, `docs/`, `AGENTS.md`, `README.md`.

### Docker PostgreSQL

```bash
docker desktop start
docker desktop status
docker info
cd docker
docker compose up -d
docker compose ps
docker exec aios-core-postgres pg_isready -U aios -d aios_core
```

Result: PASS

- Docker Desktop was initially not running, then started successfully.
- `aios-core-postgres` started from `docker/docker-compose.yml`.
- PostgreSQL health check reported healthy.
- `pg_isready` reported accepting connections.

### Backend

```bash
cd backend
./gradlew clean build
./gradlew bootRun
```

Result: PASS

- `./gradlew clean build` passed.
- Backend started on port `8080`.
- Backend connected to Docker PostgreSQL at `localhost:5432`.

### Frontend

```bash
cd frontend
npm install
npm run lint
npm run build
npm run dev -- --host 127.0.0.1
curl -I http://127.0.0.1:5173/
```

Result: PASS

- `npm install` completed with `0 vulnerabilities`.
- `npm run lint` passed.
- `npm run build` passed.
- Vite dev server started on `http://127.0.0.1:5173/`.
- Frontend returned HTTP `200 OK`.

## Runtime API Flow

A runtime HTTP verification was executed against the running Spring Boot backend.

Covered flow:

- Signup
- Login
- JWT-protected `/api/users/me`
- Project create/read/update through API flow
- Ownership isolation check with a second user
- Task create/update
- Note create
- Document create and summarize
- Dashboard read
- Semantic search endpoint
- AI assistant endpoint with internal context
- AI assistant no-context fallback
- Generic AI summary fallback

Result: PASS

Observed runtime result:

```json
{
  "result": "PASS",
  "searchMode": "keyword-fallback",
  "chatUsedOpenAi": false,
  "genericSummaryUsedOpenAi": false
}
```

## API Contract Consistency

Checked backend controller routes against frontend API calls.

Result: PASS

Verified endpoint groups:

- Auth: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
- Current user: `/api/users/me`
- Projects: `/api/projects`, `/api/projects/{projectId}`
- Tasks: `/api/tasks`, `/api/tasks/{taskId}`
- Notes: `/api/notes`, `/api/notes/{noteId}`
- Documents: `/api/documents`, `/api/documents/{documentId}`, `/api/documents/{documentId}/summarize`
- Dashboard: `/api/dashboard`
- AI: `/api/ai/chat`, `/api/ai/summarize`
- Search: `/api/search/semantic`

## Auth And Protected Routes

Result: PASS

- Frontend stores JWT access tokens under `aios_token`.
- Frontend Axios interceptor sends `Authorization: Bearer <token>` for protected API calls.
- `ProtectedRoute` redirects unauthenticated users to `/login`.
- Backend JWT filter authenticates Bearer tokens.
- Backend protected endpoints require authentication.

## User Ownership And Data Isolation

Result: PASS

- Services use the current authenticated user for owned resources.
- Resource lookups use user-scoped repository methods such as `findByIdAndUser`.
- Project linkage for tasks, notes, and documents goes through `ProjectService.getOwned`.
- Runtime check confirmed a second user receives `404` when accessing another user's project.

## OpenAI Fallback Behavior

Result: PASS

- `OPENAI_API_KEY` was not configured during verification.
- Generic summary returned `usedOpenAi: false`.
- AI chat returned `usedOpenAi: false`.
- Semantic search returned `mode: keyword-fallback`.
- No-context AI assistant request returned a clear insufficient-context message.

## Errors Found

- Docker Desktop was initially stopped.
  - Action: started Docker Desktop with `docker desktop start`.
- Vite dev server initially failed in sandboxed execution with `listen EPERM: operation not permitted 127.0.0.1:5173`.
  - Action: reran with appropriate local port-binding permissions.

No application code errors were found during this verification pass.

## Fixes Applied

No application code fixes were applied.

Documentation added:

- `docs/VERIFICATION.md`

README changes were not required because the documented commands and environment variables matched the verified setup.

## Remaining Known Limitations

- Semantic search currently uses keyword fallback; embeddings and pgvector ranking are not implemented yet.
- OpenAI-backed summary and assistant behavior require `OPENAI_API_KEY`.
- Docker Desktop must be running before `docker compose up -d` and backend `bootRun`.
- Runtime API verification was performed through HTTP requests; full browser-driven interaction testing was not performed.
