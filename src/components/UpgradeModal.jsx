import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { spring } from "./animations"
import { X, Zap, ChefHat, Brain, History, GitCompare, Share2, Salad, Loader } from "lucide-react"

const PRO_FEATURES = [
  { icon: ChefHat, label: "Unlimited AI menus", desc: "Generate as many restaurant menus as you want" },
  { icon: Brain, label: "Unlimited AI coaching", desc: "Get personalized nutrition advice for every meal" },
  { icon: History, label: "Full meal history", desc: "Access your complete meal log, not just the last 5" },
  { icon: GitCompare, label: "Meal comparison", desc: "Compare meals side-by-side to make better choices" },
  { icon: Share2, label: "Export & share", desc: "Share your meal analyses with friends or trainers" },
  { icon: Salad, label: "All diet presets", desc: "Access all 9 diet regimens including custom targets" },
]

export default function UpgradeModal({ open, onClose, feature, remaining, onCheckout }) {
  const featureLabel = feature === "menu" ? "AI menu generation" : "AI meal analysis"
  const limit = feature === "menu" ? 3 : 1
  const [plan, setPlan] = useState("monthly")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    if (!onCheckout) return
    setError(null)
    setLoading(true)
    try {
      await onCheckout(plan)
      // onCheckout redirects — if we get here something went wrong
    } catch (err) {
      setError(err.message || "Could not start checkout. Please try again.")
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
              zIndex: 500, backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={spring.standard}
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(420px, calc(100vw - 32px))",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "var(--surface)",
              borderRadius: 20,
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
              zIndex: 501,
            }}
          >
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, var(--red) 0%, #B5101F 100%)",
              padding: "24px 24px 20px",
              borderRadius: "20px 20px 0 0",
              position: "relative",
            }}>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={spring.snappy}
                onClick={onClose}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(255,255,255,0.15)", border: "none",
                  borderRadius: 8, width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                <X size={16} color="#fff" strokeWidth={2} />
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Zap size={20} color="#FFD700" fill="#FFD700" />
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "#fff",
                }}>
                  Upgrade to Pro
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.8)",
                lineHeight: 1.4,
              }}>
                You've used all {limit} free {featureLabel}{limit > 1 ? "s" : ""} today.
                Upgrade for unlimited access to all AI features.
              </p>
            </div>

            {/* Features */}
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {PRO_FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "var(--red-glow)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={18} color="var(--red)" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                        color: "var(--cream)",
                      }}>
                        {label}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: 12,
                        color: "var(--cream-dim)", marginTop: 1,
                      }}>
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan toggle */}
              <div style={{
                display: "flex", background: "var(--surface2)", borderRadius: 10,
                padding: 4, gap: 4, marginBottom: 16,
              }}>
                {[
                  { key: "monthly", label: "$4.99/mo" },
                  { key: "annual", label: "$39.99/yr  ·  save 33%" },
                ].map(({ key, label }) => (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.97 }} transition={spring.snappy}
                    onClick={() => setPlan(key)}
                    style={{
                      flex: 1, padding: "8px 0", border: "none", borderRadius: 7, cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                      background: plan === key ? "var(--surface)" : "transparent",
                      color: plan === key ? "var(--cream)" : "var(--cream-dim)",
                      boxShadow: plan === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 12, color: "var(--red)",
                  textAlign: "center", marginBottom: 10,
                }}>
                  {error}
                </p>
              )}

              {/* CTA */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                transition={spring.snappy}
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                  background: "var(--red)", color: "#fff",
                  fontSize: 15, fontWeight: 700, fontFamily: "var(--font-body)",
                  cursor: loading ? "default" : "pointer",
                  boxShadow: "0 4px 16px rgba(217,20,41,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: loading ? 0.8 : 1,
                }}>
                {loading ? (
                  <>
                    <Loader size={16} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
                    Redirecting to checkout…
                  </>
                ) : (
                  "Start Free Trial"
                )}
              </motion.button>

              <p style={{
                fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)",
                textAlign: "center", marginTop: 10,
              }}>
                7-day free trial · Cancel anytime · No credit card required
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
