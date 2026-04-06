# Codebase Structure

**Analysis Date:** 2026-04-06

## Directory Layout

```
nutriq/
├── api/                    # Vercel serverless functions (Edge Runtime)
│   ├── claude.js           # Claude API proxy (keeps ANTHROPIC_API_KEY server-side)
│   └── stripe/
│       ├── checkout.js     # POST: create Stripe Checkout Session → redirect URL
│       ├── verify.js       # GET: verify checkout session → isPro + customerId
│       ├── status.js       # GET: query Redis for Pro status (re-verify on app load)
│       └── webhook.js      # POST: Stripe lifecycle events (grant/revoke Pro via Redis)
├── public/                 # Static assets (favicon, manifest, service worker)
│   ├── favicon.svg         # Brand red "N" icon
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker (network-first caching, offline)
├── scripts/                # QA automation (Puppeteer)
│   ├── screenshot.js       # Capture screenshots across 2 viewports
│   └── interaction-test.js # Hover, selection, filter interactions
├── src/
│   ├── main.jsx            # React DOM entry (BrowserRouter wrapper, service worker)
│   ├── App.jsx             # Route definitions, lazy page loading, layout (Header/Footer/SidePanel)
│   ├── index.css           # Tailwind CSS + custom CSS variables (color tokens, animations)
│   ├── components/         # UI components (32 JSX files)
│   ├── pages/              # Route pages (8 JSX files)
│   ├── hooks/              # Custom state management hooks (9 JS files)
│   └── lib/                # Utilities and integrations (6 JS files)
├── .env                    # Local dev: VITE_CLAUDE_API_KEY (dev only)
├── .env.local              # Git-ignored; developer secrets
├── .env.production         # Built into deployment
├── index.html              # Vite root (single-page app)
├── package.json            # Dependencies, scripts
├── vite.config.js          # Vite + React plugin
├── tsconfig.json           # TypeScript (not used; React app is JSX)
├── vercel.json             # Vercel deployment config
└── .planning/
    └── codebase/           # GSD documentation
```

## Directory Purposes

**api/:**
- Purpose: Vercel Edge Runtime serverless functions
- Contains: Request handlers for Claude API proxying, Stripe payment flow, webhook verification
- Key files: `claude.js` (main AI proxy), `stripe/webhook.js` (HMAC-SHA256 verification)
- Deployment: Automatically deployed by Vercel; edge runtime for sub-100ms response times

**public/:**
- Purpose: Static assets served at root `/`
- Contains: Favicon, PWA manifest, service worker script
- Key files: `sw.js` (offline caching with network-first strategy)
- Committed: Yes (source truth for PWA + favicon)

**scripts/:**
- Purpose: QA automation using Puppeteer
- Contains: Screenshot capture (all routes × 2 viewports), interaction testing (hover, checkbox, filters)
- Key files: `screenshot.js` (runs all routes with localStorage/sessionStorage seeds)
- Execution: `npm run qa` or `npm run screenshot`

**src/components/:**
- Purpose: Reusable UI components
- Contains: 32 JSX files including animations export, layout wrappers (Header, SidePanel, Footer), cards (RestaurantCard, MenuItemCard), modals (UpgradeModal), visuals (ScoreRing, MacroPill, CuisineIcon), loaders (SkeletonLoader)
- Key files: 
  - `animations.jsx` (all Framer Motion exports + spring configs)
  - `Header.jsx` (sticky top nav with theme toggle, notifications, profile)
  - `RestaurantCard.jsx` (Yelp-style card with logo, stars, delivery links)
  - `MenuItemCard.jsx` (dish card with score ring, macro pills, dietary tags, checkbox)
  - `SelectionBar.jsx` (sticky meal tray summary at bottom)
  - `AIAnalysisPanel.jsx` (Claude markdown response renderer)
- Organization: Flat directory (no subdirectories); naming pattern: PascalCase
- Typical size: 150-300 lines per component

**src/pages/:**
- Purpose: Route-driven page views
- Contains: 8 JSX files mapping to app routes
- Key files:
  - `LocatingPage.jsx` (/locating): Radar ping, geolocation trigger
  - `LoginPage.jsx` (/): Auth gate (sign in / sign up)
  - `HomePage.jsx` (/): Red search hero, restaurant list/map
  - `MenuPage.jsx` (/menu/:id): Menu generation, filtering, selection, quotas
  - `AnalysisPage.jsx` (/analysis): Claude coaching, daily progress
  - `SettingsPage.jsx` (/settings): Diet presets, macro sliders, data export
  - `ProfilePage.jsx` (/profile): TDEE calculator (gender, age, height, weight, activity)
  - `TrackerPage.jsx` (/tracker): Daily macro progress rings, meal history
