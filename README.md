# Mini-SOAR (NestJS + Prisma + Postgres)

A lightweight SOAR-style backend that ingests security alerts, normalizes & scores IOCs, opens cases, enforces RBAC approvals for actions, and tracks metrics/SLA.

## Tech Stack
- NestJS (TypeScript)
- Prisma ORM
- PostgreSQL (Docker)
- JWT Auth + RBAC
- Thunder Client / Postman for API testing

## Features
- Auth: signup/login, JWT
- Alerts: public webhook ingest, IOC extraction, enrichment (mock), risk scoring, severity
- Cases: create/list/update, add notes, actions workflow
- Actions: request → approve (RBAC) → execute, audit logging
- Playbooks: create playbooks with steps (MVP)
- Metrics: alerts last 24h, cases by severity/status, actions by status, SLA (MTA/MTE)

## Run Locally
# Start PostgreSQL
docker compose up -d

# Install dependencies
cd backend
npm install

# Run database migrations
npx prisma migrate dev

# Start backend
npm run start:dev

# Prisma Studio
cd backend
npx prisma studio

# API Testing Flow (High Level)
1. Auth
- POST /auth/signup
- POST /auth/login → JWT

2. Alerts
- POST /alerts/webhook (public)
- GET /alerts (JWT)

3. Cases & Actions
- POST /cases/:caseId/actions (request action)
- PATCH /actions/:id/approve (RBAC enforced)
- PATCH /actions/:id/execute

4. Playbooks
- Create playbook
- Run playbook on case

5. Metrics
- GET /metrics/overview
- GET /metrics/sla

#RBAC Rules (MVP)
1. Analyst
- Ingest alerts
- Request actions
- View cases

2. Approver
- Approve actions
- Execute approved actions

Unauthorized access results in 401 / 403 responses.

# Design Highlights
- Strong separation of concerns (modules/services)
- Prisma enums used to enforce state correctness
- Guards + decorators for security
- Audit logs designed like real compliance systems
- Metrics optimized for SOC dashboards

#Screenshots
1. <img width="1920" height="1020" alt="Screenshot 2026-01-24 113155" src="https://github.com/user-attachments/assets/b9a522a9-e444-4630-9f53-b50252ffcaba" />
2. <img width="1920" height="1020" alt="Screenshot 2026-01-24 113717" src="https://github.com/user-attachments/assets/b6613077-54f1-4979-93f1-16a015bdd173" />
3. <img width="1915" height="960" alt="Screenshot 2026-01-24 114630" src="https://github.com/user-attachments/assets/d3d15052-81ab-4798-9a38-69ff2f0bc8ad" />




# Author
- Lokesh Sivaprakash
- Master’s in Information Systems
- Security Operations · SOAR · Backend Systems


