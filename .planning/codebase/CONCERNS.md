# Codebase Concerns

**Analysis Date:** 2026-05-11

## Tech Debt

### Plaintext Password Storage & In-Memory Auth

**Issue:** User passwords are stored in plaintext in `localStorage` and validated via string equality. There is no hashing, salting, or server-side authentication.

**Files:** `hooks/use-auth.ts` (lines 95, 182-184)

```typescript
// Line 95 - plaintext storage
localStorage.setItem(`timebot_password_${username}`, password);

// Lines 182-184 - plaintext comparison
const storedPassword = localStorage.getItem(`timebot_password_${username}`);
return storedPassword === password;
```

**Impact:** Any script running in the browser (including XSS or browser extensions) can read all stored passwords. This is a critical security anti-pattern. Passwords are also persisted indefinitely with no expiration.

**Fix approach:** Remove password storage entirely. Use a service-based auth approach (NextAuth, Clerk, or a custom backend with bcrypt). At minimum, never store passwords client-side.

---

### Fake In-App Purchases / Premium Bypass

**Issue:** Premium status is controlled entirely by a client-side boolean flag with no payment gateway integration. Users can trivially set `isPremium: true` via browser devtools on the localStorage `timebot_user` key.

**Files:** `hooks/use-auth.ts` (lines 70-97), `app/pricing/page.tsx` (lines 18-34)

**Impact:** The premium tier system ("Starter", "Elite", "Sovereign" at $4.99/$9.99/$19.99 per month) has no actual payment processing. The `handleUpgrade` function in `app/pricing/page.tsx` immediately calls `updatePremiumStatus(true, product.tier)` with zero payment validation. This makes the entire monetization strategy non-functional.

**Fix approach:** Integrate Stripe or a real payment provider. Move premium status checks to server-side or a backend API. Never trust client-side flags for paid features.

---

### Fake Rewards Redemption System

**Issue:** The Rewards Shop generates fake gift card codes from a non-deterministic `Math.random()` and does not actually fulfill real gift cards. XP is deducted from localStorage but no real-world value is delivered.

**Files:** `app/rewards/page.tsx` (lines 57-86, 88-103), `lib/rewards-catalog.ts` (lines 17-220)

```typescript
// Line 88-103 - Mock gift card code generation
const generateGiftCardCode = (provider: string): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // ...
  return codeSegments.join("-");
};
```

**Impact:** Users who earn XP legitimately will be unable to redeem actual gift cards. This is misleading and creates a broken promise if the app is deployed to real users. The mock codes are meaningless strings with no integration to any gift card provider API.

**Fix approach:** Either integrate with a real gift card API (e.g., Tango Card, Giftbit) or remove production-facing reward redemption UI. Clearly label as "demo only" if kept for testing.

---

### Mixed Mock/Production Code in API Routes

**Issue:** AI API routes contain inline mock fallback code that activates when `OPENAI_API_KEY` equals `"your_api_key_here"`. This couples development stubs with production logic.

**Files:** `app/api/verify-task/route.ts` (lines 16-22), `app/api/classify-task/route.ts` (lines 12-18), `app/api/ai-suggest/route.ts` (lines 12-20)

```typescript
// In all three API routes:
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_api_key_here") {
  // Return hardcoded mock responses
}
```

**Impact:** The placeholder API key check is fragile. Any deployment with a different placeholder value will bypass the mock and attempt real API calls with a real key. The mock responses don't match real API response shapes, causing inconsistent client behavior.

**Fix approach:** Extract mock logic to a separate dev-only module or a feature flag. Never check for specific placeholder string values.

---

### No ESLint Configuration

**Issue:** The `package.json` defines `"lint": "eslint ."` but no ESLint configuration file exists (no `.eslintrc`, `eslint.config.js`, etc.).

**Files:** `package.json` (line 9)

**Impact:** Running `npm run lint` will either fail or use default ESLint behavior that may not match project conventions. No code quality enforcement is in place.

**Fix approach:** Add an ESLint configuration file at the project root (e.g., `eslint.config.mjs` with Next.js recommended rules).

---

### No Test Coverage

**Issue:** The project has zero test files, no test runner configuration (no `jest.config.*`, `vitest.config.*`), and no testing dependencies in `package.json`.

**Impact:** No regression safety net. All logic (game state, XP calculations, streak tracking, import/export) is untested. Refactoring `hooks/use-game-state.ts` or `lib/game-constants.ts` risks breaking core functionality silently.

