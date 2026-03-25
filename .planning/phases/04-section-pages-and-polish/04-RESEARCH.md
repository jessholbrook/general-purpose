# Phase 4: Section Pages and Polish - Research

**Researched:** 2026-03-24
**Domain:** Ghost Handlebars custom page templates, navigation active state, curated content pages
**Confidence:** HIGH

## Summary

Phase 4 is the final build phase. All five requirements resolve to a well-understood Ghost pattern: `page-{slug}.hbs` custom templates. Ghost's template resolution hierarchy checks for `page-{slug}.hbs` first, then `page.hbs`, then `post.hbs`. This means creating `page-publications.hbs`, `page-products.hbs`, `page-experiments.hbs`, and `page-about.hbs` in the theme root gives each Ghost static page a fully custom template with zero routing configuration needed. The Ghost pages themselves are created in Ghost Admin.

The active navigation state (INFRA-03) is already wired in `partials/navigation.hbs` — `{{#if current}}is-active{{/if}}` is present and the `.nav-link.is-active` CSS rule is defined in `screen.css`. Ghost's `{{current}}` boolean works by comparing the nav item URL to the current page URL. As long as Ghost Admin navigation URLs match the page slugs exactly (e.g., `/publications/`), the active state will work automatically with no code changes needed.

The content on these pages is static/curated HTML rather than Ghost-managed posts. Publications is a manually maintained list; Products and Experiments are card grids; About is a prose page with photo. The correct approach for Publications is a dedicated custom template with hardcoded markup (not Ghost posts), since REQUIREMENTS.md explicitly defers automation to v2. Products, Experiments, and About similarly benefit from custom templates that give full markup control while still living inside Ghost as static pages (which enables Ghost Admin editing via the HTML card).

**Primary recommendation:** Create one `page-{slug}.hbs` file per section, add CSS for each card/list layout to `screen.css`, create the corresponding Ghost pages in Admin with matching slugs, and update Ghost Admin navigation to include all five sections with correct URLs.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SECT-01 | Publications page with manually curated academic papers (title, venue, year, link) | `page-publications.hbs` custom template — static HTML list, no Ghost data helpers needed; Ghost page provides the `{{content}}` escape hatch if admin editing is wanted later |
| SECT-02 | Products page with simple cards (image, name, description, link) | `page-products.hbs` with `.product-card` grid; images served from Ghost Admin CDN or external URLs |
| SECT-03 | Experiments page with cards linking to external projects | `page-experiments.hbs` with `.experiment-card` grid; links open in new tab with `rel="noopener noreferrer"` |
| ABOUT-01 | Dedicated about page with bio, photo, background | `page-about.hbs` with prose layout and a feature photo; use `{{#post}}{{feature_image}}{{/post}}` for the photo or hardcode src |
| INFRA-03 | Active navigation state for current section | Already wired — `{{#if current}}is-active{{/if}}` in `partials/navigation.hbs` and `.nav-link.is-active` in CSS; verify Ghost Admin nav URLs match page slugs |
</phase_requirements>

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| Ghost Handlebars `page-{slug}.hbs` | Ghost 6.x | Custom template per static page | Built-in Ghost template resolution — no configuration needed |
| Ghost static pages | Ghost 6.x | Content container for each section | Ghost pages provide slug routing, admin editing, SEO metadata |
| CSS custom properties | Already established | Card layouts and section-specific styles | Phase 2 built the entire design system; extend `screen.css` |
| `{{current}}` nav helper | Ghost 6.x built-in | Active navigation highlighting | Already in `partials/navigation.hbs`; works automatically |

### Supporting
| Library/Tool | Version | Purpose | When to Use |
|---|---|---|---|
| `{{post_class}}` | Ghost 6.x built-in | Body class for page-specific CSS targeting | Use in page template to get `page-{slug}` class on `<article>` |
| `{{title}}` in page context | Ghost 6.x built-in | Page heading from Ghost Admin | Use for `<h1>` in each page template |
| `{{content}}` in page context | Ghost 6.x built-in | Rendered body content from Ghost Admin editor | Optional — use if you want admin-editable page body alongside hardcoded sections |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `page-{slug}.hbs` per section | Single `page.hbs` with conditional logic | Conditional logic on slug is fragile and hard to maintain — named templates are cleaner |
| Static HTML in template | Ghost posts tagged as `#publications` | Tag-based approach requires posts in Ghost and routing config; not appropriate for a curated list |
| Hardcoded card markup in templates | Ghost custom data structures | Ghost has no native "card" data type for v1 — hardcoded markup is correct for this scope |

