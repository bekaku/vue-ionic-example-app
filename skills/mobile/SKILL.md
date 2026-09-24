# Mobile Core — Detailed Reference (Ionic Vue + Capacitor)

Authoritative home for core architecture rules. Canonical entry:
`.agents/skills/mobile-core/SKILL.md`.

## 1. Stack and version lookup

Use `package.json` for declared ranges and `pnpm-lock.yaml` for resolved
versions. Do not copy numbers from dated audit pages into implementation
plans. This is a pnpm project (`pnpm-lock.yaml`, `pnpm-workspace.yaml`);
`capacitor.config.ts:5-7` sets app id/name and `webDir: 'dist'`.

Build scripts: `dev` (vite :3004), `build:vite` (`vue-tsc && vite build`),
`build` (`ionic build --prod`), `test:unit` (vitest), `test:e2e` (cypress),
`lint` (eslint). See `package.json:6-16`, `docs/agent/BUILD_RELEASE_GUIDE.md`.

## 2. Application bootstrap (VERIFIED)

`src/main.ts:40-67` — `startApp()`:

1. `createApp(App)` + `i18n()` + `createPinia()` + `IonicVue({rippleEffect,
   animated, hardwareBackButton: true, swipeBackEnabled: false, mode: 'ios'})`
   + `router`.
2. Registers `rbac` directive (`src/directives/rbac`). HTTP uses
   `useApi()` (no provide/inject).
3. `router.isReady()` → `authenStore.initialAuthData()` → on 403
   `removeAuthToken()` + `router.replace('/auth/login')` → `app.mount('#app')`.

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
- Logging: `console.*` guarded by dev mode in places (`App.vue:30-32`,
  `authenStore.ts:48-50`). Do not log tokens (see `AUTH.md`).

## 5. Error handling

`useApi.ts` handles headers, 401 refresh, and error toasts (`API.md` §1).
UI feedback also uses
`useBase` (`appToast/appConfirm/appLoading`). Inspect both layers before
changing error handling.
