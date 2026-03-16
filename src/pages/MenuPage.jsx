import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { StaggerList, fadeUpItem, spring, ScrollReveal } from "../components/animations"
import { useMenu } from "../hooks/useMenu"
import { useFilters } from "../hooks/useFilters"
import MenuItemCard from "../components/MenuItemCard"
import FilterPills from "../components/FilterPills"
import CategoryTabs from "../components/CategoryTabs"
import SelectionBar from "../components/SelectionBar"
import { formatDistance } from "../lib/health"
import SkeletonLoader from "../components/SkeletonLoader"

// Deterministic pseudo-values from restaurant name (same as RestaurantCard)
function pseudoRating(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  return (3.5 + (Math.abs(hash) % 15) / 10).toFixed(1)
}
function pseudoReviewCount(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 3) + name.charCodeAt(i)) | 0
  return 12 + (Math.abs(hash) % 388)
}
function pseudoPriceTier(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) | 0
  return Math.abs(hash) % 3 + 1
}

function Stars({ rating, size = 14 }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("full")
    else if (i === full && half) stars.push("half")
    else stars.push("empty")
  }
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {stars.map((type, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
          {type === "full" && (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#fff" />
          )}
          {type === "half" && (
            <>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="rgba(255,255,255,0.3)" />
              <path d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#fff" />
            </>
          )}
          {type === "empty" && (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="rgba(255,255,255,0.3)" />
          )}
        </svg>
      ))}
    </span>
  )
}

