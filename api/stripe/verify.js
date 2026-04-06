/**
 * NUTRÏQ — Stripe Session Verifier
 * Called after Stripe redirects back with ?session_id=
 * Confirms the session is complete and the subscription is active,
 * then writes Pro status to Upstash Redis as the canonical source of truth.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from "@upstash/redis"

export const config = { runtime: "edge" }

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS })
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing session_id" }), { status: 400, headers: CORS })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 500, headers: CORS })
  }

  try {
    // 1. Verify the Checkout Session with Stripe (source of truth for payment)
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const session = await res.json()
    if (session.error) throw new Error(session.error.message)

    const isPro = session.status === "complete" && session.payment_status === "paid"
    const customerId = session.customer || null

    // 2. If payment confirmed, write Pro status to Redis so webhook events and
    //    /api/stripe/status can enforce it server-side going forward.
    //    Redis is best-effort here — the Stripe session is the authoritative check.
    if (isPro && customerId) {
      const redis = getRedis()
      if (redis) {
        await redis.set(`pro:${customerId}`, "true")
      }
    }

    return new Response(JSON.stringify({ isPro, customerId }), {
      status: 200, headers: CORS,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS })
  }
}
