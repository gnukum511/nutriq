import { motion } from "framer-motion"
import { spring, fadeUpItem, staggerContainer, Skeleton } from "./animations"

export default function AIAnalysisPanel({ analysis, loading, error, onClose }) {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 20 }}>
        <Skeleton width="40%" height={20} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="95%" height={14} />
        <Skeleton width="70%" height={14} />
        <Skeleton width="85%" height={14} />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.standard}
        style={{
          padding: 20,
          background: "rgba(232,25,44,0.08)",
          border: "1px solid rgba(232,25,44,0.2)",
          borderRadius: 14,
          color: "var(--cream)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 6 }}>Analysis failed</p>
        <p style={{ color: "var(--cream-dim)", fontSize: 13 }}>{error}</p>
      </motion.div>
    )
  }

  if (!analysis) return null

  // Simple markdown rendering: **bold**, headers, bullet points
  const renderMarkdown = (text) => {
    const lines = text.split("\n")
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--gold)", marginTop: 14, marginBottom: 4 }}>
            {line.slice(4)}
          </h4>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--gold)", marginTop: 16, marginBottom: 6 }}>
            {line.slice(3)}
          </h3>
        )
      }

      // Bullet points
      if (line.match(/^[-*]\s/)) {
        const content = line.slice(2)
        return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--red)", flexShrink: 0 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: boldify(content) }} />
          </div>
        )
      }

      // Numbered list
      if (line.match(/^\d+\.\s/)) {
        const num = line.match(/^(\d+)\./)[1]
        const content = line.replace(/^\d+\.\s/, "")
        return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--gold)", fontWeight: 700, flexShrink: 0 }}>{num}.</span>
            <span dangerouslySetInnerHTML={{ __html: boldify(content) }} />
          </div>
        )
      }

      // Empty line
      if (!line.trim()) return <div key={i} style={{ height: 8 }} />

      // Regular paragraph
      return <p key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: boldify(line) }} />
    })
  }

  const boldify = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--cream);font-weight:700">$1</strong>')

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={fadeUpItem}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 20,
          position: "relative",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--gold)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            NUTRÏQ Coach
          </span>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={spring.snappy}
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--cream-dim)",
                cursor: "pointer",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </motion.button>
          )}
        </div>

        {/* Content */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13.5,
            color: "var(--cream-dim)",
            lineHeight: 1.6,
          }}
        >
          {renderMarkdown(analysis)}
        </div>
      </motion.div>
    </motion.div>
  )
}
