import { useState, useCallback } from "react"

const STORAGE_KEY = "nutriq_favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    } catch {
      return []
    }
  })

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  )

  const toggleFavorite = useCallback((restaurant) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === restaurant.id)
      const updated = exists
        ? prev.filter((f) => f.id !== restaurant.id)
        : [...prev, { id: restaurant.id, name: restaurant.name, emoji: restaurant.emoji, cuisineLabel: restaurant.cuisineLabel, distance: restaurant.distance }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
