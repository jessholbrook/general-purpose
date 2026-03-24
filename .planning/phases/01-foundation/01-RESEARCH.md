# Phase 1: Foundation - Research

**Researched:** 2026-03-23
**Domain:** Ghost 6 theme scaffolding, gscan validation, GitHub Actions deploy automation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Deploy workflow: GitHub Action using TryGhost/action-deploy-theme, triggers on every push to main
- Public GitHub repo (new, to be created as part of this phase)
- Theme name in package.json: "general-purpose" — locked, Ghost ties admin design settings to this name
- Local Ghost install for development (full instance with Node 22 + ghost-cli)
- Rollup watch for live asset rebuilds during development
- gscan validation before every deploy attempt
- Currently on Starter plan — custom theme uploads blocked; GitHub Action will be configured but actual deploys wait for Creator plan upgrade
- Phase 1 success criteria adjusted: "deploy command works" means gscan passes + GitHub Action is configured, not necessarily live on Ghost.io yet

### Claude's Discretion
- Exact directory structure within the theme (beyond Ghost requirements)
- Which PostCSS plugins to include beyond postcss-preset-env
- .gitignore contents and repo structure
- Ghost CLI local install method (ghost-cli vs Docker)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Valid Ghost 6 theme scaffold passing gscan validation | Required files, helpers, package.json fields, gscan CLI usage documented |
| FOUND-02 | One-command deploy automation to general-purpose.ghost.io | TryGhost/action-deploy-theme workflow YAML, secrets setup documented |
| INFRA-01 | Proper asset paths via {{asset}} helper | Asset helper syntax, assets/built directory pattern documented |
| INFRA-02 | Error page (error.hbs) | Error context data, minimal template pattern, helper restrictions documented |
</phase_requirements>

---

## Summary

Phase 1 establishes a Ghost 6 theme that passes gscan validation and has an automated deploy pipeline via GitHub Actions. The work is greenfield — no existing code in the repo — so the primary output is a correct minimum-viable theme scaffold plus a `.github/workflows/deploy-theme.yml` that fires on every push to main.

Ghost 6 requires Node 22 (Node 18 is not supported in v6). The ghost-cli local development flow is well-documented and uses a SQLite3 dev instance at `localhost:2368`. Symlinking the theme directory into `<ghost-install>/content/themes/` is the standard local development pattern — no zip/upload needed during development.

gscan is the official validation tool; running it before every deploy attempt catches fatal errors before they reach Ghost Admin. The TryGhost/Starter theme is the canonical reference for file structure, build tooling (Rollup + PostCSS), and package.json fields. The GitHub Actions deploy action (`TryGhost/action-deploy-theme@v1`) handles zip packaging and Admin API upload automatically; the only setup required is creating a Custom Integration in Ghost Admin and storing its credentials as GitHub secrets (which cannot be done until the Creator plan is active).

**Primary recommendation:** Scaffold from TryGhost/Starter conventions. Implement the five required template files plus error.hbs, wire Rollup + PostCSS for assets, configure the GitHub Actions workflow file, and validate with gscan. The deploy action will be inert until the plan is upgraded — that is expected and acceptable per the locked decision.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Ghost (local) | 6.x | Development CMS instance | Target platform; local install provides instant feedback loop |
| ghost-cli | latest | Install/manage local Ghost | Official Ghost tool; `ghost install local` is the single-command dev setup |
| gscan | latest (npm -g) | Theme validation | Official Ghost tool; runs locally and CI before deploy |
| TryGhost/action-deploy-theme | v1 | GitHub Actions deploy | Official Ghost action; packages zip + calls Admin API |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Rollup | ^4.0.0 | JS/CSS bundler | Used by TryGhost/Starter; processes assets into assets/built/ |
| PostCSS | ^8.4.x | CSS processing | Works as Rollup plugin; enables postcss-preset-env and future CSS syntax |
| postcss-preset-env | latest | CSS transpilation | Converts modern CSS to browser-compatible output; required by CONTEXT.md |
| Babel | ^7.x | JS transpilation | Paired with Rollup in Starter; needed if writing modern JS |
| rollup-plugin-livereload | latest | Hot reload during dev | Watches assets/built/ and refreshes local Ghost tab |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Rollup | Gulp (Casper uses it) | Gulp is heavier; Starter dropped it for Rollup — prefer Starter pattern |
| ghost-cli local | Docker Ghost | Docker adds complexity without benefit for solo dev; ghost-cli is simpler |
| PostCSS | Sass/SCSS | Ghost themes don't require Sass; PostCSS + preset-env covers modern CSS needs |

