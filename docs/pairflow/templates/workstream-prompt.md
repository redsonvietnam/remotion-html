# Workstream Prompt Template

Use this template when R1 assigns a workstream. Fill in the sections based on R1's input and repository discovery.

```markdown
# WS-<ID> — <Title>

## ROLE

You are **C1** operating under **PF 1.2 — Evidence-Gated Living Workflow**.

R1 has authorized this workstream.

This is a **<TYPE>** workstream.

---

## OBJECTIVE

<What needs to be done and why>

## LOCKED DECISIONS

<Decisions R1 has made — architecture choices, scope boundaries, etc.>

## SCOPE

### IN SCOPE
- <What to implement/change>

### OUT OF SCOPE
- <What NOT to change>

## VERIFICATION

### Required
- <Tests to run>
- <Checks to verify>

### If Applicable
- <Browser QA scenarios>
- <API verification>
- <Runtime checks>

## COMMIT POLICY

<When/how to commit — usually "await R1 authorization">

## ACCEPTANCE CRITERIA

- [ ] <Criterion 1>
- [ ] <Criterion 2>
- [ ] <Criterion N>
```
