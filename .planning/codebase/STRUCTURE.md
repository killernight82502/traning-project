# Codebase Structure

**Analysis Date:** 2026-05-11

## Directory Layout

```
b_hRYtXl5cj58-1774074657107/
├── app/                          # Next.js App Router (pages, layouts, API)
│   ├── api/                      # Next.js API route handlers
│   │   ├── ai-suggest/route.ts   #   OpenAI task suggestion
│   │   ├── classify-task/route.ts #  OpenAI task type classifier
│   │   ├── upload/route.ts       #   OpenAI file/image analysis
│   │   └── verify-task/route.ts  #   OpenAI task proof verification
│   ├── avatar-creator/page.tsx   # 3D avatar customization page
│   ├── login/page.tsx            # Login/registration page
│   ├── pricing/page.tsx          # Premium membership pricing page
│   ├── rewards/page.tsx          # XP redemption & reward shop page
│   ├── globals.css               # Global CSS (Tailwind, animations)
│   ├── layout.tsx                # Root layout (fonts, metadata, Toaster)
│   └── page.tsx                  # Main dashboard page
├── backend/                      # Legacy Express backend
│   ├── server.js                 # Express 5 server (port 3001)
│   ├── index.html                # Legacy HTML client for Express backend
│   └── package.json              # Backend dependencies
├── components/                   # React components
│   ├── ui/                       # shadcn/ui primitives (57 components)
│   │   ├── button.tsx            # Button component
│   │   ├── card.tsx              # Card component
│   │   ├── dialog.tsx            # Dialog component
│   │   ├── tabs.tsx              # Tabs component
│   │   ├── toast.tsx             # Toast component
│   │   ├── input.tsx             # Input component
│   │   ├── badge.tsx             # Badge component
│   │   ├── toaster.tsx           # Sonner toaster integration
│   │   └── ... (50 more)         # Remaining shadcn/ui components
│   ├── animated-background.tsx   # Three.js 3D background scene
│   ├── avatar-3d.tsx             # 3D character model (GLB) loader
│   ├── celebration-effect.tsx    # Particle celebration on achievements
│   ├── cosmetics-shop.tsx        # Premium cosmetics shop UI
│   ├── daily-challenges.tsx      # Daily challenge cards display
│   ├── data-manager.tsx          # Export/import/reset game data
│   ├── focus-timer.tsx           # Pomodoro focus timer with bonus XP
│   ├── level-up-overlay.tsx      # Level-up animation overlay
│   ├── login-reward-modal.tsx    # Daily login reward streak modal
│   ├── player-header.tsx         # Player level, XP, stats display
│   ├── premium-upgrade-banner.tsx # Premium CTA banner
│   ├── progress-spider-chart.tsx # Radar chart (recharts)
│   ├── rewards-shop.tsx          # Gift card catalog grid
│   ├── stats-panel.tsx           # Stats + achievements sidebar
│   ├── task-card.tsx             # Individual task row with 3D tilt
│   ├── task-form.tsx             # New task creation form
│   ├── theme-provider.tsx        # Theme context provider
│   ├── ui-effects.tsx            # Reusable UI visual effects
│   ├── verification-modal.tsx    # AI proof verification modal
│   ├── weekly-quests.tsx         # Weekly quest progress display
│   └── xp-bar.tsx                # XP progress bar display
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts               # User auth, premium, avatar config
│   ├── use-daily-challenges.ts   # Seeded daily challenge management
│   ├── use-game-state.ts         # Central game state (tasks, XP, level)
│   ├── use-mobile.ts             # Mobile viewport detection
│   ├── use-sound.ts              # Web Audio API synthesized sounds
│   └── use-toast.ts              # Toast notification hook
├── lib/                          # Pure utilities, constants, data
│   ├── game-constants.ts         # XP math, difficulty ranks, achievements
│   ├── premium-cosmetics.ts      # Cosmetic frame definitions
│   ├── premium-products.ts       # Premium tier product definitions
│   ├── rewards-catalog.ts        # Gift card reward catalog data
│   └── utils.ts                  # cn() Tailwind class merger
├── types/                        # TypeScript type declarations
│   └── three-fiber.d.ts          # @react-three/fiber JSX types
├── styles/                       # (Legacy/duplicate) Global CSS
│   └── globals.css               # Duplicate of app/globals.css
├── public/                       # Static assets
│   ├── avatars/                  # Tier-level avatar images (12 images)
│   └── icon.svg, apple-icon.png  # Favicons and app icons
├── .planning/                    # GSD workflow planning directory
│   └── codebase/                 # Codebase analysis docs (this directory)
├── .next/                        # Next.js build output (gitignored)
├── node_modules/                 # Dependencies (gitignored)
├── package.json                  # Frontend dependencies & scripts
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS/Tailwind configuration
├── components.json               # shadcn/ui configuration
└── .env.example                  # Environment variable template
```