**Fix approach:** Add a test framework (Vitest recommended for Next.js) and unit tests for game logic functions in `lib/game-constants.ts` and hooks like `hooks/use-game-state.ts`.

---

### Overly Large Component Files

**Issue:** Several component files exceed 300-900 lines, mixing concerns and reducing maintainability.

**Files:**
- `app/login/page.tsx` — 865 lines (login form, particles animation, class selection UI, stat bars, floating icons, etc.)
- `components/avatar-3d.tsx` — 708 lines (3D model loading, procedurally generated avatar, weapon models by class, animations)
- `components/ui/sidebar.tsx` — 672 lines
- `app/avatar-creator/page.tsx` — 622 lines

**Impact:** Single files handling multiple responsibilities are hard to test, review, and maintain. The 3D avatar logic alone in `avatar-3d.tsx` mixes model loading, procedural mesh generation, weapon rendering, and animation frame logic.

**Fix approach:** Split `avatar-3d.tsx` into separate files for model loading, character body, weapons, and effects. Split `login/page.tsx` into smaller components.

---

### Date.now() for Unique IDs

**Issue:** Task IDs are generated using `Date.now().toString()` which can produce collisions if tasks are added rapidly.

**Files:** `hooks/use-game-state.ts` (line 150)

```typescript
const newTask: Task = {
  ...task,
  id: Date.now().toString(),  // Collision-prone
```

**Impact:** If two tasks are created within the same millisecond, they receive duplicate IDs, causing unexpected behavior in task completion, deletion, and rendering.

**Fix approach:** Use `crypto.randomUUID()` or a library like `nanoid` with sufficient entropy.

---

### Stale Closure in completeTask

**Issue:** Inside the `setStats` updater, the code uses the outer `tasks` variable (from the closure) rather than deriving state from the updater's `prev` argument — but `completeTask` also needs the task to read `difficulty` and `xpReward`. The `tasks` array captured at call time may be stale.

**Files:** `hooks/use-game-state.ts` (lines 174-176)

```typescript
setStats((prev) => {
  const task = tasks.find((t) => t.id === taskId);  // stale closure
  if (!task) return prev;
```

**Impact:** When `completeTask` is called rapidly from multiple sources, the `tasks.find` might not reflect the latest state since `setTasks` and `setStats` are separate state updates that may batch independently.

**Fix approach:** Pass the task data directly as a parameter to the updater, or use a ref to ensure the latest tasks are always available.

---

### Inconsistent localStorage Key Naming

**Issue:** Game state is stored under different key names across files, creating data fragmentation and potential conflicts.

**Files:**
- `hooks/use-game-state.ts` uses `"solo_leveling_game"` (STORAGE_KEY, line 63)
- `app/rewards/page.tsx` reads `"timebot-game-state"` (line 40) — a different key
- `hooks/use-auth.ts` uses `"timebot_user"` and `"timebot_password_{username}"`
- `hooks/use-daily-challenges.ts` uses `"timebot_daily_challenges"`
- `components/weekly-quests.tsx` uses its own `STORAGE_KEY`

**Impact:** The rewards page and the main game state hook store/retrieve XP from different localStorage keys, meaning XP spent on rewards doesn't actually deduct from the main game state used by the dashboard. The rewards page reads `timebot-game-state` (hyphenated) while the game hook stores under `solo_leveling_game` (underscored).

**Fix approach:** Use a single, consistent key pattern (e.g., `timebot:user`, `timebot:game`, `timebot:dailyChallenges`). Consolidate all data persistence through one service/module.

---

### `dangerouslySetInnerHTML` in Recharts Chart

**Issue:** The chart component uses `dangerouslySetInnerHTML`, which opens XSS vectors if any chart data includes user-controlled content.

**Files:** `components/ui/chart.tsx` (line 83)

**Impact:** If task titles or descriptions (user input) are reflected in chart labels/tooltips, XSS becomes possible.

**Fix approach:** Review whether the `dangerouslySetInnerHTML` is necessary. If it's from the Recharts library itself, ensure all data passed to charts is properly sanitized.

---

## Known Bugs

### XP Deduction Inconsistency Between Pages

**Symptoms:** XP spent on the Rewards page (`app/rewards/page.tsx`) deducts from `localStorage` key `"timebot-game-state"`, but the main game state hook (`hooks/use-game-state.ts`) stores/reads from `"solo_leveling_game"`. XP spent on rewards is never actually deducted from the user's visible XP balance on the dashboard.

