# Handoff — 2026-04-05

## What We're Building
Upstash Redis for server-side Pro status enforcement. All code is written and deployed (commit 20f00dd). The only remaining step is provisioning the Upstash database so the env vars exist — everything else is done.

## Current Status
- Stripe Checkout live and working in production
- Upstash Redis code deployed — `webhook.js`, `verify.js`, `status.js`, `useQuota.js` all updated
- **BLOCKED:** `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` not yet injected — Redis calls will fail silently until provisioned
- Preview env vars missing (ANTHROPIC_API_KEY + Stripe secrets) — must add via Vercel Dashboard

## Exact Next Step
```bash
! cd /Volumes/WORKSPACE/Projects/project_NUTRiiQ/nutriq && vercel integration add upstash/upstash-kv
```
Switch to browser immediately when it opens — accept Upstash terms. Vercel auto-injects the two env vars. Then run `vercel deploy --prod` to activate.

## Files In Flight
| File | State | Notes |
|------|-------|-------|
| `api/stripe/checkout.js` | ✅ done | Creates Checkout Session |
| `api/stripe/verify.js` | ✅ done | Verifies session + writes to Redis |
| `api/stripe/webhook.js` | ✅ done | Grants/revokes Pro in Redis |
| `api/stripe/status.js` | ✅ done | GET by customerId → Redis lookup |
| `src/hooks/useQuota.js` | ✅ done | Persists customerId, re-verifies on load |

## Decisions Made This Session
- Upstash KV (`upstash/upstash-kv`) chosen — `@vercel/kv` was sunset Dec 2024
- KV key structure: `pro:{stripeCustomerId}` → `"true"`
- Webhook errors return 200 to prevent Stripe retry storms
- Claude model updated to `claude-sonnet-4-6` in `api/claude.js`

## Blockers / Open Questions
- Upstash not provisioned — one browser click away
- Preview env vars — add via Vercel Dashboard (CLI plugin blocks all CLI methods)

## Commands to Resume
```bash
cd /Volumes/WORKSPACE/Projects/project_NUTRiiQ/nutriq
! vercel integration add upstash/upstash-kv   # provision Redis
vercel env ls                                  # confirm UPSTASH_ vars appeared
vercel deploy --prod                           # redeploy with Redis active
```
