# PROJECT_REFERENCE — Verified Facts (Mobile Repository)

Audit date: 2026-09-22. Evidence paths are repo-relative.

## Technology stack (VERIFIED — `package.json`, `pnpm-lock.yaml`)

- `@ionic/vue 9.0.4`, `@ionic/vue-router ^9.0.0`, `vue ^3.5.35`,
  `vue-router ^5.1.0`, `@capacitor/core|cli|android|ios ^8.3.4`,
  `axios ^1.16.1`, `pinia ^3.0.4` (devDependencies), `typescript ^6.0.3`,
  `vite ^8.0.14`, `vue-tsc ^3.3.3`, `vitest ^4.1.7`, `cypress ^15.16.0`,
  `@vue/test-utils ^2.4.10`, `jsdom ^29.1.1`, `vue-i18n ^11.4.4`.
- Package manager: pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). No
  `package-lock.json` / `yarn.lock` found.

## Project layout (VERIFIED)

Root: `capacitor.config.ts`, `ionic.config.json` (vue-vite + capacitor),
`vite.config.ts` (`@/` alias, legacy plugin, custom elements), `tsconfig.json`
(strict, `@/*`), `cypress.config.ts`, `.env*`, `public/`, `src/`, `tests/`.
No `android/`, `ios/`, `.github/`, `Dockerfile`, `e2e/` top-level found.

## Supported platforms (VERIFIED / NOT_FOUND)

- Capacitor `android` + `ios` packages DECLARED; native projects NOT_FOUND
  (generate via `npx cap add`). Android, iOS, Web are targets; Web is the
  dev/test fallback.

## Application architecture (VERIFIED)

Entry `src/main.ts` (IonicVue `mode:'ios'`, Pinia, i18n, router, AxiosKey,
rbac; `initialAuthData()` before mount) → `src/App.vue`
(`IonApp>IonRouterOutlet`, `appStateChange`, `initAuthen`, single back-button
handler) → `@ionic/vue-router` + guard → tabs/pages → Pinia stores +
composables + `src/api/*Service` → axios client → Spring Boot backend
(separate repo).

## Native integrations (VERIFIED summary)

ACTIVE: App, Device, Preferences, Camera, Filesystem, PushNotifications,
Share, Clipboard, StatusBar, community FCM/FileOpener/Media,
DeviceSecurityDetect, SafeArea. CONFIGURED_ONLY: Keyboard. UNUSED: Haptics.
LEGACY: `cordova-plugin-file`. Details: `NATIVE_PLUGIN_INVENTORY.md`.

## API / Auth / Data / Notifications / Links / Build / Testing

- API: single axios client, baseURL `VITE_API_BASE_URL`, Bearer+X-User-ID+
  Accept-Language, 401 refresh queue, 403 logout. Verified paths:
  `/api/appUser/currentUserData`, `/api/auth/refreshToken`.
- Auth: JWT+refresh in Preferences (per-user keys, multi-account switch).
- Local data: Preferences only; no SQLite/IndexedDB/migrations.
- Notifications: Push + FCM topics (`io.mydomain.fcm.user.<id>`), toast +
  `/post/view/:id` tap nav (route CONFLICTING).
- Deep links: none verified (no `appUrlOpen`/intent-filters/domains).
- Build: `ionic build --prod` → `dist/`; `npx cap sync`; env dev/prod files.
- Testing: vitest + cypress + eslint + vue-tsc; samples in `tests/`.
