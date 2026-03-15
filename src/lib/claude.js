/**
 * NUTRÏQ — Claude API integration
 * Menu generation + meal analysis via claude-sonnet-4-20250514
 *
 * In production: requests go through /api/claude serverless proxy (key stays server-side)
 * In dev: uses VITE_CLAUDE_API_KEY from .env with direct browser access
 */

const isDev = import.meta.env.DEV

/**
 * Call Claude API — routes through proxy in production, direct in dev
 */
async function callClaude(systemPrompt, userPrompt, maxTokens = 1024) {
  if (isDev) {
    return callClaudeDirect(systemPrompt, userPrompt, maxTokens)
  }
  return callClaudeProxy(systemPrompt, userPrompt, maxTokens)
}

/**
 * Production: call via Vercel serverless proxy
 */
async function callClaudeProxy(systemPrompt, userPrompt, maxTokens) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system: systemPrompt,
      prompt: userPrompt,
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `API error: ${res.status}`)
  }

  const data = await res.json()
  return data.text
}

/**
 * Dev: call Claude API directly with browser key
 */
async function callClaudeDirect(systemPrompt, userPrompt, maxTokens) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
  if (!apiKey) {
    throw new Error("VITE_CLAUDE_API_KEY not set in .env")
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Claude API error: ${res.status}`)
  }

  const data = await res.json()
  return data.content[0].text
}

/**
 * Strip markdown code fences from Claude JSON responses
 */
function stripFences(text) {
  // Remove opening fence (```json or ```)
  let cleaned = text.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n/, "")
    cleaned = cleaned.replace(/\n?\s*```\s*$/, "")
  }
  return cleaned.trim()
}

/**
 * Generate a realistic menu for a restaurant based on its cuisine type
 * @returns {Promise<Array>} Menu items with nutrition data
 */
export async function generateMenu(restaurantName, cuisineType) {
  const systemPrompt = `You are a nutrition-aware menu generator. Generate realistic menu items for restaurants with accurate estimated nutrition data. Always respond with valid JSON only, no explanation.`

  const userPrompt = `Generate a realistic menu for "${restaurantName}" (${cuisineType} cuisine).

Return a JSON array of 8-10 items. Each item:
{
  "id": "unique_id",
  "name": "Dish Name",
  "desc": "Brief description, 8-12 words",
  "price": 12.99,
  "cal": 450,
  "protein": 32,
  "carbs": 28,
  "fat": 18,
  "cat": "Category",
  "tags": ["vegan", "gluten-free"]
}

Tags should be an array of applicable dietary labels from this list ONLY:
"keto", "gluten-free", "paleo", "vegan", "vegetarian", "dairy-free", "nut-free", "shellfish-free"
Only include tags that genuinely apply to the dish. An empty array is fine.

Categories should be relevant to the cuisine (e.g., Mains, Starters, Salads, Sides, Desserts, Brunch).
Nutrition values should be realistic estimates.
Prices in USD, realistic for the cuisine type.`

  const raw = await callClaude(systemPrompt, userPrompt, 2000)
  const cleaned = stripFences(raw)
  try {
    return JSON.parse(cleaned)
  } catch {
    // If JSON is truncated, try to salvage by closing the array
    const lastComplete = cleaned.lastIndexOf("}")
    if (lastComplete > 0) {
      const salvaged = cleaned.slice(0, lastComplete + 1) + "]"
      return JSON.parse(salvaged)
    }
    throw new Error("Failed to parse menu data")
  }
}

/**
 * Analyze a meal selection for nutritional coaching
 * @param {Array} selectedItems - Array of menu items the user selected
 * @returns {Promise<string>} Markdown-formatted analysis
 */
export async function analyzeMeal(selectedItems) {
  const systemPrompt = `You are NUTRÏQ, a friendly AI nutrition coach. Analyze meals and give actionable, encouraging advice. Use markdown formatting. Keep responses concise (150-200 words).`

  const totalCal = selectedItems.reduce((s, i) => s + i.cal, 0)
  const totalProtein = selectedItems.reduce((s, i) => s + i.protein, 0)
  const totalCarbs = selectedItems.reduce((s, i) => s + i.carbs, 0)
  const totalFat = selectedItems.reduce((s, i) => s + i.fat, 0)

  const itemList = selectedItems.map((i) => `- ${i.name}: ${i.cal} cal, ${i.protein}g protein, ${i.carbs}g carbs, ${i.fat}g fat`).join("\n")

  const userPrompt = `Analyze this meal selection:

${itemList}

**Totals:** ${totalCal} cal | ${totalProtein}g protein | ${totalCarbs}g carbs | ${totalFat}g fat

Provide:
1. A quick health verdict (one line)
2. What's good about this meal
3. What could be improved
4. A swap suggestion if applicable
5. A motivating closing line`

  return await callClaude(systemPrompt, userPrompt, 600)
}
