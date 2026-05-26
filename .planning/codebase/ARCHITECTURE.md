<!-- refreshed: 2026-05-11 -->
# Architecture

**Analysis Date:** 2026-05-11

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client-Side)                         │
├──────────────────────┬────────────────────────┬─────────────────────┤
│   Pages (app/)       │  Components (comp/)    │  Hooks (hooks/)     │
│  `app/page.tsx`      │ `components/*.tsx`     │ `hooks/use-*.ts`    │
│  `app/login/page.tsx`│ `components/ui/*.tsx`  │ (state, auth, etc)  │
│  `app/rewards/page.. │ `components/feature*.  │                     │
└──────────┬───────────┴───────────┬────────────┴──────────┬──────────┘
           │                      │                       │
           ▼                      ▼                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS API ROUTES (app/api/)                    │
│        `app/api/ai-suggest/route.ts`                                 │
│        `app/api/classify-task/route.ts`                              │
│        `app/api/verify-task/route.ts`                                │
│        `app/api/upload/route.ts`                                     │
│         (OpenAI integration via next/server)                         │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   EXPRESS BACKEND (backend/)                         │
│     `backend/server.js` — Legacy Express 5 server on port 3001       │
│     - OpenAI integration (gpt-4o-mini)                               │
│     - File upload (multer)                                           │
│     - In-memory "database" (demo)                                    │
│     - CORS enabled for cross-origin                                  │
└──────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| RootLayout | Dark theme, font loading, metadata, global Toaster | `app/layout.tsx` |
| Home (main page) | Main dashboard — task grid, daily challenges, stats, modals, AI suggestions | `app/page.tsx` |
| LoginPage | User registration/auth, class selection, animated login form | `app/login/page.tsx` |
| AvatarCreatorPage | 3D avatar customization with gender/class/appearance options | `app/avatar-creator/page.tsx` |
| PricingPage | Premium membership tier selection with 3D previews | `app/pricing/page.tsx` |
| RewardsPage | XP-to-gift-card redemption system with history | `app/rewards/page.tsx` |
| PlayerHeader | Level display, XP progress bar, stats, premium badge | `components/player-header.tsx` |
| TaskForm | Create new tasks with title, duration, difficulty rank | `components/task-form.tsx` |
| TaskCard | Individual task display with completion tracking and verification modal trigger | `components/task-card.tsx` |
| StatsPanel | XP, completed tasks count, streak, achievements list | `components/stats-panel.tsx` |
| VerificationModal | Camera capture or file upload for task proof, AI verification | `components/verification-modal.tsx` |
| FocusTimer | Pomodoro-style focus session with bonus XP | `components/focus-timer.tsx` |
| AnimatedBackground | Three.js 3D particle/energy orb scene on canvas | `components/animated-background.tsx` |
| Avatar3D | 3D character model loader with GLB files, class-based effects | `components/avatar-3d.tsx` |
| CosmeticsShop | Premium cosmetic frame/glow shop | `components/cosmetics-shop.tsx` |
| DailyChallenges | 4 daily seeded challenges with claimable XP rewards | `components/daily-challenges.tsx` |
| WeeklyQuests | Weekly progress tracking for tasks/XP/streak/focus | `components/weekly-quests.tsx` |
| RewardsShop | Gift card catalog grid with level-gated redemption | `components/rewards-shop.tsx` |
| PremiumUpgradeBanner | Call-to-action for premium tier | `components/premium-upgrade-banner.tsx` |
| XPBar | Level-based XP progress visualization | `components/xp-bar.tsx` |
| ai-suggest API | OpenAI task suggestion endpoint | `app/api/ai-suggest/route.ts` |
| classify-task API | OpenAI task type classification (physical/written/none) | `app/api/classify-task/route.ts` |
| upload API | OpenAI image analysis for task proof | `app/api/upload/route.ts` |
| verify-task API | OpenAI JSON-based task proof verification with XP multiplier | `app/api/verify-task/route.ts` |

## Pattern Overview

**Overall:** Feature-first Next.js App Router with client-heavy React components. All state is managed client-side via custom hooks with `localStorage` persistence. A legacy Express backend exists alongside newer Next.js API routes for OpenAI integration.

**Key Characteristics:**
- **Client-only rendering** — every page uses `"use client"` directive; no server components or server actions
- **localStorage as primary persistence** — game state, user auth, daily challenges, redemptions all stored in `localStorage`
- **Dual AI backend** — OpenAI is called from both Next.js API routes (`app/api/*/route.ts`) AND the Express backend (`backend/server.js`) with overlapping functionality
- **Gamification layer** — XP system with exponential leveling, difficulty rank multipliers (E→S), achievement unlocks, daily challenges, streaks
- **Heavy animation** — Three.js/CSS animations for immersive theming (Solo Leveling aesthetic)

## Layers

**Pages Layer:**
- Purpose: Route entry points, page-level composition, layout
- Location: `app/`
- Contains: `page.tsx` files, `layout.tsx`, `globals.css`
- Depends on: Components, hooks, lib
- Used by: Next.js router

