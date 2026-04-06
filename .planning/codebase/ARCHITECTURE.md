# Architecture

**Analysis Date:** 2026-04-06

## Pattern Overview

**Overall:** Layered frontend architecture with lazy-loaded pages, custom React hooks for state management, and Vercel Edge serverless API proxies.

**Key Characteristics:**
- Component-driven UI with Framer Motion animations exclusively
- Custom hook composition pattern for feature isolation (location, menu, quota, goals, filters, theme, auth)
- Session-based caching for restaurant menus (single-request generation per restaurant per session)
- Geolocation → Overpass API → Claude AI → Cached menu rendering pipeline
- Stripe integration via Vercel serverless functions with Redis for Pro status persistence

## Layers

**Presentation Layer:**
- Purpose: UI components, animations, user interactions
- Location: `src/components/`, `src/pages/`
- Contains: React JSX components (32 files), Framer Motion animations, layout wrappers
- Depends on: Custom hooks, utility libraries (lucide-react, leaflet)
- Used by: React Router-driven page navigation, lazy-loaded via code splitting

**State Management Layer:**
- Purpose: Feature-specific state logic using custom React hooks
- Location: `src/hooks/`
- Contains: useLocation, useMenu, useAuth, useGoals, useFilters, useTheme, useFavorites, useQuota, useAnalysis
- Depends on: localStorage, sessionStorage, external API services
- Used by: Pages and components consume hooks via custom composition

**API/Integration Layer:**
- Purpose: External service communication and data transformation
- Location: `src/lib/`, `api/`
- Contains: Claude API client, Overpass API wrapper, Stripe handlers, health calculations, diet definitions, cuisine mappings
- Depends on: fetch (browser), Vercel Edge Runtime
- Used by: Hooks layer calls these utilities; API routes expose endpoints

**Data Transformation Layer:**
- Purpose: Calculations, formatting, schema parsing
- Location: `src/lib/health.js`, `src/lib/tdee.js`, `src/lib/diets.js`, `src/lib/cuisine.js`
- Contains: Health score calculations, TDEE formulas, diet presets, cuisine emoji mappings, distance formatting
- Depends on: Pure functions, no external state
- Used by: Hooks and components for rendering and validation

## Data Flow

**Geolocation → Restaurant Discovery:**

1. User enters app, sees LocatingPage with radar animation
2. Geolocation API requests permission; on grant, coordinates captured
3. `useLocation` hook calls `fetchNearbyRestaurants()` via Overpass API
4. Overpass returns JSON elements; hook enriches with cuisine emoji/labels via `getCuisineInfo()`
5. Results stored in sessionStorage (`nutriq_restaurants`, `nutriq_coords`, `nutriq_location_status`)
6. HomePage loads, displays restaurant cards in list/map view with sorting and search

**Menu Generation → Selection → Analysis:**

1. User clicks restaurant card → MenuPage loads restaurant from sessionStorage
2. `useMenu` hook checks session cache (`window.__nutriqMenuCache[id]`)
3. If cached, loads instantly (no quota cost, no API call)
4. If not cached, `useQuota` checks free tier limit (3 menus/day)
5. If quota available, calls `generateMenu()` → `/api/claude` proxy → Claude API
6. Claude returns 8-10 items with nutrition; hook enriches with health scores
7. Menu cached in `window.__nutriqMenuCache` and sessionStorage
8. User selects items → SelectionBar tracks selection
9. Click "Analyze" → MenuPage calls `analyzeMeal()` → Claude API → AnalysisPage displays markdown response
10. `useGoals` tracks daily macro totals; user can log meal to daily tracker

**Pro Upgrade Flow:**

1. Free user hits menu or analysis quota limit
2. UpgradeModal shown; user clicks "Upgrade" → `useQuota.startCheckout()`
3. POST `/api/stripe/checkout` → creates Stripe Session → returns redirect URL
4. User redirected to Stripe Checkout, completes payment
5. Stripe Checkout success → redirects to `/?session_id=cs_...`
6. `useQuota` effect triggers → `GET /api/stripe/verify?session_id=` → verifies with Stripe → returns `isPro: true, customerId`
7. `isPro: true` stored in localStorage (`nutriq_pro`)
8. On every app load, `GET /api/stripe/status?customer_id=` re-verifies via Redis (catches cancellations)
9. Pro status = unlimited menu + analysis requests

**State Management:**

- **Authentication:** `useAuth` manages localStorage user session (`nutriq_session`, `nutriq_users`)
- **Location:** `useLocation` stores coords and restaurants in sessionStorage (bypassed by QA seed)
- **Menu Cache:** `window.__nutriqMenuCache` in-memory per session, no persistence
- **Daily Goals:** `useGoals` tracks calories, protein, carbs, fat → localStorage (`nutriq_goals`, `nutriq_daily_totals`)
- **Favorites:** `useFavorites` stores liked restaurants in localStorage (`nutriq_favorites`)
- **Quota:** `useQuota` tracks free tier usage daily → localStorage (`nutriq_quota`, `nutriq_pro`)
- **Theme:** `useTheme` toggles dark/light → localStorage (`nutriq_theme`)

## Key Abstractions

