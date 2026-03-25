# Requirements: General Purpose — Jess Holbrook's Personal Site

**Defined:** 2026-03-23
**Core Value:** A sophisticated, simple personal site that makes Jess's work easy to find and pleasant to read.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: Valid Ghost 6 theme scaffold passing gscan validation
- [x] **FOUND-02**: One-command deploy automation to general-purpose.ghost.io
- [x] **FOUND-03**: Sidebar navigation that collapses to mobile-friendly nav below breakpoint

### Visual Identity

- [x] **VIS-01**: Warm color palette with cream/off-white background and terracotta accent color
- [x] **VIS-02**: CSS design tokens for palette, typography, and spacing
- [x] **VIS-03**: Custom serif web fonts for headings and body text
- [x] **VIS-04**: Dark mode toggle with appropriate color scheme

### Homepage

- [x] **HOME-01**: Bold serif hero intro statement ("Jess writes about people, AI, and people + AI")
- [x] **HOME-02**: Section links/previews below hero

### Blog

- [x] **BLOG-01**: Reverse-chronological post listing on blog page
- [x] **BLOG-02**: Individual post template with date and reading time
- [x] **BLOG-03**: Post card partial (thumbnail, title, excerpt, date)

### Section Pages

- [ ] **SECT-01**: Publications page with manually curated academic papers
- [ ] **SECT-02**: Products page with simple cards (image, name, description, link)
- [ ] **SECT-03**: Experiments page with cards linking to external projects

### About

- [ ] **ABOUT-01**: Dedicated about page with bio, photo, and background

### Infrastructure

- [x] **INFRA-01**: Proper asset paths via {{asset}} helper
- [x] **INFRA-02**: Error page (error.hbs)
- [ ] **INFRA-03**: Active navigation state for current section

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhancements

- **ENH-01**: Custom settings in Ghost Admin (accent color, font choice toggles)
- **ENH-02**: Tag filtering on blog page
- **ENH-03**: Search across blog posts
- **ENH-04**: Sticky sidebar on scroll
- **ENH-05**: Live Google Scholar integration for publications

## Out of Scope

| Feature | Reason |
|---------|--------|
| Newsletter/subscription | Not needed for launch; Ghost Portal makes it easy to add later |
| Comments system | Not a priority for personal site |
| Mobile app / PWA | Web only |
| Scholar API integration | Manual curation simpler for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| VIS-01 | Phase 2 | Complete |
| VIS-02 | Phase 2 | Complete |
| VIS-03 | Phase 2 | Complete |
| VIS-04 | Phase 2 | Complete |
| FOUND-03 | Phase 2 | Complete |
| HOME-01 | Phase 3 | Complete |
| HOME-02 | Phase 3 | Complete |
| BLOG-01 | Phase 3 | Complete |
| BLOG-02 | Phase 3 | Complete |
| BLOG-03 | Phase 3 | Complete |
| SECT-01 | Phase 4 | Pending |
| SECT-02 | Phase 4 | Pending |
| SECT-03 | Phase 4 | Pending |
| ABOUT-01 | Phase 4 | Pending |
| INFRA-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap creation*
