---
phase: 4
slug: section-pages-and-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | gscan + file existence checks |
| **Config file** | package.json (gscan as devDependency) |
| **Quick run command** | `npx gscan .` |
| **Full suite command** | `npx gscan . --verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx gscan .`
- **After every plan wave:** Run `npx gscan . --verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | SECT-01 | validation | `test -f page-publications.hbs && npx gscan .` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | SECT-02 | validation | `test -f page-products.hbs && npx gscan .` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | SECT-03 | validation | `test -f page-experiments.hbs && npx gscan .` | ❌ W0 | ⬜ pending |
| 04-01-04 | 01 | 1 | ABOUT-01 | validation | `test -f page-about.hbs && npx gscan .` | ❌ W0 | ⬜ pending |
| 04-01-05 | 01 | 1 | INFRA-03 | validation | `grep -q "is-active" partials/navigation.hbs` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (gscan already installed)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Publications shows papers with title/venue/year/link | SECT-01 | Requires Ghost with page slug "publications" | Create page, visit /publications/ |
| Product cards render correctly | SECT-02 | Requires visual inspection | Create page, visit /products/ |
| Experiment cards link externally | SECT-03 | Requires click testing | Visit /experiments/, click links |
| About page shows bio + photo | ABOUT-01 | Requires feature image upload | Upload photo as page feature image |
| Active nav state highlights current page | INFRA-03 | Requires navigation + page visit | Visit each section, verify sidebar highlight |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
