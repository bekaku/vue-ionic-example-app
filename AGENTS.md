# AGENTS.md — Mobile Repository (Ionic Vue + Capacitor)

> Scope: this file governs AI agents working **inside the mobile repository only**
> (`vue-ionic-mobile`). Backend (Spring Boot + MySQL) and Web frontend (Quasar SSR)
> are separate repositories and are out of scope for edits.

## 1. Purpose and Scope

1. This repository is an Ionic Vue + Capacitor mobile app (`src/`, `capacitor.config.ts`).
   Use **pnpm** (`pnpm-lock.yaml`). Read current dependency declarations in
   `package.json` and resolved versions in the lockfile before quoting versions;
   the snapshot in `docs/agent/PROJECT_REFERENCE.md` is dated evidence.
2. Supported runtime targets: **Android, iOS, Web** (Capacitor `android`/`ios`
   packages declared; **no `android/` or `ios/` native projects are committed** —
   they are generated with `npx cap add`). Web is the dev/test fallback.
3. During **documentation tasks**, edit only the agent-documentation files
   listed in "Source of Truth" below. Application source (`src/`, `public/`,
   configs) is read-only for those tasks. Implementation tasks follow §11 and
   may edit application code within this repository.
4. Do not add Quasar UI, Nuxt, backend (Spring/MySQL/Flyway), or AI/RAG
   architecture to this app. Existing `@quasar/extras` icon imports are assets.

## 2. Source of Truth and Instruction Precedence

Precedence (highest first):

1. `AGENTS.md` (this file) — global policies and workflow.
2. `SKILLS.md` — baseline and domain skill routing.
3. `.agents/skills/<name>/SKILL.md` — canonical skill entry points (authoritative
   per-domain rules).
4. `skills/mobile/*.md` — detailed references (one authoritative home per rule).
5. `docs/agent/*.md` — verified audit evidence (architecture, inventory, issues).
6. `tasks/TASK_TEMPLATE.md` + `tasks/README.md` — task format and workflow.

Rules: one authoritative home per technical rule; canonical skills point to
detailed references, never duplicate them. If two documents conflict, the higher
precedence wins — record the conflict in `docs/agent/KNOWN_ISSUES.md` and follow
the higher document. Historical docs live only in
`docs/agent/ORIGINAL_SKILLS.md` (labelled archive, not authoritative).

## 3. Repository and Platform Boundaries

- MUST NOT modify: `src/**`, `public/**`, `android/**`, `ios/**`,
  `package.json`, lockfiles, Gradle/Pods, signing, permissions, auth behavior,
  API integrations, or run `npx cap sync/add/update`, builds, or deployments
  during documentation tasks. Never expose secrets, tokens, keystores.
- MUST NOT touch sibling repos (backend, Quasar). If a task needs backend/web
  changes, document the dependency in the task (`API Contract Impact:
  Backend changes required`) and stop at the boundary.
- MUST NOT assume `android/` and `ios/` behave identically. No native projects
  are committed, so every native path/permission/capability claim must be
  classified (`VERIFIED` / `NOT_FOUND` / `UNKNOWN`) with evidence.
- Sibling-repo inspection (if mounted) is read-only.

## 4. Mandatory Discovery Before Editing

Before any implementation task:

1. Read `AGENTS.md` + `SKILLS.md`, select skills per the routing matrix.
2. Read the selected `.agents/skills/*/SKILL.md` entry points and their
   "Required reading" (`skills/mobile/*.md`).
3. Inspect existing code: entry `src/main.ts`, `src/App.vue`, `src/router/`,
   relevant `src/composables/`, `src/stores/`, `src/api/`, `src/pages/`,
   `src/components/base/`. Trace imports and actual usage — never rely on
   filenames or `package.json` presence alone.
4. Verify dependency versions in `package.json` + `pnpm-lock.yaml`, Capacitor
   config in `capacitor.config.ts`, env in `.env*` (never copy secret values).
5. Classify findings (`VERIFIED`, `PARTIALLY_VERIFIED`, `LEGACY`, `CONFLICTING`,
   `NOT_FOUND`, `UNKNOWN`) with file:line evidence. Missing search results are
   not proof of absence — check synonyms and native config before claiming
   `NOT_FOUND`. Recheck dated audit docs against the working tree; distinguish
   current code, pending changes, and historical findings.

## 5. Skill Routing Rules

- All implementation tasks require `mobile-core` + `mobile-testing`.
- Add domain skills per `SKILLS.md` routing matrix (e.g. auth →
  `mobile-auth` + `mobile-api`; plugin → `mobile-native-plugins`; schema →
  `mobile-local-data`).
- Combine skills for actual cross-domain behavior; add deep links for inbound
  URLs, not for every notification tap. Do not load all 13 skills by default.
