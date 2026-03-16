/**
 * NUTRÏQ — Diet regimen presets
 * Each preset defines daily macro targets for a specific diet or fitness goal.
 */

export const DIET_PRESETS = [
  {
    id: "custom",
    name: "Custom",
    desc: "Set your own macro targets",
    icon: "⚙",
    goals: null, // user-defined
  },
  {
    id: "balanced",
    name: "Balanced",
    desc: "Standard healthy eating — 40/30/30 split",
    icon: "⚖",
    goals: { cal: 2000, protein: 150, carbs: 200, fat: 67 },
  },
  {
    id: "cutting",
    name: "Cutting",
    desc: "Calorie deficit for fat loss, high protein",
    icon: "↓",
    goals: { cal: 1600, protein: 160, carbs: 120, fat: 53 },
  },
  {
    id: "bulking",
    name: "Bulking",
    desc: "Calorie surplus for muscle gain",
    icon: "↑",
    goals: { cal: 2800, protein: 180, carbs: 350, fat: 78 },
  },
  {
    id: "keto",
    name: "Keto",
    desc: "Very low carb, high fat — <30g carbs",
    icon: "K",
    goals: { cal: 1800, protein: 120, carbs: 25, fat: 140 },
  },
  {
    id: "high_protein",
    name: "High Protein",
    desc: "Maximize protein for muscle recovery",
    icon: "P",
    goals: { cal: 2200, protein: 200, carbs: 200, fat: 60 },
  },
  {
    id: "low_carb",
    name: "Low Carb",
    desc: "Moderate carb restriction — <100g carbs",
    icon: "LC",
    goals: { cal: 1800, protein: 140, carbs: 80, fat: 90 },
  },
  {
    id: "vegan",
    name: "Vegan",
    desc: "Plant-based macro targets",
    icon: "V",
    goals: { cal: 2000, protein: 80, carbs: 300, fat: 55 },
  },
  {
    id: "paleo",
    name: "Paleo",
    desc: "Whole foods, no grains or dairy",
    icon: "PA",
    goals: { cal: 2000, protein: 150, carbs: 100, fat: 100 },
  },
]

export function getDietById(id) {
  return DIET_PRESETS.find((d) => d.id === id) || DIET_PRESETS[0]
}
