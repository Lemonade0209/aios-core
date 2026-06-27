# AIOS-Core Codex Goal Pack

React + Spring Boot version

---

## 0. Purpose

This repository is an experiment to test how far Codex can implement a large-scale productivity platform with minimal human-written code.

AIOS-Core is an AI-first personal productivity platform that manages projects, tasks, notes, documents, and AI-powered search/recommendations.

The goal is not to build the full AIOS vision immediately.
The goal is to build a working MVP with a clean React + Spring Boot architecture.

---

## 1. Recommended Codex Mode

### First large implementation

Use:

```text
reasoning: high
```

Use high reasoning for:

- Initial project architecture
- Full MVP implementation
- Authentication
- Spring Security
- Database modeling
- RAG / embeddings
- AI Assistant
- Large refactoring
- Cross-frontend/backend integration

### Smaller follow-up tasks

Use:

```text
reasoning: medium
```

Use medium reasoning for:

- Simple UI page changes
- CRUD additions
- Minor bug fixes
- Styling changes
- README updates
- Small API modifications

---

## 2. Repository Structure

Codex must create and maintain this structure:

```text
aios-core/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── src/test/java/
│   ├── build.gradle or pom.xml
│   └── README.md
│
├── docker/
│   └── docker-compose.yml
│
├── docs/
│   ├── API.md
│   ├── ERD.md
│   ├── AIOS_Codex_Goal_Pack.md
│   └── DEVELOPMENT_LOG.md
│
├── AGENTS.md
├── README.md
└── .gitignore
```

---

## 3. Tech Stack

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios or Fetch API
- Zustand or Context API for simple state management

### Backend

- Java 21 or Java 17
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Validation
- PostgreSQL
- JWT authentication
- Gradle preferred unless there is a strong reason to use Maven

### Database

- PostgreSQL
- pgvector if available
- Use a documented fallback if pgvector is unavailable

### AI

- OpenAI API
- AI summaries
- Embedding-based semantic search
- RAG-style AI Assistant

### Infrastructure

- Docker Compose for PostgreSQL
- Do not use Kubernetes
- Do not use microservices
- Do not use Redis, Elasticsearch, AWS S3, Slack, Gmail, Google Calendar, or WebSocket in the MVP

---

## 4. MVP Scope

Build only the AIOS-Core MVP.

### Required features

1. User authentication
   - Signup
   - Login
   - Logout
   - JWT access token
   - Protected API endpoints
   - User-specific data isolation

2. Project management
   - Create project
   - Read project list
   - Read project detail
   - Update project
   - Delete project
   - Project status
   - Project goal
   - Project due date
   - Progress calculation from tasks

3. Task management
   - Create task
   - Read task list
   - Read task detail
   - Update task
   - Delete task
   - Link task to project
   - Priority
   - Status
   - Due date
   - Overdue detection

4. Notes
   - Markdown-friendly content
   - Link notes to projects
   - Tag support
   - Basic search

5. Documents
   - Title
   - Content
   - Summary
   - Link documents to projects
   - AI summary

6. Dashboard
   - Today’s tasks
   - Overdue tasks
   - Project progress
   - Recent notes/documents
   - AI recommendations

7. AI Assistant
   - Ask questions about projects, tasks, notes, and documents
   - Retrieve relevant internal data
   - Generate answer using context
   - Mention related internal records
   - Avoid pretending information exists when no context is found

8. AI Search
   - Search tasks, notes, and documents by meaning
   - Use embeddings if possible
   - Provide a fallback keyword search if embeddings are not fully available

---

## 5. Backend Domain Model

Codex should implement a simple and maintainable domain model.

Suggested entities:

```text
User
- id
- email
- passwordHash
- name
- createdAt
- updatedAt

Project
- id
- user
- title
- description
- goal
- status
- startDate
- dueDate
- createdAt
- updatedAt

Task
- id
- project
- user
- title
- description
- priority
- status
- dueDate
- completedAt
- createdAt
- updatedAt

Note
- id
- project
- user
- title
- content
- tags
- createdAt
- updatedAt

Document
- id
- project
- user
- title
- content
- summary
- createdAt
- updatedAt

EmbeddingChunk
- id
- user
- sourceType
- sourceId
- chunkText
- embedding
- createdAt

AIChatMessage
- id
- user
- question
- answer
- createdAt
```

Enums:

```text
ProjectStatus:
- PLANNED
- IN_PROGRESS
- COMPLETED
- PAUSED

TaskStatus:
- TODO
- IN_PROGRESS
- DONE
- BLOCKED

TaskPriority:
- LOW
- MEDIUM
- HIGH
- URGENT

EmbeddingSourceType:
- TASK
- NOTE
- DOCUMENT
- PROJECT
```

---

