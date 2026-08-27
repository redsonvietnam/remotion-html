# Sub-agent Protocol

## When to Spawn

Spawn sub-agents when:
- Architecture is complex and parallel exploration saves time
- Multiple independent investigation paths exist
- Review/audit requires a second perspective
- Browser QA can run in parallel with code review

Do NOT spawn when:
- Task is simple enough for single-agent execution
- Sub-agent would duplicate work C1 can do directly
- No clear value-add over direct investigation

## Agent Types

### Agent A — Explorer

**Purpose:** Trace architecture, data flow, caller/consumer patterns.

**Input:** Symbol names, file paths, or concept descriptions.

**Output format:**
```
FINDINGS:
- <finding with evidence>

EVIDENCE:
- <file:line references>

RISKS:
- <identified risks>

RECOMMENDATION:
- <recommendation>
```

**Constraints:**
- Read-only access
- No code changes
- No scope expansion
- Report stale context as STALE/NOT FOUND

### Agent B — Reviewer

**Purpose:** Identify regression surface, boundary violations, hidden coupling.

**Input:** Proposed changes or symbols to modify.

**Output format:** Same as Agent A.

**Constraints:**
- Does not implement fixes
- Challenges assumptions with evidence
- Reports security/auth implications

### Agent C — QA

**Purpose:** Design test scenarios, verify runtime behavior, check edge cases.

**Input:** Feature description or changed files.

**Output format:**
```
FINDINGS:
- <test scenario with expected vs actual>

EVIDENCE:
- <runtime output, screenshots, API responses>

RISKS:
- <uncovered scenarios>

RECOMMENDATION:
- <additional tests or fixes needed>
```

**Constraints:**
- Does not modify test code
- Reports visual/behavioral evidence
- Does not claim PASS without evidence

## Reconciliation

When agents conflict:
1. Collect all findings
2. Identify the specific disagreement
3. Determine which finding has stronger evidence
4. C1 makes final judgment
5. Record the reconciliation in the handoff

## Anti-patterns

- Spawning agents for trivial tasks
- Treating agent output as authoritative without C1 review
- Letting agents expand scope
- Skipping agent findings without evidence-based reason
- Running agents sequentially when parallel is safe
