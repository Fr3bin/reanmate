# ReanMate authentication API

NestJS + Better Auth + MongoDB Atlas. The Next.js frontend proxies `/auth/*`
to this API. Accounts, password hashes, sessions, verification records, and
rate-limit records live in MongoDB, not browser storage.

## Run locally

Use Node.js 24 LTS (24.15+ or the engine version required by NestJS) and npm.

```sh
npm install
cp .env.example .env  # only when .env does not already exist
# Set MONGODB_URI and a random BETTER_AUTH_SECRET (at least 32 characters).
npm run dev
```

In `../frontend`, configure `API_URL=http://localhost:4000` in `.env.local`, then
run `npm install` and `npm run dev`. Open `http://localhost:3000/login`.
Use the same hostname consistently: `localhost` and `127.0.0.1` have different cookies.

For a production build: `npm run build && npm start` in each application.

## Atlas configuration

- Project: **ReanMate**
- Cluster: **reanmate-cluster**, free M0 tier, AWS Singapore
- Database: **reanmate**
- Database user: **reanmate-app**, `readWrite` on `reanmate` only
- Network access: current development IP only; add your new IP if it changes.

The configured local `.env` contains the connection string and generated secret.
It is ignored by Git and readable only by the file owner. Never commit or paste it
into frontend code. `.env.example` contains placeholders for teammates.

MongoDB collections and indexes are created on API startup. Atlas supports the
transactions used during signup. A standalone local MongoDB instance requires
`MONGODB_TRANSACTIONS=false`; a local replica set can use transactions.

## Authentication and access

- Email/password registration signs in the new student automatically.
- Email/password sign-in is the standard login path. Email OTP is reserved for
  password reset, not normal sign-in.
- Better Auth hashes passwords with salted scrypt; plaintext passwords are never stored.
- Passwords must contain 8–128 characters; names must contain 1–100 characters.
- All self-registered accounts receive `student`. Client-supplied roles are ignored.
- Sessions use HttpOnly, SameSite=Lax cookies and expire after seven days.
  Active browser sessions refresh after a day. Production cookies also use Secure.
- Session reads query MongoDB; revoked sessions and role changes take effect immediately.
- Login and signup are rate limited (10 and 5 requests per minute per IP respectively).
- Mutations reject untrusted origins. CORS permits the configured frontend origin.
- Nest controllers require authentication unless decorated with `@Public()`.
  Use `@Roles('admin')` for every future administrative API operation.
- Next.js checks `/home`, `/learn/*`, and `/admin/*` on the server, including
  client navigation. Students are redirected away from admin pages.

Email verification is not enabled; the existing requirements specify
email/password auth without a required email verification step. Self-service
password recovery uses a one-time email code. Do not edit password hashes by hand.

## Grant admin access

First register the account through the ReanMate signup form. An operator with the
backend environment can explicitly promote that account:

```sh
npm run admin:promote -- registered-user@example.com
```

No default admin password or demo login exists. Your MongoDB Atlas account is
separate from a ReanMate application account.

## Tests

```sh
npm test
```

Integration tests use the configured MongoDB database and a temporary API port.
They create uniquely named temporary accounts and delete only their own records;
they never drop the database. They verify registration, password hashes, cookie
attributes, invalid input, duplicate email, origin checks, session persistence
across restart, logout/revocation, expiration, rate limits, and role enforcement.

## Deployment environment

Set `MONGODB_URI`, `MONGODB_DB_NAME`, and `BETTER_AUTH_SECRET` on the backend.
Set `BETTER_AUTH_URL` and `CORS_ORIGIN` to the public HTTPS frontend origin.
Set frontend `API_URL` to the backend address reachable by the Next.js server.
Use `NODE_ENV=production`, allow the backend host's outbound IP in Atlas, and set
`HOST=0.0.0.0` if the hosting platform requires an externally bound port.
`TRUST_PROXY` defaults to `loopback`; for a remote proxy, set its exact IP/subnet
and restrict direct backend ingress. Do not trust arbitrary forwarded headers.
Keep the session secret stable across restarts and replicas.

Lesson content, tutor responses, quiz progress, and chapter editing remain the
frontend's existing mocks. This implementation completes authentication only.
