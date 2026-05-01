# NUTRÏQ — Claude Code Design System

## Project Identity
- App name: NUTRÏQ
- Purpose: Location-based restaurant menu health advisor with AI nutrition coaching
- Stack: React 18 + Vite, Framer Motion, Tailwind CSS, Leaflet, Lucide React, Anthropic Claude API, Overpass API (OSM)
- Fonts: Fraunces (display/headings, italic primary-green accent), Inter (body/UI)
- Deployed: Vercel at https://nutriq-wine.vercel.app
- Repo: https://github.com/gnukum511/nutriq
- Design language: **Fresh & Organic** — warm cream paper, deep botanical green, soft apricot + tomato callouts. All colors authored in `oklch`.

---

## Color Token System (oklch — semantic only)

> Tokens live in `src/index.css`. Tailwind exposes them as semantic class names (`bg-primary`, `text-foreground`, `bg-card`, etc.) plus legacy aliases (`bg-red`, `bg-gold`, `bg-green`) that point to the new palette so older class strings keep rendering during the visual port.

### Light (default)
```
/* Surfaces */
--background:        oklch(0.985 0.012 95)   /* warm cream paper */
--foreground:        oklch(0.245 0.035 145)  /* deep botanical text */
--card:              oklch(0.995 0.008 95)
--secondary:         oklch(0.94 0.025 92)
--muted:             oklch(0.94 0.018 92)
--muted-foreground:  oklch(0.5 0.022 130)
--border:            oklch(0.9 0.018 95)

/* Brand */
--primary:           oklch(0.45 0.105 150)   /* botanical green CTA */
--primary-soft:      oklch(0.92 0.055 145)   /* selected-state bg */
--leaf:              oklch(0.62 0.13 145)    /* primary band, OK indicator */

/* Accents */
--accent:            oklch(0.88 0.075 65)    /* soft apricot — calories, stars */
--accent-foreground: oklch(0.32 0.06 50)
--tomato:            oklch(0.66 0.16 35)     /* warm callouts — fat, error, urgency */
--cream:             oklch(0.97 0.018 92)
--bark:              oklch(0.32 0.04 70)     /* carbs, secondary text */
```

### Dark (toggled via `useTheme` hook → `.dark` class on root)
```
--background: oklch(0.18 0.02 145)
--foreground: oklch(0.96 0.018 92)
--card:       oklch(0.22 0.025 145)
--primary:    oklch(0.72 0.13 145)
--leaf:       oklch(0.72 0.13 145)
--accent:     oklch(0.4 0.08 60)
--tomato:     oklch(0.7 0.16 35)
--border:     oklch(1 0 0 / 10%)
```

### Gradients & shadows
```
--gradient-hero:     radial cream + apricot/leaf glow (used on all page heroes)
--gradient-leaf:     primary→leaf 135deg (CTAs, brand top stripe, modal headers)
--gradient-warm:     accent→tomato 135deg (PRO badge, score band)
--shadow-soft:       cards, pill buttons
--shadow-elevated:   modals, dropdowns
--shadow-glow:       primary CTA focus halo
--transition-smooth: 400ms cubic-bezier(0.22,1,0.36,1)
```

**Color rules:**
- `primary` / `leaf` (botanical green) = brand mark, primary CTAs, selected states, "Open" indicators, protein
- `accent` (apricot) = stars, calories, gold-tier callouts (replaces old `--gold`)
- `tomato` = warm urgency only — fat counts, errors, "Closed" status (replaces old `--red`)
- `bark` = carb data, neutral secondary text
- `foreground` for all heading/body text — never `#fff` or `#000` directly
- All cards use `var(--shadow-soft)` for organic depth on cream background

---