**Installation (theme devDependencies):**
```bash
npm install --save-dev rollup @rollup/plugin-node-resolve rollup-plugin-postcss rollup-plugin-livereload rollup-plugin-terser @babel/core @babel/preset-env postcss postcss-preset-env
```

**Ghost CLI (global, for dev environment):**
```bash
npm install ghost-cli@latest -g
# Then in an empty directory:
ghost install local
```

**gscan (global, for validation):**
```bash
npm install -g gscan
```

---

## Architecture Patterns

### Recommended Project Structure
```
general-purpose/               # theme root (also git repo root)
├── .github/
│   └── workflows/
│       └── deploy-theme.yml   # TryGhost/action-deploy-theme
├── assets/
│   ├── css/
│   │   └── screen.css         # source CSS (PostCSS)
│   ├── js/
│   │   └── main.js            # source JS
│   └── built/                 # compiled output — referenced via {{asset}}
│       ├── screen.css
│       └── main.js
├── partials/                  # Handlebars partials
├── default.hbs                # base layout (required helpers here)
├── index.hbs                  # post list (required)
├── post.hbs                   # single post (required)
├── page.hbs                   # static page
├── error.hbs                  # error page (INFRA-02)
├── package.json               # required; name="general-purpose"
├── rollup.config.js           # build config
└── .gitignore
```

### Pattern 1: Required Helpers in default.hbs
**What:** Ghost requires specific Handlebars helpers to be present in default.hbs for the theme to pass gscan.
**When to use:** Always — these must be in every default.hbs.

```handlebars
<!DOCTYPE html>
<html lang="{{@site.locale}}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{meta_title}}</title>
    <link rel="stylesheet" type="text/css" href="{{asset "built/screen.css"}}" />
    {{ghost_head}}
</head>
<body class="{{body_class}}">
    {{{body}}}
    <script src="{{asset "built/main.js"}}"></script>
    {{ghost_foot}}
</body>
</html>
```

Required helpers verified:
- `{{ghost_head}}` — outputs metadata, scripts injected by Ghost Admin (REQUIRED, fatal if missing)
- `{{ghost_foot}}` — outputs scripts before `</body>` (REQUIRED, fatal if missing)
- `{{body_class}}` — provides page-specific CSS classes on `<body>` (REQUIRED by gscan)
- `{{post_class}}` — provides post-specific CSS classes on post wrapper (REQUIRED by gscan; used in post.hbs)
- `{{asset "path"}}` — correct asset URL regardless of Ghost install path (INFRA-01)

### Pattern 2: Asset Helper Usage
**What:** All static file references must go through `{{asset}}`, which resolves paths relative to the theme's `/assets/` directory.
**When to use:** Every CSS, JS, font, and image reference in .hbs files.

```handlebars
{{! Source: Ghost docs + TryGhost/Starter reference}}
<link rel="stylesheet" href="{{asset "built/screen.css"}}" />
<script src="{{asset "built/main.js"}}"></script>
<img src="{{asset "images/logo.svg"}}" alt="Logo" />
```

The path passed to `{{asset}}` is relative to `assets/`. So `{{asset "built/screen.css"}}` resolves to `<theme>/assets/built/screen.css`.

### Pattern 3: Minimal error.hbs
**What:** error.hbs must be a standalone HTML document — it cannot extend default.hbs or use `{{ghost_head}}`/`{{ghost_foot}}`. Only `{{asset}}` is permitted (except error-404.hbs which can use full theme helpers).
**When to use:** Required for INFRA-02.

```handlebars
{{!-- Keep minimal. Do NOT use ghost_head, ghost_foot, or extends. --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{statusCode}} {{message}}</title>
    <link rel="stylesheet" type="text/css" href="{{asset "built/screen.css"}}" />
</head>
<body class="error-template">
    <h1>{{statusCode}}</h1>
    <p>{{message}}</p>
    <a href="{{@site.url}}">Go to homepage</a>
</body>
</html>
```

