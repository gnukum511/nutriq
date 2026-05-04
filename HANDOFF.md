# Handoff — 2026-05-04

## What We're Building
Nothing in flight. Last completed work (2026-05-01): unblocked the Stripe Pro flow end-to-end — provisioned Upstash Redis, fixed env var name mismatch (`KV_REST_API_*` not `UPSTASH_REDIS_REST_*`), repointed the Stripe webhook from a stale alias to the canonical production URL, and expanded webhook events from 1 to 3. Server-side Pro state grants and revocations are now functional.

## Current Status
- ✅ Stripe Checkout creates session, redirects, returns to `/?session_id=`
- ✅ `verify.js` confirms session and writes Pro to Redis (`pro:{customerId}` → `"true"`)
- ✅ `webhook.js` HMAC-verifies and grants/revokes Pro on 3 lifecycle events
- ✅ `status.js` polls Redis on every app load via `useQuota.js`, enforcing cancellations server-side
- ✅ Smoke tests pass on `nutriq-eosin.vercel.app`
- ⏸ No active feature work
- ⚠️ No real customer has come through the upgraded webhook config yet — verification is synthetic only

## Exact Next Step
There is no in-flight task. Pick one from the open backlog (in priority order):

1. **Verify a real subscription end-to-end** when one happens. Watch Stripe events log for the new webhook URL receiving `checkout.session.completed`, then confirm `pro:{customerId}=true` in the Upstash dashboard.
2. **Refresh `.planning/codebase/STACK.md`** — still describes the pre-redesign red/Yelp palette and Playfair/Plus Jakarta fonts. Should reflect oklch tokens + Fraunces/Inter.
3. **Add preview env vars** via Vercel Dashboard → Settings → Environment Variables. CLI plugin blocks all `vercel env add ... preview` paths.
4. **Remove `useAuth.js` test seed** (`apptest@nutriiq.com` / `password123!`) before any new auth work — it's been intentionally uncommitted but should not stay.

## Files In Flight
None. Working tree clean as of commit `8c5fd0f`.

## Decisions Made This Session (2026-05-01)
- Provisioned Upstash via `vercel integration add upstash/upstash-kv` (resource: `upstash-kv-coffee-school`)
- Read Marketplace canonical env var names directly (`KV_REST_API_URL` / `KV_REST_API_TOKEN`) rather than aliasing to Upstash-native names
- Repointed Stripe webhook `we_1TIGHZANF8XrNJ2l8qdaMRJi` to `nutriq-eosin.vercel.app/api/stripe/webhook` via Stripe API
- Documented `nutriq-wine.vercel.app` as a stale alias in CLAUDE.md / memory.md / gotcha.md

## Blockers / Open Questions
- None blocking. Real-traffic verification of webhook/Redis grants is the only remaining unknown.

## Commands to Resume
```bash
cd /Volumes/WORKSPACE/Projects/project_NUTRiiQ/nutriq

# Smoke test the live Stripe/Redis chain (no real customer needed)
curl -s "https://nutriq-eosin.vercel.app/api/stripe/status?customer_id=cus_test"
# expect: {"isPro":false,"customerId":"cus_test"}  HTTP 200

curl -s -X POST "https://nutriq-eosin.vercel.app/api/stripe/webhook" -d '{}'
# expect: {"error":"Missing stripe-signature"}  HTTP 400

# Local dev
npm run dev    # http://localhost:3001 (port may roll to 3002 if 3001 busy)

# Inspect Stripe webhook config
SECRET=$(grep '^STRIPE_SECRET_KEY=' .env | cut -d= -f2- | tr -d '"' | tr -d "'")
curl -s "https://api.stripe.com/v1/webhook_endpoints/we_1TIGHZANF8XrNJ2l8qdaMRJi" -u "${SECRET}:" | python3 -m json.tool

# Inspect Vercel env (should show KV_REST_API_URL/TOKEN among others)
vercel env ls production
```
