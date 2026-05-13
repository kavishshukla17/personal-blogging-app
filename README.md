# Personal blogging app

A small full-stack blog: **Express + MongoDB** API with **JWT** auth, **pagination**, and a **React (Vite)** frontend. The same repo deploys to **Vercel** as a static site plus a serverless API.

## Repository layout

| Folder | Role |
|--------|------|
| `blog-api/` | REST API (Express, Mongoose, express-validator) |
| `blog-frontend/` | SPA (React, TypeScript, Vite) |
| `api/server.js` | Vercel serverless entry (imports the Express app) |
| `vercel.json` | Vercel build, output directory, `/api` rewrites |

## Features

- **Articles** — CRUD with `title`, `content`, `tags`, `isPublished`, `publishedAt`, timestamps, optional `author` (user id).
- **Auth** — Register / login; **JWT** required for `POST`, `PUT`, `DELETE` on articles. Users may only **edit/delete their own** articles.
- **Pagination** — `GET /api/articles?page=1&limit=10` (limit capped at 50).
- **Validation** — express-validator on create and update payloads.
- **UI** — Dark editorial theme, auth forms, paginated list, create / edit / delete for owned posts.

## Local development

### Prerequisites

- Node.js 20+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)

### 1. API (`blog-api`)

```bash
cd blog-api
cp .env.example .env
```

Edit **`.env`**: set `MONGO_URI`, `JWT_SECRET`, and optionally `PORT` (default `5000`). On some networks, DNS for Atlas is handled in code for local runs.

```bash
npm install
npm run dev
```

API base path is **`/api`**:

- `POST /api/auth/register` — `{ "email", "password" }` (password ≥ 6 characters)
- `POST /api/auth/login` — same shape; returns `{ token, user }`
- `GET /api/articles?page=1&limit=10`
- `GET /api/articles/:id`
- `POST /api/articles` — header `Authorization: Bearer <token>`
- `PUT /api/articles/:id` — Bearer token; owner only
- `DELETE /api/articles/:id` — Bearer token; owner only

### 2. Frontend (`blog-frontend`)

```bash
cd blog-frontend
npm install
```

Optional: copy **`.env.example`** to **`.env.development`** and set `VITE_API_URL=http://localhost:5000` if you use a non-default API port.

```bash
npm run dev
```

Open the URL Vite prints (often `http://localhost:5173`). Production builds call **`/api`** on the same host; in dev, requests go to `http://localhost:5000/api` by default.

## Deploying on Vercel

1. Import this GitHub repo into Vercel.
2. **Root directory**: repository root (`.`) — not `blog-frontend` alone — so `vercel.json` and `api/server.js` apply.
3. Under **Settings → Environment Variables** (Production), set at least:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Deploy. Pushes to the connected **production branch** (e.g. `main`) trigger new deployments.

Optional: `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` (custom domain CORS). See `blog-api/.env.example`.

## Security notes

- Never commit **`blog-api/.env`** (it is listed in `.gitignore`).
- Use a long, random `JWT_SECRET` in production.
- Restrict MongoDB Atlas **Network Access** appropriately; use strong database user passwords.

## Scripts summary

| Location | Command | Purpose |
|----------|---------|---------|
| `blog-api` | `npm run dev` | Nodemon + local API on port 5000 |
| `blog-frontend` | `npm run dev` | Vite dev server |
| `blog-frontend` | `npm run build` | Production static build → `dist/` |

## License

Personal Project
