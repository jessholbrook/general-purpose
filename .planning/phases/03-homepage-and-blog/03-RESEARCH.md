# Phase 3: Homepage and Blog - Research

**Researched:** 2026-03-24
**Domain:** Ghost Handlebars templates — home.hbs, blog listing, post cards, reading time, routes.yaml
**Confidence:** HIGH

## Summary

Phase 3 adds the two primary content surfaces: a custom homepage (`home.hbs`) and a working blog (listing at `/blog/` + individual post pages). Both surfaces already have structural scaffolding — `index.hbs` and `post.hbs` exist as stubs — so this phase is primarily about (1) wiring Ghost's `routes.yaml` so `home.hbs` owns `/` and the blog collection lives at `/blog/`, (2) authoring `home.hbs` with a bold serif hero, (3) upgrading `index.hbs` to a scannable post card listing, and (4) upgrading `post.hbs` with date and reading time.

The most fragile piece is `routes.yaml`. Ghost routes are uploaded via Admin (Settings → Labs → Routes), and the YAML syntax is exact: routes map to template names without `.hbs` extension, collections require trailing slashes on both the collection key and permalink pattern, and the `permalink` field controls individual post URLs. A mis-configured routes.yaml silently falls back to defaults rather than erroring visibly — verify by loading `/blog/` in the browser after upload.

The `{{reading_time}}` helper works in post context with zero configuration. Post cards need `{{feature_image}}`, `{{excerpt}}`, `{{date}}`, and `{{url}}` — all available in the posts foreach loop on index.hbs.

**Primary recommendation:** Write `routes.yaml` first and upload to Ghost Admin before building templates. This confirms routing works before investing time in template markup.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | Bold serif hero intro statement ("Jess writes about people, AI, and people + AI") | `home.hbs` template + CSS `.hero-*` classes; Lora font already loaded in `default.hbs` |
| HOME-02 | Section links/previews below hero | Static HTML links in `home.hbs` using `<a href="/blog/">`, `<a href="/publications/">` etc.; no Ghost data needed for static links |
| BLOG-01 | Reverse-chronological post listing on blog page | `index.hbs` with `{{#foreach posts}}` — Ghost returns posts newest-first by default; routes.yaml places this at `/blog/` |
| BLOG-02 | Individual post template with date and reading time | `post.hbs` already scaffolded; add `{{reading_time}}` helper and ensure date is formatted as "MMMM D, YYYY" |
| BLOG-03 | Post card partial (thumbnail, title, excerpt, date) | New `partials/post-card.hbs` using `{{feature_image}}`, `{{title}}`, `{{excerpt}}`, `{{date}}`, `{{url}}` |
</phase_requirements>

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| Ghost Handlebars | Ghost 6.x | Template rendering | Built into Ghost — no alternative |
| Ghost routes.yaml | Ghost 6.x | Custom URL routing | Required to serve `home.hbs` at `/` |
| CSS custom properties | Native | Styling (already established) | Phase 2 built the entire design system |

### Supporting
| Library/Tool | Version | Purpose | When to Use |
|---|---|---|---|
| `{{reading_time}}` helper | Ghost 6.x built-in | Per-post reading estimate | Always use on post.hbs |
| `{{pagination}}` helper | Ghost 6.x built-in | Page navigation on blog listing | Use in index.hbs when posts exceed `posts_per_page` |
| `{{#foreach posts limit="N"}}` | Ghost 6.x built-in | Limiting preview posts on homepage | HOME-02 if showing latest posts in section previews |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom `home.hbs` + routes.yaml | Static page in Ghost Admin | Admin page can't use Handlebars context; no design control — routes.yaml is required |
| Partial `post-card.hbs` | Inline markup in index.hbs | Partial reusable on homepage section preview if needed later |

**Installation:** No new packages. Everything is Ghost built-ins + existing CSS.

## Architecture Patterns

### Template File Set for Phase 3
```
home.hbs                  # NEW — homepage, served at /
index.hbs                 # UPDATE — blog listing at /blog/
post.hbs                  # UPDATE — individual post
partials/
└── post-card.hbs         # NEW — reusable post card partial
routes.yaml               # NEW — uploaded to Ghost Admin, not in theme zip
```

Note: `routes.yaml` is **not** bundled in the theme zip file. It is uploaded separately via Ghost Admin → Settings → Labs → Routes.

