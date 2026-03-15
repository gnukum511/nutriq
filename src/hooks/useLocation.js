import { useState, useEffect } from "react"
import { fetchNearbyRestaurants } from "../lib/overpass"
import { getCuisineInfo } from "../lib/cuisine"

/**
 * useLocation — Geolocation + Overpass API restaurant fetch
 *
 * States:
 *   locating → located (with restaurants) | denied | error
 */
export function useLocation() {
  const [status, setStatus] = useState("locating") // locating | located | denied | error
  const [coords, setCoords] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error")
      setError("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoords({ lat: latitude, lon: longitude })

        try {
          const raw = await fetchNearbyRestaurants(latitude, longitude)
          const enriched = raw.map((r) => {
            const info = getCuisineInfo(r.cuisine)
            return { ...r, emoji: info.emoji, cuisineLabel: info.label }
          })
          setRestaurants(enriched)
          setStatus("located")
        } catch (err) {
          setError(err.message)
          setStatus("error")
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied")
          setError("Location access denied. Please enable location permissions.")
        } else {
          setStatus("error")
          setError(err.message)
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return { status, coords, restaurants, error }
}
