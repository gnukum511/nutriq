/**
 * NUTRÏQ — Framer Motion Animation System
 * All animation logic lives here. Zero CSS transitions anywhere in the app.
 */

import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef } from "react"

// ─── SPRING CONFIGS ──────────────────────────────────────────────────────────
export const spring = {
  standard: { type: "spring", stiffness: 300, damping: 24 },
  bouncy:   { type: "spring", stiffness: 420, damping: 20 },
  slow:     { type: "spring", stiffness: 180, damping: 28 },
  snappy:   { type: "spring", stiffness: 500, damping: 30 },
}

// ─── STAGGER CONTAINER VARIANTS ──────────────────────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
}

// ─── CHILD ITEM VARIANTS ─────────────────────────────────────────────────────
export const fadeUpItem = {
  hidden: { y: 22, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: spring.standard },
}

export const fadeUpItemSlow = {
  hidden: { y: 30, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: spring.slow },
}

export const fadeInItem = {
  hidden: { opacity: 0, scale: 0.96 },
  show:   { opacity: 1, scale: 1, transition: spring.standard },
}

// ─── PAGE TRANSITION VARIANTS ────────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: spring.standard },
  exit:    { opacity: 0, x: -24, transition: { duration: 0.18 } },
}

export const pageVariantsUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: spring.standard },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.15 } },
}

// ─── STAGGERED LIST WRAPPER ───────────────────────────────────────────────────
/**
 * Wrap any list to stagger children on mount.
 * Usage: <StaggerList>{items.map(i => <motion.div variants={fadeUpItem}>...)}</StaggerList>
 */
export function StaggerList({ children, className, style, fast = false }) {
  return (
    <motion.div
      variants={fast ? staggerContainerFast : staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ─── SCROLL-TRIGGERED SECTION ─────────────────────────────────────────────────
/**
 * Each section animates in when it enters the viewport.
 * Usage: <ScrollReveal><YourContent /></ScrollReveal>
 */
export function ScrollReveal({ children, delay = 0, style, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ ...spring.standard, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── PARALLAX CARD ────────────────────────────────────────────────────────────
export function ParallaxCard({ children, amount = 40, style }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount])

  return (
    <motion.div ref={ref} style={{ y, ...style }}>
      {children}
    </motion.div>
  )
}

// ─── PRESSABLE BUTTON ─────────────────────────────────────────────────────────
/**
 * Wrap any button/card to get press feedback + hover lift.
 * Usage: <Pressable onClick={fn}><button>Order Now</button></Pressable>
 */
export function Pressable({ children, onClick, style, className, disabled }) {
  return (
    <motion.div
      onClick={disabled ? undefined : onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={spring.snappy}
      style={{ cursor: disabled ? "default" : "pointer", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── RESTAURANT CARD ANIMATION ────────────────────────────────────────────────
export const restaurantCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...spring.standard, delay: i * 0.07 },
  }),
  hover: {
    y: -3,
    boxShadow: "0 12px 36px rgba(217,20,41,0.12)",
    borderColor: "rgba(217,20,41,0.3)",
    transition: spring.snappy,
  },
  tap: { scale: 0.98, transition: spring.snappy },
}

// ─── MENU ITEM CARD ANIMATION ─────────────────────────────────────────────────
export const menuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: (i) => ({
    opacity: 1, x: 0,
    transition: { ...spring.standard, delay: i * 0.05 },
  }),
}

// ─── FILTER PILL ANIMATION ────────────────────────────────────────────────────
export const filterPillVariants = {
  inactive: { scale: 1, boxShadow: "none" },
  active: {
    scale: 1.04,
    boxShadow: "0 0 14px rgba(217,20,41,0.2)",
    transition: spring.bouncy,
  },
}

// ─── SCORE RING DRAW ANIMATION ────────────────────────────────────────────────
/**
 * Animated SVG health score ring — draws stroke from 0 to score on mount.
 */
export function AnimatedScoreRing({ score, size = 42 }) {
  const color = score >= 75 ? "#1BA34D" : score >= 50 ? "#C99400" : "#D91429"
  const r = size / 2 - 4
  const circ = 2 * Math.PI * r
  const targetDash = (score / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(0,0,0,0.08)" strokeWidth={3.5} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={3.5} strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${targetDash} ${circ - targetDash}` }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{
          fill: color, fontSize: size * 0.22, fontWeight: 800,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          transform: "rotate(90deg)", transformOrigin: "50% 50%"
        }}>
        {score}
      </text>
    </svg>
  )
}

// ─── RADAR PING (LOCATING SCREEN) ─────────────────────────────────────────────
export function RadarPing({ color = "#D91429" }) {
  return (
    <div style={{ position: "relative", width: 72, height: 72 }}>
      {[0, 0.4, 0.8].map(delay => (
        <motion.div
          key={delay}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: `2px solid ${color}`,
          }}
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <motion.div
        style={{
          position: "relative", width: 72, height: 72, borderRadius: "50%",
          background: color, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 30,
          boxShadow: `0 0 28px rgba(217,20,41,0.3)`,
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        📍
      </motion.div>
    </div>
  )
}

// ─── SELECTION BAR SLIDE UP ───────────────────────────────────────────────────
export function SelectionBarMotion({ visible, children }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={spring.bouncy}
          style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── PAGE TRANSITION WRAPPER ─────────────────────────────────────────────────
export function PageTransition({ children, routeKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ─── WORD-BY-WORD TITLE REVEAL ────────────────────────────────────────────────
/**
 * Splits text into words, staggers their entrance with spring drops.
 * Usage: <WordReveal text="Eat What You Crave." />
 */
export function WordReveal({ text, style, className, color }) {
  const words = text.split(" ")
  return (
    <motion.span
      style={{ display: "flex", flexWrap: "wrap", gap: "0.25em", ...style }}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={fadeUpItem}
          style={{ display: "inline-block", color }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ─── NUMBER COUNT UP ──────────────────────────────────────────────────────────
/**
 * Animates a number counting up to its value on mount.
 * Usage: <CountUp value={380} suffix=" cal" />
 */
export function CountUp({ value, suffix = "", prefix = "", style }) {
  return (
    <motion.span
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  )
}

// ─── SKELETON PULSE ───────────────────────────────────────────────────────────
export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }) {
  return (
    <motion.div
      style={{
        width, height, borderRadius,
        background: "rgba(0,0,0,0.05)",
        ...style,
      }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export function SkeletonCard({ style }) {
  return (
    <motion.div
      style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, padding: 18,
        display: "flex", flexDirection: "column", gap: 10,
        ...style,
      }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <Skeleton height={20} width="60%" borderRadius={6} />
      <Skeleton height={13} width="40%" borderRadius={6} />
      <Skeleton height={13} width="80%" borderRadius={6} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        {[50, 56, 52, 48].map((w, i) => (
          <Skeleton key={i} height={38} width={w} borderRadius={8} />
        ))}
      </div>
    </motion.div>
  )
}
