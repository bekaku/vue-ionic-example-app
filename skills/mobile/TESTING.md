# TESTING — Detailed Reference

Authoritative home for verification rules. Entry:
`.agents/skills/mobile-testing/SKILL.md`.

## 1. Frameworks (VERIFIED)

| Tool | Version | Evidence |
| ---- | ------- | -------- |
| `vitest` (`test:unit`) | check lockfile | `package.json:16,94` |
| `cypress` (`test:e2e`) | check lockfile | `package.json:15,83` |
| `@vue/test-utils` / `jsdom` | check lockfile | `package.json:81,87` |
| eslint / `vue-tsc` | check lockfile | `package.json:84,95` |

Samples: `tests/unit/useApi.spec.ts` (fetch/Preferences/router mocked with
`vi.mock` + `vi.stubGlobal('fetch')`), `tests/e2e/specs/test.cy.ts`
(+ `support/`, `fixtures/`), `cypress.config.ts`.
`test:unit` starts Vitest watch mode; use `pnpm exec vitest run` for a
bounded check; establish whether a failure predates your change.

## 2. Levels

`STATIC` (typecheck) · `UNIT` · `COMPONENT` · `API` (mocked services or mocked `useApi`/`fetch`) ·
`NATIVE_PLUGIN` (mocked `@capacitor/*`/community) · `ANDROID` · `IOS` ·
`LIFECYCLE` (view-enter/leave, resume) · `SECURITY` (secrets, tokens,
untrusted input) · `BUILD` · `RELEASE`. Run only what the task needs and the
environment supports.

**Lint is not required.** `STATIC` = `pnpm exec vue-tsc --noEmit` only. Do not
run `pnpm lint` / eslint as a verification step and do not report a lint
result unless the user asks for it.

## 3. Result vocabulary

`PASSED` / `FAILED` / `NOT_RUN` / `NOT_APPLICABLE` / `BLOCKED`. Native results
require emulator/device; web success never implies native success. Record
ANDROID/IOS as NOT_RUN unless a native check actually executes.

## 4. Mocking rule

Mock Capacitor plugins in vitest/jsdom (Preferences, Device, Push, Camera,
Filesystem, …); assert `isWeb()` branches and permission-denied paths.
