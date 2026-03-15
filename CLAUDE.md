# NUTRÏQ — Claude Code Design System

## Project Identity
- App name: NUTRÏQ
- Purpose: Location-based restaurant menu health advisor with AI nutrition coaching
- Stack: React 18 + Vite, Framer Motion, Tailwind CSS, Anthropic Claude API, Overpass API (OSM)
- Fonts: Playfair Display (display/headings), Plus Jakarta Sans (body/UI)

---

## Color Token System (FOOD PSYCHOLOGY — DO NOT DEVIATE)
```
--red:         #E8192C   /* appetite trigger, urgency, primary CTAs, selected states */
--red-glow:    rgba(232,25,44,0.25)
--gold:        #F5B800   /* warmth, cravings, prices, AI coach highlights */
--gold-dim:    rgba(245,184,0,0.15)
--orange:      #FF6B2B   /* energy, comfort food, secondary CTAs, distance badges */
--orange-dim:  rgba(255,107,43,0.15)
--green:       #22C55E   /* HEALTH SIGNALS ONLY — freshness, trust, protein badges */
--green-dim:   rgba(34,197,94,0.12)
--charcoal:    #0E0E0F   /* primary background — makes food look richer */
--surface:     #161618
--surface2:    #1E1E21
--surface3:    #252528
--border:      rgba(255,255,255,0.07)
--cream:       #F5EDD8   /* primary text — warm, not cold white */
--cream-dim:   rgba(245,237,216,0.55)
--muted:       rgba(245,237,216,0.28)
```

**Color rules:**
- Red = action/urgency ONLY (order buttons, selected states, CTAs)
- Gold = value/delight (prices, highlights, AI response labels)
- Orange = secondary energy (badges, distance, supporting CTAs)
- Green = health data ONLY — if it glows green, it's healthy. Reserve this strictly.
- Never use purple, generic blue, or white backgrounds

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
- Spring config bouncy: `{ type: "spring", stiffness: 400, damping: 20 }`

---

## Component Structure
```
src/
  components/
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
    useMenu.js             — AI menu generation via Claude API
    useAnalysis.js         — meal analysis via Claude API
    useFilters.js          — filter state + item matching logic
  lib/
    overpass.js            — Overpass API queries + haversine distance
    claude.js              — Claude API calls (generateMenu, analyzeMeal)
    health.js              — healthScore() + nutrition helpers
    cuisine.js             — emoji/label mapping for OSM cuisine tags
```

---

## Views / Routes
```
/locating   — radar ping animation, awaiting geolocation
/           — restaurant list (home), filter pills, stats
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
- Always include loading skeletons (pulse animation) while fetching
- Always handle location denied gracefully with error banner + fallback UI
- Score ring colors: green ≥75, gold ≥50, red <50 — no exceptions
- Puppeteer `--no-sandbox` flag required if deploying on EC2

---

## Puppeteer QA Workflow
After every UI change:
```bash
pnpm screenshot        # screenshots all routes at 1440px
pnpm screenshot:mobile # screenshots all routes at 390px
pnpm test:hover        # hover interaction tests on cards
```
Screenshots output to `/screenshots/` — review before committing.

---

## Claude API Usage
- Model: `claude-sonnet-4-20250514`
- Menu generation: ~700 tokens per restaurant
- Meal analysis: ~500 tokens per session
- Always strip markdown fences from JSON responses before parsing
- Handle API failures gracefully — show retry UI, never crash

---

## Framer MCP Sync Rules
- Design tokens live in Framer variables — sync to CSS custom properties
- Code components live in `src/components/` — push via MCP after each major update
- Never override Framer layout with CSS position:absolute unless necessary
- AnimatePresence must wrap route outlet for page transitions
- Keep Framer canvas for layout/spacing, React for animation logic

---

## Screenshot Routes (Puppeteer)
```
/                    → home_desktop.png, home_mobile.png
/menu/[first-result] → menu_desktop.png, menu_mobile.png
/analysis            → analysis_desktop.png, analysis_mobile.png
/locating            → locating_desktop.png
```

---

## Prompt Patterns That Work Well
- "Read the RestaurantCard from Framer. Add a staggered entrance so cards drop in one by one with spring physics. Run screenshots after."
- "The health score ring should animate its stroke from 0 to the final value on mount. Use Framer Motion, not CSS. Re-screenshot /menu."
- "Compare before.png and after.png. Did the card spacing improve? Is the red CTA button getting clipped on mobile?"
- "Add scroll-triggered entrance to every MenuItemCard using useInView. Stagger by 0.08s. Spring physics only."
