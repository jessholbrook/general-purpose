# Feature Research

**Domain:** Ghost-based personal website (writer/researcher personal site)
**Researched:** 2026-03-23
**Confidence:** HIGH — Ghost is well-documented, patterns are established

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these = site feels broken or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Blog post listing (reverse-chrono) | Standard expectation for any blog/personal site | LOW | Ghost `index.hbs` + `{{posts}}` helper — built-in |
| Individual post pages | Every link in a post list must go somewhere | LOW | Ghost `post.hbs` — required template |
| Responsive layout (mobile-friendly) | Most readers visit from phones | MEDIUM | CSS layout work; Ghost doesn't enforce this but users expect it |
| About page | Visitors want to know who Jess is | LOW | Static Ghost page with `page-about.hbs` template |
| Site navigation | Users need to move between sections | LOW | Ghost `{{navigation}}` helper with primary nav; customizable partial |
| Feature images on posts | Visual scan of post list requires thumbnails | LOW | Ghost `{{feature_image}}` helper — built-in |
| Post metadata (date, reading time) | Standard reading signals | LOW | Ghost `{{date}}` and `{{reading_time}}` helpers — built-in |
| RSS feed | Feed readers, aggregators, and SEO | LOW | Ghost generates automatically — zero theme work |
| SEO meta tags + Open Graph | Sharing links look good on social media | LOW | Ghost injects automatically for every page — zero theme work |
| XML sitemap | Search engine discoverability | LOW | Ghost generates automatically — zero theme work |
| Canonical URLs | Prevent duplicate content issues | LOW | Ghost sets automatically; can be overridden per-post |
| Readable typography at comfortable line length | Long-form reading requires good type | MEDIUM | CSS: serif font, ~65-70ch max-width, generous line-height |

### Differentiators (Competitive Advantage)

Features that make this site stand out. Not universally expected, but what makes a personal site memorable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Sidebar navigation layout | Persistent structure + hero content visible simultaneously; matches reference sites (Mustafa Suleyman, Braun theme) | MEDIUM | CSS grid/flex sidebar; Ghost `{{navigation}}` with custom partial; needs careful responsive treatment |
| Bold serif hero with intro statement | "Jess writes about people, AI, and people + AI" — sets tone immediately, personality-forward | LOW | Custom `home.hbs` template with Ghost routes.yaml; static HTML + CSS |
| Publications section (curated academic works) | Rare on personal sites; signals credibility and research background | MEDIUM | Custom `page-publications.hbs` template; content maintained as a static Ghost page with manual HTML or custom data structure |
| Products section with cards | Shows tangible work output; image + name + description + external link pattern | LOW | Custom `page-products.hbs` or `custom-cards.hbs` template; products maintained as tagged Ghost posts or static page content |
| Experiments section linking out | Shows active creative/technical curiosity; unusual for personal sites | LOW | Same card pattern as Products; can share a template |
| Warm, serif-forward visual identity | Cream/off-white + terracotta + generous whitespace = human and thoughtful, not techy | MEDIUM | CSS custom properties for palette; Google Fonts or self-hosted serif (e.g., Lora, Playfair Display, or EB Garamond); theme `package.json` custom settings for color |
| Custom homepage (non-default) | Default Ghost index is a post list; custom home lets you lead with identity, then content | MEDIUM | `home.hbs` template + `routes.yaml` routing; Ghost supports this natively |
| Consistent card component across sections | Products, Experiments share visual language; feels designed, not assembled | LOW | Single Handlebars partial `{{> card}}` reused across templates |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create scope creep, maintenance burden, or conflict with the site's purpose.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Newsletter/subscription signup | Ghost has built-in membership — easy to add | Adds complexity, requires email infrastructure, creates ongoing maintenance obligation; not needed to launch a content-forward site | Launch without it; Ghost makes it trivial to add later via Portal feature |
| Comments system | Readers want to engage | Requires moderation, spam management, identity/privacy concerns; clutters reading experience; personal sites rarely have active comment communities | Link to Twitter/Mastodon/email for conversation instead |
| Search | Users want to find content | Adds significant JS weight; Ghost's built-in search (Sodo Search) is available but adds a dependency; for a small personal site with clear sections, navigation is sufficient | Clear section structure makes search unnecessary at launch |
| Dark mode toggle | Users with OS dark mode expect it | Doubles CSS complexity; requires careful color math; serif warm palettes often look poor in dark mode; adds JS for persistence | Ship light-only; revisit after the visual identity is locked in |
| Google Scholar API integration | Auto-sync publications | Brittle API; rate limits; changes in Scholar's data structure can break the page; adds backend complexity incompatible with Ghost.io hosted | Manual curation in a static Ghost page — good enough for v1 |
| Tag/category archive pages | Bloggers expect tags | Adds navigation complexity; small personal site doesn't benefit from tag taxonomy at launch; creates pressure to tag everything consistently | Section-based navigation (Blog, Publications, Products, Experiments) is cleaner |
| Pagination on blog listing | Standard blog UX | For a personal site with modest post volume, infinite scroll or "load more" is fine; pagination adds template complexity | Ghost has `{{pagination}}` helper if needed; defer until post volume justifies it |
| Contact form | Visitors want to reach Jess | Requires form handling backend or third-party service; Ghost.io doesn't support server-side form processing natively | Link to email or social in footer/about page |

