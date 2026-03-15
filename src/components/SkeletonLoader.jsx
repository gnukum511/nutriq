import { motion } from "framer-motion"
import { SkeletonCard, staggerContainer } from "./animations"

export default function SkeletonLoader({ count = 4 }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </motion.div>
  )
}