Available in error context: `{{statusCode}}`, `{{message}}`, `{{errorDetails}}`.

### Pattern 4: GitHub Actions Deploy Workflow
**What:** The standard workflow file that configures automated deploys via Ghost Admin API.
**When to use:** Create immediately; will be inert until Creator plan is active and secrets are configured.

```yaml
# Source: https://github.com/TryGhost/action-deploy-theme README
name: Deploy Theme
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Ghost Theme
        uses: TryGhost/action-deploy-theme@v1
        with:
          api-url: ${{ secrets.GHOST_ADMIN_API_URL }}
          api-key: ${{ secrets.GHOST_ADMIN_API_KEY }}
```

Secrets must be set in GitHub repo Settings → Secrets and variables → Actions:
- `GHOST_ADMIN_API_URL` — from Ghost Admin → Integrations → Custom Integration
- `GHOST_ADMIN_API_KEY` — from same integration

### Pattern 5: package.json Required Fields
**What:** gscan validates package.json and requires specific fields.

```json
{
  "name": "general-purpose",
  "description": "Jess Holbrook's personal site theme",
  "version": "1.0.0",
  "license": "MIT",
  "author": {
    "name": "Jess Holbrook",
    "email": ""
  },
  "engines": {
    "ghost": ">=6.0.0"
  },
  "config": {
    "posts_per_page": 15,
    "image_sizes": {},
    "card_assets": true
  },
  "type": "module",
  "scripts": {
    "dev": "rollup -c --environment BUILD:development -w",
    "build": "rollup -c --environment BUILD:production",
    "zip": "npm run build && bestzip $npm_package_name.zip assets/ *.hbs partials/ package.json",
    "test": "gscan --verbose .",
    "pretest": "npm run build"
  }
}
```

The `name` field "general-purpose" is locked. The `engines.ghost` field signals Ghost 6 compatibility to gscan.

### Anti-Patterns to Avoid
- **Hardcoded relative asset paths:** `<link href="assets/built/screen.css">` breaks on subdirectory installs. Always use `{{asset}}`.
- **Using ghost_head/ghost_foot in error.hbs:** Ghost docs explicitly warn this causes misleading error reports. error.hbs must be standalone.
- **Extending default.hbs from error.hbs:** Same issue — error.hbs must be a complete standalone HTML document.
- **Missing `{{{body}}}` (triple-stash) in default.hbs:** Using `{{body}}` (double) will HTML-escape the injected content, breaking all templates.
- **Committing assets/built/ to git:** Built files are generated artifacts; add to .gitignore and let the deploy action build them.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme validation | Custom lint scripts | `gscan` | Knows all Ghost-version-specific rules; updated with each Ghost release |
| Theme packaging/zip | Manual zip commands | `TryGhost/action-deploy-theme@v1` | Handles zip, upload, and activation atomically via Admin API |
| CSS transpilation | Manual prefix scripts | PostCSS + postcss-preset-env | Handles browser prefixing, polyfills, and future CSS syntax |
| Local Ghost instance | Mock server | `ghost install local` via ghost-cli | Full real Ghost with SQLite; matches production behavior exactly |

**Key insight:** Ghost's official toolchain (gscan, action-deploy-theme, ghost-cli) handles all the brittle integration points. The theme itself only needs correct Handlebars templates — the tools handle everything else.

---

## Common Pitfalls

### Pitfall 1: Missing Required Helpers Causes Fatal gscan Errors
**What goes wrong:** gscan reports fatal errors; theme cannot be activated in Ghost Admin.
**Why it happens:** Forgetting `{{ghost_head}}`, `{{ghost_foot}}`, `{{body_class}}`, or `{{post_class}}` — especially `{{post_class}}` which is needed in post.hbs, not default.hbs.
**How to avoid:** Run `npm test` (which runs gscan) before every commit.
**Warning signs:** gscan output shows "Error" (not Warning) entries.

