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
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </HeaderButton>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <HeaderButton
              onClick={() => { closeAll(); setNotifOpen(!notifOpen) }}
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cream)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    Home
                  </DropdownItem>
                  <DropdownItem onClick={() => { setProfileOpen(false); navigate("/analysis") }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={() => { setProfileOpen(false); navigate("/settings") }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                    Settings
                  </DropdownItem>
                  <DropdownItem onClick={() => { setProfileOpen(false); onSignOut?.() }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Sign Out
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