## Directory Purposes

**`app/` — Next.js App Router (Pages + API):**
- Purpose: All application routes, layouts, and API endpoints
- Contains: Route group directories each with `page.tsx`, plus `layout.tsx`, `globals.css`, and `api/` subdirectory for route handlers
- Key files:
  - `app/page.tsx` (454 lines) — Main dashboard composing all feature components
  - `app/layout.tsx` (45 lines) — Root layout with dark theme, Geist fonts, Sonner Toaster
  - `app/globals.css` (593 lines) — Tailwind v4 + custom animations (glass, glow, floating, shimmer effects)
  - `app/login/page.tsx` (914 lines) — Login with animated particles, class selection, password strength
  - `app/avatar-creator/page.tsx` (651 lines) — 3D avatar creator with gender/class/appearance tabs
  - `app/rewards/page.tsx` (297 lines) — Gift card redemption with tabs and history
  - `app/pricing/page.tsx` (175 lines) — Premium tier selector with 3D avatar previews

**`app/api/` — Next.js API Route Handlers:**
- Purpose: Server-side OpenAI integrations
- Contains: 4 subdirectories each with `route.ts` (Next.js App Router route handlers)
- Key files:
  - `route.ts` in each: `ai-suggest`, `classify-task`, `upload`, `verify-task`
- Note: All route handlers instantiate a module-level OpenAI client; all use `gpt-4o-mini` or `gpt-4o` models

**`components/` — React Components:**
- Purpose: All UI components — both feature-specific and reusable shadcn/ui primitives
- Contains: 20 feature components + 57 shadcn/ui primitives in `ui/` subdirectory
- Key files (feature): `player-header.tsx`, `task-card.tsx`, `task-form.tsx`, `verification-modal.tsx`, `avatar-3d.tsx`, `animated-background.tsx`, `focus-timer.tsx`
- Convention: One component per file, PascalCase filenames

**`components/ui/` — shadcn/ui Primitives:**
- Purpose: Copy-pasted Radix-based UI primitives generated by shadcn/cli
- Contains: 57 components — all standard shadcn/ui components (accordion, alert-dialog, avatar, badge, button, card, dialog, dropdown-menu, form, input, tabs, toast, etc.)
- Key characteristics: Use `class-variance-authority` for variants, Radix primitives for behavior, Tailwind for styling
- Config: `components.json` — style: "new-york", aliases mapped to `@/components`, `@/lib/utils`

**`hooks/` — Custom React Hooks:**
- Purpose: All application state management logic extracted into reusable hooks
- Contains: 6 hooks
- Key files:
  - `use-game-state.ts` (401 lines) — Largest hook; manages tasks, stats, XP, achievements, streak logic, data import/export
  - `use-auth.ts` (200 lines) — User CRUD, premium status, avatar config, all in localStorage
  - `use-daily-challenges.ts` (160 lines) — Seeded daily challenge generation, progress tracking
  - `use-sound.ts` (353 lines) — Web Audio API synthesized sound engine with 11 sound types
- Convention: `use-` prefix, kebab-case filenames

**`lib/` — Library Utilities:**
- Purpose: Pure functions, constants, and config data used across the app
- Contains: 5 files
- Key files:
  - `game-constants.ts` (201 lines) — XP calculation math, difficulty rank definitions, 20 achievement definitions
  - `rewards-catalog.ts` (249 lines) — 18 gift card reward entries with XP costs, provider logos
  - `premium-cosmetics.ts` (116 lines) — 8 cosmetic frame definitions with colors and level requirements
  - `premium-products.ts` (75 lines) — 3 premium tier product definitions (starter/elite/sovereign)
  - `utils.ts` (6 lines) — `cn()` function merging Tailwind classes via `clsx` + `tailwind-merge`
- Convention: No class exports, no React dependencies — pure functions and type exports only

**`backend/` — Legacy Express Backend:**
- Purpose: Standalone Express 5 server for AI features and task CRUD (legacy)
- Contains: `server.js` (154 lines), `index.html` (60 lines), `package.json`
- Key notes:
  - Runs on port 3001 with CORS enabled
  - In-memory arrays for users and tasks (resets on restart)
  - Endpoints: `/tasks`, `/add-task`, `/complete-task`, `/ai-suggest`, `/upload`, `/upgrade`
  - Uses multer for file uploads (saves to `uploads/` directory)
  - Uses OpenAI `gpt-4o-mini` for suggestions and image analysis
  - `backend/index.html` is a simple HTML-only client for testing

**`public/` — Static Assets:**
- Purpose: Publicly accessible static files
- Contains: `avatars/` (12 tier/level avatar images), favicons, placeholder images
- NOTE: `avatars/` directory has tier-named images (novice, evolved, awakening, awakened, ascended, transcendent, sovereign — each with male/female variants)

