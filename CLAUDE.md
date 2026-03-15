# NUTRÏQ — Claude Code Design System

## Project Identity
- App name: NUTRÏQ
- Purpose: Location-based restaurant menu health advisor with AI nutrition coaching
- Stack: React 18 + Vite, Framer Motion, Tailwind CSS, Leaflet, Anthropic Claude API, Overpass API (OSM)
- Fonts: Playfair Display (display/headings), Plus Jakarta Sans (body/UI)
- Deployed: Vercel at https://nutriq-wine.vercel.app
- Repo: https://github.com/gnukum511/nutriq

---

## Color Token System (Light Theme — with Dark Mode toggle)

### Light (default)
```
--red:         #D91429
--red-glow:    rgba(217,20,41,0.12)
--gold:        #C99400
--gold-dim:    rgba(201,148,0,0.1)
--orange:      #E8581F
--orange-dim:  rgba(232,88,31,0.1)
--green:       #1BA34D
--green-dim:   rgba(27,163,77,0.08)
--charcoal:    #FAFAF8    /* warm off-white background */
--surface:     #FFFFFF    /* card backgrounds */
--surface2:    #F5F4F1    /* selected/hover states */
--surface3:    #ECEAE6    /* scrollbar, dividers */
--border:      rgba(0,0,0,0.08)
--cream:       #1A1A1A    /* primary text */
--cream-dim:   rgba(26,26,26,0.55)
--muted:       rgba(26,26,26,0.3)
```

### Dark (toggled via useTheme hook)
```
--charcoal:    #0E0E0F
--surface:     #161618
--surface2:    #1E1E21
--surface3:    #252528
--border:      rgba(255,255,255,0.07)
--cream:       #F5EDD8
--cream-dim:   rgba(245,237,216,0.55)
--muted:       rgba(245,237,216,0.28)
```

**Color rules:**
- Red = action/urgency ONLY (CTAs, selected states)
- Gold = value/delight (prices, highlights, AI labels)
- Orange = secondary energy (badges, distance)
- Green = health data ONLY
- Cards get subtle box-shadow for depth on light background

---

## Animation Rules (ALL via Framer Motion — no CSS transitions)
- Page entrance: staggered fadeUp with spring physics
- Hover: subtle scale(1.02) + border color shift
- CTAs: scale(0.97) on press, spring bounce on release
- Route transitions: AnimatePresence with slide + fade
- Skeleton loaders: CSS shimmer gradient animation
- Health score rings: draw on mount with easeOut
- Never use CSS `transition:` — always Framer Motion
- Spring config standard: `{ type: "spring", stiffness: 300, damping: 24 }`
- Spring config bouncy: `{ type: "spring", stiffness: 420, damping: 20 }`

---

