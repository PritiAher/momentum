# Momentum 

A daily-use placement-prep tracker: DSA tracker, task manager, calendar,
topic progress, auto-revision queue, and analytics. Built for < 10 min/day
upkeep.


## Project structure

```
momentum/
├── backend/
│   ├── server.js                 # Express app entry
│   ├── src/
│   │   ├── config/db.js          # MongoDB Atlas connection
│   │   ├── models/                # User, Problem, Topic, Task, CalendarEvent, RevisionQueue, Settings
│   │   ├── middleware/            # auth (protect), errorHandler
│   │   ├── controllers/           # authController (register/login/logout/me)
│   │   ├── routes/                # authRoutes + index.js (aggregator, has commented
│   │   │                          #   placeholders for each future module's routes)
│   │   └── utils/generateToken.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── main.tsx / App.tsx     # Router + React Query provider
    │   ├── layouts/DashboardLayout.tsx
    │   ├── components/layout/     # Sidebar, ProtectedRoute
    │   ├── pages/                 # Login, Register, Dashboard, ComingNext
    │   ├── store/authStore.ts     # Zustand — user session state
    │   ├── lib/api.ts             # Axios client (withCredentials for cookie auth)
    │   ├── types/index.ts         # Shared TS types (mirrors backend schemas)
    │   └── styles/index.css       # Tailwind + design tokens
    └── .env.example
```

## Local setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: paste your MongoDB Atlas URI into MONGO_URI,
# and set JWT_SECRET to any long random string.
npm install
npm run dev
```

Server runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`. In dev, Vite proxies `/api/*` to
`localhost:5000`, so you don't need to set `VITE_API_URL` locally.

### First run

1. Start backend, then frontend.
2. Visit `http://localhost:5173/register`, create your account.
3. You'll land on the dashboard shell — confirms auth + routing + DB
   connection are all working end to end.


## Deployment

- **Frontend → Vercel**: set `VITE_API_URL` to your Render backend URL.
- **Backend → Render**: set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your
  Vercel URL) as environment variables.
- **Database → MongoDB Atlas**: whitelist Render's outbound IPs (or `0.0.0.0/0`
  for simplicity on a personal project) in Atlas Network Access.

