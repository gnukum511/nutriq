/**
 * NUTRÏQ — Client-side API quota system
 * Tracks daily usage of AI features (menu generation + meal analysis).
 * Free tier: 3 menus/day, 1 analysis/day
 * Pro tier: unlimited (stored in localStorage, future: server-side)
 */

import { useState, useCallback, useMemo } from "react"

const QUOTA_KEY = "nutriq_quota"
const PRO_KEY = "nutriq_pro"

const FREE_LIMITS = {
  menu: 3,
  analysis: 1,
}

const PRO_LIMITS = {
  menu: Infinity,
  analysis: Infinity,
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

  const limits = isPro ? PRO_LIMITS : FREE_LIMITS

  const remaining = useMemo(() => ({
    menu: Math.max(0, limits.menu - quota.menu),
    analysis: Math.max(0, limits.analysis - quota.analysis),
  }), [quota, limits])

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
    limits,
    isPro,
    canUse,
    recordUsage,
    upgradeToPro,
    downgradeToFree,
  }
}
