import { useState, useCallback, useMemo } from "react"

const DEFAULT_GOALS = { cal: 2000, protein: 120, carbs: 250, fat: 65 }
const STORAGE_KEY = "nutriq_goals"
const DAILY_KEY = "nutriq_daily_totals"

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function useGoals() {
  const [goals, setGoals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_GOALS
    } catch {
      return DEFAULT_GOALS
    }
  })

  const [dailyTotals, setDailyTotals] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(DAILY_KEY) || "{}")
      if (stored.date === getToday()) return stored
      return { date: getToday(), cal: 0, protein: 0, carbs: 0, fat: 0 }
    } catch {
      return { date: getToday(), cal: 0, protein: 0, carbs: 0, fat: 0 }
    }
  })

  const updateGoals = useCallback((newGoals) => {
    setGoals(newGoals)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newGoals))
  }, [])

  const addMealToDaily = useCallback((items) => {
    setDailyTotals((prev) => {
      const base = prev.date === getToday() ? prev : { date: getToday(), cal: 0, protein: 0, carbs: 0, fat: 0 }
      const updated = {
        date: getToday(),
        cal: base.cal + items.reduce((s, i) => s + i.cal, 0),
        protein: base.protein + items.reduce((s, i) => s + i.protein, 0),
        carbs: base.carbs + items.reduce((s, i) => s + i.carbs, 0),
        fat: base.fat + items.reduce((s, i) => s + i.fat, 0),
      }
      localStorage.setItem(DAILY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const progress = useMemo(() => ({
    cal: Math.min(100, Math.round((dailyTotals.cal / goals.cal) * 100)),
    protein: Math.min(100, Math.round((dailyTotals.protein / goals.protein) * 100)),
    carbs: Math.min(100, Math.round((dailyTotals.carbs / goals.carbs) * 100)),
    fat: Math.min(100, Math.round((dailyTotals.fat / goals.fat) * 100)),
  }), [dailyTotals, goals])

  return { goals, updateGoals, dailyTotals, addMealToDaily, progress }
}
