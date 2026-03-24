# Architecture Research

**Domain:** Ghost Handlebars theme (personal website)
**Researched:** 2026-03-23
**Confidence:** HIGH — based on official Ghost documentation

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Ghost.io Platform                           │
│  (Renders templates server-side, provides content via helpers)   │
├─────────────────────────────────────────────────────────────────┤
│                     Routing Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  routes.yaml │  │  collections │  │  taxonomies (tag/    │  │
│  │  (static pg) │  │  (blog,pubs, │  │   author archives)   │  │
│  │              │  │   products)  │  │                      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
├─────────┴──────────────────┴──────────────────────┴─────────────┤
│                    Template Layer                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │default   │  │index/    │  │post/     │  │custom-*.hbs    │  │
│  │.hbs      │  │home.hbs  │  │page.hbs  │  │(publications,  │  │
│  │(layout)  │  │(listings)│  │(single)  │  │ products, etc) │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬───────┘  │
│       │             │             │                   │          │
│       └─────────────┴─────────────┴───────────────────┘          │
│                           ↓                                      │
│                     Partials Layer                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │navigation│  │post-card │  │sidebar   │  │footer    │        │
│  │.hbs      │  │.hbs      │  │.hbs      │  │.hbs      │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                      Assets Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  CSS         │  │  JavaScript  │  │  Fonts/Images│          │
│  │  (styles)    │  │  (optional)  │  │  (static)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `default.hbs` | Base HTML shell: `<head>`, `{{ghost_head}}`, `{{ghost_foot}}`, `{{{body}}}` insertion point | One file; all pages extend this |
| `index.hbs` | Default post listing (blog roll) | Loops posts with `{{#foreach posts}}` |
| `home.hbs` | Homepage override (renders `/` only) | Bold hero + featured content |
| `post.hbs` | Single post rendering | Full article with `{{#post}}` helper |
| `page.hbs` | Static page rendering (About, etc.) | Falls back to `post.hbs` if absent |
| `custom-*.hbs` | Admin-selectable templates | Used for publications, products, experiments |
| `tag.hbs` | Tag archive listing | Falls back to `index.hbs` if absent |
| `error.hbs` | Error page | Handles 404 and others |
| `partials/` | Reusable fragments (nav, cards, footer) | Included with `{{> "partial-name"}}` |
| `assets/` | CSS, fonts, JS — served as static files | Referenced via `{{asset "css/screen.css"}}` |
| `package.json` | Theme metadata, images sizes, custom settings | Controls posts-per-page, color/font options |
| `routes.yaml` | URL structure, collections, custom routes | Lives in Ghost Admin, not in theme zip |

## Recommended Project Structure

```
general-purpose/                  # theme root (zipped for upload)
├── assets/
│   ├── css/
│   │   └── screen.css           # Main stylesheet
│   ├── fonts/                   # Self-hosted fonts (if any)
│   └── js/
│       └── main.js              # Minimal JS (optional)
├── partials/
│   ├── navigation.hbs           # Sidebar navigation
│   ├── post-card.hbs            # Reusable post card component
│   ├── publication-card.hbs     # Card for publications list
│   ├── product-card.hbs         # Card for products list
│   ├── experiment-card.hbs      # Card for experiments list
│   └── footer.hbs               # Footer
├── default.hbs                  # Base layout (head, sidebar, body, foot)
├── index.hbs                    # Blog listing (extends default)
├── home.hbs                     # Homepage with hero (extends default)
├── post.hbs                     # Single post (extends default)
├── page.hbs                     # Static page — About (extends default)
├── custom-publications.hbs      # Publications listing page
├── custom-products.hbs          # Products listing page
├── custom-experiments.hbs       # Experiments listing page
├── tag.hbs                      # Tag archive (extends default)
├── error.hbs                    # Error page
└── package.json                 # Theme config, image sizes, custom settings
```

### Structure Rationale

