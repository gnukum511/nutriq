# Memory

_Last updated: 2026-05-04_

## Decisions

- **Yelp-inspired UI** (2026-03) — red gradient hero banners, star ratings, price tiers for familiarity and trust (superseded 2026-04-30 by organic redesign, but the structural Yelp DNA — cards, ratings, price tiers — remains)
- **Framer Motion only, no CSS transitions** (2026-03) — enforced via CLAUDE.md to keep animation system consistent
- **react-leaflet v4** (2026-03) — v5 requires React 19; staying on v4 for React 18 compat
- **localStorage auth** (2026-03) — no backend auth yet; simple sign-in/sign-up stored locally
- **Edge Runtime proxy** (2026-03) — `/api/claude` keeps ANTHROPIC_API_KEY server-side in production
- **3 Overpass mirrors** (2026-03) — kumi.systems → overpass-api.de → mail.ru for reliability
- **JSON salvage fallback** (2026-03) — recovers truncated Claude menu responses rather than failing
- **Distances in miles** (2026-03) — US-focused product decision, formatDistance helper enforces it
- **Freemium quota: 3 menus/day + 1 analysis/day free** (2026-03) — Pro tier = unlimited, $4.99/mo or $39.99/yr
- **Pseudo-generated ratings** (2026-03) — star ratings and price tiers generated from restaurant name hash, not real data
- **Stripe Checkout session verify flow** (2026-04) — after payment, Stripe redirects to `/?session_id=cs_...`; app calls `/api/stripe/verify` server-side to confirm and set localStorage Pro flag
- **Upstash Redis via Vercel Marketplace** (2026-04) — chose `upstash/upstash-kv` (not `@vercel/kv` which is sunset); KV key: `pro:{stripeCustomerId}`
- **Stripe live key rolled** (2026-04-05) — original key exposed in terminal; new key in .env and Vercel production
- **Organic redesign** (2026-04-30) — visual port from `nutriq-redo-glow`: oklch tokens, Fraunces+Inter fonts, cream/leaf/apricot/tomato palette. Backend untouched.
- **Read Marketplace KV env var names directly** (2026-05-01) — server code reads `KV_REST_API_URL` / `KV_REST_API_TOKEN` (Vercel KV-compatible names auto-injected by the Upstash Marketplace integration). Did NOT alias to `UPSTASH_REDIS_REST_*` — fewer env vars, canonical Marketplace naming. `@upstash/redis` SDK accepts either.
- **Stripe webhook listens to 3 events** (2026-05-01) — `checkout.session.completed` (grant), `customer.subscription.deleted` (revoke), `invoice.payment_failed` (revoke). Pre-fix only `invoice.payment_failed` was enabled — silent miss on cancellations and grants for ~26 days.

## Patterns

- **AI menu generation** — lazy on tap, session-cached via `useMenu.js`; never pre-loaded
- **Health score colors** — leaf ≥75, accent-foreground (deep apricot) ≥50, tomato <50 in `ScoreRing.jsx` (post-redesign palette)
- **Spring config standard** — `{ type: "spring", stiffness: 300, damping: 24 }`
- **Spring config bouncy** — `{ type: "spring", stiffness: 420, damping: 20 }`
- **Restaurant logos** — Google favicon service (`google.com/s2/favicons?domain=...&sz=64`), fallback to `CuisineIcon.jsx`
- **Cream hero gradient** — `var(--gradient-hero)` radial cream + apricot/leaf glow on every page hero (post-redesign)
- **Vercel preview env vars** — CLI plugin blocks all methods; only works via Vercel Dashboard manually

## Known Issues

- **Upstash Redis not provisioned** — status: RESOLVED 2026-05-01; provisioned via `vercel integration add upstash/upstash-kv` → resource `upstash-kv-coffee-school`
- **Env var name mismatch (UPSTASH_REDIS_REST_* vs KV_REST_API_*)** — status: RESOLVED 2026-05-01; server code updated in commit 8c5fd0f
- **Stripe webhook pinned to dead nutriq-wine.vercel.app** — status: RESOLVED 2026-05-01; repointed to nutriq-eosin.vercel.app via Stripe API
- **Stripe webhook only listening to invoice.payment_failed** — status: RESOLVED 2026-05-01; expanded to 3 events
- **Preview env vars missing** — status: open; ANTHROPIC_API_KEY + Stripe secrets not on preview; must add via dashboard
- **Overpass API timeouts** — status: open/workaround; mitigated by 3-mirror fallback
- **react-leaflet v5 peer dep warning** — status: open/accepted; using v4 intentionally for React 18 compat
- **Delivery links by name search** — status: open/accepted; DoorDash/Uber Eats may not find exact restaurant match
- **useAuth.js test seed** — status: open; uncommitted test user apptest@nutriiq.com / password123! in hook
- **Local pnpm build broken** — status: open/workaround; rollup native binary issue on Node v25; use `git push` (Vercel auto-deploys) or `vercel deploy --prod`
- **STACK.md describes pre-redesign palette/fonts** — status: open; `.planning/codebase/STACK.md` predates the organic redesign

## Environment

- Node: managed via local toolchain; pnpm for package management
- Claude model: `claude-sonnet-4-6` (menu: 2000 tokens, analysis: 600 tokens)
- Dev: `VITE_CLAUDE_API_KEY` in `.env`
- Prod: `ANTHROPIC_API_KEY` in Vercel dashboard
- Redis (prod/preview/dev): `KV_REST_API_URL` + `KV_REST_API_TOKEN` (auto-injected by Upstash Marketplace integration)
- Local dev server: http://localhost:3001
- Vercel CLI: installed at /opt/homebrew/bin/vercel (v50.39.0 — outdated; latest is 53.0.1)
- Project linked: garrymills-5132s-projects/nutriq (prj_lJRXwHqw1adlk4uDnEzC0heCVJUx)
- Upstash resource: `upstash-kv-coffee-school` (provisioned 2026-05-01)

## Stripe IDs

- Product: prod_UGntPwCQw1fcWm
- Monthly price: price_1TIGHZANF8XrNJ2lfkTZFfoA ($4.99/mo, 7-day trial)
- Annual price: price_1TIGHZANF8XrNJ2lAjtI5PEO ($39.99/yr, 7-day trial)
- Webhook: we_1TIGHZANF8XrNJ2l8qdaMRJi → https://nutriq-eosin.vercel.app/api/stripe/webhook
- Webhook events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed

## Project Links

- Live (canonical): https://nutriq-eosin.vercel.app
- Stale alias (do not use): https://nutriq-wine.vercel.app
- Repo: https://github.com/gnukum511/nutriq
- Vercel dashboard: https://vercel.com/garrymills-5132s-projects/nutriq
- Upstash dashboard: https://vercel.com/d/dashboard/integrations/upstash/icfg_9vReoAXfktZYpvpnY0Fx0JiS/resources/store_PlqPMU9502SkgDjo
- Framer MCP: connected via `mcp-remote` with `http-first` transport (portfolio site, separate from NUTRÏQ)