- Each canonical skill's frontmatter `description` defines its activation
  condition — respect it.

## 6. Ionic and Vue Conventions

- Composition API + `<script setup lang="ts">`, TypeScript strict, `@/` alias
  (`tsconfig.json` paths). App mode is forced `mode: 'ios'` (`src/main.ts:46`).
- Route pages need an `IonPage` root. Prefer `BasePage.vue` for standard pages;
  existing login, index, and tabs shell pages use `IonPage` directly. Reuse
  `src/components/base/*`; `@quasar/extras` supplies icons in some pages but
  Quasar UI components are not part of this app.
- Ionic can cache routed pages. For refresh or listeners on re-entry, choose
  Ionic view hooks rather than assuming `onMounted` runs again. The current
  pages do not establish a universal view-hook pattern; verify the target
  route and clean up listeners according to their actual owner. Details:
  `skills/mobile/COMPONENTS.md`, `LIFECYCLE.md`.

## 7. Navigation and Application Lifecycle

- Router is `@ionic/vue-router` `createRouter` + `createWebHistory(BASE_URL)`
  with `IonRouterOutlet` (`src/App.vue`, `src/router/index.ts`). Guard rule:
  `meta.noRequireAuth === true` bypasses auth; otherwise
  `getCurrentUserToken()` must yield an `authenticationToken` or redirect to
  `/auth/login/` (replace). Tabs live under `/tabs/` with children
  `home/chat/other`.
- Android back button: single `useBackButton(-1, …)` handler in `App.vue`
  (`canGoBack()` / `/tabs/home` → confirm-exit → `App.exitApp()`). Do not add
  competing handlers; register once, keep priority intentional.
- Lifecycle: `App.addListener('appStateChange')` → `deviceStore.setAppStateChange`
  (`src/App.vue:33`); `initAuthen()` on launch; never assume background JS runs
  indefinitely or that termination callbacks fire. Details: `NAVIGATION.md`,
  `LIFECYCLE.md`.

## 8. Capacitor and Native Integration

- Active plugins (traced imports/calls): `App`, `Device`, `Preferences`, `Camera`,
  `Filesystem`, `PushNotifications`, `Share`, `Clipboard`, `StatusBar`,
  community `FCM`, `FileOpener`, `Media`, `DeviceSecurityDetect`, `SafeArea`.
  `Keyboard` is config-only; `cordova-plugin-file` is legacy (used via
  `window.cordova.file` in `cacheClear`). `Haptics` was removed 2026-09-24. Full matrix:
  `docs/agent/NATIVE_PLUGIN_INVENTORY.md`.
- Platform detection: `useDevice().isWeb()` checks `Device.getInfo().platform`.
  Choose a guard or web fallback based on the plugin operation: Preferences and
  Camera have web paths, while push registration is skipped on web. Inspect the
  existing wrapper and verify support before adding a call.
- Any plugin install/update task must review: Capacitor 8 compatibility, pnpm
  version pin, Android (permissions, Gradle) + iOS (Info.plist, entitlements,
  Pods) config, `cap sync` requirement, and runtime verification on device.
  Do not run sync during docs tasks. Details: `NATIVE_PLUGINS.md`.

## 9. API and Authentication

- HTTP client: `useApi()` (`src/composables/useApi.ts`, native `fetch`,
  ofetch-style `api<T>(url, opts)` / `api.raw<T>()`). baseURL
  `VITE_API_BASE_URL`, `credentials: 'same-origin'` (= axios
  `withCredentials: false`), timeout `VITE_API_TIMOUT` or 180s,
  `Accept-Apiclient`, `Accept-Language`, `Bearer` + `X-User-ID`,
  `X-Sync-Active`; status ≥ 400 throws `ApiFetchError`; `json-bigint` for
  `\d{16,}`. 401 → one shared refresh (`POST /api/auth/refreshTokenApi`);
  refresh failure with 403 → `removeAuthToken()` + redirect login.
  axios was removed (2026-09-24) — do not re-add axios or another HTTP
  client. `useApi()` may
  be called directly in pages/composables/stores without a `src/api`
  service; use a service when reused, auth-related, or already there
  (`skills/mobile/API.md` §2). Verified endpoints:
  `/api/appUser/currentUserData`, `/api/auth/refreshTokenApi`, AuthenService
  signin/signout. Never invent contracts — classify as
  `VERIFIED_FRONTEND_USAGE` vs `UNVERIFIED_BACKEND_ASSUMPTION`.