**`types/` — TypeScript Declarations:**
- Purpose: Global type augmentation for Three.js/React Three Fiber
- Contains: `three-fiber.d.ts` (7 lines) extending `JSX.IntrinsicElements` with `ThreeElements`

**`styles/` — (Duplicate) Global CSS:**
- Purpose: Appears to be a duplicate/legacy copy of `app/globals.css`
- Contains: `globals.css` with identical Tailwind v4 imports
- Note: Not imported by any source file; likely a leftover

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout — sets up dark mode, loads Geist fonts, defines metadata
- `app/page.tsx`: Main dashboard (serves as the primary UI after login)
- `backend/server.js`: Express backend entry point (legacy)

**Configuration:**
- `next.config.mjs`: Next.js config (TS ignore, unoptimized images, browser logging)
- `tsconfig.json`: TypeScript config with `@/*` path alias pointing to root
- `postcss.config.mjs`: PostCSS config with `@tailwindcss/postcss` plugin
- `components.json`: shadcn/ui config (style: new-york, RSC: true, tailwind v4)
- `package.json`: npm scripts (`dev`, `build`, `start`, `lint`), dependencies
- `.env.example`: Required environment variables template

**Core Logic:**
- `hooks/use-game-state.ts`: Central game state — task CRUD, XP calculation, achievements, streaks, localStorage sync
- `hooks/use-auth.ts`: User management, premium tier handling, avatar config, localStorage auth
- `hooks/use-daily-challenges.ts`: Daily challenge seeding, progress, claim rewards
- `lib/game-constants.ts`: XP formulas, difficulty multipliers, achievement definitions
- `components/verification-modal.tsx`: AI-powered task proof verification flow
- `components/avatar-3d.tsx`: 3D character model rendering with Three.js/GLTF

**Testing:**
- No test files detected in the codebase. No testing framework configured.

## Naming Conventions

**Files:**
- **React components:** PascalCase with kebab-case for multi-word: `task-card.tsx`, `player-header.tsx`, `animated-background.tsx`, `verification-modal.tsx`, `avatar-3d.tsx`
- **Hooks:** camelCase with `use-` prefix: `use-auth.ts`, `use-game-state.ts`, `use-daily-challenges.ts`, `use-sound.ts`
- **Libraries/utils:** camelCase: `game-constants.ts`, `rewards-catalog.ts`, `premium-cosmetics.ts`, `utils.ts`
- **API routes:** kebab-case directory with `route.ts`: `app/api/ai-suggest/route.ts`, `app/api/classify-task/route.ts`
- **Pages:** `page.tsx` inside route-named directories: `app/login/page.tsx`, `app/rewards/page.tsx`
- **Config:** camelCase with dot-extension: `next.config.mjs`, `postcss.config.mjs`, `components.json`

**Directories:**
- **Routes:** kebab-case: `avatar-creator/`, `classify-task/`, `verify-task/`
- **Feature collections:** lowercase singular: `app/`, `components/`, `hooks/`, `lib/`, `types/`, `styles/`, `public/`, `backend/`

## Where to Add New Code

**New Feature:**
- Primary code: Create a new route directory in `app/[feature-name]/page.tsx`
- Components: Add to `components/[feature-name].tsx` (feature-specific) or `components/ui/` (reusable primitive)
- Hooks: Add to `hooks/use-[feature-name].ts` if stateful logic is needed
- Constants/data: Add to `lib/[feature-name].ts`

**New API Endpoint:**
- Implementation: Create `app/api/[endpoint-name]/route.ts` following the `NextResponse` + `NextRequest` pattern
- Backend alternative: Add route to `backend/server.js` with Express route handler if not consolidating

**New Component:**
- Feature component: `components/[component-name].tsx` with PascalCase filename
- UI primitive: `components/ui/[component-name].tsx` following the shadcn/ui pattern
- Always start with `"use client"` (current convention)

**New Hook:**
- File: `hooks/use-[feature-name].ts`
- Use `"use client"` directive, export typed interfaces for return values
- Prefer `useCallback` for returned functions, `useEffect` for side effects

**New Utility/Configuration:**
- Pure functions: `lib/[name].ts` — no React, no `"use client"` needed
- Type declarations: `types/[name].d.ts` (global) or colocated (local)

**Tests:**
- No test framework currently configured. When adding, use co-located `*.test.ts` or `*.spec.ts` files next to source files, or a dedicated `__tests__/` directory mirroring the source structure.

## Special Directories

**`.next/`:**
- Purpose: Next.js build artifacts, turbopack cache, generated types
- Generated: Yes (by `next build` / `next dev`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD workflow planning artifacts (roadmap, phases, codebase docs)
- Generated: Yes (by GSD commands)
- Committed: Yes (project planning state)

---

*Structure analysis: 2026-05-11*
