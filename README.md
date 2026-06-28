# AIOS-Core

AIOS-Core는 프로젝트, 작업, 노트, 문서를 한 곳에서 관리하고 AI 기반 요약, 검색, 추천을 제공하는 개인 생산성 플랫폼입니다.

목표는 흩어진 업무 정보를 하나의 작업 공간으로 모으고, 사용자가 오늘 해야 할 일과 프로젝트 상태를 빠르게 파악할 수 있게 만드는 것입니다.

## 주요 기능

- 회원가입, 로그인, 로그아웃
- JWT 기반 인증과 보호 라우트
- 사용자별 데이터 격리
- 프로젝트 생성, 조회, 수정, 삭제
- 작업 생성, 조회, 수정, 삭제
- 작업 우선순위, 상태, 마감일, 기한 초과 감지
- 노트 작성, 태그, 프로젝트 연결
- 문서 작성, 프로젝트 연결, AI 요약
- 대시보드: 오늘 작업, 기한 초과 작업, 프로젝트 진행률, 최근 노트와 문서
- AI 어시스턴트: 내부 프로젝트/작업/노트/문서 기반 질의응답
- AI 검색: 현재 MVP는 키워드 기반 fallback을 제공하며, 향후 임베딩 기반 검색으로 확장 가능
- 영어/한국어 UI 언어 선택

## 기술 스택

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication

### AI

- OpenAI API
- AI Summary
- AI Assistant
- Semantic Search 준비 구조
- RAG 스타일 context retrieval 확장 가능 구조

### Local Infra

- Docker Compose
- PostgreSQL
- pgvector PostgreSQL image

## 저장소 구조

```text
aios-core/
├── frontend/
├── backend/
├── docker/
├── docs/
├── AGENTS.md
└── README.md
```

### frontend/

React + TypeScript + Vite 기반 웹 애플리케이션입니다.

### backend/

Spring Boot 기반 API 서버입니다.

### docker/

로컬 개발용 PostgreSQL Docker Compose 설정을 포함합니다.

### docs/

API, ERD, 개발 로그, 검증 결과 등 프로젝트 문서를 포함합니다.

## 백엔드 구조

백엔드는 modular monolith 구조를 사용합니다.

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

기본 흐름은 다음과 같습니다.

```text
Controller -> DTO -> Service -> Repository -> Entity
```

컨트롤러는 요청/응답 처리에 집중하고, 비즈니스 로직과 사용자 소유권 검증은 서비스 계층에서 처리합니다.

## 프론트엔드 구조

프론트엔드는 기능 중심 구조를 사용합니다.

```text
frontend/src/
├── api/
├── components/
├── features/
├── i18n/
├── layouts/
├── pages/
├── routes/
├── types/
└── utils/
```

주요 화면은 다음과 같습니다.

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

## 환경 변수

실제 비밀 값은 커밋하지 말고 로컬 환경 변수 또는 로컬 `.env` 파일로 관리합니다.

### Backend

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/aios_core
DATABASE_USERNAME=aios
DATABASE_PASSWORD=aios
JWT_SECRET=replace-with-secure-secret
OPENAI_API_KEY=replace-with-your-openai-api-key
FRONTEND_ORIGIN=http://localhost:5173
```

`OPENAI_API_KEY`가 없으면 AI 요약, 어시스턴트, 검색 기능은 deterministic fallback 동작을 사용합니다.

### Frontend

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 로컬 실행

### 1. PostgreSQL 실행

```bash
cd docker
docker compose up -d
```

### 2. Backend 실행

```bash
cd backend
./gradlew bootRun
```

기본 API 주소:

```text
http://localhost:8080
```

### 3. Frontend 실행

```bash
cd frontend
npm install
npm run dev
```

기본 웹 주소:

```text
http://localhost:5173
```

## 빌드와 검증

### Backend

```bash
cd backend
./gradlew clean build
```

### Frontend

```bash
cd frontend
npm install
npm run lint
npm run build
```

### 검증 기록

최근 로컬 검증 결과는 `docs/VERIFICATION.md`에서 확인할 수 있습니다.

## 보안 원칙

- API key, JWT secret, DB password, 로컬 `.env` 파일은 커밋하지 않습니다.
- 비밀번호는 BCrypt로 해시합니다.
- 보호 API는 JWT 인증을 요구합니다.
- 사용자 소유 리소스는 현재 사용자 기준으로만 조회하고 수정합니다.
- 요청 body는 서버에서 검증합니다.
- 프론트엔드에 stack trace를 노출하지 않습니다.
- 개발 환경 CORS는 로컬 프론트엔드 origin으로 제한합니다.

## 현재 MVP 제한사항

- Semantic search는 현재 키워드 기반 fallback으로 동작합니다.
- OpenAI 기반 응답 품질은 `OPENAI_API_KEY` 설정 여부에 따라 달라집니다.
- Docker Desktop 또는 Docker Engine이 실행 중이어야 로컬 PostgreSQL을 사용할 수 있습니다.
- 브라우저 기반 E2E 테스트는 아직 별도 자동화되어 있지 않습니다.

## 향후 방향

- 임베딩 생성과 pgvector 기반 semantic search
- AI 추천 품질 개선
- 알림과 고급 분석
- 팀 workspace
- 외부 서비스 연동

## 라이선스

라이선스는 아직 지정되지 않았습니다.
