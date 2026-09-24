# TESTING — Detailed Reference

Authoritative home for verification rules. Entry:
`.agents/skills/mobile-testing/SKILL.md`.

## 1. Frameworks (VERIFIED)

| Check | Command | Notes |
| ----- | ------- | ----- |
| Typecheck (`STATIC`) | `pnpm exec vue-tsc --noEmit` | covers `src/**` only (not `tests/`) |
| Unit/component | `pnpm exec vitest run [path]` | `pnpm test:unit` is watch mode |
| Web build (`BUILD`) | `pnpm exec vite build` | add `--outDir <tmp>` to keep `dist/` untouched |
| E2E | `pnpm test:e2e` (cypress) | needs a running app |

Versions: check `package.json` + lockfile (`vitest`, `cypress`,
`@vue/test-utils`, `jsdom`, `vue-tsc`).

Samples:
- `tests/unit/useApi.spec.ts` — composable test: `vi.mock` for router,
  `useAppStorage`, `useDevice`, `StorageUtil`, `JwtUtil`, `@ionic/vue`;
  `vi.hoisted` shared state; `vi.stubGlobal('fetch', …)`.
- `tests/unit/BaseAvatar.spec.ts` — component test: `// @vitest-environment
  jsdom` (default env is `node`; there is no `vitest.config`), stub
  `@ionic/vue` components with `vi.mock`, `mount` + `flushPromises` +
  `setProps`.
- `tests/e2e/specs/test.cy.ts` (+ `support/`, `fixtures/`), `cypress.config.ts`.

Typecheck and build do not catch runtime errors (e.g. TDZ in `watch
{immediate}`); cover mount/lifecycle changes with a component test.
Establish whether a failure predates your change.

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
