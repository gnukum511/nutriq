# NUTRÏQ — Claude Code Design System

## Project Identity
- App name: NUTRÏQ
- Purpose: Location-based restaurant menu health advisor with AI nutrition coaching
- Stack: React 18 + Vite, Framer Motion, Tailwind CSS, Anthropic Claude API, Overpass API (OSM)
- Fonts: Playfair Display (display/headings), Plus Jakarta Sans (body/UI)
- Deployed: Vercel at https://nutriq-wine.vercel.app
- Repo: https://github.com/gnukum511/nutriq

---

## Color Token System (LIGHT THEME — Food Psychology Accents)
```
--red:         #D91429   /* appetite trigger, urgency, primary CTAs, selected states */
--red-glow:    rgba(217,20,41,0.12)
--gold:        #C99400   /* warmth, cravings, prices, AI coach highlights */
--gold-dim:    rgba(201,148,0,0.1)
--orange:      #E8581F   /* energy, comfort food, secondary CTAs, distance badges */
--orange-dim:  rgba(232,88,31,0.1)
--green:       #1BA34D   /* HEALTH SIGNALS ONLY — freshness, trust, protein badges */
--green-dim:   rgba(27,163,77,0.08)
--charcoal:    #FAFAF8   /* primary background — warm off-white */
--surface:     #FFFFFF   /* card backgrounds */
--surface2:    #F5F4F1   /* selected/hover states */
--surface3:    #ECEAE6   /* scrollbar, dividers */
--border:      rgba(0,0,0,0.08)
--cream:       #1A1A1A   /* primary text — dark on light */
--cream-dim:   rgba(26,26,26,0.55)
--muted:       rgba(26,26,26,0.3)
```

**Color rules:**
- Red = action/urgency ONLY (order buttons, selected states, CTAs)
- Gold = value/delight (prices, highlights, AI response labels)
- Orange = secondary energy (badges, distance, supporting CTAs)
- Green = health data ONLY — if it's green, it's healthy. Reserve strictly.
- Cards get subtle box-shadow for depth on light background
- Never use purple, generic blue, or dark backgrounds

---

## Animation Rules (ALL via Framer Motion — no CSS transitions)
- Page entrance: staggered fadeUp with spring physics
- Hover: subtle scale(1.02) + border color shift, 200ms
- CTAs: scale(0.97) on press, spring bounce on release
- Route transitions: AnimatePresence with slide + fade
- Skeleton loaders: pulse opacity animation
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
    RestaurantCard.jsx     — location list item, tap to open menu
    MenuItemCard.jsx       — individual dish with macro pills + health score ring
    ScoreRing.jsx          — SVG health score donut (0-100, color-coded)
    MacroPill.jsx          — cal/protein/carbs/fat badge
    FilterPills.jsx        — High Protein | Low Calorie | Low Carb | Balanced
    CategoryTabs.jsx       — horizontal scroll tab bar
    SelectionBar.jsx       — sticky meal tray summary
    AIAnalysisPanel.jsx    — Claude response renderer with markdown support
    SkeletonLoader.jsx     — pulse loading states for restaurant + menu
    LocationPin.jsx        — animated radar ping for locating screen
  hooks/
    useLocation.js         — geolocation + Overpass API fetch
    useMenu.js             — AI menu generation via Claude API (session-cached)
    useAnalysis.js         — meal analysis via Claude API
    useFilters.js          — filter state + item matching logic
  lib/
    overpass.js            — Overpass API queries (bbox, 5-mile radius, 3 mirror fallback)
    claude.js              — Claude API calls (proxy in prod, direct in dev)
    health.js              — healthScore() + nutrition helpers + formatDistance (miles)
    cuisine.js             — 40+ emoji/label mappings for OSM cuisine tags
  pages/
    LocatingPage.jsx       — radar ping, triggers geolocation, redirects to /
    HomePage.jsx           — hero, stats bar, rescan button, restaurant list
    MenuPage.jsx           — category tabs, filters, menu items, selection bar
    AnalysisPage.jsx       — meal totals, item list, AI coaching panel
api/
  claude.js                — Vercel Edge Runtime proxy (keeps API key server-side)
```

---

## Views / Routes
```
/locating   — radar ping animation, awaiting geolocation
/           — restaurant list (home), filter pills, stats, rescan button
/menu/:id   — lazy-loaded AI menu for selected restaurant
/analysis   — AI nutrition coaching panel
```

---

## Critical Constraints
- NEVER mock restaurant data — always fetch from Overpass API using user coordinates
- NEVER pre-load all menus — generate via Claude API lazily when user taps restaurant
- NEVER use CSS transitions — Framer Motion only
- NEVER use Inter, Roboto, or Arial — Playfair Display + Plus Jakarta Sans only
- NEVER use purple gradients or generic "AI app" aesthetics
- NEVER hardcode nutrition data — Claude generates contextually per restaurant cuisine
- NEVER expose API keys client-side in production — use /api/claude proxy
- Always include loading skeletons (pulse animation) while fetching
- Always handle location denied gracefully with error banner + fallback UI
- Always display distances in miles (formatDistance helper)
- Score ring colors: green ≥75, gold ≥50, red <50 — no exceptions

---

## API Architecture
- **Dev:** Client calls Claude API directly using VITE_CLAUDE_API_KEY from .env
- **Production:** Client calls /api/claude → Vercel Edge Runtime proxy → Claude API
- The proxy reads ANTHROPIC_API_KEY from Vercel environment variables
- Model: `claude-sonnet-4-20250514`
- Menu generation: ~1200 max tokens per restaurant
- Meal analysis: ~600 max tokens per session
- Always strip markdown fences from JSON responses before parsing

---

## Overpass API
- Search radius: 5 miles (8.05 km)
- Uses bounding box queries (faster than `around:` at large radii)
- Single `nwr` regex query for restaurant, fast_food, cafe
- 3 mirror fallback: kumi.systems → overpass-api.de → maps.mail.ru
- Results enriched with cuisine emoji/labels from cuisine.js

---

## Puppeteer QA Workflow
After every UI change:
```bash
pnpm screenshot        # screenshots all routes at 1440px
pnpm screenshot:mobile # screenshots all routes at 390px
pnpm test:interactions  # hover interaction tests on cards
pnpm qa                # both at once
```
Screenshots output to `/screenshots/` — review before committing.

---

## Custom Skills
```
/scaffold [all|routes|components|hooks|lib|config]  — scaffold app structure
/qa [screenshots|interactions|all]                   — run Puppeteer QA + review
/component ComponentName                             — create/update a component
/review-screenshots [path|all]                       — visual review of PNGs
```

---

## Screenshot Routes (Puppeteer)
```
/                    → home_desktop.png, home_mobile.png
/menu/[first-result] → menu_desktop.png, menu_mobile.png
/analysis            → analysis_desktop.png, analysis_mobile.png
/locating            → locating_desktop.png
```
