/**
 * NUTRÏQ — Vercel serverless proxy for Claude API
 * Keeps ANTHROPIC_API_KEY server-side, never exposed to the browser.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key not configured" })
  }

  try {
    const { system, prompt, max_tokens = 1024 } = req.body

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" })
    }

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

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: err.error?.message || `Claude API error: ${response.status}`,
      })
    }

    const data = await response.json()
    return res.status(200).json({ text: data.content[0].text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
