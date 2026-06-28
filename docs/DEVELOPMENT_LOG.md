# Development Log

## MVP scaffold

- Added Spring Boot backend with JWT auth, BCrypt password hashing, JPA entities, ownership-scoped services, CRUD endpoints, dashboard, AI assistant, summary, and keyword fallback search.
- Added React + TypeScript + Vite frontend shell with protected routes, auth context, dashboard, CRUD pages, assistant, and search UI.
- Added Docker Compose PostgreSQL setup using the `pgvector/pgvector:pg16` image. The current application documents keyword fallback; vector search is not yet implemented.
- Added local run and verification documentation.

## Known limitations

- The semantic search endpoint currently uses keyword fallback. Embedding generation and pgvector ranking are represented in the domain model but not implemented.
- AI summary and chat call OpenAI only when `OPENAI_API_KEY` is configured. Without it, the app returns local fallback summaries and context-grounded answers.