**Components Layer:**
- Purpose: Reusable UI and feature-specific components
- Location: `components/`
- Contains: Feature components (`task-card.tsx`, `player-header.tsx`) and UI primitives (`components/ui/`)
- Depends on: Hooks, lib utilities, shadcn/ui primitives
- Used by: Pages

**Hooks Layer:**
- Purpose: Client state management, business logic, side effects
- Location: `hooks/`
- Contains: `use-game-state.ts`, `use-auth.ts`, `use-daily-challenges.ts`, `use-sound.ts`, `use-toast.ts`, `use-mobile.ts`
- Depends on: lib (game constants)
- Used by: Components and pages

**Library Layer:**
- Purpose: Pure functions, constants, data catalogs, utility helpers
- Location: `lib/`
- Contains: `game-constants.ts` (XP math, achievements), `utils.ts` (cn() helper), `rewards-catalog.ts` (gift card data), `premium-products.ts`, `premium-cosmetics.ts`
- Depends on: Only npm packages (clsx, tailwind-merge)
- Used by: All layers

**Next.js API Layer:**
- Purpose: Server-side AI integration via OpenAI
- Location: `app/api/*/route.ts`
- Contains: 4 route handlers for AI suggestions, task classification, file upload analysis, task verification
- Depends on: `openai` npm package, environment variables
- Used by: Client components via `fetch()`

**Express Backend Layer:**
- Purpose: Legacy standalone backend for AI, file upload, and task CRUD
- Location: `backend/server.js`
- Contains: Express 5 server running on port 3001, in-memory data store, multer file uploads, OpenAI integration
- Depends on: `express`, `cors`, `multer`, `openai`, `dotenv`
- Used by: `backend/index.html` (legacy HTML client)

## Data Flow

### Primary Request Path (Task Completion + AI Verification)

1. User clicks "Complete" on a TaskCard (`components/task-card.tsx:25`)
2. VerificationModal opens (`components/verification-modal.tsx:18`)
3. Modal calls `/api/classify-task` to determine proof type (POST, `app/api/classify-task/route.ts`)
4. Based on classification ("physical", "written", "none"):
   - **none**: Instant completion, standard XP awarded
   - **physical**: Camera capture via `getUserMedia()`, sends to `/api/verify-task` or `/api/upload` with base64 image
   - **written**: File upload, sends to `/api/verify-task` or `/api/upload` with base64 file
5. AI verifies proof and returns XP multiplier + feedback (`app/api/verify-task/route.ts`)
6. `gameState.completeTask()` updates `localStorage` with new XP, achievements, streak, and level (`hooks/use-game-state.ts:161`)
7. UI re-renders via React state; toast notifications fire on achievements/level-up

### Auth Flow

1. User fills login form (`app/login/page.tsx`)
2. `useAuth.login()` creates User object and stores in `localStorage` under key `timebot_user` (`hooks/use-auth.ts:70`)
3. Password is stored separately per-username in `localStorage` as `timebot_password_{username}`
4. On subsequent visits, `useAuth` reads `timebot_user` from `localStorage` (no server validation)
5. App redirects to `/login` if no user found, or `/avatar-creator` if avatar not yet created

### Game State Flow

1. `useGameState` hook initializes by reading from `localStorage` key `solo_leveling_game` (`hooks/use-game-state.ts:81`)
2. Tasks are added via `addTask()` which calculates XP reward from duration + difficulty multiplier
3. Tasks are completed via `completeTask()` which updates XP, checks achievements, manages streak
4. All state changes auto-sync to `localStorage` via a `useEffect` watcher (`hooks/use-game-state.ts:96-100`)
5. XP → Level formula uses exponential growth: `100 * 1.5^(level-1)` (`lib/game-constants.ts:14-17`)

### Data Export/Import Flow

1. `DataManager` component calls `gameState.exportData()` which serializes `{ tasks, stats, exportedAt, version }` to JSON
2. `importData()` parses JSON, validates shape, and sets React state (which syncs to `localStorage`)

**State Management:**
- All state is managed client-side via React `useState` + `useCallback` in custom hooks
- Persistence is via `localStorage` with JSON serialization
- No server-side database, no API-based persistence for game data
- The Express backend has an in-memory array-based "database" (reset on restart)

## Key Abstractions

**Game State Hook (`useGameState`):**
- Purpose: Central state container for all game data (tasks, XP, level, achievements, streaks)
- Location: `hooks/use-game-state.ts`
- Pattern: Singleton-like custom hook with `useState` + `useEffect` for localStorage sync
- Returns: `{ tasks, stats, addTask, completeTask, deleteTask, ... }`

**Auth Hook (`useAuth`):**
- Purpose: User authentication, premium status, avatar configuration
- Location: `hooks/use-auth.ts`
- Pattern: localStorage-based "auth" with no real server validation
- Returns: `{ user, login, logout, updatePremiumStatus, updateAvatarConfig, ... }`

**Daily Challenges (`useDailyChallenges`):**
- Purpose: Seeded daily challenge generation and progress tracking
- Location: `hooks/use-daily-challenges.ts`
- Pattern: Date-seeded random selection from 18 challenge templates, persistent in localStorage
- Returns: `{ challenges, updateProgress, claimReward, getUnclaimedCount }`

