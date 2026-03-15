# NUTRÏQ — Build Workflow Guide
## Claude Code + Framer MCP + Framer Motion + Puppeteer

---

## 1. Initial Setup

```bash
# Clone / initialize project
cd nutriq
pnpm install

# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Launch Claude Code in project root
claude
```

Claude Code will read `CLAUDE.md` automatically on first launch — your entire design system, color tokens, animation rules, and component map are pre-loaded.

---

## 2. Framer MCP Connection

### Get your Framer API key
1. Open Framer → Project Settings → API & Integrations
2. Generate API key
3. Paste into `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "framer": {
      "command": "npx",
      "args": ["@framer/mcp-server"],
      "env": {
        "FRAMER_API_KEY": "your_key_here"
      }
    }
  }
}
```

### Verify connection in Claude Code
```
> List all components on the Framer canvas
```
Claude Code will respond with your Framer component tree.

---

## 3. The Core Iteration Loop

```
1. Claude Code reads Framer canvas via MCP
         ↓
2. Writes / updates React component with Framer Motion
         ↓
3. Pushes component back to Framer via MCP
         ↓
4. pnpm qa  →  screenshots every route + interaction tests
         ↓
5. Review PNGs → give Claude Code visual feedback
         ↓
6. Repeat
```

---

## 4. Puppeteer QA Commands

```bash
# Full screenshot pass (desktop + tablet + mobile)
pnpm screenshot

# Interaction tests (hover, selection, sticky CTA, animations)
pnpm test:interactions

# Both at once (run after every significant change)
pnpm qa

# Wipe and re-run clean
pnpm clean:screenshots && pnpm qa
```

Screenshots saved to:
- `/screenshots/*.png` — route screenshots per viewport
- `/screenshots/interactions/*.png` — hover + interaction states

---

## 5. Claude Code Prompt Playbook

### Framer canvas reads
```
"Read the RestaurantCard component from Framer. 
 Rewrite the entrance animation using staggerContainer + fadeUpItem 
 from src/components/animations.jsx. Run pnpm screenshot after."
```

### Animation upgrades
```
"The health score ring in ScoreRing.jsx draws instantly. 
 Replace with AnimatedScoreRing from animations.jsx — 
 it should draw the stroke from 0 to score over 0.9s on mount. 
 Run pnpm test:interactions and check 14_score_ring_animating.png"
```

### Visual diff review
```
"Look at screenshots/desktop_03_menu.png vs screenshots/mobile_12_mobile_menu.png. 
 Are the macro pills wrapping correctly on mobile? 
 Is the sticky CTA button full-width at 390px?"
```

### Scroll-triggered animations
```
"Add scroll-triggered entrance to every MenuItemCard using useInView from animations.jsx. 
 Cards should stagger by 0.06s. Spring physics only — no CSS transitions. 
 Run pnpm qa after."
```

### Fix overflow / clipping issues
```
"Run pnpm test:interactions. 
 Open screenshots/interactions/02_card_hover.png. 
 The red glow on hover is clipping at the card edge. 
 Fix overflow:hidden vs overflow:visible on RestaurantCard and re-run."
```

### Page transitions
```
"Wrap the router outlet in PageTransition from animations.jsx. 
 Test navigating home → menu → analysis. 
 Run pnpm screenshot and verify 03_menu.png shows a clean entrance."
```

### Word-by-word hero title
```
"Replace the static <h1> on the home screen with WordReveal from animations.jsx. 
 'Eat What You Crave. Smarter.' — each word drops in with spring physics. 
 Screenshot the home route and confirm the stagger is visible."
```

---

## 6. Framer Motion Patterns Reference

All animation components live in `src/components/animations.jsx`:

| Export | Use For |
|--------|---------|
| `StaggerList` | Wrap restaurant/menu lists for staggered entrance |
| `ScrollReveal` | Section-level scroll-triggered fade up |
| `Pressable` | Any tappable card or button — press + hover feedback |
| `AnimatedScoreRing` | Health score SVG that draws on mount |
| `RadarPing` | Locating screen — triple ring radar pulse |
| `SelectionBarMotion` | Sticky meal tray — slides up from bottom |
| `PageTransition` | Route-level enter/exit with AnimatePresence |
| `WordReveal` | Title text — word-by-word spring drop-in |
| `SkeletonCard` | Pulse loading placeholder for restaurant cards |
| `Skeleton` | Single-line loading placeholder |

---

## 7. Adding `data-testid` Attributes
Puppeteer needs these to find elements. Add to components:

```jsx
// RestaurantCard.jsx
<Pressable data-testid="restaurant-card" ...>

// MenuItemCard.jsx  
<Pressable data-testid="menu-item" ...>

// FilterPills.jsx
<button data-filter="highProtein" ...>
<button data-filter="lowCalorie" ...>
<button data-filter="lowCarb" ...>
<button data-filter="balanced" ...>

// CategoryTabs.jsx
<button data-cat="Mains" ...>
<button data-cat="Salads" ...>
```

---

## 8. EC2 Production Notes

```js
// In any Puppeteer script, always use:
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
})
```

---

## 9. Framer Design Token Sync

Keep these in sync between Framer Variables and your CSS:

| Framer Variable | CSS Custom Property | Value |
|----------------|---------------------|-------|
| `colorRed` | `--red` | `#E8192C` |
| `colorGold` | `--gold` | `#F5B800` |
| `colorOrange` | `--orange` | `#FF6B2B` |
| `colorGreen` | `--green` | `#22C55E` |
| `colorCharcoal` | `--charcoal` | `#0E0E0F` |
| `colorCream` | `--cream` | `#F5EDD8` |
| `fontDisplay` | `--font-display` | `Playfair Display` |
| `fontBody` | `--font-body` | `Plus Jakarta Sans` |

Ask Claude Code: "Sync Framer variables to CSS custom properties in index.css"

---

## 10. Quick Sanity Checks Before Each Commit

```bash
pnpm qa                    # screenshots + interaction tests
```

Then ask Claude Code:
```
"Review all screenshots in /screenshots/. 
 Check: 
 1. Red CTA buttons visible and not clipped on mobile
 2. Score rings rendering with correct colors (green/gold/red)
 3. Filter pills showing active state with red glow
 4. Sticky selection bar appearing when items are selected
 5. Card hover state showing red border glow
 Flag any issues."
```
