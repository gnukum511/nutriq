# Coding Conventions

**Analysis Date:** 2026-04-06

## Naming Patterns

**Files:**
- Components: PascalCase with .jsx extension — `RestaurantCard.jsx`, `MenuItemCard.jsx`, `Header.jsx`
- Hooks: camelCase with `use` prefix and .js extension — `useAuth.js`, `useLocation.js`, `useMenu.js`
- Utilities/Libraries: camelCase with .js extension — `health.js`, `claude.js`, `overpass.js`
- API routes: camelCase with .js extension — `claude.js`, `webhook.js`, `verify.js`

**Functions and Constants:**
- React components: PascalCase — `function RestaurantCard()`, `export default function HomePage()`
- Functions/utilities: camelCase — `hashPassword()`, `getUsers()`, `formatDistance()`
- Constants: UPPER_SNAKE_CASE or SCREAMING_SNAKE_CASE — `const USERS_KEY = "nutriq_users"`, `const FREE_LIMITS = { menu: 3 }`
- Hook return object keys: camelCase — `{ user, signIn, signUp, signOut, isAuthenticated }`
- API handler exports: `export default async function handler(req)` — standard Vercel Edge Runtime pattern

**Variables:**
- State variables: camelCase — `const [restaurants, setRestaurants]`, `const [isPro, setIsPro]`
- Boolean variables: prefix with `is`, `can`, or `has` — `isAuthenticated`, `canUse`, `hasError`
- Temporary variables in loops: single letters acceptable — `for (let i = 0; i < 5; i++)`
- Cached data references: descriptive, underscore prefix for internal cache — `window.__nutriqMenuCache`

**Types/Data:**
- No TypeScript used; JSDoc comments used sparingly when complexity requires
- Object property names: camelCase — `{ firstName, lastName, createdAt, customerId }`
- API response shapes documented in function comments — see `generateMenu()` in `src/lib/claude.js`
- CSS custom properties: kebab-case — `--red`, `--surface`, `--font-display`

## Code Style

**Formatting:**
- No Prettier/ESLint config present
- Indentation: 2 spaces (implied by codebase)
- Line length: implied ~100 characters (soft limit)
- Semicolons: always used
- Quotes: double quotes for strings throughout

**Linting:**
- No linter configured; follow conventional JavaScript standards
- console.log statements appear in development but should not ship to production
- No unused imports detected; codebase is clean

**Import Organization:**

Order (top to bottom):
1. React/framework imports — `import { useState, useEffect } from "react"`
2. Third-party libraries — `import { motion } from "framer-motion"`, `import { useNavigate } from "react-router-dom"`
3. Local components — `import Header from "./components/Header"`
4. Local hooks — `import { useAuth } from "./hooks/useAuth"`
5. Utilities/libraries — `import { formatDistance } from "../lib/health"`

**Path Aliases:**
- No aliases configured; relative imports used throughout
- Parent traversal typical: `../lib/health`, `../components/animations`

## Error Handling

**Patterns:**

Try-catch for API calls:
```javascript
// claude.js — API error handling with fallback
try {
  const data = await res.json()
  return data.text
} catch {
  const err = await res.json().catch(() => ({}))
  throw new Error(err.error || `API error: ${res.status}`)
}
```

User-facing error messages stored in state:
```javascript
// useAuth.js — validation errors with clear messages
if (users.find((u) => u.email === email.toLowerCase())) {
  return { error: "An account with this email already exists" }
}
```

Geolocation errors with permission-specific handling:
```javascript
// useLocation.js — specific error codes for different failure modes
if (err.code === err.PERMISSION_DENIED) {
  setStatus("denied")
  setError("Location access denied. Please enable location permissions.")
}
```

JSON parsing with salvage fallback:
```javascript
// claude.js — truncated JSON recovery
try {
  return JSON.parse(cleaned)
} catch {
  const lastComplete = cleaned.lastIndexOf("}")
  if (lastComplete > 0) {
    const salvaged = cleaned.slice(0, lastComplete + 1) + "]"
    return JSON.parse(salvaged)
  }
  throw new Error("Failed to parse menu data")
}
```

Silently fallback for non-critical failures:
```javascript
// useQuota.js — network failure tolerance for quota verification
.catch(() => {
  // Network failure — keep existing localStorage state; don't penalise the user
})
```

## Logging

**Framework:** No dedicated logging library; console methods not used in production code paths

**Patterns:**
- Development: inline console statements acceptable for debugging
- Production: errors thrown and caught at page/component level
- User feedback: stored in component state (`const [error, setError]`) and rendered to UI
- No server-side logs in Edge Runtime functions; errors returned in JSON responses

