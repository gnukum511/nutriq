/**
 * NUTRÏQ — Puppeteer Screenshot QA
 * Run: npm run screenshot
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
  mobile:  { width: 390,  height: 844,  label: "mobile" },
}

// Mock restaurants for the home page
const MOCK_RESTAURANTS = [
  { id: "r1", name: "Grillhouse Prime", cuisine: "american", cuisineLabel: "American", emoji: "🍔", distance: 0.3, phone: "(555) 123-4567" },
  { id: "r2", name: "Sakura Sushi Bar", cuisine: "japanese", cuisineLabel: "Japanese", emoji: "🍣", distance: 0.7 },
  { id: "r3", name: "Bella Italia", cuisine: "italian", cuisineLabel: "Italian", emoji: "🍝", distance: 1.2, phone: "(555) 234-5678" },
  { id: "r4", name: "Thai Orchid", cuisine: "thai", cuisineLabel: "Thai", emoji: "🍛", distance: 1.8 },
  { id: "r5", name: "Le Petit Bistro", cuisine: "french", cuisineLabel: "French", emoji: "🥐", distance: 2.1 },
  { id: "r6", name: "Taqueria El Sol", cuisine: "mexican", cuisineLabel: "Mexican", emoji: "🌮", distance: 2.5 },
  { id: "r7", name: "Bombay Spice", cuisine: "indian", cuisineLabel: "Indian", emoji: "🍛", distance: 3.0 },
  { id: "r8", name: "Seoul Kitchen", cuisine: "korean", cuisineLabel: "Korean", emoji: "🍜", distance: 3.4 },
]

// Mock selected restaurant + menu for menu page
const MOCK_SELECTED = {
  id: "r1",
  name: "Grillhouse Prime",
  cuisine: "american",
  cuisineLabel: "American",
  emoji: "🍔",
  distance: 0.3,
  phone: "(555) 123-4567",
}

const screenshotsDir = path.resolve("screenshots")
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true })

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function capture(page, filename) {
  await sleep(800) // let animations settle
  const filepath = path.join(screenshotsDir, filename)
  await page.screenshot({ path: filepath, fullPage: true })
  console.log(`  ✓  ${filename}`)
}

// Seed browser storage to bypass onboarding and simulate located state
async function seedState(page) {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" })
  await page.evaluate((restaurants) => {
    // Bypass onboarding
    localStorage.setItem("nutriq_onboarded", "true")
    // Bypass auth — seed a fake session
    localStorage.setItem("nutriq_session", JSON.stringify({
      id: "screenshot_user",
      name: "QA Bot",
      email: "qa@nutriq.app",
    }))
    // Simulate located state
    sessionStorage.setItem("nutriq_location_status", "located")
    sessionStorage.setItem("nutriq_restaurants", JSON.stringify(restaurants))
    sessionStorage.setItem("nutriq_coords", JSON.stringify({ lat: 39.7392, lng: -104.9903 }))
  }, MOCK_RESTAURANTS)
}

async function run() {
  console.log("\n🎯 NUTRÏQ — Puppeteer Screenshot QA")
  console.log(`   Base URL: ${BASE_URL}`)
  console.log(`   Output:   /screenshots/\n`)

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ]
  })

  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    console.log(`📐 ${vp.label.toUpperCase()} (${vp.width}×${vp.height})`)
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 })

    // ── Seed state ──
    await seedState(page)

    // ── LOCATING SCREEN ──
    await page.goto(`${BASE_URL}/locating`, { waitUntil: "domcontentloaded" })
    await sleep(500)
    await capture(page, `${vpName}_01_locating.png`)

    // ── HOME (restaurant list) ──
    await seedState(page)
    await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 10000 })
    await sleep(1000)
    await capture(page, `${vpName}_02_home.png`)

    // ── HOME scrolled ──
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: "smooth" }))
    await sleep(700)
    await capture(page, `${vpName}_03_home_scrolled.png`)

    // ── MENU VIEW ──
    await page.evaluate((restaurant) => {
      sessionStorage.setItem("nutriq_selected_restaurant", JSON.stringify(restaurant))
    }, MOCK_SELECTED)
    await page.goto(`${BASE_URL}/menu/r1`, { waitUntil: "networkidle0", timeout: 15000 })
    await sleep(2000)
    await capture(page, `${vpName}_04_menu.png`)

    // ── MENU scrolled ──
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "smooth" }))
    await sleep(700)
    await capture(page, `${vpName}_05_menu_scrolled.png`)

    // ── SETTINGS ──
    await page.goto(`${BASE_URL}/settings`, { waitUntil: "networkidle0", timeout: 10000 })
    await sleep(800)
    await capture(page, `${vpName}_06_settings.png`)

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
