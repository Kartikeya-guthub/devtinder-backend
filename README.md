# DevTinder Backend

DevTinder is an Express + MongoDB backend for a developer connection platform (think “Tinder for developers”). It supports signup/login, profile updates, connection requests, and a discovery feed.



## What This Repo Demonstrates 

- **Separation of concerns**: routers, models, middleware, and validation utilities are split cleanly.
- **Real authentication**: JWT + httpOnly cookie, middleware-protected routes.
- **Domain modeling beyond CRUD**: a `ConnectionRequest` model with explicit statuses and constraints.
- **Feed logic**: excludes users you already interacted with (sent/received requests) and supports pagination.

## Non-goals (current scope)

These are not implemented yet (by design):

- Background processing / async workflows (queues, retries, outbox pattern)
- Notifications (email/push/websocket)
- Rate limiting, audit logs, advanced observability
- Full test suite / CI
- OAuth / email verification / password reset

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) + cookies (`cookie-parser`)
- Password hashing with `bcrypt`
- Input validation with `validator`

## Architecture (high level)

Request flow:

1. **Router** receives request (`src/router/*`)
2. **Auth middleware** (`src/middlewares/auth.js`) verifies JWT from cookie and attaches `req.user`
3. **Model layer** (`src/models/*`) handles persistence + domain constraints
4. **Validation utilities** (`src/utils/validation.js`) enforce allowed inputs
5. **Response** returns JSON (or a simple message)

Data flow is synchronous request/response only — there are no background workers in this repo.

## Domain Model Notes

### Users

The `User` model stores profile fields and credentials.

- Passwords are stored **hashed** (bcrypt)
- Email is normalized to lowercase + validated
- Skills is an array with a “max 10 + unique” constraint

### Connection Requests (state machine)

`ConnectionRequest` represents a directed request from one user to another with an explicit `status` enum:

`Ignore | Interested | Accepted | Rejected`

Guards implemented in the current code:

- A user cannot send a request to themselves
- You cannot create duplicate requests between two users in either direction
- Only the recipient of an `Interested` request can respond with `Accepted` / `Rejected`

## Setup & Installation

### 1) Install

```bash
npm install
```

### 2) Environment variables

Create a `.env` in the repo root with:

```env
# Server
port=3000

# MongoDB
database_connection_string=mongodb://127.0.0.1:27017/devtinder

# JWT
jwt_secret=replace-me-with-a-long-random-secret
```

These env vars configure server port, MongoDB connection, and JWT signing.

### 3) Run

```bash
npm run dev
```

## API Endpoints

All endpoints except `/signup` and `/login` require auth (JWT cookie).

### Auth

- `POST /signup` — Register a new user
- `POST /login` — Login and set JWT cookie (`httpOnly`)
- `POST /logout` — Clear auth cookie

### Profile

- `GET /profile/view` — View logged-in user's profile
- `PATCH /profile/edit` — Edit profile fields
- `PATCH /profile/password` — Change password (new password is hashed)

`PATCH /profile/edit` accepts:

- `firstName`, `lastName`, `age`, `gender`, `skills`, `emailId`, `photoUrl`, `bio`

### Connection Requests

- `POST /request/send/:status/:toUserId`
  - `status` is one of: `Ignore` or `Interested`
- `POST /request/respond/:status/:requestId`
  - `status` is one of: `Accepted` or `Rejected`

### User

- `GET /user/requests/received` — List received connection requests (status `Interested`)
- `GET /user/connections` — List accepted connections
- `GET /feed?page=1&limit=10` — Discover new users (paginated; `limit` is capped)

## Guarantees & Constraints (current behavior)

- Passwords are never stored in plaintext
- Auth token is stored in an httpOnly cookie (not readable from JS)
- Feed excludes users you already have a `ConnectionRequest` relationship with
- Connection status is an explicit enum (no free-form strings)

## Tradeoffs (why this repo focuses on fundamentals)

- **Synchronous-only**: no queue/outbox, so there’s no async delivery or retries
- **Limited failure story**: errors are returned as JSON, but there’s no standardized error format or tracing
- **No tests/CI**: correctness relies on manual testing today

These tradeoffs are acceptable for a first backend repo, and they also clearly show what the next “system design” steps should be.

## Possible Extensions

If you want to evolve this repo into a stronger systems repo:

- Add OpenAPI/Swagger + request/response examples
- Add a proper error envelope + request IDs + structured logging
- Add integration tests (Jest + Supertest) and basic CI
- Add rate limiting + security headers + CSRF strategy (if using cookies cross-site)
- Add async notifications (queue + worker) when a request is `Interested/Accepted`
- Consider an outbox pattern to guarantee “DB write + event publish” consistency

## Folder Structure

```
src/
  app.js                 # Express app entry point
  config/
    database.js          # MongoDB connection setup
  middlewares/
    auth.js              # JWT authentication middleware
  models/
    user.js              # User schema + auth helpers
    connectionRequest.js # Connection request schema
  router/
    auth.js              # Auth routes (signup, login, logout)
    profile.js           # Profile routes (view, edit, password)
    request.js           # Connection request routes
    user.js              # User routes (requests, connections, feed)
  utils/
    validation.js        # Data validation utilities
```

## Author

Kartikeya Sharma

## License

ISC
