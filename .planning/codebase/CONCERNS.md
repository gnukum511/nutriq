# Codebase Concerns

**Analysis Date:** 2026-04-06

## Tech Debt

**Weak Password Hashing in Client-Side Auth:**
- Issue: `useAuth.js` uses a non-cryptographic hash function (JavaScript bitwise operations) to hash passwords for localStorage authentication
- Files: `src/hooks/useAuth.js` (lines 18-27)
- Impact: Passwords are trivially reversible; any access to localStorage exposes plaintext-equivalent credentials. This is intentional for demo/local-only use, but dangerous if auth ever moves to real backend
- Fix approach: Migrate to backend authentication with bcrypt or Argon2. Client-side auth is only acceptable for local/offline-first scenarios; never production

**Test User Seed Hardcoded in Hook:**
- Issue: `useAuth.js` seeds test user `apptest@nutriiq.com` / `password123!` at module load time
- Files: `src/hooks/useAuth.js` (lines 30-44)
- Impact: Test credentials committed to repo; visible in git history and releases. Intentional for QA but not removed after testing
- Fix approach: Move test seed to environment variable and only apply when `VITE_ENABLE_TEST_SEED=true`. Remove from production builds or at minimum document as QA-only

**Untyped JavaScript codebase:**
- Issue: Entire codebase uses `.js` and `.jsx` files without JSDoc or TypeScript
- Files: All files in `src/` and `api/`
- Impact: No compile-time type checking; prop validation, API response schemas, and hook return types are runtime-only. Bugs like mismatched field names caught only at runtime
- Fix approach: Incremental TypeScript migration: start with `api/` routes (strict mode), then hooks, then components. Use `zod` for runtime validation on API boundaries

## Known Bugs & Limitations

**Menu JSON Truncation Fallback is Fragile:**
- Symptoms: Claude API returns truncated JSON at 2000-token limit; salvage fallback attempts to recover by finding last `}` and closing array
- Files: `src/lib/claude.js` (lines 127-131)
- Cause: 2000-token limit on menu generation cuts off responses mid-item
- Workaround: JSON salvage sometimes produces incomplete/invalid items if truncation occurs mid-object
- Better fix: Increase max_tokens or paginate menu generation (e.g., first 5 items, then next 5 on demand)

**Overpass API Single Endpoint Reliability:**
- Symptoms: Queries timeout or return 429 at peak hours
- Files: `src/lib/overpass.js` (lines 5-9)
- Current mitigation: 3-mirror fallback (kumi.systems → overpass-api.de → mail.ru)
- Remaining risk: If all 3 mirrors are down simultaneously, user gets "All Overpass servers unavailable" error with no fallback. Network-first strategy means app is unusable without a location

**Vercel CLI Environment Variable Add Blocked:**
- Symptoms: `vercel env add NAME preview` hangs or returns `git_branch_required` / `branch_not_found`
- Files: No code impact; workflow issue documented in `gotcha.md` and `HANDOFF.md`
- Current workaround: Add preview env vars manually via Vercel Dashboard → Settings → Environment Variables
- Impact: Preview deployments missing ANTHROPIC_API_KEY and Stripe secrets; Claude API calls and Stripe integration fail on preview

**Local pnpm Build Broken on Node v25:**
- Symptoms: `pnpm build` fails with rollup native binary compilation error
- Files: No code impact; workflow issue documented in `gotcha.md`
- Current workaround: Use `vercel deploy --prod` (builds on Vercel infrastructure) or `git push` (triggers CI build)
- Impact: Developers on Node v25 cannot build locally; blocks offline development and full-stack testing

## Security Considerations

**Client-Side API Key Exposure (Partially Mitigated):**
- Risk: Anthropic API key could be exposed in browser
- Files: `src/lib/claude.js` (dev mode uses VITE_CLAUDE_API_KEY), `api/claude.js` (production proxy)
- Current mitigation: Development uses direct key from .env (expected for dev only); production routes all requests through `/api/claude` edge function, keeping key server-side
- Recommendations: 
  - Enforce production build never uses direct Claude API; document VITE_CLAUDE_API_KEY as dev-only
  - Add build-time check to fail if key is ever included in bundle
  - Consider rate limiting on `/api/claude` proxy to prevent abuse

**Stripe Keys and Secrets in Environment:**
- Risk: Stripe keys passed as environment variables could leak in logs, terminal history, or accidental commits
- Files: `api/stripe/*.js` (all use process.env.STRIPE_*)
- Current mitigation: Rolling new live key after 2026-04-05 exposure; secrets stored in Vercel dashboard
- Recommendations:
  - Never pass secret keys as shell arguments (use env vars or secret manager only)
  - Audit git history for any commits containing stripe keys (history may contain exposure)
  - Implement secret scanning in pre-commit hooks