## UI Design Pattern — Fresh & Organic
- **Cream + radial-gradient orbs** on all main page heroes (Home, Menu, Analysis, Settings, Profile, Tracker) — `var(--gradient-hero)` with apricot/leaf glow
- **Display headings** in Fraunces, weight 500, letter-spacing -0.5, with **italic primary-green accent word** (e.g. "Eat out. *Eat smart.*", "Daily *tracker*")
- **Pill-shaped controls** — buttons, pills, badges all use `borderRadius: 999`
- **`primary-soft` selected states** — restaurant filters, diet presets, side-panel nav
- **Leaf-gradient CTAs** with `shadow-glow` — Save Goals, Sign In, Analyze Meal, Get Started, Upgrade
- **Search-first layout** with embedded search in cream hero
- **Star ratings + review counts + price tiers** on restaurant cards (apricot-fill stars)
- **Open/Closed status** with leaf/tomato dot indicators
- **Cuisine tags + distance badges + delivery links** as cream pill chips with subtle border
- **DoorDash + Uber Eats deep links** on every restaurant
- **Restaurant logos** via Google favicon service, fallback to Lucide cuisine icons
- **Map pins** in leaf-gradient SVG with cream center
- **Header chrome** is backdrop-blurred cream (`backdrop-filter: blur(14px) saturate(140%)`) with primary-green brand mark and avatar

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
    UpgradeModal.jsx       — freemium upgrade modal (Pro features, pricing, Stripe placeholder)
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
    useQuota.js            — freemium API quota (free: 3 menus/day, 1 analysis/day; Pro: unlimited)
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
- NEVER use CSS transitions for component-level motion — Framer Motion only (the global `.transition-smooth` utility for chrome elevations is fine)
- NEVER use Playfair Display, Plus Jakarta Sans, Roboto, or Arial — **Fraunces (display) + Inter (body) only**
- NEVER expose API keys client-side in production — use /api/claude proxy
- NEVER use emoji icons in UI chrome — use Lucide React (strokeWidth={1.5})
- NEVER hardcode color hex strings in components — use semantic tokens (`var(--primary)`, `var(--accent)`, `var(--tomato)`, etc.) or Tailwind semantic classes (`bg-primary`, `text-foreground`, `bg-card`)
- Always include shimmer skeleton loaders while fetching
- Always handle location denied gracefully
- Always display distances in miles (formatDistance helper)
- **Score ring colors:** `leaf` ≥75, `accent-foreground` (apricot deep) ≥50, `tomato` <50
- **All pages use the cream `var(--gradient-hero)` hero banner** with apricot/leaf radial glow
- Primary CTA buttons use `var(--gradient-leaf)` background + `var(--shadow-glow)`

---

## API Architecture
- **Dev:** Client → Claude API directly (VITE_CLAUDE_API_KEY from .env)
- **Production:** Client → /api/claude → Vercel Edge Runtime → Claude API
- **Env vars:** ANTHROPIC_API_KEY (Vercel), VITE_CLAUDE_API_KEY (.env local)
- Model: `claude-sonnet-4-6`
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

## Active Work
- **Organic redesign shipped** (17cd176, 2026-04-30) — full visual port from `nutriq-redo-glow`: oklch tokens, Fraunces+Inter fonts, cream/leaf/apricot/tomato palette, restyled hero banners + cards + CTAs. Live at https://nutriq-wine.vercel.app. Backend integrations (Overpass, Claude, Stripe, Upstash) untouched. Reference clone kept at `../nutriq-redo-glow`.
- **BLOCKED: Upstash Redis not provisioned** — run `vercel integration add upstash/upstash-kv`, accept terms in browser; Vercel injects `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` automatically
- All Redis code deployed (20f00dd): webhook.js grants/revokes Pro, verify.js writes on checkout, status.js polls on load, useQuota.js re-verifies on mount
- Preview env vars missing — Vercel CLI plugin blocks adds; must do via Vercel Dashboard → Settings → Environment Variables
- `useAuth.js` has uncommitted test user seed (`apptest@nutriiq.com` / `password123!`) — intentional for QA
- Stripe live key rolled 2026-04-05; new key in `.env` and Vercel production
- **Codebase mapped** (ca1de94, 2026-04-06) — `.planning/codebase/` has STACK, INTEGRATIONS, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, CONCERNS docs (note: STACK doc still describes pre-redesign palette/fonts — refresh on next codebase map)

## Stripe Integration
```
api/stripe/
  checkout.js   — POST: creates Checkout Session, returns redirect URL
  verify.js     — GET: verifies ?session_id= on return from Stripe
  webhook.js    — POST: receives lifecycle events, verifies HMAC-SHA256
```
- Success URL: `https://nutriq-wine.vercel.app/?session_id={CHECKOUT_SESSION_ID}`
- Pro status: verified client-side via /api/stripe/verify → stored in localStorage `nutriq_pro`
- Monthly: price_1TIGHZANF8XrNJ2lfkTZFfoA ($4.99/mo) | Annual: price_1TIGHZANF8XrNJ2lAjtI5PEO ($39.99/yr)
- Webhook ID: we_1TIGHZANF8XrNJ2l8qdaMRJi | Product: prod_UGntPwCQw1fcWm

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
