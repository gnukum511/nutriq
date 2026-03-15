import { useState, useMemo, useCallback } from "react"
import { matchesFilter } from "../lib/health"

/**
 * useFilters — Filter state + item matching logic
 *
 * Filters: highProtein, lowCalorie, lowCarb, balanced
 * Only one filter active at a time (toggle behavior)
 */

export const FILTERS = [
  { key: "highProtein", label: "High Protein", emoji: "💪" },
  { key: "lowCalorie", label: "Low Calorie", emoji: "🔥" },
  { key: "lowCarb", label: "Low Carb", emoji: "🥬" },
  { key: "balanced", label: "Balanced", emoji: "⚖️" },
  { key: "keto", label: "Keto", emoji: "🥑" },
  { key: "glutenFree", label: "Gluten-Free", emoji: "🌾" },
  { key: "paleo", label: "Paleo", emoji: "🍖" },
  { key: "vegan", label: "Vegan", emoji: "🌱" },
  { key: "allergyFriendly", label: "Allergy-Safe", emoji: "🛡️" },
]

export function useFilters(items) {
  const [activeFilter, setActiveFilter] = useState(null)

  const toggleFilter = useCallback((filterKey) => {
    setActiveFilter((prev) => (prev === filterKey ? null : filterKey))
  }, [])

  const clearFilter = useCallback(() => {
    setActiveFilter(null)
  }, [])

  const filteredItems = useMemo(() => {
    if (!activeFilter) return items
    return items.filter((item) => matchesFilter(item, activeFilter))
  }, [items, activeFilter])

  const counts = useMemo(() => {
    const result = {}
    for (const f of FILTERS) {
      result[f.key] = items.filter((item) => matchesFilter(item, f.key)).length
    }
    return result
  }, [items])

  return { activeFilter, toggleFilter, clearFilter, filteredItems, counts }
}
