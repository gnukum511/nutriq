import { useEffect, useState, lazy, Suspense } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { PageTransition, Skeleton } from "./components/animations"
import Header from "./components/Header"
import SidePanel from "./components/SidePanel"
import Onboarding from "./components/Onboarding"
import { useTheme } from "./hooks/useTheme"
import Footer from "./components/Footer"
import ErrorBoundary from "./components/ErrorBoundary"
import LocatingPage from "./pages/LocatingPage"

const HomePage = lazy(() => import("./pages/HomePage"))
const MenuPage = lazy(() => import("./pages/MenuPage"))
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"))

const TITLES = {
  "/locating": "Finding Restaurants — NUTRÏQ",
  "/": "NUTRÏQ — Eat Smarter",
  "/analysis": "Meal Analysis — NUTRÏQ",
}

function PageLoader() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 16px" }}>
      <Skeleton width="50%" height={28} style={{ marginBottom: 16 }} />
      <Skeleton width="80%" height={14} style={{ marginBottom: 24 }} />
      <Skeleton height={80} style={{ marginBottom: 10 }} />
      <Skeleton height={80} style={{ marginBottom: 10 }} />
      <Skeleton height={80} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const [sideOpen, setSideOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("nutriq_onboarded")
  )
  const isLocating = location.pathname === "/locating"

  useEffect(() => {
    const path = location.pathname
    document.title = TITLES[path] || (path.startsWith("/menu") ? "Menu — NUTRÏQ" : "NUTRÏQ")
  }, [location.pathname])

  // Close side panel on route change
  useEffect(() => {
    setSideOpen(false)
  }, [location.pathname])

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <ErrorBoundary>
      {!isLocating && (
        <Header onMenuToggle={() => setSideOpen(true)} theme={theme} onThemeToggle={toggleTheme} />
      )}
      <SidePanel open={sideOpen} onClose={() => setSideOpen(false)} />
      <AnimatePresence mode="wait">
        <PageTransition routeKey={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/locating" element={<LocatingPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/menu/:id" element={<MenuPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </AnimatePresence>
      {!isLocating && <Footer />}
    </ErrorBoundary>
  )
}
