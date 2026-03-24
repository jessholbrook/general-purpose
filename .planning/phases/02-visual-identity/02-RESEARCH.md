# Phase 2: Visual Identity - Research

**Researched:** 2026-03-24
**Domain:** Ghost theme CSS design system, Google Fonts, dark mode toggle, responsive sidebar layout
**Confidence:** HIGH

## Summary

Phase 2 establishes the complete design system in `default.hbs` and `screen.css` so all subsequent templates inherit consistent styling. The work splits into four concerns: (1) CSS custom properties for all palette, typography, and spacing tokens; (2) Google Fonts loading for Lora + IBM Plex Serif; (3) responsive sidebar layout using CSS Grid that collapses to a horizontal top bar on mobile; and (4) a dark mode toggle with localStorage persistence and FOUC prevention.

The Ghost Handlebars `{{navigation}}` helper (or `@site.navigation` global) provides nav link data. The existing `screen.css` has a minimal reset only — the entire design system goes on top of it. The Rollup/PostCSS build pipeline (postcss-preset-env stage 2) is already wired; no new build tooling is needed. Dark mode FOUC is the one tricky implementation concern: an inline `<script>` in `<head>` must apply `data-theme` before the page renders.

**Primary recommendation:** Use CSS Grid (`200px 1fr`) for the sidebar layout, CSS custom properties with `[data-theme]` selectors for theming, and a tiny inline script in `default.hbs` `<head>` to prevent theme flash.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Typography**
- Headings: Lora (Google Fonts)
- Body text: IBM Plex Serif (Google Fonts)
- Loading: Google Fonts CDN (not self-hosted)

