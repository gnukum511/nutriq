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
- **Status:** Open
- **Added:** 2026-04-05

---

### Stripe live secret key accidentally exposed in terminal
- **What happened:** Key passed as shell env var — visible in history and conversation
- **Fix:** Rolled key in Stripe Dashboard. Updated .env and Vercel production.
- **Status:** Resolved (2026-04-05)
- **Added:** 2026-04-05
