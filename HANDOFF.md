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
| Location data | Overpass API (OpenStreetMap) — 5-mile radius, 3 mirrors |
| AI | Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel (static + Edge Runtime serverless) |
| QA | Puppeteer screenshots + interaction tests |

## Architecture
```
Browser
  ├── /locating        → useLocation() → Overpass API → restaurants
  ├── /                → restaurant list with filters
  ├── /menu/:id        → useMenu() → /api/claude → Claude API → menu items
  └── /analysis        → useAnalysis() → /api/claude → Claude API → coaching

Vercel
  └── /api/claude      → Edge Runtime proxy → Claude API (key stays server-side)
```

## Environment Variables
| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_CLAUDE_API_KEY` | `.env` (local only) | Direct Claude API access in dev |
| `ANTHROPIC_API_KEY` | Vercel dashboard | Server-side proxy key for production |

## Key Files
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full design system spec — colors, animations, constraints |
| `WORKFLOW.md` | Build workflow guide — Framer MCP, QA, prompt playbook |
| `src/components/animations.jsx` | All Framer Motion animation exports |
| `src/lib/overpass.js` | Overpass API with bbox queries + mirror fallback |
| `src/lib/claude.js` | Claude API client (proxy in prod, direct in dev) |
| `src/lib/health.js` | Health score algorithm + formatDistance (miles) |
| `src/lib/cuisine.js` | 40+ OSM cuisine → emoji/label mappings |
| `api/claude.js` | Vercel Edge Runtime proxy for Claude API |

## Local Development
```bash
pnpm install
# Add your API key to .env:
# VITE_CLAUDE_API_KEY=sk-ant-...
pnpm dev              # → http://localhost:3001
```

## QA
```bash
pnpm screenshot       # all routes, 3 viewports
pnpm test:interactions # hover, selection, filters, mobile
pnpm qa               # both
```

## Design Decisions
- **Light theme** — user preference over original dark spec
- **Miles** — all distances in miles, not km
- **No mocked data** — restaurants always from Overpass, menus always from Claude
- **Lazy menu generation** — menus generated on tap, cached in session
- **Edge Runtime proxy** — keeps API key server-side, no client exposure
- **3 Overpass mirrors** — kumi.systems → overpass-api.de → mail.ru fallback
- **Framer Motion only** — zero CSS transitions anywhere in the app

## Known Issues
- Vercel CLI requires interactive terminal for login (can't run from Claude Code shell)
- Overpass API can timeout at peak hours — mitigated by mirror fallback
- Menu generation takes 2-5 seconds — shown with skeleton + spinner
