# Mini-SOAR (NestJS + Prisma + Postgres)

A lightweight SOAR-style backend that ingests security alerts, normalizes & scores IOCs, opens cases, enforces RBAC approvals for actions, and tracks metrics/SLA.

## Tech Stack
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL (Docker)
- JWT Auth + RBAC
- Thunder Client / Postman for API testing

## Features
- **Auth**: signup/login, JWT
- **Alerts**: public webhook ingest, IOC extraction, enrichment (mock), risk scoring, severity
- **Cases**: create/list/update, add notes, actions workflow
- **Actions**: request → approve (RBAC) → execute, audit logging
- **Playbooks**: create playbooks with steps (MVP)
- **Metrics**: alerts last 24h, cases by severity/status, actions by status, SLA (MTA/MTE)

## Run Locally
### 1) Start Postgres
```bash
docker compose up -d
