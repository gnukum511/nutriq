# External Integrations

**Analysis Date:** 2026-04-06

## APIs & External Services

**Anthropic Claude API:**
- Service: LLM for menu generation and meal analysis
  - SDK/Client: Built-in `fetch()` via Anthropic REST API
  - Model: `claude-sonnet-4-6` (specified in `api/claude.js` line 60)
  - Auth: `ANTHROPIC_API_KEY` environment variable (server-side only)
  - Implementation: Dual-path routing
    - **Dev:** Direct browser calls to `https://api.anthropic.com/v1/messages` via `src/lib/claude.js`
    - **Production:** Proxied through `api/claude.js` Vercel Edge Function to keep key server-side
  - Usage:
    - Menu generation: 2000 max tokens via `generateMenu(restaurantName, cuisineType)` in `src/lib/claude.js`
    - Meal analysis: 600 max tokens via `analyzeMeal(selectedItems)` in `src/lib/claude.js`

**OpenStreetMap Overpass API:**
- Service: Restaurant geospatial data fetching
  - Implementation: Bounding box queries (5 mile/8.05 km radius)
  - Mirror URLs (fallback chain): kumi.systems → overpass-api.de → mail.ru
  - Query: `nwr["amenity"~"^(restaurant|fast_food|cafe)$"](bbox)` in `src/lib/overpass.js`
  - Returns: Name, cuisine type, phone, website, coordinates
  - Auth: None (public API)

## Data Storage

**Databases:**
- Not applicable - application is stateless for user data

**File Storage:**
- Local filesystem only (screenshots for QA via Puppeteer)

**Caching & Session Store:**
- Upstash Redis (via Vercel Marketplace integration)
  - Connection: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (injected by Vercel)
  - Client: `@upstash/redis` 1.37.0
  - Purpose: Persist Pro subscription status (canonical source of truth)
  - Key structure: `pro:{customerId}` → `"true"` (set by webhook, verify, status endpoints)
  - Used in:
    - `api/stripe/webhook.js` - Grants/revokes Pro on subscription events
    - `api/stripe/verify.js` - Confirms checkout session and writes Pro status
    - `api/stripe/status.js` - Re-verifies Pro status on app load

## Authentication & Identity

**Auth Provider:**
- Custom localStorage-based implementation (demo/QA only)
  - Implementation: `src/hooks/useAuth.js`
  - Storage: localStorage key `nutriq_auth`
  - Test user: `apptest@nutriiq.com` / `password123!` (seeded for QA)

**Stripe Customer Identity:**
- Stripe integration creates customer records on checkout
- Customer ID persisted in localStorage via `nutriq_customer_id` key
- Used to link subscription status via Redis

## Payment Processing

**Stripe:**
- Service: Payment processing and subscription management
  - Auth: `STRIPE_SECRET_KEY` (server-side via `api/stripe/checkout.js`, `api/stripe/verify.js`, `api/stripe/webhook.js`)
  - Webhook: `STRIPE_WEBHOOK_SECRET` (HMAC-SHA256 signature verification in `api/stripe/webhook.js`)
  - Products:
    - Monthly: `STRIPE_PRICE_MONTHLY` env var (price_1TIGHZANF8XrNJ2lfkTZFfoA) — $4.99/mo
    - Annual: `STRIPE_PRICE_ANNUAL` env var (price_1TIGHZANF8XrNJ2lAjtI5PEO) — $39.99/yr
    - Product: prod_UGntPwCQw1fcWm
  - Webhook ID: we_1TIGHZANF8XrNJ2l8qdaMRJi
  - Webhook Events Processed (`api/stripe/webhook.js`):
    - `checkout.session.completed` - Grants Pro status via `grantPro(customerId)`
    - `customer.subscription.deleted` - Revokes Pro via `revokePro(customerId)`
    - `invoice.payment_failed` - Revokes Pro on failed payment
  - Checkout Flow (`api/stripe/checkout.js`):
    - Creates hosted Checkout Session with 7-day trial
    - Allows promotion codes
    - Redirects back to `{VITE_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`
  - Session Verification (`api/stripe/verify.js`):
    - Called after Stripe redirect with ?session_id=
    - Confirms `session.status === "complete"` and `session.payment_status === "paid"`
    - Writes Pro status to Redis for subsequent requests
  - Client-side Integration (`src/hooks/useQuota.js`):
    - Listens for ?session_id= in URL on mount
    - Calls `/api/stripe/verify?session_id=` to confirm payment
    - Stores Pro status in localStorage `nutriq_pro`
    - On app load, re-verifies via `/api/stripe/status?customer_id=` to catch cancellations/failures

## Monitoring & Observability

**Error Tracking:**
- None detected - no error reporting service configured

**Logs:**
- Vercel Edge Runtime default logging (`console.error` in `api/stripe/webhook.js` line 138)
- Webhook error logging only; individual requests not tracked

## CI/CD & Deployment

**Hosting:**
- Vercel (https://nutriq-wine.vercel.app)
  - Edge Runtime functions: `api/stripe/`, `api/claude.js`
  - Integrated services: Upstash Redis marketplace

**CI Pipeline:**
- None detected - Vercel automatic deployments from git pushes

## Environment Configuration

**Required env vars:**

**Production (Vercel Dashboard):**
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `STRIPE_SECRET_KEY` - Stripe secret for API calls
- `STRIPE_PRICE_MONTHLY` - Stripe price ID for monthly subscription
- `STRIPE_PRICE_ANNUAL` - Stripe price ID for annual subscription
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `UPSTASH_REDIS_REST_URL` - Redis REST URL (auto-injected by Vercel Upstash integration)
- `UPSTASH_REDIS_REST_TOKEN` - Redis REST token (auto-injected by Vercel Upstash integration)
- `VITE_APP_URL` - App base URL (defaults to https://nutriq-wine.vercel.app)

**Development (.env file):**
- `VITE_CLAUDE_API_KEY` - Claude API key for direct browser access in dev
- `STRIPE_SECRET_KEY` - For testing checkout (optional in dev)
- Other Stripe/Upstash vars optional in dev

**Secrets location:**
- `.env` file (local development) — not committed
- Vercel Dashboard → Settings → Environment Variables (production)
- Upstash integration auto-injects Redis credentials

## Webhooks & Callbacks

**Incoming:**
- `POST /api/stripe/webhook` - Stripe webhook for subscription lifecycle events
  - Processes: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
  - Signature verification: HMAC-SHA256 via `stripe-signature` header

**Outgoing:**
- Stripe Checkout success redirect: `{VITE_APP_URL}/?session_id={CHECKOUT_SESSION_ID}` (user-facing, configured in `api/stripe/checkout.js`)

---

*Integration audit: 2026-04-06*
