import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring, ScrollReveal } from "../components/animations"

export default function SettingsPage() {
  const navigate = useNavigate()

  const [goals, setGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriq_goals") || '{"cal":2000,"protein":120,"carbs":250,"fat":65}')
    } catch {
      return { cal: 2000, protein: 120, carbs: 250, fat: 65 }
    }
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem("nutriq_goals", JSON.stringify(goals))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
      const keys = ["nutriq_goals", "nutriq_meal_history", "nutriq_daily_totals", "nutriq_favorites", "nutriq_theme", "nutriq_lang", "nutriq_onboarded"]
      keys.forEach((k) => localStorage.removeItem(k))
      sessionStorage.clear()
      window.location.href = "/"
    }
  }

  const goalFields = [
    { key: "cal", label: "Daily Calories", unit: "cal", min: 500, max: 5000, step: 50 },
    { key: "protein", label: "Daily Protein", unit: "g", min: 20, max: 300, step: 5 },
    { key: "carbs", label: "Daily Carbs", unit: "g", min: 20, max: 500, step: 5 },
    { key: "fat", label: "Daily Fat", unit: "g", min: 10, max: 200, step: 5 },
  ]

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 60px" }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.standard}
        style={{ marginBottom: 24 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={spring.snappy}
          onClick={() => navigate(-1)}
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

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 700,
            color: "var(--cream)",
          }}
        >
          Settings
        </h1>
      </motion.div>

      {/* Nutrition Goals */}
      <ScrollReveal>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--cream)",
              marginBottom: 16,
            }}
          >
            Daily Nutrition Goals
          </h3>

          {goalFields.map(({ key, label, unit, min, max, step }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--cream-dim)" }}>{label}</span>
                <span style={{ color: "var(--cream)", fontWeight: 600 }}>
                  {goals[key]} {unit}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={goals[key]}
                onChange={(e) => setGoals({ ...goals, [key]: Number(e.target.value) })}
                style={{
                  width: "100%",
                  accentColor: "var(--red)",
                  cursor: "pointer",
                }}
              />
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={handleSave}
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 10,
              border: "none",
              background: saved ? "var(--green)" : "var(--red)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            {saved ? "✓ Saved" : "Save Goals"}
          </motion.button>
        </div>
      </ScrollReveal>

      {/* Data Management */}
      <ScrollReveal delay={0.1}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--cream)",
              marginBottom: 16,
            }}
          >
            Data
          </h3>

          <SettingsButton onClick={handleClearHistory} label="Clear Meal History" desc="Remove all saved meal analyses" />
          <SettingsButton onClick={handleResetOnboarding} label="Show Onboarding" desc="Replay the welcome tutorial" />
          <SettingsButton onClick={handleClearAll} label="Reset Everything" desc="Clear all data and start fresh" danger />
        </div>
      </ScrollReveal>
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
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "12px 14px",
        borderRadius: 10,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        marginBottom: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          color: danger ? "var(--red)" : "var(--cream)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: "var(--cream-dim)",
        }}
      >
        {desc}
      </span>
    </motion.button>
  )
}