- Organization: Flat directory (no subdirectories); named by route path
- Typical size: 300-500 lines per page (includes layout, hooks composition, state logic)

**src/hooks/:**
- Purpose: Custom React hooks for feature-specific state management
- Contains: 9 JS files (no JSX)
- Key files:
  - `useLocation.js`: Geolocation + Overpass API restaurant fetch
  - `useMenu.js`: Lazy menu generation + session caching
  - `useAuth.js`: localStorage user session (sign up, sign in, sign out)
  - `useGoals.js`: Daily nutrition goals, diet presets, macro tracking
  - `useFilters.js`: 9 nutrition/diet tag filters + matching logic
  - `useTheme.js`: Dark/light toggle with localStorage persistence
  - `useFavorites.js`: Favorite restaurants (localStorage)
  - `useQuota.js`: Free tier usage (3 menus/day, 1 analysis/day) + Stripe Pro integration
  - `useAnalysis.js`: Meal analysis state
- Pattern: Each hook returns `{ state, actions }` (e.g., `{ menu, loading, error, loadMenu, clearMenu }`)
- Size: 50-150 lines per hook (utility-focused)

**src/lib/:**
- Purpose: Utility functions, integrations, constants
- Contains: 6 JS files (no JSX)
- Key files:
  - `claude.js`: Claude API client (dual-mode: direct in dev, proxy in prod)
  - `overpass.js`: Openstreetmap restaurant search (haversine distance, bbox queries, 3-mirror fallback)
  - `health.js`: Health score calculation (0-100 color-coded), distance formatting (km→miles)
  - `cuisine.js`: 40+ cuisine type → emoji + label mappings (OSM amenity tags)
  - `diets.js`: 9 diet presets (Balanced, Cutting, Bulking, Keto, etc.) with macro targets
  - `tdee.js`: TDEE calculator (Mifflin-St Jeor equation, activity multipliers, weight goals)
- Pattern: Pure functions, no state, no side effects
- Size: 50-150 lines per file

**src/index.css:**
- Purpose: Global styles (Tailwind CSS + custom CSS variables)
- Contains: Color tokens (light/dark), typography scale, animations, utility classes
- Key sections:
  - CSS variables: `--red`, `--gold`, `--orange`, `--green`, `--charcoal`, `--surface`, `--border`, `--cream`
  - Tailwind configuration (via `@tailwind` directives)
  - Shimmer animation (@keyframes for SkeletonLoader)
- Size: 100-150 lines

**src/App.jsx:**
- Purpose: Root component and router setup
- Contains: Route definitions, lazy page imports, layout wrapper (Header/Footer/SidePanel), auth gate, onboarding gate, AnimatePresence, ErrorBoundary
- Size: ~100 lines

**src/main.jsx:**
- Purpose: React DOM render entry
- Contains: ReactDOM.createRoot, BrowserRouter, StrictMode, service worker registration
- Size: ~20 lines

## Key File Locations

**Entry Points:**
- `src/main.jsx`: React root → renders `<App/>`
- `src/App.jsx`: Router root → defines all routes, auth gate, onboarding gate
- `index.html`: Vite HTML root (single div id="root")
- `vercel.json`: Deployment config (functions, environment setup)

**Configuration:**
- `package.json`: Dependencies, scripts, metadata
- `vite.config.js`: Vite server config (port 3001, React plugin)
- `index.html`: Entry HTML (Vite transforms; imports main.jsx)
- `.env`: Local dev environment (VITE_CLAUDE_API_KEY)
- `vercel.json`: Vercel settings (function paths, environment config)

**Core Logic:**
- `src/lib/claude.js`: Claude API integration (menu + analysis generation)
- `src/lib/overpass.js`: Restaurant discovery (geolocation → Overpass → enrichment)
- `src/hooks/useQuota.js`: Free/Pro tier logic + Stripe integration
- `src/hooks/useGoals.js`: Daily macro tracking + diet selection
- `api/claude.js`: Serverless proxy (production key storage)
- `api/stripe/`: Payment flow (checkout, verification, webhook, status)

**Testing:**
- `scripts/screenshot.js`: Screenshot QA (all routes, 2 viewports, localStorage seed)
- `scripts/interaction-test.js`: Interaction testing (hover, selection, filter logic)

## Naming Conventions

