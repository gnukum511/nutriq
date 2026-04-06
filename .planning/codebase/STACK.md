# Technology Stack

**Analysis Date:** 2026-04-06

## Languages

**Primary:**
- JavaScript (ES Module) - Client and server code, `.js` files throughout `src/` and `api/`

## Runtime

**Environment:**
- Node.js (implicit via Vercel Edge Runtime)

**Package Manager:**
- pnpm - Lockfile present (pnpm-lock.yaml)

## Frameworks

**Core:**
- React 18.3.0 - UI framework for all views and components
- Vite 5.1.0 - Development server and build tool, configured at `vite.config.js`

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework
- PostCSS 8.4.35 - CSS processing pipeline
- Autoprefixer 10.4.18 - Vendor prefix automation

**Routing:**
- React Router DOM 6.22.0 - Client-side routing for views (`/locating`, `/`, `/menu/:id`, `/analysis`, `/settings`, `/profile`, `/tracker`)

**Animation:**
- Framer Motion 11.0.0 - Motion library for page transitions, component animations, and spring physics

**Icons & Maps:**
- Lucide React 0.577.0 - Icon library for UI chrome (Moon, Sun, Bell, LayoutGrid, etc.)
- Leaflet 1.9.4 - Interactive map library for restaurant locations
- React Leaflet 4.2.1 - React wrapper for Leaflet

**Testing & QA:**
- Puppeteer 22.0.0 - Browser automation for screenshot generation and interaction testing

## Key Dependencies

**Critical:**
- @upstash/redis 1.37.0 - Redis client for Pro status persistence (used in `api/stripe/webhook.js`, `api/stripe/verify.js`, `api/stripe/status.js`)

## Configuration

**Environment:**
- `.env` file present (not read - contains secrets)
- Dev vs. Production routing:
  - **Dev:** Direct Claude API calls via `VITE_CLAUDE_API_KEY` from `.env`
  - **Production:** Requests routed through `/api/claude` Vercel Edge Function
- Vite-specific env vars: `import.meta.env.DEV`, `import.meta.env.VITE_*`

**Build:**
- `vite.config.js` - Vite configuration with React plugin
- `tailwind.config.js` - Tailwind CSS color token system and font family extensions
- Vercel Edge Runtime functions configured with `export const config = { runtime: "edge" }` in `api/stripe/*.js` and `api/claude.js`

## Platform Requirements

**Development:**
- Node.js with pnpm package manager
- Port 3001 (Vite dev server, configured in `vite.config.js`)
- `.env` file with secrets: `VITE_CLAUDE_API_KEY`, `STRIPE_*` keys, `UPSTASH_*` Redis credentials

**Production:**
- Vercel Edge Runtime for API routes (`api/stripe/`, `api/claude.js`)
- Vercel environment variables for:
  - `ANTHROPIC_API_KEY` - Claude API key (server-side only)
  - `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, `STRIPE_WEBHOOK_SECRET` - Stripe payment processing
  - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - Redis key-value store for Pro subscription state
  - `VITE_APP_URL` - App base URL for Stripe success/cancel redirects (defaults to https://nutriq-wine.vercel.app)
- Deployed on Vercel at https://nutriq-wine.vercel.app

---

*Stack analysis: 2026-04-06*