- **`default.hbs` as layout:** Sidebar navigation lives here so it renders on every page without duplication. The `{{{body}}}` helper inserts page-specific content.
- **`home.hbs` separate from `index.hbs`:** Homepage needs a bold hero section distinct from the blog listing — Ghost checks for `home.hbs` first for the `/` route.
- **`custom-*.hbs` for sections:** Publications, Products, Experiments are Ghost static pages with a custom template selected in Admin. This avoids needing external routing complexity for v1 content types.
- **`partials/` per content type:** Each section (publications, products, experiments) gets its own card partial. Keeps card HTML isolated and reusable when listing multiple items.
- **No build system required:** For a simple personal site with a single CSS file, a build step (Rollup, webpack) adds complexity without benefit. Write CSS directly; add a build step only if the CSS grows large enough to warrant it.

## Architectural Patterns

### Pattern 1: Layout Inheritance via `{{!< default}}`

**What:** Every template except `default.hbs` opens with `{{!< default}}` to declare it extends the base layout. Ghost injects that template's rendered HTML into the `{{{body}}}` slot in `default.hbs`.

**When to use:** Always — this is the standard Ghost pattern for all page templates.

**Trade-offs:** Simple and zero-config. The downside is that layouts are a single level deep (no nested layouts), but this is sufficient for a personal site.

**Example:**
```handlebars
{{!< default}}

{{#is "home"}}
<section class="hero">
  <h1>{{@site.title}}</h1>
  <p>{{@site.description}}</p>
</section>
{{/is}}

{{#foreach posts}}
  {{> "post-card"}}
{{/foreach}}
```

### Pattern 2: Partials for Repeated Components

**What:** Extract any markup rendered in more than one template into a file under `partials/`. Reference it with `{{> "partial-name"}}`.

**When to use:** Post cards (appear on index, home, tag pages), navigation, footer, any repeating card pattern.

**Trade-offs:** Keeps templates DRY and makes design changes affect all instances at once. Partials cannot accept arguments in standard Ghost Handlebars (unlike React props), so if you need a card with different behavior in different contexts, use `{{#if}}` blocks inside the partial or create two separate partials.

**Example:**
```handlebars
{{! partials/post-card.hbs }}
<article class="post-card">
  {{#if feature_image}}
    <img src="{{feature_image}}" alt="{{title}}">
  {{/if}}
  <h2><a href="{{url}}">{{title}}</a></h2>
  <p class="meta">{{date published_at format="MMMM DD, YYYY"}}</p>
  <p>{{excerpt}}</p>
</article>
```

### Pattern 3: Custom Templates for Section Pages

**What:** Name templates `custom-[slug].hbs`. Ghost Admin surfaces these as template options when editing a static page. Select the matching template in Admin to apply it to a specific page.

**When to use:** Publications, Products, Experiments — static Ghost pages that need a distinct layout not shared by blog posts.

**Trade-offs:** Requires manually wiring each page in Ghost Admin (one-time setup). Clean separation between section types. The "custom-" prefix is required — Ghost only surfaces templates with that prefix in the template dropdown.

**Example:**
```handlebars
{{!< default}}
{{#page}}
<section class="section-products">
  <h1>{{title}}</h1>
  {{content}}
  {{! Products list is maintained as page content in Ghost Admin }}
</section>
{{/page}}
```

## Data Flow

### Request Flow

```
Browser request: /blog/my-post-slug/
        ↓
Ghost resolves route via routes.yaml collections
        ↓
Context = "post" → selects post.hbs template
        ↓
Ghost fetches post data by slug from database
        ↓
post.hbs extends default.hbs → default.hbs renders
        ↓
{{{body}}} slot filled with post.hbs output
        ↓
{{ghost_head}} injects SEO meta, structured data, CSS links
        ↓
Rendered HTML returned to browser
```

### Context-to-Template Mapping

