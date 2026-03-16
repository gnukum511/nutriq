import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring, ScrollReveal } from "../components/animations"
import { DIET_PRESETS } from "../lib/diets"
import { useGoals } from "../hooks/useGoals"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { goals, updateGoals, activeDiet, selectDiet } = useGoals()
  const [localGoals, setLocalGoals] = useState(goals)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateGoals(localGoals)
    if (activeDiet !== "custom") {
      // If user manually changed sliders, switch to custom
      const preset = DIET_PRESETS.find((d) => d.id === activeDiet)
      if (preset?.goals && JSON.stringify(preset.goals) !== JSON.stringify(localGoals)) {
        selectDiet("custom")
      }
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSelectDiet = (dietId) => {
    selectDiet(dietId)
    const preset = DIET_PRESETS.find((d) => d.id === dietId)
    if (preset?.goals) {
      setLocalGoals(preset.goals)
    }
  }

  const handleClearHistory = () => {
    localStorage.removeItem("nutriq_meal_history")
    localStorage.removeItem("nutriq_daily_totals")
    alert("Meal history cleared.")
  }

  const handleResetOnboarding = () => {
    localStorage.removeItem("nutriq_onboarded")
    window.location.reload()
  }

  const handleClearAll = () => {
    if (confirm("Clear all NUTRÏQ data? This cannot be undone.")) {
      const keys = ["nutriq_goals", "nutriq_meal_history", "nutriq_daily_totals", "nutriq_favorites", "nutriq_theme", "nutriq_lang", "nutriq_onboarded", "nutriq_diet"]
      keys.forEach((k) => localStorage.removeItem(k))
      sessionStorage.clear()
      window.location.href = "/"
    }
  }

  const goalFields = [
    { key: "cal", label: "Calories", unit: "cal", min: 500, max: 5000, step: 50, color: "var(--gold)" },
    { key: "protein", label: "Protein", unit: "g", min: 20, max: 300, step: 5, color: "var(--green)" },
    { key: "carbs", label: "Carbs", unit: "g", min: 20, max: 500, step: 5, color: "var(--cream-dim)" },
    { key: "fat", label: "Fat", unit: "g", min: 10, max: 200, step: 5, color: "var(--orange)" },
  ]

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ── RED HEADER ── */}
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
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring.snappy}
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12,
              fontWeight: 600, padding: "5px 12px", borderRadius: 8, marginBottom: 14,
            }}>
            ← Back
          </motion.button>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700,
            color: "#fff", marginBottom: 4,
          }}>
            Settings
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.7)",
          }}>
            Diet regimen & daily nutrition targets
          </p>
        </div>
      </motion.div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        {/* ── DIET REGIMEN SELECTOR ── */}
        <ScrollReveal style={{ marginTop: 20 }}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: 20, marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
              color: "var(--cream)", marginBottom: 4,
            }}>
              Diet Regimen
            </h3>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 12, color: "var(--cream-dim)",
              marginBottom: 14,
            }}>
              Select a preset to auto-set your macro targets
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {DIET_PRESETS.map((diet) => {
                const isActive = activeDiet === diet.id
                return (
                  <motion.button
                    key={diet.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring.snappy}
                    onClick={() => handleSelectDiet(diet.id)}
                    style={{
                      padding: "12px 10px",
                      borderRadius: 10,
                      border: `1.5px solid ${isActive ? "var(--red)" : "var(--border)"}`,
                      background: isActive ? "var(--red-glow)" : "var(--surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: isActive ? "var(--red)" : "var(--surface2)",
                        color: isActive ? "#fff" : "var(--cream-dim)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, fontFamily: "var(--font-body)",
                        flexShrink: 0,
                      }}>
                        {diet.icon}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                        color: isActive ? "var(--red)" : "var(--cream)",
                      }}>
                        {diet.name}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: 11,
                      color: "var(--cream-dim)", lineHeight: 1.3,
                    }}>
                      {diet.desc}
                    </span>
                    {diet.goals && (
                      <span style={{
                        fontFamily: "var(--font-body)", fontSize: 10,
                        color: "var(--muted)", marginTop: 2,
                      }}>
                        {diet.goals.cal} cal · {diet.goals.protein}p · {diet.goals.carbs}c · {diet.goals.fat}f
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ── MACRO SLIDERS ── */}
        <ScrollReveal delay={0.1}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: 20, marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
                color: "var(--cream)",
              }}>
                Daily Targets
              </h3>
              {activeDiet !== "custom" && (
                <span style={{
                  padding: "3px 10px", borderRadius: 6, background: "var(--red-glow)",
                  color: "var(--red)", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
                }}>
                  {DIET_PRESETS.find((d) => d.id === activeDiet)?.name}
                </span>
              )}
            </div>

            {goalFields.map(({ key, label, unit, min, max, step, color }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 4,
                  fontFamily: "var(--font-body)", fontSize: 13,
                }}>
                  <span style={{ color: "var(--cream-dim)" }}>{label}</span>
                  <span style={{ color, fontWeight: 700 }}>
                    {localGoals[key]} {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={min} max={max} step={step}
                  value={localGoals[key]}
                  onChange={(e) => setLocalGoals({ ...localGoals, [key]: Number(e.target.value) })}
                  style={{ width: "100%", accentColor: "var(--red)", cursor: "pointer" }}
                />
              </div>
            ))}

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
              onClick={handleSave}
              style={{
                width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                background: saved ? "var(--green)" : "var(--red)", color: "#fff",
                fontSize: 14, fontWeight: 700, fontFamily: "var(--font-body)",
                cursor: "pointer", marginTop: 4,
              }}>
              {saved ? "✓ Saved" : "Save Goals"}
            </motion.button>
          </div>
        </ScrollReveal>

        {/* ── DATA MANAGEMENT ── */}
        <ScrollReveal delay={0.2}>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
              color: "var(--cream)", marginBottom: 16,
            }}>
              Data
            </h3>
            <SettingsButton onClick={handleClearHistory} label="Clear Meal History" desc="Remove all saved meal analyses" />
            <SettingsButton onClick={handleResetOnboarding} label="Show Onboarding" desc="Replay the welcome tutorial" />
            <SettingsButton onClick={handleClearAll} label="Reset Everything" desc="Clear all data and start fresh" danger />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function SettingsButton({ onClick, label, desc, danger }) {
  return (
    <motion.button
      whileHover={{ background: "var(--surface2)" }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={onClick}
      style={{
        width: "100%", display: "flex", flexDirection: "column", gap: 2,
        padding: "12px 14px", borderRadius: 10, border: "none",
        background: "transparent", cursor: "pointer", textAlign: "left", marginBottom: 4,
      }}
    >
      <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: danger ? "var(--red)" : "var(--cream)" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--cream-dim)" }}>
        {desc}
      </span>
    </motion.button>
  )
}
