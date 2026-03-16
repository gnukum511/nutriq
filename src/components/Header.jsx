import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { spring } from "./animations"

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
]

export default function Header({ onMenuToggle, theme, onThemeToggle, user, onSignOut }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("nutriq_lang") || "en"
  })
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const currentFlag = LANGUAGES.find((l) => l.code === currentLang)?.flag || "🇺🇸"

  const notifications = [
    { id: 1, text: "Your daily protein goal was met!", time: "2h ago", read: false },
    { id: 2, text: "New restaurants found near you", time: "5h ago", read: true },
    { id: 3, text: "Weekly meal report ready", time: "1d ago", read: true },
  ]
  const unreadCount = notifications.filter((n) => !n.read).length

  const closeAll = () => {
    setLangOpen(false)
    setNotifOpen(false)
    setProfileOpen(false)
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: theme === "dark" ? "rgba(14,14,15,0.92)" : "rgba(250,250,248,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: hamburger + logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={spring.snappy}
            onClick={onMenuToggle}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              fontSize: 20,
              color: "var(--cream)",
              lineHeight: 1,
            }}
          >
            ☰
          </motion.button>
          <motion.span
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/")}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 800,
              color: "var(--cream)",
              cursor: "pointer",
              letterSpacing: -0.5,
            }}
          >
            NUTR<span style={{ color: "var(--red)" }}>Ï</span>Q
          </motion.span>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Language */}
          <div style={{ position: "relative" }}>
            <HeaderButton
              onClick={() => { closeAll(); setLangOpen(!langOpen) }}
              aria-label="Change language"
            >
              {currentFlag}
            </HeaderButton>
            <AnimatePresence>
              {langOpen && (
                <Dropdown>
                  {LANGUAGES.map((lang) => (
                    <DropdownItem
                      key={lang.code}
                      active={currentLang === lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        localStorage.setItem("nutriq_lang", lang.code)
                        setLangOpen(false)
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </DropdownItem>
                  ))}
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <HeaderButton
            onClick={onThemeToggle}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </HeaderButton>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <HeaderButton
              onClick={() => { closeAll(); setNotifOpen(!notifOpen) }}
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--red)",
                  }}
                />
              )}
            </HeaderButton>
            <AnimatePresence>
              {notifOpen && (
                <Dropdown width={260}>
                  <p style={{
                    fontSize: 12, fontWeight: 700, color: "var(--cream-dim)",
                    textTransform: "uppercase", letterSpacing: 1,
                    padding: "8px 12px 4px", margin: 0,
                  }}>
                    Notifications
                  </p>
                  {notifications.map((n) => (
                    <DropdownItem key={n.id} onClick={() => setNotifOpen(false)}>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: 13,
                          color: n.read ? "var(--cream-dim)" : "var(--cream)",
                          fontWeight: n.read ? 400 : 600,
                          margin: 0,
                        }}>
                          {n.text}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--muted)", margin: "2px 0 0" }}>
                          {n.time}
                        </p>
                      </div>
                      {!n.read && (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--red)", flexShrink: 0,
                        }} />
                      )}
                    </DropdownItem>
                  ))}
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          {/* Dashboard */}
          <HeaderButton
            onClick={() => navigate("/analysis")}
            aria-label="Dashboard"
            active={location.pathname === "/analysis"}
          >
            📊
          </HeaderButton>

          {/* Profile */}
          <div style={{ position: "relative" }}>
            <HeaderButton
              onClick={() => { closeAll(); setProfileOpen(!profileOpen) }}
              aria-label="Profile"
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "var(--red)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            </HeaderButton>
            <AnimatePresence>
              {profileOpen && (
                <Dropdown width={200}>
                  <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--cream)", margin: 0 }}>{user?.name || "User"}</p>
                    <p style={{ fontSize: 12, color: "var(--cream-dim)", margin: "2px 0 0" }}>{user?.email || "Free Plan"}</p>
                  </div>
                  <DropdownItem onClick={() => { setProfileOpen(false); navigate("/") }}>
                    🏠 Home
                  </DropdownItem>
                  <DropdownItem onClick={() => { setProfileOpen(false); navigate("/analysis") }}>
                    📊 Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={() => { setProfileOpen(false); navigate("/settings") }}>
                    ⚙️ Settings
                  </DropdownItem>
                  <DropdownItem onClick={() => { setProfileOpen(false); onSignOut?.() }}>
                    🚪 Sign Out
                  </DropdownItem>
                </Dropdown>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeaderButton({ children, onClick, active, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, background: "var(--surface2)" }}
      whileTap={{ scale: 0.9 }}
      transition={spring.snappy}
      onClick={onClick}
      style={{
        position: "relative",
        background: active ? "var(--surface2)" : "none",
        border: "none",
        cursor: "pointer",
        padding: 6,
        fontSize: 18,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function Dropdown({ children, width = 180 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        right: 0,
        width,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        zIndex: 200,
      }}
    >
      {children}
    </motion.div>
  )
}

function DropdownItem({ children, onClick, active }) {
  return (
    <motion.button
      whileHover={{ background: "var(--surface2)" }}
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        border: "none",
        background: active ? "var(--surface2)" : "transparent",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: 13,
        color: "var(--cream)",
        textAlign: "left",
      }}
    >
      {children}
    </motion.button>
  )
}
