# Technology Stack

**Analysis Date:** 2026-05-11

## Languages

**Primary:**
- **TypeScript** 5.7.3 — All frontend source code (`app/`, `components/`, `hooks/`, `lib/`, `types/`)

**Secondary:**
- **JavaScript (ES2022)** — Backend Express server (`backend/server.js`)
- **CSS** — Tailwind CSS v4 with custom keyframes/animations (`app/globals.css`)

## Runtime

**Environment:**
- **Node.js** (inferred from Next.js 16 requirements — version not pinned in `.nvmrc` or `.node-version`)
- Dual package managers detected: `pnpm-lock.yaml` (primary) and `package-lock.json` (secondary)

**Package Manager:**
- **pnpm** (with `pnpm-lock.yaml`) — the more recently used manager
- **npm** (with `package-lock.json`) — also present
- Lockfile: both present

## Frameworks

**Core:**
| Framework | Version | Purpose |
|-----------|---------|---------|
| Next.js | ^16.2.4 | React framework (App Router, RSC mode) |
| React | 19.2.4 | UI component library |
| Express | ^5.2.1 | Backend REST API (`backend/server.js`) |

**UI:**
| Library | Version | Purpose |
|---------|---------|---------|
| shadcn/ui | — | Component library scaffold (via `components.json`) |
| Tailwind CSS | ^4.2.0 | Utility-first CSS framework |
| Radix UI Primitives | ~1.x (20+ packages) | Headless accessible UI primitives |
| three.js | ^0.173.0 | 3D rendering library |
| @react-three/fiber | ^9.5.0 | React renderer for Three.js |
| @react-three/drei | ^10.7.7 | Three.js helper utilities |

**Testing:**
- Not detected — no test runner, no test files, no test config

**Build/Dev:**
| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | 5.7.3 | Type checking & compilation |
| PostCSS | ^8.5 | CSS processing |
| @tailwindcss/postcss | ^4.2.0 | Tailwind CSS PostCSS plugin |
| LightningCSS | ^1.32.0 | CSS bundling/optimization (in deps) |
| tw-animate-css | 1.3.3 | Tailwind animation utility |
| autoprefixer | ^10.4.27 | CSS vendor prefixes |

## Key Dependencies

**Critical:**
| Package | Version | Why it matters |
|---------|---------|----------------|
| openai | ^6.32.0 | Powers all AI features (task suggestions, classification, verification) |
| next | ^16.2.4 | Entire frontend framework |
| react / react-dom | 19.2.4 | UI rendering |

**Infrastructure:**
| Package | Version | Purpose |
|---------|---------|---------|
| recharts | 2.15.0 | Spider/radar charts for player stats |
| react-hook-form | ^7.54.1 | Form handling |
| zod | ^3.24.1 | Schema validation |
| sonner | ^1.7.1 | Toast notifications |
| lucide-react | ^0.564.0 | Icon library |
| date-fns | 4.1.0 | Date manipulation |
| next-themes | ^0.4.6 | Theme provider (dark/light) |
| embla-carousel-react | 8.6.0 | Carousel component |
| cmdk | 1.1.1 | Command menu |
| class-variance-authority | ^0.7.1 | Component variant management |
| clsx | ^2.1.1 | Conditional class merging |
| tailwind-merge | ^3.3.1 | Tailwind class deduplication |
| react-day-picker | 9.13.2 | Date picker |
| vaul | ^1.1.2 | Drawer component |
| react-resizable-panels | ^2.1.7 | Resizable panel layout |

**Backend:**
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | HTTP server framework |
| cors | ^2.8.6 | CORS middleware |
| body-parser | ^2.2.2 | Request body parsing |
| multer | ^2.1.1 | Multipart/form-data (file uploads) |
| dotenv | ^17.3.1 | Environment variable loading |
| openai | ^6.32.0 | OpenAI API client |

## Configuration

**Environment:**
- Configured via `.env` file at project root (loaded by both backend and Next.js)
- Example template at `.env.example`

**Key Environment Variables:**
| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Yes | Application URL |
| `NEXT_PUBLIC_SITE_NAME` | Yes | Site display name |
| `OPENAI_API_KEY` | Yes | OpenAI API access |
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | No | Vercel analytics |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe payments (future) |
| `STRIPE_SECRET_KEY` | No | Stripe server key (future) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhooks (future) |
| `NEXTAUTH_SECRET` | No | Auth secret (future) |
| `NEXTAUTH_URL` | No | Auth URL (future) |

**Build Configuration:**
- `tsconfig.json` — Strict mode, ES6 target, ESNext modules, bundler resolution, `@/*` path alias to root
- `next.config.mjs` — TS build errors ignored, images unoptimized, browser→terminal logging
- `postcss.config.mjs` — Tailwind PostCSS plugin only

## Platform Requirements

**Development:**
- Node.js (version not pinned — no `.nvmrc` or `.node-version` file)
- pnpm or npm

**Production:**
- Vercel-compatible (`.vercel` in `.gitignore`, v0 sandbox references present)
- No explicit Dockerfile or container config
- No CI/CD pipeline detected (no `.github/` workflows)

---

*Stack analysis: 2026-05-11*
