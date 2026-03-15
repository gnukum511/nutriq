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
          background: "rgba(255,255,255,0.95)",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Summary */}
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
          <span style={{ color: "var(--cream)", fontWeight: 700 }}>
            {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}
          </span>
          <span style={{ color: "var(--cream-dim)", margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>{totalCal} cal</span>
          <span style={{ color: "var(--cream-dim)", margin: "0 8px" }}>·</span>
          <span style={{ color: "var(--green)", fontWeight: 600 }}>{totalProtein}g protein</span>
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
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--cream-dim)",
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
              borderRadius: 10,
              border: "none",
              background: "var(--red)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(217,20,41,0.15)",
            }}
          >
            Analyze Meal
          </motion.button>
        </div>
      </div>
    </SelectionBarMotion>
  )
}
