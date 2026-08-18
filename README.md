# EventPulse

Event management API — auth, events, registrations, and real-time announcements over Socket.io.

## Structure

```
config/         db connection
models/         User, Event, Category, Registration, Message
controllers/    business logic
routes/         route definitions
middleware/     auth, roles, validation, error handling
utils/          AppError, asyncHandler
tests/          unit + integration
```

## Setup

1. `npm install`
2. Copy `.env.example` → `.env`, fill in `MONGO_URI` and `JWT_SECRET`
3. `npm run seed` — creates categories, sample events, and an admin user
   (`admin@eventpulse.com` / `admin123`)
4. `npm run dev`

## Tests

```
npm test
```
Unit tests need nothing extra. Integration tests spin up an in-memory MongoDB, so they need
internet access the first time they run.

## API

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`

**Events**
- `GET /api/events` — filter by `category`, `city`, `startDate`/`endDate`, `search`; sort with
  `sortBy=date|registrations`; paginate with `page`/`limit`
- `GET /api/events/:id`
- `POST` / `PATCH` / `DELETE /api/events/:id` — admin only

**Registrations**
- `POST /api/registrations` — `{ eventId }`
- `GET /api/registrations/my`
- `DELETE /api/registrations/:id`

**Announcements**
- `POST /api/events/:id/announcements` — admin only, `{ content }`
- `GET /api/events/:id/announcements`

**Health**
- `GET /health`

## Socket.io

- Join a room: `socket.emit('joinRoom', eventId)`
- Admin announcements broadcast to room `event:<id>` as `announcement`

## Deploy

MongoDB Atlas for the database, Vercel for the API, `MONGO_URI`/`JWT_SECRET` set as env vars.
`GET /health` confirms it's live and connected.

## Git

Conventional commits, tagged `v1.0.0`.

```
git remote add origin <your-repo-url>
git push -u origin main --tags
```
