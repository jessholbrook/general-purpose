---
phase: 03-homepage-and-blog
verified: 2026-03-24T00:00:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
---

# Phase 3: Homepage and Blog Verification Report

**Phase Goal:** The two primary content surfaces — the bold hero homepage and the full blog listing with individual post pages — are live and reflect the site's personality.
**Verified:** 2026-03-24
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                  | Status     | Evidence                                                                          |
|----|----------------------------------------------------------------------------------------|------------|-----------------------------------------------------------------------------------|
| 1  | Homepage displays a bold serif hero with the intro statement                           | VERIFIED   | home.hbs line 4: `<h1 class="hero-title">Jess writes about people, AI, and people + AI.</h1>` |
| 2  | Section preview links appear below the hero (Blog, Publications, Products, Experiments, About) | VERIFIED   | home.hbs lines 7–32: five `.section-preview` divs with correct URLs and descriptions |
| 3  | routes.yaml exists and maps / to home.hbs and /blog/ to index.hbs                     | VERIFIED   | routes.yaml: `/:  home` and `/blog/: permalink: /blog/{slug}/  template: index` |
| 4  | Blog listing at /blog/ shows posts in reverse chronological order as scannable cards  | VERIFIED   | index.hbs: `{{#foreach posts}}` (Ghost default is reverse-chrono) + `{{> post-card}}` partial |
| 5  | Each post card shows thumbnail (if present), title, excerpt, and date                 | VERIFIED   | partials/post-card.hbs: `{{#if feature_image}}` guard, `.post-card-title`, `.post-card-excerpt`, `.post-card-date` |
| 6  | Individual post pages display full content with date and reading time                 | VERIFIED   | post.hbs lines 7–11: `{{date format="MMMM D, YYYY"}}` and `{{reading_time}}` both present |
| 7  | Post cards gracefully handle missing feature images                                   | VERIFIED   | partials/post-card.hbs: image block wrapped in `{{#if feature_image}}...{{/if}}`, layout defaults to 1-column without image |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact                       | Expected                                       | Status     | Details                                                                                  |
|-------------------------------|------------------------------------------------|------------|------------------------------------------------------------------------------------------|
| `home.hbs`                    | Bold hero homepage template                    | VERIFIED   | Exists, 32 lines, contains `hero-title`, `home-sections`, 5 section-preview cards, no `<main>` wrapper, extends `{{!< default}}` |
| `routes.yaml`                 | Ghost routing config for custom homepage       | VERIFIED   | Exists, 7 lines, maps `/: home` and `/blog/` collection with `template: index`         |
| `assets/css/screen.css`       | Hero and section preview styles                | VERIFIED   | Contains `.home-hero` (line 231), `.hero-title` (237), `.home-sections` (246), `.section-preview` (252), `.section-desc` (275); all use design tokens |
| `partials/post-card.hbs`      | Reusable post card partial                     | VERIFIED   | Exists, 21 lines, contains `post-card`, feature_image guard, lazy loading, excerpt guard, date |
| `index.hbs`                   | Blog listing page with post cards and pagination | VERIFIED  | Exists, 12 lines, contains `{{> post-card}}` inside `{{#foreach posts}}`, `{{pagination}}`, no `<main>` wrapper |
| `post.hbs`                    | Individual post template with reading time     | VERIFIED   | Exists, 24 lines, contains `{{reading_time}}`, feature image guard, no `<main>` wrapper |
| `assets/css/screen.css` (blog) | Post card and post page styles                | VERIFIED   | Contains `.post-card-image` (322), `.post-reading-time` (383), `.blog-listing` (288), `.post-content blockquote` with accent border |

### Key Link Verification

| From              | To                        | Via                              | Status   | Details                                                         |
|-------------------|---------------------------|----------------------------------|----------|-----------------------------------------------------------------|
| `routes.yaml`     | `home.hbs`                | routes / maps to home template   | WIRED    | `routes.yaml` line 2: `/: home`; `home.hbs` line 1: `{{!< default}}` confirms it is the correct Ghost template name |
| `home.hbs`        | `default.hbs`             | template inheritance             | WIRED    | `home.hbs` line 1: `{{!< default}}`                             |
| `index.hbs`       | `partials/post-card.hbs`  | partial include inside foreach   | WIRED    | `index.hbs` line 6: `{{#foreach posts}}`, line 7: `{{> post-card}}` |
| `post.hbs`        | Ghost reading_time helper | built-in helper                  | WIRED    | `post.hbs` line 11: `{{reading_time}}`                          |
| `index.hbs`       | Ghost pagination helper   | built-in helper                  | WIRED    | `index.hbs` line 11: `{{pagination}}`                           |