**Installation:** No new packages. Extend existing `screen.css`.

## Architecture Patterns

### Template File Set for Phase 4
```
page-publications.hbs     # NEW — /publications/ page
page-products.hbs         # NEW — /products/ page
page-experiments.hbs      # NEW — /experiments/ page
page-about.hbs            # NEW — /about/ page
assets/css/screen.css     # UPDATE — add card/list styles
```

Ghost Admin actions (outside theme files):
- Create 4 static pages with slugs: `publications`, `products`, `experiments`, `about`
- Update Ghost Admin navigation to include all 5 nav items with correct URLs
- No routes.yaml changes needed (static pages route automatically by slug)

### Pattern 1: Named Page Template (`page-{slug}.hbs`)
**What:** A `.hbs` file in the theme root named `page-{slug}.hbs` is automatically used for the Ghost static page with matching slug.
**When to use:** Any time a static page needs a layout that differs from the generic `page.hbs`.
**Example:**
```handlebars
{{! page-publications.hbs }}
{{!< default}}

<div class="publications-page">
    <h1 class="page-title">Publications</h1>
    <ul class="publications-list">
        <li class="publication-item">
            <span class="publication-title">
                <a href="https://doi.org/..." target="_blank" rel="noopener noreferrer">
                    Paper Title Here
                </a>
            </span>
            <span class="publication-meta">Venue Name &middot; 2024</span>
        </li>
    </ul>
</div>
```
Source: https://docs.ghost.org/themes/structure/ — "Custom templates for individual pages can be mapped using `page-:slug.hbs`"

### Pattern 2: Product / Experiment Card Grid
**What:** A grid of cards with image, name, description, and external link.
**When to use:** Products and Experiments pages where items are displayed visually in a grid.
**Example:**
```handlebars
{{! page-products.hbs }}
{{!< default}}

<div class="products-page">
    <h1 class="page-title">Products</h1>
    <div class="card-grid">
        <article class="product-card">
            <a href="https://..." class="product-card-link" target="_blank" rel="noopener noreferrer">
                <img class="product-card-image" src="{{asset "images/product-name.png"}}" alt="Product Name">
            </a>
            <div class="product-card-body">
                <h2 class="product-card-name">
                    <a href="https://..." target="_blank" rel="noopener noreferrer">Product Name</a>
                </h2>
                <p class="product-card-desc">Brief description of what this product does.</p>
            </div>
        </article>
    </div>
</div>
```

### Pattern 3: About Page with Photo
**What:** Prose page with a photo and bio. Photo can be served from Ghost Admin CDN (as page feature image) or hardcoded.
**When to use:** `page-about.hbs` only.
**Example:**
```handlebars
{{! page-about.hbs }}
{{!< default}}

<div class="about-page">
    <div class="about-photo">
        <img src="{{asset "images/jess-holbrook.jpg"}}" alt="Jess Holbrook">
    </div>
    <div class="about-content">
        <h1 class="page-title">About</h1>
        {{content}}
    </div>
</div>
```
Note: `{{content}}` here renders the body of the Ghost page from Admin — this lets Jess edit her bio in Ghost Admin without touching theme files.

### Pattern 4: Active Navigation State (Already Implemented)
**What:** `{{#if current}}is-active{{/if}}` in `partials/navigation.hbs` adds `.is-active` to the matching nav link.
**How Ghost resolves `current`:** Ghost compares each nav item's URL to the current page URL. If the nav item URL is `/publications/` and the visitor is on the page at `/publications/`, `current` is `true`.
**No code change needed** — already implemented correctly. The only action required is ensuring Ghost Admin navigation URLs are exact matches to page slugs.

