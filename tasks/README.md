# tasks/ — Task Workflow

Substantial work (feature, fix, plugin, schema, release) requires a task file
copied from `TASK_TEMPLATE.md`. Keep tasks in this directory
(`tasks/<id>-<slug>.md`).

## Statuses

`TODO → IN_PROGRESS → BLOCKED → VERIFYING → DONE`

## Lifecycle

1. **Create**: copy the template; fill Metadata, Objective, Background
   (with file:line evidence), Scope/Out of Scope, Required Reading/Skills.
2. **Plan**: record Existing Implementation to Inspect + Implementation Plan +
   impact assessments (Platform / Native Plugin / API Contract / Local Data).
3. **Execute**: work through Checkpoints + Implementation Checklist; update
   status (`IN_PROGRESS`, `BLOCKED` with reason, `VERIFYING` when verifying).
4. **Verify**: record Testing and Verification per platform using
   `PASSED / FAILED / NOT_RUN / NOT_APPLICABLE / BLOCKED`. Never claim
   Android/iOS from a web-only build.
5. **Done**: mark `DONE` only when implementation is complete, applicable
   tests ran, impacts reviewed, API deps resolved or excluded, checkpoints
   complete, and limitations disclosed. Write the Final Summary.

## Rules

- Mobile repo only — cross-repo needs get `API Contract Impact: Backend
  changes required` and stop at the boundary.
- One authoritative rule home (§2 of AGENTS.md); link, don't duplicate.
- Issues found mid-task go to `docs/agent/KNOWN_ISSUES.md`; don't silently
  expand scope.
