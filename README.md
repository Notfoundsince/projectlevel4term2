# EventPulse

Event management API — auth, events, registrations, categories, and real-time announcements
over Socket.io.

## Structure

```
config/         db connection, Swagger config
models/         User, Event, Category, Registration, Message
controllers/    business logic
routes/         route definitions
middleware/     auth, roles, validation, error handling, 404
utils/          AppError, asyncHandler
tests/          unit + integration
postman/        Postman collection + environment
```

## Setup

1. `npm install`
2. Copy `.env.example` → `.env`, fill in `MONGO_URI` and `JWT_SECRET`
3. `npm run seed` — creates categories, sample events, and an admin user
   (`admin@eventpulse.com` / `admin123`)
4. `npm run dev` — runs on `http://localhost:3000`

## Tests

```
npm test
```
Unit tests need nothing extra. Integration tests spin up an in-memory MongoDB, so they need
internet access the first time they run.

## API Docs

Interactive Swagger UI at `GET /api-docs` once the server's running.

## Postman

Import `postman/EventPulse.postman_collection.json` and
`postman/EventPulse.postman_environment.json`. The environment sets `baseUrl` and an empty
`token` — logging in via the Auth folder fills `token` in automatically for the rest of the
collection.

## API

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Events**
- `GET /api/events` — filter by `category`, `city`, `startDate`/`endDate`, `search`; sort with
  `sortBy=date|registrations` and `order=asc|desc`; paginate with `page`/`limit`
- `GET /api/events/:id` — populated with `category` and `organizer`
- `POST` / `PATCH` / `DELETE /api/events/:id` — admin only

**Registrations**
- `POST /api/registrations` — `{ eventId }`
- `GET /api/registrations/my`
- `DELETE /api/registrations/:id`

**Categories**
- `GET /api/categories`
- `POST /api/categories` — admin only, `{ name }`

**Announcements**
- `POST /api/announcements` — admin only, `{ eventId, text }`
- `GET /api/announcements/:eventId` — public

**Health**
- `GET /health`

## Socket.io

- Join a room: `socket.emit('join-event', eventId)`
- Admin announcements broadcast to room `eventId` as `announcement`
- Only runs on a real running process (`npm run dev` / a persistent host) — not on Vercel

## Deploy

MongoDB Atlas for the database, Vercel for the API, `MONGO_URI`/`JWT_SECRET` set as env vars.
`GET /health` confirms it's live and connected.

## Git

Conventional commits, tagged `v1.0.0`.

```
git remote add origin <your-repo-url>
git push -u origin main --tags
```