### Anti-Patterns to Avoid
- **Using `{{content}}` for publications list:** The Ghost editor will strip HTML card custom markup on save. For Publications, hardcode the list in the template where presentation control is needed, OR write the list as Markdown/HTML in the Ghost page's HTML card (which preserves HTML). Both are valid; hardcoding in the template is simpler for launch.
- **Linking to external pages without `rel="noopener noreferrer"`:** All external links (product sites, experiment URLs, paper DOIs) must include this attribute for security.
- **Missing `target="_blank"` on external links:** Experiments especially link out — they should open in a new tab so the user doesn't lose the site.
- **Using `{{asset}}` for product/experiment images without adding them to `assets/`:** The `{{asset}}` helper only serves files that exist in the theme's `assets/` directory and are included in the theme zip. Alternatively, use absolute URLs (CDN-hosted images are fine).
- **Creating Ghost posts (not pages) for section content:** These are static pages, not blog posts. Use Ghost Admin → Pages, not Posts.
- **Expecting routes.yaml changes for static pages:** Ghost static pages automatically get routes at their slug — no routes.yaml entry needed. Only blog posts and custom collections need routes.yaml.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page routing for /publications/, /products/ etc. | Custom routes.yaml entries | Ghost static page slugs | Static pages auto-route; routes.yaml is only needed for collections and custom URL remaps |
| Active nav highlighting logic | JavaScript URL comparison | Ghost `{{current}}` boolean | Already works — `current` is server-side; no JS needed |
| Publications as Ghost posts + tag filtering | Tagged posts with custom routing | Hardcoded list in `page-publications.hbs` | Requirements explicitly say manual curation; BLOG-style posts are overkill and ENH-05 defers automation |
| Image optimization/CDN | Manual resizing + hosting | Ghost Admin CDN or external links | Ghost Admin hosts uploaded images on CDN automatically |

**Key insight:** Ghost static pages with named templates are the correct primitive for all four section pages. Zero routing config, zero JavaScript, zero external dependencies beyond the theme files themselves.

## Common Pitfalls

### Pitfall 1: Slug Mismatch Between Template Name and Ghost Admin Page Slug
**What goes wrong:** `page-publications.hbs` exists in the theme but the Ghost Admin page has slug `publication` (missing the 's'). Ghost falls back to `page.hbs` silently.
**Why it happens:** Template name `page-{slug}.hbs` must exactly match the Ghost page's slug field in Admin.
**How to avoid:** After creating the Ghost page in Admin, verify the slug shown in page settings matches the template filename.
**Warning signs:** Page loads but shows generic page layout (no custom publication list markup).

### Pitfall 2: Navigation `current` Not Firing for Section Pages
**What goes wrong:** Visiting `/publications/` but the Publications nav link doesn't get `.is-active`.
**Why it happens:** The Ghost Admin navigation entry for Publications has a URL that doesn't exactly match the page URL. Common causes: missing trailing slash, using relative vs absolute URL, or URL includes the full domain.
**How to avoid:** In Ghost Admin → Navigation, set the URL for each item to the relative path with trailing slash: `/publications/`, `/products/`, `/experiments/`, `/about/`. Do not use `https://general-purpose.ghost.io/publications/`.
**Warning signs:** Nav items never highlight, or only the home page highlights.

### Pitfall 3: Ghost Admin Page Editor Stripping Custom HTML
**What goes wrong:** If Publications list is maintained in the Ghost page body (not hardcoded in the template), using the standard content editor will strip HTML tags.
**Why it happens:** Ghost's Koenig editor sanitizes HTML in text cards. Custom HTML must be placed in an HTML card (the `/html` card type) to be preserved.
**How to avoid:** For any custom HTML in the page body, use the Ghost editor's HTML card (type `/html` in the editor). For publications, hardcoding in the template is simpler and avoids this entirely.
**Warning signs:** After saving the page in Admin, the custom HTML is gone.

