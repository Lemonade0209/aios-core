# AGENTS.md

## Project Name

AIOS-Core

## Project Purpose

AIOS-Core is an AI-first personal productivity platform for managing projects, tasks, notes, documents, summaries, search, and work recommendations.

## Architecture

This project uses a separated frontend/backend architecture.

- Frontend: React + TypeScript + Vite + TailwindCSS
- Backend: Spring Boot + Spring Security + Spring Data JPA
- Database: PostgreSQL
- AI: OpenAI API, summaries, semantic search, RAG-style assistant
- Local infra: Docker Compose

## Repository Structure

Use this structure:

```text
frontend/
backend/
docker/
docs/
AGENTS.md
README.md
```

## Important Rules

- Do not implement microservices.
- Keep the backend as a modular monolith.
- Do not add Kubernetes.
- Do not add Redis, Elasticsearch, AWS S3, Slack, Gmail, Google Calendar, Discord, or WebSocket unless explicitly requested later.
- Do not commit secrets.
- Use environment variables for API keys, JWT secrets, database URLs, and other sensitive configuration.
- Enforce user ownership checks for all user-owned resources.
- Keep changes focused, reviewable, and aligned with the existing architecture.
- Update documentation when setup, commands, or behavior changes.
- Do not change application code during cleanup-only tasks.

## Backend Guidelines

- Use Java 21 unless a specific compatibility reason requires Java 17.
- Use Spring Boot, Spring Web, Spring Security, Spring Data JPA, and Validation.
- Use Gradle as the backend build tool.
- Use a feature-based package structure under `com.aios.core`.
- Keep controllers thin; put business logic and ownership checks in services.
- Use DTOs for API requests and responses.
- Do not expose JPA entities directly from controllers.
- Validate request bodies with Jakarta Validation annotations.
- Use transactional boundaries in service methods.
- Keep the MVP backend as one deployable application.

Suggested package structure:

```text
com.aios.core
├── global
├── auth
├── user
├── project
├── task
├── note
├── document
├── dashboard
├── ai
└── search
```

## Frontend Guidelines

- Use React + TypeScript + Vite.
- Use TailwindCSS for styling.
- Use React Router for routing.
- Use Axios or Fetch API for backend calls.
- Keep the UI simple, clean, functional, and connected to real backend APIs.
- Keep auth token handling centralized.
- Avoid mock data when a real API endpoint exists.
- Keep shared API types in `frontend/src/types`.
- Keep localization strings centralized under `frontend/src/i18n`.
- Prefer small page-level components unless reuse clearly justifies extraction.

Required pages:

```text
/login
/signup
/dashboard
/projects
/projects/:projectId
/tasks
/notes
/documents
/assistant
```

## Security Rules

- Never commit API keys, JWT secrets, database passwords, or local `.env` files.
- Hash passwords with BCrypt.
- Use JWT access tokens for authenticated API calls.
- Protect all user-owned API endpoints.
- Enforce user-specific data isolation in the service layer.
- Do not expose stack traces to the frontend.
- Keep CORS limited to the local frontend origin in development.
- Treat all IDs from requests as untrusted; always query by both ID and current user for owned resources.

Required environment variables:

```text
OPENAI_API_KEY=
JWT_SECRET=
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
FRONTEND_ORIGIN=
```

## AI Rules

- AI features must use internal project, task, note, and document context.
- The assistant must not invent internal records.
- If there is insufficient context, say so clearly.
- Use OpenAI only through environment variables.
- Provide deterministic fallback behavior when `OPENAI_API_KEY` is missing.
- Semantic search should prefer embeddings and pgvector when implemented.
- Until embeddings are fully implemented, document and maintain keyword-search fallback behavior.

## Build And Test Commands

Backend:

```bash
cd backend
./gradlew test
./gradlew build
./gradlew bootRun
```

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run build
npm run dev
```

Database:

```bash
cd docker
docker compose up -d
```

## Definition Of Done

A task is complete only when:

- The requested code or documentation change is implemented.
- Frontend and backend contracts remain consistent.
- User ownership and security rules are preserved.
- Relevant tests, builds, or lint commands have been run when possible.
- Failures are fixed or explicitly documented with the reason they could not be fixed.
- README or docs are updated when setup, commands, APIs, or limitations change.
- Known limitations are documented.
- The final response summarizes what changed and what was verified.