### Pattern 1: routes.yaml for Custom Homepage + Blog Collection
**What:** YAML file uploaded to Ghost Admin that remaps `/` to a static template and moves the posts collection to `/blog/`.
**When to use:** Any time you need the homepage to not be a post listing.
**Example:**
```yaml
routes:
  /: home

collections:
  /blog/:
    permalink: /blog/{slug}/
    template: index
```
Source: https://docs.ghost.org/themes/routing/

Key rules:
- The value `home` (no `.hbs`) maps to `home.hbs`
- Collection key `/blog/` must have a trailing slash
- `permalink: /blog/{slug}/` controls individual post URLs — this changes post URLs from `/my-post/` to `/blog/my-post/`
- `template: index` points to `index.hbs` for the listing page

### Pattern 2: home.hbs — Bold Serif Hero
**What:** `home.hbs` extends `default.hbs` and contains static hero markup + section preview links.
**When to use:** Homepage only — served at `/` because of routes.yaml.
**Example:**
```handlebars
{{!< default}}

<div class="home-hero">
    <h1 class="hero-title">Jess writes about people, AI, and people + AI.</h1>
</div>

<div class="home-sections">
    <div class="section-preview">
        <h2 class="section-title"><a href="/blog/">Blog</a></h2>
        <p class="section-desc">Writing on the intersection of people and AI.</p>
    </div>
    <div class="section-preview">
        <h2 class="section-title"><a href="/publications/">Publications</a></h2>
        <p class="section-desc">Academic papers and research.</p>
    </div>
    {{! Add more sections: Products, Experiments, About }}
</div>
```

### Pattern 3: Post Card Partial
**What:** `partials/post-card.hbs` renders a single post card with thumbnail, title, excerpt, date.
**When to use:** Called from `index.hbs` inside `{{#foreach posts}}`.
**Example:**
```handlebars
{{! partials/post-card.hbs — called inside foreach posts context }}
<article class="post-card">
    {{#if feature_image}}
    <a class="post-card-image-link" href="{{url}}">
        <img class="post-card-image" src="{{feature_image}}" alt="{{title}}" loading="lazy">
    </a>
    {{/if}}
    <div class="post-card-content">
        <h2 class="post-card-title">
            <a href="{{url}}">{{title}}</a>
        </h2>
        {{#if excerpt}}
        <p class="post-card-excerpt">{{excerpt}}</p>
        {{/if}}
        <footer class="post-card-meta">
            <time class="post-card-date" datetime="{{date format='YYYY-MM-DD'}}">
                {{date format="MMMM D, YYYY"}}
            </time>
        </footer>
    </div>
</article>
```
Source: Ghost post context docs https://docs.ghost.org/themes/contexts/post/

### Pattern 4: index.hbs — Blog Listing
**What:** `index.hbs` with `{{#foreach posts}}` iterating posts newest-first (Ghost default sort).
**Example:**
```handlebars
{{!< default}}

<div class="blog-listing">
    <div class="post-feed">
        {{#foreach posts}}
            {{> post-card}}
        {{/foreach}}
    </div>

    {{pagination}}
</div>
```

### Pattern 5: post.hbs with Reading Time
**What:** Updated `post.hbs` adds `{{reading_time}}` and formatted date.
**Example:**
```handlebars
{{!< default}}

<article class="post {{post_class}}">
    <header class="post-header">
        <h1 class="post-title">{{title}}</h1>
        <div class="post-meta">
            <time class="post-date" datetime="{{date format='YYYY-MM-DD'}}">
                {{date format="MMMM D, YYYY"}}
            </time>
            <span class="post-reading-time">{{reading_time}}</span>
        </div>
    </header>
    <section class="post-content">
        {{content}}
    </section>
</article>
```

