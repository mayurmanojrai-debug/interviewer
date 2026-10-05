# INTERVIEWIQ — AI-Powered Adaptive Mock Interview & Career Readiness Platform

PBL HackExpo PS-15. Full-stack app: React (Vite) + Node API + Spring Boot sources + MySQL schema.

## Quick Start (Windows)

```powershell
# 1) Backend API (pure Node, no install needed)
node backend/server.js
# -> http://localhost:8080/api/health  {"status":"UP"}

# 2) Frontend dev
cd frontend; npm install; npm run dev
# -> http://localhost:5173  (proxies /api to :8080)
```

Demo login: `demo@interviewiq.com` / `Demo@123` (seeded: 5 interviews, skills, roadmap, resume, achievements).
Admin: `admin@interviewiq.com` / `Admin@123`.

## Full-stack layout

- `frontend/` — React + Vite app. `index.html` is here (repo root for Vercel/Netlify/Render static).
- `backend/server.js` — runnable REST API (auth, interviews, evaluation, adaptive, skills, roadmap, resume, copilot, admin).
- `backend/src/main/java/...` — Spring Boot 3 / JPA source (same API) for judges + MySQL deployment.
- `database/schema.sql` — MySQL schema. `backend/.env.example` shows DB_URL/JWT config.
- `render.yaml` — single-service Render deploy: builds frontend, serves `dist/` from Node.

## 5-minute judge demo

1. Landing -> Login (demo account) 2. Dashboard readiness + trend
3. Start Interview (Full Stack, Adaptive, 5) 4. Answer -> AI score + adaptive reason
5. Complete -> report + roadmap 6. Copilot: "What should I improve?"
7. History -> Report -> Print recruiter report.
