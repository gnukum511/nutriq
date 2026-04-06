# Testing Patterns

**Analysis Date:** 2026-04-06

## Test Framework

**Status:** No unit/integration test framework currently configured

**Current QA Approach:**
- Puppeteer-based screenshot and interaction testing via npm scripts
- No Jest, Vitest, Mocha, or similar test runner
- Manual/automated interaction testing preferred over unit tests
- Codebase is too young for full test suite (proof-of-concept stage)

**Run Commands:**
```bash
npm run screenshot       # Capture desktop + mobile screenshots of all routes
npm run screenshot:mobile  # Mobile-only screenshots
npm run test:interactions  # Puppeteer-based hover/selection/filter tests
npm run qa               # Both screenshot + interaction tests
npm run clean:screenshots # Reset screenshots directory
```

**Puppeteer Configuration:**
- Script location: `scripts/screenshot.js`, `scripts/interaction-test.js`
- Uses headless browser automation to seed localStorage/sessionStorage
- Bypasses onboarding and auth gates for testing all pages
- Generates PNG snapshots for visual regression detection

## Test File Organization

**Not Applicable** — No unit/integration test files present

**Where tests would go (if framework adopted):**
- `src/__tests__/` — Unit tests for utilities, hooks, components
- `src/hooks/__tests__/` — Hook tests (state, side effects)
- `src/lib/__tests__/` — Utility function tests (health scoring, distance calc, API parsing)
- `e2e/` — End-to-end tests (critical user flows)

**Naming Convention:**
- Test files: `*.test.js`, `*.spec.js` (following Vitest/Jest convention if added)
- Puppeteer scripts: `scripts/screenshot.js`, `scripts/interaction-test.js` (already established)

## Test Structure

**Puppeteer-Based Testing (Current Approach):**

From `scripts/screenshot.js`:
```javascript
// Seeds localStorage to bypass auth and onboarding
localStorage.setItem("nutriq_onboarded", "true")
localStorage.setItem("nutriq_session", JSON.stringify({
  id: "test-user-001",
  name: "Test User",
  email: "test@nutriq.com"
}))

// Seeds sessionStorage with mock restaurant data
sessionStorage.setItem("nutriq_location_status", "located")
sessionStorage.setItem("nutriq_restaurants", JSON.stringify(mockRestaurants))
sessionStorage.setItem("nutriq_coords", JSON.stringify({ lat: 40.7128, lon: -74.0060 }))
```

Routes tested:
- `/locating` — radar ping animation, geolocation trigger
- `/` (HomePage) — restaurant list, search, filtering, sorting
- `/menu/:id` (MenuPage) — AI menu generation, item selection, health scores
- `/analysis` — meal analysis, macro totals, AI coaching
- `/settings` — diet presets, macro sliders
- `/profile` — body stats entry, TDEE calculator
- `/tracker` — circular progress rings, daily meal history

**Interaction Test Pattern:**

From `scripts/interaction-test.js`:
```javascript
// Hover effects on restaurant cards
await page.hover('[data-testid="restaurant-card"]')
await page.waitForTimeout(300) // Allow Framer Motion animation

// Click to select menu items
await page.click('[data-testid="menu-item"]')

// Filter activation
await page.click('[data-testid="filter-pill"]')

// Screenshot after each interaction
await page.screenshot({ path: `screenshots/interactions/filter-active.png` })
```

## Mocking

**Not Currently Used** — Puppeteer tests use real Overpass API and Claude API calls

**Where mocks would be needed (if unit tests added):**
- `fetchNearbyRestaurants()` from Overpass API — mock with static GeoJSON
- `generateMenu()` and `analyzeMeal()` from Claude API — mock with fixed JSON responses
- `navigator.geolocation` — mock in unit tests to test success/denied/error paths
- `localStorage` and `sessionStorage` — mock for state isolation between tests
- Framer Motion animations — disable for faster test runs via `process.env.MOTION_SKIP=true`

## Fixtures and Factories

**Test Data:**

localStorage seed (from `scripts/screenshot.js`):
```javascript
const testUser = {
  id: "test-user-001",
  name: "Test User",
  email: "test@nutriq.com",
  createdAt: "2026-01-01T00:00:00.000Z"
}

const mockRestaurants = [
  {
    id: "rest-001",
    name: "The Grill House",
    cuisine: "steakhouse",
    cuisineLabel: "Steakhouse",
    emoji: "🥩",
    distance: 0.2,
    phone: "+1-555-0123",
    website: "https://grillhouse.local",
    lat: 40.7138,
    lon: -74.0050
  },
  // ... more mock restaurants
]
```

**Test User:**
- Hard-coded in `src/hooks/useAuth.js` for QA purposes
- Email: `apptest@nutriiq.com`
- Password: `password123!` (simple hash for localStorage demo)
- Auto-seeded on first app load; can sign in with these credentials

**Location:**
- Fixtures embedded in Puppeteer scripts (`scripts/`)
- SessionStorage data serialized as JSON before test navigation
- Routes detected via `data-testid` attributes on interactive elements

## Coverage

