import { motion } from "framer-motion"
import { restaurantCardVariants, spring } from "./animations"
import { formatDistance } from "../lib/health"

export default function RestaurantCard({ restaurant, index, onClick }) {
  return (
    <motion.div
      data-testid="restaurant-card"
      custom={index}
      variants={restaurantCardVariants}
      initial="hidden"
      animate="show"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onClick(restaurant)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 18,
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Cuisine emoji */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "var(--surface2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {restaurant.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--cream)",
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {restaurant.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--cream-dim)",
          }}
        >
          {restaurant.cuisineLabel}
          {restaurant.phone && (
            <span style={{ color: "var(--muted)", marginLeft: 6 }}>· {restaurant.phone}</span>
          )}
        </p>
      </div>

      {/* Distance badge */}
      <motion.span
        style={{
          padding: "4px 10px",
          borderRadius: 8,
          background: "var(--orange-dim)",
          color: "var(--orange)",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font-body)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        transition={spring.snappy}
      >
        {formatDistance(restaurant.distance)}
      </motion.span>
    </motion.div>
  )
}
