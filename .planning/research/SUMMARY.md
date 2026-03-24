# Project Research Summary

**Project:** general-purpose — Custom Ghost Handlebars Theme
**Domain:** Ghost-based personal website (writer/researcher)
**Researched:** 2026-03-23
**Confidence:** HIGH

## Executive Summary

This project is a custom Ghost 6 Handlebars theme for a personal site at general-purpose.ghost.io. The domain is well-documented — Ghost's Handlebars templating system has a fixed, well-understood structure, and the official TryGhost/Starter repo provides a validated starting point. The stack is largely mandated by the platform: Handlebars for templates, PostCSS + Rollup for asset building, Node.js 22 (required by Ghost 6), and gscan for validation. There is no meaningful stack decision to make here; the choices are build tool ergonomics around a fixed core.

The design direction is clear: a sidebar navigation layout with a bold serif hero, warm cream/terracotta palette, and curated sections for Blog, Publications, Products, and Experiments. Reference sites (Mustafa Suleyman, Maggie Appleton, Manuel Moreale) validate this pattern. The MVP is achievable with 11-13 Handlebars template files, a single CSS file with design tokens, and zero JavaScript for v1. All "table stakes" features (SEO, RSS, sitemaps, Open Graph) are generated automatically by Ghost — no theme code required.

The primary risk is workflow friction, not technical complexity. Ghost.io hosted requires zip upload for every theme iteration, creating slow feedback loops. This must be mitigated with a deploy script (Ghost Admin API + curl or the TryGhost GitHub Action) before any design work begins. The second risk is the sidebar navigation requiring explicit responsive treatment — a persistent sidebar on mobile breaks usability and the HTML/CSS structure must be designed for two-column desktop and single-column mobile from the start.

## Key Findings

### Recommended Stack

Ghost 6 mandates Handlebars as the sole templating language — there is no alternative for server-rendered themes. The official TryGhost/Starter repo establishes the canonical build pipeline: Rollup 4 for JS bundling and PostCSS 8 + postcss-preset-env 10 for CSS. Node.js 22 LTS is required (Ghost 6 dropped support for Node 18 and 20). For this content-forward personal site, the CSS build pipeline is the most important infrastructure decision; the JS bundle can remain minimal or be skipped entirely for v1.

**Core technologies:**
- Handlebars: Ghost's only supported template language — no choice exists, use it
- Ghost 6 (local via ghost-cli): local dev server required for real rendering preview; zip-upload-only is too slow
- Node.js 22 LTS: required by Ghost 6; earlier versions are incompatible
- PostCSS + postcss-preset-env 10: official starter's CSS pipeline; compiles modern CSS (nesting, custom properties) for broad browser support
- Rollup 4: official starter's JS bundler; minimal config for a content site
- gscan: run before every upload; Ghost Admin blocks zips with fatal validation errors

**Avoid:** AMP templates (removed in Ghost 6), Webpack (heavier with no benefit), Tailwind (utility classes work against an intentional editorial aesthetic), the Ghost 5 engines field format.

### Expected Features

All SEO, Open Graph, RSS, sitemaps, and canonical URLs are automatic — zero theme work. These are table stakes that Ghost handles.

**Must have for launch (v1):**
- Custom homepage (`home.hbs`) with bold hero + intro statement — establishes identity immediately
- Blog listing + individual post pages — primary content surface
- About page — static Ghost page
- Publications, Products, Experiments section pages — curated sections with card layouts
- Sidebar navigation — persistent structure with collapse behavior on mobile
- Warm serif visual identity — cream background, terracotta accent, generous whitespace
- Responsive layout — sidebar collapses at mobile breakpoint
- Feature images on posts — required for scannable post list

**Should have after launch (v1.x):**
- Reading progress indicator on posts
- Social sharing links
- Newsletter signup (Ghost Portal makes this trivial to add)
- Pagination (when post count exceeds ~20)

**Defer to v2+:**
- Dark mode — doubles CSS complexity; warm palette looks poor inverted; revisit after visual identity is locked
- Search — defer until 50+ posts justify it
- Comments — likely never; personal sites don't benefit from active comment communities
- Google Scholar API integration — manual curation is sufficient for v1

### Architecture Approach

Ghost uses a template hierarchy where `default.hbs` is the base layout (containing the sidebar nav, `{{ghost_head}}`, and `{{ghost_foot}}`), and all other templates declare `{{!< default}}` to inherit it. Page-specific content fills the `{{{body}}}` slot. Custom section pages (Publications, Products, Experiments) are implemented as `custom-*.hbs` templates — static Ghost Pages select these in Admin's template dropdown. Partials under `partials/` handle reusable fragments (navigation, post cards, section cards, footer). There is no backend, no API calls at runtime, and no JS required for v1.

