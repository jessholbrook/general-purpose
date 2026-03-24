---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | gscan (Ghost theme validator) + shell assertions |
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
| 01-01-01 | 01 | 1 | FOUND-01 | validation | `npx gscan .` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | INFRA-01 | validation | `npx gscan .` (checks asset helpers) | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | INFRA-02 | validation | `npx gscan .` (checks error.hbs) | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUND-02 | file check | `test -f .github/workflows/deploy-theme.yml` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — gscan as devDependency for local validation
- [ ] Theme scaffold files — minimum required by Ghost 6

*gscan itself IS the test framework for Ghost themes — no separate test runner needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Error page renders on 404 | INFRA-02 | Requires running Ghost instance to trigger 404 | Visit non-existent URL on local Ghost, verify error.hbs renders |
| Deploy automation works | FOUND-02 | Requires Creator plan + GitHub secrets | Push to main, verify GitHub Action runs (will fail until plan upgrade — expected) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