**Requirements:** No minimum coverage enforced; codebase is too early-stage for coverage thresholds

**View Coverage:**
Not applicable — coverage tools not configured

**Coverage Gaps (Identified):**
- No tests for error recovery paths (JSON salvage, API retry fallbacks)
- No tests for quota system edge cases (free tier limits, Pro upgrade flow)
- No tests for theme switching, localStorage persistence, session state
- No tests for animation timing or interaction feedback
- No E2E tests for Stripe checkout flow (webhook verification, Redis state)

## Test Types

**Unit Tests (Not Implemented):**

Would test:
- `healthScore()` with various nutrition data inputs
- `formatDistance()` with km values
- `matchesFilter()` with different filter types and menu items
- `hashPassword()` collision resistance
- `extractJSON()` (JSON salvage from truncated API responses)

Example test structure (hypothetical):
```javascript
describe("healthScore", () => {
  it("returns 50 for zero calories", () => {
    expect(healthScore({ cal: 0, protein: 0, carbs: 0, fat: 0 })).toBe(50)
  })
  
  it("returns 75+ for high-protein low-calorie meals", () => {
    expect(healthScore({ cal: 350, protein: 40, carbs: 30, fat: 8 })).toBeGreaterThanOrEqual(75)
  })
})
```

**Integration Tests (Not Implemented):**

Would test:
- `useAuth.js` sign up → sign in → sign out flow with localStorage persistence
- `useMenu.js` menu generation → caching → clearing
- `useLocation.js` geolocation permission flow + Overpass API fetch
- `useQuota.js` daily quota reset, Pro status verification via Stripe webhook
- Form submissions with validation errors

Example structure (hypothetical):
```javascript
describe("useAuth integration", () => {
  it("signs up, logs in, and persists session to localStorage", async () => {
    const { signUp, signIn } = useAuth()
    
    const signUpResult = signUp("John", "john@test.com", "pass123")
    expect(signUpResult.success).toBe(true)
    
    const signInResult = signIn("john@test.com", "pass123")
    expect(signInResult.success).toBe(true)
    expect(localStorage.getItem("nutriq_session")).toContain("john@test.com")
  })
})
```

**E2E Tests (Not Implemented):**

Playwright would test:
1. New user onboarding → geolocation → restaurant list → menu selection → analysis
2. Sign in → favorite a restaurant → visit favorite from sidebar → reorder by favorite
3. Free tier user exhausts quota → sees upgrade modal → completes checkout → quota resets
4. Dark mode toggle persists across page refresh
5. Meal tracking through a full day (add items → view progress rings → daily total)

Example Playwright structure (hypothetical):
```javascript
test("full meal tracking flow", async ({ page }) => {
  await page.goto("https://localhost:3001/")
  await page.fill('input[placeholder="Search restaurants"]', "Burger")
  await page.click('[data-testid="restaurant-card"]')
  
  // Wait for menu to load
  await page.waitForSelector('[data-testid="menu-item"]')
  
  // Select two items
  await page.click('[data-testid="menu-item"]:nth-child(1)')
  await page.click('[data-testid="menu-item"]:nth-child(2)')
  
  // View analysis
  await page.click('button:has-text("Analyze Meal")')
  await page.waitForSelector('[data-testid="analysis-panel"]')
  
  const analysis = await page.textContent('[data-testid="analysis-panel"]')
  expect(analysis).toContain("protein")
})
```

## Puppeteer QA Pattern

**Purpose:** Visual regression and user interaction validation

**Route Coverage:**
All 7 routes tested with 2 viewports (desktop 1024px, mobile 375px)

**Data Flow:**
1. Puppeteer launches headless Chromium
2. Seeds localStorage (onboarding flag, auth session)
3. Seeds sessionStorage (geolocation result, restaurant data)
4. Navigates to each route
5. Captures full-page screenshot
6. Runs interaction tests (hover, click, scroll)
7. Saves results to `screenshots/` directory

**Interaction Tests:**
```javascript
// From scripts/interaction-test.js pattern
// Test hover state on cards
await page.hover('[data-testid="restaurant-card"]')
await page.screenshot({ path: "screenshots/interactions/card-hover.png" })

// Test filter toggle
await page.click('[data-testid="filter-pill-highProtein"]')
await page.screenshot({ path: "screenshots/interactions/filter-active.png" })

// Test menu item selection
await page.click('[data-testid="menu-item"]')
await page.screenshot({ path: "screenshots/interactions/item-selected.png" })
```

## Next Steps (If Test Suite Added)

1. **Adopt Vitest** for unit/integration testing (lightweight, Vite-native)
2. **Add test data factories** for consistent mock restaurants, menu items, users
3. **Mock Overpass and Claude APIs** to avoid rate limits and quota consumption during testing
4. **Test useAuth, useLocation, useQuota** hooks thoroughly (most critical logic)
5. **Add Playwright** for critical E2E flows (onboarding, checkout, meal tracking)
6. **Set 80% coverage minimum** for lib/ and hooks/ directories
7. **Run tests in CI/CD** on every pull request (GitHub Actions)

---

*Testing analysis: 2026-04-06*
