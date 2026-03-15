import { motion } from "framer-motion"
import { filterPillVariants, spring, staggerContainerFast } from "./animations"
import { FILTERS } from "../hooks/useFilters"

export default function FilterPills({ activeFilter, onToggle, counts }) {
  return (
    <motion.div
      variants={staggerContainerFast}
      initial="hidden"
      animate="show"
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.key
        return (
          <motion.button
            key={f.key}
            data-filter={f.key}
            variants={filterPillVariants}
            animate={isActive ? "active" : "inactive"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={spring.bouncy}
            onClick={() => onToggle(f.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 20,
              border: `1px solid ${isActive ? "var(--red)" : "var(--border)"}`,
              background: isActive ? "var(--red-glow)" : "var(--surface)",
              color: isActive ? "var(--red)" : "var(--cream-dim)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
            {counts && (
              <span
                style={{
                  fontSize: 11,
                  opacity: 0.6,
                  marginLeft: 2,
                }}
              >
                {counts[f.key]}
              </span>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