**Custom Hooks (Feature Isolation):**
- Each hook encapsulates a feature domain (location, menu, auth, goals, filters, theme, favorites, quota, analysis)
- Hooks export state + actions; components compose them to build pages
- Example: `useGoals()` returns `{goals, activeDiet, dailyTotals, updateGoals, selectDiet, addMealToDaily, remaining, progress, overBudget}`

**Animated Components (Framer Motion Centralization):**
- `src/components/animations.jsx` exports all motion primitives: `spring`, `staggerContainer`, `fadeUpItem`, `StaggerList`, `PageTransition`, `ScrollReveal`, `Skeleton`
- All transitions use spring physics; zero CSS transitions in codebase
- Page routes wrapped in `AnimatePresence` + `PageTransition` for consistent slide/fade entry/exit

**API Integration Pattern (Proxy + Direct Fallback):**
- `src/lib/claude.js` routes to `/api/claude` in production, direct Claude API in dev
- Prod: browser → Vercel Edge proxy → Claude (key server-side)
- Dev: browser → Claude direct (key from `.env`)

**Restaurant Enrichment (Lazy Embedding):**
- Overpass API returns raw OSM data; hook enriches with `getCuisineInfo()` to add emoji and labels
- `RestaurantCard` uses Google favicon service + fallback to `CuisineIcon` lookup
- Pseudo-values (rating, reviews, price tier) deterministically derived from name hash (consistent UX)

**Menu Generation → Caching Strategy:**
- First generation via Claude costs quota + API latency
- Subsequent visits to same restaurant return cached menu instantly (in-memory, session-scoped)
- Session cache stored in `window.__nutriqMenuCache` (cleared on page reload)
- Ideal for frequent restaurant revisits

## Entry Points

**App Root:**
- Location: `src/main.jsx`
- Triggers: Browser load
- Responsibilities: React DOM render, BrowserRouter setup, service worker registration (offline caching in production)

**App Component:**
- Location: `src/App.jsx`
- Triggers: Router navigation
- Responsibilities: Route definitions, lazy page loading, header/footer layout, auth gate, onboarding gate, AnimatePresence wrapper, error boundary

**LocatingPage:**
- Location: `src/pages/LocatingPage.jsx`
- Triggers: First app entry (no `nutriq_onboarded` in localStorage) or manual rescan
- Responsibilities: Radar ping animation, geolocation request, Overpass API call via `useLocation`, stores results in sessionStorage, redirects to HomePage on success

**HomePage:**
- Location: `src/pages/HomePage.jsx`
- Triggers: `/` route (after auth + onboarding)
- Responsibilities: Red search hero, restaurant list/map view, filtering by cuisine/distance/name, sorting, favorites toggle, daily macro summary strip

**MenuPage:**
- Location: `src/pages/MenuPage.jsx`
- Triggers: `/menu/:id` route (restaurant selected)
- Responsibilities: Menu generation (lazy + cached), filtering by 9 nutrition/diet tags, category tabs, item selection, SelectionBar, quota enforcement, Stripe upgrade modal

**AnalysisPage:**
- Location: `src/pages/AnalysisPage.jsx`
- Triggers: `/analysis` route (user navigates from home or menu)
- Responsibilities: Claude-generated nutrition coaching, macro stat cards, daily progress, meal history, side-by-side meal comparison

## Error Handling

**Strategy:** Try-catch at integration points; graceful fallbacks; user-friendly error messages

**Patterns:**
- `useLocation`: Catches geolocation denial, Overpass API timeouts; displays "Location unavailable" or "All servers down" with rescan button
- `useMenu`: JSON salvage fallback (if Claude response truncated, closes array and re-parses)
- `useQuota`: Network failures on Pro verification don't penalize user (keeps localStorage state)
- `callClaude`: Returns error message from /api/claude proxy; UI shows "API error" modal
- `fetchNearbyRestaurants`: Tries 3 Overpass mirrors in sequence; throws "All servers unavailable" if all fail

## Cross-Cutting Concerns

**Logging:** No logging framework installed; `console.log` avoided per rules. For debugging: use Chrome DevTools.

**Validation:** 
- User input validated at form submission (LoginPage, SettingsPage, ProfilePage)
- API responses validated by JSON schema (e.g., Claude menu must be array of items with `id`, `name`, `cal`, `protein`, `carbs`, `fat`)
- Health score calculation validates all numeric values are present

**Authentication:** 
- Client-side localStorage-based (not production-grade; local dev/QA only)
- Simple hash-based password (not secure; test users only: `apptest@nutriiq.com` / `password123!`)
- Session tracked in localStorage (`nutriq_session`); cleared on signOut

**Theme:**
- `useTheme` toggles CSS variable scope via `--nutriq-theme` attribute on root
- Light theme (default): warm cream + gold accents
- Dark theme: charcoal + cream text
- Persisted to localStorage (`nutriq_theme`)

**Animations:**
- Framer Motion exclusively; zero CSS `transition:` rules
- Spring physics applied to all motion: `{ stiffness: 300, damping: 24 }` (standard), `{ stiffness: 420, damping: 20 }` (bouncy)
- Page transitions via `AnimatePresence` + `pageVariants`; staggered lists via `StaggerList` + `fadeUpItem`

---

*Architecture analysis: 2026-04-06*
