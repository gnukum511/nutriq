import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring, fadeUpItem, StaggerList, ScrollReveal } from "../components/animations"
import { useAnalysis } from "../hooks/useAnalysis"
import MacroPill from "../components/MacroPill"
import AIAnalysisPanel from "../components/AIAnalysisPanel"
import { useGoals } from "../hooks/useGoals"
import MealComparison from "../components/MealComparison"

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { analysis, loading, error, analyze } = useAnalysis()
  const { goals, dailyTotals, addMealToDaily, progress } = useGoals()
  const [tracked, setTracked] = useState(false)

  const selectedItems = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("nutriq_selected_items")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  const totals = useMemo(() => ({
    cal: selectedItems.reduce((s, i) => s + i.cal, 0),
    protein: selectedItems.reduce((s, i) => s + i.protein, 0),
    carbs: selectedItems.reduce((s, i) => s + i.carbs, 0),
    fat: selectedItems.reduce((s, i) => s + i.fat, 0),
  }), [selectedItems])

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriq_meal_history") || "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (selectedItems.length > 0 && !analysis && !loading) {
      analyze(selectedItems)
    }
  }, [selectedItems, analysis, loading, analyze])

  // Save to history when analysis completes
  useEffect(() => {
    if (analysis && selectedItems.length > 0) {
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        items: selectedItems.map((i) => i.name),
        totals,
        analysis,
      }
      const prev = JSON.parse(localStorage.getItem("nutriq_meal_history") || "[]")
      // Don't duplicate if same items
      const isDupe = prev.length > 0 && JSON.stringify(prev[0].items) === JSON.stringify(entry.items)
      if (!isDupe) {
        const updated = [entry, ...prev].slice(0, 20) // keep last 20
        localStorage.setItem("nutriq_meal_history", JSON.stringify(updated))
        setHistory(updated)
      }
    }
  }, [analysis, selectedItems, totals])

  if (selectedItems.length === 0) {
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
          <p style={{ fontSize: 36, marginBottom: 12 }}>🥗</p>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No items selected</p>
          <p style={{ fontSize: 13, marginTop: 6, marginBottom: 16 }}>
            Go back and select some menu items to analyze
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => navigate(-1)}
            style={{
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
            Go Back
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 60px" }}>
      {/* Header */}
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
          ← Back to Menu
        </motion.button>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 700,
            color: "var(--cream)",
            marginBottom: 6,
          }}
        >
          Meal Analysis
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--cream-dim)",
          }}
        >
          {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
        </p>
      </motion.div>

      {/* Totals */}
      <ScrollReveal style={{ marginBottom: 20 }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--cream-dim)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Meal Totals
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <MacroPill type="cal" value={totals.cal} />
            <MacroPill type="protein" value={totals.protein} />
            <MacroPill type="carbs" value={totals.carbs} />
            <MacroPill type="fat" value={totals.fat} />
          </div>
        </div>
      </ScrollReveal>

      {/* Selected items list */}
      <ScrollReveal delay={0.1} style={{ marginBottom: 24 }}>
        <StaggerList style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {selectedItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUpItem}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--cream)" }}>{item.name}</span>
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                {item.cal} cal
              </span>
            </motion.div>
          ))}
        </StaggerList>
      </ScrollReveal>

      {/* AI Analysis */}
      <AIAnalysisPanel
        analysis={analysis}
        loading={loading}
        error={error}
      />

      {/* Share button + Daily Progress */}
      {analysis && (
        <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "flex", gap: 8, marginTop: 12 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => {
              const text = `🍽️ NUTRÏQ Meal Analysis\n\n${selectedItems.map((i) => `• ${i.name} (${i.cal} cal)`).join("\n")}\n\nTotals: ${totals.cal} cal | ${totals.protein}g protein | ${totals.carbs}g carbs | ${totals.fat}g fat\n\n${analysis}`
              if (navigator.share) {
                navigator.share({ title: "NUTRÏQ Meal Analysis", text })
              } else {
                navigator.clipboard.writeText(text)
                alert("Copied to clipboard!")
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--cream-dim)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            📋 Copy Analysis
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => {
              addMealToDaily(selectedItems)
              setTracked(true)
            }}
            disabled={tracked}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "none",
              background: tracked ? "var(--green-dim)" : "var(--green)",
              color: tracked ? "var(--green)" : "#fff",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: tracked ? "default" : "pointer",
            }}
          >
            {tracked ? "✓ Tracked" : "＋ Track Meal"}
          </motion.button>
        </motion.div>

        {/* Daily Progress */}
        <ScrollReveal delay={0.1} style={{ marginTop: 16 }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--cream-dim)",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              Daily Progress
            </p>
            {[
              { label: "Calories", key: "cal", color: "var(--gold)", unit: "" },
              { label: "Protein", key: "protein", color: "var(--green)", unit: "g" },
              { label: "Carbs", key: "carbs", color: "var(--cream-dim)", unit: "g" },
              { label: "Fat", key: "fat", color: "var(--orange)", unit: "g" },
            ].map(({ label, key, color, unit }) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "var(--cream-dim)" }}>{label}</span>
                  <span style={{ color, fontWeight: 600 }}>
                    {dailyTotals[key]}{unit} / {goals[key]}{unit}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "var(--surface3)",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress[key]}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      borderRadius: 3,
                      background: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
        </>
      )}

      {/* Meal History */}
      {history.length > 1 && (
        <ScrollReveal delay={0.2} style={{ marginTop: 32 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--cream)",
              marginBottom: 12,
            }}
          >
            Past Meals
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.slice(1, 6).map((entry) => (
              <div
                key={entry.id}
                style={{
                  padding: "10px 14px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "var(--cream-dim)", fontSize: 11 }}>{entry.date}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 600, fontSize: 12 }}>
                    {entry.totals.cal} cal
                  </span>
                </div>
                <span style={{ color: "var(--cream)" }}>
                  {entry.items.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Meal Comparison */}
      {history.length >= 2 && <MealComparison history={history} />}

      {/* Retry button */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", marginTop: 16 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => analyze(selectedItems)}
            style={{
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
            Retry Analysis
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
