/**
 * NUTRÏQ — Overpass API (OpenStreetMap) for nearby restaurants
 */

const OVERPASS_URLS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]

/**
 * Haversine distance between two lat/lng points in km
 */
export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Build a bounding box from center + radius (faster than "around" for large areas)
 */
function bbox(lat, lon, radiusKm) {
  const dLat = radiusKm / 111.32
  const dLon = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  return `${lat - dLat},${lon - dLon},${lat + dLat},${lon + dLon}`
}

/**
 * Fetch nearby restaurants from Overpass API
 * Uses bounding box instead of "around" for faster queries at large radii.
 * @param {number} lat - User latitude
 * @param {number} lon - User longitude
 * @param {number} radiusKm - Search radius in km (default 8.05 = 5 miles)
 * @returns {Promise<Array>} Array of restaurant objects
 */
export async function fetchNearbyRestaurants(lat, lon, radiusKm = 8.05) {
  const bb = bbox(lat, lon, radiusKm)
  const query = `
    [out:json][timeout:25];
    (
      nwr["amenity"~"^(restaurant|fast_food|cafe)$"](${bb});
    );
    out center body qt;
  `

  let data
  for (const url of OVERPASS_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      })
      if (!res.ok) continue
      data = await res.json()
      break
    } catch {
      continue
    }
  }

  if (!data) throw new Error("All Overpass servers unavailable. Please try again.")

  return data.elements
    .filter((el) => el.tags?.name)
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat
      const elLon = el.lon ?? el.center?.lon
      if (!elLat || !elLon) return null
      const dist = haversine(lat, lon, elLat, elLon)
      return {
        id: String(el.id),
        name: el.tags.name,
        cuisine: el.tags.cuisine || "restaurant",
        lat: elLat,
        lon: elLon,
        distance: Math.round(dist * 100) / 100,
        phone: el.tags.phone || null,
        website: el.tags.website || null,
        openingHours: el.tags.opening_hours || null,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
}
