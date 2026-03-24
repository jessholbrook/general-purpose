# Roadmap: General Purpose — Jess Holbrook's Personal Site

## Overview

Four phases build the site in dependency order: a validated Ghost scaffold with deploy automation, a complete visual identity system including the sidebar layout, the primary content surfaces (homepage and blog), and finally all curated section pages plus finishing touches. Each phase delivers something verifiable before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Valid Ghost 6 theme scaffold with automated deploy to general-purpose.ghost.io (completed 2026-03-24)
- [ ] **Phase 2: Visual Identity** - Complete design system (palette, typography, sidebar layout) applied to base template
- [ ] **Phase 3: Homepage and Blog** - Bold hero homepage and reverse-chronological blog with post cards
- [ ] **Phase 4: Section Pages and Polish** - Publications, Products, Experiments, About pages with active nav states

## Phase Details

### Phase 1: Foundation
**Goal**: The theme passes gscan validation and can be deployed to Ghost.io in a single command — eliminating the two failure modes that would block all later work.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, INFRA-01, INFRA-02
**Success Criteria** (what must be TRUE):
  1. Running gscan against the theme zip produces zero fatal errors
  2. A single deploy command uploads and activates the theme on general-purpose.ghost.io
  3. All required Ghost helpers (`{{asset}}`, `{{body_class}}`, `{{post_class}}`, `{{ghost_head}}`, `{{ghost_foot}}`) are present in default.hbs
  4. The error page (error.hbs) renders correctly when a 404 or 500 occurs on the live site
  5. Asset paths use `{{asset}}` helper throughout — no hardcoded relative paths
**Plans:** 1/1 plans complete
Plans:
- [ ] 01-01-PLAN.md — Ghost theme scaffold, build validation, and deploy workflow

### Phase 2: Visual Identity
**Goal**: The complete visual design system — palette, typography, spacing tokens, and responsive sidebar layout — is established in default.hbs, so every subsequent template inherits consistent styling without rework.
**Depends on**: Phase 1
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04, FOUND-03
**Success Criteria** (what must be TRUE):
  1. Visiting any page on the live site shows the cream/off-white background with terracotta accent color applied
  2. Headings and body text render in the chosen serif web fonts (not system defaults)
  3. The sidebar navigation is visible as a persistent column on desktop and collapses to a mobile-friendly nav below the breakpoint
  4. A dark mode toggle switches the site to an appropriate dark color scheme
  5. CSS design tokens (custom properties) define all palette, type, and spacing values — no hardcoded hex values in templates
**Plans:** 2 plans
Plans:
- [ ] 02-01-PLAN.md — Design tokens, Google Fonts, and responsive sidebar layout
- [ ] 02-02-PLAN.md — Dark mode toggle with FOUC prevention and localStorage persistence

### Phase 3: Homepage and Blog
**Goal**: The two primary content surfaces — the bold hero homepage and the full blog listing with individual post pages — are live and reflect the site's personality.
**Depends on**: Phase 2
**Requirements**: HOME-01, HOME-02, BLOG-01, BLOG-02, BLOG-03
**Success Criteria** (what must be TRUE):
  1. The homepage displays a bold serif hero with the intro statement ("Jess writes about people, AI, and people + AI") and section preview links below it
  2. The blog listing at `/blog/` shows posts in reverse chronological order as scannable cards with thumbnail, title, excerpt, and date
  3. Individual post pages show the full article content with date and reading time displayed
  4. The homepage is served from `home.hbs` at `/` — not a default Ghost post listing
**Plans**: TBD

### Phase 4: Section Pages and Polish
**Goal**: All curated section pages (Publications, Products, Experiments, About) are live and the site is ready for launch — with active navigation states and all templates passing a final gscan clean pass.
**Depends on**: Phase 3
**Requirements**: SECT-01, SECT-02, SECT-03, ABOUT-01, INFRA-03
**Success Criteria** (what must be TRUE):
  1. The Publications page lists academic papers with title, venue, year, and link
  2. The Products page displays product cards (image, name, description, link) for each product built or contributed to
  3. The Experiments page shows cards that link out to external web experiments
  4. The About page contains Jess's bio, photo, and background
  5. The sidebar navigation highlights the current section when visiting any page on the site
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/1 | Complete    | 2026-03-24 |
| 2. Visual Identity | 0/2 | Not started | - |
| 3. Homepage and Blog | 0/TBD | Not started | - |
| 4. Section Pages and Polish | 0/TBD | Not started | - |
