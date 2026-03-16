import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring, ScrollReveal } from "../components/animations"
import { useGoals } from "../hooks/useGoals"
import { getDietById } from "../lib/diets"

export default function TrackerPage() {
  const navigate = useNavigate()
  const { goals, dailyTotals, progress, remaining, overBudget, activeDiet } = useGoals()
  const diet = getDietById(activeDiet)

  const history = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriq_meal_history") || "[]")
    } catch {
      return []
    }
  }, [])

  const todaysMeals = history.filter((h) => h.date === new Date().toLocaleDateString())

  const macros = [
    { key: "cal", label: "Calories", unit: "", color: "var(--gold)", icon: "🔥" },
    { key: "protein", label: "Protein", unit: "g", color: "var(--green)", icon: "P" },
    { key: "carbs", label: "Carbs", unit: "g", color: "var(--cream-dim)", icon: "C" },
    { key: "fat", label: "Fat", unit: "g", color: "var(--orange)", icon: "F" },
  ]

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ── RED HEADER ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, var(--red) 0%, #B5101F 100%)",
          padding: "28px 16px 24px", marginTop: -8, position: "relative", overflow: "hidden",
        }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring.snappy}
            onClick={() => navigate("/")}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8, marginBottom: 14 }}>
            ← Home
          </motion.button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                Daily Tracker
              </h1>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            {activeDiet !== "custom" && (
              <span style={{
                padding: "4px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.15)",
                color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-body)",
              }}>
                {diet.name}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        {/* ── MACRO RINGS ── */}
        <ScrollReveal style={{ marginTop: 20 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
            marginBottom: 20,
          }}>
            {macros.map(({ key, label, unit, color }) => {
              const pct = progress[key]
              const isOver = overBudget[key]
              return (
                <div key={key} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  {/* Circular progress */}
                  <div style={{ position: "relative", width: 80, height: 80, marginBottom: 10 }}>
                    <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface3)" strokeWidth="6" />
                      <motion.circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={isOver ? "var(--red)" : color}
                        strokeWidth="6" strokeLinecap="round"
                        initial={{ strokeDasharray: `0 ${2 * Math.PI * 34}` }}
                        animate={{ strokeDasharray: `${(Math.min(pct, 100) / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div style={{
                      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 700,
                        color: isOver ? "var(--red)" : color,
                      }}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--cream)", marginBottom: 4 }}>
                    {label}
                  </span>

                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--cream-dim)", textAlign: "center" }}>
                    <span style={{ color, fontWeight: 700 }}>{dailyTotals[key]}{unit}</span>
                    <span style={{ color: "var(--muted)" }}> / {goals[key]}{unit}</span>
                  </div>

                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 11, marginTop: 4,
                    color: isOver ? "var(--red)" : "var(--cream-dim)",
                    fontWeight: 600,
                  }}>
                    {isOver
                      ? `${dailyTotals[key] - goals[key]}${unit} over`
                      : `${remaining[key]}${unit} left`
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollReveal>

        {/* ── QUICK ACTIONS ── */}
        <ScrollReveal delay={0.1}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <ActionButton onClick={() => navigate("/")} label="Add Meal" desc="Find a restaurant" primary />
            <ActionButton onClick={() => navigate("/profile")} label="Edit Profile" desc="Update body stats" />
            <ActionButton onClick={() => navigate("/settings")} label="Diet Plan" desc="Change regimen" />
          </div>
        </ScrollReveal>

        {/* ── TODAY'S MEALS ── */}
        <ScrollReveal delay={0.15}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: 20, marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
              color: "var(--cream)", marginBottom: 12,
            }}>
              Today's Meals
            </h3>

            {todaysMeals.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-dim)" }}>
                  No meals tracked yet today
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
                  onClick={() => navigate("/")}
                  style={{
                    marginTop: 10, padding: "8px 20px", borderRadius: 10, border: "none",
                    background: "var(--red)", color: "#fff", fontSize: 13, fontWeight: 700,
                    fontFamily: "var(--font-body)", cursor: "pointer",
                  }}>
                  Find Restaurants
                </motion.button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {todaysMeals.map((meal) => (
                  <div key={meal.id} style={{
                    padding: "10px 14px", border: "1px solid var(--border)",
                    borderRadius: 10, fontFamily: "var(--font-body)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--cream)" }}>
                        {meal.items.length} item{meal.items.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>
                        {meal.totals.cal} cal
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--cream-dim)" }}>
                      {meal.items.join(", ")}
                    </span>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
                      <span>{meal.totals.protein}g protein</span>
                      <span>{meal.totals.carbs}g carbs</span>
                      <span>{meal.totals.fat}g fat</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── RECENT HISTORY ── */}
        {history.length > 0 && (
          <ScrollReveal delay={0.2}>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 14, padding: 20,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
                color: "var(--cream)", marginBottom: 12,
              }}>
                Recent History
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {history.slice(0, 7).map((entry) => (
                  <div key={entry.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: "1px solid var(--border)",
                    fontFamily: "var(--font-body)",
                  }}>
                    <div>
                      <span style={{ fontSize: 12, color: "var(--cream-dim)" }}>{entry.date}</span>
                      <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>
                        {entry.items.length} item{entry.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 10, fontSize: 12 }}>
                      <span style={{ color: "var(--gold)", fontWeight: 600 }}>{entry.totals.cal}</span>
                      <span style={{ color: "var(--green)", fontWeight: 600 }}>{entry.totals.protein}g</span>
                      <span style={{ color: "var(--orange)", fontWeight: 600 }}>{entry.totals.fat}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}

function ActionButton({ onClick, label, desc, primary }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
      onClick={onClick}
      style={{
        flex: 1, padding: "12px 10px", borderRadius: 10,
        border: `1.5px solid ${primary ? "var(--red)" : "var(--border)"}`,
        background: primary ? "var(--red)" : "var(--surface)",
        cursor: "pointer", textAlign: "center",
      }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: primary ? "#fff" : "var(--cream)" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: primary ? "rgba(255,255,255,0.7)" : "var(--cream-dim)", marginTop: 2 }}>
        {desc}
      </div>
    </motion.button>
  )
}
