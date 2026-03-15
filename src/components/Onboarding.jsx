import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { spring } from "./animations"

const SLIDES = [
  {
    emoji: "📍",
    title: "Find Restaurants Near You",
    desc: "NUTRÏQ uses your location to discover restaurants within 5 miles — powered by OpenStreetMap.",
    color: "var(--red)",
  },
  {
    emoji: "🤖",
    title: "AI-Generated Menus",
    desc: "Tap any restaurant and our AI instantly generates a full menu with calories, protein, carbs, and fat for every dish.",
    color: "var(--gold)",
  },
  {
    emoji: "🥗",
    title: "Filter by Diet",
    desc: "Keto, Vegan, Gluten-Free, High Protein — find exactly what fits your lifestyle with one tap.",
    color: "var(--green)",
  },
  {
    emoji: "📊",
    title: "Track & Analyze",
    desc: "Select your meal and get instant AI coaching. Track daily nutrition goals and review past meals.",
    color: "var(--orange)",
  },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
}

export default function Onboarding({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  const goNext = () => {
    if (isLast) {
      localStorage.setItem("nutriq_onboarded", "true")
      onComplete()
    } else {
      setDirection(1)
      setCurrent((p) => p + 1)
    }
  }

  const goBack = () => {
    if (current > 0) {
      setDirection(-1)
      setCurrent((p) => p - 1)
    }
  }

  const skip = () => {
    localStorage.setItem("nutriq_onboarded", "true")
    onComplete()
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "var(--charcoal)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Skip */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={spring.snappy}
        onClick={skip}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          color: "var(--cream-dim)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Skip
      </motion.button>

      {/* Logo */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 800,
          color: "var(--cream)",
          marginBottom: 48,
          letterSpacing: -0.5,
        }}
      >
        NUTR<span style={{ color: "var(--red)" }}>Ï</span>Q
      </motion.p>

      {/* Slide content */}
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center", minHeight: 220 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={spring.standard}
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={spring.bouncy}
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: `${slide.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 20px",
              }}
            >
              {slide.emoji}
            </motion.div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--cream)",
                marginBottom: 10,
              }}
            >
              {slide.title}
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--cream-dim)",
                lineHeight: 1.6,
                maxWidth: 300,
                margin: "0 auto",
              }}
            >
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 8, margin: "32px 0" }}>
        {SLIDES.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === current ? 24 : 8,
              background: i === current ? "var(--red)" : "var(--border)",
            }}
            transition={{ duration: 0.2 }}
            style={{
              height: 8,
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => {
              setDirection(i > current ? 1 : -1)
              setCurrent(i)
            }}
          />
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 360 }}>
        {current > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={goBack}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--cream-dim)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Back
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring.snappy}
          onClick={goNext}
          style={{
            flex: current > 0 ? 1 : "1 1 100%",
            padding: "12px 0",
            borderRadius: 12,
            border: "none",
            background: "var(--red)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(217,20,41,0.15)",
          }}
        >
          {isLast ? "Get Started" : "Next"}
        </motion.button>
      </div>
    </div>
  )
}
