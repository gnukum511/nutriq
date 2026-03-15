/**
 * NUTRÏQ — Health score algorithm + nutrition helpers
 */

/**
 * Calculate a health score (0-100) for a menu item
 * Higher protein, lower calories, moderate carbs/fat = higher score
 *
 * Scoring breakdown:
 * - Protein density (protein per calorie): 0-35 points
 * - Calorie moderation: 0-30 points
 * - Fat moderation: 0-20 points
 * - Carb moderation: 0-15 points
 */
export function healthScore({ cal, protein, carbs, fat }) {
  if (!cal || cal === 0) return 50

  // Protein density: grams of protein per 100 cal (higher = better)
  const proteinPer100 = (protein / cal) * 100
  const proteinScore = Math.min(35, proteinPer100 * 3.5)

  // Calorie moderation: under 500 is great, over 900 is poor
  const calScore =
    cal <= 350 ? 30 :
    cal <= 500 ? 25 :
    cal <= 650 ? 18 :
    cal <= 800 ? 10 :
    cal <= 1000 ? 5 : 0

  // Fat moderation: percentage of calories from fat
  const fatPct = ((fat * 9) / cal) * 100
  const fatScore =
    fatPct <= 25 ? 20 :
    fatPct <= 35 ? 15 :
    fatPct <= 45 ? 10 :
    fatPct <= 55 ? 5 : 0

  // Carb moderation: percentage of calories from carbs
  const carbPct = ((carbs * 4) / cal) * 100
  const carbScore =
    carbPct <= 35 ? 15 :
    carbPct <= 50 ? 10 :
    carbPct <= 65 ? 5 : 0

  return Math.round(Math.min(100, proteinScore + calScore + fatScore + carbScore))
}

/**
 * Get the color for a health score
 * green ≥75, gold ≥50, red <50
 */
export function scoreColor(score) {
  if (score >= 75) return "var(--green)"
  if (score >= 50) return "var(--gold)"
  return "var(--red)"
}

/**
 * Get a label for a health score
 */
export function scoreLabel(score) {
  if (score >= 85) return "Excellent"
  if (score >= 75) return "Great"
  if (score >= 60) return "Good"
  if (score >= 50) return "Moderate"
  if (score >= 35) return "Heavy"
  return "Indulgent"
}

/**
 * Format calorie value
 */
export function formatCal(cal) {
  return cal >= 1000 ? `${(cal / 1000).toFixed(1)}k` : String(cal)
}

/**
 * Format distance (km) as miles
 */
export function formatDistance(km) {
  const miles = km * 0.621371
  if (miles < 0.1) return `${Math.round(miles * 5280)} ft`
  return `${miles.toFixed(1)} mi`
}

/**
 * Check if an item matches a filter
 */
export function matchesFilter(item, filter) {
  switch (filter) {
    case "highProtein":
      return item.protein >= 30
    case "lowCalorie":
      return item.cal <= 400
    case "lowCarb":
      return item.carbs <= 20
    case "balanced": {
      const score = healthScore(item)
      return score >= 60
    }
    default:
      return true
  }
}
