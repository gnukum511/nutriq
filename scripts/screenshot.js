/**
 * NUTRÏQ — Puppeteer Screenshot QA
 * Run: pnpm screenshot
 *
 * Captures all routes at desktop + mobile viewports.
 * Output: /screenshots/*.png — review before committing UI changes.
 */

import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"

const BASE_URL = process.env.VITE_DEV_URL || "http://localhost:3001"

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, label: "desktop" },
  tablet:  { width: 768,  height: 1024, label: "tablet" },
  mobile:  { width: 390,  height: 844,  label: "mobile" },   // iPhone 14 Pro
}

// Routes that don't require location permission
const ROUTES = [
  { path: "/",          name: "home",      waitFor: ".restaurant-list, .location-error", timeout: 8000 },
  { path: "/locating",  name: "locating",  waitFor: null,  timeout: 2000 },
]

// Routes that require a restaurant to be loaded — mock or use seeded state
const MENU_MOCK_SCRIPT = `
  // Inject mock restaurant + menu into sessionStorage for screenshot
  sessionStorage.setItem('nutriq_mock_view', 'menu');
  sessionStorage.setItem('nutriq_mock_restaurant', JSON.stringify({
    id: 'mock_1',
    name: 'Grillhouse Prime',
    cuisine: 'American Grill',
    emoji: '🥩',
    distance: 0.3,
    rating: '4.6',
    menu: [
      { id: 'm1', name: 'Grilled Salmon', desc: 'Atlantic salmon, lemon herb butter, steamed greens', price: 18.99, cal: 380, protein: 42, carbs: 2, fat: 18, cat: 'Mains' },
      { id: 'm2', name: 'Classic Cheeseburger', desc: '8oz beef patty, cheddar, brioche bun, fries', price: 13.99, cal: 820, protein: 38, carbs: 64, fat: 46, cat: 'Mains' },
      { id: 'm3', name: 'Grilled Chicken Breast', desc: 'Free-range chicken, chimichurri, roasted veg', price: 15.99, cal: 290, protein: 52, carbs: 3, fat: 8, cat: 'Mains' },
      { id: 'm4', name: 'Caesar Salad', desc: 'Romaine, parmesan, croutons, caesar dressing', price: 11.99, cal: 320, protein: 14, carbs: 18, fat: 22, cat: 'Salads' },
      { id: 'm5', name: 'Egg White Omelette', desc: 'Egg whites, spinach, mushrooms, feta', price: 10.99, cal: 220, protein: 28, carbs: 6, fat: 9, cat: 'Brunch' },
      { id: 'm6', name: 'Sirloin Steak 8oz', desc: 'Prime sirloin, garlic butter, choice of side', price: 28.99, cal: 520, protein: 58, carbs: 1, fat: 28, cat: 'Mains' },
      { id: 'm7', name: 'Loaded Nachos', desc: 'Tortilla chips, cheese, jalapeños, sour cream, guac', price: 12.99, cal: 1100, protein: 22, carbs: 92, fat: 68, cat: 'Starters' }
    ]
  }));
`

const screenshotsDir = path.resolve("screenshots")
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function capture(page, filename) {
  await sleep(600) // let animations settle
  const filepath = path.join(screenshotsDir, filename)
  await page.screenshot({ path: filepath, fullPage: true })
  console.log(`  ✓  ${filename}`)
  return filepath
}

async function run() {
  console.log("\n🎯 NUTRÏQ — Puppeteer Screenshot QA")
  console.log(`   Base URL: ${BASE_URL}`)
  console.log(`   Output:   /screenshots/\n`)

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",              // required for EC2/Linux
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ]
  })

  const results = []

  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    console.log(`📐 ${vp.label.toUpperCase()} (${vp.width}×${vp.height})`)
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 })

    // ── LOCATING SCREEN ──
    await page.goto(`${BASE_URL}/locating`, { waitUntil: "domcontentloaded" })
    await sleep(500)
    await capture(page, `${vpName}_01_locating.png`)

    // ── HOME (location denied simulation) ──
    await page.goto(BASE_URL, {
      waitUntil: "networkidle0",
      timeout: 10000,
    })
    await sleep(1000)
    await capture(page, `${vpName}_02_home.png`)

    // ── MENU VIEW (with mock data) ──
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" })
    await page.evaluate(MENU_MOCK_SCRIPT)
    await sleep(300)
    await page.reload({ waitUntil: "networkidle0" })
    await sleep(800)
    await capture(page, `${vpName}_03_menu.png`)

    // ── SCROLL DOWN on menu ──
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "smooth" }))
    await sleep(700)
    await capture(page, `${vpName}_04_menu_scrolled.png`)

    // ── FILTER PILL ACTIVE STATE ──
    await page.evaluate(() => window.scrollTo({ top: 0 }))
    await sleep(300)
    const filterPill = await page.$('[data-filter="highProtein"]')
    if (filterPill) {
      await filterPill.click()
      await sleep(400)
      await capture(page, `${vpName}_05_menu_filtered.png`)
    }

    await page.close()
    console.log("")
  }

  await browser.close()
  console.log("✅ All screenshots saved to /screenshots/")
  console.log("   Tip: Pass before.png + after.png to Claude Code for visual diff analysis\n")
}

run().catch(e => {
  console.error("❌ Screenshot error:", e.message)
  process.exit(1)
})
