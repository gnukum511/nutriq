/**
 * NUTRÏQ — Cuisine icons using Lucide React
 * Clean, consistent 1.5px stroke icons for each cuisine type.
 */

import {
  Beef, Coffee, Cookie, Croissant, Drumstick, Egg, Fish, Flame,
  IceCream, Leaf, Pizza, Salad, Sandwich, Soup, UtensilsCrossed,
  Wheat, Wine, Cherry, Cake, CupSoda, Carrot,
} from "lucide-react"

const ICON_MAP = {
  // Asian
  chinese: Soup,
  japanese: Fish,
  sushi: Fish,
  korean: Soup,
  thai: Flame,
  vietnamese: Soup,
  indian: Flame,
  ramen: Soup,

  // Western
  american: Beef,
  burger: Beef,
  pizza: Pizza,
  italian: UtensilsCrossed,
  french: Croissant,
  steak: Beef,
  german: Wheat,
  british: CupSoda,
  spanish: UtensilsCrossed,
  greek: Salad,

  // Latin
  mexican: Flame,
  brazilian: Beef,

  // Middle Eastern / African
  turkish: UtensilsCrossed,
  kebab: Beef,
  lebanese: Salad,
  mediterranean: Leaf,
  african: Soup,
  ethiopian: Soup,

  // Fast food / casual
  fast_food: CupSoda,
  chicken: Drumstick,
  sandwich: Sandwich,
  seafood: Fish,
  fish: Fish,
  fish_and_chips: Fish,

  // Breakfast / café
  coffee: Coffee,
  cafe: Coffee,
  breakfast: Egg,
  bakery: Croissant,

  // Other
  vegetarian: Salad,
  vegan: Leaf,
  ice_cream: IceCream,
  dessert: Cake,
  regional: UtensilsCrossed,
  international: UtensilsCrossed,
}

const DEFAULT_ICON = UtensilsCrossed

export default function CuisineIcon({ cuisine, size = 24, color = "var(--cream-dim)" }) {
  const IconComponent = ICON_MAP[cuisine] || DEFAULT_ICON

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={1.5}
      style={{ flexShrink: 0 }}
    />
  )
}