## 6. Backend Package Structure

Use a feature-based package structure.

```text
backend/src/main/java/com/aios/core/
├── AiosCoreApplication.java
├── global/
│   ├── config/
│   ├── security/
│   ├── exception/
│   └── common/
├── user/
├── auth/
├── project/
├── task/
├── note/
├── document/
├── dashboard/
├── ai/
└── search/
```

Each feature package should generally contain:

```text
controller
service
repository
entity
dto
```

Do not over-engineer.
Keep the MVP clean and understandable.

---

## 7. Frontend Structure

Use a simple React + TypeScript structure.

```text
frontend/src/
├── app/
├── api/
├── components/
├── features/
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   ├── notes/
│   ├── documents/
│   ├── dashboard/
│   └── assistant/
├── layouts/
├── pages/
├── routes/
├── types/
└── utils/
```

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

UI should be simple, clean, and functional.
Do not spend excessive effort on animations or advanced design.

---

## 8. API Guidelines

Use REST APIs.

Suggested endpoints:

```text
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/users/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/{projectId}
PUT    /api/projects/{projectId}
DELETE /api/projects/{projectId}

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/{taskId}
PUT    /api/tasks/{taskId}
DELETE /api/tasks/{taskId}

GET    /api/notes
POST   /api/notes
GET    /api/notes/{noteId}
PUT    /api/notes/{noteId}
DELETE /api/notes/{noteId}

GET    /api/documents
POST   /api/documents
GET    /api/documents/{documentId}
PUT    /api/documents/{documentId}
DELETE /api/documents/{documentId}
POST   /api/documents/{documentId}/summarize

GET    /api/dashboard

POST   /api/ai/chat
POST   /api/ai/summarize
POST   /api/search/semantic
```

All user-owned resources must be protected.
A user must not access another user's data.

---

## 9. AI Guidelines

### AI Summary

AI summary should work for:

- Notes
- Documents
- Projects

### AI Assistant

The AI Assistant must follow this flow:

```text
User question
→ Identify user
→ Search relevant projects/tasks/notes/documents
→ Build context
→ Call OpenAI API
→ Return answer with related internal records
```

The assistant must not invent internal records.

If there is not enough context, it should say so clearly.

### Semantic Search

Preferred:

```text
OpenAI embeddings
PostgreSQL pgvector
```

Fallback:

```text
keyword search over title/content/description
```

If pgvector is not implemented successfully, document the limitation clearly in README.

---

## 10. Security Rules

- Never commit API keys
- Use environment variables
- Hash passwords using BCrypt
- Protect API endpoints with JWT
- Validate request bodies
- Do not expose stack traces to frontend
- Enforce user ownership checks in service layer
- Use CORS configuration only for local frontend URL in development

Required environment variables:

```text
OPENAI_API_KEY=
JWT_SECRET=
DATABASE_URL=
```

---

## 11. Docker

Provide Docker Compose for local PostgreSQL.

Recommended:

```text
docker/docker-compose.yml
```

It should start PostgreSQL and optionally pgvector if feasible.

Do not add unnecessary services.

---

## 12. Commands

Codex should document and support commands similar to:

### Backend

```bash
cd backend
./gradlew bootRun
./gradlew test
./gradlew build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

### Database

```bash
cd docker
docker compose up -d
```

---

## 13. Definition of Done

The task is done only when:

- Repository structure is created
- Frontend builds
- Backend builds
- PostgreSQL local setup is documented
- Signup and login work
- JWT-protected API calls work
- Project CRUD works
- Task CRUD works
- Note CRUD works
- Document CRUD works
- Dashboard shows real backend data
- AI summary works or has a documented mock/fallback when API key is missing
- AI Assistant works with project/task/note/document context
- README explains how to run the app locally
- Known limitations are documented

---

## 14. Codex-Only Experiment Rules

The human user should not manually write or edit code.

The human user may:

- Write requirements
- Review diffs
- Run the app
- Report errors
- Ask Codex to fix problems
- Approve or reject changes

Codex must:

- Implement code
- Modify files
- Update documentation
- Run tests/builds when possible
- Fix errors found during verification
- Keep changes reviewable

---

## 15. Initial /goal Prompt

Paste this into Codex with high reasoning:

```text
/goal Build the MVP of AIOS-Core using a React + Spring Boot architecture.

Please read AGENTS.md and docs/AIOS_Codex_Goal_Pack.md first.

Project purpose:
This repository is an experiment to test how far Codex can implement a large-scale AI-first productivity platform with minimal human-written code.

Architecture:
- frontend: React + TypeScript + Vite + TailwindCSS
- backend: Spring Boot + Spring Security + Spring Data JPA + PostgreSQL
- AI: OpenAI API, AI summaries, embedding-based semantic search if feasible
- Database: PostgreSQL, pgvector if feasible
- Deployment for MVP: local Docker Compose only