**Color Palette — Light Mode**
- Background: warm cream (#FAF7F2 range)
- Text: warm dark brown-black (#2D2926 range)
- Accent: warmer/deeper terracotta (~#B5594B), richer, more contrast
- Links: accent color (terracotta)

**Color Palette — Dark Mode**
- Background: warm dark/charcoal (#1C1917 range)
- Accent: lighten terracotta slightly for better contrast on dark backgrounds
- Text: light cream/off-white for readability

**Dark Mode**
- Toggle location: bottom of sidebar (small icon)
- Approach: warm dark, not cool/true dark
- Accent shifts slightly lighter in dark mode for readability
- All colors defined as CSS custom properties, swapped via `[data-theme="dark"]` or `prefers-color-scheme`

**Sidebar Layout**
- Position: left sidebar
- Width: narrow (~200px)
- Content: nav links only (Blog, Publications, Products, Experiments, About) + small social links at bottom
- No site name/logo or tagline in sidebar — keep it minimal
- Mobile: collapses to horizontal top bar (not hamburger menu)

### Claude's Discretion
- Exact hex values for palette (within specified ranges/directions)
- Spacing scale and CSS custom property naming
- Sidebar breakpoint for mobile collapse
- Dark mode transition animation (smooth or instant)
- Font weights to load (balance performance vs. design needs)
- Social link icons (SVG vs font icons, which platforms)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VIS-01 | Warm color palette with cream/off-white background and terracotta accent color | CSS custom properties in `:root` and `[data-theme]` selectors cover full palette definition |
| VIS-02 | CSS design tokens for palette, typography, and spacing | `--color-*`, `--font-*`, `--space-*` naming pattern; all values in custom properties, zero hardcoded hex in templates |
| VIS-03 | Custom serif web fonts for headings and body text | Google Fonts CDN via `<link>` in `default.hbs` `<head>` with preconnect + `display=swap` |
| VIS-04 | Dark mode toggle with appropriate color scheme | `[data-theme="dark"]` CSS overrides + vanilla JS toggle with localStorage + FOUC-prevention inline script |
| FOUND-03 | Sidebar navigation that collapses to mobile-friendly nav below breakpoint | CSS Grid `200px 1fr`, media query switches to horizontal flex row on mobile |
</phase_requirements>

---

## Standard Stack

### Core
| Library/Feature | Version | Purpose | Why Standard |
|-----------------|---------|---------|--------------|
| CSS Custom Properties | Native | Design tokens, theming | Zero-dependency, works in all modern browsers, Ghost doesn't restrict CSS |
| CSS Grid | Native | Sidebar + main layout | Cleanest two-column responsive layout; simpler than Flexbox for this pattern |
| Google Fonts CDN | Latest | Lora + IBM Plex Serif | Locked decision; `display=swap` prevents render block |
| postcss-preset-env | 9.3.x (already installed) | Modern CSS transpilation | Already in project; handles nesting, custom media queries |
| Ghost `{{navigation}}` helper | Ghost 6 | Renders nav links from Admin | Native Ghost — no custom data needed |

### Supporting
| Library/Feature | Version | Purpose | When to Use |
|-----------------|---------|---------|-------------|
| `localStorage` | Native browser | Persist user's theme preference | Dark mode toggle only |
| `window.matchMedia` | Native browser | Read system color scheme | Dark mode initial state detection |
| Ghost `@site.navigation` | Ghost 6 | Check if nav items exist | Conditional rendering guard in sidebar |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Grid sidebar | Flexbox | Flexbox works but requires an extra wrapper div; Grid is cleaner for 2-column with fixed left column |
| Google Fonts CDN | Self-hosted fonts | Self-hosting avoids third-party DNS but adds build complexity; CDN is locked decision |
| `data-theme` attribute | `.dark-mode` class on `<body>` | Either works; `data-theme` on `<html>` is the current best-practice pattern and avoids class name collisions |

**Installation:** No new packages needed. All tooling (Rollup, PostCSS, postcss-preset-env) is already installed.

---

## Architecture Patterns

### Recommended Project Structure
```
assets/
├── css/
│   └── screen.css          # All design tokens + layout CSS (single file for this phase)
├── js/
│   └── main.js             # Dark mode toggle JS (already imports screen.css)
└── built/                  # Rollup output — do not edit directly

partials/
└── navigation.hbs          # Custom nav markup for sidebar (overrides Ghost default)

default.hbs                 # Gets: preconnect links, Google Fonts link, FOUC inline script, sidebar HTML
```

### Pattern 1: CSS Design Tokens in `:root`
**What:** All palette, typography, and spacing values defined as CSS custom properties in `:root`. Dark mode overrides in `[data-theme="dark"]`.
**When to use:** Always — zero hardcoded values in templates or layout rules.

```css
/* Source: W3C CSS Custom Properties / verified pattern */
:root {
  /* Palette — Light Mode */
  --color-bg:        #FAF7F2;
  --color-text:      #2D2926;
  --color-accent:    #B5594B;
  --color-accent-hover: #9E4A3C;
  --color-link:      var(--color-accent);
  --color-border:    #E8E0D5;
  --color-muted:     #7A6E65;

  /* Typography */
  --font-heading:    'Lora', Georgia, serif;
  --font-body:       'IBM Plex Serif', Georgia, serif;
  --font-size-base:  1.6rem;   /* 16px at 62.5% root */
  --line-height:     1.7;

  /* Spacing scale (4px base) */
  --space-1:  0.4rem;
  --space-2:  0.8rem;
  --space-3:  1.2rem;
  --space-4:  1.6rem;
  --space-6:  2.4rem;
  --space-8:  3.2rem;
  --space-12: 4.8rem;
  --space-16: 6.4rem;

  /* Layout */
  --sidebar-width:   200px;
  --content-max:     680px;
}

[data-theme="dark"] {
  --color-bg:        #1C1917;
  --color-text:      #EDE8E3;
  --color-accent:    #C9705F;  /* Lightened terracotta for dark bg */
  --color-accent-hover: #D4826F;
  --color-border:    #3A3330;
  --color-muted:     #9E918A;
}
```

### Pattern 2: CSS Grid Sidebar Layout
**What:** `<html>` → `<body>` wraps a grid container with sidebar + main columns.
**When to use:** This is the primary layout pattern for `default.hbs`.

```css
/* Source: MDN CSS Grid / verified pattern */
.site-frame {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-areas: "sidebar main";
  min-height: 100vh;
}

.site-sidebar {
  grid-area: sidebar;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-8) var(--space-4);
  border-right: 1px solid var(--color-border);
}

.site-main {
  grid-area: main;
  padding: var(--space-8) var(--space-12);
  max-width: calc(var(--content-max) + var(--space-12) * 2);
}

/* Mobile: collapse sidebar to horizontal top bar */
@media (max-width: 768px) {
  .site-frame {
    grid-template-columns: 1fr;
    grid-template-areas:
      "sidebar"
      "main";
  }

  .site-sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .site-nav {
    display: flex;
    flex-direction: row;
    gap: var(--space-4);
  }
}
```

### Pattern 3: FOUC-Prevention Inline Script
**What:** Small inline `<script>` in `<head>` applies `data-theme` before page renders, preventing flash of wrong theme.
**When to use:** Required whenever dark mode is stored in localStorage.

```html
<!-- In default.hbs <head>, BEFORE stylesheet link -->
<script>
  (function() {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

### Pattern 4: Dark Mode Toggle JS
**What:** Button in sidebar reads/writes `data-theme` on `<html>` and persists to localStorage.
**When to use:** The toggle button at the bottom of the sidebar.

```javascript
// Source: verified pattern from whitep4nth3r.com
const toggleBtn = document.querySelector('[data-theme-toggle]');
const html = document.documentElement;

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleBtn.setAttribute('aria-label',
      next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  });
}
```

### Pattern 5: Ghost Navigation Partial
**What:** `partials/navigation.hbs` overrides Ghost's default `{{navigation}}` output with sidebar-appropriate markup.
**When to use:** Required — the default Ghost nav output uses a `<ul class="nav">` that doesn't match the sidebar structure.

```handlebars
{{! partials/navigation.hbs }}
{{#if @site.navigation}}
<nav class="site-nav" aria-label="Primary navigation">
  {{#foreach navigation}}
  <a class="nav-link {{#if current}}is-active{{/if}}" href="{{url}}">{{label}}</a>
  {{/foreach}}
</nav>
{{/if}}
```

### Anti-Patterns to Avoid
- **Hardcoded hex values in CSS outside `:root`:** Every color must go through a `--color-*` custom property. The planner should explicitly check for any `#` hex values outside the token block.
- **Putting FOUC prevention script after the stylesheet link:** The inline script must run before CSS loads to work correctly.
- **Setting `data-theme` on `<body>` instead of `<html>`:** The inline script runs before `<body>` exists; put the attribute on `<html>`.
- **Using `position: fixed` for the sidebar:** Sticky works better — fixed requires compensating margin on main content and breaks in some scroll containers.
- **Loading all Google Font weights:** Each weight is a separate HTTP request. Load only what the design uses (400, 600 for body; 400, 600, italic for headings).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading | Custom font-face declarations | Google Fonts CDN link | CDN handles subsetting, WOFF2 format, delivery optimization |
| Nav data | Custom nav data in HBS | Ghost `{{navigation}}` helper + `partials/navigation.hbs` | Ghost Admin manages nav items; helper outputs current-page detection automatically |
| CSS preprocessing | Custom build scripts | Existing Rollup + postcss-preset-env | Already configured; handles nesting and modern CSS syntax |
| Theme persistence | Cookies or URL params | `localStorage` | Standard browser API, zero server overhead, correct pattern |

**Key insight:** Ghost's `{{navigation}}` helper automatically provides `{{current}}` (active state boolean) and `{{slug}}` per nav item — there is no need to implement active link detection manually.

---

## Common Pitfalls

### Pitfall 1: Flash of Wrong Theme (FOUC)
**What goes wrong:** Page renders in light mode briefly before JS switches to dark, causing a visible flash.
**Why it happens:** The `main.js` script loads after the DOM is painted. By the time it reads localStorage, the user already sees the wrong theme.
**How to avoid:** Put a tiny inline `<script>` block in `<head>` (before the CSS link) that sets `data-theme` on `<html>` synchronously. This runs before any paint.
**Warning signs:** If you see the background color flash on page load in dark mode.

### Pitfall 2: Ghost `ghost_head` Overriding Fonts
**What goes wrong:** Ghost Admin custom fonts or theme settings inject their own `@font-face` / CSS variables that conflict with the theme's font declarations.
**Why it happens:** Ghost's `{{ghost_head}}` helper outputs font CSS variables (`--gh-font-heading`, `--gh-font-body`) based on Admin settings. The existing `screen.css` already resets these to `inherit`.
**How to avoid:** Keep the existing `:root { --gh-font-heading: inherit; --gh-font-body: inherit; }` reset at the top of `screen.css`. Define font families only via the theme's own custom properties (`--font-heading`, `--font-body`).
**Warning signs:** Headings revert to system font on sites where Admin has a custom font setting.

### Pitfall 3: Sidebar Scrolls Off-Screen on Short Viewports
**What goes wrong:** `position: sticky; height: 100vh` sidebar traps its own scroll context — if the sidebar content is taller than the viewport, the dark mode toggle at the bottom is unreachable.
**Why it happens:** At ~200px wide, the sidebar nav content is short — but if it ever grows, or on very small laptops, `100vh` clips it.
**How to avoid:** Use `overflow-y: auto` on the sidebar div so it can scroll independently. The toggle at the bottom remains reachable.
**Warning signs:** Dark mode toggle invisible on short browser windows.

### Pitfall 4: Google Fonts Render-Blocking
**What goes wrong:** Fonts block page render, causing visible delay before text appears.
**Why it happens:** Standard `<link rel="stylesheet">` for Google Fonts is render-blocking.
**How to avoid:** Use `preconnect` hints for both `fonts.googleapis.com` and `fonts.gstatic.com`, followed by the stylesheet link with `display=swap` in the URL. The `font-display: swap` in the Google Fonts CSS means text shows immediately in fallback font.
**Warning signs:** Blank page for >500ms before text appears; Lighthouse "Eliminate render-blocking resources" warning.

### Pitfall 5: Mobile Nav Overflow
**What goes wrong:** Five nav links in a horizontal row overflow the viewport on small phones.
**Why it happens:** Nav links have a minimum intrinsic width; 5 items at default font size can exceed 375px.
**How to avoid:** Set `font-size` smaller on the mobile nav (e.g., 1.3rem), allow `flex-wrap: wrap`, or reduce padding. Test at 375px viewport width.
**Warning signs:** Nav links overlap or clip on iPhone SE viewport.

---

## Code Examples

Verified patterns from official and authoritative sources:

### Google Fonts Preconnect + Load (default.hbs head)
```html
<!-- Source: Google Fonts documentation / brightthemes.com verified pattern -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap">
```

### Ghost Navigation Foreach Loop
```handlebars
{{! Source: ghost.org/docs/themes/helpers/navigation/ }}
{{#foreach navigation}}
  <a href="{{url}}" class="{{#if current}}active{{/if}}">{{label}}</a>
{{/foreach}}
```

### Dark Mode CSS Variable Swap
```css
/* Source: verified whitep4nth3r.com pattern */
:root                { --color-bg: #FAF7F2; --color-text: #2D2926; }
[data-theme="dark"]  { --color-bg: #1C1917; --color-text: #EDE8E3; }

/* System preference fallback (no JS) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #1C1917;
    --color-text: #EDE8E3;
  }
}
```

### CSS Grid Sidebar (skeleton)
```css
/* Source: MDN CSS Grid documentation */
body {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
}
@media (max-width: 768px) {
  body { grid-template-columns: 1fr; }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate dark.css stylesheet | CSS custom property swap via `[data-theme]` | ~2020, now universal | One stylesheet, no flash |
| `@import` Google Fonts in CSS | `<link rel="preconnect">` + `<link rel="stylesheet">` in HTML | ~2021 | Faster loading, not render-blocked by CSS parse |
| `document.body.classList.add('dark')` | `document.documentElement.setAttribute('data-theme', 'dark')` | ~2022 | FOUC-safe (html element exists before body) |
| Flexbox sidebar with wrapper divs | CSS Grid `grid-template-columns` | ~2021 | Cleaner markup, no extra wrappers needed |

**Deprecated/outdated:**
- `@import url(...)` for Google Fonts in CSS: blocks rendering — use `<link>` in HTML head instead
- `prefers-color-scheme` media query as the sole theming mechanism: doesn't allow user override — combine with `[data-theme]` attribute

---

## Open Questions

1. **Sidebar breakpoint for mobile collapse**
   - What we know: User left this to discretion; mobile pattern is horizontal top bar (not hamburger)
   - What's unclear: Whether 768px or 900px breakpoint is better given the 200px sidebar width
   - Recommendation: 768px is the industry standard tablet breakpoint; start there, adjust if nav looks cramped on 768–900px range

2. **Social icon implementation**
   - What we know: Small social links at sidebar bottom; icon approach (SVG vs font icons) is Claude's discretion
   - What's unclear: Which platforms; how many icons fit cleanly in 200px sidebar
   - Recommendation: Inline SVGs — no extra HTTP request, fully styleable with currentColor, no font loading overhead

3. **Dark mode transition**
   - What we know: Smooth vs instant is Claude's discretion
   - Recommendation: A brief `transition: background-color 200ms ease, color 200ms ease` on body elements feels polished without being distracting. Skip transitioning everything (`* { transition: ... }`) as it causes jank.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | gscan (Ghost theme linter) — already installed |
| Config file | none — runs via `npm test` → `gscan .` |
| Quick run command | `npm test` |
| Full suite command | `npm test` (same — gscan validates full theme) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VIS-01 | Cream background + terracotta accent visible | manual | Visual verification in browser | N/A |
| VIS-02 | No hardcoded hex values in templates | manual audit | `grep -r '#[0-9a-fA-F]\{3,6\}' assets/css/` (outside :root block) | ❌ Wave 0 |
| VIS-03 | Lora + IBM Plex Serif render (not system font) | manual | Visual check in browser | N/A |
| VIS-04 | Dark mode toggle switches theme, persists on reload | manual | Browser DevTools localStorage check | N/A |
| FOUND-03 | Sidebar collapses below breakpoint | manual | Browser resize / DevTools responsive mode | N/A |
| ALL | Theme passes gscan validation | automated | `npm test` | ✅ exists |

### Sampling Rate
- **Per task commit:** `npm test` (gscan validation)
- **Per wave merge:** `npm test` + manual browser verification at 375px, 768px, 1280px
- **Phase gate:** gscan green + visual verification across breakpoints + dark mode toggle functional before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No unit tests needed — Ghost theme validation is visual + gscan; gscan already configured
- Note: Visual requirements (VIS-01, VIS-03, VIS-04, FOUND-03) are not automatable via CLI — they require browser verification documented in the verify step

---

## Sources

### Primary (HIGH confidence)
- [Ghost Navigation Helper docs](https://docs.ghost.org/themes/helpers/data/navigation) — `{{navigation}}`, `{{#foreach navigation}}`, attributes available, `navigation.hbs` override pattern
- [Ghost default.hbs tutorial](https://ghost.org/tutorials/default/) — `{{ghost_head}}`, `{{ghost_foot}}`, `{{{body}}}`, `{{body_class}}` helpers
- [Google Fonts CDN](https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap) — Lora and IBM Plex Serif both available with weights 400/600 regular + italic, `font-display: swap` confirmed
- MDN CSS Grid documentation — `grid-template-columns`, `grid-template-areas` patterns
- W3C CSS Custom Properties specification — `[data-theme]` selector pattern

### Secondary (MEDIUM confidence)
- [whitep4nth3r.com dark mode toggle](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/) — complete JS pattern verified; preference cascade: localStorage → system → default
- [brightthemes.com Google Fonts in Ghost](https://brightthemes.com/blog/ghost-google-fonts) — placement in `default.hbs` head, preload pattern, Ghost-specific considerations
- [Ghost forum: dark mode toggle](https://forum.ghost.org/t/change-to-dark-mode-with-a-button/9878) — community-verified approach using CSS custom properties and `data-theme`

### Tertiary (LOW confidence)
- WebSearch results for FOUC prevention patterns — consistent across multiple sources, elevated to MEDIUM confidence by cross-referencing

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tooling verified against installed package.json, Ghost docs confirmed
- Architecture: HIGH — CSS Grid sidebar, custom property theming, Ghost navigation patterns all verified from official sources
- Pitfalls: HIGH — FOUC, Ghost font conflict, and mobile overflow are all verified failure modes from official/community sources

**Research date:** 2026-03-24
**Valid until:** 2026-06-24 (stable domain — CSS/Ghost theming patterns rarely change in 90 days)
