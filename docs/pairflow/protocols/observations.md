# PF Observation System

## Purpose

Record genuinely new workflow friction discovered during workstream execution. Observations feed PF evolution — they are not action items for the current workstream.

## Format

```
ID: <sequential number>
PHASE: <phase where observation occurred>
PROBLEM: <what went wrong or was friction>
EVIDENCE: <concrete evidence — file, output, behavior>
IMPACT: <how it affected the workstream>
PROPOSED IMPROVEMENT: <specific suggestion>
CLASSIFICATION: CORE | PROJECT | OPTIONAL
CONFIDENCE: HIGH | MEDIUM | LOW
```

## Classification

- **CORE** — Fundamental workflow friction that affects any repository. Candidate for PF version evolution.
- **PROJECT** — Friction specific to this repository's setup. Record but don't propose PF changes.
- **OPTIONAL** — Nice-to-have improvement. Record for future consideration.

## Rules

1. **C1 does not modify PF Core** during product workstreams. Record observations only.
2. **R1 decides** whether to promote observations to new PF versions.
3. **Evidence required.** Every observation must include concrete evidence.
4. **No scope expansion.** Observations don't change the current workstream scope.
5. **Genuine friction only.** Don't record theoretical concerns — only observed problems.

## examples

### Valid CORE observation
```
ID: 1
PHASE: Phase 1 — Project Match
PROBLEM: Auth fetch and data fetch ran as separate effects, causing timing issues
  where restoration couldn't access user identity before it was loaded.
EVIDENCE: Page component had separate useEffect for auth and data fetching,
  with a third effect needing user from auth store.
IMPACT: Required merging into single init() effect to avoid setState-in-effect
  lint error and timing dependency.
PROPOSED IMPROVATION: PF should recommend single init effect for auth-dependent
  data fetching patterns.
CLASSIFICATION: CORE
CONFIDENCE: HIGH
```

### Valid PROJECT observation
```
ID: 2
PHASE: Phase 6 — Implement
PROBLEM: HTTP client's delete method does not support request body parameter.
EVIDENCE: Client library source — delete method omits body from request options.
IMPACT: Had to use fetch() directly for DELETE-with-body instead of the client.
PROPOSED IMPROVATION: None for PF — this is repository-specific.
CLASSIFICATION: PROJECT
CONFIDENCE: HIGH
```

## Storage

Observations are recorded in the workstream handoff under "PF OBSERVATIONS" section. They are not stored in a separate file unless R1 requests it.