```
URL /                       → home.hbs (falls back to index.hbs)
URL /blog/ or /             → index.hbs
URL /blog/[slug]/           → post.hbs
URL /about/ (static page)   → page.hbs (or custom-*.hbs if set in Admin)
URL /tag/[tag-slug]/        → tag.hbs (falls back to index.hbs)
URL /author/[author-slug]/  → author.hbs (falls back to index.hbs)
Non-existent URL            → error.hbs (or error-404.hbs)
```

### Key Data Flows

1. **Post data into templates:** Ghost injects post/page objects accessible via `{{#post}}` or `{{#page}}` context helpers. Fields: `title`, `content`, `excerpt`, `feature_image`, `published_at`, `url`, `primary_tag`, `primary_author`.

2. **Site globals into all templates:** The `{{@site}}` object is available everywhere — `{{@site.title}}`, `{{@site.description}}`, `{{@site.url}}`, `{{@site.navigation}}` — no explicit fetching required.

3. **Post list into index templates:** `{{#foreach posts}}` iterates over posts that Ghost pre-fetches based on the current context/collection. Pagination is automatic via `{{pagination}}` helper.

4. **Navigation data:** Ghost Admin's Navigation settings feed `{{@site.navigation}}` and `{{@site.secondary_navigation}}`. For a sidebar nav, render this in `default.hbs` so it's always present.

5. **Assets into pages:** CSS and JS files reference via `{{asset "css/screen.css"}}` which resolves to the Ghost CDN-served URL automatically on Ghost.io hosting.

## Scaling Considerations

This is a personal site — traditional scaling concerns don't apply. The relevant concern is content volume.

| Scale | Architecture Adjustments |
|-------|--------------------------|
| < 50 posts | Current structure is ideal — no changes needed |
| 50–500 posts | Add pagination config in `package.json` (`posts_per_page`); ensure tag/collection filtering works correctly |
| 500+ posts | Consider collections to organize content types; add search (Ghost supports basic search natively or via integration) |

### Scaling Priorities

1. **First bottleneck:** Navigation sidebar becomes unwieldy if sections multiply — keep to 5–7 nav items max as designed.
2. **Second bottleneck:** Publications list in page content is manual — at 50+ publications, consider a structured approach (tag-based collection or external data source).

## Anti-Patterns

### Anti-Pattern 1: Putting Sidebar Navigation in Each Template

**What people do:** Copy the `<nav>` HTML into every `.hbs` template file.

**Why it's wrong:** Changing one nav item requires editing every template file. Easy to miss one, creating inconsistencies.

**Do this instead:** Put navigation in `default.hbs` or a `partials/navigation.hbs` included in `default.hbs`. It renders on every page automatically.

### Anti-Pattern 2: Using Post Content for Structured Data (Products, Publications)

**What people do:** Write product descriptions as freeform post content and try to extract structured data (name, image, link) from it.

**Why it's wrong:** Ghost's Handlebars layer has no data transformation or parsing — you can't extract structured fields from unstructured content. Maintenance is painful and display is fragile.

**Do this instead:** Use Ghost's built-in structure for what it provides. For Products and Experiments: keep the list as formatted HTML content in a Ghost static page, edited directly in the Admin editor. For Publications: same approach — a curated static page with manual HTML. If you need true structured data later, migrate to Ghost's custom fields (available in newer Ghost versions) or route through the Content API.

### Anti-Pattern 3: Overriding Ghost CSS with High-Specificity Selectors

**What people do:** Try to override Ghost's injected styles (from `{{ghost_head}}`) with tightly-scoped selectors.

**Why it's wrong:** For a custom theme built from scratch this is less relevant, but if you ever use Ghost's built-in card styles (gallery, bookmark, etc.), they have their own scoped CSS injected via `{{ghost_head}}`. Low-specificity overrides will lose.

**Do this instead:** Use `!important` for deliberate overrides of Ghost's card/content styles. Write your own base styles with sufficient specificity. Avoid relying on cascade order against Ghost's injected styles.