### Pitfall 2: Node Version Mismatch
**What goes wrong:** `ghost install local` fails or Ghost won't start.
**Why it happens:** Ghost 6 requires Node 22. Ghost 5 required Node 18. Running the wrong Node version causes a hard CLI error.
**How to avoid:** Verify `node --version` before installing. Use nvm to switch: `nvm use 22`.
**Warning signs:** ghost-cli prints "Incompatible Node version" on install.

### Pitfall 3: Deploy Action Silently Does Nothing Until Secrets Are Configured
**What goes wrong:** GitHub Action runs but logs authentication errors or does nothing visible.
**Why it happens:** `GHOST_ADMIN_API_URL` and `GHOST_ADMIN_API_KEY` secrets aren't set yet (Creator plan not active).
**How to avoid:** This is expected behavior per locked decision. The workflow file is correct; it just needs secrets when plan is upgraded.
**Warning signs:** Action step logs "401 Unauthorized" or "missing secret" — this is expected until plan upgrade.

### Pitfall 4: AMP Templates Trigger gscan Warnings in Ghost 6
**What goes wrong:** gscan reports warnings about AMP (Accelerated Mobile Pages) files.
**Why it happens:** AMP was deprecated in Ghost 6. If amp.hbs exists, gscan warns about it.
**How to avoid:** Don't create amp.hbs. If migrating an older theme, delete it.
**Warning signs:** gscan output mentions "amp" deprecation.

### Pitfall 5: Local Theme Not Appearing in Ghost Admin
**What goes wrong:** After setting up local Ghost, the custom theme isn't available to activate.
**Why it happens:** The theme folder must be inside `<ghost-install>/content/themes/` or symlinked there.
**How to avoid:** Create a symlink: `ln -s /path/to/general-purpose <ghost-install>/content/themes/general-purpose`, then restart Ghost.
**Warning signs:** Only "Casper" appears in Themes settings; custom theme is missing.

---

## Code Examples

### gscan CLI Usage
```bash
# Source: https://github.com/TryGhost/gscan + https://docs.ghost.org/themes/gscan
# Run against theme folder (during development)
gscan --verbose /path/to/general-purpose

# Run against zip (pre-deploy)
gscan -z general-purpose.zip

# Via npm test (using package.json script)
npm test
```

### Local Dev Environment Setup
```bash
# Source: https://docs.ghost.org/install/local
# Install ghost-cli globally
npm install ghost-cli@latest -g

# Create a dev directory (separate from theme)
mkdir ~/ghost-dev && cd ~/ghost-dev
ghost install local
# Ghost runs at http://localhost:2368
# Admin at http://localhost:2368/ghost

# Symlink theme for live development
ln -s /path/to/general-purpose ~/ghost-dev/content/themes/general-purpose
ghost restart

# Activate in admin: Settings → Design → Change theme → Advanced → Activate
```

