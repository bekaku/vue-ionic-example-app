# KNOWN_ISSUES — Verified Findings (not fixes)

Do not fix app code during docs audits — log with evidence here.

| # | Finding | Classification | Evidence | Impact |
| - | ------- | -------------- | -------- | ------ |
| 1 | No `android/`/`ios/` committed; native config unverifiable | NOT_FOUND | root listing 2026-09-24; `package.json:24,32` declare pkgs | All manifest/permission/capability claims UNKNOWN |
| 2 | Notification tap target `/post/view/:id` has no verified route | CONFLICTING | `useNotification.ts:240` vs `router/index.ts` routes | Tap nav may 404 — test before relying |
| 3 | `Haptics` declared, no `src` usage | RESOLVED 2026-09-24 | `pnpm remove @capacitor/haptics` | Run `npx cap sync` so native projects drop it |
| 4 | `Keyboard` config-only, no `src` import | CONFIGURED_ONLY | `capacitor.config.ts:20-24`; no `src` import | Behavior unverified |
| 5 | `cordova-plugin-file` present + `cordovaClearCach` | LEGACY | `package.json:48`; `useAppStorage.ts:142` | Review removal path |
| 6 | `@capacitor-community/media 9.x` on Capacitor core 8 project | PARTIALLY_VERIFIED | `package.json:23,28`; lockfile resolves media 9.1.0 with core 8.5.2 | Verify compat on update |
| 7 | `presentationOptions: []` — no OS-level foreground banner | VERIFIED | `capacitor.config.ts:27`; custom toast in `useNotification.ts` | Kills/inactive-tray behavior needs device test |
| 8 | Push `registration` listeners stacked on every `addListeners` call (App.vue + Index.vue + login + toggle) | RESOLVED 2026-09-24 | `useNotification.ts:17,79-102` keeps handles, removes before re-adding, serialized | Received/tap listeners are a separate gap (#24) |
| 9 | Cold-start notification tap before router/auth ready | UNKNOWN | no readiness gate at `onNotifyView` | May misroute — gate needed |
| 10 | Tokens in Preferences, no secure storage | VERIFIED risk | `useAppStorage.ts`; no secure plugin in `package.json` | Documented risk; never log tokens |
| 11 | No SQLite/IndexedDB/migrations; offline claims unsupported | NOT_FOUND | grep `sqlite|jeep|indexedDB` → noise only | Do not promise offline-first |
| 12 | Web save-to-gallery explicit TODO no-op | RESOLVED 2026-09-24 | `useFileSystem.ts:120-159` → browser download via `downloadFromBlob` | Web has no gallery; download is the web behavior |
| 13 | `pinia` in devDependencies (runtime import) | RESOLVED 2026-09-24 | `package.json` dependencies | None |
| 14 | `CHAT` notification function is a no-op | VERIFIED gap | `useNotification.ts:242` | Product decision needed |
| 15 | No `appUrlOpen`/intent-filter/associated-domain evidence | NOT_FOUND | greps + missing native dirs | Deep links unsupported until implemented |
| 16 | `tests/unit/example.spec.ts` imported missing `@/views/Tab1Page.vue` | RESOLVED 2026-09-24 | spec removed; `tests/unit/useApi.spec.ts` (7 tests) passes | Add tests with new behavior |
| 17 | 2026-09-22 baseline: `vue-tsc` had 13 remaining non-casing errors and `eslint` had 145 errors after casing fixes. 2026-09-24: `vue-tsc --noEmit` → 0 errors (109 fixed; snowflake ids typed as string, `RefreshTokenResponse.userId: string`) | HISTORICAL — recheck current tree | Prior `npx vue-tsc --noEmit`; `pnpm lint` | Keep `vue-tsc` at 0; lint is not a verification gate (`TESTING.md` §2) |
| 18 | Refresh interceptor logs the stored refresh token | RESOLVED 2026-09-24 | `src/plugins/axios.ts` deleted; `useApi.ts` dev log prints url/method/status only | None — keep token-free logging |
| 19 | `useAxios` changed shared axios defaults for each request | RESOLVED 2026-09-24 | `src/composables/useAxios.ts` deleted; `useApi` passes `baseURL` per call | None |
| 20 | Push registration listener logged FCM tokens | RESOLVED 2026-09-24 | `useNotification.ts:79-102` no token logging | Keep token-free logging |
| 21 | `saveProcess` returned before `Media.savePhoto` resolved | RESOLVED 2026-09-24 | `useFileSystem.ts:161-195` awaits and throws on failure | Verify gallery save on device |
| 22 | `useApi` fetch migration not yet runtime-verified | UNKNOWN | `tasks/migrate-axios-to-useapi.md` | Verify login, refresh, upload, CDN image/PDF, download on web + device; confirm backend accepts body-less requests without `Content-Type` |
| 23 | Links/tap targets to pages that do not exist (fall to catch-all 404) | VERIFIED gap | `/post/view/:id` `useNotification.ts:240`; `/user/view/:id` `useConstant.ts:18`, `useBase.ts:249`; `/notifications` `AppNotification.vue:30`; `/hashtag/*` `BaseContentItem.vue:124`; menus `/permission` `/role` `/user` `/chats` `/feed` `navs.ts` | Needs pages + backend contracts (product decision) |
| 24 | `addNotifyListeners()` (foreground toast + tap navigation) is never called | VERIFIED gap | `useNotification.ts:104`; no caller in `src` | Push taps do nothing; wire only after #23 destination exists |
| 25 | Stubbed services return fake data | VERIFIED gap | `UtilService.getAppVersion` hardcoded (force-update never triggers); `UserNotifyService` findAllByUser/findCountAllNotRead/updateReadNotify/updateReadNotifyAll | Enable real endpoints once backend contract is confirmed |
| 26 | `useCamera.ts` unreferenced (no import caller) | UNUSED | committed in `70e5783`; no import in `src` | Wire it in or delete deliberately; it keeps `heic-to` dependency alive |