### Pitfall 4: External Links Without Security Attributes
**What goes wrong:** Experiment and product links open in the same tab and expose `window.opener` to the external site.
**Why it happens:** Default `<a>` behavior with `target="_blank"` doesn't include `rel` by default.
**How to avoid:** Always write `<a href="..." target="_blank" rel="noopener noreferrer">` for external links.
**Warning signs:** (Security issue, not visible — use a code review check).

### Pitfall 5: Product Images Not in Theme Zip
**What goes wrong:** `{{asset "images/product.png"}}` returns a 404 after deploy.
**Why it happens:** The `npm run zip` script only bundles `assets/`, `*.hbs`, `partials/`, and `package.json`. Images must be in `assets/images/` to be included.
**How to avoid:** Place product/experiment thumbnails in `assets/images/` before zipping and deploying. Alternatively, use absolute URLs for images hosted externally.
**Warning signs:** Broken image icons on products/experiments cards after theme upload.

## Code Examples

Verified patterns from Ghost official docs and existing codebase:

### Named Page Template Wiring (no config needed)
```
Theme file: page-publications.hbs
Ghost Admin: create Page with URL slug = "publications"
Result: /publications/ auto-routes to page-publications.hbs
```
Source: https://docs.ghost.org/themes/structure/

### Publications List Item
```handlebars
{{! Source: Ghost page context + static HTML pattern }}
<li class="publication-item">
    <a class="publication-title" href="https://doi.org/10.xxxx/xxxxx"
       target="_blank" rel="noopener noreferrer">
        Paper Title
    </a>
    <span class="publication-meta">Conference / Journal &middot; 2024</span>
</li>
```

### Product Card
```handlebars
<article class="product-card">
    <a href="https://product-url.com" class="product-card-image-link"
       target="_blank" rel="noopener noreferrer">
        <img class="product-card-image"
             src="{{asset "images/product-name.jpg"}}"
             alt="Product Name" loading="lazy">
    </a>
    <div class="product-card-body">
        <h2 class="product-card-name">
            <a href="https://product-url.com"
               target="_blank" rel="noopener noreferrer">Product Name</a>
        </h2>
        <p class="product-card-desc">Description text.</p>
    </div>
</article>
```

### Navigation Active State (already in partials/navigation.hbs)
```handlebars
{{! Already implemented — no change needed }}
{{#foreach navigation}}
<a class="nav-link {{#if current}}is-active{{/if}}" href="{{url}}">{{label}}</a>
{{/foreach}}
```
Source: https://docs.ghost.org/themes/helpers/data/navigation — `{{current}}` is "Boolean true/false whether the URL matches the current page"

### About Page with Editable Content
```handlebars
{{!< default}}

<div class="about-page">
    {{#if feature_image}}
    <div class="about-photo">
        <img src="{{feature_image}}" alt="{{feature_image_alt}}">
    </div>
    {{/if}}
    <div class="about-content">
        <h1 class="page-title">{{title}}</h1>
        {{content}}
    </div>
</div>
```
Note: `{{content}}` renders body from Ghost Admin page editor. `{{feature_image}}` is the page's uploaded header image. Both are standard page context properties.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Routing custom pages via routes.yaml | `page-{slug}.hbs` auto-resolution | Ghost 4+ | No routes.yaml config needed for static pages |
| `{{@blog}}` for site data | `{{@site}}` global | Ghost 5 | Use `{{@site.title}}` etc. |
| Single `page.hbs` with `{{#is "page"}}` conditionals | Named `page-{slug}.hbs` templates | Ghost 4+ | Cleaner separation; no conditional logic in templates |

**Deprecated/outdated:**
- `{{@blog}}`: Replaced by `{{@site}}` — already correctly avoided in this theme.
- Routing static pages manually: Not needed; Ghost auto-routes pages by slug.

## Open Questions

1. **Photo for About page**
   - What we know: ABOUT-01 requires "bio, photo, and background"
   - What's unclear: Where does Jess's photo live? Ghost page feature image (uploaded to Admin) vs hardcoded `{{asset "images/jess.jpg"}}`
   - Recommendation: Use `{{feature_image}}` in the About template. Jess uploads her photo as the page feature image in Ghost Admin — no files in theme needed. Template wraps it in `{{#if feature_image}}` guard.