**Files:** `app/rewards/page.tsx` (lines 76-81), `hooks/use-game-state.ts` (line 63, 82)

**Trigger:** User earns XP in the dashboard, navigates to /rewards, redeems a reward — XP appears deducted on the rewards page but not on the main dashboard.

**Workaround:** None.

---

### Task Completion Race Condition with Daily Challenges

**Symptoms:** When completing a task, `dailyChallenges.updateProgress("xp", ...)` and `gameState.completeTask(...)` are called sequentially but read different state snapshots, causing incorrect XPT tracking for daily challenge "XP Hunter" type challenges.

**Files:** `app/page.tsx` (lines 132-145)

```typescript
const handleCompleteTask = useCallback((taskId: string, awardedXp?: number) => {
  const task = gameState.tasks.find(t => t.id === taskId);
  gameState.completeTask(taskId, awardedXp);       // updates state asynchronously
  dailyChallenges.updateProgress("xp", gameState.stats.totalXp + (awardedXp || task.xpReward)); // stale XP
  // ...
}, [gameState, play, dailyChallenges]);
```

**Trigger:** Completing any task where a daily XP challenge is active.

**Workaround:** No impact on XP total, only daily challenge progress tracking may show slightly incorrect values.

---

### Focus Timer Duration Mismatch

**Symptoms:** The focus timer uses `durationMinutes` directly as total seconds (`durationMinutes * 60` on line 21), but the timer completion calls `onComplete(taskId, bonusXp)` which triggers `handleCompleteTask` which calls `gameState.completeTask(taskId, awardedXp)` and normal XP is also awarded. This means the task gets both base XP AND bonus XP on focus completion.

**Files:** `components/focus-timer.tsx` (lines 21, 31, 33-47), `app/page.tsx` (lines 149-151)

**Trigger:** Completing any task through the focus timer.

**Workaround:** None needed — this is an XP inflation bug that benefits the user.

---

## Security Considerations

### Plaintext Passwords in localStorage

**Risk:** Complete credential exposure via XSS, browser extensions, shared computers, or any other third-party JavaScript running in the same origin.

**Files:** `hooks/use-auth.ts` (lines 95, 182-184)

**Current mitigation:** None.

**Recommendations:**
- Remove client-side password storage entirely
- Implement server-side authentication (NextAuth.js, Clerk, or Supabase Auth)
- At minimum, hash passwords with a client-side library before storage (though this is still not recommended — server-side is the only safe approach)

---

### OpenAI API Key Management

**Risk:** The OpenAI API key is consumed in server-side API routes but the initialization pattern using a module-level client means the key is loaded at import time. The check `process.env.OPENAI_API_KEY === "your_api_key_here"` is a naive placeholder guard.

**Files:** `app/api/verify-task/route.ts` (lines 4-6), `app/api/classify-task/route.ts` (lines 4-6), `app/api/ai-suggest/route.ts` (lines 4-6), `app/api/upload/route.ts` (lines 4-6)

**Current mitigation:** Key is server-side only (non-NEXT_PUBLIC), never sent to client bundles.

**Recommendations:**
- Remove placeholder string checks; use a proper feature flag
- Add rate limiting to all AI endpoints to prevent cost abuse
- Consider using Vercel's Edge Config or a secrets manager

---

### No Input Validation on File Upload

**Risk:** The `/api/upload` route accepts arbitrary files with no size limit or type enforcement beyond the initial `File` type from `formData()`. A malicious client could upload extremely large base64-encoded files that consume server memory.

**Files:** `app/api/upload/route.ts` (lines 10-19)

```typescript
const file = formData.get("file") as File;
const buffer = await file.arrayBuffer();  // no size check
const base64 = Buffer.from(buffer).toString("base64");
```

**Current mitigation:** None.

**Recommendations:** Add file size validation (reject >10MB), MIME type whitelist, and a configurable upload limit on the route.

---

### No Input Validation on All API Routes

**Risk:** All four API routes (`verify-task`, `classify-task`, `ai-suggest`, `upload`) accept `req.json()` or `req.formData()` without Zod schema validation or sanitization. Malformed input is passed directly to OpenAI API calls.

**Files:** `app/api/verify-task/route.ts`, `app/api/classify-task/route.ts`, `app/api/ai-suggest/route.ts`, `app/api/upload/route.ts`

**Current mitigation:** None.

**Recommendations:** Add Zod schemas for request body validation on all API routes. Validate image payloads for size and format before processing.

