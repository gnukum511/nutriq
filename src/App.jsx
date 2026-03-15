import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { PageTransition } from "./components/animations"
import LocatingPage from "./pages/LocatingPage"
import HomePage from "./pages/HomePage"
import MenuPage from "./pages/MenuPage"
import AnalysisPage from "./pages/AnalysisPage"

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <PageTransition routeKey={location.pathname}>
        <Routes location={location}>
          <Route path="/locating" element={<LocatingPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/menu/:id" element={<MenuPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}
