import { motion } from "framer-motion"
import { spring } from "./animations"

export default function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        overflowX: "auto",
        paddingBottom: 4,
        scrollbarWidth: "none",
      }}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat
        return (
          <motion.button
            key={cat}
            data-cat={cat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={() => onSelect(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: 12,
              border: `1px solid ${isActive ? "var(--red)" : "var(--border)"}`,
              background: isActive ? "var(--red)" : "var(--surface)",
              color: isActive ? "#fff" : "var(--cream-dim)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              outline: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {cat}
          </motion.button>
        )
      })}
    </div>
  )
}
