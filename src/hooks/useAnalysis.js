import { useState, useCallback } from "react"
import { analyzeMeal } from "../lib/claude"

/**
 * useAnalysis — AI meal analysis via Claude API
 */
export function useAnalysis() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) return

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const result = await analyzeMeal(selectedItems)
      setAnalysis(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearAnalysis = useCallback(() => {
    setAnalysis(null)
    setError(null)
  }, [])

  return { analysis, loading, error, analyze, clearAnalysis }
}
