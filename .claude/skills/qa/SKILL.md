---
name: qa
description: Run Puppeteer screenshot and interaction tests, then review results for visual issues
disable-model-invocation: true
argument-hint: [screenshots | interactions | all]
allowed-tools:
  - Bash
  - Read
  - Glob
---

# NUTRÏQ QA — Screenshot & Interaction Tests

Run the Puppeteer QA pipeline and review results.

## Steps

1. **Ensure dev server is running** on port 3001. If not, start it in background:
   ```bash
   pnpm dev &
   ```
   Wait for "ready" output before proceeding.

2. **Run tests** based on $ARGUMENTS (default "all"):
   - `screenshots` → `pnpm screenshot`
   - `interactions` → `pnpm test:interactions`
   - `all` → `pnpm qa`

3. **Read all generated screenshot PNGs** from `/screenshots/` and `/screenshots/interactions/`

4. **Review each screenshot** and check:
   - Red CTA buttons visible and not clipped on mobile
   - Score rings rendering with correct colors (green ≥75, gold ≥50, red <50)
   - Filter pills showing active state with red glow
   - Sticky selection bar appearing when items are selected
   - Card hover state showing red border glow
   - No purple, blue, or white backgrounds — charcoal only
   - Fonts are Playfair Display (headings) + Plus Jakarta Sans (body)
   - Animations appear to have completed (no frozen mid-states unless intentional)
   - Mobile layout: pills wrap, cards stack, CTA is full-width

5. **Report findings** with specific screenshot references and suggested fixes.
