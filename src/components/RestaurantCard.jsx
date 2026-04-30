import { motion } from "framer-motion"
import { restaurantCardVariants, spring } from "./animations"
import { formatDistance } from "../lib/health"
import RestaurantLogo from "./RestaurantLogo"
import DeliveryLinks from "./DeliveryLinks"

// Deterministic "rating" from restaurant name (consistent per restaurant)
function pseudoRating(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  return (3.5 + (Math.abs(hash) % 15) / 10).toFixed(1) // 3.5–5.0
}

function pseudoReviewCount(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 3) + name.charCodeAt(i)) | 0
  return 12 + (Math.abs(hash) % 388) // 12–399
}

function pseudoPriceTier(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) | 0
  return Math.abs(hash) % 3 + 1 // 1–3
}

function Stars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const stars = []

  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("full")
    else if (i === full && half) stars.push("half")
    else stars.push("empty")
  }

  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {stars.map((type, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none">
          {type === "full" && (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="var(--accent)" />
          )}
          {type === "half" && (
            <>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="var(--muted)" />
              <path d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="var(--accent)" />
            </>
          )}
          {type === "empty" && (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="var(--muted)" />
          )}
        </svg>
      ))}
    </span>
  )
}

export default function RestaurantCard({ restaurant, index, onClick, isFavorite, onToggleFavorite }) {
  const rating = parseFloat(pseudoRating(restaurant.name))
  const reviewCount = pseudoReviewCount(restaurant.name)
  const priceTier = pseudoPriceTier(restaurant.name)
  const isOpen = restaurant.name.length % 5 !== 0 // pseudo open/closed

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
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        cursor: "pointer",
        boxShadow: "var(--shadow-soft)",
        overflow: "hidden",
        transition: "box-shadow var(--transition-smooth)",
      }}
    >
      {/* Top color band */}
      <div
        style={{
          height: 4,
          background: "var(--gradient-leaf)",
          borderRadius: "24px 24px 0 0",
        }}
      />

      <div style={{ padding: "14px 16px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Restaurant logo or cuisine icon */}
        <RestaurantLogo website={restaurant.website} cuisine={restaurant.cuisine} size={48} />

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                fontWeight: 500,
                letterSpacing: -0.3,
                color: "var(--foreground)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
                minWidth: 0,
              }}
            >
              {restaurant.name}
            </h3>

            {/* Favorite heart */}
            {onToggleFavorite && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                transition={spring.snappy}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(restaurant)
                }}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  padding: 2,
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                {isFavorite ? "❤️" : "🤍"}
              </motion.button>
            )}
          </div>

          {/* Rating row: stars + count + price */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Stars rating={rating} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--cream-dim)",
                fontWeight: 500,
              }}
            >
              {rating}
            </span>
            <span style={{ color: "var(--muted)", fontSize: 11 }}>({reviewCount})</span>
            <span style={{ color: "var(--muted)", fontSize: 11, margin: "0 2px" }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                color: "var(--cream-dim)",
                fontWeight: 600,
              }}
            >
              {"$".repeat(priceTier)}
              <span style={{ color: "var(--muted)" }}>{"$".repeat(3 - priceTier)}</span>
            </span>
          </div>

          {/* Tags row: cuisine + distance + open status */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {/* Cuisine tag */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 10px",
                borderRadius: 999,
                background: "var(--secondary)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                color: "var(--secondary-foreground)",
              }}
            >
              {restaurant.cuisineLabel}
            </span>

            {/* Distance */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                padding: "3px 10px",
                borderRadius: 999,
                background: "color-mix(in oklch, var(--accent) 35%, transparent)",
                color: "var(--accent-foreground)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
              }}
            >
              📍 {formatDistance(restaurant.distance)}
            </span>

            {/* Open/Closed status */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 10px",
                borderRadius: 999,
                background: isOpen
                  ? "color-mix(in oklch, var(--leaf) 18%, transparent)"
                  : "color-mix(in oklch, var(--tomato) 12%, transparent)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                color: isOpen ? "var(--primary)" : "var(--tomato)",
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: isOpen ? "var(--leaf)" : "var(--tomato)",
              }} />
              {isOpen ? "Open" : "Closed"}
            </span>

            {/* Phone if available */}
            {restaurant.phone && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                · {restaurant.phone}
              </span>
            )}
          </div>

          {/* Delivery links */}
          <DeliveryLinks name={restaurant.name} variant="pill" />
        </div>
      </div>
    </motion.div>
  )
}
