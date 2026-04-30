import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { StaggerList, fadeUpItem, spring, ScrollReveal, Skeleton } from "../components/animations"
import RestaurantCard from "../components/RestaurantCard"
import SkeletonLoader from "../components/SkeletonLoader"
import { formatDistance } from "../lib/health"
import { useFavorites } from "../hooks/useFavorites"
import { useGoals } from "../hooks/useGoals"

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
  const { dailyTotals, goals, progress } = useGoals()

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
      {/* ── ORGANIC SEARCH HERO ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "var(--gradient-hero)",
          padding: "44px 16px 36px",
          marginTop: -8,
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Soft botanical glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 85% 15%, oklch(0.92 0.07 65 / 0.45) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 10% 90%, oklch(0.92 0.075 145 / 0.35) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.standard, delay: 0.05 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: "color-mix(in oklch, var(--primary-soft) 70%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 22%, transparent)",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: 14,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--leaf)" }} />
            Now scanning menus near you
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.standard, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 34,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: -0.5,
              color: "var(--foreground)",
              marginBottom: 8,
            }}
          >
            Eat out.{" "}
            <span style={{ fontStyle: "italic", color: "var(--primary)" }}>
              Eat smart.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring.standard, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--muted-foreground)",
              marginBottom: 22,
              maxWidth: 460,
            }}
          >
            NUTRÏQ ranks every dish on every menu within five miles, so you can dine
            out without throwing your week off track.
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
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "0 14px",
              boxShadow: "var(--shadow-soft)",
            }}>
              <span style={{ fontSize: 15, marginRight: 8, opacity: 0.5 }}>&#x1F50D;</span>
              <input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  border: "none",
                  background: "transparent",
                  color: "var(--foreground)",
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
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                boxShadow: "var(--shadow-soft)",
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
                    borderRadius: 999,
                    border: `1px solid ${view === "map" ? "var(--primary)" : "var(--border)"}`,
                    background: view === "map" ? "var(--primary)" : "var(--card)",
                    color: view === "map" ? "var(--primary-foreground)" : "var(--muted-foreground)",
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

        {/* Daily macro summary strip */}
        {dailyTotals.cal > 0 && (
          <ScrollReveal style={{ marginBottom: 16 }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate("/tracker")}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {[
                  { label: "Cal", value: dailyTotals.cal, goal: goals.cal, color: "var(--gold)", pct: progress.cal },
                  { label: "Pro", value: `${dailyTotals.protein}g`, goal: goals.protein, color: "var(--green)", pct: progress.protein },
                  { label: "Carb", value: `${dailyTotals.carbs}g`, goal: goals.carbs, color: "var(--cream-dim)", pct: progress.carbs },
                  { label: "Fat", value: `${dailyTotals.fat}g`, goal: goals.fat, color: "var(--orange)", pct: progress.fat },
                ].map(({ label, value, color, pct }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color }}>{value}</div>
                    <div style={{ width: 40, height: 3, borderRadius: 2, background: "var(--surface3)", marginTop: 3 }}>
                      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 2, background: color }} />
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <span style={{
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                color: "var(--red)", whiteSpace: "nowrap",
              }}>
                View Tracker →
              </span>
            </motion.div>
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
