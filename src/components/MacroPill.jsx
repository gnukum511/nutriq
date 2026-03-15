import { motion } from "framer-motion"
import { fadeInItem } from "./animations"

const MACRO_CONFIG = {
  cal:     { label: "cal", color: "var(--gold)", bg: "var(--gold-dim)" },
  protein: { label: "g protein", color: "var(--green)", bg: "var(--green-dim)" },
  carbs:   { label: "g carbs", color: "var(--cream-dim)", bg: "rgba(255,255,255,0.05)" },
  fat:     { label: "g fat", color: "var(--orange)", bg: "var(--orange-dim)" },
}

export default function MacroPill({ type, value }) {
  const config = MACRO_CONFIG[type]
  if (!config) return null

  return (
    <motion.span
      variants={fadeInItem}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 8,
        background: config.bg,
        color: config.color,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        whiteSpace: "nowrap",
      }}
    >
      {type === "cal" ? value : value}
      <span style={{ opacity: 0.75, fontWeight: 500 }}>{config.label}</span>
    </motion.span>
  )
}