---

## Performance Bottlenecks

### 3D Canvas Animations on All Pages

**Problem:** The `AnimatedBackground` component mounts a Three.js `<Canvas>` with `<Stars>`, `<Sparkles>`, particle fields, energy orbs, and glowing rings on every page. This runs continuously (using `useFrame` animation loop) regardless of whether the user can see it or whether the device has sufficient GPU.

**Files:** `components/animated-background.tsx` (entire file, 195 lines)

**Cause:** The component uses `requestAnimationFrame` via Three.js `useFrame` continuously. Particle count of 5000 stars + 200 particle field particles + 5 energy orbs + 3 glowing rings + 100 sparkles creates significant GPU load.

**Improvement path:**
- Disable animations on low-power devices (navigator.hardwareConcurrency check)
- Reduce particle counts
- Use `@react-three/drei` `AdaptiveDpr` or `AdaptiveEvents` to reduce quality on slow devices
- Stop the animation loop when the tab is not visible (Page Visibility API)

---

### Excessive Particle Effects on Login Page

**Problem:** The `InteractiveParticles` component creates canvas particles on every mousemove event and runs an animation loop continuously. Combined with `FloatingIcons`, `AnimatedBackground`, and CSS animations on the login page, this creates heavy rendering load.

**Files:** `app/login/page.tsx` (lines 124-218, 396-417, 895-911)

**Cause:** Particle creation on mouse move, combined with radial gradient calculations per frame, glow effects, and CSS animations all running simultaneously.

**Improvement path:** Limit particle count, pool/reuse particles, throttle mousemove handler, and debounce canvas clearing.

---

### localStorage Read/Write on Every State Change

**Problem:** The game state hook writes to localStorage on every state update via a `useEffect` dependency on `[tasks, stats, isLoaded]`. This means every task add, completion, or deletion triggers a synchronous JSON serialization and write to disk.

**Files:** `hooks/use-game-state.ts` (lines 96-100)

```typescript
useEffect(() => {
  if (isLoaded) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, stats }));
  }
}, [tasks, stats, isLoaded]);
```

**Cause:** No debouncing or batching. Rapid task operations cause frequent writes.

**Improvement path:** Debounce the save effect (e.g., 500ms), or use a batching mechanism. Consider `IndexedDB` for larger datasets.

---

## Fragile Areas

### Avatar 3D Loading and Fallback Chain

**Files:** `components/avatar-3d.tsx` (entire file)

**Why fragile:**
- External 3D model URLs (`models.bastion.club`, `threejs.org/examples/models/gltf/Soldier.glb`, `ReadyPlayer.me`) may become unavailable at any time
- Model fetch uses a 3-second timeout with AbortController — if the fetch completes after the state update, it can cause unmounted component state updates
- The fallback from external model to procedural `HumanoidAvatar` works but changes the visual appearance significantly
- The error handling timeout (5 seconds) and model error state are managed in separate components with different timing
- Several model entries have empty URLs (`url: ""`) which triggers the immediate error path

**Safe modification:** Add more robust model URL validation, cache model availability in localStorage, and test with all external URLs offline.

**Test coverage:** None.

---

### Game State Integrity

**Files:** `hooks/use-game-state.ts` (entire file)

**Why fragile:**
- Entire game state is stored in a single localStorage JSON blob with no error recovery
- The `JSON.parse` on load has a bare `catch` that silently fails but leaves the app in a loading state
- Import/export/reset functions have no validation beyond checking `data.tasks && data.stats`
- The `completeTask` function reads `tasks` from closure (stale closure issue) rather than passing data through
- Level calculation in `getLevelFromXp` uses a `while` loop that iterates per-level, which becomes slower at high levels (though this is unlikely to be a real bottleneck)

**Safe modification:** Add schema validation on import/load, use refs for current task data, add unit tests.

**Test coverage:** None.

---

### Weekly Quests Persistence

**Files:** `components/weekly-quests.tsx`

**Why fragile:** Weekly quests use localStorage with a week number check. If the week number calculation has any off-by-one errors (e.g., around year boundaries or daylight saving time transitions), quests may reset incorrectly. The component also duplicates game state data (total tasks, XP, streak, focus sessions) rather than sharing state from the hook.

**Test coverage:** None.

---

## Scaling Limits

### localStorage Storage Capacity

**Current capacity:** ~5-10MB per origin in most browsers.