**Major components:**
1. `default.hbs` — base HTML shell with sidebar nav, `{{ghost_head}}`, `{{ghost_foot}}`; every page inherits this
2. `home.hbs` — custom homepage with hero section; overrides default Ghost post-list behavior at `/`
3. `index.hbs` + `partials/post-card.hbs` — blog listing with reusable post card component
4. `post.hbs` — single post rendering with full article content
5. `page.hbs` — static page fallback (About); custom-*.hbs for Publications, Products, Experiments
6. `partials/navigation.hbs` — sidebar nav rendered once in `default.hbs`, present on every page
7. `assets/css/screen.css` — single stylesheet with CSS custom properties as design token layer
8. `routes.yaml` — uploaded separately in Ghost Admin Labs; maps `/` to `home.hbs`, `/blog/` to post collection

**Build order from architecture research:** `package.json` → CSS tokens → `default.hbs` → nav partial → `index.hbs` + post-card → `home.hbs` → `post.hbs` → `page.hbs` → custom section templates → `error.hbs` → Ghost Admin wiring.

### Critical Pitfalls

1. **Missing required files or helpers** — Fatal gscan validation error on upload. Run `gscan` before every zip. Required: `index.hbs`, `post.hbs`, `package.json`, and all five helpers (`{{asset}}`, `{{body_class}}`, `{{post_class}}`, `{{ghost_head}}`, `{{ghost_foot}}`). Build the validated skeleton before any design work.

2. **Manual zip upload bottleneck** — Without deploy automation, every CSS tweak becomes a 2-minute upload cycle. Set up the Ghost Admin API deploy script (or TryGhost GitHub Action) before starting design iteration. This is a Phase 0 setup item.

3. **Sidebar nav mobile collapse** — A persistent sidebar on mobile breaks usability and is technically the most complex CSS challenge in the theme. Design the CSS Grid layout with explicit breakpoints (two-column desktop / single-column mobile) from the start. Test at 375px, 768px, and 1280px before advancing.

4. **Blog feed contamination** — Using Posts tagged with categories for Publications/Products/Experiments causes them to appear in the main blog feed and RSS. Use Ghost Pages (not Posts) for non-blog content sections, with `custom-*.hbs` templates.

5. **Broken asset paths after upload** — CSS relative paths and font references that work locally fail on Ghost.io due to CDN serving. Place fonts in `assets/fonts/`, reference via `url('../fonts/...')` from `assets/css/`. Use `{{asset}}` helper in all `.hbs` files. Verify every font returns HTTP 200 after every upload.

## Implications for Roadmap

Based on research, the build order is tightly dependency-constrained. Later phases can't be designed without the CSS token system, and the section pages can't be built without the `default.hbs` layout being stable.

### Phase 1: Foundation and Scaffold
**Rationale:** All later work depends on this. A validated theme skeleton with correct `package.json`, required files, and deploy automation eliminates the two biggest failure modes before design begins. Architecture research explicitly identifies this as the prerequisite for everything else.
**Delivers:** Valid Ghost 6 theme that passes gscan, deploys via automated script, has correct folder structure and asset conventions, and contains all required helpers in `default.hbs`.
**Addresses:** Blog listing (index.hbs), post pages (post.hbs), error page
**Avoids:** Fatal gscan validation failures, manual upload bottleneck, broken asset paths, blog feed contamination (content type decisions made here)

### Phase 2: Visual Identity and Layout
**Rationale:** CSS design tokens and the sidebar layout must be established before any section-specific work. The token system (colors, type scale, spacing) is the foundation all later templates reference. The sidebar navigation CSS is the single most complex element in the theme and needs mobile responsive treatment before sections are built on top of it.
**Delivers:** CSS custom properties palette (cream, terracotta, type scale), sidebar navigation layout with responsive collapse, warm serif typography established in `default.hbs`
**Uses:** PostCSS + postcss-preset-env pipeline; CSS Grid for sidebar layout; self-hosted or Google Fonts serif (Lora / Playfair Display / EB Garamond)
**Avoids:** Sidebar mobile collapse pitfall; hardcoded CSS values (use variables from the start); skipping mobile testing during desktop design

### Phase 3: Homepage and Blog
**Rationale:** The homepage and blog listing are the primary content surfaces and define the site's personality. Build these after the layout is stable so design decisions are final. The post card partial built here is reused in the homepage, so building it properly here avoids rework.
**Delivers:** `home.hbs` with bold hero + intro statement; `index.hbs` with post card listing; `partials/post-card.hbs` reusable component; `routes.yaml` configuration moving blog to `/blog/`; feature images and reading time metadata on post cards
**Implements:** Custom homepage pattern (home.hbs + routes.yaml); partials-for-repeated-components pattern
**Avoids:** Blog feed contamination from routes.yaml misconfiguration

### Phase 4: Section Pages
**Rationale:** Publications, Products, and Experiments pages share the card component pattern established in Phase 3. Build them together since they share template structure and the Ghost Admin wiring is a single setup step for all three.
**Delivers:** `custom-publications.hbs`, `custom-products.hbs`, `custom-experiments.hbs`; Ghost static pages created in Admin with correct slugs and custom templates assigned; shared card partial(s) for products and experiments
**Implements:** Custom templates for section pages pattern; partials per content type
**Avoids:** Blog feed contamination (these are Pages, not Posts); unstructured content in posts anti-pattern

