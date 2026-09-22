# Mobile Core — Detailed Reference (Ionic Vue + Capacitor)

Authoritative home for core architecture rules. Canonical entry:
`.agents/skills/mobile-core/SKILL.md`.

## 1. Verified stack (Classification: VERIFIED)

| Item | Version / value | Evidence |
| ---- | --------------- | -------- |
| `@ionic/vue` / `@ionic/vue-router` | `9.0.4` | `package.json:39-40` |
| `vue` / `vue-router` | `3.5.35` / `5.1.0` | `package.json:60,62` |
| `@capacitor/core|cli|android|ios` | `8.3.4` | `package.json:22,26,30,69` |
| `axios` | `1.16.1` | `package.json:43` |
| `pinia` | `3.0.4` (devDependencies) | `package.json:84` |
| `typescript` / `vite` / `vue-tsc` | `^6.0.3` / `^8.0.14` / `^3.3.3` | `package.json:88-91` |
| Package manager | pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`) | repo root |
| App id / name / webDir | `com.bekaku.mobile.ion` / `Vue Ionic` / `dist` | `capacitor.config.ts:5-7` |

Build scripts: `dev` (vite :3004), `build:vite` (`vue-tsc && vite build`),
`build` (`ionic build --prod`), `test:unit` (vitest), `test:e2e` (cypress),
`lint` (eslint). See `package.json:6-16`, `docs/agent/BUILD_RELEASE_GUIDE.md`.

## 2. Application bootstrap (VERIFIED)

`src/main.ts:40-67` — `startApp()`:

1. `createApp(App)` + `i18n()` + `createPinia()` + `IonicVue({rippleEffect,
   animated, hardwareBackButton: true, swipeBackEnabled: false, mode: 'ios'})`
   + `router`.
2. Provides `AxiosKey` (`src/plugins/axios.ts`), registers `rbac` directive
   (`src/directives/rbac`).
3. `router.isReady()` → `authenStore.initialAuthData()` → on 403
   `removeAuthToken()` + `router.replace('/auth/login')` → `app.mount('#app')`.

Rules: keep `mode: 'ios'`; keep single bootstrap order; do not add a second
HTTP client or global store outside Pinia without a task.

## 3. Directory organization (VERIFIED)

`src/`: `api/` (XxxService), `components/{app,base,chart,chat,form,icon,
notification,profile,skeleton,test,user}`, `composables/use*.ts`,
`directives/`, `layouts/Default.vue`, `libs/` (constants, navs, data),
`locales/{en,th}`, `pages/` (incl. `auth/`, `tabs/`, `settings/`,
`example/`, `test/`), `plugins/` (axios, i18n, cropperjs, IonicConfig),
`router/`, `stores/` (`appStore`, `authenStore`, `deviceStore`,
`notificationStore`, `tabStore`, `utilStore`, `fourceReloadStore`), `types/`,
`utils/`. Do not reorganize.

## 4. Conventions

- Composition API, `<script setup lang="ts">`, strict TS (`tsconfig.json`),
  `@/` alias. Verified in `src/App.vue`, `src/pages/tabs/home.vue`.
- Services: `XxxService()` factory returning async methods
  (`src/api/AuthenService.ts`, `FileManagerService.ts`).
- Composables: `useX()` returning methods/state
  (`useAuthen`, `useAppStorage`, `useDevice`, `useBase`, `useConfig`).
- Env: `import.meta.env.VITE_*` via `useConfig()` (`src/composables/useConfig.ts`).
  `.env.development` → localhost:8080; `.env.production` → myapp.com domains.
  Never commit secrets; document keys without values.
- Logging: `console.*` guarded by dev mode in places (`App.vue:30-32`,
  `authenStore.ts:48-50`). Do not log tokens (see `AUTH.md`).

## 5. Error handling

Axios interceptors own HTTP errors (`src/plugins/axios.ts:96-164`); UI
feedback via `useBase` (`appToast/appConfirm/appLoading`). Keep handling at
service/composable level, not scattered in templates.
