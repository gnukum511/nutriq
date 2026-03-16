import { motion } from "framer-motion"
import { spring } from "./animations"

function encodeSearch(name) {
  return encodeURIComponent(name.replace(/[^\w\s]/g, "").trim())
}

const SERVICES = [
  {
    id: "doordash",
    label: "DoorDash",
    color: "#FF3008",
    url: (name) => `https://www.doordash.com/search/store/${encodeSearch(name)}/`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.07 4.93C21.35 3.21 18.87 2 15.75 2H2.54C1.13 2 .43 3.71 1.43 4.71L8.2 11.49c.33.33.33.87 0 1.21l-6.77 6.77c-1 1-.29 2.71 1.11 2.71h13.21c3.12 0 5.6-1.21 7.32-2.93 3.24-3.24 3.24-11.08 0-14.32zm-2.12 12.2c-1.27 1.27-3.13 2.05-5.2 2.05H7.41l4.65-4.65c1.17-1.17 1.17-3.07 0-4.24L7.41 5.64h8.34c2.07 0 3.93.78 5.2 2.05 2.34 2.34 2.34 7.1 0 9.44z"/>
      </svg>
    ),
  },
  {
    id: "ubereats",
    label: "Uber Eats",
    color: "#06C167",
    url: (name) => `https://www.ubereats.com/search?q=${encodeSearch(name)}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6zm4.8-12H13.2V6h-2.4v3.6H7.2v2.4h3.6V15.6h2.4V12h3.6V9.6z"/>
      </svg>
    ),
  },
]

/**
 * Delivery service links — DoorDash + Uber Eats
 * @param {string} name — restaurant name for search query
 * @param {"pill"|"compact"} variant — pill for cards, compact for menu header
 */
export default function DeliveryLinks({ name, variant = "pill" }) {
  if (!name) return null

  if (variant === "compact") {
    return (
      <div style={{ display: "flex", gap: 6 }}>
        {SERVICES.map((svc) => (
          <motion.a
            key={svc.id}
            href={svc.url(name)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={spring.snappy}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 10px", borderRadius: 6,
              background: "rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
              fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
              textDecoration: "none",
            }}
          >
            {svc.icon}
            {svc.label}
          </motion.a>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
      {SERVICES.map((svc) => (
        <motion.a
          key={svc.id}
          href={svc.url(name)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={spring.snappy}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 6,
            background: "var(--surface2)",
            color: svc.color,
            fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
            textDecoration: "none",
            border: "1px solid var(--border)",
          }}
        >
          {svc.icon}
          {svc.label}
        </motion.a>
      ))}
    </div>
  )
}
