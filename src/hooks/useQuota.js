/**
 * NUTRÏQ — Client-side API quota system
 * Tracks daily usage of AI features (menu generation + meal analysis).
 * Free tier: 3 menus/day, 1 analysis/day
 * Pro tier: unlimited — verified via Stripe Checkout session on return
 */

import { useState, useCallback, useMemo, useEffect } from "react"

const QUOTA_KEY = "nutriq_quota"
const PRO_KEY = "nutriq_pro"

const FREE_LIMITS = {
  menu: 3,
  analysis: 1,
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function loadQuota() {
  try {
    const stored = JSON.parse(localStorage.getItem(QUOTA_KEY) || "{}")
    if (stored.date === getToday()) return stored
    return { date: getToday(), menu: 0, analysis: 0 }
  } catch {
    return { date: getToday(), menu: 0, analysis: 0 }
  }
}

function saveQuota(quota) {
  localStorage.setItem(QUOTA_KEY, JSON.stringify(quota))
}

export function useQuota() {
  const [quota, setQuota] = useState(loadQuota)
  const [isPro, setIsPro] = useState(() => localStorage.getItem(PRO_KEY) === "true")
  const [verifying, setVerifying] = useState(false)

  // After Stripe Checkout, the success URL returns ?session_id=cs_...
  // Verify it server-side and persist Pro status if confirmed.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id")
    if (!sessionId) return

    // Clean the URL immediately so refreshing doesn't re-verify
    window.history.replaceState({}, "", window.location.pathname + window.location.hash)

    setVerifying(true)
    fetch(`/api/stripe/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.isPro) {
          localStorage.setItem(PRO_KEY, "true")
          setIsPro(true)
        }
      })
      .catch(() => {})
      .finally(() => setVerifying(false))
  }, [])

  const remaining = useMemo(() => ({
    menu: isPro ? Infinity : Math.max(0, FREE_LIMITS.menu - quota.menu),
    analysis: isPro ? Infinity : Math.max(0, FREE_LIMITS.analysis - quota.analysis),
  }), [quota, isPro])

  const canUse = useCallback((feature) => {
    if (isPro) return true
    const current = quota.date === getToday() ? quota : { date: getToday(), menu: 0, analysis: 0 }
    return current[feature] < FREE_LIMITS[feature]
  }, [quota, isPro])

  const recordUsage = useCallback((feature) => {
    setQuota((prev) => {
      const base = prev.date === getToday() ? prev : { date: getToday(), menu: 0, analysis: 0 }
      const updated = { ...base, [feature]: base[feature] + 1 }
      saveQuota(updated)
      return updated
    })
  }, [])

  // Redirect to Stripe Checkout. plan: "monthly" | "annual"
  const startCheckout = useCallback(async (plan = "monthly") => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      throw new Error(data.error || "Failed to start checkout")
    }
  }, [])

  const upgradeToPro = useCallback(() => {
    localStorage.setItem(PRO_KEY, "true")
    setIsPro(true)
  }, [])

  const downgradeToFree = useCallback(() => {
    localStorage.removeItem(PRO_KEY)
    setIsPro(false)
  }, [])

  return {
    quota,
    remaining,
    limits: isPro ? { menu: Infinity, analysis: Infinity } : FREE_LIMITS,
    isPro,
    verifying,
    canUse,
    recordUsage,
    startCheckout,
    upgradeToPro,
    downgradeToFree,
  }
}
