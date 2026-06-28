# AIOS-Core Backend

Spring Boot modular monolith for AIOS-Core.

## Run

```bash
./gradlew bootRun
```

The default datasource is:

```text
jdbc:postgresql://localhost:5432/aios_core
```

Set these environment variables for local development:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/aios_core
DATABASE_USERNAME=aios
DATABASE_PASSWORD=aios
JWT_SECRET=replace-with-a-long-secret
OPENAI_API_KEY=
FRONTEND_ORIGIN=http://localhost:5173
```

When `OPENAI_API_KEY` is absent, summaries and assistant answers use deterministic local fallback behavior.

## Verify

```bash
./gradlew test
./gradlew build
```
