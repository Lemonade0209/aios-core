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