/**
 * NUTRÏQ — Cuisine emoji/label mapping for OSM cuisine tags
 */

const CUISINE_MAP = {
  // Asian
  chinese: { emoji: "🥡", label: "Chinese" },
  japanese: { emoji: "🍣", label: "Japanese" },
  sushi: { emoji: "🍣", label: "Sushi" },
  korean: { emoji: "🍜", label: "Korean" },
  thai: { emoji: "🍛", label: "Thai" },
  vietnamese: { emoji: "🍲", label: "Vietnamese" },
  indian: { emoji: "🍛", label: "Indian" },
  ramen: { emoji: "🍜", label: "Ramen" },

  // Western
  american: { emoji: "🍔", label: "American" },
  burger: { emoji: "🍔", label: "Burgers" },
  pizza: { emoji: "🍕", label: "Pizza" },
  italian: { emoji: "🍝", label: "Italian" },
  french: { emoji: "🥐", label: "French" },
  steak: { emoji: "🥩", label: "Steakhouse" },
  german: { emoji: "🥨", label: "German" },
  british: { emoji: "🫖", label: "British" },
  spanish: { emoji: "🥘", label: "Spanish" },
  greek: { emoji: "🥙", label: "Greek" },

  // Latin
  mexican: { emoji: "🌮", label: "Mexican" },
  brazilian: { emoji: "🥩", label: "Brazilian" },

  // Middle Eastern / African
  turkish: { emoji: "🥙", label: "Turkish" },
  kebab: { emoji: "🥙", label: "Kebab" },
  lebanese: { emoji: "🧆", label: "Lebanese" },
  mediterranean: { emoji: "🫒", label: "Mediterranean" },
  african: { emoji: "🍲", label: "African" },
  ethiopian: { emoji: "🍲", label: "Ethiopian" },

  // Fast food / casual
  fast_food: { emoji: "🍟", label: "Fast Food" },
  chicken: { emoji: "🍗", label: "Chicken" },
  sandwich: { emoji: "🥪", label: "Sandwiches" },
  seafood: { emoji: "🦐", label: "Seafood" },
  fish: { emoji: "🐟", label: "Fish" },
  fish_and_chips: { emoji: "🐟", label: "Fish & Chips" },

  // Breakfast / café
  coffee: { emoji: "☕", label: "Coffee" },
  cafe: { emoji: "☕", label: "Café" },
  breakfast: { emoji: "🥞", label: "Breakfast" },
  bakery: { emoji: "🥖", label: "Bakery" },

  // Other
  vegetarian: { emoji: "🥗", label: "Vegetarian" },
  vegan: { emoji: "🌱", label: "Vegan" },
  ice_cream: { emoji: "🍦", label: "Ice Cream" },
  dessert: { emoji: "🍰", label: "Desserts" },
  regional: { emoji: "🍽️", label: "Local" },
  international: { emoji: "🌍", label: "International" },
}

const DEFAULT = { emoji: "🍽️", label: "Restaurant" }

/**
 * Get emoji and label for an OSM cuisine tag string.
 * Handles semicolon-separated values (e.g., "italian;pizza")
 */
export function getCuisineInfo(cuisineTag) {
  if (!cuisineTag) return DEFAULT

  const tags = cuisineTag.toLowerCase().split(";").map((t) => t.trim())

  for (const tag of tags) {
    if (CUISINE_MAP[tag]) return CUISINE_MAP[tag]
  }

  // Try partial match
  for (const tag of tags) {
    for (const [key, val] of Object.entries(CUISINE_MAP)) {
      if (tag.includes(key) || key.includes(tag)) return val
    }
  }

  // Capitalize first tag as fallback label
  const fallbackLabel = tags[0].charAt(0).toUpperCase() + tags[0].slice(1)
  return { emoji: "🍽️", label: fallbackLabel }
}
