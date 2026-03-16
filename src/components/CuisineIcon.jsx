/**
 * NUTRÏQ — SVG cuisine icons (Yelp-style line icons)
 * Replaces emojis with clean, professional stroke icons.
 */

const ICONS = {
  // Asian
  chinese: (
    <><path d="M12 3v10M5 8h14" /><path d="M7 8c0 4 2 7 5 9 3-2 5-5 5-9" /><line x1="12" y1="17" x2="12" y2="21" /></>
  ),
  japanese: (
    <><ellipse cx="12" cy="10" rx="9" ry="5" /><path d="M3 10c0 3 4 6 9 6s9-3 9-6" /><line x1="8" y1="3" x2="6" y2="8" /><line x1="16" y1="3" x2="18" y2="8" /></>
  ),
  sushi: (
    <><ellipse cx="12" cy="12" rx="8" ry="5" /><path d="M4 12c0 2.5 3.5 5 8 5s8-2.5 8-5" /><line x1="8" y1="10" x2="16" y2="10" /></>
  ),
  korean: (
    <><circle cx="12" cy="13" r="7" /><path d="M8 13c0-2.2 1.8-4 4-4s4 1.8 4 4" /><line x1="12" y1="3" x2="12" y2="6" /><line x1="12" y1="9" x2="12" y2="17" /></>
  ),
  thai: (
    <><path d="M5 11a7 7 0 0 1 14 0" /><path d="M5 11v4c0 3 3.5 5 7 5s7-2 7-5v-4" /><path d="M9 3c0 2 1 4 3 5 2-1 3-3 3-5" /></>
  ),
  vietnamese: (
    <><path d="M5 11a7 7 0 0 1 14 0" /><path d="M5 11v3c0 3 3.5 5 7 5s7-2 7-5v-3" /><path d="M8 8l2-4M14 8l2-4" /></>
  ),
  indian: (
    <><path d="M5 12a7 7 0 0 1 14 0" /><path d="M5 12v2c0 3 3.5 5 7 5s7-2 7-5v-2" /><circle cx="12" cy="10" r="2" /><path d="M12 3v5" /></>
  ),
  ramen: (
    <><path d="M5 11a7 7 0 0 1 14 0" /><path d="M5 11v4c0 3 3.5 5 7 5s7-2 7-5v-4" /><path d="M8 4v5M12 3v6M16 4v5" /></>
  ),

  // Western
  american: (
    <><path d="M6 12h12" /><rect x="5" y="7" width="14" height="10" rx="5" /><path d="M5 12h14" /><path d="M8 7V5M16 7V5" /></>
  ),
  burger: (
    <><path d="M5 12h14" /><path d="M6 8c0-2 2.7-4 6-4s6 2 6 4" /><path d="M6 16c0 1.5 2.7 3 6 3s6-1.5 6-3" /><path d="M5 12h14v4H5z" /></>
  ),
  pizza: (
    <><path d="M12 2L3 20h18L12 2z" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="11" r="1" /><circle cx="11" cy="17" r="1" /></>
  ),
  italian: (
    <><path d="M8 21c0-4 0-8 4-12" /><path d="M16 21c0-4 0-8-4-12" /><path d="M12 9c-4-3-7-2-8 0" /><path d="M12 9c4-3 7-2 8 0" /></>
  ),
  french: (
    <><path d="M5 17h14" /><path d="M7 17V9c0-3 2.2-5 5-5s5 2 5 5v8" /><path d="M9 10h6" /></>
  ),
  steak: (
    <><ellipse cx="12" cy="13" rx="8" ry="5" /><path d="M8 11c1-1 3-1 4 0s3 1 4 0" /><line x1="20" y1="4" x2="16" y2="10" /></>
  ),
  german: (
    <><path d="M6 14c0-4 2.7-8 6-8s6 4 6 8" /><path d="M6 14h12" /><path d="M8 14v3M16 14v3" /><circle cx="12" cy="10" r="1" /></>
  ),
  british: (
    <><path d="M6 16c0-1 .5-2 2-2h8c1.5 0 2 1 2 2" /><ellipse cx="12" cy="12" rx="5" ry="3" /><path d="M9 9c.5-2 1.5-3 3-3s2.5 1 3 3" /><line x1="17" y1="9" x2="20" y2="7" /></>
  ),
  spanish: (
    <><circle cx="12" cy="12" r="7" /><path d="M9 10h6v4H9z" /><line x1="8" y1="5" x2="8" y2="8" /><line x1="16" y1="5" x2="16" y2="8" /></>
  ),
  greek: (
    <><path d="M8 4v7c0 2.2 1.8 4 4 4s4-1.8 4-4V4" /><path d="M6 21h12" /><line x1="12" y1="15" x2="12" y2="21" /><path d="M6 4h12" /></>
  ),

  // Latin
  mexican: (
    <><path d="M4 16c0-4 3.5-10 8-10s8 6 8 10" /><line x1="4" y1="16" x2="20" y2="16" /><path d="M9 12h1M14 12h1" /><path d="M10 14h4" /></>
  ),
  brazilian: (
    <><line x1="4" y1="12" x2="20" y2="12" /><path d="M6 12V8c0-1 1-2 2-2h8c1 0 2 1 2 2v4" /><path d="M8 12v5M12 12v5M16 12v5" /></>
  ),

  // Middle Eastern
  turkish: (
    <><path d="M8 4v7c0 2.2 1.8 4 4 4s4-1.8 4-4V4" /><circle cx="12" cy="8" r="2" /><line x1="12" y1="15" x2="12" y2="21" /><line x1="9" y1="21" x2="15" y2="21" /></>
  ),
  kebab: (
    <><line x1="12" y1="2" x2="12" y2="22" /><rect x="9" y="4" width="6" height="3" rx="1" /><rect x="9" y="9" width="6" height="3" rx="1" /><rect x="9" y="14" width="6" height="3" rx="1" /></>
  ),
  lebanese: (
    <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /><path d="M12 5v2M12 17v2M5 12h2M17 12h2" /></>
  ),
  mediterranean: (
    <><ellipse cx="12" cy="14" rx="7" ry="4" /><path d="M12 4c-1 0-2 1-2 3s1 3 2 3 2-1 2-3-1-3-2-3z" /><path d="M14 6c2 0 3 1 3 2" /></>
  ),
  african: (
    <><path d="M5 12a7 7 0 0 1 14 0" /><path d="M5 12v4c0 2 3.5 4 7 4s7-2 7-4v-4" /><path d="M8 12v4M12 12v4M16 12v4" /></>
  ),
  ethiopian: (
    <><circle cx="12" cy="14" r="7" /><path d="M8 14h8" /><path d="M12 8v12" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /></>
  ),

  // Fast food / casual
  fast_food: (
    <><path d="M6 12h12" /><path d="M6 8c0-2 2.7-4 6-4s6 2 6 4v4H6V8z" /><rect x="6" y="12" width="12" height="4" rx="2" /><path d="M10 16v3M14 16v3" /></>
  ),
  chicken: (
    <><path d="M15 6c2 0 4 2 4 4s-2 5-4 7H9c-2-2-4-5-4-7s2-4 4-4" /><path d="M9 17l-1 4M15 17l1 4" /><circle cx="12" cy="8" r="2" /></>
  ),
  sandwich: (
    <><path d="M5 10c0-3 3.1-5 7-5s7 2 7 5" /><line x1="5" y1="10" x2="19" y2="10" /><line x1="5" y1="13" x2="19" y2="13" /><path d="M5 13v1c0 1 1 2 2 2h10c1 0 2-1 2-2v-1" /></>
  ),
  seafood: (
    <><path d="M4 12c2-4 5-6 8-6s6 2 8 6" /><path d="M4 12c2 4 5 6 8 6s6-2 8-6" /><circle cx="8" cy="12" r="1" /><path d="M20 12l3-2M20 12l3 2" /></>
  ),
  fish: (
    <><path d="M4 12c2-4 5-6 8-6s6 2 8 6" /><path d="M4 12c2 4 5 6 8 6s6-2 8-6" /><circle cx="16" cy="11" r="1" /><path d="M2 12l3-2M2 12l3 2" /></>
  ),
  fish_and_chips: (
    <><path d="M3 12c2-3 4-5 7-5s5 2 7 5c-2 3-4 5-7 5s-5-2-7-5z" /><circle cx="13" cy="11" r="1" /><rect x="17" y="8" width="4" height="8" rx="1" /></>
  ),

  // Breakfast / café
  coffee: (
    <><path d="M17 8h1a3 3 0 0 1 0 6h-1" /><path d="M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><line x1="6" y1="2" x2="6" y2="5" /><line x1="10" y1="2" x2="10" y2="5" /><line x1="14" y1="2" x2="14" y2="5" /></>
  ),
  cafe: (
    <><path d="M17 8h1a3 3 0 0 1 0 6h-1" /><path d="M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" /><path d="M6 3c0 1 1 2 2 2s2-1 2-2" /></>
  ),
  breakfast: (
    <><circle cx="12" cy="14" r="7" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="12" r="2" /><path d="M9 16h6" /></>
  ),
  bakery: (
    <><path d="M5 17h14" /><path d="M7 17V9c0-3 2.2-5 5-5s5 2 5 5v8" /><path d="M5 17c0 1.5 3 3 7 3s7-1.5 7-3" /><line x1="10" y1="10" x2="14" y2="10" /></>
  ),

  // Other
  vegetarian: (
    <><path d="M12 22V10" /><path d="M7 3c0 4 2 7 5 9" /><path d="M17 3c0 4-2 7-5 9" /><path d="M9 6c1.5 0 3 .5 3 2" /><path d="M15 6c-1.5 0-3 .5-3 2" /></>
  ),
  vegan: (
    <><path d="M12 22V12" /><path d="M6 2c0 5 3 8 6 10" /><path d="M18 2c0 5-3 8-6 10" /></>
  ),
  ice_cream: (
    <><circle cx="12" cy="8" r="5" /><path d="M8 12l4 10 4-10" /><circle cx="10" cy="7" r="1" /><circle cx="14" cy="9" r="1" /></>
  ),
  dessert: (
    <><path d="M6 16h12" /><path d="M8 16c0-4 1.8-7 4-7s4 3 4 7" /><line x1="12" y1="9" x2="12" y2="6" /><circle cx="12" cy="5" r="1" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="10" y1="16" x2="10" y2="20" /><line x1="14" y1="16" x2="14" y2="20" /></>
  ),

  // Default
  restaurant: (
    <><line x1="8" y1="3" x2="8" y2="10" /><line x1="12" y1="3" x2="12" y2="10" /><line x1="16" y1="3" x2="16" y2="10" /><path d="M6 10c0 2 2 3 4 3h4c2 0 4-1 4-3" /><line x1="12" y1="13" x2="12" y2="21" /></>
  ),
}

// Map cuisine keys to icon keys (some share icons)
const ALIAS = {
  sushi: "japanese",
  regional: "restaurant",
  international: "restaurant",
}

export default function CuisineIcon({ cuisine, size = 24, color = "var(--cream-dim)" }) {
  const key = ALIAS[cuisine] || cuisine
  const paths = ICONS[key] || ICONS.restaurant

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {paths}
    </svg>
  )
}
