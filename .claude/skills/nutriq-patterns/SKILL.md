---
name: nutriq-patterns
description: Coding patterns extracted from the NUTRÏQ repository git history
version: 1.0.0
source: local-git-analysis
analyzed_commits: 35
---

# NUTRÏQ Patterns

Patterns extracted from 35 commits in the NUTRÏQ repository. Use these to stay consistent with established conventions.

---

## Commit Conventions

This repo uses **descriptive prose commits** — no conventional commit prefixes:

| Pattern | Example |
|---------|---------|
| New feature | `Add freemium quota system with upgrade modal` |
| Bug fix | `Fix map pins to red pin drops, fix truncated menu JSON` |
| Rewrite/swap | `Replace all custom SVGs with Lucide React icons` |
| Update/modify | `Add red header banner and macro stat cards to analysis page` |
| Docs sync | `Sync docs: CLAUDE.md and HANDOFF.md with current codebase state` |

**Rule:** Lead with a capital action verb. Be specific about what changed and why.

---

## Code Architecture

```
src/
├── components/     # PascalCase.jsx — reusable UI (no page logic)
├── hooks/          # useHookName.js — all state and side effects
├── lib/            # lowercase.js   — pure utilities, API clients, helpers
├── pages/          # PascalCasePage.jsx — route components (compose hooks + components)
├── index.css       # CSS custom properties (design tokens) + Tailwind base
api/
└── claude.js       # Vercel Edge Runtime proxy (NEVER put API keys in src/)
scripts/
├── screenshot.js        # Puppeteer: full route screenshots
└── interaction-test.js  # Puppeteer: hover/click interaction states
.claude/skills/          # Local Claude Code skill definitions
```

**Naming rules:**
- Components: `PascalCase.jsx`
- Hooks: `use` prefix, camelCase, `.js`
- Lib utilities: `lowercase.js`
- Pages: `PascalCasePage.jsx`
- Scripts: `kebab-case.js`

---

## File Co-Change Patterns

These files almost always change together — update all of them when touching one:

| When you touch… | Also update… |
|-----------------|-------------|
| `CLAUDE.md` | `HANDOFF.md` |
| `HANDOFF.md` | `CLAUDE.md` |
| `package.json` | `pnpm-lock.yaml` |
| `src/components/RestaurantCard.jsx` | `src/pages/HomePage.jsx` or `src/pages/MenuPage.jsx` |
| `src/hooks/useFilters.js` | `src/lib/claude.js` + `src/components/MenuItemCard.jsx` |
| `src/lib/health.js` | `src/components/ScoreRing.jsx` or `MacroPill.jsx` |
| A new hook in `src/hooks/` | `src/App.jsx` (if it needs routing or top-level context) |

---

## Workflows

### Adding a New Feature

1. Create the hook in `src/hooks/useFeatureName.js` (state + logic)
2. Create/update components in `src/components/` (UI only, no direct API calls)
3. Update the relevant page in `src/pages/` (wire hook → component)
4. If page is new: add `React.lazy` import + route in `src/App.jsx`
5. Run `pnpm qa` — screenshots + interactions
6. Sync `CLAUDE.md` + `HANDOFF.md` if design system or architecture changed

### Adding a New Component

1. Create `src/components/ComponentName.jsx`
2. Import animations from `src/components/animations.jsx` — never write raw Framer Motion in component files
3. Use only CSS custom properties from `src/index.css` for colors (no hardcoded hex)
4. Use Lucide React icons only (`strokeWidth={1.5}`) — no emojis, no inline SVG
5. Export from the file (no barrel index.js)

### Fixing a Bug in Claude API Responses

1. Edit `src/lib/claude.js` (client logic)
2. If prod-only: check `api/claude.js` (Edge Runtime proxy)
3. Add JSON salvage/fallback if parse failure is involved
4. Run `pnpm screenshot` and verify the affected page renders

### Updating Docs After Major Change

```bash
# Always run this pair together
# 1. Update CLAUDE.md (design system, architecture, constraints)
# 2. Update HANDOFF.md (active work, next step, files in flight)
```

Commit message format: `Sync docs: CLAUDE.md and HANDOFF.md with <what changed>`

---

## Hot Files (Touched Most Often)

These files change frequently — read them before editing nearby code:

| File | Change count | Why |
|------|-------------|-----|
| `src/pages/MenuPage.jsx` | 9 | Central feature page — many features converge here |
| `src/App.jsx` | 9 | Routes, lazy loading, top-level providers |
| `src/pages/HomePage.jsx` | 7 | Restaurant list, search, macro strip |
| `src/pages/AnalysisPage.jsx` | 7 | AI analysis, macro cards, history |
| `src/components/RestaurantCard.jsx` | 7 | Most visible card UI |
| `src/components/Header.jsx` | 7 | Icons, theme, auth state, navigation |
| `src/lib/claude.js` | 6 | AI menu/analysis calls + response parsing |

---

## QA Workflow

After any visible change:

```bash
pnpm screenshot          # all routes × desktop + mobile
pnpm test:interactions   # hover, selection, filters, sticky CTA
pnpm qa                  # both at once
```

Screenshots land in `/screenshots/`. Review PNGs for:
- Red CTA buttons visible, not clipped on mobile
- Score rings rendering green/gold/red correctly
- Filter pills showing active red glow
- Sticky selection bar appearing on item select
- Card hover state showing red border glow

---

## Animation Rules (Enforced)

```jsx
// NEVER — will conflict with Framer Motion state
style={{ transition: "all 0.3s ease" }}

// ALWAYS — import from animations.jsx
import { Pressable, StaggerList, ScrollReveal } from './animations'

// Standard spring
{ type: "spring", stiffness: 300, damping: 24 }

// Bouncy spring (CTAs, score rings)
{ type: "spring", stiffness: 420, damping: 20 }
```

All reusable animation primitives live in `src/components/animations.jsx`. Add new ones there rather than inline.

---

## Design Token Usage

```css
/* ALWAYS use tokens — never hardcode hex */
color: var(--cream);
background: var(--surface);
border-color: var(--border);

/* Semantic meaning — do NOT misuse */
/* --red    → actions/urgency only (CTAs, selected states) */
/* --gold   → value/delight (prices, AI labels, calories) */
/* --orange → secondary energy (badges, distance, fat) */
/* --green  → health data only (protein, open status) */
```

---

## API Pattern

```js
// Dev: direct client → Claude API (VITE_CLAUDE_API_KEY from .env)
// Prod: client → /api/claude → Vercel Edge Runtime → Claude API

// NEVER expose ANTHROPIC_API_KEY in src/ — proxy only
// JSON salvage fallback for truncated responses is in src/lib/claude.js
```
