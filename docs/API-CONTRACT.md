# ReanMate — API Contract (Frontend ⇄ Node.js/MongoDB Backend)

This document defines the HTTP API the backend team should implement.
Authentication is implemented in NestJS with Better Auth and MongoDB. Lesson data remains mocked; every mock function in
[`lib/api/index.ts`](../lib/api/index.ts) maps 1-to-1 to an endpoint here, and all
request/response shapes are defined in [`lib/types.ts`](../lib/types.ts).

**Integration rule:** when the backend is ready, only `lib/api/index.ts`
(and `lib/progress.ts` for persistence) should change — no page/component rewrites.

The frontend proxies `/auth/*` to server-only `API_URL` (default `http://localhost:4000`).
The remaining endpoints below are the planned lesson API.

---

## Conventions

- JSON everywhere, UTF-8 (content is Khmer text).
- Auth: Better Auth email/password endpoints with an `httpOnly` session cookie.
- Errors: `{ "error": { "code": string, "message": string } }` with proper HTTP status.
- IDs are strings (Mongo `_id` serialized). The mock uses readable ids like `g10-math-c1`; real ids can be ObjectIds.

## Roles

- `student` — default role at signup.
- `admin` — only role allowed on `/admin/*` endpoints.

---

## 1. Auth

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/auth/sign-up/email` | `{ name, email, password }` | `{ user, token }` + session cookie |
| POST | `/auth/sign-in/email` | `{ email, password }` | `{ user, token, redirect }` + session cookie |
| GET | `/auth/get-session` | — | `{ user, session }` or `null` |
| GET | `/auth/me` | — | `{ user: { id, email, role, displayName } }` or 401 |
| POST | `/auth/sign-out` | `{}` | `{ success: true }` + cleared cookie |

Self-service password reset and email verification are not enabled. Passwords are
salted scrypt hashes managed by Better Auth; never replace them with plaintext.
Registration always assigns `student`; operators can promote a registered account
with `npm run admin:promote -- email`. Auth errors use Better Auth `{ code, message }`
or NestJS `{ statusCode, message, error }` shapes. Auth responses are never cached.

## 2. Catalog (student)

| Method | Path | Notes | Response |
|--------|------|-------|----------|
| GET | `/chapters?grade=10&subject=math` | **Only `status: "approved"`** chapters; sorted by `sortOrder` | `Chapter[]` (omit `sourceText` for students) |
| GET | `/chapters/:id` | 404 if draft and requester is not admin | `Chapter` |

`Chapter` shape: see `lib/types.ts` (`grade`, `subject`, `title`, `sortOrder`,
`summary`, `moeysEmbedUrl`, `moeysCredit`, `status`, `questions[]`).
`moeysEmbedUrl` is a YouTube embed/watch URL, or an `ebc.edu.kh` lesson page
when YouTube has no matching episode.

Questions include `correctIndex` + `explanation` because the quiz gives
immediate client-side feedback. If we later care about answer leaking, we can
split into a `/check` endpoint — not needed for demo.

## 3. ReanMate chat (study buddy)

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/chapters/:id/messages` | — | `ChatMessage[]` (this user, this chapter) |
| POST | `/chapters/:id/messages` | `{ content }` | `{ userMessage: ChatMessage, assistantMessage: ChatMessage }` |

Backend responsibilities on POST:

1. Store the user message.
2. Call the AI provider (server-side key) with a Khmer **study-buddy** system prompt
   (មិត្ត AI — peer helper, not a teacher),
   grounded in the chapter's `sourceText` + `summary`. Instruct the model to
   admit when the answer is not in the material.
3. Store and return the assistant message.

Frontend currently fakes this with canned replies (`content/canned-replies.json`)
and saves history in `localStorage` (`lib/progress.ts`).

## 4. Quiz

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/chapters/:id/quiz/attempts` | `{ answers: Record<questionId, optionIndex> }` | `QuizAttempt` + `{ chapterCompleted: boolean }` |
| GET | `/me/progress` | — | `ChapterProgress[]` |

Completion rule: an attempt with **score ≥ 70%** marks the chapter completed
(keep the earliest `completedAt`; store best score).

## 5. Admin

All require `admin` role.

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/admin/chapters` | — | `Chapter[]` (drafts included, `sourceText` included) |
| POST | `/admin/chapters` | Chapter fields minus `id`/`questions` | `Chapter` |
| PATCH | `/admin/chapters/:id` | Partial chapter (incl. `status`, `questions`) | `Chapter` |
| POST | `/admin/chapters/:id/generate` | `{}` (uses stored `sourceText`) | `GeneratedChapterContent` = `{ summary, questions[] }` |

`generate` calls the AI provider to produce a Khmer summary + 5–10 MCQs
(each: `prompt`, `options[4]`, `correctIndex`, `explanation`) **from the
chapter's `sourceText`**. Admin edits then approves via PATCH.

## 6. Suggested Mongo collections

| Collection | Mirrors type | Notes |
|------------|--------------|-------|
| `user` | Better Auth user | `email` (unique), `name`, `role`, timestamps |
| `account` | Better Auth credential | `userId`, `providerId`, salted password hash |
| `session` | Better Auth session | unique token, user reference, expiry TTL |
| `verification` | Better Auth verification | expiry TTL |
| `rateLimit` | Better Auth rate limiter | per-IP endpoint counters |
| `chapters` | `Chapter` | embed `questions` array (small, read together) |
| `chatmessages` | `ChatMessage` | index `{ userId, chapterId, createdAt }` |
| `quizattempts` | `QuizAttempt` | index `{ userId, chapterId }` |
| `progress` | `ChapterProgress` | or derive from attempts |

## 7. What the frontend will swap

| Mock today | Real tomorrow |
|------------|----------------|
| `lib/api/index.ts` reads `content/*.json` | `fetch` calls to the endpoints above |
| `lib/progress.ts` localStorage | `/me/progress`, `/chapters/:id/messages` |
| Login form | real Better Auth endpoints + httpOnly cookie |
| Canned ReanMate replies | real AI reply from POST `/messages` |
| `generateChapterContent()` fake delay | real POST `/admin/chapters/:id/generate` |
