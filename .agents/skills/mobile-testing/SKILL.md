---
name: mobile-testing
description: >
  Use this skill for all verification: unit, component, E2E, native, and
  release checks. Required alongside mobile-core for every implementation.
---

# mobile-testing — Canonical Skill

## Purpose

Define the task-appropriate verification matrix and stop invented test claims.

## When to use

Every implementation task; also typecheck/build/test-only tasks. Lint is
not required unless the user asks (`skills/mobile/TESTING.md` §2).

## Required reading

- `skills/mobile/TESTING.md`

## Relevant project locations

- `tests/unit/useApi.spec.ts` (composable + mocked `fetch`),
  `tests/unit/BaseAvatar.spec.ts` (component, jsdom), `tests/e2e/specs/test.cy.ts`
- `package.json` (`test:unit` = vitest watch, `test:e2e` = cypress); no
  `vitest.config` — default env is `node`, add `// @vitest-environment jsdom`
  per component spec

## Mandatory rules

1. Choose verification from the changed behavior and platform impact; use
   the levels in `skills/mobile/TESTING.md` as reporting categories.
2. Results vocabulary: PASSED / FAILED / NOT_RUN / NOT_APPLICABLE / BLOCKED.
3. Web build ≠ Android/iOS/emulator/device proof; mock Capacitor plugins in
   unit tests.
4. Never claim tests passed unless executed; disclose missing SDKs/devices.

## Implementation workflow

1. Pick applicable levels from the task's Platform/Native/API/Data impacts.
2. Run relevant checks with bounded commands: `pnpm exec vue-tsc --noEmit`,
   `pnpm exec vitest run`, `pnpm exec vite build`; compare failures with the
   existing baseline. Typecheck/build do not catch runtime errors — add a
   test when a change affects mount/lifecycle behavior.
3. Mock native plugins (`@capacitor/*`, community) in jsdom/vitest.
4. Record per-platform results in the task's Testing section.

## Verification

This skill IS the verification gate for DONE.