**Sound System (`useSound`):**
- Purpose: Synthesized audio feedback using Web Audio API
- Location: `hooks/use-sound.ts`
- Pattern: Singleton AudioContext with per-sound-type oscillator functions (taskComplete, levelUp, achievement, etc.)
- Exports both a React hook and a `playGlobalSound()` for use outside React

**shadcn/ui Components:**
- Purpose: 57 Radix-based UI primitives (button, dialog, card, tabs, etc.)
- Location: `components/ui/`
- Pattern: Copy-pasted shadcn/ui components using Radix primitives, styled with Tailwind + class-variance-authority
- Config: `components.json`

## Entry Points

**Next.js App Router (Primary):**
- Location: `app/layout.tsx`, `app/page.tsx`
- Triggers: User navigates to `http://localhost:3000`
- Responsibilities: Server-renders shell, client-hydrates all pages

**Express Backend (Legacy):**
- Location: `backend/server.js`
- Triggers: Running `node backend/server.js` on port 3001
- Responsibilities: OpenAI suggestions, file upload analysis, task CRUD for legacy HTML client

## Architectural Constraints

- **Threading:** Single-threaded event loop (Next.js server + Express). No web workers used.
- **Global state:** Module-level singletons — `audioContext` in `hooks/use-sound.ts:10`, OpenAI client instances in API routes `app/api/*/route.ts:4-6`
- **Circular imports:** Not detected — the `@/` alias imports go one direction (pages → components → hooks → lib)
- **localStorage size limit:** Game state is limited to ~5-10MB depending on browser; large task arrays could hit quota
- **No server-side rendering:** All pages use `"use client"`; no React Server Components or Server Actions utilized
- **Security:** Auth is entirely client-side with password stored in plaintext in localStorage (demo nature)

## Anti-Patterns

### localStorage as "Database"

**What happens:** All game state, user data, challenge data, and redemptions are stored in `localStorage` under keys like `solo_leveling_game`, `timebot_user`, `timebot_daily_challenges`, `timebot_password_{username}`, etc.
**Why it's wrong:** No data durability — clearing browser storage loses everything. No multi-device sync. Password in plaintext. localStorage has a ~5-10MB limit.
**Do this instead:** Use a real database backend (e.g., PostgreSQL + Prisma) with API routes for persistence. See `backend/server.js` for a starting point that could be extended.

### Dual AI Backend Overlap

**What happens:** OpenAI is called from BOTH Next.js API routes (`app/api/*/route.ts`) AND the Express backend (`backend/server.js`). The Next.js routes handle task classification, verification, suggestions, and uploads, while the Express backend handles AI suggestions and file uploads independently.
**Why it's wrong:** Duplicated logic, inconsistent API design, maintenance burden, confusing data flow.
**Do this instead:** Consolidate all AI functionality into Next.js API routes and remove the Express backend entirely, or use Express exclusively if hosting separately.

### Plaintext Password Storage

**What happens:** Passwords stored in `localStorage` as `timebot_password_{username}` with no hashing.
**Why it's wrong:** Credentials exposed in browser dev tools, no encryption, vulnerable to XSS.
**Do this instead:** For demo purposes, use no password auth at all. For production, use OAuth (NextAuth.js) or a proper backend with bcrypt-hashed passwords.

### Heavy Client Components

**What happens:** Every page file and most components begin with `"use client"` including stateless display components.
**Why it's wrong:** Increases client bundle size, prevents server-side rendering benefits, degrades initial load performance.
**Do this instead:** Use React Server Components for static/presentational content; keep `"use client"` only where needed (interactivity, browser APIs, hooks).

## Error Handling

**Strategy:** Try/catch with fallback values + toast notifications.

**Patterns:**
- API route errors return `NextResponse.json({ error })` with HTTP 500 status (`app/api/*/route.ts`)
- Client fetch calls wrap in try/catch, display errors via `toast.error()` (`app/page.tsx:74-79`)
- AI feature failures fall back to mock/simulated responses when `OPENAI_API_KEY` is not configured or set to placeholder (`app/api/ai-suggest/route.ts:12-19`, `app/api/verify-task/route.ts:16-21`)
- Verification modal falls back from camera capture to file upload on failure (`components/verification-modal.tsx:74-76`)
- localStorage parse errors are caught with `try/catch` and silently default to initial state

## Cross-Cutting Concerns

**Logging:** Console logging only — `console.error` for game state load failures, `console.log` for login errors, `console.warn` for sound playback failures. No structured logging framework.

**Validation:** Input validation is minimal — task form checks for empty title/duration (`components/task-form.tsx:28-33`); login form validates username/password presence (`app/login/page.tsx:486-489`). Zod is listed in `package.json` as a dependency (`zod: ^3.24.1`) but is not used in any source file.

**Authentication:** Entirely client-side via `localStorage`. No JWT, no session cookies, no OAuth. The `useAuth` hook reads/writes user data to/from `localStorage` under `timebot_user` key.

---

*Architecture analysis: 2026-05-11*