## Feature Dependencies

```
Sidebar Navigation Layout
    └──requires──> Custom navigation partial (partials/navigation.hbs)
    └──requires──> CSS grid/flex layout in default.hbs

Custom Homepage (hero + intro)
    └──requires──> home.hbs template
    └──requires──> routes.yaml routing config

Publications Section
    └──requires──> page-publications.hbs (or custom-publications.hbs) template
    └──requires──> Ghost static page with slug "publications"

Products Section
    └──requires──> page-products.hbs template (or shared custom-cards.hbs)
    └──requires──> Ghost static page with slug "products"

Experiments Section
    └──requires──> page-experiments.hbs template (shares structure with Products)
    └──depends on──> Products Section (same template/card component)

Consistent Card Component
    └──required by──> Products Section
    └──required by──> Experiments Section
    └──implemented as──> partials/card.hbs

Warm Visual Identity
    └──requires──> CSS custom properties (palette tokens)
    └──requires──> Serif font loaded (Google Fonts or self-hosted)
    └──enhances──> All sections

Blog Post Listing
    └──requires──> index.hbs (auto-routed by Ghost)
    └──enhanced by──> Feature images on posts
    └──enhanced by──> Reading time metadata
```

### Dependency Notes

- **Custom Homepage requires routes.yaml:** Ghost defaults to `index.hbs` at `/`. To serve `home.hbs` at the root, `routes.yaml` must map `/: home` and move the post collection to `/blog/`.
- **Products and Experiments share card component:** Build the card partial once (image, title, description, link), reuse in both sections. This is P1 for Products and naturally carries over to Experiments at zero additional cost.
- **Sidebar nav requires responsive treatment:** A fixed sidebar at desktop must collapse to a top/hamburger nav at mobile. This is the single most complex CSS challenge in the theme.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to go live at general-purpose.ghost.io.

- [ ] Custom homepage with bold hero + intro statement — establishes identity immediately
- [ ] Blog section at `/blog/` — reverse-chrono post list; post detail pages
- [ ] About page — bio, photo, background
- [ ] Publications page — manually curated list of academic works
- [ ] Products page — cards for products built or contributed to
- [ ] Experiments page — cards linking to external web experiments
- [ ] Sidebar navigation — Blog, Publications, Products, Experiments, About
- [ ] Warm serif visual identity — cream background, terracotta accent, serif body typography
- [ ] Responsive layout — sidebar collapses gracefully on mobile
- [ ] Feature images on posts — post list needs thumbnails to scan

### Add After Validation (v1.x)

Features to add once the core site is live and working.

