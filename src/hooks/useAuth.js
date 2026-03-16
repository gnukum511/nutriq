import { useState, useCallback } from "react"

const USERS_KEY = "nutriq_users"
const SESSION_KEY = "nutriq_session"

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function hashPassword(password) {
  // Simple hash for localStorage auth — not production-grade crypto
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash.toString(36)
}

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
    } catch {
      return null
    }
  })

  const signUp = useCallback((name, email, password) => {
    const users = getUsers()
    if (users.find((u) => u.email === email.toLowerCase())) {
      return { error: "An account with this email already exists" }
    }
    const newUser = {
      id: Date.now().toString(36),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hash: hashPassword(password),
      createdAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { success: true }
  }, [])

  const signIn = useCallback((email, password) => {
    const users = getUsers()
    const found = users.find(
      (u) => u.email === email.toLowerCase().trim() && u.hash === hashPassword(password)
    )
    if (!found) {
      return { error: "Invalid email or password" }
    }
    const session = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { success: true }
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return { user, signUp, signIn, signOut, isAuthenticated: !!user }
}
