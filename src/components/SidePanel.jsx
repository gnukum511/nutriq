import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { spring } from "./animations"
import { useFavorites } from "../hooks/useFavorites"

const NAV_ITEMS = [
  { path: "/", label: "Restaurants", icon: "🍽️" },
  { path: "/analysis", label: "Dashboard", icon: "📊" },
]

const BOTTOM_ITEMS = [
  { label: "Settings", icon: "⚙️", action: "settings" },
  { label: "About NUTRÏQ", icon: "ℹ️", action: "about" },
]

export default function SidePanel({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { favorites } = useFavorites()

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 150,
            }}
          />

          {/* Panel */}
          <motion.nav
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={spring.standard}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 272,
              background: "var(--surface)",
              borderRight: "1px solid var(--border)",
              boxShadow: "4px 0 24px rgba(0,0,0,0.06)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              padding: "20px 0",
            }}
            aria-label="Navigation"
          >
            {/* Logo */}
            <div style={{ padding: "0 20px 20px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--cream)",
                    letterSpacing: -0.5,
                  }}
                >
                  NUTR<span style={{ color: "var(--red)" }}>Ï</span>Q
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={spring.snappy}
                  onClick={onClose}
                  aria-label="Close menu"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 18,
                    color: "var(--cream-dim)",
                    padding: 4,
                  }}
                >
                  ✕
                </motion.button>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  color: "var(--cream-dim)",
                  marginTop: 4,
                }}
              >
                AI Nutrition Coach
              </p>
            </div>

            {/* Navigation */}
            <div style={{ flex: 1, padding: "12px 10px" }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  padding: "0 10px 8px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Navigate
              </p>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ background: "var(--surface2)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring.snappy}
                    onClick={() => handleNav(item.path)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: isActive ? "var(--red-glow)" : "transparent",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--red)" : "var(--cream)",
                      textAlign: "left",
                      marginBottom: 2,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {item.label}
                  </motion.button>
                )
              })}

              {/* Quick stats */}
              <div
                style={{
                  margin: "16px 10px",
                  padding: 14,
                  background: "var(--surface2)",
                  borderRadius: 12,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 10,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Today
                </p>
                <DailyStat label="Calories" value={getDailyVal("cal")} goal={getGoalVal("cal")} color="var(--gold)" />
                <DailyStat label="Protein" value={getDailyVal("protein")} goal={getGoalVal("protein")} unit="g" color="var(--green)" />
              </div>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div style={{ padding: "0 10px", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    padding: "0 10px 8px",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Favorites
                </p>
                {favorites.slice(0, 5).map((fav) => (
                  <motion.button
                    key={fav.id}
                    whileHover={{ background: "var(--surface2)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={spring.snappy}
                    onClick={() => {
                      sessionStorage.setItem("nutriq_selected_restaurant", JSON.stringify(fav))
                      navigate(`/menu/${fav.id}`)
                      onClose()
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--cream)",
                      textAlign: "left",
                      marginBottom: 2,
                    }}
                  >
                    <span>{fav.emoji}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fav.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--red)" }}>❤️</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Bottom */}
            <div style={{ padding: "0 10px", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              {BOTTOM_ITEMS.map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ background: "var(--surface2)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={spring.snappy}
                  onClick={onClose}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--cream-dim)",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

function getDailyVal(key) {
  try {
    const stored = JSON.parse(localStorage.getItem("nutriq_daily_totals") || "{}")
    const today = new Date().toISOString().slice(0, 10)
    return stored.date === today ? stored[key] || 0 : 0
  } catch {
    return 0
  }
}

function getGoalVal(key) {
  try {
    const stored = JSON.parse(localStorage.getItem("nutriq_goals") || "{}")
    const defaults = { cal: 2000, protein: 120 }
    return stored[key] || defaults[key]
  } catch {
    return key === "cal" ? 2000 : 120
  }
}

function DailyStat({ label, value, goal, unit = "", color }) {
  const pct = Math.min(100, Math.round((value / goal) * 100))
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontFamily: "var(--font-body)",
          marginBottom: 3,
        }}
      >
        <span style={{ color: "var(--cream-dim)" }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>
          {value}{unit}/{goal}{unit}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "var(--surface3)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: color }} />
      </div>
    </div>
  )
}
