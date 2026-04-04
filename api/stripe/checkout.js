/**
 * NUTRÏQ — Stripe Checkout Session creator
 * Creates a hosted checkout session and returns the redirect URL.
 * Client redirects to url; after payment Stripe sends user back with ?session_id=
 */

export const config = { runtime: "edge" }

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS })
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceMonthly = process.env.STRIPE_PRICE_MONTHLY
  const priceAnnual = process.env.STRIPE_PRICE_ANNUAL
  const appUrl = process.env.VITE_APP_URL || "https://nutriq-wine.vercel.app"

  if (!secretKey || !priceMonthly || !priceAnnual) {
    return new Response(JSON.stringify({ error: "Stripe not fully configured" }), { status: 500, headers: CORS })
  }

  let body
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: CORS })
  }

  const { plan, email } = body
  const priceId = plan === "annual" ? priceAnnual : priceMonthly

  const params = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "success_url": `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
    "cancel_url": `${appUrl}/`,
    "allow_promotion_codes": "true",
    "subscription_data[trial_period_days]": "7",
  })
  if (email) params.set("customer_email", email)

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return new Response(JSON.stringify({ url: data.url }), { status: 200, headers: CORS })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS })
  }
}
