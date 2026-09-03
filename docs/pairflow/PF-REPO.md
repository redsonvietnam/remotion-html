# PF-REPO — remotion-html Repository Adapter

**REPOSITORY_PF_VERSION:** 1.3
**PF_CORE_VERSION:** 1.0

This document contains repository-specific information for `remotion-html`. It adapts PF-CORE invariants to this repository's stack, commands, and conventions.

---

## Stack

| Component | Version |
|-----------|---------|
| React | 18.3.1 |
| Remotion | 4.0.471 |
| TypeScript | 5.5.4 |
| Vitest | 4.1.11 |
| Node.js | Runtime |

---

## Commands

| Action | Command |
|--------|---------|
| Test | `npm test` |
| Type-check | `tsc --noEmit` |
| Verify (full) | `npm run verify` |
| Preview | `npm run preview` |
| Studio | `npm run studio` |
| Export | `npm run export` |
| Render | `npm run render` |
| Dev | `npm run dev` |

**No lint script configured.** Linting is not a required gate for this repository.

---

## Source Layout

```
src/
├── Root.tsx              # Composition registration
├── index.ts              # Entry point
├── templates/            # Video templates (NQ57, NodeFlow, CR7, Cosmos, Scrapbook, etc.)
├── data/                 # Production data (championsLeague, contract)
├── components/           # Shared UI components
└── __tests__/            # Repository-level tests

preview/
├── creator.html          # Creator Shell
├── editor.html           # Composer UI
└── library.html          # Template Library

scripts/                  # Build/export scripts
docs/                     # Documentation including pairflow/
```

---

## Branch Conventions

- Primary branch: `feat/creative-template-nodeflow`
- Feature branches: `feat/<feature-name>`
- Fix branches: `fix/<fix-name>`

---

## Verification Adaptation

This repository adapts PF-CORE verification principles as follows:

| WS Type | Verification | Commands |
|---------|-------------|----------|
| FEATURE | Tests + typecheck + runtime | `npm test`, `tsc --noEmit`, `npm run verify` |
| BUGFIX | Repro + fix + regression | `npm test`, `tsc --noEmit` |
| REFACTOR | Regression | `npm test`, `tsc --noEmit` |
| AUDIT | Evidence/discovery | Read-only; no code changes |
| QA | Visual/runtime evidence | Browser QA via Chrome DevTools |
| WORKFLOW | Artifact validation | Manual inspection |

---

## Browser QA

Browser QA is available via Chrome DevTools MCP tools:
- `chromedevtools_take_screenshot` — visual evidence
- `chromedevtools_take_snapshot` — DOM inspection
- `chromedevtools_evaluate_script` — runtime verification
- `chromedevtools_list_console_messages` — error checking

---

## Templates

Registered compositions (13 total):
- NQ57 (5 compositions, 16:9 only)
- NodeFlow (1 composition, 16:9 only)
- Blueprint (1 composition, 16:9 only)
- StoicLove (1 composition, 9:16 native)
- CR7 (2 compositions, 16:9 + portrait fixed)
- Cosmos (1 composition, 16:9 + portrait fixed)
- Scrapbook (2 compositions, 16:9 + 9:16 portrait fixed)

---

## Historical Workstreams

| ID | Type | Status | Commit |
|----|------|--------|--------|
| WS-TEMPLATE-LIBRARY-01 | FEATURE | COMPLETE | b68741c |
| WS-CREATOR-SHELL-01 | FEATURE | COMPLETE | d91b595 |
| WS-CREATOR-EDITOR-01/02 | FEATURE | COMPLETE | 0aa6dbd |
| WS-COMPOSER-01 | FEATURE | COMPLETE | b2c978f, 0d90a3d, d413f08 |
| WS-EXPORT-01 | FEATURE | COMPLETE | 5095d8f |
| WS-CR7-PORTRAIT-01 | BUGFIX | COMPLETE | 55ef0b9 |
| WS-COSMOS-PORTRAIT-01 | BUGFIX | COMPLETE | 7ff0b6e |
| WS-SCRAPBOOK-PORTRAIT-01 | BUGFIX | COMPLETE | 8915a77 |
| WS-SCRAPBOOK-PORTRAIT-02 | AUDIT | COMPLETE | (no code change) |
| WS-VISUAL-QA-03 | AUDIT | COMPLETE | (no code change) |
| PF-IMPROVEMENT-02 | WORKFLOW | COMPLETE | (no code change) |
| PF-IMPROVEMENT-03 | WORKFLOW | COMPLETE | (no code change) |
| PF-IMPROVEMENT-04 | WORKFLOW | COMPLETE | ee8000f |
| PF-SYNC-01 | AUDIT | COMPLETE | (no code change) |
| PF-SYNC-03 | AUDIT | COMPLETE | (no code change) |
| PF-XR-01 | AUDIT | COMPLETE | (no code change) |