### Rollup Config for Ghost Theme
```js
// Source: Modeled on TryGhost/Starter rollup.config.js pattern
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const isProduction = process.env.BUILD === 'production';

export default {
  input: 'assets/js/main.js',
  output: {
    file: 'assets/built/main.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    postcss({
      extract: 'assets/built/screen.css',
      minimize: isProduction,
    }),
    !isProduction && livereload({ watch: 'assets/built' }),
    isProduction && terser(),
  ].filter(Boolean),
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Gulp-based build (Casper) | Rollup-based build (Starter) | ~2022 | Starter is now the canonical reference; Gulp still works but Rollup is lighter |
| AMP support (amp.hbs) | Removed | Ghost 6.0 | Don't create amp.hbs; gscan warns if present |
| Node 18 | Node 22 (required by Ghost 6) | Ghost 6.0 (2024) | Incompatible — must use Node 22 for Ghost 6 |
| Manual zip upload | GitHub Actions + Admin API | Available since Ghost 4+ | Fully automated; no manual steps needed |

**Deprecated/outdated:**
- `amp.hbs`: Removed in Ghost 6; gscan warns about it
- Node 18 for Ghost 6: Not supported; Ghost 6 requires Node 22
- Hardcoded asset paths (no `{{asset}}`): Always broken on subdirectory installs

---

## Open Questions

1. **Does gscan `--verbose` flag exist or is the correct flag different?**
   - What we know: gscan accepts path and `-z` flag for zip mode
   - What's unclear: Exact CLI flags for verbose output
   - Recommendation: Run `gscan --help` after install to confirm; use `gscan .` for folder scan

2. **Does the deploy action require the theme name in package.json to match exactly, or does it use the `name` input override?**
   - What we know: Action has an optional `theme-name` input that overrides package.json name
   - What's unclear: Whether `name: "general-purpose"` in package.json is sufficient without the override
   - Recommendation: Leave package.json name as "general-purpose" (locked) and do not set `theme-name` input; they should match

3. **Ghost Starter uses `"type": "module"` in package.json — does this affect Handlebars template parsing?**
   - What we know: `"type": "module"` only affects Node.js module resolution for .js files, not .hbs files
   - What's unclear: Whether ghost-cli local install has any quirks with ES module themes
   - Recommendation: Follow Starter's pattern exactly; include `"type": "module"` since Rollup config uses ESM syntax

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | gscan (CLI tool, not a unit test framework) |
| Config file | None — gscan reads theme files directly |
| Quick run command | `npm test` (runs `gscan --verbose .` via pretest+test scripts) |
| Full suite command | `npm test` (same; gscan covers all theme validation) |

Note: This phase has no JavaScript logic to unit test. Validation is structural — correct files, correct helpers, correct package.json. gscan IS the test suite for this phase.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | gscan reports zero fatal errors | structural | `npm test` (gscan) | ❌ Wave 0 |
| FOUND-02 | GitHub Actions workflow file present and syntactically valid | smoke | `cat .github/workflows/deploy-theme.yml` + yaml lint | ❌ Wave 0 |
| INFRA-01 | No hardcoded asset paths (grep check) | structural | `grep -r "href=\"assets\|src=\"assets" *.hbs` exits nonzero | ❌ Wave 0 |
| INFRA-02 | error.hbs renders without extending default.hbs | structural | `npm test` (gscan catches invalid helper usage) | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test` (gscan against theme folder)
- **Per wave merge:** `npm test` + manual local Ghost activation check
- **Phase gate:** Zero gscan fatal errors + GitHub Actions workflow YAML valid before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `package.json` with `test` script pointing to gscan — covers FOUND-01
- [ ] `rollup.config.js` — needed before `pretest` build step runs
- [ ] Node 22 confirmed in dev environment before scaffold work begins

*(No traditional test files needed — gscan is the validator for this phase)*

---

## Sources

### Primary (HIGH confidence)
- [docs.ghost.org/themes/structure](https://docs.ghost.org/themes/structure) — required files (index.hbs, post.hbs, package.json), helper requirements
- [docs.ghost.org/themes/contexts/error](https://docs.ghost.org/themes/contexts/error) — error.hbs constraints, available data, helper restrictions
- [TryGhost/action-deploy-theme README](https://github.com/TryGhost/action-deploy-theme/blob/main/README.md) — exact workflow YAML, required secrets
- [TryGhost/Starter](https://github.com/TryGhost/Starter) — canonical file structure, build tooling, package.json fields
- [docs.ghost.org/install/local](https://docs.ghost.org/install/local) — ghost-cli install commands, local dev setup

### Secondary (MEDIUM confidence)
- [Ghost Node 22 support](https://ghost.ostreff.info/ghost-cms-now-supports-node-js-22/) — Ghost 6 requires Node 22, confirmed by multiple forum posts
- [TryGhost/Massively error.hbs](https://github.com/TryGhost/Massively/blob/main/error.hbs) — reference implementation of standalone error template
- [ghost.org/integrations/github](https://ghost.org/integrations/github/) — secrets setup steps for deploy integration

### Tertiary (LOW confidence)
- Various Ghost forum posts about Node 22 compatibility — cross-verified with Node docs above

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Ghost official docs + TryGhost/Starter reference implementation
- Architecture: HIGH — Required files from official docs; helper requirements from gscan docs
- Pitfalls: HIGH — Node version constraint from official sources; other pitfalls from official docs behavior descriptions

**Research date:** 2026-03-23
**Valid until:** 2026-09-23 (stable Ghost theme API; recheck if Ghost 7 is announced)