### Anti-Patterns to Avoid
- **Putting routes.yaml in the theme zip:** It is uploaded separately. Including it in the zip causes a gscan warning and the file is ignored during theme upload.
- **Using `{{navigation}}` in home.hbs for section previews:** Navigation data is already rendered in `default.hbs`'s sidebar. Section previews in the hero content are static HTML links, not a second nav.
- **Omitting `{{pagination}}` from index.hbs:** With `posts_per_page: 15` in package.json, pagination will appear when there are 16+ posts. Missing it breaks navigation.
- **Forgetting `loading="lazy"` on post card images:** Feature images in a long blog feed will hit the network all at once without it.
- **Using `{{excerpt}}` without the `{{#if}}` guard:** Posts without explicit excerpts return an auto-generated one — but feature image is genuinely optional and should be guarded.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reading time calculation | Custom word counter | `{{reading_time}}` | Ghost calculates words + image viewing time correctly |
| Post pagination | Manual page links | `{{pagination}}` | Ghost knows total pages, current page, prev/next URLs |
| Date formatting | JavaScript date logic | `{{date format="..."}}` | Moment.js-style format strings, server-rendered, no JS needed |
| Post URL generation | Hardcoded or slug-built URLs | `{{url}}` | Automatically respects permalink structure from routes.yaml |

**Key insight:** Ghost's built-in helpers handle every display concern for post cards and post pages — the only work is markup and CSS.

## Common Pitfalls

### Pitfall 1: routes.yaml Trailing Slash
**What goes wrong:** `/blog` without a trailing slash (vs `/blog/`) causes routing to fail silently — the root `/` may work but `/blog/` returns 404 or falls through to defaults.
**Why it happens:** Ghost routing strictly requires trailing slashes on collection keys.
**How to avoid:** Always write `/blog/:` (with colon) not `/blog:` in routes.yaml.
**Warning signs:** `/blog/` returns 404 or shows the Ghost "Sorry, page not found" after uploading routes.yaml.

### Pitfall 2: routes.yaml Changes Post URLs
**What goes wrong:** After adding `permalink: /blog/{slug}/`, all post URLs become `/blog/my-post/` instead of `/my-post/`. Any existing bookmarks or links break.
**Why it happens:** The permalink field in routes.yaml controls the canonical URL for every post in that collection.
**How to avoid:** On a new site this is fine — document the URL structure. On an existing site with inbound links, consider carefully. For this site (new), `/blog/{slug}/` is correct.
**Warning signs:** Post links from the homepage section preview go to 404 if routes.yaml wasn't uploaded.

### Pitfall 3: home.hbs Silently Falling Back to index.hbs
**What goes wrong:** `home.hbs` is created but the homepage still shows the post listing from `index.hbs`.
**Why it happens:** Without routes.yaml uploaded, Ghost ignores `home.hbs` and uses `index.hbs` for `/`.
**How to avoid:** Upload routes.yaml to Ghost Admin before testing `home.hbs`.
**Warning signs:** Homepage loads but shows the post listing, not the hero.

### Pitfall 4: feature_image Empty on Post Cards
**What goes wrong:** Post cards show blank image slots because posts don't have feature images set.
**Why it happens:** `feature_image` is null for posts without an uploaded header image.
**How to avoid:** Always wrap feature image markup in `{{#if feature_image}}...{{/if}}`.
**Warning signs:** Empty `<img>` tags or broken image icons in the post feed.

### Pitfall 5: `{{reading_time}}` Outside Post Context
**What goes wrong:** `{{reading_time}}` in index.hbs outside a `{{#foreach posts}}` block outputs nothing or errors.
**Why it happens:** The helper requires a post context to access word count.
**How to avoid:** Only use `{{reading_time}}` inside `{{#foreach posts}}` or on post.hbs where post context is implicit. In the post card partial, it works because the partial is called inside the foreach.
**Warning signs:** Reading time shows blank or "NaN min read".

## Code Examples

### routes.yaml (complete file to upload)
```yaml
# Source: https://docs.ghost.org/themes/routing/
routes:
  /: home

collections:
  /blog/:
    permalink: /blog/{slug}/
    template: index
```

### Date formatting in Ghost
```handlebars
{{! Source: https://docs.ghost.org/themes/contexts/post/ }}
<time class="post-date" datetime="{{date format='YYYY-MM-DD'}}">
    {{date format="MMMM D, YYYY"}}
</time>
```

### Reading time helper
```handlebars
{{! Source: https://docs.ghost.org/themes/helpers/utility/reading_time }}
{{reading_time}}
{{! Outputs: "5 min read" }}

{{! Custom labels: }}
{{reading_time minute="1 min read" minutes="% min read"}}
```

### Partial call inside foreach
```handlebars
{{#foreach posts}}
    {{> post-card}}
{{/foreach}}
```

