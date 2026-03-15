---
name: component
description: Create or update a NUTRÏQ React component following the design system — Framer Motion animations, color tokens, proper fonts, data-testid attributes
disable-model-invocation: true
argument-hint: [ComponentName]
allowed-tools:
  - Write
  - Edit
  - Read
  - Glob
  - Grep
---

# Create / Update NUTRÏQ Component

Create or modify the component named `$ARGUMENTS` following the NUTRÏQ design system.

## Before writing

1. Read `CLAUDE.md` for the full design system spec
2. Read `src/components/animations.jsx` for available animation exports
3. Check if the component already exists in `src/components/`
4. If updating, read the existing file first

## Component requirements

- **Animations**: Import from `../components/animations.jsx` — use Pressable, StaggerList, ScrollReveal, fadeUpItem, etc. NEVER use CSS `transition:` property.
- **Colors**: Use CSS custom properties from CLAUDE.md tokens (`var(--red)`, `var(--gold)`, etc.)
  - Red = action/urgency only
  - Gold = value/delight
  - Orange = secondary energy
  - Green = health data ONLY
- **Fonts**: Playfair Display for display/headings, Plus Jakarta Sans for body/UI
- **Testing**: Add `data-testid="component-name"` for Puppeteer. Add `data-filter` or `data-cat` where applicable.
- **Score rings**: green ≥75, gold ≥50, red <50
- **Loading states**: Use Skeleton/SkeletonCard from animations.jsx
- **Press feedback**: Wrap interactive elements in Pressable (scale 0.97 on tap, 1.02 on hover)

## File location

Save to `src/components/$ARGUMENTS.jsx`

## After writing

Report what was created/changed and suggest running `/qa` to verify visually.
