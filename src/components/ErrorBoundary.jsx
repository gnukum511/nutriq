import { Component } from "react"
import { motion } from "framer-motion"
import { spring } from "./animations"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "var(--charcoal)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>😵</p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 24,
                fontWeight: 700,
                color: "var(--cream)",
                marginBottom: 8,
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--cream-dim)",
                marginBottom: 20,
                lineHeight: 1.5,
              }}
            >
              NUTRÏQ hit an unexpected error. Try refreshing the page.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring.snappy}
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: "var(--red)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
            >
              Refresh Page
            </motion.button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
