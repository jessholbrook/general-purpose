# Pitfalls Research

**Domain:** Ghost Handlebars theme — personal website (Ghost.io hosted)
**Researched:** 2026-03-23
**Confidence:** HIGH (core Ghost requirements), MEDIUM (workflow and design patterns)

---

## Critical Pitfalls

### Pitfall 1: Missing Required Files or Helpers — Fatal Validation Failure

**What goes wrong:**
Theme uploads to Ghost.io and immediately fails activation with a "this theme is invalid" error. No preview is possible, and the uploaded zip is rejected entirely.

**Why it happens:**
Ghost uses GScan to validate every theme on upload. Three files are mandatory: `index.hbs`, `post.hbs`, and `package.json`. Five helpers are also required in templates: `{{asset}}`, `{{body_class}}`, `{{post_class}}`, `{{ghost_head}}`, and `{{ghost_foot}}`. Developers building from scratch sometimes omit `{{ghost_head}}` or `{{ghost_foot}}` in their `default.hbs` because they don't look like "visible" content — but these inject critical SEO, analytics, and membership code that Ghost depends on.

**How to avoid:**
Run `gscan` locally (or via https://gscan.ghost.org) on the zip before every upload. Treat GScan warnings as errors. Checklist for every theme scaffold: `index.hbs`, `post.hbs`, `package.json`, and all five required helpers present in `default.hbs`.

**Warning signs:**
"This theme is invalid and cannot be activated" error in Ghost Admin. Theme activates but SEO tags or analytics are missing from page source. Ghost Admin shows red warning badge on theme.

**Phase to address:**
Phase 1 (Theme scaffold) — build the skeleton with all required files and helpers before writing any design code.

---

### Pitfall 2: Asset Paths That Work Locally But Break in Production

**What goes wrong:**
CSS loads locally but fonts, images, and background images referenced in CSS fail to load after uploading to Ghost.io. The browser console shows 404s on asset URLs.

**Why it happens:**
Ghost installs can live at a subdirectory or behind a CDN, so relative paths like `url('../fonts/Lora.woff2')` in CSS break. Ghost provides the `{{asset}}` Handlebars helper specifically to generate correct absolute paths — but CSS files processed by a build tool (Gulp/Webpack) can't use Handlebars helpers inside them. The correct pattern is to reference fonts/images relative to the CSS file's location in the `assets/` folder, not relative to the HTML root.

A second variant: using a build tool (Gulp) that corrupts binary files (fonts, images) when processing them — the Gulp 5.0 upgrade has a known bug where binary assets get corrupted. The zip will appear valid but fonts fail to decode.

**How to avoid:**
- Place all fonts in `assets/fonts/`, images in `assets/images/`. Reference them with CSS relative paths from `assets/css/` (e.g., `url('../fonts/Lora.woff2')`).
- In `.hbs` templates, always use `{{asset "css/screen.css"}}` — never a bare path.
- After every upload, open DevTools Network tab and check every font and image request returns HTTP 200.
- If using Gulp, pin to a known-working version and test that binary assets (woff2, png) are not modified during the build.

**Warning signs:**
Fonts render as fallback serif/sans-serif on production but look correct locally. CSS background images missing on production. DevTools shows ERR_FILE_NOT_FOUND or 404 for assets.

**Phase to address:**
Phase 1 (scaffold) — establish correct asset folder structure and `{{asset}}` conventions immediately. Phase 2 (typography) — validate all fonts load on upload.

---

### Pitfall 3: Sidebar Navigation Layout That Collapses on Mobile

**What goes wrong:**
The sidebar navigation design looks great on desktop but either disappears entirely on mobile or stacks awkwardly, breaking the reading experience.

**Why it happens:**
Sidebar layouts require a fundamentally different HTML/CSS structure than top-bar navigation. CSS Grid or Flexbox must be used with explicit breakpoints. A common mistake is applying the sidebar with absolute positioning or float-based layout that doesn't reflow correctly at small viewports. Another mistake is not accounting for the sidebar taking horizontal space that compresses the content area on tablet widths (where neither desktop sidebar logic nor mobile single-column logic applies cleanly).

The design inspiration sites (Mustafa Suleyman, People and Blogs) all implement sidebar nav as desktop-only — the sidebar collapses to a hamburger menu or top bar below a breakpoint. Trying to force a persistent sidebar on mobile creates usability problems.

**How to avoid:**
Use CSS Grid: two-column layout (`sidebar | content`) for desktop (min-width ~900px), single-column for mobile with nav collapsing to a top strip or hamburger. Hide the sidebar on mobile and provide a fallback mobile nav in the template. Test at 375px, 768px, and 1280px minimum.

**Warning signs:**
Content area is too narrow at 1024px. Sidebar text wraps badly at medium widths. No mobile nav fallback in the HTML.

**Phase to address:**
Phase 2 (layout/navigation) — design the grid and breakpoints before adding content sections.

---

### Pitfall 4: Confusing Ghost Pages with Ghost Posts for Non-Blog Content

**What goes wrong:**
Publications, Products, and Experiments sections are implemented as blog posts tagged with a category, rather than as proper Ghost Pages or custom routes. This means they appear in the main blog feed, in RSS, and in author archives — polluting the blog stream and confusing readers.

**Why it happens:**
Ghost's primary data model is "posts." Developers default to tags (`tag:publications`) to filter content into sections, which works but leaks into everywhere posts appear unless every template explicitly filters. Ghost Pages (content editor pages) exist for exactly this use case but have different template lookup rules, and routes.yaml is required to make them appear at custom URLs.

**How to avoid:**
Use Ghost Pages (not posts) for Publications, Products, and Experiments. Each section gets a static page in the Ghost editor. The page slug defines the URL. Build `page-publications.hbs`, `page-products.hbs`, `page-experiments.hbs` custom templates for each section's layout. No routes.yaml needed for simple pages — only required if you want a different URL structure.

**Warning signs:**
Non-blog content appearing in RSS feed. Blog index showing Publications entries. Tag archives mixing content types.

**Phase to address:**
Phase 1 (structure decisions) — define which content types are Posts vs Pages before any templates are built.

---

### Pitfall 5: Iterative Development Friction from Manual Zip Upload

**What goes wrong:**
Development slows to a crawl because each change requires: edit file → run build → create zip → open Ghost Admin → upload → activate → reload page → check result. A 5-second code change becomes a 2-minute deploy cycle.

**Why it happens:**
Ghost.io hosted does not support direct file access. The only official deployment path is zip upload through Ghost Admin. Without automation, every iteration is manual. For a theme built from scratch with significant CSS work, this means dozens of upload cycles before the design is complete.

**How to avoid:**
Set up the Ghost Admin API deployment from day one. Create a custom integration in Ghost Admin → get Admin API key → use `TryGhost/action-deploy-theme` GitHub Action or the Ghost Admin API `PUT /themes/{name}` endpoint directly with curl. A `make deploy` command that runs `npm run zip && curl -X PUT...` cuts the loop to one command. Alternatively, use Ghost's official GitHub integration which deploys on every push to main.

For CSS-only iteration: use Ghost's Code Injection (Admin → Settings → Code Injection) for rapid style experiments before committing them to the theme CSS file.

**Warning signs:**
You've uploaded more than 5 zips in a single session. You're dreading making small changes because deployment takes too long.

**Phase to address:**
Phase 0 / Phase 1 setup — automate deployment before doing any design work. One-time setup pays off immediately.

---

### Pitfall 6: package.json Version and Name Format Errors

**What goes wrong:**
Theme uploads fail with a cryptic GScan validation error, even though all `.hbs` files look correct. The error message may not clearly indicate the source.

**Why it happens:**
Ghost's GScan enforces specific `package.json` constraints that differ from npm conventions:
- `version` must be a valid semver string like `"1.0.0"` — `"1.0"` fails
- `name` must be a hyphenated string — scoped names like `@org/theme` fail
- The `engines.ghost` field should specify a compatible Ghost version range
- Malformed JSON (trailing commas, etc.) fails silently in some cases

**How to avoid:**
Use the Ghost Starter theme's `package.json` as a canonical reference. Required fields: `name` (hyphenated), `version` (semver), `description`, `engines.ghost`. Run `gscan` on every zip before upload — it catches `package.json` errors before Ghost Admin does.

**Warning signs:**
"This theme is invalid" with no specific template errors shown. Upload succeeds but theme cannot be activated.

**Phase to address:**
Phase 1 (scaffold) — validate `package.json` format against GScan before writing any theme code.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoding CSS values instead of CSS variables | Faster initial styling | Palette changes require global find/replace | Never — use variables from the start |
| Using Code Injection for structural CSS | Skips theme rebuild cycle | Styles live outside version control, grow unmaintainable | Only for quick experiments, commit to theme CSS before shipping |
| Duplicating header/footer HTML across templates instead of using partials | Simpler initially | One nav change requires editing every template | Never — build partials immediately |
| Inline styles on elements for "quick fixes" | Instant result | Impossible to maintain, breaks responsive overrides | Never in theme files |
| Skipping mobile testing during desktop design | Faster desktop iteration | Entire layout needs rework when tested on mobile | Never — test at 375px from the start |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Ghost Admin API (theme deploy) | Using personal password instead of API key | Create a Custom Integration in Ghost Admin; use the generated Admin API key |
| Google Fonts | Linking via `<link>` tag in template `<head>` directly | Use `{{ghost_head}}` injection or Code Injection setting; never hard-code in `default.hbs` `<head>` before `{{ghost_head}}` or fonts may conflict with Ghost's own font system |
| Self-hosted web fonts | Placing fonts outside `assets/` folder | All fonts must be inside `assets/fonts/`; reference via CSS relative path from `assets/css/` |
| Ghost Content API for custom sections | Fetching posts client-side with API key exposed in JS | For a personal site with static sections, use Ghost Pages + custom templates — no API call needed |
| GitHub Actions theme deploy | Not including built assets in the zip | Run `npm run zip` or ensure the GitHub Action runs the build step before zipping; `assets/dist/` must be included |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Loading multiple large web font families | Slow first paint, layout shift (FOUT) | Use `font-display: swap`, preload the primary serif font, limit to 2 font families max | Immediately on slower connections |
| No font subsetting for serif body font | Font file 300KB+ for Latin-only content | Use Google Fonts with `&subset=latin` or use `pyftsubset` for self-hosted fonts | Every page load |
| Images in theme (hero photo, etc.) not sized for web | Large hero images slow LCP | Export at 2x max (2000px wide), compress to WebP or optimized JPEG | Immediately for users on mobile |
| Rendering all blog post excerpts on index with full featured images | Index page heavy for many posts | Lazy-load images below the fold; Ghost's `{{img_url feature_image size="m"}}` generates responsive sizes | At 20+ posts |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Sidebar nav with no active state indicator | Visitors can't tell which section they're in | Use `{{body_class}}` to detect current page context; add CSS `.page-about .nav-about { font-weight: bold; }` pattern |
| Blog post list showing full post content instead of excerpt | Endless scrolling homepage, no reason to click | Use `{{excerpt}}` helper in index.hbs, limit to 40-50 words |
| Missing fallback for posts without featured images | Broken layout on image-dependent card designs | Design card/list items to look complete with no image; treat featured image as an enhancement |
| External links (Experiments, Products) opening in same tab | Visitors leave the site accidentally | Add `target="_blank" rel="noopener"` to external links; Ghost's `{{external_url}}` helper or manual links in Pages editor |
| No visual distinction between blog posts and static pages in navigation | Confusing site structure | Sidebar nav items should visually differentiate "sections" (Products, Publications) from "feed" (Blog) |

---

## "Looks Done But Isn't" Checklist

- [ ] **ghost_head / ghost_foot:** Verify both are in `default.hbs`; missing them breaks SEO meta, social cards, and Ghost's member features — check page source for `<meta property="og:` tags
- [ ] **Mobile navigation:** Sidebar collapses gracefully; test at 375px, 768px, 1280px before calling layout complete
- [ ] **404 page:** `error.hbs` template exists and renders gracefully — Ghost shows a blank white page if missing
- [ ] **Asset 200 checks:** Every font file and image in `assets/` returns HTTP 200 after upload; check DevTools Network tab filtered to "Font" and "Img"
- [ ] **Blog feed is clean:** Publications, Products, Experiments do NOT appear in the main post index or RSS
- [ ] **Post without featured image:** Index page and post page both render correctly with no image (don't assume every post has one)
- [ ] **package.json gscan pass:** Run `gscan` before every upload; zero fatal errors, zero errors (warnings acceptable)
- [ ] **Custom page templates registered:** Ghost Admin → New Page → dropdown shows the custom template options for Publications, Products, Experiments
- [ ] **Active nav state:** Current section is visually highlighted in sidebar for each page type

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Fatal GScan validation error blocking activation | LOW | Run `gscan .` locally, fix reported errors, re-zip, re-upload |
| Broken assets after upload | LOW-MEDIUM | Inspect Network tab for 404s; verify asset paths in CSS use relative paths from `assets/css/`; re-zip with corrected paths |
| Sidebar layout broken on mobile | MEDIUM | Rebuild layout using CSS Grid with explicit breakpoints; likely requires restructuring HTML in `default.hbs` |
| Blog feed contaminated with non-blog content | MEDIUM | Migrate content from Posts to Pages in Ghost editor; create `page-{slug}.hbs` templates; update nav links |
| No deploy automation, manual upload bottleneck | LOW | One-time setup: create Ghost Admin API Custom Integration, add deploy script, done |
| Missing `ghost_head` / `ghost_foot` discovered late | LOW | Add to `default.hbs`, redeploy — Ghost injects its scripts; no content migration needed |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Missing required files/helpers | Phase 1 (Scaffold) | Run `gscan` on initial zip; confirm `{{ghost_head}}` in page source |
| Broken asset paths in production | Phase 1 + Phase 2 (Typography) | Check DevTools Network after every upload for font/image 404s |
| Sidebar layout mobile collapse | Phase 2 (Layout/Navigation) | Test at 375px on real device or Chrome DevTools before advancing |
| Blog feed contamination | Phase 1 (Content structure decisions) | Check `/` index and `/rss/` feed contain only blog posts |
| Manual upload bottleneck | Phase 0 / Phase 1 Setup | Deploy script exists and works before design iteration begins |
| package.json validation errors | Phase 1 (Scaffold) | `gscan` passes with zero errors before any other work |
| No active nav state | Phase 2 (Navigation) | Click each nav item; confirm active state renders |
| Missing 404 template | Phase 3 (Polish) | Navigate to `/nonexistent-page` and verify `error.hbs` renders |

---

## Sources

- [Ghost Theme Structure — Official Docs](https://docs.ghost.org/themes/structure/)
- [GScan — Ghost Theme Validator](https://docs.ghost.org/themes/gscan/)
- [Ghost Handlebars Theme Helpers: asset](https://ghost.org/docs/themes/helpers/asset/)
- [Ghost Forum: Assets working locally but corrupted when uploading](https://forum.ghost.org/t/assets-working-locally-but-most-are-corrupted-when-uploading-my-theme/57382)
- [Ghost Forum: Upgrade to Gulp 5.0 breaks theme assets](https://forum.ghost.org/t/upgrade-to-gulp-5-0-breaks-building-theme-assets-corrupted-fonts-images-etc/50571)
- [Ghost Forum: Theme invalid, errors not displayed](https://forum.ghost.org/t/this-theme-is-invalid-and-cannot-be-activated-but-errors-not-displayed/43857)
- [Electron Themes: Troubleshoot common Ghost theme problems](https://electronthemes.com/blog/troubleshoot-common-problems-in-ghost-theme)
- [Bright Themes: Ghost Custom Pages](https://brightthemes.com/blog/ghost-custom-pages)
- [Bright Themes: Ghost Custom Fonts](https://brightthemes.com/blog/ghost-custom-fonts)
- [Ghost Tutorials: Code Injection](https://ghost.org/tutorials/use-code-injection-in-ghost/)
- [Deploy Ghost Theme — GitHub Marketplace](https://github.com/marketplace/actions/deploy-ghost-theme)
- [Ghost Forum: Best workflow for custom theme + managed Ghost install](https://forum.ghost.org/t/best-workflow-for-a-custom-theme-managed-ghost-install/6626)
- [Ghost Forum: Sidebar for Casper theme](https://forum.ghost.org/t/sidebar-for-casper-theme/28651)

---
*Pitfalls research for: Ghost Handlebars theme — personal website on Ghost.io*
*Researched: 2026-03-23*
