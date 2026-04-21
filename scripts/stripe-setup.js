#!/usr/bin/env node
/**
 * NUTRÏQ — Stripe setup script
 * Creates the Pro product, monthly/annual prices, and webhook endpoint.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.js
 *
 * Safe to re-run — checks for existing resources before creating.
 */

const KEY = process.env.STRIPE_SECRET_KEY
if (!KEY) {
  console.error("❌  Set STRIPE_SECRET_KEY before running this script.")
  process.exit(1)
}

const APP_URL = process.env.APP_URL || "https://nutriq-wine.vercel.app"

async function stripe(method, path, body) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body ? new URLSearchParams(body).toString() : undefined,
  })
  const data = await res.json()
  if (data.error) throw new Error(`Stripe ${path}: ${data.error.message}`)
  return data
}

async function listAll(path, params = {}) {
  const qs = new URLSearchParams({ limit: 100, ...params }).toString()
  const data = await stripe("GET", `${path}?${qs}`)
  return data.data || []
}

async function run() {
  console.log("🔧  NUTRÏQ Stripe Setup\n")

  // ── 1. Product ──────────────────────────────────────────────────────────────
  let product
  const products = await listAll("/products", { active: "true" })
  product = products.find((p) => p.name === "NUTRÏQ Pro")

  if (product) {
    console.log(`✅  Product already exists: ${product.id}`)
  } else {
    product = await stripe("POST", "/products", {
      name: "NUTRÏQ Pro",
      description: "Unlimited AI menus, meal analysis, and all diet presets.",
    })
    console.log(`✅  Created product: ${product.id}`)
  }

  // ── 2. Prices ────────────────────────────────────────────────────────────────
  const prices = await listAll("/prices", { product: product.id, active: "true" })

  let monthlyPrice = prices.find(
    (p) => p.recurring?.interval === "month" && p.unit_amount === 499
  )
  if (monthlyPrice) {
    console.log(`✅  Monthly price already exists: ${monthlyPrice.id}`)
  } else {
    monthlyPrice = await stripe("POST", "/prices", {
      product: product.id,
      unit_amount: 499,
      currency: "usd",
      "recurring[interval]": "month",
      "recurring[trial_period_days]": 7,
      nickname: "Pro Monthly",
    })
    console.log(`✅  Created monthly price: ${monthlyPrice.id}`)
  }

  let annualPrice = prices.find(
    (p) => p.recurring?.interval === "year" && p.unit_amount === 3999
  )
  if (annualPrice) {
    console.log(`✅  Annual price already exists: ${annualPrice.id}`)
  } else {
    annualPrice = await stripe("POST", "/prices", {
      product: product.id,
      unit_amount: 3999,
      currency: "usd",
      "recurring[interval]": "year",
      "recurring[trial_period_days]": 7,
      nickname: "Pro Annual",
    })
    console.log(`✅  Created annual price: ${annualPrice.id}`)
  }

  // ── 3. Webhook ───────────────────────────────────────────────────────────────
  const webhookUrl = `${APP_URL}/api/stripe/webhook`
  const hooks = await listAll("/webhook_endpoints")
  let webhook = hooks.find((h) => h.url === webhookUrl)

  if (webhook) {
    console.log(`✅  Webhook already exists: ${webhook.id}`)
  } else {
    webhook = await stripe("POST", "/webhook_endpoints", {
      url: webhookUrl,
      "enabled_events[]": "checkout.session.completed",
      "enabled_events[]": "customer.subscription.deleted",
      "enabled_events[]": "invoice.payment_failed",
    })
    console.log(`✅  Created webhook: ${webhook.id}`)
  }

  // ── 4. Output ────────────────────────────────────────────────────────────────
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add these to your .env and Vercel dashboard:

STRIPE_SECRET_KEY=${KEY}
STRIPE_WEBHOOK_SECRET=${webhook.secret || "(retrieve from Stripe dashboard — only shown once at creation)"}
STRIPE_PRICE_MONTHLY=${monthlyPrice.id}
STRIPE_PRICE_ANNUAL=${annualPrice.id}
VITE_STRIPE_PRICE_MONTHLY=${monthlyPrice.id}
VITE_STRIPE_PRICE_ANNUAL=${annualPrice.id}
VITE_APP_URL=${APP_URL}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

run().catch((err) => {
  console.error("❌ ", err.message)
  process.exit(1)
})
