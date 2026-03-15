export default function Footer() {
  return (
    <footer
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "32px 16px 24px",
        borderTop: "1px solid var(--border)",
        fontFamily: "var(--font-body)",
        fontSize: 12,
        color: "var(--muted)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span>
        NUTR<span style={{ color: "var(--red)" }}>Ï</span>Q — AI-Powered Nutrition Coach
      </span>
      <span>
        Powered by{" "}
        <a
          href="https://www.anthropic.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--cream-dim)", textDecoration: "none", fontWeight: 600 }}
        >
          Claude AI
        </a>
        {" · "}
        <a
          href="https://www.openstreetmap.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--cream-dim)", textDecoration: "none", fontWeight: 600 }}
        >
          OpenStreetMap
        </a>
      </span>
      <span style={{ fontSize: 11 }}>v1.0.0</span>
    </footer>
  )
}
