# NUTRÏQ — Handoff Document

## What is this?
NUTRÏQ is an AI-powered, location-based restaurant nutrition advisor. Users allow location access, see nearby restaurants (via OpenStreetMap), tap one to generate an AI menu with nutrition data (via Claude API), filter/select items, and get AI coaching on their meal.

## Live
- **URL:** https://nutriq-wine.vercel.app
- **Repo:** https://github.com/gnukum511/nutriq
- **Deploys:** Auto on push to `master` via Vercel

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 5, Framer Motion 11 |
| Styling | Tailwind CSS 3, CSS custom properties |
| Fonts | Playfair Display (headings), Plus Jakarta Sans (body) |
| Maps | Leaflet + react-leaflet 4 (OpenStreetMap tiles) |
| Location data | Overpass API (OpenStreetMap) — 5-mile radius, 3 mirrors |
| AI | Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel (static + Edge Runtime serverless) |
| Offline | Service worker (network-first caching) |
| QA | Puppeteer screenshots + interaction tests |

## Architecture
```
Browser
  ├── Onboarding        → first-time welcome (4 slides)
  ├── /locating         → useLocation() → Overpass API → restaurants
  ├── /                 → restaurant list/map, search/sort, favorites
  ├── /menu/:id         → useMenu() → /api/claude → menu items + dietary tags
  ├── /analysis         → useAnalysis() → /api/claude → AI coaching
  └── /settings         → goal editor, data management

Vercel
  └── /api/claude       → Edge Runtime proxy → Claude API (key server-side)
```

## Features
- Location-based restaurant discovery (5-mile radius)
- AI-generated menus with nutrition data + dietary tags
- 9 filters: High Protein, Low Calorie, Low Carb, Balanced, Keto, Gluten-Free, Paleo, Vegan, Allergy-Safe
- Search restaurants by name/cuisine, sort by distance/A-Z/cuisine
- List/map view toggle (Leaflet with pin drops + hover tooltips)
- Meal selection → AI nutrition coaching
- Daily nutrition goals with animated progress bars
- Meal history (last 20, localStorage)
- Meal comparison (side-by-side nutrition diff)
- Favorites (heart on cards, listed in side panel)
- Share/copy meal analysis
- Dark/light theme toggle
- Language selector (8 languages)
- First-time onboarding carousel
- PWA support (Add to Home Screen)
- Offline caching via service worker
- Settings page (goal sliders, clear history, reset)
- Header with notifications, profile, dashboard
- Side navigation panel with daily stats + favorites
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
| `WORKFLOW.md` | Build workflow guide (Framer MCP, Puppeteer QA) |
| `src/components/animations.jsx` | All Framer Motion animation exports |
| `src/components/Header.jsx` | Sticky header with dropdowns |
| `src/components/SidePanel.jsx` | Slide-in nav with favorites + stats |
| `src/components/Onboarding.jsx` | Welcome carousel |
| `src/lib/overpass.js` | Overpass API with bbox + mirror fallback |
| `src/lib/claude.js` | Claude API client (proxy/direct) |
| `src/lib/health.js` | Health score + formatDistance |
| `src/hooks/useTheme.js` | Dark/light theme with CSS var swapping |
| `src/hooks/useGoals.js` | Daily nutrition tracking |
| `src/hooks/useFavorites.js` | Restaurant favorites |
| `src/pages/SettingsPage.jsx` | Goal editor + data management |
| `api/claude.js` | Vercel Edge Runtime proxy |

## Local Development
```bash
pnpm install
# Add API key to .env:
# VITE_CLAUDE_API_KEY=sk-ant-...
pnpm dev              # → http://localhost:3001
```

## QA
```bash
pnpm screenshot       # all routes, 3 viewports
pnpm test:interactions # hover, selection, filters, mobile
pnpm qa               # both
```

## Custom Skills
```
/scaffold    — scaffold app structure per CLAUDE.md
/qa          — run Puppeteer QA + review screenshots
/component   — create/update component per design system
/review-screenshots — visual review of PNGs
/sync-memory — sync CLAUDE.md, HANDOFF.md, memory files
```

## Design Decisions
- **Light theme default** with dark mode toggle — user preference
- **Miles** for all distances
- **No mocked data** — restaurants from Overpass, menus from Claude
- **Lazy menu generation** — generated on tap, cached in session
- **Edge Runtime proxy** — API key never client-side in production
- **3 Overpass mirrors** — fallback for reliability
- **Framer Motion only** — zero CSS transitions
- **JSON salvage** — recovers truncated Claude menu responses
- **react-leaflet v4** — v5 requires React 19

## Known Issues
- Vercel CLI requires interactive terminal for login
- Overpass API can timeout at peak hours (mitigated by mirrors)
- Menu generation takes 2-5s (shown with shimmer + spinner)
- react-leaflet v5 peer dep warning (using v4 for React 18 compat)

## Commit History (19 commits)
See `git log --oneline` for full history. Major milestones:
- `7abb757` Initial scaffold
- `ce54842` Dietary filters
- `50a7c22` Map view
- `910087a` Onboarding
- `581ce12` Theme toggle, favorites, error boundary
- `adb7548` Settings, meal comparison, offline caching