**Missing CORS Protections:**
- Risk: API routes allow `"Access-Control-Allow-Origin": "*"`
- Files: `api/claude.js` (line 10), `api/stripe/checkout.js` (line 10), `api/stripe/verify.js` (line 19), `api/stripe/status.js` (line 23)
- Impact: Any website can call these endpoints on behalf of users; potential for CSRF on Stripe operations
- Fix approach: Restrict CORS to production domain only (`https://nutriq-wine.vercel.app`); verify origin header in production

**Redis Connection Strings Exposed on Errors:**
- Risk: If Upstash Redis fails, error messages may include `UPSTASH_REDIS_REST_URL` (contains auth token in the URL)
- Files: `api/stripe/webhook.js` (line 25), `api/stripe/verify.js` (line 27), `api/stripe/status.js` (line 51)
- Current mitigation: Generic error messages returned to clients (`"Redis not configured"`)
- Recommendations: Ensure server-side error logs (Vercel) never expose connection strings; sanitize error messages before returning to client

## Performance Bottlenecks

**Unbounded Menu Generation Caching:**
- Problem: Window-level cache `window.__nutriqMenuCache` never clears; grows indefinitely as users explore more restaurants
- Files: `src/hooks/useMenu.js` (lines 17-20)
- Cause: Session-lifetime cache accumulates all generated menus in memory
- Improvement path: Implement LRU cache with max 50 restaurants; evict oldest on new generation

**Synchronous Haversine Calculation on Large Restaurant Lists:**
- Problem: `haversine()` called N times per sort operation for restaurant distance sorting
- Files: `src/lib/overpass.js` (lines 14-24, called on line 77), `src/pages/HomePage.jsx` (sort triggered on every filter change)
- Impact: Minimal for typical ~20-30 nearby restaurants, but noticeable on slow devices or dense urban areas
- Improvement path: Cache distances with restaurants; recalculate only on location change, not on filter change

**Session Storage Parsing on Every Route Change:**
- Problem: `HomePage.jsx`, `MenuPage.jsx`, `AnalysisPage.jsx` all parse sessionStorage values and catch exceptions silently
- Files: `src/pages/HomePage.jsx` (lines 26-42), `src/pages/MenuPage.jsx` (lines 75-82)
- Impact: Repeated JSON parsing adds overhead; silent catch blocks hide corruption
- Improvement path: Parse once at app startup into context/store; share via React Context or global state

**Missing Index Optimization on Restaurant Search:**
- Problem: Filter/search operations on restaurant list use `.filter()` + `.includes()` on every keystroke
- Files: `src/pages/HomePage.jsx` (lines 52-67)
- Impact: Linear search O(n*m) for n restaurants and m filter terms; acceptable for <100 restaurants
- Improvement path: Trie-based prefix indexing or Lunr.js for large cities

## Fragile Areas

**Menu Loading State Machine is Implicit:**
- Files: `src/pages/MenuPage.jsx` (lines 84-99), `src/hooks/useMenu.js` (lines 22-47)
- Why fragile: Loading, error, and success states are managed separately across hook and component; quota check determines whether to load or show upgrade modal; cache lookup happens before quota check
- Safe modification: Document the state flow in comments; add tests for edge cases (quota exceeded, cache hit, network failure, truncation)
- Test coverage: No unit tests; integration tests missing for quota enforcement, cache behavior, error recovery

