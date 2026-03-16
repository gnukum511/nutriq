import { useState } from "react"
import CuisineIcon from "./CuisineIcon"

/**
 * Tries to load a restaurant's favicon from its website URL.
 * Falls back to SVG cuisine icon if no website or image fails to load.
 */
export default function RestaurantLogo({ website, cuisine, size = 48 }) {
  const [failed, setFailed] = useState(false)

  const faviconUrl = !failed && website ? getFaviconUrl(website) : null

  if (faviconUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 12,
        background: "var(--surface2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, overflow: "hidden",
      }}>
        <img
          src={faviconUrl}
          alt=""
          onError={() => setFailed(true)}
          style={{
            width: size - 8, height: size - 8,
            objectFit: "contain",
          }}
        />
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: "var(--surface2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <CuisineIcon cuisine={cuisine} size={Math.round(size * 0.5)} color="var(--cream-dim)" />
    </div>
  )
}

function getFaviconUrl(website) {
  try {
    const url = new URL(website.startsWith("http") ? website : `https://${website}`)
    // Use Google's favicon service — reliable, cached, works for most domains
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
  } catch {
    return null
  }
}
