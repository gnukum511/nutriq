/**
 * NUTRÏQ — Stripe Webhook Handler
 * Verifies HMAC-SHA256 signature and processes subscription lifecycle events.
 * Writes Pro status to Upstash Redis (via Vercel Marketplace) on grant/revoke.
 *
 * KV key structure: pro:{customerId} → "true"
 *
 * Required env vars (set in Vercel dashboard, injected by Upstash integration):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *   STRIPE_WEBHOOK_SECRET
 */

import { Redis } from "@upstash/redis"

export const config = { runtime: "edge" }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error("Upstash Redis env vars not configured")
  return new Redis({ url, token })
}

async function verifySignature(rawBody, sigHeader, secret) {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [k, v] = part.split("=")
    if (k && v) { acc[k] = acc[k] ? [...acc[k], v] : [v] }
    return acc
  }, {})

  const timestamp = parts.t?.[0]
  const signatures = parts.v1 || []
  if (!timestamp || signatures.length === 0) return false

  // Reject events older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) return false

  const signedPayload = `${timestamp}.${rawBody}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  )
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload))
  const computed = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")

  return signatures.includes(computed)
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * Grant Pro status for a Stripe customer.
 * @param {string} customerId
 */
async function grantPro(customerId) {
  const redis = getRedis()
  await redis.set(`pro:${customerId}`, "true")
}

/**
 * Revoke Pro status for a Stripe customer.
 * @param {string} customerId
 */
async function revokePro(customerId) {
  const redis = getRedis()
  await redis.del(`pro:${customerId}`)
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return new Response(JSON.stringify({ error: "Webhook secret not configured" }), { status: 500 })
  }

  const sig = req.headers.get("stripe-signature")
  if (!sig) return new Response(JSON.stringify({ error: "Missing stripe-signature" }), { status: 400 })

  const rawBody = await req.text()
  const valid = await verifySignature(rawBody, sig, webhookSecret)
  if (!valid) return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 })

  let event
  try { event = JSON.parse(rawBody) } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Payment confirmed — grant Pro. customerId may be null for one-time payments
        // but is always present for subscription checkouts.
        const customerId = event.data.object.customer
        if (customerId) await grantPro(customerId)
        break
      }

      case "customer.subscription.deleted": {
        // Subscription cancelled or expired — revoke Pro immediately.
        const customerId = event.data.object.customer
        if (customerId) await revokePro(customerId)
        break
      }

      case "invoice.payment_failed": {
        // Payment failed — revoke Pro to enforce access control.
        // Stripe will retry the invoice; Pro is re-granted if payment recovers
        // via a future invoice.payment_succeeded or checkout.session.completed.
        const customerId = event.data.object.customer
        if (customerId) await revokePro(customerId)
        break
      }

      default:
        // Acknowledge all other events so Stripe stops retrying them.
        break
    }
  } catch (err) {
    // Log but still return 200 — returning non-2xx causes Stripe to retry,
    // which can create duplicate side-effects. Surface errors via Vercel logs.
    console.error(`[webhook] Failed to process ${event.type}:`, err.message)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
