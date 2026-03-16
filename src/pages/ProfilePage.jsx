import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { spring, ScrollReveal } from "../components/animations"
import { ACTIVITY_LEVELS, GOAL_MODIFIERS, lbsToKg, ftInToCm, calculateMacros } from "../lib/tdee"
import { useGoals } from "../hooks/useGoals"

const PROFILE_KEY = "nutriq_profile"

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null
  } catch {
    return null
  }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { updateGoals, selectDiet } = useGoals()
  const existing = loadProfile()

  const [gender, setGender] = useState(existing?.gender || "male")
  const [age, setAge] = useState(existing?.age || 25)
  const [feet, setFeet] = useState(existing?.feet || 5)
  const [inches, setInches] = useState(existing?.inches || 10)
  const [weightLbs, setWeightLbs] = useState(existing?.weightLbs || 170)
  const [activity, setActivity] = useState(existing?.activity || "moderate")
  const [weightGoal, setWeightGoal] = useState(existing?.weightGoal || "maintain")
  const [saved, setSaved] = useState(false)

  const calculated = useMemo(() => {
    return calculateMacros({
      gender,
      weightKg: lbsToKg(weightLbs),
      heightCm: ftInToCm(feet, inches),
      age,
      activityLevel: activity,
      weightGoal,
    })
  }, [gender, age, feet, inches, weightLbs, activity, weightGoal])

  const handleSave = () => {
    const profile = { gender, age, feet, inches, weightLbs, activity, weightGoal }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    updateGoals({ cal: calculated.cal, protein: calculated.protein, carbs: calculated.carbs, fat: calculated.fat })
    selectDiet("custom")
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const macroColors = { cal: "var(--gold)", protein: "var(--green)", carbs: "var(--cream-dim)", fat: "var(--orange)" }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* ── RED HEADER ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, var(--red) 0%, #B5101F 100%)",
          padding: "28px 16px 24px", marginTop: -8, position: "relative", overflow: "hidden",
        }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring.snappy}
            onClick={() => navigate(-1)}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 8, marginBottom: 14 }}>
            ← Back
          </motion.button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
            Your Profile
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Body stats for personalized macro calculations
          </p>
        </div>
      </motion.div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px" }}>
        {/* ── GENDER ── */}
        <ScrollReveal style={{ marginTop: 20 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <SectionLabel>Gender</SectionLabel>
            <div style={{ display: "flex", gap: 8 }}>
              {["male", "female"].map((g) => (
                <ToggleButton key={g} active={gender === g} onClick={() => setGender(g)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gender === g ? "#fff" : "var(--cream-dim)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {g === "male" ? (
                      <><circle cx="10" cy="14" r="6" /><line x1="21" y1="3" x2="14.5" y2="9.5" /><polyline points="21 3 21 9" /><polyline points="21 3 15 3" /></>
                    ) : (
                      <><circle cx="12" cy="10" r="6" /><line x1="12" y1="16" x2="12" y2="22" /><line x1="9" y1="19" x2="15" y2="19" /></>
                    )}
                  </svg>
                  {g === "male" ? "Male" : "Female"}
                </ToggleButton>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── AGE + BODY STATS ── */}
        <ScrollReveal delay={0.1}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <SectionLabel>Body Stats</SectionLabel>

            {/* Age */}
            <FieldRow label="Age" value={`${age} years`}>
              <input type="range" min={13} max={80} value={age} onChange={(e) => setAge(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--red)", cursor: "pointer" }} />
            </FieldRow>

            {/* Height */}
            <FieldRow label="Height" value={`${feet}'${inches}"`}>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={feet} onChange={(e) => setFeet(Number(e.target.value))}
                  style={{ ...selectStyle, flex: 1 }}>
                  {[4, 5, 6, 7].map((f) => <option key={f} value={f}>{f} ft</option>)}
                </select>
                <select value={inches} onChange={(e) => setInches(Number(e.target.value))}
                  style={{ ...selectStyle, flex: 1 }}>
                  {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{i} in</option>)}
                </select>
              </div>
            </FieldRow>

            {/* Weight */}
            <FieldRow label="Weight" value={`${weightLbs} lbs`}>
              <input type="range" min={80} max={400} step={1} value={weightLbs}
                onChange={(e) => setWeightLbs(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--red)", cursor: "pointer" }} />
            </FieldRow>
          </div>
        </ScrollReveal>

        {/* ── ACTIVITY LEVEL ── */}
        <ScrollReveal delay={0.15}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <SectionLabel>Activity Level</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ACTIVITY_LEVELS.map((a) => (
                <OptionRow key={a.id} active={activity === a.id} onClick={() => setActivity(a.id)}
                  label={a.label} desc={a.desc} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── WEIGHT GOAL ── */}
        <ScrollReveal delay={0.2}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <SectionLabel>Weight Goal</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(GOAL_MODIFIERS).map(([id, g]) => (
                <OptionRow key={id} active={weightGoal === id} onClick={() => setWeightGoal(id)}
                  label={g.label} desc={g.desc} />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── CALCULATED RESULTS ── */}
        <ScrollReveal delay={0.25}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <SectionLabel>Your Recommended Targets</SectionLabel>

            <div style={{ display: "flex", gap: 6, marginBottom: 14, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--cream-dim)" }}>
              <span>BMR: <strong style={{ color: "var(--cream)" }}>{Math.round(calculated.bmr)}</strong> cal</span>
              <span style={{ color: "var(--muted)" }}>·</span>
              <span>TDEE: <strong style={{ color: "var(--cream)" }}>{calculated.tdee}</strong> cal</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Calories", value: calculated.cal, unit: "", key: "cal" },
                { label: "Protein", value: calculated.protein, unit: "g", key: "protein" },
                { label: "Carbs", value: calculated.carbs, unit: "g", key: "carbs" },
                { label: "Fat", value: calculated.fat, unit: "g", key: "fat" },
              ].map(({ label, value, unit, key }) => (
                <div key={key} style={{
                  background: "var(--surface2)", borderRadius: 10, padding: "12px 10px", textAlign: "center",
                }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 20, fontWeight: 700, color: macroColors[key] }}>
                    {value}{unit}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
              onClick={handleSave}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                background: saved ? "var(--green)" : "var(--red)", color: "#fff",
                fontSize: 14, fontWeight: 700, fontFamily: "var(--font-body)",
                cursor: "pointer", marginTop: 16,
              }}>
              {saved ? "✓ Saved & Applied" : "Apply These Targets"}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <h3 style={{
      fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
      color: "var(--cream)", marginBottom: 12,
    }}>
      {children}
    </h3>
  )
}

function FieldRow({ label, value, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", marginBottom: 6,
        fontFamily: "var(--font-body)", fontSize: 13,
      }}>
        <span style={{ color: "var(--cream-dim)" }}>{label}</span>
        <span style={{ color: "var(--cream)", fontWeight: 700 }}>{value}</span>
      </div>
      {children}
    </div>
  )
}

function ToggleButton({ active, onClick, children }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={spring.snappy}
      onClick={onClick}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "12px 16px", borderRadius: 10,
        border: `1.5px solid ${active ? "var(--red)" : "var(--border)"}`,
        background: active ? "var(--red)" : "var(--surface)",
        color: active ? "#fff" : "var(--cream-dim)",
        fontSize: 14, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer",
      }}>
      {children}
    </motion.button>
  )
}

function OptionRow({ active, onClick, label, desc }) {
  return (
    <motion.button
      whileHover={{ background: active ? "var(--red-glow)" : "var(--surface2)" }}
      whileTap={{ scale: 0.98 }} transition={spring.snappy}
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", borderRadius: 10,
        border: `1.5px solid ${active ? "var(--red)" : "var(--border)"}`,
        background: active ? "var(--red-glow)" : "transparent",
        cursor: "pointer", textAlign: "left",
      }}>
      <span style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `2px solid ${active ? "var(--red)" : "var(--border)"}`,
        background: active ? "var(--red)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
      </span>
      <div>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: active ? "var(--red)" : "var(--cream)" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--cream-dim)", marginLeft: 8 }}>
          {desc}
        </span>
      </div>
    </motion.button>
  )
}

const selectStyle = {
  padding: "9px 12px", borderRadius: 10,
  border: "1px solid var(--border)", background: "var(--surface)",
  color: "var(--cream)", fontSize: 13, fontFamily: "var(--font-body)",
  fontWeight: 600, cursor: "pointer", outline: "none",
}
