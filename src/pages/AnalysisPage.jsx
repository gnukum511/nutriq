import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring, fadeUpItem, StaggerList, ScrollReveal } from "../components/animations"
import { useAnalysis } from "../hooks/useAnalysis"
import MacroPill from "../components/MacroPill"
import AIAnalysisPanel from "../components/AIAnalysisPanel"

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { analysis, loading, error, analyze } = useAnalysis()

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

  useEffect(() => {
    if (selectedItems.length > 0 && !analysis && !loading) {
      analyze(selectedItems)
    }
  }, [selectedItems, analysis, loading, analyze])

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