Build a working MVP with:
1. Signup/login/logout with JWT
2. User-specific protected resources
3. Project CRUD
4. Task CRUD linked to projects
5. Note CRUD linked to projects
6. Document CRUD linked to projects
7. Dashboard with today's tasks, overdue tasks, project progress, recent activity, and AI recommendations
8. AI summary for notes/documents/projects
9. AI Assistant that answers questions using project/task/note/document context
10. Semantic search using embeddings if possible, with keyword fallback if not
11. README with full local setup and run instructions

Constraints:
- Do not implement microservices.
- Do not implement Kubernetes.
- Do not add Redis, Elasticsearch, AWS S3, Slack, Gmail, Google Calendar, Discord, or WebSocket in the MVP.
- Keep the backend as a modular monolith.
- Keep the frontend simple and functional.
- Prefer maintainable code over clever abstractions.
- Use environment variables for secrets.
- Do not commit API keys.
- Enforce user ownership checks.
- Run frontend build/lint and backend build/test when possible.
- If something fails, diagnose it and keep iterating until the MVP is in a working state.

Definition of done:
- frontend builds successfully
- backend builds successfully
- local PostgreSQL setup is documented
- auth works
- projects/tasks/notes/documents work
- dashboard uses real backend data
- AI features work with OPENAI_API_KEY or have documented fallback behavior
- README explains how to run everything locally
```

---

## 16. AGENTS.md Template

Create this file at the repository root:

```md
# AGENTS.md

## Project Name

AIOS-Core

## Project Purpose

AIOS-Core is an AI-first personal productivity platform.
This repository is also a Codex-only implementation experiment.

The goal is to test how far Codex can implement a large-scale React + Spring Boot application with minimal human-written code.

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
- Use environment variables for API keys and JWT secrets.
- Use BCrypt for passwords.
- Use JWT for authentication.
- Enforce user ownership checks for all user-owned resources.
- Keep changes small and reviewable.
- Always update documentation when setup or behavior changes.

## Backend Guidelines

Use Java 21 or Java 17.
Use Spring Boot.
Use Gradle unless there is a strong reason to use Maven.

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

Use DTOs for API requests/responses.
Do not expose JPA entities directly from controllers.
Use service-layer ownership checks.
Use validation annotations.

## Frontend Guidelines

Use React + TypeScript + Vite.
Use TailwindCSS.
Use React Router.
Use Axios or Fetch API.
Keep UI simple, clean, and functional.

Suggested pages:

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

## AI Guidelines

AI features must use internal project/task/note/document context.
The assistant must not invent records.
If there is insufficient context, say so clearly.
Use OpenAI API through environment variables.
Provide fallback behavior or clear documentation if OPENAI_API_KEY is missing.

## Commands

Backend:

```bash
cd backend
./gradlew bootRun
./gradlew test
./gradlew build
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

Database:

```bash
cd docker
docker compose up -d
```

## Definition of Done

A task is complete only when:

- The relevant code is implemented.
- Build/test/lint commands were run when possible.
- Errors were fixed or documented.
- README/docs were updated if setup changed.
- The implementation respects the MVP scope.
```

---

## 17. Suggested Follow-up Issues

After the initial /goal, use smaller follow-up prompts.

### Issue 1

```text
Review the current implementation and list missing parts compared to docs/AIOS_Codex_Goal_Pack.md. Do not modify code yet.
```

### Issue 2

```text
Fix the highest-priority missing backend functionality first. Keep changes limited to backend. Run backend tests/build after changes.
```

### Issue 3

```text
Fix the highest-priority missing frontend functionality. Keep changes limited to frontend. Run frontend build/lint after changes.
```

### Issue 4

```text
Connect frontend pages to real backend APIs. Remove mock data where real API endpoints exist.
```

### Issue 5

```text
Improve AI Assistant behavior so it retrieves relevant tasks, notes, documents, and projects before calling the OpenAI API. Do not invent records.
```

### Issue 6

```text
Write a complete README with local setup instructions for Docker, backend, frontend, environment variables, and common troubleshooting.
```

---

## 18. Final Recommendation

Use React + Spring Boot if this project is also meant to match a backend portfolio direction.

Compared to Next.js full-stack, React + Spring Boot is more complex for Codex because there are two separate apps.
However, it is better for demonstrating:

- backend architecture
- Spring Security
- JPA domain modeling
- REST API design
- frontend/backend integration
- real-world enterprise-style structure

For the first run:

```text
reasoning: high
use /goal
include AGENTS.md
include docs/AIOS_Codex_Goal_Pack.md
```

For later simple tasks:

```text
reasoning: medium
feature-by-feature prompts
```
