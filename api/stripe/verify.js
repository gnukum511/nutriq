/**
 * NUTRÏQ — Stripe Session Verifier
 * Called after Stripe redirects back with ?session_id=
 * Confirms the session is complete and the subscription is active.
 */

export const config = { runtime: "edge" }

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const session = await res.json()
    if (session.error) throw new Error(session.error.message)

    const isPro = session.status === "complete" && session.payment_status === "paid"
    return new Response(JSON.stringify({ isPro, customerId: session.customer || null }), {
      status: 200, headers: CORS,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS })
  }
}
