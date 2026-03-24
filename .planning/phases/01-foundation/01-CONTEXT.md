# Phase 1: Foundation - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Valid Ghost 6 theme scaffold that passes gscan validation, with automated deploy pipeline via GitHub Actions. The theme can be deployed to general-purpose.ghost.io in a single push to main. Error page included. All asset paths use `{{asset}}` helper.

</domain>

<decisions>
## Implementation Decisions

### Deploy Workflow
- GitHub Action using TryGhost/action-deploy-theme for automated deploy
- Triggers on every push to main branch
- Public GitHub repo (new, to be created as part of this phase)
- Deploy to Ghost is deferred until plan upgrade — GitHub Action will be configured but won't work until Creator plan is active

### Theme Naming
- Theme name in package.json: "general-purpose"
- This is locked — Ghost ties admin design settings to this name

### Dev Environment
- Local Ghost install for development (full instance with Node 22 + ghost-cli)
- Rollup watch for live asset rebuilds during development
- gscan validation before every deploy attempt

### Ghost Plan Constraint
- Currently on Starter plan — custom theme uploads blocked
- Plan: build and validate locally, upgrade to Creator plan when ready to go live
- GitHub Action will be configured but actual deploys wait for plan upgrade
- Phase 1 success criteria adjusted: "deploy command works" means gscan passes + GitHub Action is configured, not necessarily live on Ghost.io yet

### Claude's Discretion
- Exact directory structure within the theme (beyond Ghost requirements)
- Which PostCSS plugins to include beyond postcss-preset-env
- .gitignore contents and repo structure
- Ghost CLI local install method (ghost-cli vs Docker)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — standard Ghost theme scaffold following TryGhost/Starter patterns.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None — first phase establishes patterns

### Integration Points
- GitHub repo → GitHub Action → Ghost Admin API (when plan is upgraded)
- Local Ghost install → theme development feedback loop

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-23*
