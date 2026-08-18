# ReanMate

Web app for Cambodian grade 10–12 students to study **Mathematics** and
**History** in Khmer — aligned with MoEYS textbook chapters. Per chapter:
watch the official MoEYS video, ask **ReanMate** (មិត្ត AI — a study buddy,
not a teacher), then take an MCQ quiz with explanations.

**Status:** frontend-only demo. All data is mocked; the Node.js + MongoDB
backend will be integrated by the backend team using
[docs/API-CONTRACT.md](docs/API-CONTRACT.md).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000, then use **បន្តជាសិស្ស** (student) or
**បន្តជា Admin** on the login page — real auth arrives with the backend.

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

When the Node.js + MongoDB API is ready, **do not rewrite the UI**. Swap only:

1. **`lib/api/index.ts`** — replace mock JSON reads with `fetch` calls that match
   [docs/API-CONTRACT.md](docs/API-CONTRACT.md). Keep the exported function
   names and return types in `lib/types.ts`.
2. **`lib/progress.ts`** — move quiz scores, last-visited chapter, and chat
   history from `localStorage` to authenticated API calls.

Student skip-login: `/login` → **បន្តជាសិស្ស** → `/home`.  
Admin skip-login: `/login` → **បន្តជា Admin** → `/admin`.

Students only see chapters with `status: "approved"`. Drafts stay on the admin
list until published.

## For teammates (frontend review)

This repo is the **frontend demo**. No backend or API keys are required.

```bash
git clone <this-repo-url>
cd "AI Tutor"   # or the folder name after clone
npm install
npm run dev
```

Open http://localhost:3000 in **Chrome**.

### Student flow to click through

1. Landing → **ចាប់ផ្តើមរៀន**
2. Login page → **បន្តជាសិស្ស** (skip real auth)
3. Home → **ថ្នាក់ទី១០** → **គណិតវិទ្យា** or **ប្រវត្តិវិទ្យា**
4. Open a chapter → video placeholder + summary → **សួរមិត្ត AI**
5. **ចាប់ផ្តើមតេស្ត** → answer all questions → finish (pass at ≥ 70%)

Demo chapters: Grade 10 Math (**អនុគមន៍**) and Grade 10 History (**អាណាចក្រហ្វូណន**). Grades 11–12 show an empty “coming soon” state on purpose.

### Admin flow to click through

1. Landing → login → **បន្តជា Admin**
2. Chapter list → **កែសម្រួល** or **បង្កើតមេរៀនថ្មី**
3. Paste any source text → **បង្កើតដោយ AI** (mocked delay + sample content)
4. Save draft or approve — the notice is UI-only; it does not write a database yet

### What is mocked (on purpose)

| Area | Current behavior |
|------|------------------|
| Login | Form shows a notice; use the skip buttons |
| ReanMate chat | Canned Khmer replies from `content/canned-replies.json` |
| Admin generate | Fake delay, then `content/generated-sample.json` |
| Progress / chat history | `localStorage` only |
| MoEYS video | Placeholder until embed URLs are added |

Please review UI, Khmer copy, and user flow. Backend work should follow [docs/API-CONTRACT.md](docs/API-CONTRACT.md).
