import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { StaggerList, fadeUpItem, spring, WordReveal, ScrollReveal } from "../components/animations"
import RestaurantCard from "../components/RestaurantCard"
import SkeletonLoader from "../components/SkeletonLoader"
import { formatDistance } from "../lib/health"

export default function HomePage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading")
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedStatus = sessionStorage.getItem("nutriq_location_status")

    // If no location data yet, redirect to locating
    if (!storedStatus) {
      navigate("/locating", { replace: true })
      return
    }

    setStatus(storedStatus)

    if (storedStatus === "located") {
      try {
        const stored = sessionStorage.getItem("nutriq_restaurants")
        if (stored) setRestaurants(JSON.parse(stored))
      } catch {}
    }

    if (storedStatus === "denied" || storedStatus === "error") {
      setError(sessionStorage.getItem("nutriq_location_error") || "Location unavailable")
    }
  }, [navigate])

  const handleRescan = useCallback(() => {
    sessionStorage.removeItem("nutriq_location_status")
    sessionStorage.removeItem("nutriq_restaurants")
    sessionStorage.removeItem("nutriq_location_error")
    navigate("/locating", { replace: true })
  }, [navigate])

  const handleCardClick = (restaurant) => {
    sessionStorage.setItem("nutriq_selected_restaurant", JSON.stringify(restaurant))
    navigate(`/menu/${restaurant.id}`)
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 100px" }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 28 }}
      >
        <WordReveal
          text="Eat What You Crave. Smarter."
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
          color="var(--cream)"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.standard, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--cream-dim)",
            marginTop: 12,
          }}
        >
          AI-powered nutrition insights for restaurants near you
        </motion.p>
      </motion.div>

      {/* Location denied banner */}
      {status === "denied" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.standard}
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "rgba(232,25,44,0.08)",
            border: "1px solid rgba(232,25,44,0.2)",
            marginBottom: 20,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--cream)",
          }}
        >
          <strong>Location access denied.</strong>{" "}
          <span style={{ color: "var(--cream-dim)" }}>
            Enable location permissions to discover nearby restaurants.
          </span>
        </motion.div>
      )}

      {/* Error banner */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring.standard}
          className="location-error"
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "rgba(232,25,44,0.08)",
            border: "1px solid rgba(232,25,44,0.2)",
            marginBottom: 20,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--cream)",
          }}
        >
          <strong>Something went wrong.</strong>{" "}
          <span style={{ color: "var(--cream-dim)" }}>{error}</span>
        </motion.div>
      )}

      {/* Stats bar */}
      {restaurants.length > 0 && (
        <ScrollReveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--cream-dim)",
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              <span>
                <strong style={{ color: "var(--cream)" }}>{restaurants.length}</strong> restaurants found
              </span>
              <span>
                Nearest:{" "}
                <strong style={{ color: "var(--orange)" }}>
                  {formatDistance(restaurants[0].distance)}
                </strong>
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={spring.snappy}
              onClick={handleRescan}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--cream-dim)",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
            >
              ↻ Rescan
            </motion.button>
          </div>
        </ScrollReveal>
      )}

      {/* Loading state */}
      {status === "loading" && <SkeletonLoader count={5} />}

      {/* Restaurant list */}
      {status === "located" && restaurants.length > 0 && (
        <StaggerList
          className="restaurant-list"
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          {restaurants.map((r, i) => (
            <motion.div key={r.id} variants={fadeUpItem}>
              <RestaurantCard
                restaurant={r}
                index={i}
                onClick={handleCardClick}
              />
            </motion.div>
          ))}
        </StaggerList>
      )}

      {status === "located" && restaurants.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "48px 20px",
            fontFamily: "var(--font-body)",
            color: "var(--cream-dim)",
          }}
        >
          <p style={{ fontSize: 36, marginBottom: 12 }}>🍽️</p>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No restaurants found nearby</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Try expanding your search area</p>
        </motion.div>
      )}
    </div>
  )
}
