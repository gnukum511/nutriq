import { useState, useEffect, useCallback } from "react"

// Theme is driven by a `.dark` class on <html>; semantic tokens live in
// src/index.css under :root and .dark. This hook just toggles the class
// and persists the choice + updates the mobile theme-color meta.
const META_THEME = {
  light: "#F8F5EE", // warm cream paper — matches --background
  dark:  "#0E1A12", // deep botanical green — matches --background dark
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light"
    return localStorage.getItem("nutriq_theme") || "light"
  })

  const applyTheme = useCallback((t) => {
    const root = document.documentElement
    if (t === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = META_THEME[t] || META_THEME.light
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
