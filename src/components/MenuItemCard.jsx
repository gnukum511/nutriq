import { motion } from "framer-motion"
import { menuItemVariants, spring } from "./animations"
import MacroPill from "./MacroPill"
import ScoreRing from "./ScoreRing"

export default function MenuItemCard({ item, index, selected, onToggle }) {
  return (
    <motion.div
      data-testid="menu-item"
      custom={index}
      variants={menuItemVariants}
      initial="hidden"
      animate="show"
      whileHover={{ scale: 1.01, borderColor: "rgba(217,20,41,0.25)" }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={() => onToggle(item)}
      style={{
        background: selected ? "var(--surface2)" : "var(--surface)",
        border: `1px solid ${selected ? "var(--red)" : "var(--border)"}`,
        borderRadius: 14,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        gap: 12,
        boxShadow: selected
          ? "0 0 16px var(--red-glow), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
      }}
    >
      {/* Score ring */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <ScoreRing score={item.score} size={44} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}
        >
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--cream)",
            }}
          >
            {item.name}
          </h4>
          <span
            style={{
              color: "var(--gold)",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              whiteSpace: "nowrap",
              marginLeft: 8,
            }}
          >
            ${item.price.toFixed(2)}
          </span>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--cream-dim)",
            fontFamily: "var(--font-body)",
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          {item.desc}
        </p>

        {/* Macro pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <MacroPill type="cal" value={item.cal} />
          <MacroPill type="protein" value={item.protein} />
          <MacroPill type="carbs" value={item.carbs} />
          <MacroPill type="fat" value={item.fat} />
        </div>

        {/* Dietary tags */}
        {item.tags && item.tags.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "var(--green-dim)",
                  color: "var(--green)",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