- [ ] Reading progress indicator — add to individual post pages if reading time data shows long-form content; trigger: post volume grows
- [ ] Social sharing links on posts — add if traffic analysis shows inbound from social; trigger: posts start circulating
- [ ] Newsletter signup — Ghost Portal makes this low-effort; trigger: Jess decides she wants a mailing list
- [ ] Pagination on blog listing — trigger: post count exceeds ~20

### Future Consideration (v2+)

Features to defer; don't build until clearly needed.

- [ ] Dark mode — defer until warm palette is finalized and locked; adds CSS complexity
- [ ] Search — defer until site has enough content to justify it (50+ posts)
- [ ] Comments — likely never; personal sites don't benefit from comment communities
- [ ] Google Scholar API integration — only if manual curation becomes burdensome

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Blog post listing + post pages | HIGH | LOW | P1 |
| About page | HIGH | LOW | P1 |
| Sidebar navigation | HIGH | MEDIUM | P1 |
| Custom homepage hero | HIGH | MEDIUM | P1 |
| Warm serif visual identity | HIGH | MEDIUM | P1 |
| Publications page | HIGH | MEDIUM | P1 |
| Products page | HIGH | LOW | P1 |
| Experiments page | MEDIUM | LOW | P1 |
| Responsive layout | HIGH | MEDIUM | P1 |
| Feature images on posts | MEDIUM | LOW | P1 |
| Card component (shared) | MEDIUM | LOW | P1 |
| Reading time on posts | LOW | LOW | P2 |
| Social sharing | LOW | LOW | P2 |
| Newsletter signup | MEDIUM | LOW | P2 |
| Dark mode | LOW | HIGH | P3 |
| Search | LOW | MEDIUM | P3 |
| Pagination | LOW | LOW | P2 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

The reference sites mentioned in PROJECT.md reveal the design DNA this site should match:

| Feature | Manuel Moreale | Mustafa Suleyman | Maggie Appleton | Our Approach |
|---------|----------------|------------------|-----------------|--------------|
| Navigation | Minimal top nav | Sidebar nav with sections | Top nav | Sidebar nav (Mustafa pattern) |
| Homepage hero | Simple text intro | Content list | Bold serif statement | Bold serif hero with intro text (Maggie pattern) |
| Post list | Plain text links, dates | Thumbnail + title + excerpt | Card grid with illustrations | Thumbnail + title (Mustafa pattern) |
| Typography | Serif body, minimal | Serif headings, clean | Bold serif, expressive | Serif throughout, warm |
| Color palette | Near-white, subtle | Light, minimal color | Warm off-white | Cream background, terracotta accent |
| Section structure | Single blog | Blog + other sections | Projects, Essays, Library, Notes | Blog + Publications + Products + Experiments |
| About | Dedicated page | Sidebar bio | Dedicated page | Dedicated About page |

## Sources

- [Ghost Handlebars Theme Docs](https://docs.ghost.org/themes) — template structure, helpers, required files
- [Ghost Navigation Helper](https://docs.ghost.org/themes/helpers/data/navigation) — `{{navigation}}` and custom partial override
- [Ghost Custom Pages](https://brightthemes.com/blog/ghost-custom-pages) — `page-[slug].hbs`, `custom-[name].hbs`, routes.yaml patterns
- [Ghost Routing Docs](https://brightthemes.com/blog/ghost-routing) — collections and `routes.yaml` for multi-section sites
- [Ghost Custom Settings](https://ghost.org/docs/themes/custom-settings/) — `package.json` config.custom for typography and color
- [Ghost Reading Time Helper](https://ghost.org/tutorials/reading-time/) — `{{reading_time}}` helper
- [Ghost SEO Features](https://ghost.org/help/seo/) — automatic meta, Open Graph, RSS, sitemap
- [Ghost Personal Site Forum Thread](https://forum.ghost.org/t/looking-for-a-theme-for-a-personal-blog-portfolio/39847) — community patterns for personal sites
- Reference sites: manuelmoreale.com, mustafasuleyman.com, maggieappleton.com, peopleandblogs.com

---
*Feature research for: Ghost-based personal website (general-purpose.ghost.io)*
*Researched: 2026-03-23*
