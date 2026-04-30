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
              background: "var(--card)",
              borderRadius: 24,
              boxShadow: "var(--shadow-elevated)",
              zIndex: 501,
              border: "1px solid var(--border)",
            }}
          >
            {/* Header */}
            <div style={{
              background: "var(--gradient-leaf)",
              padding: "24px 24px 20px",
              borderRadius: "24px 24px 0 0",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(circle at 85% 15%, oklch(0.92 0.075 65 / 0.4) 0%, transparent 60%)",
                pointerEvents: "none",
              }} />
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={spring.snappy}
                onClick={onClose}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(255,255,255,0.18)", border: "none",
                  borderRadius: 999, width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", zIndex: 1,
                }}>
                <X size={16} color="var(--primary-foreground)" strokeWidth={2} />
              </motion.button>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, position: "relative" }}>
                <Zap size={20} color="var(--accent)" fill="var(--accent)" />
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
                  letterSpacing: -0.3,
                  color: "var(--primary-foreground)",
                }}>
                  Upgrade to <span style={{ fontStyle: "italic" }}>Pro</span>
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 13, color: "color-mix(in oklch, var(--primary-foreground) 85%, transparent)",
                lineHeight: 1.45, position: "relative",
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
                      width: 38, height: 38, borderRadius: 14,
                      background: "var(--primary-soft)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={18} color="var(--primary)" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                        color: "var(--foreground)",
                      }}>
                        {label}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-body)", fontSize: 12,
                        color: "var(--muted-foreground)", marginTop: 1,
                      }}>
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan toggle */}
              <div style={{
                display: "flex", background: "var(--secondary)", borderRadius: 14,
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
                      flex: 1, padding: "8px 0", border: "none", borderRadius: 10, cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
                      background: plan === key ? "var(--card)" : "transparent",
                      color: plan === key ? "var(--foreground)" : "var(--muted-foreground)",
                      boxShadow: plan === key ? "var(--shadow-soft)" : "none",
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 12, color: "var(--tomato)",
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
                  width: "100%", padding: "14px 0", borderRadius: 999, border: "none",
                  background: "var(--gradient-leaf)", color: "var(--primary-foreground)",
                  fontSize: 15, fontWeight: 700, fontFamily: "var(--font-body)",
                  cursor: loading ? "default" : "pointer",
                  boxShadow: "var(--shadow-glow)",
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
