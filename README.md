# AIOS-Core

AIOS-Core is an AI-powered productivity platform for managing projects, tasks, notes, documents, and intelligent work recommendations.

This project is also a **Codex-only implementation experiment**.
The goal is to explore how far an AI coding agent can implement a large-scale React + Spring Boot application with minimal human-written code.

---

## Overview

Modern work is spread across many tools:

* Notes
* Tasks
* Documents
* Project management tools
* Calendars
* Code repositories
* AI chatbots
* File storage

The problem is that these data sources are usually separated.

AIOS-Core aims to provide a single workspace where AI can understand the user's projects, tasks, notes, and documents, then provide useful summaries, search results, and work recommendations.

Instead of manually searching through scattered information, the user can simply ask:

* What should I work on today?
* What is the current status of this project?
* Show me all documents related to login.
* Which tasks are overdue?
* Summarize this project.
* What is the next best action?

---

## Project Purpose

AIOS-Core has two main purposes.

### 1. Product Goal

Build an AI-first productivity platform that helps users manage work context in one place.

### 2. Codex Experiment Goal

Test how effectively Codex can build and maintain a large React + Spring Boot project when given clear project rules, architecture, and goals.

Human-written code should be minimized.
The human role is mainly:

* Writing requirements
* Reviewing diffs
* Running the app
* Reporting bugs
* Approving or rejecting changes

Codex is responsible for:

* Implementing code
* Updating files
* Fixing errors
* Writing documentation
* Running build/test commands when possible

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* React Router

### Backend

* Java 17 or Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* JWT Authentication

### AI

* OpenAI API
* AI Summary
* AI Assistant
* Embedding-based semantic search
* RAG-style context retrieval

### Infrastructure

* Docker Compose
* PostgreSQL
* Local development environment

---

## MVP Features

### Authentication

* Signup
* Login
* Logout
* JWT access token
* Protected API endpoints
* User-specific data isolation

### Project Management

* Create projects
* View project list
* View project details
* Update projects
* Delete projects
* Track project status
* Track project goals
* Calculate project progress from tasks

### Task Management

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Link tasks to projects
* Set priority
* Set status
* Set due date
* Detect overdue tasks

### Notes

* Markdown-friendly note content
* Link notes to projects
* Tag support
* Basic search

### Documents

* Create documents
* Link documents to projects
* Store document content
* Generate AI summaries

### Dashboard

* Today’s tasks
* Overdue tasks
* Project progress
* Recent notes and documents
* AI-based work recommendations

### AI Assistant

The AI Assistant answers questions using internal project data.

Example:

```text
User:
Explain the login feature status.

AI:
JWT login has been implemented.
Refresh token support is not completed yet.
There are three related tasks and two related documents.
The next recommended action is to implement refresh token rotation.
```

### AI Search

AIOS-Core supports searching across:

* Projects
* Tasks
* Notes
* Documents

The preferred search method is embedding-based semantic search.
The current MVP exposes the semantic-search API with a documented keyword-search fallback. The Docker database image includes pgvector so embedding search can be added later without changing the local infrastructure.

---

## Repository Structure

```text
aios-core/
├── AGENTS.md
├── README.md
├── frontend/
├── backend/
├── docker/
└── docs/
    └── AIOS_Codex_Goal_Pack.md
```

### frontend/

React + TypeScript application.

### backend/

Spring Boot application.

### docker/

Local infrastructure files, such as PostgreSQL Docker Compose configuration.

### docs/

Project planning, architecture notes, API documentation, ERD, and Codex goal documents.

### AGENTS.md

Project rules for Codex.
Codex should read this file before making changes.

---

## Backend Architecture

The backend follows a modular monolith structure.

```text
backend/src/main/java/com/aios/core/
├── global/
├── auth/
├── user/
├── project/
├── task/
├── note/
├── document/
├── dashboard/
├── ai/
└── search/
```

Each feature should generally include:

```text
controller
service
repository
entity
dto
```

The backend should follow this flow:

```text
Controller → DTO → Service → Repository → Entity
```

JPA entities should not be exposed directly from controllers.

---

## Frontend Architecture

The frontend uses a feature-based structure.

```text
frontend/src/
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

---

## Environment Variables

Create environment files locally.

### Backend

Example:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/aios_core
DATABASE_USERNAME=aios
DATABASE_PASSWORD=aios
JWT_SECRET=replace-with-secure-secret
OPENAI_API_KEY=replace-with-your-openai-api-key
```

### Frontend

Example:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Do not commit real secrets.

---

## Local Development

### 1. Start Database

```bash
cd docker
docker compose up -d
```

### 2. Run Backend

```bash
cd backend
./gradlew bootRun
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Build and Test

### Backend

```bash
cd backend
./gradlew test
./gradlew build
```

### Frontend

```bash
cd frontend
npm run build
npm run lint
```

---

## Security Rules

* Do not commit API keys.
* Use environment variables for secrets.
* Store passwords using BCrypt.
* Protect APIs with JWT.
* Validate request bodies.
* Do not expose stack traces to the frontend.
* Enforce user ownership checks for all user-owned resources.
* Keep CORS configuration limited to the local frontend during development.

---

## Codex Usage

This project is designed to be implemented with Codex.

Before working on this repository, Codex should read:

```text
AGENTS.md
docs/AIOS_Codex_Goal_Pack.md
```

Recommended first prompt:

```text
Please read AGENTS.md and docs/AIOS_Codex_Goal_Pack.md first.

Then execute the /goal in docs/AIOS_Codex_Goal_Pack.md.

Important:
- Use React + TypeScript + Vite for frontend.
- Use Spring Boot for backend.
- Do not use Next.js.
- Do not implement microservices.
- Keep the backend as a modular monolith.
- Keep the MVP simple and reviewable.
- Run build/lint/tests when possible.
- If something fails, fix it before finishing.
```

Recommended reasoning level:

```text
Initial large implementation: high
Simple UI changes: medium
CRUD additions: medium
Spring Security / JWT / RAG / AI Assistant: high
Refactoring: high
```

---

## Development Principles

* Keep the MVP simple.
* Do not over-engineer.
* Prefer maintainable code over clever abstractions.
* Implement features in small, reviewable steps.
* Keep frontend and backend contracts consistent.
* Document known limitations clearly.
* Do not expand the scope before the MVP works.

---

## Not Included in MVP

The following features are intentionally excluded from the first MVP:

* Microservices
* Kubernetes
* Redis
* Elasticsearch
* AWS S3
* Slack integration
* Gmail integration
* Google Calendar integration
* Discord integration
* WebSocket real-time collaboration
* Mobile app
* Desktop app
* Browser extension

These may be considered in later phases after the core MVP is stable.

---

## Roadmap

### Phase 1: Core MVP

* Authentication
* Project CRUD
* Task CRUD
* Notes
* Documents
* Dashboard
* AI summaries
* Basic AI Assistant

### Phase 2: AI Search

* Embedding generation
* Semantic search
* RAG-style context retrieval
* Improved AI recommendations

### Phase 3: Integrations

* GitHub integration
* Google Calendar integration
* Gmail integration
* Slack or Discord integration

### Phase 4: Advanced Platform

* Notification system
* Advanced analytics
* Team workspace
* Browser extension
* Desktop app
* Mobile app

---

## Current Status

This project is in the initial MVP implementation stage.

The first goal is to build a working React + Spring Boot application with:

* Local PostgreSQL setup
* Authentication
* Project/task/note/document management
* AI summary
* AI Assistant
* Dashboard

---

## License

This project is currently for personal experimentation and portfolio development.
