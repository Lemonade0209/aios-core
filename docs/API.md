# AIOS-Core API

All application endpoints are under `/api`. Except for signup, login, and logout, requests require:

```text
Authorization: Bearer <jwt>
```

## Authentication

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create user and return JWT |
| POST | `/api/auth/login` | Authenticate and return JWT |
| POST | `/api/auth/logout` | Client-side logout acknowledgement |
| GET | `/api/users/me` | Current user profile |

## Core Resources

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/projects` | List current user's projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/{projectId}` | Read project |
| PUT | `/api/projects/{projectId}` | Update project |
| DELETE | `/api/projects/{projectId}` | Delete project |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/{taskId}` | Read task |
| PUT | `/api/tasks/{taskId}` | Update task |
| DELETE | `/api/tasks/{taskId}` | Delete task |
| GET | `/api/notes` | List notes |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/{noteId}` | Read note |
| PUT | `/api/notes/{noteId}` | Update note |
| DELETE | `/api/notes/{noteId}` | Delete note |
| GET | `/api/documents` | List documents |
| POST | `/api/documents` | Create document |
| GET | `/api/documents/{documentId}` | Read document |
| PUT | `/api/documents/{documentId}` | Update document |
| DELETE | `/api/documents/{documentId}` | Delete document |
| POST | `/api/documents/{documentId}/summarize` | Generate or fallback document summary |

## Dashboard and AI

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/dashboard` | Dashboard data from real user records |
| POST | `/api/ai/chat` | Assistant answer grounded in internal context |
| POST | `/api/ai/summarize` | Generic summary endpoint |
| POST | `/api/search/semantic` | Semantic search contract with keyword fallback |

Ownership checks are enforced in service methods by querying resources with the authenticated user.
