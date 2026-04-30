import { SelectionBarMotion, spring } from "./animations"
import { motion } from "framer-motion"

export default function SelectionBar({ selectedItems, onAnalyze, onClear }) {
  const visible = selectedItems.length > 0
  const totalCal = selectedItems.reduce((s, i) => s + i.cal, 0)
  const totalProtein = selectedItems.reduce((s, i) => s + i.protein, 0)

  return (
    <SelectionBarMotion visible={visible}>
      <div
        style={{
          background: "color-mix(in oklch, var(--card) 92%, transparent)",
          borderTop: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
        }}
      >
        {/* Summary */}
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
          <span style={{ color: "var(--foreground)", fontWeight: 700 }}>
            {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}
          </span>
          <span style={{ color: "var(--muted-foreground)", margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--accent-foreground)", fontWeight: 600 }}>{totalCal} cal</span>
          <span style={{ color: "var(--muted-foreground)", margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>{totalProtein}g protein</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={onClear}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--muted-foreground)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Clear
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={onAnalyze}
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              border: "none",
              background: "var(--gradient-leaf)",
              color: "var(--primary-foreground)",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            Analyze Meal
          </motion.button>
        </div>
      </div>
    </SelectionBarMotion>
  )
}