### Anti-Pattern 4: Skipping `{{ghost_head}}` and `{{ghost_foot}}`

**What people do:** Hand-code `<link>` tags and omit the Ghost helper calls in `default.hbs`.

**Why it's wrong:** `{{ghost_head}}` injects critical functionality: SEO meta tags, Open Graph, structured data, code injection from Admin, and Ghost's membership JS. `{{ghost_foot}}` does the same for footer scripts. Removing them breaks Ghost Admin's "Code Injection" feature and SEO.

**Do this instead:** Always include `{{ghost_head}}` in `<head>` and `{{ghost_foot}}` before `</body>`. These are required.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Ghost Admin | Theme upload as `.zip` file via Admin → Settings → Design | Theme must pass GScan validation |
| Ghost Content API | Available for headless use, not needed for Handlebars themes | Handlebars templates access data via helpers, not API calls |
| Custom fonts (Google Fonts / self-hosted) | `<link>` in `default.hbs` `<head>`, or `@import` in CSS | Self-hosting avoids GDPR concerns and is faster |
| External experiment links | Standard `<a href>` links in `custom-experiments.hbs` | No integration needed — experiments are external URLs |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `default.hbs` ↔ child templates | `{{!< default}}` declaration + `{{{body}}}` slot | Unidirectional — children inject into parent's slot |
| Templates ↔ partials | `{{> "partial-name"}}` inline inclusion | Partials inherit the calling template's data context |
| Theme ↔ Ghost Admin settings | `{{@site.*}}` helpers, `{{@custom.*}}` for custom settings | Custom settings defined in `package.json` appear in Admin UI |
| routes.yaml ↔ templates | Collection/route `template:` field points to a `.hbs` filename | routes.yaml is uploaded separately in Ghost Admin Labs |

## Suggested Build Order

Dependencies flow top-down. Build in this order to avoid rework:

1. **`package.json`** — Declare theme name, version, image sizes, posts-per-page. No other files depend on it but it must exist to upload.
2. **`assets/css/screen.css`** — Establish design tokens (colors, type scale, spacing) first. All visual work depends on this.
3. **`default.hbs`** — Base layout with sidebar nav, `{{ghost_head}}`, `{{ghost_foot}}`. Every other template depends on this being correct.
4. **`partials/navigation.hbs`** — Sidebar nav rendered in `default.hbs`. Needed before any page can be visually tested.
5. **`index.hbs` + `partials/post-card.hbs`** — Blog listing is the primary content surface. Verify layout and typography here.
6. **`home.hbs`** — Hero homepage. Depends on `default.hbs` being stable.
7. **`post.hbs`** — Single post rendering. Depends on type styles from CSS being settled.
8. **`page.hbs`** — Static page (About). Simple; reuses most of `post.hbs` patterns.
9. **`custom-publications.hbs`** — Publications section page.
10. **`custom-products.hbs`** — Products section page.
11. **`custom-experiments.hbs`** — Experiments section page.
12. **`error.hbs`** — Polish step, low priority.
13. **Ghost Admin wiring** — Upload theme, set Navigation, configure custom pages with their templates.

## Sources

- [Ghost Theme Structure — Official Docs](https://docs.ghost.org/themes/structure/)
- [Ghost Themes Overview — Official Docs](https://docs.ghost.org/themes/)
- [Ghost Contexts — Official Docs](https://docs.ghost.org/themes/contexts/)
- [Ghost Routing — Official Docs](https://docs.ghost.org/themes/routing)
- [Ghost Essential Concepts Tutorial](https://ghost.org/tutorials/essential-concepts/)
- [Ghost default.hbs Tutorial](https://ghost.org/tutorials/default/)
- [Ghost Content Collections Tutorial](https://ghost.org/tutorials/content-collections/)
- [TryGhost/Starter — Official Starter Theme](https://github.com/TryGhost/Starter)

---
*Architecture research for: Ghost Handlebars theme (personal website)*
*Researched: 2026-03-23*
