# PROJECT_REFERENCE — Verified Facts (Mobile Repository)

Reviewed against `main` at commit `8c4868d` (2026-09-24). Evidence paths are
repo-relative; recheck the working tree before implementation.

## Technology stack (VERIFIED — `package.json`, `pnpm-lock.yaml`)

- Current lockfile importer resolves `@ionic/vue` and `@ionic/vue-router`
  9.0.4, Vue 3.5.43, Vue Router 5.3.1, Capacitor core/CLI/Android/iOS
  8.5.2, and Pinia 3.0.4 (axios removed 2026-09-24) (`package.json`,
  `pnpm-lock.yaml` importer). `pinia` is in dependencies. Recheck before
  quoting versions.
- Package manager: pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). No
  `package-lock.json` / `yarn.lock` found.

## Project layout (VERIFIED)

Root: `capacitor.config.ts`, `ionic.config.json` (vue-vite + capacitor),
`vite.config.ts` (`@/` alias, legacy plugin, custom elements), `tsconfig.json`
(strict, `@/*`), `cypress.config.ts`, `.env*`, `public/`, `src/`, `tests/`.
No committed `android/` or `ios/` projects were found. Use `rg --files`
before making absence claims about other directories.

## Supported platforms (VERIFIED / NOT_FOUND)

- Capacitor `android` + `ios` packages DECLARED; native projects NOT_FOUND
  (generate via `npx cap add`). Android, iOS, Web are targets; Web is the
  dev/test fallback.

## Application architecture (VERIFIED)

Entry `src/main.ts` (IonicVue `mode:'ios'`, Pinia, i18n, router,
rbac; `initialAuthData()` before mount) → `src/App.vue`
(`IonApp>IonRouterOutlet`, `appStateChange`, `initAuthen`, single back-button
handler) → `@ionic/vue-router` + guard → tabs/pages → Pinia stores +
composables + `src/api/*Service` → `useApi` (fetch) → Spring Boot backend
(separate repo).

## Native integrations (VERIFIED summary)

ACTIVE: App, Device, Preferences, Camera, Filesystem, PushNotifications,
Share, Clipboard, StatusBar, community FCM/FileOpener/Media,
DeviceSecurityDetect, SafeArea. `useFileSystem.ts` is the active camera
wrapper; new `useCamera.ts` has no import caller in `src/` as of this review.
CONFIGURED_ONLY: Keyboard. Haptics removed 2026-09-24.
LEGACY: `cordova-plugin-file`. Details: `NATIVE_PLUGIN_INVENTORY.md`.

## API / Auth / Data / Notifications / Links / Build / Testing

- API: single `useApi` fetch client (`src/composables/useApi.ts`; axios
  removed), baseURL `VITE_API_BASE_URL`, Bearer+X-User-ID+
  Accept-Language, 401 shared refresh, refresh-403 logout. Verified paths:
  `/api/appUser/currentUserData`, `/api/auth/refreshTokenApi`.
- Auth: JWT+refresh in Preferences (per-user keys, multi-account switch).
- Local data: Preferences; no app-managed SQLite/IndexedDB/migrations.
- Notifications: Push registration + FCM topics (`io.mydomain.fcm.user.<id>`).
  Foreground toast + tap navigation exist in `addNotifyListeners()` but are
  not wired (KNOWN_ISSUES #24); tap target `/post/view/:id` has no route (#23).
- Deep links: none verified (no `appUrlOpen`/intent-filters/domains).
- Build: `pnpm exec vite build` / `pnpm build:vite`; `pnpm build` =
  `ionic build --prod` (global Ionic CLI) → `dist/`. Native sync/build not run.
- Testing: `vue-tsc` (typecheck gate) + vitest (`tests/unit/`) + cypress;
  eslint exists but is not a gate.
