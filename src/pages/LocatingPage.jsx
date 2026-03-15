import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring } from "../components/animations"
import LocationPin from "../components/LocationPin"
import { useLocation } from "../hooks/useLocation"

export default function LocatingPage() {
  const navigate = useNavigate()
  const { status, restaurants, error } = useLocation()

  useEffect(() => {
    if (status === "located" || status === "denied" || status === "error") {
      // Store restaurants for HomePage to pick up
      if (restaurants.length > 0) {
        sessionStorage.setItem("nutriq_restaurants", JSON.stringify(restaurants))
      }
      if (error) {
        sessionStorage.setItem("nutriq_location_error", error)
      }
      sessionStorage.setItem("nutriq_location_status", status)
      navigate("/", { replace: true })
    }
  }, [status, restaurants, error, navigate])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: 24,
      }}
    >
      <LocationPin />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.standard, delay: 0.3 }}
        style={{ textAlign: "center" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--cream)",
            marginBottom: 10,
          }}
        >
          Finding restaurants nearby
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--cream-dim)",
          }}
        >
          Scanning your area for the best options...
        </p>
      </motion.div>

      {/* Pulsing dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 0.15, 0.3].map((delay) => (
          <motion.div
            key={delay}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--red)",
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{
              duration: 1.2,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
