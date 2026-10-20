# Mobile Core — Detailed Reference (Ionic Vue + Capacitor)

Authoritative home for core architecture rules. Canonical entry:
`.agents/skills/mobile-core/SKILL.md`.

## 1. Stack and version lookup

Use `package.json` for declared ranges and `pnpm-lock.yaml` for resolved
versions. Do not copy numbers from dated audit pages into implementation
plans. This is a pnpm project (`pnpm-lock.yaml`, `pnpm-workspace.yaml`);
`capacitor.config.ts` sets `appId`/`appName` and `webDir: 'dist'`.

Build scripts: `dev` (vite :3004), `build:vite` (`vue-tsc && vite build`),
`build` (`ionic build --prod`, needs the global Ionic CLI), `test:unit`
(vitest watch), `test:e2e` (cypress), `lint` (eslint, not a gate). See
`package.json` `scripts`, `docs/agent/BUILD_RELEASE_GUIDE.md`.

## 2. Application bootstrap (VERIFIED)

`src/main.ts` › `startApp()`:

1. `createApp(App)` + `i18n()` + `createPinia()` + `IonicVue({rippleEffect,
   animated, hardwareBackButton: true, swipeBackEnabled: false, mode: 'ios'})`
   + `router`.
2. Registers `rbac` directive (`src/directives/rbac.ts`). HTTP uses
   `useApi()` (no provide/inject).
3. `router.isReady()` → `authenStore.initialAuthData()` (`currentUserData`,
   15 s timeout). `ApiFetchError` 403 → `removeAuthToken()` +
   `router.replace('/auth/login')`; network/timeout errors fall through.
   `.finally(() => app.mount('#app'))` — the app always mounts.

Rules: keep `mode: 'ios'`; keep single bootstrap order; do not add a second
HTTP client or global store outside Pinia without a task.

## 3. Where to implement

| Behavior | Start tracing at | Then check |
| -------- | ---------------- | ---------- |
| Page or reusable UI | `src/pages/`, `src/components/base/` | router entry, composable, i18n |
| Shared state | `src/stores/` | readers/writers in pages and composables |
| REST call | existing `src/api/*Service.ts`, else call `useApi()` directly (`API.md` §2) | `useApi.ts`, DTO in `src/types/` |
| Auth/session | `useAuthen.ts`, `useAppStorage.ts` | `authenStore.ts`, router guard, `useApi` 401 refresh |
| Device behavior | `src/composables/` wrapper | plugin config, web path, Android/iOS evidence |
| File upload | `useUpload.ts` | `FileManagerService.ts`, consuming page/component |

`src/pages/example/` demonstrates APIs but is not proof of production usage.
Follow imports from the actual route or component before extending a helper.

## 4. Conventions

- Composition API, `<script setup lang="ts">`, strict TS (`tsconfig.json`),
  `@/` alias. Verified in `src/App.vue`, `src/pages/tabs/home.vue`.
- HTTP: `const api = useApi()` directly in page/composable/store, or a
  `XxxService()` factory in `src/api/` when reused/auth/mapping — rule in
  `API.md` §2.
- Composables: `useX()` returning methods/state
  (`useAuthen`, `useAppStorage`, `useDevice`, `useBase`, `useConfig`).
- Env: `import.meta.env.VITE_*` via `useConfig()` (`src/composables/useConfig.ts`).
  Inspect environment keys without copying values; device `localhost` does
  not refer to the development machine.
- Logging: `console.*` guarded by dev mode in places (`App.vue` ›
  `onBeforeMount`, `authenStore.ts` › `initialAuthDataProcess`). Do not log
  tokens (see `AUTH.md`).
- IDs: server IDs are snowflake numbers larger than 2^53. `useApi` parses them
  as **strings** (json-bigint `storeAsString`), typed `IdType`
  (`src/types/models.ts`); `RefreshTokenResponse.userId` is `string`. Never
  `Number()`/`parseInt` an id (precision loss); compare/emit as strings.
- Watchers: `watch(() => prop, fn, { immediate: true })` for "run on mount and
  when X changes"; it calls `fn` synchronously, so define `fn` above it.
  Avoid `watchEffect` when the effect reads flags it also writes.

## 5. Error handling

`useApi.ts` handles headers, 401 refresh, and error toasts (`API.md` §1).
UI feedback also uses
`useBase` (`appToast/appConfirm/appLoading`). Inspect both layers before
changing error handling.

## 6. Date/time helpers (VERIFIED)

Use `src/composables/useDateFns.ts` for date parsing/formatting, comparisons,
differences, current dates, filename timestamps and duration helpers.
`src/utils/DateUtil.ts` contains only format constants and descriptive aliases.
No Nuxt injection is required. In component setup, `useDateFns()` follows
`useLang().locale`; outside setup, pass an explicit locale (e.g.
`useDateFns('en')` for machine formats), or a ref/getter for reactive locale.

Formatting uses option objects, e.g.
`formatDateTime({ date: value, format: FORMAT_DATE_TIME_ALT })`. `format` is
the output pattern; use `inputFormat` for a custom input pattern, or `iso: true`
for ISO-only parsing. The default datetime output is `dd/MM/yyyy HH:mm`.
Invalid/empty inputs return an empty string in rendering helpers. Auto formats
use local calendar days. Signed difference helpers compute end minus start;
retain that order for device/sync thresholds. Cache daily keys use
`formatLocalDateBy` to preserve the existing device-locale representation.
`useBase` no longer exposes date-format wrappers; call this composable directly.

## 7. Git workflow

The push target is always the branch the project is currently on. There is no
fixed `main` target: when the session runs on `feature/login-api`, the commit
and the push both land on `feature/login-api`.

1. **Resolve the branch first** — `git branch --show-current` (or
   `git status -sb`). Never assume `main`; the checkout may be any branch.
2. **Commit on that branch.** Do not create a new branch, switch branches,
   merge, or rebase as part of a task.
3. **Push the same branch** — `git push origin <current-branch>` (equivalently
   `git push origin HEAD:refs/heads/<current-branch>`). Never run
   `git push origin main` (or any other branch) from a session that is not on
   it: that publishes the work under the wrong ref and can overwrite another
   branch's history.
4. **Only on request.** Commit and push happen when the user explicitly asks;
   otherwise report the changes and leave the tree as it is.
5. **Secrets check.** Staged files must not carry `.env*` values, keystores, or
   tokens before committing.
6. **Report the ref.** State the branch name, commit id, and pushed ref in the
   final summary; say so explicitly when a push was skipped.

```sh
git branch --show-current          # -> feature/login-api
git add -A && git commit -m "..."
git push origin feature/login-api  # same branch, never origin main
```
