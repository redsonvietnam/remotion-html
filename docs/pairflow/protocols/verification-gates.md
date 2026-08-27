# Verification Gates

## Gate Matrix

Every workstream must pass all applicable gates before commit.

| Gate | FEATURE | BUGFIX | REFACTOR | AUDIT | QA | WORKFLOW | DOCS |
|------|---------|--------|----------|-------|-----|----------|------|
| Tests pass | Required | Required | Required | N/A | N/A | If exists | N/A |
| Lint clean | Required | Required | Required | N/A | N/A | If exists | N/A |
| Typecheck clean | Required | Required | Required | N/A | N/A | If exists | N/A |
| Build pass | Required | Required | Required | N/A | N/A | If exists | N/A |
| E2E pass | If exists | If exists | If exists | N/A | N/A | N/A | N/A |
| Browser QA | Required | If UI | Rarely | N/A | **Required** | N/A | N/A |
| API QA | Required | If API | Rarely | N/A | N/A | N/A | N/A |
| Diff review | Required | Required | Required | Required | Required | Required | Required |
| **No-defect result** | N/A | N/A | N/A | **CLOSE** | **CLOSE** | N/A | N/A |

## Verification Levels

### Level 1 — Static
- Tests pass
- Lint clean
- Typecheck clean
- Build successful

### Level 2 — Regression
- All existing tests still pass
- No behavior changes beyond scope
- E2E flow intact

### Level 3 — Runtime
- App starts without errors
- Feature works at runtime
- API responses correct
- UI renders correctly

### Level 4 — Boundary
- Stored value → API value → UI value chain correct
- Auth boundaries respected
- Data validation at boundaries
- PII/redaction working

### Level 5 — Evidence
- Browser QA scenarios documented with evidence
- API responses captured
- Screenshots for visual changes
- Console errors checked

## Anti-patterns

- Claiming "tests pass" as sole evidence for UI features
- Skipping browser QA for user-facing changes
- Not checking for console errors
- Assuming build success means runtime correctness
- Running only Level 1 checks for Level 4 requirements
