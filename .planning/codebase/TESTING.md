# Testing Patterns

**Analysis Date:** 2026-05-11

## Test Framework

**Runner:**
- **Not detected.** No test runner is configured. No `vitest`, `jest`, `mocha`, `cypress`, or `playwright` packages are listed in `package.json` (frontend) or `backend/package.json`.
- Config file: None. No `jest.config.*`, `vitest.config.*`, or `.cypress/` directory exists.

**Assertion Library:**
- None detected.

**Run Commands:**
```bash
# No test scripts exist
```

## Test File Organization

**Location:**
- No test files found anywhere in the repository. A glob for `*.test.*` and `*.spec.*` returned zero results across all directories including `app/`, `components/`, `hooks/`, `lib/`, and `backend/`.

**Naming:**
- Not applicable — no test files exist.

**Structure:**
- No `__tests__/` directories or `.test.ts` files exist.

## Test Structure

No test suites exist in the codebase.

**To add testing, the following setup is needed:**
1. Install a test runner (recommended: Vitest for its native TypeScript and ESM support, given the project uses `"module": "esnext"` and React 19)
2. Create a test config file (e.g., `vitest.config.ts`)
3. Install testing libraries (recommended: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)
4. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:coverage": "vitest run --coverage"
     }
   }
   ```

## Mocking

- No mocking framework is configured.
- The project does not use `vi.mock()`, `jest.mock()`, or any mocking library.

**What should be mocked (based on codebase patterns):**
- `localStorage` operations (used extensively in `hooks/use-game-state.ts`, `hooks/use-auth.ts`, `hooks/use-daily-challenges.ts`, `hooks/use-sound.ts`)
- `OpenAI` client (used in `app/api/*/route.ts` files)
- `window.AudioContext` / `window.webkitAudioContext` (used in `hooks/use-sound.ts`)
- `next/navigation` `useRouter` (used in `app/page.tsx`, `app/login/page.tsx`)

## Fixtures and Factories

No test fixtures or factories exist.

**The following data types would need fixtures:**
- `Task` interface from `hooks/use-game-state.ts` (fields: `id`, `title`, `description`, `durationMinutes`, `difficulty`, `completed`, `completedAt`, `xpReward`, `createdAt`)
- `PlayerStats` interface from `hooks/use-game-state.ts`
- `User` interface from `hooks/use-auth.ts`
- `DailyChallenge` interface from `hooks/use-daily-challenges.ts`
- `Reward` interface from `lib/rewards-catalog.ts`
- `Cosmetic` interface from `lib/premium-cosmetics.ts`
- `PremiumProduct` interface from `lib/premium-products.ts`

## Coverage

**Requirements:** None enforced. No coverage tooling exists.

**View Coverage:**
```bash
# No coverage command available
```

## Test Types

**Unit Tests:**
- None present. The pure utility functions in `lib/` are ideal candidates:
  - `lib/game-constants.ts`: `getXpForLevel()`, `getCumulativeXp()`, `getLevelFromXp()`, `calculateTaskXp()`, `getTitleForLevel()`, `getTitleColor()`
  - `lib/utils.ts`: `cn()`
  - `lib/rewards-catalog.ts`: `formatXpToDollars()`, `getPopularRewards()`, `getRewardsByProvider()`, `getAffordableRewards()`
  - `lib/premium-products.ts`: `getProductById()`

**Integration Tests:**
- None present. Good candidates include:
  - Hook tests for `useGameState` in `hooks/use-game-state.ts` (test add/complete/delete task flow)
  - Hook tests for `useDailyChallenges` in `hooks/use-daily-challenges.ts` (test challenge generation and progression)
  - API route tests for `app/api/ai-suggest/route.ts`, `app/api/classify-task/route.ts`, `app/api/verify-task/route.ts`, `app/api/upload/route.ts`

**E2E Tests:**
- Not used. No Playwright or Cypress dependency detected.

## Browser API Dependencies (Testing Implications)

The codebase heavily depends on browser APIs that require mocking in tests:
- `localStorage.getItem`/`setItem`/`removeItem` — used in `hooks/use-game-state.ts`, `hooks/use-auth.ts`, `hooks/use-daily-challenges.ts`, `hooks/use-sound.ts`
- `window.AudioContext` / `webkitAudioContext` — used in `hooks/use-sound.ts`
- `window.matchMedia` — used in `hooks/use-mobile.ts`
- `window.innerWidth` — used in `hooks/use-mobile.ts`
- `canvas.getContext('2d')` — used in `app/login/page.tsx`
- `requestAnimationFrame`/`cancelAnimationFrame` — used in `app/login/page.tsx`

## Async Testing Considerations

- Several hooks use `setTimeout` for delayed operations (`hooks/use-game-state.ts`, `app/page.tsx`, `app/login/page.tsx`). Tests should use vitest's `vi.useFakeTimers()` for these.
- API routes use `await new Promise(r => setTimeout(r, ...))` as delays (e.g., `app/api/verify-task/route.ts:17`).

## Known Testing Gaps

1. **No tests at all** — the entire codebase (frontend + backend) has zero tests.
2. **Pure utility functions** — `lib/game-constants.ts` has deterministic math functions that are untested.
3. **State management hooks** — `useGameState`, `useAuth`, `useDailyChallenges` contain business logic with no tests.
4. **AI API routes** — All App Router API routes lack tests despite containing branching logic (mock mode vs real OpenAI calls).
5. **Backend server** — `backend/server.js` with Express routes and middleware has no tests.
6. **Critical paths** — The task completion-verification flow, XP calculation, level-up logic, streak tracking, and achievement unlocking are untested.

---

*Testing analysis: 2026-05-11*
