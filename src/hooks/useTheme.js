import { useState, useEffect, useCallback } from "react"

const LIGHT = {
  "--red": "#D91429",
  "--red-glow": "rgba(217,20,41,0.12)",
  "--gold": "#C99400",
  "--gold-dim": "rgba(201,148,0,0.1)",
  "--orange": "#E8581F",
  "--orange-dim": "rgba(232,88,31,0.1)",
  "--green": "#1BA34D",
  "--green-dim": "rgba(27,163,77,0.08)",
  "--charcoal": "#FAFAF8",
  "--surface": "#FFFFFF",
  "--surface2": "#F5F4F1",
  "--surface3": "#ECEAE6",
  "--border": "rgba(0,0,0,0.08)",
  "--cream": "#1A1A1A",
  "--cream-dim": "rgba(26,26,26,0.55)",
  "--muted": "rgba(26,26,26,0.3)",
}

const DARK = {
  "--red": "#E8192C",
  "--red-glow": "rgba(232,25,44,0.25)",
  "--gold": "#F5B800",
  "--gold-dim": "rgba(245,184,0,0.15)",
  "--orange": "#FF6B2B",
  "--orange-dim": "rgba(255,107,43,0.15)",
  "--green": "#22C55E",
  "--green-dim": "rgba(34,197,94,0.12)",
  "--charcoal": "#0E0E0F",
  "--surface": "#161618",
  "--surface2": "#1E1E21",
  "--surface3": "#252528",
  "--border": "rgba(255,255,255,0.07)",
  "--cream": "#F5EDD8",
  "--cream-dim": "rgba(245,237,216,0.55)",
  "--muted": "rgba(245,237,216,0.28)",
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("nutriq_theme") || "light"
  })

  const applyTheme = useCallback((t) => {
    const tokens = t === "dark" ? DARK : LIGHT
    const root = document.documentElement
    for (const [key, val] of Object.entries(tokens)) {
      root.style.setProperty(key, val)
    }
    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = tokens["--charcoal"]
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      localStorage.setItem("nutriq_theme", next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