### Feature image with lazy loading
```handlebars
{{#if feature_image}}
<img src="{{feature_image}}" alt="{{feature_image_alt}}" loading="lazy">
{{/if}}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Ghost 4/5 `{{@blog}}` global | `{{@site}}` global | Ghost 5 | Use `{{@site.title}}` not `{{@blog.title}}` |
| Custom `{{excerpt words="30"}}` | `{{excerpt}}` auto | Ghost 5+ | Default excerpt from post or auto-generated |
| Manual reading time JS | `{{reading_time}}` built-in | Ghost 4+ | No custom JS needed |

**Deprecated/outdated:**
- `{{@blog}}`: Replaced by `{{@site}}` — don't use in Ghost 6 themes.
- `{{excerpt words="N"}}` with manual truncation: `{{excerpt}}` returns the custom excerpt field or auto-generates one; use it directly.

## Open Questions

1. **Exact section previews for HOME-02**
   - What we know: Requirements say "section preview links below hero" — static links to Blog, Publications, Products, Experiments
   - What's unclear: Should section previews show actual content (e.g., 3 latest blog posts) or just title+description links?
   - Recommendation: Plan as static title+description+link cards. If dynamic post previews are wanted, use `{{#foreach posts limit="3"}}` — but this pulls all posts, not section-specific. Keep it static for v1, note it as an option.

2. **Post URL implications for navigation**
   - What we know: routes.yaml moves post URLs to `/blog/{slug}/`
   - What's unclear: The existing navigation.hbs renders links from Ghost Admin navigation settings. If Admin has "Blog" pointing to `/`, it needs to be updated to `/blog/` after routes.yaml upload.
   - Recommendation: Document in the plan that Ghost Admin navigation must be updated when routes.yaml is deployed.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | gscan (Ghost theme validator) |
| Config file | none — runs as `npm test` via package.json scripts |
| Quick run command | `npm test` (runs `gscan .` from project root) |
| Full suite command | `npm test` |

Ghost themes have no unit test framework. Validation is via gscan (structural correctness) and manual browser verification against a running Ghost instance.

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | `home.hbs` exists and has hero markup | gscan + manual | `npm test` checks template validity | Wave 0: create `home.hbs` |
| HOME-02 | Section links render below hero | manual | Load `/` in browser after routes.yaml upload | N/A — browser-only |
| BLOG-01 | `/blog/` shows posts newest-first | manual | Load `/blog/` in browser | N/A — browser-only |
| BLOG-02 | Post page shows date + reading time | manual | Load any post URL in browser | N/A — browser-only |
| BLOG-03 | Post card shows thumbnail, title, excerpt, date | manual | Load `/blog/` in browser | Wave 0: create `partials/post-card.hbs` |

### Sampling Rate
- **Per task commit:** `npm test` (gscan validates all templates for Ghost API compliance)
- **Per wave merge:** `npm test` + manual load of `/`, `/blog/`, and one post URL in Ghost Admin preview
- **Phase gate:** `npm test` green + all 5 requirements verified in browser before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `home.hbs` — does not exist yet, must be created before gscan can validate it
- [ ] `partials/post-card.hbs` — does not exist yet

*(Existing `index.hbs` and `post.hbs` are stubs that need updating, not created from scratch)*

## Sources

### Primary (HIGH confidence)
- https://docs.ghost.org/themes/routing/ — routes.yaml syntax, home.hbs mapping, blog collection config
- https://docs.ghost.org/themes/helpers/utility/reading_time — `{{reading_time}}` helper syntax and options
- https://docs.ghost.org/themes/structure/ — template hierarchy, home.hbs, index.hbs, post.hbs roles
- https://docs.ghost.org/themes/contexts/post/ — post object properties (feature_image, excerpt, date, url, title)
- https://docs.ghost.org/themes/helpers/functional/foreach/ — `{{#foreach}}` with limit, contextual variables

### Secondary (MEDIUM confidence)
- Existing theme files `default.hbs`, `screen.css`, `post.hbs`, `index.hbs` — inspected directly; confirms design tokens and existing stub structure

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Ghost 6 built-ins, verified against official docs
- Architecture: HIGH — routes.yaml syntax verified, template hierarchy confirmed
- Pitfalls: HIGH — routes.yaml trailing slash and routes upload flow verified in docs; feature_image guard is standard Ghost pattern

**Research date:** 2026-03-24
**Valid until:** 2026-09-24 (Ghost Handlebars APIs are stable; routes.yaml syntax unlikely to change in minor versions)