### Requirements Coverage

| Requirement | Source Plan | Description                                           | Status    | Evidence                                                      |
|-------------|-------------|-------------------------------------------------------|-----------|---------------------------------------------------------------|
| HOME-01     | 03-01-PLAN  | Bold serif hero intro statement                       | SATISFIED | `home.hbs` h1.hero-title with exact text; `.hero-title` CSS: Lora font, 4rem, font-weight 600 |
| HOME-02     | 03-01-PLAN  | Section links/previews below hero                     | SATISFIED | `home.hbs` `.home-sections` with 5 `.section-preview` cards for Blog, Publications, Products, Experiments, About |
| BLOG-01     | 03-02-PLAN  | Reverse-chronological post listing on blog page       | SATISFIED | `index.hbs` uses `{{#foreach posts}}` — Ghost `foreach` on posts is reverse-chronological by default |
| BLOG-02     | 03-02-PLAN  | Individual post template with date and reading time   | SATISFIED | `post.hbs` contains both `{{date format="MMMM D, YYYY"}}` and `{{reading_time}}` in `.post-meta` |
| BLOG-03     | 03-02-PLAN  | Post card partial (thumbnail, title, excerpt, date)   | SATISFIED | `partials/post-card.hbs` provides all four elements with feature_image guard for graceful degradation |

No orphaned requirements: REQUIREMENTS.md traceability table maps HOME-01, HOME-02, BLOG-01, BLOG-02, BLOG-03 exclusively to Phase 3, all accounted for by the two plans.

### Anti-Patterns Found

No anti-patterns detected.

- No TODO/FIXME/PLACEHOLDER comments in any phase-3 template or CSS
- No redundant `<main>` wrappers in `home.hbs`, `index.hbs`, or `post.hbs` (plan's critical correctness requirement met)
- No stub implementations (empty handlers, static returns, placeholder text)
- All CSS uses design tokens exclusively — no hardcoded hex values in the Phase 3 additions

### Human Verification Required

The following items cannot be verified programmatically and require a running Ghost instance.

#### 1. Homepage Hero Visual Rendering

**Test:** Visit the live site root (`/`) after uploading routes.yaml to Ghost Admin > Settings > Labs > Routes.
**Expected:** Bold serif heading "Jess writes about people, AI, and people + AI." appears at large size (4rem) with generous top padding, followed by the five section preview links each with a title and description separated by a horizontal border.
**Why human:** CSS rendering, font loading (Lora), and visual spacing cannot be confirmed from static file analysis.

#### 2. Blog Listing Post Order

**Test:** Publish two or more posts at different dates and visit `/blog/`.
**Expected:** Posts appear newest-first in the feed.
**Why human:** Ghost's `{{#foreach posts}}` sort order is controlled by Ghost's collection config and defaults; verifiable in UI only.

#### 3. Post Card Layout — With vs. Without Feature Image

**Test:** Compare a post card for a post with a feature image versus one without.
**Expected:** Card with image shows a 160px-wide thumbnail on the left and content on the right (2-column grid via `:has()`). Card without image shows a single-column layout with no broken space.
**Why human:** CSS `:has()` support and visual grid layout require browser rendering to confirm.

#### 4. routes.yaml Upload Requirement

**Test:** Confirm routes.yaml has been uploaded to Ghost Admin (Settings > Labs > Routes) and that `/` serves `home.hbs` rather than the default Ghost post listing.
**Expected:** The homepage is the bold hero, not a Ghost post feed.
**Why human:** routes.yaml is NOT bundled in the theme zip — it requires a manual upload step documented in the plan. This is a deployment action, not verifiable from codebase state.

### Gaps Summary

No gaps found. All must-haves verified at all three levels (exists, substantive, wired). All five requirement IDs (HOME-01, HOME-02, BLOG-01, BLOG-02, BLOG-03) are satisfied by concrete implementations in the codebase.

The one structural risk is the routes.yaml upload dependency: routes.yaml exists at the project root with correct content, but activating the custom homepage routing requires a manual Ghost Admin upload step. This is documented in the summary and is a deployment concern, not a code gap.

---

_Verified: 2026-03-24_
_Verifier: Claude (gsd-verifier)_
