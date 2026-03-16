# NUTRÏQ — Claude Code Design System

## Project Identity
- App name: NUTRÏQ
- Purpose: Location-based restaurant menu health advisor with AI nutrition coaching
- Stack: React 18 + Vite, Framer Motion, Tailwind CSS, Leaflet, Lucide React, Anthropic Claude API, Overpass API (OSM)
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
- Red = action/urgency ONLY (CTAs, selected states, hero banners)
- Gold = value/delight (prices, highlights, AI labels, calorie counts)
- Orange = secondary energy (badges, distance, fat counts)
- Green = health data ONLY (protein, open status, tracked meals)
- Cards get subtle box-shadow for depth on light background

---

## UI Design Pattern — Yelp-Inspired
- **Red gradient hero banners** on all main pages (Home, Menu, Analysis, Settings, Profile, Tracker)
- **Search-first layout** with embedded search bar in hero
- **Star ratings + review counts + price tiers** on restaurant cards (pseudo-generated from name)
- **Open/Closed status** with green/red dot indicators
- **Cuisine tags + distance badges + delivery links** on each card
- **DoorDash + Uber Eats deep links** on every restaurant
- **Restaurant logos** via Google favicon service, fallback to Lucide cuisine icons
- **Consistent red header pattern**: gradient 135deg, var(--red) to #B5101F, radial light overlay

---

## Animation Rules (ALL via Framer Motion — no CSS transitions)
- Page entrance: staggered fadeUp with spring physics
- Hover: subtle scale(1.02) + border color shift
- CTAs: scale(0.97) on press, spring bounce on release
- Route transitions: AnimatePresence with slide + fade
- Skeleton loaders: CSS shimmer gradient animation
- Health score rings: draw on mount with easeOut
- Tracker progress rings: animated strokeDasharray on mount
- Never use CSS `transition:` — always Framer Motion
- Spring config standard: `{ type: "spring", stiffness: 300, damping: 24 }`
- Spring config bouncy: `{ type: "spring", stiffness: 420, damping: 20 }`

---

## Component Structure
```
src/
  components/
    animations.jsx         — ALL animation exports (StaggerList, Pressable, etc.)
    Header.jsx             — sticky header: logo, language, theme (Lucide icons), notifications, profile
    SidePanel.jsx          — slide-in nav: routes, daily stats, favorites, settings
    Onboarding.jsx         — 4-slide first-time welcome carousel
    RestaurantCard.jsx     — Yelp-style card: logo, stars, price, status, delivery links
    RestaurantLogo.jsx     — favicon from website, fallback to CuisineIcon
    RestaurantMap.jsx      — Leaflet map with pin drop markers + hover tooltips
    CuisineIcon.jsx        — Lucide React icons mapped to 30+ cuisine types
    DeliveryLinks.jsx      — DoorDash + Uber Eats deep links (pill + compact variants)
    MenuItemCard.jsx       — dish with macro pills, score ring, dietary tags, checkbox
    ScoreRing.jsx          — SVG health score donut (0-100)
    MacroPill.jsx          — cal/protein/carbs/fat badge
    FilterPills.jsx        — 9 filters: nutrition + dietary
    CategoryTabs.jsx       — horizontal scroll tab bar
    SelectionBar.jsx       — sticky meal tray summary
    AIAnalysisPanel.jsx    — Claude response renderer with markdown
    MealComparison.jsx     — side-by-side meal nutrition diff
    SkeletonLoader.jsx     — shimmer loading cards
    LocationPin.jsx        — radar ping for locating screen
    Footer.jsx             — brand name + version
    ErrorBoundary.jsx      — React crash recovery UI
  hooks/
    useLocation.js         — geolocation + Overpass API fetch
    useMenu.js             — AI menu generation (session-cached)
    useAnalysis.js         — AI meal analysis
    useFilters.js          — 9 filter options + item matching
    useGoals.js            — daily nutrition goals, diet presets, tracking, progress
    useTheme.js            — dark/light theme toggle
    useFavorites.js        — restaurant favorites (localStorage)
    useAuth.js             — localStorage auth (sign in/up/out)
  lib/
    overpass.js            — Overpass API (bbox, 5mi, 3 mirrors)
    claude.js              — Claude API (proxy in prod, direct in dev)
    health.js              — healthScore() + formatDistance (miles)
    cuisine.js             — 40+ emoji/label mappings for OSM tags
    diets.js               — 9 diet presets (Keto, Cutting, Bulking, etc.) with macro targets
    tdee.js                — TDEE calculator (Mifflin-St Jeor), BMR, macro recommendations
  pages/
    LocatingPage.jsx       — radar ping, triggers geolocation
    LoginPage.jsx          — sign in / sign up with localStorage auth
    HomePage.jsx           — red search hero, restaurant cards, macro summary strip
    MenuPage.jsx           — red restaurant banner, categories, filters, menu items
    AnalysisPage.jsx       — red header, macro stat cards, AI coaching, daily progress
    SettingsPage.jsx       — diet regimen selector (9 presets), macro sliders, data management
    ProfilePage.jsx        — gender, age, height, weight, activity, weight goal → TDEE calculator
    TrackerPage.jsx        — circular macro progress rings, today's meals, history
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
/           — red search hero, restaurant list/map, macro summary strip
/menu/:id   — red restaurant banner, AI menu with categories, dietary tags, selection bar
/analysis   — red header, macro stat cards, AI coaching, daily progress, history, comparison
/settings   — red header, diet regimen selector (9 presets), macro sliders, data management
/profile    — red header, body stats (gender/age/height/weight), activity, weight goal, TDEE calc
/tracker    — red header, circular progress rings, today's meals, meal history
```

