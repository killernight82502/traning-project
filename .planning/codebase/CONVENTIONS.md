# Coding Conventions

**Analysis Date:** 2026-05-11

## Naming Patterns

**Files:**
- kebab-case for all file names: `task-card.tsx`, `game-constants.ts`, `use-game-state.ts`, `animated-background.tsx`
- Route files use Next.js App Router convention: `app/api/ai-suggest/route.ts`, `app/login/page.tsx`

**Functions:**
- `camelCase` for all function and method names: `export function TaskCard()`, `const handleSubmit = () =>`, `useEffect(() => {...})`
- React components use PascalCase and are defined with `function` keyword (not arrow function assignments to const), e.g. `function TaskCard({ task, onComplete }: TaskCardProps)` in `components/task-card.tsx`
- Custom hooks use `use` prefix in PascalCase: `useGameState`, `useAuth`, `useDailyChallenges`, `useSound`, `useToast`, `useIsMobile`, `useMobile`
- Private/internal helper functions use camelCase: `formatNumber`, `getDifficultyGlow`, `genId`, `seededRandom`, `getDailySeed`

**Variables:**
- `camelCase` for all local variables: `const activeTasks`, `const isCompleted`, `const newTotalXp`
- Constants at module level use `SCREAMING_SNAKE_CASE`: `const STORAGE_KEY = "solo_leveling_game"`, `const TOAST_LIMIT = 1`, `const XP_PER_DOLLAR = 5000`

**Types:**
- PascalCase for interfaces and type aliases: `interface Task`, `interface PlayerStats`, `interface User`, `type SoundType`
- Located in `hooks/` files alongside their consuming code (co-located type definitions), e.g. `Task` interface in `hooks/use-game-state.ts`, `User` interface in `hooks/use-auth.ts`
- Props interfaces named `{ComponentName}Props`: `TaskCardProps`, `TaskFormProps`, `StatsPanelProps`

## Code Style

**Formatting:**
- No Prettier or ESLint config detected. The project relies on editor defaults.
- Two spaces for indentation used consistently.
- Tab/space: tabs not used.
- Inconsistency: `app/` pages use semicolons (`;`) while `components/ui/` (shadcn) files omit semicolons. New code should match whichever convention is in the file being edited.
- Inconsistency: `app/` pages use double quotes (`"`) for JSX props and imports, while `components/ui/` (shadcn) files use single quotes (`'`). Follow per-file convention.

**Linting:**
- ESLint is listed as a dev script (`"lint": "eslint ."`) in `package.json` but no `.eslintrc.*` or `eslint.config.*` file is present.
- No linting rules are enforced at commit time.
- TypeScript `strict: true` is enabled in `tsconfig.json` but `next.config.mjs` overrides with `typescript: { ignoreBuildErrors: true }`, effectively disabling strict type checking at build time.

**Line Length:**
- UI component lines can be very long (e.g., Tailwind CSS class strings spanning 5+ lines). No line-length enforcement.

## Import Organization

**Order:**
1. React/Next.js imports first: `import { useState } from "react"`, `import { NextResponse } from "next/server"`
2. Third-party library imports: `import { cva } from "class-variance-authority"`, `import { toast } from "sonner"`, `import { OpenAI } from "openai"`
3. Local module imports using `@/` alias: `import { cn } from "@/lib/utils"`, `import { Button } from "@/components/ui/button"`, `import { useAuth } from "@/hooks/use-auth"`
4. Relative imports (rare, used in `app/` pages): `import "./globals.css"`, `import { VerificationModal } from "./verification-modal"`

**Path Aliases:**
- `@/*` maps to project root (configured in `tsconfig.json` paths `{ "@/*": ["./*"] }`)
- shadcn aliases configured in `components.json`: `@/components`, `@/lib/utils`, `@/hooks`, `@/components/ui`

## Error Handling

**Patterns:**
- API routes use try/catch blocks returning `NextResponse.json({ error: error.message }, { status: 500 })` pattern, e.g. `app/api/ai-suggest/route.ts:30-32`
- Client-side operations use try/catch with `console.error()` fallback and `toast.error()` user notification, e.g. `hooks/use-game-state.ts:86-91`
- JSON parsing in hooks guarded with try/catch: `hooks/use-game-state.ts:85`, `hooks/use-auth.ts:46`, `hooks/use-daily-challenges.ts:86`
- React error boundaries: Not detected in the codebase.
- TypeScript catch clauses use `catch (error: any)` pattern (unsafe typing): `app/api/ai-suggest/route.ts:30`, `app/api/verify-task/route.ts:51`

**Pattern:**
```typescript
try {
  const data = JSON.parse(saved);
  setTasks(data.tasks);
} catch (error) {
  console.error("Failed to load game state:", error);
}
```

## Logging

