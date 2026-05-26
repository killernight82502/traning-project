# External Integrations

**Analysis Date:** 2026-05-11

## APIs & External Services

**OpenAI API:**
- **Purpose:** AI task suggestions, task classification (physical/written/digital), task verification with image proof, image analysis
- **SDK/Client:** `openai` ^6.32.0 (both frontend Next.js API routes and backend Express server)
- **Auth:** `OPENAI_API_KEY` env var
- **Models used:** `gpt-4o-mini` (suggestions, classification), `gpt-4o` (image verification/analysis)
- **Endpoints consuming OpenAI:**
  - `app/api/ai-suggest/route.ts` — Generates gamified task suggestions from user progress
  - `app/api/classify-task/route.ts` — Classifies tasks as "physical", "written", or "none"
  - `app/api/verify-task/route.ts` — Verifies task completion via image proof upload
  - `app/api/upload/route.ts` — Image upload with AI analysis/feedback
  - `backend/server.js` — `/ai-suggest` and `/upload` endpoints (legacy Express routes)
- **Fallback behavior:** When `OPENAI_API_KEY` is unset or is the placeholder `"your_api_key_here"`, all endpoints return mock/local responses instead of calling OpenAI

**Ready Player Me (3D Avatars):**
- **Purpose:** 3D avatar model hosting (GLB format)
- **Integration type:** Static URL references to externally hosted GLB files — NOT an API/SDK integration
- **URLs referenced:**
  - `https://models.readyplayer.me/64f126588325b36417770700.glb` (Starter premium avatar)
  - `https://models.readyplayer.me/64f126b48325b36417770732.glb` (Elite premium avatar)
  - `https://models.readyplayer.me/64f126f58325b3641777075a.glb` (Sovereign premium avatar)
  - `https://models.readyplayer.me/64b584a51e5acc6fdf5c3b1a.glb` (Default male avatar)
  - `https://models.readyplayer.me/64b584a51e5acc6fdf5c3b1b.glb` (Default female avatar)
- **Usage:** Loaded via `@react-three/drei`'s `useGLTF` hook in `components/avatar-3d.tsx`
- **Auth:** None (public URLs)

**External 3D Model URLs:**
- `https://models.bastion.club/Mannequin.glb` (Athletic male character)
- `https://models.bastion.club/Woman.glb` (Athletic female character)
- `https://threejs.org/examples/models/gltf/Soldier.glb` (Casual male character)

## Data Storage

**Databases:**
- **None detected** — No database drivers, ORMs, or database client packages in dependencies
- Frontend state is persisted entirely via `localStorage` (`use-game-state.ts`, `use-auth.ts`)
- Backend uses an in-memory JavaScript array as a "fake database" (`backend/server.js`, lines 35-41)

**File Storage:**
- Local filesystem only — Multer uploads to `uploads/` directory on the server (`backend/server.js`)

**Caching:**
- None detected — No Redis, Memcached, or other caching layer

## Authentication & Identity

**Auth Provider:**
- **Custom localStorage-based auth** — No external auth provider integrated
- Implementation: `hooks/use-auth.ts`
  - Username/password stored in `localStorage` (`timebot_user`, `timebot_password_{username}` keys)
  - No password hashing (stored as plaintext)
  - No session tokens, JWT, or cookies
- **Note:** `.env.example` has `NEXTAUTH_SECRET` and `NEXTAUTH_URL` vars listed as "for future real backend integration" — not currently used
- The backend simulates premium plan checks (`backend/server.js`) via a `plan` field on the user object

## Monitoring & Observability

**Error Tracking:**
- None detected — No Sentry, DataDog, or similar error tracking service

**Logs:**
- `console.error` in API route catch blocks (`app/api/upload/route.ts`, `app/api/verify-task/route.ts`)
- `console.warn` in `hooks/use-sound.ts` for audio failures
- Next.js configured with `browserToTerminal: true` in `next.config.mjs` — logs to terminal during dev

**Analytics:**
- `.env.example` references `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` but it's not consumed in any source file

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured — `.vercel` in `.gitignore` and v0 sandbox references suggest Vercel deployment history
- No Dockerfile or container configuration

**CI Pipeline:**
- None detected — no `.github/workflows/` or CI config files

**Environment Configuration:**
- `.env` file at project root (gitignored as `.env*.local` via `.gitignore`)
- `.env.example` documents required and optional variables

**Secrets location:**
- `.env` file (project root) — NOT committed
- Backend loads `.env` via `dotenv` with path `../.env`

## Payment Processing

**Stripe:**
- **Status:** Declared in `.env.example` but **NOT integrated** in code
- Variables present: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- No Stripe SDK package in dependencies
- The pricing page (`app/pricing/page.tsx`) and premium products (`lib/premium-products.ts`) define premium tiers with prices, but upgrades are simulated via `localStorage` state update only

## Webhooks & Callbacks

**Incoming:**
- None implemented

**Outgoing:**
- None implemented

## Browser APIs Used

| API | Component/File | Purpose |
|-----|----------------|---------|
| `localStorage` | `hooks/use-game-state.ts`, `hooks/use-auth.ts`, `app/page.tsx`, `app/rewards/page.tsx`, `hooks/use-sound.ts` | State persistence, auth, preferences |
| `MediaStream` (webcam) | `components/verification-modal.tsx` | Capturing physical task proof photos |
| `AudioContext` / `webkitAudioContext` | `hooks/use-sound.ts` | Synthesizing sound effects |
| `Navigator.mediaDevices.getUserMedia` | `components/verification-modal.tsx` | Camera access for task verification |

## Third-Party (External) Assets

| Provider | Asset Type | Usage |
|----------|------------|-------|
| Ready Player Me | 3D GLB models | Avatar display (`components/avatar-3d.tsx`) |
| Bastion Club | 3D GLB models | Character model sources (`components/avatar-3d.tsx`) |
| Three.js examples | 3D GLB models | Soldier character model (`components/avatar-3d.tsx`) |

---

*Integration audit: 2026-05-11*