### Phase 5: About and Polish
**Rationale:** `page.hbs` (About) is low-complexity and reuses established patterns. Error page is pure polish. Active nav states, external link behavior, missing-image fallbacks, and the "looks done but isn't" checklist are addressed here before launch.
**Delivers:** About page (`page.hbs`), error page (`error.hbs`), active nav state CSS, external link `target="_blank"` on Experiments, missing-image fallbacks on post cards, final gscan clean pass
**Avoids:** No 404 template pitfall; no active nav state UX issue; external links opening in same tab

### Phase Ordering Rationale

- Deploy automation must precede all design work (Phase 1) — the upload bottleneck pitfall is severe enough to kill iteration velocity
- CSS tokens must precede all visual work (Phase 2) — changing palette after templates are built requires global find/replace
- Sidebar layout must precede section templates (Phase 2 before Phase 4) — sections render inside the layout; structural rework cascades
- Post card partial built in blog phase (Phase 3) carries over to homepage and is the pattern for section cards (Phase 4)
- Section pages built together (Phase 4) because they share template structure and Ghost Admin wiring is a single operation

### Research Flags

Phases with well-documented patterns (skip research-phase during planning):
- **Phase 1 (Foundation):** Ghost scaffold requirements are exhaustively documented in official docs and gscan
- **Phase 2 (Visual Identity):** CSS Grid sidebar layout and PostCSS pipeline are standard patterns with no Ghost-specific complexity
- **Phase 3 (Homepage and Blog):** `home.hbs` + `routes.yaml` pattern is documented in official Ghost routing docs
- **Phase 4 (Section Pages):** `custom-*.hbs` pattern is fully documented; Ghost Admin wiring is mechanical

Phases that may need targeted research:
- **Phase 2 (Font loading):** Self-hosted font performance (subsetting, `font-display`, preloading) has nuance worth a targeted lookup if Lora/Playfair Display is self-hosted rather than Google Fonts
- **Phase 5 (Active nav states):** `{{body_class}}` pattern for active nav states is documented but the specific CSS selector pattern for sidebar nav context needs verification against Ghost 6

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official Ghost 6 changelog, TryGhost/Starter repo with exact versions, and gscan.ghost.org |
| Features | HIGH | Ghost helpers and template system are well-documented; reference sites validated the design direction; anti-features clearly identified |
| Architecture | HIGH | Official Ghost docs cover template hierarchy, context mapping, and build order; architecture is deterministic for this use case |
| Pitfalls | HIGH (core), MEDIUM (workflow) | Required files/helpers pitfalls verified against GScan spec; workflow pitfalls (upload bottleneck, font subsetting) from Ghost forum patterns |

**Overall confidence:** HIGH

### Gaps to Address

- **Font selection:** Research identified Lora, Playfair Display, and EB Garamond as candidates but did not make a final recommendation. This is a taste decision; validate against Jess's reference sites during Phase 2.
- **routes.yaml exact config:** The routing needed to serve `home.hbs` at `/` and the blog collection at `/blog/` requires a specific `routes.yaml` format. Verify against Ghost routing docs before Phase 3 — the syntax is finicky and YAML formatting errors fail silently.
- **Google Fonts vs self-hosted:** Self-hosting avoids GDPR concerns and is faster, but requires subsetting. Google Fonts is simpler. This decision has downstream implications for font-loading strategy in Phase 2.

## Sources

### Primary (HIGH confidence)
- https://github.com/TryGhost/Starter — Official TryGhost Starter theme; package.json with exact dependency versions verified
- https://docs.ghost.org/themes/ — Ghost Handlebars theme overview and required files
- https://docs.ghost.org/themes/structure/ — Required files (index.hbs, post.hbs, package.json); optional templates
- https://ghost.org/changelog/6/ — Ghost 6.0 changelog; Node 22 requirement; AMP removal confirmed
- https://docs.ghost.org/themes/gscan/ — GScan validation rules and required helpers
- https://github.com/TryGhost/action-deploy-theme — Official GitHub Action for Ghost theme deployment
- https://docs.ghost.org/themes/routing — routes.yaml syntax and collection configuration
- https://docs.ghost.org/themes/contexts/ — Context-to-template mapping

### Secondary (MEDIUM confidence)
- https://brightthemes.com/blog/ghost-custom-pages — custom-*.hbs pattern and Ghost Admin wiring
- https://forum.ghost.org/ — Upload bottleneck workflow patterns; font asset corruption in Gulp 5 (known issue)
- Reference sites: manuelmoreale.com, mustafasuleyman.com, maggieappleton.com — design direction validation

### Tertiary (LOW confidence)
- https://electronthemes.com/blog/troubleshoot-common-problems-in-ghost-theme — Troubleshooting patterns; needs cross-reference against official docs for specific claims

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
