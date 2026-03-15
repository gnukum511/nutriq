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

export default function MenuPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { menu, loading, error, loadMenu } = useMenu()
  const [selectedItems, setSelectedItems] = useState([])
  const [activeCategory, setActiveCategory] = useState("All")

  // Load restaurant from session
  const restaurant = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("nutriq_selected_restaurant")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [id])

  // Load menu on mount
  useEffect(() => {
    if (restaurant) {
      loadMenu(restaurant)
    }
  }, [restaurant, loadMenu])

  // Extract categories
  const categories = useMemo(() => {
    const cats = [...new Set(menu.map((item) => item.cat))]
    return ["All", ...cats]
  }, [menu])

  // Filter by category
  const categoryFiltered = useMemo(() => {
    if (activeCategory === "All") return menu
    return menu.filter((item) => item.cat === activeCategory)
  }, [menu, activeCategory])

  // Apply nutrition filters
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-body)",
          color: "var(--cream-dim)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 14 }}>Restaurant not found</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => navigate("/")}
            style={{
              marginTop: 12,
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: "var(--red)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.standard}
        style={{ marginBottom: 20 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring.snappy}
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "var(--cream-dim)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            marginBottom: 14,
            padding: 0,
          }}
        >
          ← Back
        </motion.button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>{restaurant.emoji}</span>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--cream)",
              }}
            >
              {restaurant.name}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--cream-dim)",
                marginTop: 2,
              }}
            >
              {restaurant.cuisineLabel} · {formatDistance(restaurant.distance)} away
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "14px 18px",
            borderRadius: 12,
            background: "rgba(232,25,44,0.08)",
            border: "1px solid rgba(232,25,44,0.2)",
            marginBottom: 16,
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--cream)",
          }}
        >
          <strong>Failed to load menu.</strong>{" "}
          <span style={{ color: "var(--cream-dim)" }}>
            {error.includes("API_KEY") ? "API key not configured." : error.includes("401") ? "Invalid API key." : error}
          </span>
          <br />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => loadMenu(restaurant)}
            style={{
              marginTop: 8,
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: "var(--red)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Retry
          </motion.button>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--cream-dim)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block", fontSize: 16 }}
            >
              ✦
            </motion.span>
            Generating menu with AI...
          </motion.p>
          <SkeletonLoader count={6} />
        </>
      )}

      {/* Menu loaded */}
      {!loading && menu.length > 0 && (
        <>
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
          <StaggerList style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

          {/* No filter results */}
          {filteredItems.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "32px 0",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--cream-dim)",
              }}
            >
              No items match this filter
            </motion.p>
          )}
        </>
      )}

      {/* Selection bar */}
      <SelectionBar
        selectedItems={selectedItems}
        onAnalyze={handleAnalyze}
        onClear={() => setSelectedItems([])}
      />
    </div>
  )
}
