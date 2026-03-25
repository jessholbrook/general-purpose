---
phase: 3
slug: homepage-and-blog
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 3 — Validation Strategy

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
| 03-01-01 | 01 | 1 | HOME-01, HOME-02 | validation | `npx gscan . && test -f home.hbs` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | BLOG-01, BLOG-03 | validation | `npx gscan . && test -f partials/post-card.hbs` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | BLOG-02 | validation | `npx gscan . && grep -q "reading_time" post.hbs` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (gscan already installed from Phase 1)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Homepage served from home.hbs at / | HOME-01 | Requires routes.yaml upload to Ghost Admin | Upload routes.yaml via Ghost Admin → Labs → Routes, visit / |
| Blog at /blog/ shows posts reverse-chrono | BLOG-01 | Requires Ghost instance with posts | Visit /blog/ on local Ghost with test posts |
| Post cards show thumbnail, title, excerpt, date | BLOG-03 | Requires visual inspection | Visit /blog/, verify card layout |
| Reading time displayed on post pages | BLOG-02 | Requires Ghost instance | Open a post, verify reading time appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
