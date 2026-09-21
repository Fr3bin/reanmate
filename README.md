# ReanMate

Web app for Cambodian grade 10–12 students to study **Mathematics** and
**History** in Khmer — aligned with MoEYS textbook chapters. Per chapter:
watch the official MoEYS video, ask **ReanMate** (មិត្ត AI — a study buddy,
not a teacher), then take an MCQ quiz with explanations.

**Status:** frontend UI with real Better Auth email/password sessions. Lesson
content remains mocked while the rest of the Node.js + MongoDB API is built using
[docs/API-CONTRACT.md](docs/API-CONTRACT.md).

## Run

```bash
npm install
# Configure API_URL in .env.local and start ../backend first.
npm run dev
```

Start the NestJS API in `../backend` using its [setup instructions](../backend/README.md).
Set `API_URL=http://localhost:4000` in `.env.local`.
Open http://localhost:3000 and create an account or sign in on the login page.
Learning routes require a valid backend session; admin routes require the admin role.

```bash
npm run build
npm start
```

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Khmer font: Kantumruy Pro
- Mock data: `content/*.json`; client persistence via `localStorage`
- Listen button: browser `speechSynthesis` (`km-KH`), graceful fallback

## Project layout

```text
app/                    # routes (landing, login, home, learn, admin)
components/             # UI components (chat, quiz, editor, cards…)
content/                # mock chapters, canned ReanMate replies, generated sample
lib/api/                # data access — swap mocks for fetch calls here
lib/types.ts            # shared API types (contract with backend)
lib/progress.ts         # localStorage progress/chat (until backend)
docs/                   # SRS, UI design brief, API contract
```

## Key documents

- [docs/AI-Tutor-SRS.md](docs/AI-Tutor-SRS.md) — requirements
- [docs/AI-Tutor-UI-Design-Brief.md](docs/AI-Tutor-UI-Design-Brief.md) — design decisions
- [docs/API-CONTRACT.md](docs/API-CONTRACT.md) — endpoints for the backend team

## Demo content

Grade 10 only for now: 1 Math chapter (អនុគមន៍) + 1 History chapter
(អាណាចក្រហ្វូណន), each with a 5-question quiz. Structure supports
3 chapters × 2 subjects × 3 grades (18 chapters).

## Backend handoff

As the Node.js + MongoDB API grows, keep the existing UI and extend only:

1. **`lib/api/index.ts`** — replace mock JSON reads with `fetch` calls that match
   [docs/API-CONTRACT.md](docs/API-CONTRACT.md). Keep the exported function
   names and return types in `lib/types.ts`.
2. **`lib/progress.ts`** — move quiz scores, last-visited chapter, and chat
   history from `localStorage` to authenticated API calls.

Demo sign-in shortcuts are disabled. Register as a student, or have an operator
promote a registered account using the backend `admin:promote` command.

Students only see chapters with `status: "approved"`. Drafts stay on the admin
list until published.

## For teammates (frontend review)

This frontend requires the **NestJS authentication backend and MongoDB**.
Lesson content and AI interactions still use sample data.

```bash
git clone <this-repo-url>
cd "AI Tutor"   # or the folder name after clone
npm install
npm run dev
```

Open http://localhost:3000 in **Chrome**.

### Student flow to click through

1. Landing → **ចាប់ផ្តើមរៀន**
2. Login page → create an account or sign in
3. Home → **ថ្នាក់ទី១០** → **គណិតវិទ្យា** or **ប្រវត្តិវិទ្យា**
4. Open a chapter → video placeholder + summary → **សួរមិត្ត AI**
5. **ចាប់ផ្តើមតេស្ត** → answer all questions → finish (pass at ≥ 70%)

Demo chapters: Grade 10 Math (**អនុគមន៍**) and Grade 10 History (**អាណាចក្រហ្វូណន**). Grades 11–12 show an empty “coming soon” state on purpose.

### Admin flow to click through

1. Landing → login → sign in with an admin account
2. Chapter list → **កែសម្រួល** or **បង្កើតមេរៀនថ្មី**
3. Paste any source text → **បង្កើតដោយ AI** (mocked delay + sample content)
4. Save draft or approve — the notice is UI-only; it does not write a database yet

### What is mocked (on purpose)

| Area | Current behavior |
|------|------------------|
| Authentication (live) | Better Auth + MongoDB, HttpOnly session cookie, protected student/admin routes |
| ReanMate chat | Canned Khmer replies from `content/canned-replies.json` |
| Admin generate | Fake delay, then `content/generated-sample.json` |
| Progress / chat history | `localStorage` only |
| MoEYS video | Placeholder until embed URLs are added |

Please review UI, Khmer copy, and user flow. Backend work should follow [docs/API-CONTRACT.md](docs/API-CONTRACT.md).
