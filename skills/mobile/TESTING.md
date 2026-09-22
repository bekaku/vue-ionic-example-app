# TESTING — Detailed Reference

Authoritative home for verification rules. Entry:
`.agents/skills/mobile-testing/SKILL.md`.

## 1. Frameworks (VERIFIED)

| Tool | Version | Evidence |
| ---- | ------- | -------- |
| `vitest` (`test:unit`) | `4.1.7` | `package.json:90,14` |
| `cypress` (`test:e2e`) | `15.16.0` | `package.json:79,13` |
| `@vue/test-utils` / `jsdom` | `2.4.10` / `29.1.1` | `package.json:77,83` |
| eslint / `vue-tsc` | `10.4.1` / `3.3.3` | `package.json:80,91` |

Samples: `tests/unit/example.spec.ts`, `tests/e2e/specs/test.cy.ts`
(+ `support/`, `fixtures/`), `cypress.config.ts`.

## 2. Levels

`STATIC` (lint/typecheck) · `UNIT` · `COMPONENT` · `API` (mocked services) ·
`NATIVE_PLUGIN` (mocked `@capacitor/*`/community) · `ANDROID` · `IOS` ·
`LIFECYCLE` (view-enter/leave, resume) · `SECURITY` (secrets, tokens,
untrusted input) · `BUILD` · `RELEASE`. Run only what the task needs and the
environment supports.

## 3. Result vocabulary

`PASSED` / `FAILED` / `NOT_RUN` / `NOT_APPLICABLE` / `BLOCKED`. Native results
require emulator/device; web success never implies native success. No
Xcode/Android SDK here → ANDROID/IOS stay NOT_RUN unless executed elsewhere.

## 4. Mocking rule

Mock Capacitor plugins in vitest/jsdom (Preferences, Device, Push, Camera,
Filesystem, …); assert `isWeb()` branches and permission-denied paths.