**Stripe Webhook Event Handling:**
- Files: `api/stripe/webhook.js` (lines 105-134)
- Why fragile: HMAC signature validation is custom implementation (not using Stripe's official SDK); only 3 events handled (checkout.session.completed, customer.subscription.deleted, invoice.payment_failed); other events acknowledged silently
- Safe modification: Use Stripe's official Node SDK for signature verification; log all events for monitoring; add tests for signature validation and replay attack prevention
- Test coverage: No unit tests for HMAC verification or event handling

**Pseudo-Random Restaurant Ratings Vulnerable to Hash Collisions:**
- Files: `src/pages/MenuPage.jsx` (lines 19-33), same functions in `src/components/RestaurantCard.jsx`
- Why fragile: Simple bitwise hash of restaurant name can collide; same restaurant name in different cities gets same pseudo-rating
- Safe modification: Hash on (name + lat + lon) instead of name alone; add explicit seeding based on Stripe customer ID for future personalization
- Test coverage: No tests for rating determinism or collision handling

**Error Boundaries Missing on Data Pages:**
- Files: `src/pages/AnalysisPage.jsx`, `src/pages/TrackerPage.jsx` have no ErrorBoundary wrapping; App.jsx has one at root level
- Why fragile: Component crashes in analysis/tracker pages crash entire app instead of showing graceful error
- Safe modification: Wrap each page route with ErrorBoundary; add page-level error states (e.g., "Failed to load analysis")
- Test coverage: No tests for component crash recovery

## Scaling Limits

**Quota System is Client-Side Only:**
- Current capacity: Free tier enforced via localStorage quota tracking; quota reset daily
- Limit: Users can fake Pro status by setting localStorage `nutriq_pro = "true"`; quota counter can be reset by user
- Scaling path: Redis already integrated via `useQuota.js` verify calls to `/api/stripe/status`. Migrate quota tracking from localStorage to Redis for reliable server-side enforcement

**Overpass API Response Size Unbounded:**
- Current capacity: No limit on number of restaurants returned; typical ~20-50 in urban areas
- Limit: Rural areas return 0-5; dense cities (SF, NYC) may return 200+; client must sort/filter all in memory
- Scaling path: Add `limit` parameter to Overpass query; paginate results; implement virtual scrolling on restaurant list

**Database Dependency on Upstash Redis Not Yet Provisioned:**
- Current capacity: Stripe webhook and status checks fail silently when Redis is unavailable
- Limit: No fallback if Redis goes down; Pro status cannot be verified
- Scaling path: Implement fallback to Stripe API direct lookups if Redis unavailable; add circuit breaker pattern

## Dependencies at Risk

**react-leaflet v4 Peer Dependency Warning:**
- Risk: v4 is past EOL; React 18 support is accidental, not guaranteed
- Files: `package.json` specifies `react-leaflet": "4.2.1"`
- Current mitigation: Intentional lock to v4 per `gotcha.md` (v5 requires React 19); decision is documented
- Migration plan: When ready to upgrade React 18 → React 19, update to react-leaflet v5 simultaneously

**Framer Motion Animation System Fragile:**
- Risk: All animations use Framer Motion; loss of this library is catastrophic
- Files: `src/components/animations.jsx` exports all animation primitives; every page/component imports from it
- Current mitigation: No CSS transitions (enforced in CLAUDE.md); all animation logic centralized
- Fallback: Framer Motion is widely maintained; low risk. But if migrations needed, fallback would require rewriting all animations

**Missing Production Logging and Monitoring:**
- Risk: No Sentry, Datadog, or equivalent error tracking in production
- Files: Only Vercel's built-in logs (not accessible from app)
- Impact: Users encounter bugs silently; no visibility into failure rates or performance issues
- Scaling path: Add Sentry SDK for error tracking; PostHog or Mixpanel for analytics

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: All utilities (`lib/overpass.js`, `lib/health.js`, `lib/cuisine.js`), all hooks (`useAuth.js`, `useQuota.js`, `useMenu.js`, `useFilters.js`)
- Files: Entire `src/` directory
- Risk: Utility bugs (distance calculation, health scoring, filter logic) caught only at runtime or by manual testing
- Priority: HIGH — utilities are critical path; should have 90%+ coverage

**No Integration Tests:**
- What's not tested: API routes (`/api/claude`, `/api/stripe/*`), Stripe webhook flow, Redis interactions
- Files: Entire `api/` directory, all hooks that make fetch calls
- Risk: API contract changes, missing env vars, Redis failures only discovered in production
- Priority: HIGH — API is critical for core features; webhook failures directly impact monetization

**No E2E Tests:**
- What's not tested: User flows (sign up → locate → search → generate menu → analyze → upgrade → checkout)
- Risk: Regressions in navigation, modal flows, quota enforcement invisible until deployment
- Priority: MEDIUM — critical user journeys should be tested, but Puppeteer QA scripts (`screenshot.js`, `interaction-test.js`) provide some coverage

**No Component Tests:**
- What's not tested: Component isolation, prop validation, event handlers, animation triggers
- Files: All components in `src/components/`
- Risk: Prop type errors, missing callbacks, animation state bugs caught only at integration level
- Priority: MEDIUM — component tests would catch prop-related issues early, but app-level integration testing provides broader coverage

## Missing Critical Features

**No Rate Limiting on AI API Calls:**
- Problem: Users can call `/api/claude` unbounded if they spoof Pro status or exhaust quota detection logic
- Blocks: True API security; potential for bill shock if service is abused
- Fix: Implement rate limiting per IP or user ID on `/api/claude` edge function (Vercel allows up to 3000 req/min by default)

**No Offline Support:**
- Problem: Service worker exists (`public/sw.js`) but caching strategy is undefined; app is network-required
- Blocks: Usage in poor connectivity scenarios; offline exploration of saved restaurants
- Fix: Implement proper service worker with cache-first for static assets, network-first with cache fallback for restaurants

**No Analytics or Usage Tracking:**
- Problem: No visibility into user behavior, feature adoption, or churn
- Blocks: Data-driven product decisions; can't optimize funnel or identify feature issues
- Fix: Integrate Mixpanel, PostHog, or Google Analytics with privacy-compliant tracking

**No Admin Dashboard:**
- Problem: No way to monitor Stripe subscriptions, Redis data, or error rates without Vercel/Stripe dashboards
- Blocks: Quick diagnostics, batch operations (e.g., grant Pro to test users), metrics dashboards
- Fix: Build simple admin page with Stripe customer list, Redis key inspection, error log tail

---

*Concerns audit: 2026-04-06*
