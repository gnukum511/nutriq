import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { StaggerList, fadeUpItem, spring, ScrollReveal, Skeleton } from "../components/animations"
import RestaurantCard from "../components/RestaurantCard"
import SkeletonLoader from "../components/SkeletonLoader"
import { formatDistance } from "../lib/health"
import { useFavorites } from "../hooks/useFavorites"

const RestaurantMap = lazy(() => import("../components/RestaurantMap"))

export default function HomePage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("loading")
  const [restaurants, setRestaurants] = useState([])
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("distance")
  const [view, setView] = useState("list")
  const [userCoords, setUserCoords] = useState(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    const storedStatus = sessionStorage.getItem("nutriq_location_status")
    if (!storedStatus) {
      navigate("/locating", { replace: true })
      return
    }
    setStatus(storedStatus)
    if (storedStatus === "located") {
      try {
        const stored = sessionStorage.getItem("nutriq_restaurants")
        if (stored) setRestaurants(JSON.parse(stored))
        const storedCoords = sessionStorage.getItem("nutriq_coords")
        if (storedCoords) setUserCoords(JSON.parse(storedCoords))
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

  const displayedRestaurants = useMemo(() => {
    let list = [...restaurants]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.cuisineLabel || "").toLowerCase().includes(q) ||
          (r.cuisine || "").toLowerCase().includes(q)
      )
    }
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === "cuisine") list.sort((a, b) => (a.cuisineLabel || "").localeCompare(b.cuisineLabel || ""))
    else list.sort((a, b) => a.distance - b.distance)
    return list
  }, [restaurants, search, sortBy])

  const handleCardClick = (restaurant) => {
    sessionStorage.setItem("nutriq_selected_restaurant", JSON.stringify(restaurant))
    navigate(`/menu/${restaurant.id}`)
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* ── RED SEARCH HERO ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, var(--red) 0%, #B5101F 100%)",
          padding: "36px 16px 32px",
          marginTop: -8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle pattern overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.standard, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.2,
              color: "#fff",
              marginBottom: 6,
            }}
          >
            Eat What You Crave. Smarter.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.standard, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "rgba(255,255,255,0.75)",
              marginBottom: 20,
            }}
          >
            AI-powered nutrition insights for restaurants near you
          </motion.p>

          {/* Search bar inside hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.standard, delay: 0.35 }}
            style={{ display: "flex", gap: 8 }}
          >
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 10,
              padding: "0 14px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              <span style={{ fontSize: 15, marginRight: 8, opacity: 0.4 }}>&#x1F50D;</span>
              <input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  border: "none",
                  background: "transparent",
                  color: "#1A1A1A",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: "rgba(255,255,255,0.95)",
                color: "#1A1A1A",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <option value="distance">Nearest</option>
              <option value="name">A–Z</option>
              <option value="cuisine">Cuisine</option>
            </select>
          </motion.div>
        </div>
      </motion.div>

      {/* ── CONTENT AREA ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>

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
              marginTop: 16,
              marginBottom: 8,
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
              marginTop: 16,
              marginBottom: 8,
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--cream)",
            }}
          >
            <strong>Something went wrong.</strong>{" "}
            <span style={{ color: "var(--cream-dim)" }}>{error}</span>
          </motion.div>
        )}

        {/* Stats + action bar */}
        {restaurants.length > 0 && (
          <ScrollReveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 0 12px",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--cream-dim)",
                borderBottom: "1px solid var(--border)",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span>
                  <strong style={{ color: "var(--cream)", fontSize: 15 }}>{restaurants.length}</strong>{" "}
                  restaurants
                </span>
                <span style={{ color: "var(--muted)" }}>|</span>
                <span>
                  Nearest{" "}
                  <strong style={{ color: "var(--orange)" }}>
                    {formatDistance(restaurants[0].distance)}
                  </strong>
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring.snappy}
                  onClick={handleRescan}
                  style={{
                    padding: "6px 12px",
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={spring.snappy}
                  onClick={() => setView(view === "list" ? "map" : "list")}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: view === "map" ? "var(--red)" : "var(--surface)",
                    color: view === "map" ? "#fff" : "var(--cream-dim)",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                  }}
                >
                  {view === "list" ? "🗺️ Map" : "☰ List"}
                </motion.button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Loading state */}
        {status === "loading" && <SkeletonLoader count={5} />}

        {/* Map view */}
        {status === "located" && view === "map" && restaurants.length > 0 && (
          <Suspense fallback={<Skeleton height={380} borderRadius={16} />}>
            <div style={{ marginBottom: 16 }}>
              <RestaurantMap
                restaurants={displayedRestaurants}
                userCoords={userCoords}
                onSelect={handleCardClick}
              />
            </div>
          </Suspense>
        )}

        {/* Restaurant list */}
        {status === "located" && view === "list" && restaurants.length > 0 && displayedRestaurants.length > 0 && (
          <StaggerList
            className="restaurant-list"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {displayedRestaurants.map((r, i) => (
              <motion.div key={r.id} variants={fadeUpItem}>
                <RestaurantCard
                  restaurant={r}
                  index={i}
                  onClick={handleCardClick}
                  isFavorite={isFavorite(r.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </motion.div>
            ))}
          </StaggerList>
        )}

        {status === "located" && view === "list" && restaurants.length > 0 && displayedRestaurants.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "32px 20px",
              fontFamily: "var(--font-body)",
              color: "var(--cream-dim)",
            }}
          >
            <p style={{ fontSize: 14 }}>No restaurants match "{search}"</p>
          </motion.div>
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
    </div>
  )
}
