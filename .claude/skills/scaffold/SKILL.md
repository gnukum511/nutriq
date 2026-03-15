---
name: scaffold
description: Scaffold the full NUTRÏQ app structure — Vite config, Tailwind, index.html, main.jsx, App.jsx, all routes, components, hooks, and lib modules per CLAUDE.md spec
disable-model-invocation: true
argument-hint: [all | routes | components | hooks | lib | config]
allowed-tools:
  - Write
  - Edit
  - Read
  - Bash
  - Glob
---

# Scaffold NUTRÏQ App Structure

Scaffold the NUTRÏQ application based on the architecture defined in `CLAUDE.md`.

## What to scaffold (based on $ARGUMENTS, default "all"):

### `config` — Build tooling
- `vite.config.js` — React plugin, dev server port 3001
- `tailwind.config.js` — custom colors from CLAUDE.md token system, fonts (Playfair Display, Plus Jakarta Sans)
- `postcss.config.js` — Tailwind + Autoprefixer
- `index.html` — entry point with Google Fonts links for Playfair Display + Plus Jakarta Sans
- `src/index.css` — CSS custom properties for ALL color tokens from CLAUDE.md, Tailwind directives, base styles (charcoal bg, cream text)

### `routes` — Page components
- `src/pages/LocatingPage.jsx` — RadarPing animation, geolocation pending state
- `src/pages/HomePage.jsx` — restaurant list, FilterPills, stats bar, WordReveal hero
- `src/pages/MenuPage.jsx` — lazy-loaded AI menu for selected restaurant, CategoryTabs, MenuItemCards, SelectionBar
- `src/pages/AnalysisPage.jsx` — AI nutrition coaching panel, selected meal summary

### `components` — UI components (use animations.jsx exports)
- `RestaurantCard.jsx` — uses Pressable + restaurantCardVariants, shows cuisine emoji, distance badge (orange), rating
- `MenuItemCard.jsx` — uses menuItemVariants, MacroPill row, AnimatedScoreRing, selectable
- `ScoreRing.jsx` — wrapper around AnimatedScoreRing
- `MacroPill.jsx` — cal/protein/carbs/fat badge with color coding
- `FilterPills.jsx` — High Protein | Low Calorie | Low Carb | Balanced, uses filterPillVariants, data-filter attributes
- `CategoryTabs.jsx` — horizontal scroll tab bar, data-cat attributes
- `SelectionBar.jsx` — uses SelectionBarMotion, sticky meal tray summary with analyze CTA
- `AIAnalysisPanel.jsx` — Claude response renderer with markdown support
- `SkeletonLoader.jsx` — uses SkeletonCard for loading states
- `LocationPin.jsx` — uses RadarPing

### `hooks` — Custom React hooks
- `useLocation.js` — navigator.geolocation + Overpass API fetch via `lib/overpass.js`
- `useMenu.js` — AI menu generation via `lib/claude.js`, loading/error states
- `useAnalysis.js` — meal analysis via `lib/claude.js`, loading/error states
- `useFilters.js` — filter state (highProtein, lowCalorie, lowCarb, balanced) + item matching logic

### `lib` — Utility modules
- `overpass.js` — Overpass API queries for nearby restaurants + haversine distance calc
- `claude.js` — Claude API calls (generateMenu, analyzeMeal) using claude-sonnet-4-20250514
- `health.js` — healthScore() algorithm + nutrition helpers
- `cuisine.js` — emoji/label mapping for OSM cuisine tags

### `app` — App shell
- `src/main.jsx` — React root with BrowserRouter
- `src/App.jsx` — route definitions with AnimatePresence + PageTransition wrapper

## Rules
- ALWAYS use Framer Motion from `animations.jsx` — NEVER CSS transitions
- Use CLAUDE.md color tokens as CSS custom properties — never hardcode colors
- Add `data-testid` and `data-filter` / `data-cat` attributes for Puppeteer QA
- Playfair Display for headings, Plus Jakarta Sans for body
- Score ring colors: green ≥75, gold ≥50, red <50
- Handle loading states with SkeletonCard/Skeleton components
- Handle location denied with error banner + fallback UI
