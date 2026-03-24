---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [ghost, theme, rollup, postcss, gscan, github-actions]

# Dependency graph
requires: []
provides:
  - Valid Ghost 6 theme scaffold passing gscan with zero errors
  - Rollup + PostCSS build pipeline producing built CSS and JS
  - GitHub Actions deploy workflow using TryGhost/action-deploy-theme
  - Public GitHub repo at jessholbrook/general-purpose
affects: [02-design-system, 03-content-templates, 04-polish]

# Tech tracking
tech-stack:
  added: [rollup, postcss, postcss-preset-env, gscan, "@rollup/plugin-terser", "@rollup/plugin-node-resolve", rollup-plugin-postcss, rollup-plugin-livereload]
  patterns: [ESM modules with "type: module", PostCSS extracted via Rollup plugin, iife output format]

key-files:
  created:
    - package.json
    - rollup.config.js
    - default.hbs
    - index.hbs
    - post.hbs
    - page.hbs
    - error.hbs
    - assets/css/screen.css
    - assets/js/main.js
    - .github/workflows/deploy-theme.yml
    - .gitignore
    - partials/.gitkeep
  modified: []

key-decisions:
  - "Used path.resolve for PostCSS extract path to ensure correct output location"
  - "Added --gh-font-heading and --gh-font-body CSS variables for Ghost custom font support"
  - "Used @page.show_title_and_feature_image in page.hbs for Ghost Beta editor compatibility"

patterns-established:
  - "Asset references: Always use {{asset}} helper, never hardcoded paths"
  - "CSS source in assets/css/, built output in assets/built/"
  - "JS entry imports CSS so PostCSS processes it via Rollup"
  - "error.hbs is standalone HTML — never use ghost_head/ghost_foot"

requirements-completed: [FOUND-01, FOUND-02, INFRA-01, INFRA-02]

# Metrics
duration: 4min
completed: 2026-03-24
---

# Phase 1 Plan 1: Theme Scaffold Summary

**Ghost 6 theme scaffold with Rollup+PostCSS build pipeline, zero gscan errors, and GitHub Actions deploy workflow**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-24T04:57:11Z
- **Completed:** 2026-03-24T05:01:30Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments
- Complete Ghost 6 theme scaffold with all required templates (default, index, post, page, error)
- Rollup build pipeline producing minified CSS and JS in assets/built/
- gscan validation passing with zero errors and zero warnings
- GitHub Actions deploy workflow configured with TryGhost/action-deploy-theme
- Public repo created at github.com/jessholbrook/general-purpose

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Ghost theme scaffold** - `2481173` (feat)
2. **Task 2: Install deps, build, pass gscan** - `8a29883` (feat)
3. **Task 3: GitHub repo and deploy workflow** - `05194e3` (feat)

## Files Created/Modified
- `package.json` - Theme metadata, scripts, devDependencies
- `rollup.config.js` - Build pipeline with PostCSS extraction and terser
- `default.hbs` - Base layout with ghost_head, ghost_foot, body_class, asset helpers
- `index.hbs` - Post listing with foreach and pagination
- `post.hbs` - Single post with post_class helper
- `page.hbs` - Static page with @page.show_title_and_feature_image
- `error.hbs` - Standalone error page (no ghost_head/ghost_foot)
- `assets/css/screen.css` - Base reset, Ghost editor width classes, font variables
- `assets/js/main.js` - Entry point importing CSS for PostCSS processing
- `partials/.gitkeep` - Ensures partials directory in git
- `.gitignore` - Excludes node_modules, built assets, zips
- `.github/workflows/deploy-theme.yml` - Auto-deploy on push to main
- `package-lock.json` - Locked dependency versions

## Decisions Made
- Used `path.resolve()` for PostCSS extract path -- rollup-plugin-postcss resolves relative to output dir, not project root
- Added `author.email` and `keywords: ["ghost-theme"]` to satisfy gscan requirements not specified in plan
- Added `--gh-font-heading` and `--gh-font-body` CSS custom properties for Ghost custom font support
- Used `@page.show_title_and_feature_image` conditional in page.hbs for Ghost Beta editor compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] PostCSS extract path resolved incorrectly**
- **Found during:** Task 2 (build validation)
- **Issue:** `extract: 'assets/built/screen.css'` was resolved relative to output dir, creating nested path instead of project-root-relative output
- **Fix:** Used `import { resolve as resolvePath } from 'path'` and `extract: resolvePath('assets/built/screen.css')`
- **Files modified:** rollup.config.js
- **Verification:** Build produces assets/built/screen.css at correct location
- **Committed in:** 8a29883 (Task 2 commit)

**2. [Rule 1 - Bug] gscan required author.email and keywords in package.json**
- **Found during:** Task 2 (gscan validation)
- **Issue:** gscan requires `author.email` field and `keywords` containing `ghost-theme`
- **Fix:** Added email and keywords fields to package.json
- **Files modified:** package.json
- **Verification:** gscan no longer reports these errors
- **Committed in:** 8a29883 (Task 2 commit)

**3. [Rule 1 - Bug] gscan required .kg-width-wide and .kg-width-full CSS classes**
- **Found during:** Task 2 (gscan validation)
- **Issue:** Ghost editor width cards require these CSS classes to be styled
- **Fix:** Added both classes with appropriate width/margin rules
- **Files modified:** assets/css/screen.css
- **Verification:** gscan reports zero errors
- **Committed in:** 8a29883 (Task 2 commit)

**4. [Rule 1 - Bug] gscan required @page.show_title_and_feature_image in page.hbs**
- **Found during:** Task 2 (gscan validation)
- **Issue:** Ghost Beta editor pages need the @page global for title/feature image visibility control
- **Fix:** Wrapped header in `{{#if @page.show_title_and_feature_image}}` conditional
- **Files modified:** page.hbs
- **Verification:** gscan reports zero errors
- **Committed in:** 8a29883 (Task 2 commit)

**5. [Rule 1 - Bug] gscan warned about missing custom font CSS variables**
- **Found during:** Task 2 (gscan validation)
- **Issue:** Ghost custom font settings require --gh-font-heading and --gh-font-body CSS variables
- **Fix:** Added both variables to :root in screen.css with `inherit` defaults
- **Files modified:** assets/css/screen.css
- **Verification:** gscan reports zero warnings
- **Committed in:** 8a29883 (Task 2 commit)

---

**Total deviations:** 5 auto-fixed (5 bugs/missing gscan requirements)
**Impact on plan:** All auto-fixes were necessary to achieve zero gscan errors. No scope creep.

## Issues Encountered
None beyond the gscan validation fixes documented above.

## User Setup Required
None - no external service configuration required. The deploy workflow will need GHOST_ADMIN_API_URL and GHOST_ADMIN_API_KEY secrets configured on GitHub once a Ghost Creator plan is active, but that is a future phase concern.

## Next Phase Readiness
- Theme scaffold is complete and validated -- ready for design system work in Phase 2
- Build pipeline is functional for iterating on CSS and JS
- Deploy workflow is in place for when Ghost Creator plan is activated
- All required Ghost helpers are present in templates

---
*Phase: 01-foundation*
*Completed: 2026-03-24*
