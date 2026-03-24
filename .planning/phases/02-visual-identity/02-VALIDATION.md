---
phase: 2
slug: visual-identity
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | gscan + browser visual inspection |
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
| 02-01-01 | 01 | 1 | VIS-01, VIS-02 | validation | `npx gscan . && grep -q "custom-property" assets/css/screen.css` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | VIS-03 | validation | `npx gscan . && grep -q "Lora" default.hbs` | ✅ | ⬜ pending |
| 02-01-03 | 01 | 1 | FOUND-03 | validation | `npx gscan . && grep -q "sidebar" default.hbs` | ✅ | ⬜ pending |
| 02-01-04 | 01 | 1 | VIS-04 | validation | `npx gscan . && grep -q "data-theme" default.hbs` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (gscan already installed from Phase 1)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Warm cream background visible | VIS-01 | Requires browser rendering | Open local Ghost, verify cream background on any page |
| Serif fonts render correctly | VIS-03 | Requires font loading + rendering | Open local Ghost, inspect font-family in DevTools |
| Sidebar persistent on desktop | FOUND-03 | Requires browser viewport | Open local Ghost at >768px, verify sidebar column |
| Sidebar collapses to top bar | FOUND-03 | Requires mobile viewport | Open local Ghost at <768px, verify horizontal nav |
| Dark mode toggle works | VIS-04 | Requires JS interaction | Click toggle, verify dark palette applies without FOUC |
| No hardcoded hex values | VIS-02 | Requires CSS audit | `grep -rn '#[0-9a-fA-F]' assets/css/screen.css` should only show var() declarations |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
