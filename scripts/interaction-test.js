/**
 * NUTRÏQ — Puppeteer Interaction Test Suite
 * Run: pnpm test:interactions
 *
 * Tests hover states, card selection, filter toggles, sticky CTA visibility.
 * Captures before/after screenshots for Claude Code visual diff review.
 */

import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"

const BASE_URL = process.env.VITE_DEV_URL || "http://localhost:3001"
const OUT = path.resolve("screenshots/interactions")
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function shot(page, name) {
  await sleep(450)
  const p = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: p, fullPage: false }) // viewport only for interactions
  console.log(`  📸  ${name}.png`)
}

// ─── MOCK DATA INJECTOR ──────────────────────────────────────────────────────
const INJECT_MOCK = `
  sessionStorage.setItem('nutriq_mock_view', 'menu');
  sessionStorage.setItem('nutriq_mock_restaurant', JSON.stringify({
    id: 'mock_1', name: 'Grillhouse Prime', cuisine: 'American Grill',
    emoji: '🥩', distance: 0.3, rating: '4.6',
    menu: [
      { id: 'm1', name: 'Grilled Salmon', desc: 'Atlantic salmon, herb butter', price: 18.99, cal: 380, protein: 42, carbs: 2, fat: 18, cat: 'Mains' },
      { id: 'm2', name: 'Classic Cheeseburger', desc: '8oz beef, cheddar, brioche', price: 13.99, cal: 820, protein: 38, carbs: 64, fat: 46, cat: 'Mains' },
      { id: 'm3', name: 'Grilled Chicken', desc: 'Free-range chicken, chimichurri', price: 15.99, cal: 290, protein: 52, carbs: 3, fat: 8, cat: 'Mains' },
      { id: 'm4', name: 'Caesar Salad', desc: 'Romaine, parmesan, croutons', price: 11.99, cal: 320, protein: 14, carbs: 18, fat: 22, cat: 'Salads' },
    ]
  }));
`

async function runTests() {
  console.log("\n🧪 NUTRÏQ — Interaction Tests")
  console.log(`   Output: /screenshots/interactions/\n`)

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

  // ─── TEST 1: Restaurant card hover ────────────────────────────────────────
  console.log("TEST 1 — Restaurant card hover")
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 12000 })
  await sleep(800)
  await shot(page, "01_home_default")

  const firstCard = await page.$("[data-testid='restaurant-card']")
  if (firstCard) {
    await firstCard.hover()
    await sleep(300) // let Framer Motion hover animate
    await shot(page, "02_card_hover")
    // move away
    await page.mouse.move(0, 0)
    await sleep(300)
    await shot(page, "03_card_hover_out")
  } else {
    console.log("  ⚠️  No restaurant-card found — check data-testid attribute")
  }

  // ─── TEST 2: Filter pill toggle ───────────────────────────────────────────
  console.log("\nTEST 2 — Filter pill toggle")
  await shot(page, "04_filters_default")
  const proteinPill = await page.$("[data-filter='highProtein']")
  if (proteinPill) {
    await proteinPill.click()
    await sleep(400)
    await shot(page, "05_filter_highprotein_active")
    await proteinPill.click()
    await sleep(300)
    await shot(page, "06_filter_cleared")
  }

  // ─── TEST 3: Menu item selection + sticky CTA ─────────────────────────────
  console.log("\nTEST 3 — Menu item selection + sticky CTA")
  await page.evaluate(INJECT_MOCK)
  await page.reload({ waitUntil: "networkidle0" })
  await sleep(1000)
  await shot(page, "07_menu_loaded")

  const firstItem = await page.$("[data-testid='menu-item']")
  if (firstItem) {
    await firstItem.click()
    await sleep(500)
    await shot(page, "08_item_selected")

    const secondItem = await page.$$("[data-testid='menu-item']")
    if (secondItem[1]) {
      await secondItem[1].click()
      await sleep(500)
      await shot(page, "09_two_items_selected")
    }
  }

  // ─── TEST 4: Category tab switching ──────────────────────────────────────
  console.log("\nTEST 4 — Category tab")
  const saladTab = await page.$("[data-cat='Salads']")
  if (saladTab) {
    await saladTab.click()
    await sleep(400)
    await shot(page, "10_category_salads")
  }

  // ─── TEST 5: Mobile breakpoint ────────────────────────────────────────────
  console.log("\nTEST 5 — Mobile (390px) layout")
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 })
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 10000 })
  await sleep(600)
  await shot(page, "11_mobile_home")

  await page.evaluate(INJECT_MOCK)
  await page.reload({ waitUntil: "networkidle0" })
  await sleep(800)
  await shot(page, "12_mobile_menu")

  const mobileItem = await page.$("[data-testid='menu-item']")
  if (mobileItem) {
    await mobileItem.click()
    await sleep(400)
    await shot(page, "13_mobile_item_selected_sticky_cta")
  }

  // ─── TEST 6: Score ring animation (scroll to trigger) ────────────────────
  console.log("\nTEST 6 — Score ring entrance animation")
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.evaluate(INJECT_MOCK)
  await page.reload({ waitUntil: "networkidle0" })
  await sleep(200) // capture MID-animation
  await page.screenshot({ path: path.join(OUT, "14_score_ring_animating.png") })
  console.log("  📸  14_score_ring_animating.png")
  await sleep(1000) // fully settled
  await shot(page, "15_score_ring_complete")

  // ─── SUMMARY ─────────────────────────────────────────────────────────────
  await browser.close()
  const files = fs.readdirSync(OUT).filter(f => f.endsWith(".png"))
  console.log(`\n✅ ${files.length} interaction screenshots saved to /screenshots/interactions/`)
  console.log("   Review these with Claude Code:")
  console.log(`   "Compare 08_item_selected.png and 09_two_items_selected.png. Is the sticky CTA appearing correctly?"`)
  console.log(`   "Look at 11_mobile_home.png. Are the filter pills wrapping cleanly on 390px?"`)
  console.log(`   "Is the card hover border in 02_card_hover.png showing the red glow correctly?\n"`)
}

runTests().catch(e => {
  console.error("❌ Interaction test error:", e.message)
  process.exit(1)
})
