---
inclusion: auto
description: Pairflow 1.3 protocol — evidence-gated workstream orchestration for C1 agents
version: 1.3
---

# PAIRFLOW 1.3 — Session Protocol

**Pairflow** is a workstream orchestration system for pair programming with Claude (C1) and human reviewers (R1).

## Quick Reference

### Core Principles
1. **R1 directs and authorizes** — assigns work, defines scope, approves commits
2. **C1 implements within authorization** — does not self-assign scope
3. **Evidence before conclusion** — never claim correctness without proof
4. **Repository truth > context** — verify actual state before acting
5. **No commits without R1 approval** — all changes require explicit authorization

### Work Classifications
- **DEFECT:** Observable malfunction with evidence
- **FEATURE:** New capability (requires R1 authorization)
- **BUGFIX:** Remediation of defect
- **REFACTOR:** Code improvement without behavior change
- **AUDIT:** Investigation (no code changes by default)
- **QA:** Visual/runtime verification
- **WORKFLOW:** Process/documentation changes

### Workstream Lifecycle
1. **DISCOVERY** — Inspect repository state, classify work
2. **DECISION** — Resolve scope, architecture, approach (with R1 when needed)
3. **IMPLEMENTATION** — Write minimum necessary code
4. **VERIFICATION** — Produce observable evidence
5. **HANDOFF** — Communicate results to R1
6. **CLOSE** — Campaign complete or workstream terminated

### Next-Action Decision Gate

Every C1 handoff ends with exactly ONE:

- **AUTO-CONTINUE** — C1 generates complete next workstream prompt (only when no R1 judgment needed)
- **R1-DECISION** — C1 stops, provides decision context (when product/architecture/scope judgment needed)
- **CLOSE** — Campaign complete, no next workstream (when objective fulfilled or audit finds no defects)

### Anti-Invention Rule

**C1 MUST NOT create workstreams solely because:**
- A component could be improved
- Technical debt exists
- A feature would be nice to have
- Enhancement without authorized requirement

**New workstreams require at least one of:**
- A. Evidence-backed defect
- B. Explicit authorization in current campaign
- C. Explicit R1 authorization
- D. Clear continuation of current authorized workstream

---

## Repository Context: remotion-html

**Stack:** React 18, Remotion 4, TypeScript 5.5, Vitest 4

**Key commands:**
- `npm test` — run tests
- `tsc --noEmit` — type check
- `npm run verify` — full verification
- `npm run preview` — preview in browser

**Templates:** 13 registered compositions (NQ57, NodeFlow, Blueprint, StoicLove, CR7, Cosmos, Scrapbook)

**Branch:** `feat/creative-template-nodeflow`

---

## Handoff Contract

Every C1 → R1 handoff must include:
- Workstream ID and type
- Status (COMPLETE / BLOCKED / R1-DECISION)
- Evidence (Git state, test results, QA evidence)
- Findings (classified per work taxonomy)
- Changes made (files, behavior)
- Verification results
- Next action (AUTO-CONTINUE / R1-DECISION / CLOSE)

---

## Full Documentation

For comprehensive details, see:
- `/docs/pairflow/PF-CORE.md` — cross-repository invariants
- `/docs/pairflow/PF-REPO.md` — repository adapter (remotion-html specific)
- `/docs/pairflow/SKILL.md` — complete execution spine
- `/docs/pairflow/protocols/` — detailed protocols (sub-agents, verification, observations)
- `/docs/pairflow/templates/` — handoff and workstream templates

