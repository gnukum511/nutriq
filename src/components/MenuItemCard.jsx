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
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      onClick={() => onToggle(item)}
      style={{
        background: selected ? "var(--primary-soft)" : "var(--card)",
        border: `1.5px solid ${selected ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 20,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        gap: 12,
        boxShadow: selected ? "var(--shadow-glow)" : "var(--shadow-soft)",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow var(--transition-smooth)",
      }}
    >
      {/* Selected indicator bar */}
      {selected && (
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0, width: 4,
          background: "var(--gradient-leaf)",
          borderRadius: "20px 0 0 20px",
        }} />
      )}

      {/* Score ring */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <ScoreRing score={item.score} size={44} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
          <h4 style={{
            fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500,
            letterSpacing: -0.2,
            color: "var(--foreground)", flex: 1, minWidth: 0,
          }}>
            {item.name}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8, flexShrink: 0 }}>
            <span style={{
              color: "var(--accent-foreground)", fontSize: 14, fontWeight: 700,
              fontFamily: "var(--font-display)", letterSpacing: -0.3,
              whiteSpace: "nowrap",
            }}>
              ${item.price.toFixed(2)}
            </span>
            {/* Checkbox indicator */}
            <span style={{
              width: 22, height: 22, borderRadius: 8,
              border: `1.5px solid ${selected ? "var(--primary)" : "var(--border)"}`,
              background: selected ? "var(--primary)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {selected && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="var(--primary-foreground)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </div>
        </div>

        <p style={{
          fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-body)",
          marginBottom: 8, lineHeight: 1.45,
        }}>
          {item.desc}
        </p>

        {/* Macro pills */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
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
                  padding: "2px 10px", borderRadius: 999,
                  background: "color-mix(in oklch, var(--leaf) 14%, transparent)",
                  color: "var(--primary)",
                  border: "1px solid color-mix(in oklch, var(--primary) 18%, transparent)",
                  fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
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