**Framework:** `console.log`, `console.error`, `console.warn` — no structured logging library detected.

**Patterns:**
- `console.error` for error cases: `console.error("Failed to load game state:", error)`
- `console.warn` for non-critical warnings: `console.warn("Failed to play sound:", error)`
- `console.log` for occasional debugging: `console.log("[v0] Login error:", err)`
- Browser-to-terminal logging enabled in `next.config.mjs`: `logging: { browserToTerminal: true }`

## Comments

**When to Comment:**
- Section headers with `// ========...` banners in larger files: `backend/server.js` uses section banners extensively
- Explanation of non-obvious logic: `// Track level changes for level up overlay` in `app/page.tsx:82`
- Props/state reasoning: `// Premium avatar URLs based on tier` in `hooks/use-auth.ts:25`
- TODO-style comments are rare. No `FIXME` or `HACK` tags found.

**JSDoc/TSDoc:**
- Not used. No JSDoc comments found anywhere in the codebase.

## Function Design

**Size:**
- Functions vary from single expressions (`cn` in `lib/utils.ts:4`) to large components (`app/page.tsx` with ~450 lines, `app/login/page.tsx` with ~900 lines).
- Components commonly render JSX inline without extraction (e.g., the loading screen JSX is inlined in `app/page.tsx:182-194`).

**Parameters:**
- React components use destructured props pattern with TypeScript interfaces:
  ```typescript
  function TaskCard({ task, onComplete, onDelete, onFocusMode }: TaskCardProps)
  ```
- Callback functions use typed parameters and optional params:
  ```typescript
  const handleCompleteTask = useCallback((taskId: string, awardedXp?: number) => { ... }, [deps])
  ```

**Return Values:**
- React components return JSX elements or null-like expressions (`if (condition) return <div>...</div>`)
- Utility functions return typed values (`string`, `boolean`, `number`)

## Module Design

**Exports:**
- Named exports for all functions and components: `export function TaskCard()`, `export const useGameState = () =>`
- Default exports only for Next.js page components: `export default function Home()`, `export default function LoginPage()`
- Barrel exports in `components/ui/` files: `export { Button, buttonVariants }` at end of file

**Barrel Files:**
- No barrel/index files detected. Each component is imported directly from its file.

## Component Patterns

**"use client" Directive:**
- Every component that uses React hooks, event handlers, or browser APIs includes `"use client"` at the top: `components/task-card.tsx:1`, `components/task-form.tsx:1`, `hooks/use-game-state.ts:1`
- Server components (layout, some pages) omit it: `app/layout.tsx` (no `"use client"`)

**shadcn/ui Component Pattern:**
```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva('base-classes', { variants: { ... }, defaultVariants: { ... } })

function Component({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof componentVariants>) {
  return <div data-slot="component" className={cn(componentVariants({ variant }), className)} {...props} />
}

export { Component }
```

**Ripple Effect Pattern:**
- The `Button` component in `components/ui/button.tsx` implements a ripple effect using an internal `ripples` state array with `setTimeout` cleanup. This is not extracted to a shared hook.

## Custom Hooks Pattern

- Hooks return an object of values and functions: `return { tasks, stats, addTask, completeTask, ... }`
- Hooks manage state via `useState`, `useEffect`, and `useCallback`
- localStorage persistence is embedded within hooks rather than extracted to a shared utility
- Example from `hooks/use-game-state.ts`:
  ```typescript
  export const useGameState = (): GameState => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<PlayerStats>({...});
    // Load on mount, save on change
    useEffect(() => { ... }, []);
    useEffect(() => { localStorage.setItem(..., JSON.stringify(...)) }, [tasks, stats]);
    return { tasks, stats, addTask, completeTask, ... };
  };
  ```

## Tailwind CSS Patterns

- Utility-first Tailwind CSS with custom CSS variables defined in `app/globals.css`
- Custom `@theme inline` block in CSS defines design tokens (colors, fonts, radii)
- Extensive custom CSS animations defined in `app/globals.css` using `@keyframes` and utility classes
- `.glass` utility class for backdrop-blur card effect
- shadcn/ui New York style configured in `components.json`
- Tailwind v4 with `@tailwindcss/postcss` plugin

## API Route Convention

- Next.js App Router API routes in `app/api/{name}/route.ts`
- Named `export async function POST(req: Request)` handler
- OpenAI client instantiated at module level: `const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })`
- Mock fallback behavior when `OPENAI_API_KEY` is not configured (returns hardcoded responses)

## Backend Convention (`backend/server.js`)

- CommonJS (`require`/`module.exports`) for Node.js backend
- Express app with CORS middleware running on port 3001
- In-memory data store (arrays) for demo
- Separate Express backend from Next.js frontend (not integrated via API routes)

---

*Convention analysis: 2026-05-11*
