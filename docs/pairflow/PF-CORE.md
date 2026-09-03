# PF-CORE — Cross-Repository Invariants

**PF_CORE_VERSION:** 1.0

This document contains only rules validated across multiple repositories. Repository-specific implementations adapt these invariants to local context.

---

## Authority

- **R1 directs and authorizes.** R1 assigns work, defines scope, approves commits, and resolves decisions.
- **C1 implements within authorization.** C1 executes, verifies, and hands off. C1 does not self-assign scope.
- **C1 cannot silently expand scope.** If scope must expand, C1 stops and requests R1 authorization.
- **Sub-agents provide evidence, not authority.** Agent findings inform C1's judgment. C1 reconciles conflicts.

---

## Evidence-First Discovery

- **Evidence before conclusion.** Never claim correctness without evidence.
- **Inspect real repository state.** Use Git, file reads, and runtime verification — not assumptions.
- **Challenge assumptions.** If a referenced file/feature might not exist, verify it exists before using it.
- **Unknown remains Unknown.** If evidence is insufficient, classify as UNKNOWN and report to R1. Do not infer missing context.

---

## Work Classification

Core recognizes these semantic categories. Repository-specific taxonomies may use different names but must map cleanly to these concepts:

| Core Category | Definition |
|--------------|-----------|
| DEFECT | Observable user-visible malfunction with evidence |
| OBSERVATION | Evidence-backed fact, not itself a defect |
| UNKNOWN | Evidence insufficient to determine behavior |
| CAPABILITY_GAP | Desired capability does not currently exist |
| ENHANCEMENT | Improvement without existing malfunction |
| SCOPE_EXPANSION | Addition beyond currently authorized scope |
| R1-DECISION | Requires explicit R1 judgment |

---

## Workstream Lifecycle

Every workstream progresses through these semantic phases. Repository-specific phase names and numbering may differ:

1. **DISCOVERY** — Inspect repository state, classify work, establish baseline
2. **DECISION** — Resolve scope, architecture, and approach choices (with R1 when required)
3. **IMPLEMENTATION** — Write minimum code necessary, follow existing patterns
4. **VERIFICATION** — Produce observable evidence appropriate to workstream type
5. **HANDOFF** — Communicate results, findings, and next action to R1
6. **CLOSE** — Campaign complete or workstream terminated

---

## Decision Gates

R1 authorization is required whenever the work involves:

- Product intent or business logic
- Architecture changes or new frameworks
- Scope expansion beyond current authorization
- Capability addition or feature introduction
- Unresolved ambiguity requiring human judgment
- Destructive operations (force-push, history rewrite, data deletion)

---

## Verification

**Principle:** Verification must produce observable evidence appropriate to the workstream type.

- FEATURE/BUGFIX: Tests, runtime verification, browser QA if UI
- AUDIT/QA: Evidence and discovery; no-defect result is a valid CLOSE
- REFACTOR: Regression emphasis
- WORKFLOW: Artifact validation

Repository-specific commands (npm test, cargo test, go test, etc.) belong in the repository adapter, not in Core.

---

## State Separation

Three distinct state layers:

| Layer | Source of Truth | Purpose |
|-------|----------------|---------|
| Repository State | Git | HEAD, branch, working tree, commits |
| Workflow State | PF documentation | Current workstream, phase, campaign, blockers |
| Code/Change State | Git + working tree | Modified files, staged changes, test results |

**Git is authoritative for repository state.** PF workflow state should not duplicate Git state unless recording historical evidence.

---

## Next-Action State Machine

Every C1 handoff must terminate with exactly one:

```
AUTO-CONTINUE | R1-DECISION | CLOSE
```

### AUTO-CONTINUE

C1 generates the complete next-WS prompt. R1 should not need to rewrite it.

**Permitted only when ALL are true:**
1. Evidence-backed next workstream exists
2. Same authorized campaign
3. Same authorized scope
4. No product decision required
5. No architecture-boundary change
6. Acceptance criteria are determinable

Otherwise → R1-DECISION

### R1-DECISION

C1 stops and requests explicit R1 judgment.

**Required when ANY of the following:**
1. Product/architecture/scope/policy judgment needed
2. Feature expansion or capability addition
3. Multiple valid approaches require R1 selection
4. Authorization boundary reached
5. Destructive operation

**C1 must provide:** Evidence, options, rationale, recommendation.

### CLOSE

C1 stops without inventing work.

**Valid when:**
1. No evidence-backed next workstream exists
2. Audit/QA completed with no A-class findings
3. Campaign objective is fulfilled
4. Remaining candidates are ENHANCEMENT or SCOPE_EXPANSION

---

## Campaign

A **campaign** is a bounded grouping of related workstreams authorized by R1.

- AUTO-CONTINUE may occur **inside the authorized campaign**
- Crossing campaign/scope boundaries requires R1-DECISION
- Campaigns have explicit objectives; when objective is met, campaign CLOSEs

---

## Anti-Invention

**C1 MUST NOT create a workstream solely because:**
- A component could be improved
- Technical debt exists
- Hardcoded values exist
- Architecture could theoretically be cleaner
- An enhancement would be nice to have
- A feature is missing but has no authorized requirement

**A new workstream requires at least one of:**
A. Evidence-backed defect requiring remediation
B. Explicitly authorized campaign scope
C. Explicit R1 authorization
D. Clearly defined continuation of current authorized workstream/campaign

---

## Observation Lifecycle

Observations must progress through defined stages before becoming PF changes:

```
OBSERVED → REPEATED → CONFIRMED → PROPOSED → APPROVED → IMPLEMENTED → VALIDATED
```

| Stage | Definition | Promotion Rule |
|-------|-----------|---------------|
| OBSERVED | Single occurrence noted | Record only; do not propose PF change |
| REPEATED | Same friction in 2+ independent workstreams | May classify as CORE candidate |
| CONFIRMED | Impact measured, evidence-backed | Ready for PROPOSED |
| PROPOSED | Specific wording drafted, rationale provided | Requires R1 review |
| APPROVED | R1 explicitly authorizes change | Ready for IMPLEMENTED |
| IMPLEMENTED | PF document modified, version bumped | Ready for VALIDATED |
| VALIDATED | Next workstream confirms friction resolved | COMPLETE |

---

## Handoff Contract

C1 → R1 handoff must communicate:

- Workstream identifier and type
- Status (COMPLETE / BLOCKED / R1-DECISION)
- Evidence (Git state, verification results, QA evidence)
- Findings (with classification)
- Changes made (files, behavior)
- Verification results
- Decision required (if any)
- Next action (AUTO-CONTINUE / R1-DECISION / CLOSE)
- STOP condition (if applicable)

Exact field names may remain repository-specific if semantics are preserved.

---

## Commit Rules

- Never commit without R1 authorization
- Never force-push
- Never rewrite history
- One focused commit per workstream
- Verify remote HEAD after push
