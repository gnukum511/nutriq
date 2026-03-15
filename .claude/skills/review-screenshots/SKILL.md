---
name: review-screenshots
description: Review Puppeteer screenshot PNGs for visual issues against the NUTRÏQ design system
disable-model-invocation: true
argument-hint: [screenshot-path or "all"]
allowed-tools:
  - Read
  - Glob
---

# Review NUTRÏQ Screenshots

Visually review screenshot PNGs against the NUTRÏQ design system.

## Steps

1. **Find screenshots** — if $ARGUMENTS is a path, read that file. If "all" or empty, glob for all PNGs in `/screenshots/` and `/screenshots/interactions/`.

2. **Read each PNG** (Claude Code can view images) and evaluate against this checklist:

### Layout & Spacing
- [ ] Cards have consistent padding and spacing
- [ ] No content overflow or clipping
- [ ] Mobile (390px): cards stack, pills wrap, CTA full-width
- [ ] Sticky selection bar positioned at bottom when visible

### Colors (Food Psychology tokens)
- [ ] Background is charcoal (#0E0E0F) — never white/blue/purple
- [ ] Red (#E8192C) used ONLY for CTAs, selected states, urgency
- [ ] Gold (#F5B800) for prices, highlights, AI labels
- [ ] Orange (#FF6B2B) for distance badges, secondary actions
- [ ] Green (#22C55E) for health signals ONLY
- [ ] Text is cream (#F5EDD8), not cold white

### Typography
- [ ] Headings use Playfair Display (serif)
- [ ] Body/UI uses Plus Jakarta Sans (sans-serif)
- [ ] No Inter, Roboto, or Arial visible

### Components
- [ ] Score rings: green ≥75, gold ≥50, red <50
- [ ] Macro pills showing cal/protein/carbs/fat
- [ ] Filter pills have red glow when active
- [ ] Hover states show red border glow on cards

### Animations (from interaction screenshots)
- [ ] Score ring stroke appears to animate (compare animating vs complete shots)
- [ ] Cards appear staggered (not all identical positions)
- [ ] No frozen mid-animation states (unless captured intentionally)

3. **Report** issues with specific screenshot names and suggested fixes.