export default function MenuPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menu, loading, error, loadMenu } = useMenu()
  const [selectedItems, setSelectedItems] = useState([])
  const [activeCategory, setActiveCategory] = useState("All")

  const restaurant = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("nutriq_selected_restaurant")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [id])

  useEffect(() => {
    if (restaurant) loadMenu(restaurant)
  }, [restaurant, loadMenu])

  const categories = useMemo(() => {
    const cats = [...new Set(menu.map((item) => item.cat))]
    return ["All", ...cats]
  }, [menu])

  const categoryFiltered = useMemo(() => {
    if (activeCategory === "All") return menu
    return menu.filter((item) => item.cat === activeCategory)
  }, [menu, activeCategory])

  const { activeFilter, toggleFilter, filteredItems, counts } = useFilters(categoryFiltered)

  const handleToggleItem = useCallback((item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id)
      if (exists) return prev.filter((i) => i.id !== item.id)
      return [...prev, item]
    })
  }, [])

  const handleAnalyze = () => {
    sessionStorage.setItem("nutriq_selected_items", JSON.stringify(selectedItems))
    navigate("/analysis")
  }

  if (!restaurant) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-body)", color: "var(--cream-dim)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14 }}>Restaurant not found</p>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy} onClick={() => navigate("/")}
            style={{ marginTop: 12, padding: "8px 20px", borderRadius: 10, border: "none", background: "var(--red)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Back to Home
          </motion.button>
        </div>
      </div>
    )
  }

  const rating = parseFloat(pseudoRating(restaurant.name))
  const reviewCount = pseudoReviewCount(restaurant.name)
  const priceTier = pseudoPriceTier(restaurant.name)
  const isOpen = restaurant.name.length % 5 !== 0

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* ── RESTAURANT HEADER BANNER ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, var(--red) 0%, #B5101F 100%)",
          padding: "28px 16px 24px",
          marginTop: -8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring.snappy}
            onClick={() => navigate("/")}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 12px",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            ← Back
          </motion.button>

          {/* Restaurant info */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, flexShrink: 0,
            }}>
              {restaurant.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                color: "#fff", marginBottom: 6,
              }}>
                {restaurant.name}
              </h1>

              {/* Rating + price + status row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <Stars rating={rating} size={14} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)" }}>
                  {rating}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>({reviewCount})</span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)" }}>
                  {"$".repeat(priceTier)}<span style={{ opacity: 0.3 }}>{"$".repeat(3 - priceTier)}</span>
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>·</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "2px 8px", borderRadius: 6,
                  background: isOpen ? "rgba(27,163,77,0.2)" : "rgba(255,255,255,0.15)",
                  fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                  color: isOpen ? "#6FE89B" : "rgba(255,255,255,0.7)",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: isOpen ? "#6FE89B" : "rgba(255,255,255,0.5)" }} />
                  {isOpen ? "Open" : "Closed"}
                </span>
              </div>

              {/* Detail pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                }}>
                  {restaurant.cuisineLabel}
                </span>
                <span style={{
                  padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                }}>
                  📍 {formatDistance(restaurant.distance)}
                </span>
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} onClick={(e) => e.stopPropagation()} style={{
                    padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                    textDecoration: "none",
                  }}>
                    📞 {restaurant.phone}
                  </a>
                )}
                {restaurant.website && (
                  <a href={restaurant.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{
                    padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                    textDecoration: "none",
                  }}>
                    🌐 Website
                  </a>
                )}
                {restaurant.lat && (
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lon}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{
                    padding: "3px 10px", borderRadius: 6, background: "rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                    textDecoration: "none",
                  }}>
                    🗺️ Directions
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CONTENT AREA ── */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "14px 18px", borderRadius: 12,
              background: "rgba(232,25,44,0.08)", border: "1px solid rgba(232,25,44,0.2)",
              marginTop: 16, marginBottom: 8,
              fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream)",
            }}
          >
            <strong>Failed to load menu.</strong>{" "}
            <span style={{ color: "var(--cream-dim)" }}>
              {error.includes("API_KEY") ? "API key not configured." : error.includes("401") ? "Invalid API key." : error}
            </span>
            <br />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
              onClick={() => loadMenu(restaurant)}
              style={{ marginTop: 8, padding: "6px 14px", borderRadius: 8, border: "none", background: "var(--red)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Retry
            </motion.button>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ marginTop: 20 }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-dim)",
                marginBottom: 14, display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "inline-block", fontSize: 16 }}>
                ✦
              </motion.span>
              Generating menu with AI...
            </motion.p>
            <SkeletonLoader count={6} />
          </div>
        )}

        {/* Menu loaded */}
        {!loading && menu.length > 0 && (
          <>
            {/* Menu section header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 0 12px",
              borderBottom: "1px solid var(--border)", marginBottom: 14,
            }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-dim)" }}>
                <strong style={{ color: "var(--cream)", fontSize: 15 }}>{menu.length}</strong> items on menu
              </span>
              {selectedItems.length > 0 && (
                <span style={{
                  padding: "3px 10px", borderRadius: 8, background: "var(--red-glow)",
                  color: "var(--red)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)",
                }}>
                  {selectedItems.length} selected
                </span>
              )}
            </div>

            {/* Category tabs */}
            <ScrollReveal style={{ marginBottom: 14 }}>
              <CategoryTabs
                categories={categories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
            </ScrollReveal>

            {/* Filter pills */}
            <ScrollReveal delay={0.1} style={{ marginBottom: 18 }}>
              <FilterPills
                activeFilter={activeFilter}
                onToggle={toggleFilter}
                counts={counts}
              />
            </ScrollReveal>

            {/* Menu items */}
            <StaggerList style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredItems.map((item, i) => (
                <motion.div key={item.id} variants={fadeUpItem}>
                  <MenuItemCard
                    item={item}
                    index={i}
                    selected={selectedItems.some((s) => s.id === item.id)}
                    onToggle={handleToggleItem}
                  />
                </motion.div>
              ))}
            </StaggerList>

            {filteredItems.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "32px 0", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--cream-dim)" }}>
                No items match this filter
              </motion.p>
            )}
          </>
        )}

        <SelectionBar
          selectedItems={selectedItems}
          onAnalyze={handleAnalyze}
          onClear={() => setSelectedItems([])}
        />
      </div>
    </div>
  )
}
