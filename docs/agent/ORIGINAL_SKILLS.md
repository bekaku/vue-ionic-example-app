# ORIGINAL_SKILLS — Historical Archive (NOT AUTHORITATIVE)

> Label: HISTORICAL ARCHIVE — NOT AUTHORITATIVE. Preserved per AGENTS.md §13.
> Authoritative rules live in `.agents/skills/*/SKILL.md` + `skills/mobile/*.md`.

## Audit result (2026-09-22)

No pre-existing agent-instruction files were found in this repository:

- No `AGENTS.md`, `SKILLS.md`, `CLAUDE.md`, `GEMINI.md`,
  `.github/copilot-instructions.md`, `.agents/`, `skills/`, `tasks/`, or
  `docs/agent/` existed before this task (verified via root listing + `git log`).
- `README.md` (67 lines) covers only setup/dev/build/preview/`cap sync`
  commands plus the backend Spring Boot link — preserved untouched.
- `CHANGELOG.md` is a one-line placeholder — preserved untouched.

## Disposition

There was nothing to migrate; `SPLIT_MAP.md` records the greenfield creation.
If legacy agent docs are discovered later, archive their content here (without
secrets) before re-homing any rule.
