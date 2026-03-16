# NUTRÏQ — Handoff Document

## What is this?
NUTRÏQ is an AI-powered, location-based restaurant nutrition advisor with personalized macro tracking. Users allow location access, see nearby restaurants (via OpenStreetMap), tap one to generate an AI menu with nutrition data (via Claude API), filter/select items, get AI coaching, and track macros against their diet regimen. DoorDash and Uber Eats deep links let users order directly.

## Live
- **URL:** https://nutriq-wine.vercel.app
- **Repo:** https://github.com/gnukum511/nutriq
- **Deploys:** Auto on push to `master` via Vercel

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, Framer Motion 11 |
| Styling | Tailwind CSS 3, CSS custom properties |
| Icons | Lucide React (strokeWidth 1.5) |
| Fonts | Playfair Display (headings), Plus Jakarta Sans (body) |
| Maps | Leaflet + react-leaflet 4 (OpenStreetMap tiles) |
| Location data | Overpass API (OpenStreetMap) — 5-mile radius, 3 mirrors |
| AI | Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel (static + Edge Runtime serverless) |
| Offline | Service worker (network-first caching) |
| QA | Puppeteer screenshots (desktop + mobile) |

## Architecture
```
Browser
  ├── Onboarding        → first-time welcome (4 slides)
  ├── Login             → localStorage auth (sign in/up)
  ├── /locating         → useLocation() → Overpass API → restaurants
  ├── /                 → red search hero, restaurant list/map, macro summary
  ├── /menu/:id         → red restaurant banner, AI menu + dietary tags
  ├── /analysis         → red header, macro cards, AI coaching, daily progress
  ├── /settings         → diet regimen (9 presets), macro sliders, data mgmt
  ├── /profile          → body stats → TDEE calculator → personalized macros
  └── /tracker          → circular progress rings, today's meals, history

Vercel
  └── /api/claude       → Edge Runtime proxy → Claude API (key server-side)
```

## Features
- Yelp-inspired UI with red gradient hero banners across all pages
- Location-based restaurant discovery (5-mile radius)
- Restaurant cards: favicon logos, star ratings, price tiers, open/closed status
- DoorDash + Uber Eats deep links on every restaurant
- AI-generated menus with nutrition data + dietary tags
- 9 filters: High Protein, Low Calorie, Low Carb, Balanced, Keto, Gluten-Free, Paleo, Vegan, Allergy-Safe
- Search restaurants by name/cuisine, sort by distance/A-Z/cuisine
- List/map view toggle (Leaflet with pin drops + hover tooltips)
- Meal selection with checkbox indicators → AI nutrition coaching
- Profile page: gender, age, height/weight, activity level, weight goal
- TDEE calculator (Mifflin-St Jeor) for male/female with personalized macros
- 9 diet presets: Custom, Balanced, Cutting, Bulking, Keto, High Protein, Low Carb, Vegan, Paleo
- Daily macro tracker with circular progress rings + over-budget warnings
- Macro summary strip on home page linking to full tracker
- Daily nutrition goals with animated progress bars
- Meal history (last 20, localStorage)
- Meal comparison (side-by-side nutrition diff)
- Favorites (heart on cards, listed in side panel)
- Share/copy meal analysis
- Dark/light theme toggle
- Language selector (8 languages)
- First-time onboarding carousel
- localStorage auth (sign in/up/out)
- PWA support (Add to Home Screen)
- Offline caching via service worker
- Lucide React icons throughout (no emojis in UI chrome)
- Error boundary for crash recovery
- Lazy-loaded pages (React.lazy + Suspense)
- Shimmer skeleton loaders

## Environment Variables
| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_CLAUDE_API_KEY` | `.env` (local only) | Direct Claude API in dev |
| `ANTHROPIC_API_KEY` | Vercel dashboard | Server-side proxy in prod |

## Key Files
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full design system spec |
| `src/components/animations.jsx` | All Framer Motion animation exports |
| `src/components/Header.jsx` | Sticky header with Lucide icons + dropdowns |
| `src/components/RestaurantCard.jsx` | Yelp-style card with logos, ratings, delivery links |
| `src/components/RestaurantLogo.jsx` | Favicon from website, CuisineIcon fallback |
| `src/components/CuisineIcon.jsx` | Lucide icons mapped to 30+ cuisine types |
| `src/components/DeliveryLinks.jsx` | DoorDash + Uber Eats deep links |
| `src/lib/overpass.js` | Overpass API with bbox + mirror fallback |
| `src/lib/claude.js` | Claude API client (proxy/direct) |
| `src/lib/tdee.js` | TDEE/BMR calculator (Mifflin-St Jeor) |
| `src/lib/diets.js` | 9 diet presets with macro targets |
| `src/hooks/useGoals.js` | Diet presets, daily tracking, progress, remaining |
| `src/hooks/useAuth.js` | localStorage auth (sign in/up/out) |
| `src/pages/ProfilePage.jsx` | Body stats → TDEE → personalized macros |
| `src/pages/TrackerPage.jsx` | Circular progress rings, meal log |
| `api/claude.js` | Vercel Edge Runtime proxy |

## Local Development
```bash
npm install
# Add API key to .env:
# VITE_CLAUDE_API_KEY=sk-ant-...
npm run dev              # → http://localhost:3001
```

## QA
```bash
npm run screenshot       # all routes, desktop + mobile viewports
npm run test:interactions # hover, selection, filters
npm run qa               # both
```
Screenshot script auto-seeds localStorage (onboarded + auth) and sessionStorage (restaurants + coords) to bypass gates.

## Custom Skills
```
/scaffold    — scaffold app structure per CLAUDE.md
/qa          — run Puppeteer QA + review screenshots
/component   — create/update component per design system
/review-screenshots — visual review of PNGs
/sync-memory — sync CLAUDE.md, HANDOFF.md, memory files
```

## Design Decisions
- **Yelp-inspired UI** — red gradient hero banners, star ratings, price tiers, delivery links
- **Light theme default** with dark mode toggle — user preference
- **Miles** for all distances
- **No mocked data** — restaurants from Overpass, menus from Claude
- **Lazy menu generation** — generated on tap, cached in session
- **Edge Runtime proxy** — API key never client-side in production
- **3 Overpass mirrors** — fallback for reliability
- **Framer Motion only** — zero CSS transitions
- **Lucide React icons** — consistent 1.5px stroke, no emojis in UI chrome
- **Google favicon service** — restaurant logos from website URL, CuisineIcon fallback
- **TDEE calculator** — Mifflin-St Jeor equation for male/female personalization
- **JSON salvage** — recovers truncated Claude menu responses
- **react-leaflet v4** — v5 requires React 19

## Known Issues
- Overpass API can timeout at peak hours (mitigated by mirrors)
- Menu generation takes 2-5s (shown with shimmer + spinner)
- react-leaflet v5 peer dep warning (using v4 for React 18 compat)
- Restaurant "ratings" and "price tiers" are pseudo-generated from name (not real data)
- Delivery links search by name — may not find exact match on DoorDash/Uber Eats
