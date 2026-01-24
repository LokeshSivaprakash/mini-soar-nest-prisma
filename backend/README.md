# Mini-SOAR (Security Orchestration + Automation MVP)

A lightweight SOAR-style backend built with **NestJS + Prisma + PostgreSQL** to simulate real SOC workflows:
- ingest alerts (public webhook)
- normalize + extract IOCs
- create/manage cases
- request/approve/execute response actions (RBAC)
- audit logging
- playbooks
- operational metrics (overview + SLA-style timing)

## Tech Stack
- **NestJS (TypeScript)** – API + modules
- **Prisma ORM** – DB schema + migrations
- **PostgreSQL** – data store (Docker)
- **JWT Auth** – authentication
- **RBAC** – role-based approvals (Analyst vs Manager)

## Key Features
- ✅ Public alert webhook: `POST /alerts/webhook`
- ✅ JWT-secured endpoints for SOC operations
- ✅ Case workflow statuses: `NEW → IN_TRIAGE → INVESTIGATING → CONTAINED → CLOSED`
- ✅ Action lifecycle: `REQUESTED → APPROVED/REJECTED → EXECUTED`
- ✅ Metrics:
  - alerts last 24h + total
  - open cases + severity breakdown
  - requested/approved/executed actions
  - mean time to approve/execute (sample-based)

## Quick Start

### 1) Start Postgres
```bash
docker compose up -d
