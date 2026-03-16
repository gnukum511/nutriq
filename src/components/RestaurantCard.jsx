import { motion } from "framer-motion"
import { restaurantCardVariants, spring } from "./animations"
import { formatDistance } from "../lib/health"
import CuisineIcon from "./CuisineIcon"

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
              fill="var(--red)" />
          )}
          {type === "half" && (
            <>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="var(--surface3)" />
              <path d="M12 2v15.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="var(--red)" />
            </>
          )}
          {type === "empty" && (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill="var(--surface3)" />
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
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        overflow: "hidden",
      }}
    >
      {/* Top color band with cuisine emoji */}
      <div
        style={{
          height: 6,
          background: `linear-gradient(90deg, var(--red), var(--orange))`,
          borderRadius: "14px 14px 0 0",
        }}
      />

      <div style={{ padding: "14px 16px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Cuisine icon */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--surface2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CuisineIcon cuisine={restaurant.cuisine} size={24} color="var(--cream-dim)" />
        </div>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--cream)",
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
                padding: "3px 8px",
                borderRadius: 6,
                background: "var(--surface2)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                color: "var(--cream-dim)",
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
                padding: "3px 8px",
                borderRadius: 6,
                background: "var(--orange-dim)",
                color: "var(--orange)",
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
                padding: "3px 8px",
                borderRadius: 6,
                background: isOpen ? "var(--green-dim)" : "rgba(217,20,41,0.06)",
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                color: isOpen ? "var(--green)" : "var(--red)",
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: isOpen ? "var(--green)" : "var(--red)",
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
        </div>
      </div>
    </motion.div>
  )
}
