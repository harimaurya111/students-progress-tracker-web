# Progress Tracker (MERN)
To-do + habit tracker + progress journal. Each user only sees their own data.

## Folder structure
```
server/                     (Express + MongoDB, MVC)
  server.js                 starts the app (env check + DB connect + listen)
  app.js                    express setup: middleware, routes, serves client build
  config/db.js              MongoDB connection
  models/                   User.js, Task.js            -> data (M)
  controllers/              auth / task / stats logic    -> logic (C)
  routes/                   URL -> controller mapping
  middleware/               auth (JWT), rateLimiter, errorHandler
  utils/                    dates, streaks, token, ApiError, asyncHandler
client/src/                 (React + Vite)                -> views (V)
  pages/  components/  context/  services/  utils/
```

## Run locally
1. MongoDB running locally (or an Atlas URI).
2. Server: `cd server && cp .env.example .env` (set JWT_SECRET) `&& npm i && npm run dev` → http://localhost:5000
3. Client: `cd client && npm i && npm run dev` → http://localhost:5173 (proxies /api to the server)

## Deploy (one service, e.g. Render)
- Database: MongoDB Atlas (free) → copy the connection string.
- Build command: `npm run build`   Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
- The server serves the React build, so no CORS / API URL setup is needed.

## Notes
- Task dates are stored as `YYYY-MM-DD` strings, so a "day" never shifts with timezones.
- Streaks, totals and percentages are calculated from tasks on request, not stored.
- Streak: a day counts when at least one task is marked done. Today without a done task yet does not break the streak; a fully missed day does.