## Component Structure
```
src/
  components/
    animations.jsx         — ALL animation exports (StaggerList, Pressable, etc.)
    Header.jsx             — sticky header: logo, language, theme, notifications, profile
    SidePanel.jsx          — slide-in nav: routes, daily stats, favorites, settings
    Onboarding.jsx         — 4-slide first-time welcome carousel
    RestaurantCard.jsx     — location list item with favorites heart
    RestaurantMap.jsx      — Leaflet map with pin drop markers + hover tooltips
    MenuItemCard.jsx       — dish with macro pills, score ring, dietary tags
    ScoreRing.jsx          — SVG health score donut (0-100)
    MacroPill.jsx          — cal/protein/carbs/fat badge
    FilterPills.jsx        — 9 filters: nutrition + dietary
    CategoryTabs.jsx       — horizontal scroll tab bar
    SelectionBar.jsx       — sticky meal tray summary
    AIAnalysisPanel.jsx    — Claude response renderer with markdown
    MealComparison.jsx     — side-by-side meal nutrition diff
    SkeletonLoader.jsx     — shimmer loading cards
    LocationPin.jsx        — radar ping for locating screen
    Footer.jsx             — credits + version
    ErrorBoundary.jsx      — React crash recovery UI
  hooks/
    useLocation.js         — geolocation + Overpass API fetch
    useMenu.js             — AI menu generation (session-cached)
    useAnalysis.js         — AI meal analysis
    useFilters.js          — 9 filter options + item matching
    useGoals.js            — daily nutrition goals + tracking
    useTheme.js            — dark/light theme toggle
    useFavorites.js        — restaurant favorites (localStorage)
  lib/
    overpass.js            — Overpass API (bbox, 5mi, 3 mirrors)
    claude.js              — Claude API (proxy in prod, direct in dev)
    health.js              — healthScore() + formatDistance (miles)
    cuisine.js             — 40+ emoji/label mappings for OSM tags
  pages/
    LocatingPage.jsx       — radar ping, triggers geolocation
    HomePage.jsx           — hero, search/sort, list/map toggle, restaurant cards
    MenuPage.jsx           — categories, filters, menu items, restaurant details
    AnalysisPage.jsx       — totals, AI coaching, daily progress, history, comparison
    SettingsPage.jsx       — goal sliders, data management
api/
  claude.js                — Vercel Edge Runtime proxy
public/
  favicon.svg              — brand red "N" icon
  manifest.json            — PWA manifest
  sw.js                    — service worker (network-first caching)
```

---

## Views / Routes
```
/locating   — radar ping, awaiting geolocation
/           — restaurant list/map, search, sort, filters, favorites
/menu/:id   — AI menu with categories, dietary tags, selection bar
/analysis   — meal totals, AI coaching, daily progress, history, comparison
/settings   — goal editor, data management, reset options
```

---

## Critical Constraints
- NEVER mock restaurant data — always Overpass API
- NEVER pre-load menus — generate via Claude API lazily on tap
- NEVER use CSS transitions — Framer Motion only
- NEVER use Inter, Roboto, or Arial — Playfair Display + Plus Jakarta Sans only
- NEVER expose API keys client-side in production — use /api/claude proxy
- Always include shimmer skeleton loaders while fetching
- Always handle location denied gracefully
- Always display distances in miles (formatDistance helper)
- Score ring colors: green ≥75, gold ≥50, red <50

---

## API Architecture
- **Dev:** Client → Claude API directly (VITE_CLAUDE_API_KEY from .env)
- **Production:** Client → /api/claude → Vercel Edge Runtime → Claude API
- **Env vars:** ANTHROPIC_API_KEY (Vercel), VITE_CLAUDE_API_KEY (.env local)
- Model: `claude-sonnet-4-20250514`
- Menu: 2000 max tokens, 8-10 items with dietary tags
- Analysis: 600 max tokens
- JSON salvage fallback for truncated responses

---

## Overpass API
- Radius: 5 miles (8.05 km), bounding box queries
- Single `nwr` regex for restaurant, fast_food, cafe
- 3 mirror fallback: kumi.systems → overpass-api.de → mail.ru

---

## Dietary Filters
Nutrition-based: High Protein, Low Calorie, Low Carb, Balanced
Diet-based: Keto, Gluten-Free, Paleo, Vegan, Allergy-Safe
Claude generates tags per item: keto, gluten-free, paleo, vegan, vegetarian, dairy-free, nut-free, shellfish-free

---

## Custom Skills
```
/scaffold [all|routes|components|hooks|lib|config]
/qa [screenshots|interactions|all]
/component ComponentName
/review-screenshots [path|all]
/sync-memory [all|claude-md|handoff|memory]
```

---

## Puppeteer QA
```bash
pnpm screenshot        # all routes, 3 viewports
pnpm test:interactions  # hover, selection, filters, mobile
pnpm qa                # both
```

---

## Framer MCP Sync Rules
- Design tokens live in Framer variables — sync to CSS custom properties
- Code components live in `src/components/` — push via MCP
- AnimatePresence must wrap route outlet for page transitions
- Keep Framer canvas for layout/spacing, React for animation logic