**Files:**
- Components: `PascalCase.jsx` (e.g., `Header.jsx`, `MenuItemCard.jsx`)
- Hooks: `useCamelCase.js` (e.g., `useLocation.js`, `useGoals.js`)
- Utilities: `camelCase.js` (e.g., `overpass.js`, `health.js`, `claude.js`)
- API handlers: `camelCase.js` (e.g., `checkout.js`, `webhook.js`)
- CSS: `index.css` (global); inline styles in components (no CSS modules)

**Directories:**
- Feature-based: `src/components/`, `src/pages/`, `src/hooks/`, `src/lib/`
- No file-type subdirs (no `src/components/buttons/`, `src/components/cards/` — flat structure)
- Kebab-case for multi-word dirs: `src/` root is exception

**Exports:**
- Named exports for utilities: `export function fetchNearbyRestaurants()`
- Default export for components: `export default function Header()`
- Named exports for hooks: `export function useLocation()`

**Variables:**
- Constants: `UPPERCASE_SNAKE_CASE` (e.g., `CORS_HEADERS`, `FREE_LIMITS`, `STORAGE_KEY`)
- State: `camelCase` (e.g., `restaurants`, `selectedItems`, `isPro`)
- React state: same pattern (e.g., `const [menu, setMenu] = useState()`)

**Types:**
- No TypeScript (JSX app), but JSDoc comments on public APIs
- localStorage keys: `nutriq_*` prefix (e.g., `nutriq_session`, `nutriq_goals`, `nutriq_pro`)
- sessionStorage keys: `nutriq_*` prefix (e.g., `nutriq_restaurants`, `nutriq_location_status`)

## Where to Add New Code

**New Page/Route:**
1. Create `src/pages/NewPage.jsx`
2. Import in `src/App.jsx` (lazy: `const NewPage = lazy(() => import("./pages/NewPage"))`)
3. Add route: `<Route path="/new" element={<NewPage />} />`
4. Page uses custom hooks for state: `const { data, loading } = useFeature()`
5. Wrap layout sections in Framer Motion with `StaggerList` + `fadeUpItem`

**New Component:**
1. Create `src/components/NewComponent.jsx`
2. Define props interface in JSDoc or inline props object
3. Use Framer Motion from `animations.jsx` for all motion (no CSS transitions)
4. Export as default: `export default function NewComponent({ prop1, prop2 }) { ... }`
5. If re-used across pages, add to `src/components/`; if single-page, inline in page

**New Hook:**
1. Create `src/hooks/useNewFeature.js`
2. Pattern: `export function useNewFeature() { const [state, setState] = useState(...); const action = useCallback(...); return { state, action } }`
3. Return object with clear API: `{ data, loading, error, fetchData, clearData }`
4. Use localStorage/sessionStorage for persistence: `const STORAGE_KEY = "nutriq_newfeature"`
5. Lazy-load data on mount via `useEffect` if needed

**New Utility:**
1. Create `src/lib/newutil.js`
2. Pure functions only (no state, no side effects)
3. JSDoc comments on exported functions: `@param {Type} name - Description` and `@returns {Type}`
4. Example: `export function parseData(raw) { ... return clean }`
5. If integrating external API: follow pattern in `claude.js` (dev direct → prod proxy)

**New API Route:**
1. Create `api/newroute.js`
2. Export `config = { runtime: "edge" }` for Edge Runtime
3. Default handler: `export default async function handler(req) { ... }`
4. Return: `new Response(JSON.stringify({ data }), { status: 200, headers: CORS_HEADERS })`
5. Handle CORS: include `Access-Control-Allow-*` headers (see `api/claude.js`)
6. Access env vars: `process.env.ANTHROPIC_API_KEY` (not VITE-prefixed on server)

## Special Directories

**node_modules/:**
- Purpose: Installed dependencies via pnpm
- Generated: Yes (via `pnpm install`)
- Committed: No (gitignore)

**.next/ (if ever added):**
- Purpose: Next.js build output (not currently used; Vite builds to `dist/`)
- Generated: Yes (build step)
- Committed: No (gitignore)

**dist/:**
- Purpose: Vite production build output
- Generated: Yes (via `npm run build`)
- Committed: No (gitignore)

**screenshots/:**
- Purpose: QA automation output (Puppeteer captures)
- Generated: Yes (via `npm run screenshot`)
- Committed: No (gitignore); reviewed ad-hoc in PRs

**.git/:**
- Purpose: Git version control
- Committed: Yes (repo state)

---

*Structure analysis: 2026-04-06*