Example pattern from `api/claude.js`:
```javascript
if (!apiKey) {
  return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured on server" }), {
    status: 500, headers: CORS_HEADERS,
  })
}
```

## Comments

**When to Comment:**
- Function purpose: JSDoc-style header comments on public exports
- Complex algorithms: explain the "why" not the "what" — see `healthScore()` in `src/lib/health.js`
- Non-obvious state transitions: brief inline comments — see "Seed a test user on first load" in `useAuth.js`
- Business logic constraints: document why a condition exists — see quota limits in `useQuota.js`

**JSDoc/TSDoc:**
Minimal usage; added when function behavior is non-obvious:

```javascript
/**
 * Calculate a health score (0-100) for a menu item
 * Higher protein, lower calories, moderate carbs/fat = higher score
 *
 * Scoring breakdown:
 * - Protein density (protein per calorie): 0-35 points
 * - Calorie moderation: 0-30 points
 * - Fat moderation: 0-20 points
 * - Carb moderation: 0-15 points
 */
export function healthScore({ cal, protein, carbs, fat }) {
  // ...
}
```

Comments above state declarations for clarity:
```javascript
// Seed a test user on first load
function seedTestUser() {
  // ...
}
```

## Function Design

**Size:** Functions average 20-40 lines; largest is ~100 lines (API proxy handlers are acceptable)

**Parameters:**
- Prefer object parameters for multiple values — `function healthScore({ cal, protein, carbs, fat })`
- Single required argument passed directly — `function pseudoRating(name)`
- Optional config objects with defaults — `radiusKm = 8.05` in `fetchNearbyRestaurants()`

**Return Values:**
- Hooks return objects with clear keys — `{ user, signUp, signIn, signOut, isAuthenticated }`
- API functions return data or throw — no null returns; prefer throwing errors
- Utility functions return computed values — `healthScore()` returns number, `formatDistance()` returns string
- Status functions return status strings — `status` in `useLocation()` is "locating" | "located" | "denied" | "error"

**Immutability (CRITICAL):**
- Spread operator for state updates — `{ ...user, name }`
- Array mutations via spread — `[...users, newUser]`
- Never mutate passed-in objects — `saveUsers([...users, newUser])` not `users.push(newUser)`
- Set state with new objects, not mutations — `setQuota(prev => ({ ...base, [feature]: base[feature] + 1 }))`

## Module Design

**Exports:**
- Named exports for utilities and hooks — `export function useAuth()`, `export function healthScore()`
- Default export for components — `export default function RestaurantCard()`
- Single hook/utility per file typical; `lib/` files may group related helpers

**Barrel Files:**
- Not used; direct imports from source files

**Closure and Caching:**
- Session cache via window global — `window.__nutriqMenuCache = {}`
- LocalStorage for persistent client-side state — `localStorage.getItem("nutriq_theme")`
- SessionStorage for temporary page state — `sessionStorage.getItem("nutriq_restaurants")`

## Framer Motion Patterns

**All animations through Framer Motion — zero CSS transitions in the codebase**

Spring configs centralized in `src/components/animations.jsx`:
```javascript
export const spring = {
  standard: { type: "spring", stiffness: 300, damping: 24 },
  bouncy:   { type: "spring", stiffness: 420, damping: 20 },
  slow:     { type: "spring", stiffness: 180, damping: 28 },
  snappy:   { type: "spring", stiffness: 500, damping: 30 },
}
```

Component animation patterns:
- Container stagger — `StaggerList` wrapper with `staggerContainer` variants
- Item entry — `fadeUpItem` or `fadeInItem` variants with custom index delay
- Hover/tap — `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`
- Page transitions — wrapped in `PageTransition` with `pageVariants`

## Storage Conventions

**LocalStorage keys (persistent across sessions):**
- `nutriq_users` — user accounts array (hashed passwords)
- `nutriq_session` — current logged-in user
- `nutriq_onboarded` — boolean flag for first-time onboarding
- `nutriq_theme` — "light" | "dark"
- `nutriq_quota` — daily API usage { date, menu, analysis }
- `nutriq_pro` — "true" if Pro subscription active
- `nutriq_customer_id` — Stripe customer ID for quota re-verification
- `nutriq_favorites` — array of favorite restaurant IDs
- `nutriq_goals` — user nutrition goals and profile data

**SessionStorage keys (cleared on page refresh):**
- `nutriq_location_status` — "locating" | "located" | "denied" | "error"
- `nutriq_restaurants` — array of fetched restaurants (Overpass API result)
- `nutriq_coords` — user coordinates { lat, lon }
- `nutriq_location_error` — geolocation error message
- `nutriq_selected_restaurant` — currently selected restaurant object

---

*Convention analysis: 2026-04-06*
