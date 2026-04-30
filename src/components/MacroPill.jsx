import { motion } from "framer-motion"
import { fadeInItem } from "./animations"

const MACRO_CONFIG = {
  cal: {
    label: "cal",
    color: "var(--accent-foreground)",
    bg: "color-mix(in oklch, var(--accent) 35%, transparent)",
  },
  protein: {
    label: "g protein",
    color: "var(--primary)",
    bg: "color-mix(in oklch, var(--leaf) 16%, transparent)",
  },
  carbs: {
    label: "g carbs",
    color: "var(--bark)",
    bg: "var(--secondary)",
  },
  fat: {
    label: "g fat",
    color: "var(--tomato)",
    bg: "color-mix(in oklch, var(--tomato) 12%, transparent)",
  },
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
        borderRadius: 999,
        background: config.bg,
        color: config.color,
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        whiteSpace: "nowrap",
      }}
    >
      {value}
      <span style={{ opacity: 0.75, fontWeight: 500 }}>{config.label}</span>
    </motion.span>
  )
}
