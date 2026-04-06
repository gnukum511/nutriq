/**
 * NUTRÏQ — Pro Status Checker
 * Called on every app load to re-verify Pro status server-side.
 * Reads from Upstash Redis — the canonical store written by webhook.js and verify.js.
 *
 * GET /api/stripe/status?customer_id=cus_xxx
 *
 * Response:
 *   { isPro: true,  customerId: "cus_xxx" }
 *   { isPro: false, customerId: "cus_xxx" }
 *   { error: "...", status: 400|500 }
 *
 * Required env vars:
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

export default async function handler(req) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS })
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS })
  }

  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get("customer_id")
  if (!customerId) {
    return new Response(JSON.stringify({ error: "Missing customer_id" }), { status: 400, headers: CORS })
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    return new Response(
      JSON.stringify({ error: "Redis not configured" }),
      { status: 500, headers: CORS }
    )
  }

  try {
    const redis = new Redis({ url, token })
    const value = await redis.get(`pro:${customerId}`)
    const isPro = value === "true"
    return new Response(JSON.stringify({ isPro, customerId }), { status: 200, headers: CORS })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS })
  }
}
