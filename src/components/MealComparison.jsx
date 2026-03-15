import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { spring, ScrollReveal } from "./animations"

export default function MealComparison({ history }) {
  const [slotA, setSlotA] = useState(null)
  const [slotB, setSlotB] = useState(null)

  if (!history || history.length < 2) return null

  const mealA = history.find((h) => h.id === slotA)
  const mealB = history.find((h) => h.id === slotB)

  const metrics = useMemo(() => {
    if (!mealA || !mealB) return null
    return ["cal", "protein", "carbs", "fat"].map((key) => {
      const a = mealA.totals[key]
      const b = mealB.totals[key]
      const diff = a - b
      return { key, a, b, diff }
    })
  }, [mealA, mealB])

  const labels = { cal: "Calories", protein: "Protein", carbs: "Carbs", fat: "Fat" }
  const units = { cal: "", protein: "g", carbs: "g", fat: "g" }
  const colors = { cal: "var(--gold)", protein: "var(--green)", carbs: "var(--cream-dim)", fat: "var(--orange)" }

  return (
    <ScrollReveal delay={0.2} style={{ marginTop: 28 }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--cream)",
          marginBottom: 12,
        }}
      >
        Compare Meals
      </h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <MealSelect
          label="Meal A"
          value={slotA}
          onChange={setSlotA}
          history={history}
          excludeId={slotB}
        />
        <MealSelect
          label="Meal B"
          value={slotB}
          onChange={setSlotB}
          history={history}
          excludeId={slotA}
        />
      </div>

      <AnimatePresence>
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={spring.standard}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 60px 1fr",
                gap: 8,
                marginBottom: 12,
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              <span />
              <span style={{ textAlign: "right" }}>Meal A</span>
              <span style={{ textAlign: "center" }}>vs</span>
              <span>Meal B</span>
            </div>

            {/* Metric rows */}
            {metrics.map(({ key, a, b, diff }) => (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 60px 1fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 0",
                  borderTop: "1px solid var(--border)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                }}
              >
                <span style={{ color: "var(--cream-dim)", fontWeight: 600 }}>
                  {labels[key]}
                </span>
                <span style={{ textAlign: "right", color: colors[key], fontWeight: 700 }}>
                  {a}{units[key]}
                </span>
                <span
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: key === "cal" || key === "fat"
                      ? (diff > 0 ? "var(--red)" : "var(--green)")
                      : (diff < 0 ? "var(--red)" : "var(--green)"),
                  }}
                >
                  {diff > 0 ? "+" : ""}{diff}{units[key]}
                </span>
                <span style={{ color: colors[key], fontWeight: 700 }}>
                  {b}{units[key]}
                </span>
              </div>
            ))}

            {/* Verdict */}
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                borderRadius: 8,
                background: "var(--green-dim)",
                fontSize: 12,
                fontFamily: "var(--font-body)",
                color: "var(--green)",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {mealA.totals.cal < mealB.totals.cal
                ? `Meal A is ${mealB.totals.cal - mealA.totals.cal} cal lighter`
                : mealA.totals.cal > mealB.totals.cal
                ? `Meal B is ${mealA.totals.cal - mealB.totals.cal} cal lighter`
                : "Both meals have equal calories"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollReveal>
  )
}

function MealSelect({ label, value, onChange, history, excludeId }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      style={{
        flex: 1,
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--cream)",
        fontSize: 12,
        fontFamily: "var(--font-body)",
        cursor: "pointer",
        outline: "none",
      }}
    >
      <option value="">{label}...</option>
      {history
        .filter((h) => h.id !== excludeId)
        .map((h) => (
          <option key={h.id} value={h.id}>
            {h.date} — {h.totals.cal} cal
          </option>
        ))}
    </select>
  )
}
