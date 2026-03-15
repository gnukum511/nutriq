import { useState, useCallback } from "react"
import { generateMenu } from "../lib/claude"
import { healthScore } from "../lib/health"

/**
 * useMenu — Lazy AI menu generation via Claude API
 *
 * Menus are generated on demand when a user taps a restaurant.
 * Caches results in session to avoid re-generating.
 */
export function useMenu() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Simple session cache
  const cache = useCallback(() => {
    if (!window.__nutriqMenuCache) window.__nutriqMenuCache = {}
    return window.__nutriqMenuCache
  }, [])

  const loadMenu = useCallback(async (restaurant) => {
    const cached = cache()[restaurant.id]
    if (cached) {
      setMenu(cached)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setMenu([])

    try {
      const items = await generateMenu(restaurant.name, restaurant.cuisineLabel || restaurant.cuisine)
      const enriched = items.map((item) => ({
        ...item,
        score: healthScore(item),
      }))
      cache()[restaurant.id] = enriched
      setMenu(enriched)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [cache])

  const clearMenu = useCallback(() => {
    setMenu([])
    setError(null)
  }, [])

  return { menu, loading, error, loadMenu, clearMenu }
}
