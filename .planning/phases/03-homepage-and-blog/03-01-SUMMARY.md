---
phase: 03-homepage-and-blog
plan: 01
subsystem: ui
tags: [ghost-theme, handlebars, css, homepage, routing]

# Dependency graph
requires:
  - phase: 02-design-system
    provides: "CSS design tokens, sidebar layout, default.hbs template"
provides:
  - "home.hbs bold serif hero homepage template"
  - "routes.yaml Ghost routing config (/ -> home, /blog/ -> index)"
  - "Homepage hero and section preview CSS styles"
affects: [03-homepage-and-blog, 04-deploy]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Ghost custom routes via routes.yaml", "Template inheritance with {{!< default}}"]

key-files:
  created: [home.hbs, routes.yaml]
  modified: [assets/css/screen.css]

key-decisions:
  - "routes.yaml kept at project root, uploaded separately to Ghost Admin (not bundled in theme zip)"

patterns-established:
  - "Section preview card pattern: h2 title link + muted description + border divider"
  - "Homepage content renders inside default.hbs site-main without extra wrapper"

requirements-completed: [HOME-01, HOME-02]

# Metrics
duration: 1min
completed: 2026-03-24
---

# Phase 3 Plan 1: Homepage Hero and Routing Summary

**Bold serif hero homepage with 5 section preview links and Ghost routes.yaml mapping / to home and /blog/ to index**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-25T02:51:15Z
- **Completed:** 2026-03-25T02:52:29Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created home.hbs with bold serif hero displaying "Jess writes about people, AI, and people + AI."
- Five section preview links (Blog, Publications, Products, Experiments, About) with descriptions
- Ghost routes.yaml mapping / to home template and /blog/ to index collection with /blog/{slug}/ permalinks
- All homepage CSS uses existing design tokens from Phase 2

## Task Commits

Each task was committed atomically:

1. **Task 1: Create home.hbs hero template and routes.yaml** - `d6f38b2` (feat)
2. **Task 2: Add homepage hero and section preview CSS** - `62760a0` (feat)

## Files Created/Modified
- `home.hbs` - Bold serif hero homepage template with section preview links
- `routes.yaml` - Ghost routing config: / -> home, /blog/ -> index collection
- `assets/css/screen.css` - Homepage hero and section preview styles

## Decisions Made
- routes.yaml placed at project root for separate upload to Ghost Admin (Settings > Labs > Routes), not bundled in theme zip

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
**routes.yaml must be uploaded to Ghost Admin** (Settings > Labs > Routes) separately from the theme zip. The zip script only includes *.hbs, partials/, assets/, and package.json.

## Next Phase Readiness
- Homepage template ready for Ghost deployment
- Blog collection routing configured at /blog/
- Ready for Plan 02 (blog listing and post templates)

## Self-Check: PASSED

All files created, all commits verified.

---
*Phase: 03-homepage-and-blog*
*Completed: 2026-03-24*
