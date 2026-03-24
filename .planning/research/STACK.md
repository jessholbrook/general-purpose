# Stack Research

**Domain:** Custom Ghost Handlebars theme for a personal website
**Researched:** 2026-03-23
**Confidence:** HIGH (core stack is mandated by platform; verified against official Ghost 6 docs and TryGhost/Starter repo)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Handlebars | Built into Ghost | Template language for all `.hbs` files | Ghost's only supported templating language; no alternative exists for server-rendered themes |
| Ghost (local) | 6.x via `ghost-cli` | Local development server | The only way to preview themes with real Ghost rendering; zip upload to admin does not substitute for a dev loop |
| Node.js | 22 LTS | Ghost runtime + build tools | Ghost 6 requires Node 22 exactly; earlier versions (18, 20) are dropped in Ghost 6 |
| PostCSS + postcss-preset-env | 8.x / 10.x | CSS build pipeline | Official Ghost starter uses this; `postcss-preset-env` compiles modern CSS (custom properties, nesting) to broad browser support — no framework lock-in |
| Rollup | 4.x | JS bundler | Official Ghost Starter uses Rollup 4; handles JS transpilation via Babel and produces a minimal asset bundle for a content site |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| postcss-import | 16.x | CSS `@import` resolution at build time | Use to split CSS across partials (`typography.css`, `layout.css`, etc.) without HTTP cost |
| @rollup/plugin-babel + @babel/preset-env | 6.x / 7.x | JS transpilation | Required if you write ESM or modern JS that needs to reach older browsers |
| gscan | latest (npx) | Theme validation against Ghost 6 spec | Run before every upload; Ghost Admin blocks uploads on fatal errors |
| bestzip | 2.x | Creates the `.zip` for upload | Used in the official starter's `npm run zip` script |
| TryGhost/action-deploy-theme | v1 | GitHub Action for automated deploy | Use once the theme stabilizes — push to main, auto-deploys to Ghost Admin via Admin API |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ghost-cli | Installs and manages local Ghost instance | `npm install -g ghost-cli`, then `ghost install local` in an empty dir; creates site at `localhost:2368` |
| Symlink / content/themes | Live theme reload in local Ghost | Symlink your theme folder into `<ghost-install>/content/themes/` so edits hot-reload without re-uploading |
| `npm run dev` | Watch mode for CSS/JS | Rollup watches `.css` and `.js` files; Handlebars changes reload automatically via local Ghost |
| `npm run test` | Runs `gscan .` | Catches compatibility issues against Ghost 6 before upload |
| `npm run zip` | Builds + packages theme | Produces a `<theme-name>.zip` for manual upload to Ghost Admin or CI deploy |

## Installation

```bash
# Install ghost-cli globally (one-time)
npm install -g ghost-cli

# Create local Ghost dev instance
mkdir ghost-local && cd ghost-local
ghost install local

# Create theme repo separately, then symlink into themes
ln -s /path/to/your-theme <ghost-local>/content/themes/your-theme

# In your theme repo — bootstrap from official starter
git clone https://github.com/TryGhost/Starter your-theme
cd your-theme
npm install

# Dev mode (watch + livereload)
npm run dev

# Validate against Ghost 6
npm run test

# Build and zip for upload
npm run zip
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| PostCSS + vanilla CSS | Tailwind CSS | If you want utility-first development speed and don't mind ghost-generated content requiring `@tailwindcss/typography` to style prose; more setup, more bytes |
| PostCSS + vanilla CSS | Sass/SCSS | If team already has Sass expertise; requires replacing the Rollup/PostCSS pipeline with a Gulp one (Casper uses Gulp); valid but more boilerplate |
| Rollup | Gulp | Casper (Ghost's default theme) uses Gulp 5; both work, but the official Starter template uses Rollup and is the simpler starting point for custom themes |
| Ghost CLI (local) | Zip-upload-only iteration | Zip upload works but creates a slow feedback loop (upload → activate → view); local Ghost + symlink is dramatically faster |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| AMP templates (`amp.hbs`) | Removed entirely in Ghost 6.0; will produce gscan errors | Do nothing — standard Handlebars templates are the only path |
| `?limit=all` API requests | Ghost 6 caps API responses at 100 items per page | Use pagination helpers (`{{#foreach}}` with `{{pagination}}`) |
| Webpack | No official Ghost starter uses it; heavier config for no benefit on a content site | Rollup (official starter default) |
| Ghost 5 `engines` field (`"ghost": ">=5.0.0"`) | Won't match Ghost 6 validation in gscan | Set `"ghost": ">=6.0.0"` in `package.json` |

## Stack Patterns by Variant

**If deploying manually (Ghost.io hosted, Publisher plan or above):**
- Use `npm run zip` to produce the `.zip`
- Upload via Ghost Admin → Settings → Design → Upload theme
- Theme name in `package.json` must stay consistent across uploads to preserve design settings

**If automating deployment (recommended once theme is stable):**
- Use TryGhost/action-deploy-theme GitHub Action
- Requires Ghost Admin API key from Ghost Admin → Integrations → Add custom integration
- Store `GHOST_ADMIN_API_URL` and `GHOST_ADMIN_API_KEY` as GitHub repo secrets

**If writing CSS for content-forward serif design (this project):**
- Use CSS custom properties for the entire design token layer (colors, type scale, spacing)
- `postcss-preset-env` handles nesting and custom properties for all targets
- Avoid Tailwind — the warm, editorial aesthetic this site requires is easier to express in intentional vanilla CSS with named tokens than in utility classes

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Ghost 6.x | Node.js 22 LTS only | Node 18 and 20 dropped in Ghost 6.0 (released August 2025) |
| gscan latest | Ghost 5 and Ghost 6 | Supports both via `--v5` or `--v6` flags; defaults to current major |
| rollup 4.x | @rollup/plugin-babel 6.x | Plugin major versions track Rollup; don't mix rollup 3 plugins with rollup 4 |
| postcss-preset-env 10.x | postcss 8.x | postcss-preset-env 10 requires postcss >= 8.4 |

## Sources

- https://github.com/TryGhost/Starter — Official TryGhost Starter theme; `package.json` verified with exact dependency versions (Rollup 4, PostCSS 8, postcss-preset-env 10)
- https://docs.ghost.org/themes/ — Ghost Handlebars theme overview; Handlebars as the only templating language confirmed
- https://docs.ghost.org/themes/structure/ — Required files: `index.hbs`, `post.hbs`, `package.json`; optional templates listed
- https://ghost.org/changelog/6/ — Ghost 6.0 released August 4 2025; Node 22 requirement; AMP removed
- https://docs.ghost.org/changes — Ghost 6.0 breaking changes; AMP removal, file-serving behavior, no significant Handlebars API changes
- https://github.com/TryGhost/action-deploy-theme — Official GitHub Action for Ghost theme deployment
- https://gscan.ghost.org/ — Web UI for gscan validation; supports v5 and v6

---
*Stack research for: Custom Ghost Handlebars theme (general-purpose.ghost.io)*
*Researched: 2026-03-23*
