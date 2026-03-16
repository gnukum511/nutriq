import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { spring, staggerContainer, fadeUpItem } from "../components/animations"

export default function LoginPage({ onAuth, signIn, signUp }) {
  const [mode, setMode] = useState("signin") // "signin" | "signup"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const result = mode === "signup"
      ? signUp(name, email, password)
      : signIn(email, password)

    if (result.error) {
      setError(result.error)
    } else {
      onAuth()
    }
  }

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError("")
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "var(--charcoal)",
      }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <motion.div variants={fadeUpItem} style={{ textAlign: "center" }}>
          <motion.h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 36,
              fontWeight: 800,
              color: "var(--cream)",
              margin: 0,
              letterSpacing: -1,
            }}
          >
            NUTR<span style={{ color: "var(--red)" }}>Ï</span>Q
          </motion.h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--cream-dim)",
              margin: "8px 0 0",
            }}
          >
            Eat smarter. Live better.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.form
          variants={fadeUpItem}
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderRadius: 10,
              background: "var(--surface2)",
              padding: 3,
              marginBottom: 24,
            }}
          >
            {["signin", "signup"].map((tab) => (
              <motion.button
                key={tab}
                type="button"
                onClick={() => { setMode(tab); setError("") }}
                whileTap={{ scale: 0.97 }}
                transition={spring.snappy}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: mode === tab ? "var(--cream)" : "var(--cream-dim)",
                  background: mode === tab ? "var(--surface)" : "transparent",
                  boxShadow: mode === tab ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {tab === "signin" ? "Sign In" : "Sign Up"}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
              transition={{ duration: 0.15 }}
            >
              {/* Name field (sign up only) */}
              {mode === "signup" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    style={inputStyle}
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{ ...inputStyle, paddingRight: 40 }}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: 4,
                    }}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  fontSize: 13,
                  color: "var(--red)",
                  margin: "0 0 14px",
                  fontFamily: "var(--font-body)",
                }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={spring.bouncy}
            style={{
              width: "100%",
              padding: "14px 0",
              border: "none",
              borderRadius: 12,
              background: "var(--red)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 0.3,
            }}
          >
            {mode === "signin" ? "Sign In" : "Create Account"}
          </motion.button>
        </motion.form>

        {/* Switch prompt */}
        <motion.p
          variants={fadeUpItem}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--cream-dim)",
            margin: 0,
          }}
        >
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <motion.button
            type="button"
            onClick={switchMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: "none",
              border: "none",
              color: "var(--red)",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 13,
              padding: 0,
            }}
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </motion.button>
        </motion.p>
      </motion.div>
    </div>
  )
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--cream-dim)",
  marginBottom: 6,
  fontFamily: "var(--font-body)",
  textTransform: "uppercase",
  letterSpacing: 0.8,
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid var(--border)",
  borderRadius: 10,
  background: "var(--surface2)",
  color: "var(--cream)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
}
