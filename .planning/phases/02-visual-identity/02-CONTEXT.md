# Phase 2: Visual Identity - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete design system — palette, typography, spacing tokens, and responsive sidebar layout — applied to `default.hbs`. Every subsequent template inherits consistent styling without rework. Includes dark mode toggle.

</domain>

<decisions>
## Implementation Decisions

### Typography
- Headings: Lora (Google Fonts) — warm, contemporary, excellent screen legibility
- Body text: IBM Plex Serif (Google Fonts) — crisp, modern, great at body sizes
- Loading: Google Fonts CDN (not self-hosted)
- Pairing creates warmth (Lora) meets clarity (IBM Plex Serif)

### Color Palette — Light Mode
- Background: warm cream (#FAF7F2 range) — noticeably warm, parchment-like, cozy
- Text: warm dark brown-black (#2D2926 range) — softer than pure black, matches warm palette
- Accent: warmer/deeper terracotta than current #C17D6A — something like #B5594B, richer, more contrast
- Links: accent color (terracotta) — consistent, warm

### Color Palette — Dark Mode
- Background: warm dark/charcoal (#1C1917 range) — keeps the warmth even in dark mode
- Accent: lighten terracotta slightly for better contrast on dark backgrounds
- Text: light cream/off-white for readability

### Dark Mode
- Toggle location: bottom of sidebar (small icon)
- Approach: warm dark, not cool/true dark — preserve the warm aesthetic
- Accent shifts slightly lighter in dark mode for readability
- All colors defined as CSS custom properties, swapped via `[data-theme="dark"]` or `prefers-color-scheme`

### Sidebar Layout
- Position: left sidebar
- Width: narrow (~200px)
- Content: nav links only (Blog, Publications, Products, Experiments, About) + small social links at bottom
- No site name/logo or tagline in sidebar — keep it minimal
- Mobile: collapses to horizontal top bar (not hamburger menu)

### Claude's Discretion
- Exact hex values for palette (within the specified ranges/directions)
- Spacing scale and CSS custom property naming
- Sidebar breakpoint for mobile collapse
- Dark mode transition animation (smooth or instant)
- Font weights to load (balance performance vs. design needs)
- Social link icons (SVG vs font icons, which platforms)

</decisions>

<specifics>
## Specific Ideas

- Reference sites for the feel: Manuel Moreale (ultra-minimal, warm), People and Blogs (cozy cream + terracotta), Maggie Appleton (bold serif personality), Mustafa Suleyman (left sidebar nav)
- The warm cream background should feel like parchment — noticeably warm, not clinical
- Dark mode should feel like the same site in dim lighting, not a completely different aesthetic
- Sidebar should be unobtrusive — nav links and social icons only, no visual weight

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `default.hbs`: Shell with `{{asset "built/screen.css"}}` and `{{asset "built/main.js"}}` — sidebar HTML goes here
- `assets/css/screen.css`: Exists with minimal reset — design tokens and layout CSS build on top of this
- PostCSS pipeline via Rollup: postcss-preset-env already configured

### Established Patterns
- Asset paths use `{{asset}}` helper throughout (Phase 1 convention)
- Rollup + PostCSS build pipeline for CSS processing

### Integration Points
- `default.hbs` `<body>` tag: sidebar markup wraps `{{{body}}}`
- `screen.css`: all design tokens and layout rules go here
- `main.js`: dark mode toggle JS goes here

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-visual-identity*
*Context gathered: 2026-03-24*
