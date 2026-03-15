import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { motion } from "framer-motion"
import { spring } from "./animations"

// Fix default marker icon (Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Custom red marker for user location
const userIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;background:#D91429;border:3px solid #fff;border-radius:50%;box-shadow:0 0 8px rgba(217,20,41,0.4)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

// Custom pin drop marker for restaurants
const restaurantIcon = new L.DivIcon({
  className: "",
  html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="#D91429"/>
    <circle cx="14" cy="13" r="6" fill="#fff"/>
    <text x="14" y="16" text-anchor="middle" font-size="10" fill="#D91429">🍽</text>
  </svg>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
})

function FitBounds({ restaurants, userCoords }) {
  const map = useMap()
  useEffect(() => {
    if (restaurants.length === 0) return
    const points = restaurants.map((r) => [r.lat, r.lon])
    if (userCoords) points.push([userCoords.lat, userCoords.lon])
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 })
  }, [restaurants, userCoords, map])
  return null
}

export default function RestaurantMap({ restaurants, userCoords, onSelect }) {
  const center = userCoords
    ? [userCoords.lat, userCoords.lon]
    : restaurants.length > 0
    ? [restaurants[0].lat, restaurants[0].lon]
    : [40.7128, -74.006]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.standard}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        height: 380,
      }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds restaurants={restaurants} userCoords={userCoords} />

        {/* User location */}
        {userCoords && (
          <Marker position={[userCoords.lat, userCoords.lon]} icon={userIcon}>
            <Popup>
              <span style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 13, fontWeight: 600 }}>
                You are here
              </span>
            </Popup>
          </Marker>
        )}

        {/* Restaurants */}
        {restaurants.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lon]}
            icon={restaurantIcon}
            eventHandlers={{
              click: () => onSelect(r),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                <strong style={{ fontSize: 14 }}>{r.emoji} {r.name}</strong>
                <br />
                <span style={{ fontSize: 12, color: "#666" }}>{r.cuisineLabel}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
