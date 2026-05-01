# Technology Stack

**Last refresh:** 2026-04-30 (post-redesign)
**Original analysis:** 2026-04-06

## Languages

**Primary:**
- JavaScript (ES Module) - Client and server code, `.js` / `.jsx` files throughout `src/` and `api/`

## Runtime

**Environment:**
- Node.js (implicit via Vercel Edge Runtime)

**Package Manager:**
- pnpm - Lockfile present (`pnpm-lock.yaml`)

## Frameworks

**Core:**
- React 18.3.0 - UI framework for all views and components
- Vite 5.1.0 - Development server and build tool, configured at `vite.config.js`

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework. **Intentionally kept on v3** during the 2026-04-30 redesign port from `nutriq-redo-glow` (which uses Tailwind v4 with `@theme inline`). v3 here uses CSS variables exposed in `tailwind.config.js`.
- PostCSS 8.4.35 - CSS processing pipeline
- Autoprefixer 10.4.18 - Vendor prefix automation

**Routing:**
- React Router DOM 6.22.0 - Client-side routing for views (`/locating`, `/`, `/menu/:id`, `/analysis`, `/settings`, `/profile`, `/tracker`)

**Animation:**
- Framer Motion 11.0.0 - Motion library for page transitions, component animations, spring physics. Mandatory for component-level motion (no CSS transitions). Two utility transitions remain in CSS for chrome-only effects (`var(--transition-smooth)`).

**Icons & Maps:**
- Lucide React 0.577.0 - Icon library for UI chrome (Moon, Sun, Bell, LayoutGrid, etc.) — `strokeWidth={1.5}`
- Leaflet 1.9.4 - Interactive map library for restaurant locations
- React Leaflet 4.2.1 - React wrapper for Leaflet
- Restaurant pin markers are inline SVG with leaf-gradient fill (see `src/components/RestaurantMap.jsx`)

**Testing & QA:**
- Puppeteer 22.0.0 - Browser automation for screenshot generation and interaction testing
- Chrome DevTools MCP - Used during interactive QA sessions when Puppeteer's bundled Chrome is unavailable

## Design System

**Fonts (loaded via Google Fonts in `index.html`):**
- **Fraunces** — display / headings (weights 400/500/600/700, optical size axis)
- **Inter** — body / UI (weights 400/500/600/700)
- Replaced Playfair Display + Plus Jakarta Sans during the 2026-04-30 redesign

**Color tokens (oklch — semantic only, in `src/index.css`):**
- `--background`, `--foreground`, `--card`, `--card-foreground`
- `--primary` / `--primary-foreground` / `--primary-soft` (botanical green CTAs)
- `--leaf` (gradient-ready primary band)
- `--accent` / `--accent-foreground` (soft apricot — stars, calories)
- `--tomato` / `--tomato-foreground` (warm callouts — fat, errors, urgency)
- `--secondary`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--destructive`
- Chart colors `--chart-1`..`--chart-5`

**Gradients & shadows:**
- `--gradient-hero` — cream + apricot/leaf radial glow (page heroes, light); deep botanical equivalent in dark
- `--gradient-leaf` — primary→leaf 135deg (CTAs, brand stripes, modal headers)
- `--gradient-warm` — apricot→amber 135deg (PRO badge, score band)
- `--shadow-soft`, `--shadow-elevated`, `--shadow-glow`

**Theme system:**
- `useTheme` hook (`src/hooks/useTheme.js`) toggles a `.dark` class on `<html>` and persists choice to `localStorage["nutriq_theme"]`. Updates `<meta name="theme-color">` for mobile chrome.
- All dark variants live under `.dark` selectors in `src/index.css`. **No inline token injection** — the old useTheme implementation that wrote hex values to `document.documentElement.style` was removed in commit `65a77a7`.

**Tailwind exposure:**
- Semantic class names (`bg-primary`, `text-foreground`, `bg-card`, `text-muted-foreground`)
- Legacy aliases (`bg-red`→tomato, `bg-gold`→accent, `bg-green`→leaf, `bg-charcoal`→background) so existing class strings render correctly during the transition. Aliases for `--cream` and `--muted` re-point to text foregrounds in `:root` and `.dark`.

## Key Dependencies

**Critical:**
- `@upstash/redis` 1.37.0 - Redis client for Pro status persistence (used in `api/stripe/webhook.js`, `api/stripe/verify.js`, `api/stripe/status.js`). **NOT YET PROVISIONED** in Vercel — env vars `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are missing as of 2026-04-30.

**Stripe:**
- No `stripe` npm dependency — Stripe API is called directly via `fetch` from Edge Functions to keep bundle minimal.

## Configuration

**Environment:**
- `.env` file present (not read - contains secrets)
- Dev vs. Production routing:
  - **Dev:** Direct Claude API calls via `VITE_CLAUDE_API_KEY` from `.env`
  - **Production:** Requests routed through `/api/claude` Vercel Edge Function
- Vite-specific env vars: `import.meta.env.DEV`, `import.meta.env.VITE_*`

**Build:**
- `vite.config.js` - Vite configuration with React plugin (declares port 3002)
- `package.json` `scripts.dev` - Overrides Vite config with `--port 3001` flag (actual dev port)
- `tailwind.config.js` - Semantic color names + legacy aliases, font families (display=Fraunces, body=Inter), border radius scale, shadow + gradient utilities
- Vercel Edge Runtime functions configured with `export const config = { runtime: "edge" }` in `api/stripe/*.js` and `api/claude.js`

## Platform Requirements

**Development:**
- Node.js with pnpm package manager
- Port 3001 (Vite dev server, set via `npm run dev` flag override)
- `.env` file with secrets: `VITE_CLAUDE_API_KEY`, `STRIPE_*` keys, `UPSTASH_*` Redis credentials

**Production:**
- Vercel Edge Runtime for API routes (`api/stripe/`, `api/claude.js`)
- Vercel environment variables for:
  - `ANTHROPIC_API_KEY` - Claude API key (server-side only)
  - `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL`, `STRIPE_WEBHOOK_SECRET` - Stripe payment processing
  - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` - Redis key-value store for Pro subscription state (still missing at time of writing)
  - `VITE_APP_URL` - App base URL for Stripe success/cancel redirects (defaults to https://nutriq-wine.vercel.app)
- Deployed on Vercel at https://nutriq-wine.vercel.app
- Auto-deploys from `master` branch

## Recent Stack Changes

| Date | Commit | Change |
|------|--------|--------|
| 2026-04-30 | `65a77a7` | `useTheme` rewritten to toggle `.dark` class instead of inline hex injection; dark-mode hero gradients added |
| 2026-04-30 | `17cd176` | Organic redesign — oklch token system, Fraunces+Inter fonts, leaf/apricot/tomato palette, restyled hero banners + cards + CTAs |
| 2026-04-21 | `833ddb4` | Dev port set to 3002 in `vite.config.js` (overridden by `npm run dev --port 3001`) |
| 2026-04-05 | `20f00dd` | Upstash Redis client added for Pro persistence (env vars not yet provisioned) |
| 2026-04-05 | `a03664f` | Stripe Checkout wired (no SDK — direct fetch from Edge Functions) |

---

*Stack analysis: 2026-04-06; refreshed 2026-04-30 after the organic redesign port.*