2. **Publications list content**
   - What we know: Must be manually curated — not automated (per REQUIREMENTS.md)
   - What's unclear: Should the list be hardcoded in the template, or maintained as HTML in the Ghost page body via an HTML card?
   - Recommendation: Hardcode placeholder entries in `page-publications.hbs`. This gives full design control without requiring knowledge of Ghost's HTML card. Jess can update by editing the theme file or (after launch) by migrating to an HTML card in Admin.

3. **Products and Experiments content**
   - What we know: Cards with image, name, description, link
   - What's unclear: Are there real products/experiments to list now, or should templates ship with placeholder content?
   - Recommendation: Ship templates with clearly-marked placeholder cards (`<!-- Add products here -->`). The plan should note that real content needs to be provided before or after deploy.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | gscan (Ghost theme validator) |
| Config file | none — CLI tool |
| Quick run command | `npm test` (runs `gscan .` via pretest build) |
| Full suite command | `npm test` |

Ghost themes have no unit test framework. Validation is via gscan for structural correctness and manual browser verification.

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SECT-01 | Publications page shows paper list with title, venue, year, link | gscan + manual | `npm test` validates template syntax; browser verifies content | Wave 0: create `page-publications.hbs` |
| SECT-02 | Products page shows image/name/description/link cards | gscan + manual | `npm test` validates template syntax; browser verifies cards | Wave 0: create `page-products.hbs` |
| SECT-03 | Experiments page shows cards linking to external projects | gscan + manual | `npm test` validates template syntax; browser verifies cards | Wave 0: create `page-experiments.hbs` |
| ABOUT-01 | About page has bio, photo, background | gscan + manual | `npm test` validates template syntax; browser verifies layout | Wave 0: create `page-about.hbs` |
| INFRA-03 | Active nav state highlights current section | manual | Load each section URL and verify `.is-active` on correct nav link | ✅ `partials/navigation.hbs` already has logic |

### Sampling Rate
- **Per task commit:** `npm test` (gscan validates all templates)
- **Per wave merge:** `npm test` + manual browser load of `/publications/`, `/products/`, `/experiments/`, `/about/`
- **Phase gate:** `npm test` green + all 5 requirements verified in browser + nav active state confirmed on each section

### Wave 0 Gaps
- [ ] `page-publications.hbs` — does not exist
- [ ] `page-products.hbs` — does not exist
- [ ] `page-experiments.hbs` — does not exist
- [ ] `page-about.hbs` — does not exist
- [ ] `assets/images/` directory — needed if product/experiment images are served from theme (may use external URLs instead)

*(INFRA-03 has no gap — `partials/navigation.hbs` already implements `{{#if current}}is-active{{/if}}` and `.nav-link.is-active` CSS exists in `screen.css`)*

## Sources

### Primary (HIGH confidence)
- https://docs.ghost.org/themes/structure/ — `page-{slug}.hbs` naming convention, template resolution hierarchy
- https://docs.ghost.org/themes/helpers/data/navigation — `{{current}}` boolean, `{{#foreach navigation}}` attributes
- https://docs.ghost.org/themes/contexts/page/ — page context properties (title, content, feature_image, url)
- Existing codebase: `partials/navigation.hbs`, `screen.css`, `page.hbs`, `post.hbs`, `default.hbs` — inspected directly

### Secondary (MEDIUM confidence)
- Phase 3 RESEARCH.md — confirmed routes.yaml is separate from theme zip; Ghost Admin navigation URL format
- Phase 1-2 decisions in STATE.md — confirmed design tokens, CSS variable names, spacing scale

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `page-{slug}.hbs` verified against official Ghost docs; `{{current}}` confirmed in navigation docs
- Architecture: HIGH — All four templates follow identical pattern; no routing config needed
- Pitfalls: HIGH — Slug mismatch and HTML card stripping are well-documented Ghost gotchas; nav URL format confirmed from docs

**Research date:** 2026-03-24
**Valid until:** 2026-09-24 (Ghost Handlebars APIs are stable; `page-{slug}.hbs` naming is a long-standing convention)
