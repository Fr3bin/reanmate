# ReanMate

Web app for Cambodian grade 10–12 students to study **Mathematics** and
**History** in Khmer — aligned with MoEYS textbook chapters. Per chapter:
watch a curriculum-aligned lesson video, ask **ReanMate** (មិត្ត AI — a study buddy,
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

## Deploy (Vercel)

This is a standard Next.js App Router app. Deploy the **frontend** branch, or merge it to `main` first.

1. Import [Fr3bin/reanmate](https://github.com/Fr3bin/reanmate) in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js**. Build command `npm run build`; output is automatic.
3. Leave **`NEXT_PUBLIC_API_URL` unset** so the public demo stays mocked (skip-login, canned chat, localStorage catalog).
4. After the backend exists, set `NEXT_PUBLIC_API_URL` to the API base with no trailing slash, e.g. `https://api.example.com/api`.

No other env vars or secrets are required for the demo.

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

Grade 10–12 demo chapters (Math + History). Each chapter has a lesson video,
summary, ReanMate chat, and a 5-question quiz. Structure still supports up to
3 chapters × 2 subjects × 3 grades (18).

## Backend handoff

Set `NEXT_PUBLIC_API_URL` (see `.env.example`) when the Node.js + MongoDB API
is running. Login, signup, ReanMate chat, and admin generate will then call
the endpoints in [docs/API-CONTRACT.md](docs/API-CONTRACT.md).

Until that URL is set, the demo stays mocked:

1. **`lib/api/index.ts`** — catalog still reads `content/*.json`.
2. **`lib/progress.ts`** — quiz scores and chat history stay in `localStorage`.
3. Skip buttons on `/login` still work for frontend review.

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
3. Home → pick **ថ្នាក់ទី១០ / ១១ / ១២** → **គណិតវិទ្យា** or **ប្រវត្តិវិទ្យា**
4. Open a chapter → lesson video (MoEYS curriculum / EBC) + summary → **សួរមិត្ត AI**
5. **ចាប់ផ្តើមតេស្ត** → answer all questions → finish (pass at ≥ 70%)

Demo chapters: **18** approved lessons (3 per subject × 2 subjects × 3 grades). Ten play a matching EBC YouTube clip in the page. Eight open the matching lesson on [ebc.edu.kh](https://ebc.edu.kh) (same grade and topic) because EBC has not published those episodes on YouTube.

### Admin flow to click through

1. Landing → login → **បន្តជា Admin**
2. Chapter list → **កែសម្រួល** or **បង្កើតមេរៀនថ្មី**
3. Paste any source text → **បង្កើតដោយ AI** (mocked delay + sample content)
4. Save draft or approve — stored in this browser (`localStorage`) until the API exists

### What is mocked (on purpose)

| Area | Current behavior |
|------|------------------|
| Login | Skip buttons always work. Email form calls the API only if `NEXT_PUBLIC_API_URL` is set |
| ReanMate chat | Canned replies unless the API URL is set |
| Admin generate | Fake sample unless the API URL is set and the chapter already has an id |
| Progress / chat / admin drafts | `localStorage` only |
| Lesson video | YouTube embeds when EBC published a matching clip; otherwise a button to the matching EBC lesson page |

Please review UI, Khmer copy, and user flow. Backend work should follow [docs/API-CONTRACT.md](docs/API-CONTRACT.md).
