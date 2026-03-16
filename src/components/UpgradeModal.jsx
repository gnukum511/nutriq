import { motion, AnimatePresence } from "framer-motion"
import { spring } from "./animations"
import { X, Zap, ChefHat, Brain, History, GitCompare, Share2, Salad } from "lucide-react"

const PRO_FEATURES = [
  { icon: ChefHat, label: "Unlimited AI menus", desc: "Generate as many restaurant menus as you want" },
  { icon: Brain, label: "Unlimited AI coaching", desc: "Get personalized nutrition advice for every meal" },
  { icon: History, label: "Full meal history", desc: "Access your complete meal log, not just the last 5" },
  { icon: GitCompare, label: "Meal comparison", desc: "Compare meals side-by-side to make better choices" },
  { icon: Share2, label: "Export & share", desc: "Share your meal analyses with friends or trainers" },
  { icon: Salad, label: "All diet presets", desc: "Access all 9 diet regimens including custom targets" },
]

export default function UpgradeModal({ open, onClose, feature, remaining }) {
  const featureLabel = feature === "menu" ? "AI menu generation" : "AI meal analysis"
  const limit = feature === "menu" ? 3 : 1

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

              {/* Pricing */}
              <div style={{
                background: "var(--surface2)", borderRadius: 14, padding: 16,
                textAlign: "center", marginBottom: 16,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700,
                    color: "var(--cream)",
                  }}>
                    $4.99
                  </span>
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: 13, color: "var(--cream-dim)",
                  }}>
                    /month
                  </span>
                </div>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)",
                  marginTop: 4,
                }}>
                  or $39.99/year (save 33%)
                </p>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
                onClick={() => {
                  // Future: Stripe checkout
                  // For now, show alert
                  alert("Payment integration coming soon! For now, enjoy unlimited access.")
                  // Temporarily upgrade (demo mode)
                }}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                  background: "var(--red)", color: "#fff",
                  fontSize: 15, fontWeight: 700, fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(217,20,41,0.3)",
                }}>
                Start Free Trial
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
