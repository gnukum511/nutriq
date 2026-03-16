/**
 * NUTRÏQ — TDEE & Macro Calculator
 * Uses Mifflin-St Jeor equation (most accurate for general population)
 *
 * TDEE = BMR × Activity Multiplier
 * BMR (Male)   = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 5 + 161 (wrong, see below)
 * BMR (Male)   = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
 * BMR (Female) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
 */

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", desc: "Desk job, little exercise", multiplier: 1.2 },
  { id: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week", multiplier: 1.375 },
  { id: "moderate", label: "Moderately Active", desc: "Exercise 3-5 days/week", multiplier: 1.55 },
  { id: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week", multiplier: 1.725 },
  { id: "athlete", label: "Athlete", desc: "Intense training, physical job", multiplier: 1.9 },
]

export const GOAL_MODIFIERS = {
  lose_fast: { label: "Lose Fast", desc: "-750 cal/day (~1.5 lb/week)", offset: -750 },
  lose: { label: "Lose Weight", desc: "-500 cal/day (~1 lb/week)", offset: -500 },
  lose_slow: { label: "Lose Slowly", desc: "-250 cal/day (~0.5 lb/week)", offset: -250 },
  maintain: { label: "Maintain", desc: "Keep current weight", offset: 0 },
  gain_slow: { label: "Gain Slowly", desc: "+250 cal/day (~0.5 lb/week)", offset: 250 },
  gain: { label: "Gain Weight", desc: "+500 cal/day (~1 lb/week)", offset: 500 },
}

// Convert lbs to kg
export function lbsToKg(lbs) {
  return lbs * 0.453592
}

// Convert feet+inches to cm
export function ftInToCm(feet, inches) {
  return (feet * 12 + inches) * 2.54
}

/**
 * Calculate BMR using Mifflin-St Jeor
 * @param {object} params
 * @param {"male"|"female"} params.gender
 * @param {number} params.weightKg
 * @param {number} params.heightCm
 * @param {number} params.age
 * @returns {number} BMR in calories
 */
export function calculateBMR({ gender, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === "male" ? base + 5 : base - 161
}

/**
 * Calculate TDEE
 */
export function calculateTDEE({ gender, weightKg, heightCm, age, activityLevel }) {
  const bmr = calculateBMR({ gender, weightKg, heightCm, age })
  const activity = ACTIVITY_LEVELS.find((a) => a.id === activityLevel)
  return Math.round(bmr * (activity?.multiplier || 1.2))
}

/**
 * Calculate recommended macros based on TDEE and goal
 * @returns {{ cal, protein, carbs, fat }}
 */
export function calculateMacros({ gender, weightKg, heightCm, age, activityLevel, weightGoal }) {
  const tdee = calculateTDEE({ gender, weightKg, heightCm, age, activityLevel })
  const goalMod = GOAL_MODIFIERS[weightGoal] || GOAL_MODIFIERS.maintain
  const targetCal = Math.max(1200, tdee + goalMod.offset)

  // Protein: 1.0g per lb of body weight (high end for active people)
  // Scale down for sedentary
  const weightLbs = weightKg / 0.453592
  const proteinMultiplier = activityLevel === "sedentary" ? 0.7
    : activityLevel === "light" ? 0.8
    : activityLevel === "moderate" ? 0.9
    : 1.0
  const protein = Math.round(weightLbs * proteinMultiplier)
  const proteinCal = protein * 4

  // Fat: 25-30% of calories
  const fatPct = weightGoal?.startsWith("lose") ? 0.25 : 0.3
  const fatCal = targetCal * fatPct
  const fat = Math.round(fatCal / 9)

  // Carbs: remaining calories
  const carbCal = targetCal - proteinCal - fatCal
  const carbs = Math.max(20, Math.round(carbCal / 4))

  return {
    cal: targetCal,
    protein,
    carbs,
    fat,
    bmr: calculateBMR({ gender, weightKg, heightCm, age }),
    tdee,
  }
}
