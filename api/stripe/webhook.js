/**
 * NUTRÏQ — Stripe Webhook Handler
 * Verifies signature and processes subscription lifecycle events.
 * Note: Pro status revocation (subscription.deleted, payment_failed) requires
 * Vercel KV for server-side storage. Until provisioned, these events are received
 * but cannot be enforced — Pro flag lives in client localStorage.
 */

export const config = { runtime: "edge" }

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

  // checkout.session.completed — Pro status is confirmed client-side via /api/stripe/verify
  // customer.subscription.deleted / invoice.payment_failed — future: revoke in Vercel KV
  // All events acknowledged so Stripe stops retrying.

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