**Limit:** As users accumulate more tasks (`hooks/use-game-state.ts` stores ALL tasks in an array with no pagination or archiving), the JSON blob grows. After thousands of tasks, the stringified JSON could approach storage limits. The import/export feature has no size validation and could fail silently on large datasets.

**Scaling path:** Implement task archiving for completed tasks older than 30 days. Consider IndexedDB for larger storage needs. Add size validation on import.

---

### OpenAI API Cost and Rate Limits

**Current usage:** Every task verification and classification calls OpenAI's API. For a single user completing 10 tasks, this means 10 GPT-4o calls + 10 GPT-4o-mini calls.

**Limit:** At scale (hundreds of users), API costs scale linearly. GPT-4o is expensive ($2.50/1M input tokens for vision). No rate limiting is implemented.

**Scaling path:** Add rate limiting per user/IP, caching for repeated classifications, and a cost tracking mechanism. Consider using a cheaper model for classification tasks.

---

## Dependencies at Risk

### ReadyPlayer.me External Model URLs

**Risk:** Hardcoded ReadyPlayer.me model URLs (`models.readyplayer.me`) in `hooks/use-auth.ts` (lines 27-30) and `lib/premium-products.ts` (lines 21, 38, 57) are third-party services that could change URLs, require authentication, or be deprecated.

**Impact:** Avatar 3D models fail to load silently. Users see the procedural fallback avatar instead.

**Migration plan:** Self-host GLB model files, or add a CDN caching layer with local fallbacks.

---

### Bastion.club External Model URLs

**Risk:** `models.bastion.club/Mannequin.glb` and `models.bastion.club/Woman.glb` used in `components/avatar-3d.tsx` (lines 26, 49) are from a lesser-known CDN.

**Impact:** If this service goes down, the primary 3D model for new users fails to load.

**Migration plan:** Replace with more reliable model sources or self-host.

---

### Soldier.glb from threejs.org Examples

**Risk:** `https://threejs.org/examples/models/gltf/Soldier.glb` is an example file that could be removed or reorganized in future Three.js releases.

**Impact:** The "Casual Guy" model fails to load.

**Migration plan:** Copy the model to the project's public directory.

---

## Missing Critical Features

### No Authentication System

**Problem:** There is no real authentication system. The app uses localStorage-based "auth" that is trivially bypassed. Users can log in as any existing user by setting `timebot_password_{username}` in localStorage.

**Blocks:** Premium purchases, data persistence across devices, multiplayer/leaderboard features, gift card fulfillment, and any production deployment with real users.

---

### No Persistent Backend

**Problem:** All data is stored in the browser's localStorage. Clearing browser data or using a different device results in complete data loss. The import/export feature is the only way to transfer data.

**Blocks:** Cross-device usage, user accounts, data recovery, server-side analytics, and any social or competitive features.

---

### No Error Monitoring

**Problem:** The app has no error tracking service (Sentry, LogRocket, etc.). The only error logging is scattered `console.error` calls in API routes and hooks.

**Files:** Various — `console.error` appears in `hooks/use-game-state.ts` (line 89), `app/api/verify-task/route.ts` (line 52), `app/api/upload/route.ts` (line 40), `app/login/page.tsx` (line 521)

**Impact:** Silent failures in production with no observability. Cannot diagnose user issues without reproducing them locally.

---

## Test Coverage Gaps

### What's Not Tested

| Area | Files | Risk | Priority |
|------|-------|------|----------|
| XP/Level calculation | `lib/game-constants.ts` | Core game balance | High |
| Streak tracking | `hooks/use-game-state.ts` (lines 102-143) | Streak bugs affect daily challenges | High |
| Achievement detection | `hooks/use-game-state.ts` (lines 192-255) | Missed achievement unlocks | Medium |
| Import/Export | `hooks/use-game-state.ts` (lines 335-363) | Data corruption | High |
| Seeded randomness for challenges | `hooks/use-daily-challenges.ts` (lines 42-72) | Same challenges for all users | Medium |
| Sound system | `hooks/use-sound.ts` | Error handling edge cases | Low |
| XP calculation for task | `lib/game-constants.ts` (lines 45-48) | Core balance | High |
| Rewards catalog filtering | `lib/rewards-catalog.ts` (lines 236-248) | Incorrect reward display | Medium |
| Premium cosmetic filtering | `lib/premium-cosmetics.ts` (lines 112-115) | Wrong cosmetics shown | Low |

---

*Concerns audit: 2026-05-11*