- Auth: JWT + refresh token in **Capacitor Preferences** (keys
  `AppAuthTokenKey_<uid>`, `AppAuthRefeshTokenKey_<uid>`,
  `AppAuthCuurentUserKey`; multi-account `switchUser`). No secure-storage
  plugin — treat as documented risk, never copy tokens into docs. Startup:
  `main.ts` → `initialAuthData()` → `GET currentUserData`. Details: `API.md`,
  `AUTH.md`, `docs/agent/API_INTEGRATION_CONTRACT.md`.

## 10. Local Data, Notifications and Files

- Local data uses **Capacitor Preferences** (`src/utils/StorageUtil.ts`;
  `clearStorage` preserves locale/theme/FCM/device keys). **No app-managed
  SQLite / jeep-sqlite / IndexedDB / migration mechanism** — do not invent offline-first
  sync; offline claims require queue/conflict evidence (`LOCAL_DATA.md`).
- Notifications: `PushNotifications` (check/request/register/unregister) +
  community `FCM` topics (`io.mydomain.fcm.user.<id>`). Active listeners:
  `registration`, `registrationError` (re-adding replaces, never stacks).
  `pushNotificationReceived`/`pushNotificationActionPerformed` live in
  `addNotifyListeners()`, which is **not called anywhere** — foreground toast
  and tap navigation are inactive; its tap target `/post/view/:id` has no
  route. Config `presentationOptions: []` (`NOTIFICATIONS.md`).
- Deep links: **no `appUrlOpen` listener, no committed intent-filters /
  associated domains** (`NOT_FOUND`). Only verified inbound navigation is from
  notification taps. Treat every incoming URL as untrusted (`DEEP_LINKS.md`).
- Files/media: Active picker path uses `useFileSystem.ts` (Camera `getPhoto`
  Uri + `webUseInput`, `pickImages`); `useCamera.ts` is currently unreferenced.
  `Filesystem.writeFile` to `Directory.Data`, community `Media.savePhoto` to
  `AppAlbumName` album, community `FileOpener.open`, `Share.share`. Chunked
  upload: default 1 MB chunks, one attempt unless overridden, `FormData`
  `uploadChunkApi` followed by `mergeChunkApi` (`useUpload.ts`). On web,
  `savePicture`/`saveFile` trigger a browser download (no gallery).
  Validate paths, MIME, filenames (`FILES_MEDIA.md`).

## 11. Task Workflow

- Substantial work (feature, fix, plugin, schema, release) requires a task file
  from `tasks/TASK_TEMPLATE.md`; workflow in `tasks/README.md`. Statuses:
  `TODO → IN_PROGRESS → BLOCKED → VERIFYING → DONE`.
- Every task fills: Platform Impact, Native Plugin Impact, API Contract Impact,
  Local Data Impact. Cross-repo needs are documented, never implemented here.
- `DONE` only when: implementation complete, applicable verification recorded
  (`PASSED`/`FAILED`/`NOT_RUN`/`NOT_APPLICABLE`/`BLOCKED` — never claim Android/
  iOS passed on a web-only build), checkpoints complete, impacts reviewed,
  limitations disclosed.

## 12. Testing and Platform Verification

- Frameworks: Vitest (`test:unit`), Cypress (`test:e2e`),
  `@vue/test-utils`, `jsdom` (see `tests/unit/useApi.spec.ts`,
  `tests/e2e/specs/test.cy.ts`). Typecheck: `vue-tsc`. Lint (eslint) is not
  required — do not run it unless the user asks (`TESTING.md` §2).
- Verification levels: `STATIC, UNIT, COMPONENT, API, NATIVE_PLUGIN, ANDROID,
  IOS, LIFECYCLE, SECURITY, BUILD, RELEASE` — run only what the task needs and
  the environment supports. Web build ≠ native proof. Mock Capacitor plugins in
  unit tests; physical-device checks stay `NOT_RUN` when no device/SDK exists.
  Details: `skills/mobile/TESTING.md`.

## 13. Documentation Maintenance

- One authoritative home per rule (§2). Fix rules where they live; link, don't
  copy. New conventions need code evidence + file:line refs before becoming
  rules; proposals stay proposals.
- Preserve history: `docs/agent/ORIGINAL_SKILLS.md` is archive-only.
  Migrations tracked in `docs/agent/SPLIT_MAP.md`. Issues (not fixes) go to
  `docs/agent/KNOWN_ISSUES.md` — never fix app code during a docs audit.
- Keep docs secret-free (env keys without values, no tokens/keystores).

## 14. Completion and Reporting

- For implementation tasks: report files changed, verification results per
  platform (web/Android/iOS distinct), remaining limitations, and task status.
- For documentation tasks: report files created/modified, validation (structure,
  markdown links, frontmatter, routing simulation, `git diff` showing no app/
  native/dependency changes), and known limitations.
- Never claim tests/builds passed unless executed; never claim native behavior
  verified without device/emulator evidence.