---

## Critical Constraints
- NEVER mock restaurant data — always Overpass API
- NEVER pre-load menus — generate via Claude API lazily on tap
- NEVER use CSS transitions — Framer Motion only
- NEVER use Inter, Roboto, or Arial — Playfair Display + Plus Jakarta Sans only
- NEVER expose API keys client-side in production — use /api/claude proxy
- NEVER use emoji icons in UI chrome — use Lucide React (strokeWidth={1.5})
- Always include shimmer skeleton loaders while fetching
- Always handle location denied gracefully
- Always display distances in miles (formatDistance helper)
- Score ring colors: green ≥75, gold ≥50, red <50
- All pages use consistent red gradient hero banner

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
- Extracts: name, cuisine, phone, website, lat, lon

---

## Diet & Macro System
- 9 diet presets: Custom, Balanced, Cutting, Bulking, Keto, High Protein, Low Carb, Vegan, Paleo
- TDEE calculation: Mifflin-St Jeor equation (male/female)
- Activity levels: Sedentary, Light, Moderate, Very Active, Athlete
- Weight goals: Lose Fast (-750), Lose (-500), Lose Slow (-250), Maintain, Gain Slow (+250), Gain (+500)
- Protein: scaled by body weight × activity multiplier
- Fat: 25-30% of target calories
- Carbs: remaining calories after protein + fat
- Daily tracking with progress rings and over-budget warnings

---

## Dietary Filters
Nutrition-based: High Protein, Low Calorie, Low Carb, Balanced
Diet-based: Keto, Gluten-Free, Paleo, Vegan, Allergy-Safe
Claude generates tags per item: keto, gluten-free, paleo, vegan, vegetarian, dairy-free, nut-free, shellfish-free

---

## Delivery Integration
- DoorDash: `https://www.doordash.com/search/store/{name}/`
- Uber Eats: `https://www.ubereats.com/search?q={name}`
- Deep links on RestaurantCard (pill variant) and MenuPage header (compact variant)
- Opens in new tab, does not trigger card click (stopPropagation)

---

## Icon System
- UI icons: Lucide React (`lucide-react`), strokeWidth={1.5}
- Header: Moon/Sun, Bell, LayoutGrid, Home, Settings, LogOut
- Cuisine: Beef, Pizza, Fish, Coffee, Soup, Flame, Salad, etc. (30+ mappings in CuisineIcon.jsx)
- Restaurant logos: Google favicon service (`google.com/s2/favicons?domain=...&sz=64`), fallback to CuisineIcon

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
npm run screenshot      # all routes, 2 viewports (desktop + mobile)
npm run test:interactions  # hover, selection, filters
npm run qa              # both
```
Screenshot script seeds localStorage (onboarded + auth) and sessionStorage (restaurants + coords) to bypass onboarding and auth gates.

---

## Framer MCP
- Connected via `mcp-remote` with `http-first` transport
- Portfolio site (separate from NUTRÏQ) — personal portfolio for gnukum511
- ScrollAnimations.tsx override file created for scroll-triggered entrances
- 404 page redesigned with message + Go Home button
