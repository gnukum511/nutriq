# NUTRÏQ — Gotcha Log

Read this before starting any task. Confirmed failures and workarounds.

---

### react-leaflet v5 breaks with React 18
- **What happened:** Attempted to upgrade react-leaflet to v5
- **Reality:** v5 requires React 19 — peer dep mismatch
- **Fix:** Stay on react-leaflet v4
- **Status:** Resolved
- **Added:** 2026-03-27

---

### CSS transitions cause animation inconsistency
- **What happened:** Early components used CSS `transition:` for hover effects
- **Reality:** Conflicts with Framer Motion — janky animations
- **Fix:** All animations must use Framer Motion. Zero CSS `transition:` properties.
- **Status:** Resolved
- **Added:** 2026-03-27

---

### Overpass API single-endpoint timeout at peak hours
- **What happened:** Direct queries to overpass-api.de would timeout or 429
- **Fix:** 3-mirror fallback in `src/lib/overpass.js`
- **Status:** Resolved/Workaround
- **Added:** 2026-03-27

---

### Claude menu response truncation
- **What happened:** Long menus cut off mid-JSON at 2000 tokens
- **Fix:** JSON salvage fallback in `src/lib/claude.js`
- **Status:** Resolved/Workaround
- **Added:** 2026-03-27

---

### Client-side API key exposure in production
- **What happened:** Early dev had VITE_CLAUDE_API_KEY used directly in prod
- **Fix:** All production calls go through `/api/claude` proxy. VITE_CLAUDE_API_KEY is local only.
- **Status:** Resolved
- **Added:** 2026-03-27

---

### vercel env add with multiple environments fails
- **What happened:** `vercel env add NAME production preview development` returns `branch_not_found`
- **Fix:** Add each environment separately
- **Status:** Resolved/Workaround
- **Added:** 2026-04-03

---

### Vercel CLI plugin blocks ALL preview env var adds
- **What happened:** Every method of `vercel env add NAME preview` returns `git_branch_required`
- **Reality:** The vercel@claude-plugins-official plugin intercepts and blocks regardless of flags
- **Fix:** Add preview env vars via Vercel Dashboard → Settings → Environment Variables manually
- **Status:** Open/Workaround
- **Added:** 2026-04-05

---

### Local pnpm build fails on Node v25
- **What happened:** `pnpm build` fails — rollup native binaries not compiled
- **Fix:** Use `git push` or `vercel deploy --prod` — Vercel builds on its own infra
- **Status:** Open/Workaround
- **Added:** 2026-04-03

---

### vercel integration add upstash-redis not found (wrong slug)
- **What happened:** `vercel integration add upstash-redis` → 404
- **Fix:** Use `vercel integration add upstash/upstash-kv`
- **Status:** Resolved
- **Added:** 2026-04-05

---

### vercel integration add upstash/upstash-kv requires browser terms acceptance
- **What happened:** CLI hangs waiting for browser; times out if not accepted quickly
- **Fix:** Run `! vercel integration add upstash/upstash-kv` in terminal, immediately switch to browser and accept terms
- **Status:** Resolved 2026-05-01 — succeeded on retry; resource `upstash-kv-coffee-school` provisioned
- **Added:** 2026-04-05

---

### Upstash Marketplace injects KV_REST_API_* env vars, NOT UPSTASH_REDIS_REST_*
- **What happened:** Server code (`webhook.js`, `verify.js`, `status.js`) read `process.env.UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (the Upstash-native names from their docs). Code shipped 2026-04, but `/api/stripe/status` returned 500 "Redis not configured" for ~26 days even after Upstash was eventually provisioned.
- **Reality:** Vercel Marketplace integrations for Upstash use legacy Vercel KV-compatible naming. After `vercel integration add upstash/upstash-kv`, the injected vars are `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `REDIS_URL`. There is no `UPSTASH_REDIS_REST_*` injection. `@upstash/redis` SDK accepts any URL+token pair via `new Redis({ url, token })`, so the SDK was fine — only the env var lookup was wrong.
- **Fix:** Read `process.env.KV_REST_API_URL` / `KV_REST_API_TOKEN`. Don't alias — use the canonical Marketplace names. Commit 8c5fd0f.
- **Status:** Resolved
- **Added:** 2026-05-01

---

### nutriq-wine.vercel.app is a stale alias — canonical URL is nutriq-eosin.vercel.app
- **What happened:** CLAUDE.md and memory.md both documented `nutriq-wine.vercel.app` as the live URL since project inception. After deploying the Stripe/Redis fix, smoke tests against `nutriq-wine.vercel.app/api/stripe/status` kept returning 500 from old code even after `vercel ls` showed the new deployment as Ready and current production.
- **Reality:** `vercel project ls` shows the project's "Latest Production URL" is `nutriq-eosin.vercel.app`, not `nutriq-wine.vercel.app`. The wine URL is a leftover alias from an earlier deployment that Vercel never auto-promoted. New deploys go to `nutriq-eosin.vercel.app`. The wine URL is permanently pinned to a pre-fix deployment and is effectively a dead URL for production traffic.
- **Fix:** Always use `nutriq-eosin.vercel.app`. Stripe webhook had to be repointed via API. CLAUDE.md updated 2026-05-04.
- **Status:** Resolved (alias documented as stale; webhook repointed)
- **Added:** 2026-05-01

---

### Stripe webhook had only 1 of 3 needed events enabled
- **What happened:** Webhook handler in `webhook.js` has switch cases for `checkout.session.completed` (grant Pro), `customer.subscription.deleted` (revoke), and `invoice.payment_failed` (revoke). For ~26 days only `invoice.payment_failed` was enabled in Stripe dashboard.
- **Reality:** Cancellations were silently ignored — users who cancelled kept Pro forever. Grants happened to work via `verify.js` (which reads the success URL session_id directly) so happy-path payment was visible to users, but with no webhook record, async failures and cancellations couldn't revoke.
- **Fix:** Updated webhook `we_1TIGHZANF8XrNJ2l8qdaMRJi` via Stripe API to enable all three events. Lesson: when adding switch cases to a webhook handler, also update the dashboard's enabled events — they're not auto-derived from code.
- **Status:** Resolved
- **Added:** 2026-05-01

---

### Vercel build "Ready" doesn't always mean the canonical URL serves the new code
- **What happened:** After `git push`, `vercel ls` showed the new deployment as ● Ready in 18s. Hitting `nutriq-wine.vercel.app` still returned old code. Vercel CLI says the new deploy IS the current production (`vercel promote` errors with "already current production"), yet the wine URL is stale.
- **Reality:** Vercel auto-generates `nutriq-{adjective}.vercel.app` aliases per deployment, but the canonical project alias (`nutriq-eosin.vercel.app` here) is what auto-rolls. Custom-looking aliases like `nutriq-wine` may stay pinned to whatever deployment first claimed them.
- **Fix:** Always smoke-test against the canonical URL from `vercel project ls` ("Latest Production URL" column), not whatever URL is in old docs.
- **Status:** Resolved (workaround documented)
- **Added:** 2026-05-01

---

### Stripe live secret key accidentally exposed in terminal
- **What happened:** Key passed as shell env var — visible in history and conversation
- **Fix:** Rolled key in Stripe Dashboard. Updated .env and Vercel production.
- **Status:** Resolved (2026-04-05)
- **Added:** 2026-04-05
