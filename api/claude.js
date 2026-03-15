/**
 * NUTRÏQ — Vercel serverless proxy for Claude API
 * Keeps ANTHROPIC_API_KEY server-side, never exposed to the browser.
 */

export const config = { runtime: "edge" }

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export default async function handler(req) {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: CORS_HEADERS,
    })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured on server" }), {
      status: 500, headers: CORS_HEADERS,
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400, headers: CORS_HEADERS,
    })
  }

  const { system, prompt, max_tokens = 1024 } = body

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt" }), {
      status: 400, headers: CORS_HEADERS,
    })
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens,
        system: system || "",
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const msg = data?.error?.message || `Claude API returned ${response.status}`
      return new Response(JSON.stringify({ error: msg }), {
        status: response.status, headers: CORS_HEADERS,
      })
    }

    if (!data?.content?.[0]?.text) {
      return new Response(JSON.stringify({ error: "Unexpected Claude response format" }), {
        status: 502, headers: CORS_HEADERS,
      })
    }

    return new Response(JSON.stringify({ text: data.content[0].text }), {
      status: 200, headers: CORS_HEADERS,
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: `Proxy error: ${err.message}` }), {
      status: 500, headers: CORS_HEADERS,
    })
  }
}
