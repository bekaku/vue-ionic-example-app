# KNOWN_ISSUES — Verified Findings (not fixes)

Do not fix app code during docs audits — log with evidence here.

| # | Finding | Classification | Evidence | Impact |
| - | ------- | -------------- | -------- | ------ |
| 1 | No `android/`/`ios/` committed; native config unverifiable | NOT_FOUND | root listing 2026-09-22; `package.json:22,30` declare pkgs | All manifest/permission/capability claims UNKNOWN |
| 2 | Notification tap target `/post/view/:id` has no verified route | CONFLICTING | `useNotification.ts:240` vs `router/index.ts` routes | Tap nav may 404 — test before relying |
| 3 | `Haptics` declared, no `src` usage | UNUSED | `package.json:29`; grep `@capacitor/haptics` → none in `src` | Remove or adopt deliberately |
| 4 | `Keyboard` config-only, no `src` import | CONFIGURED_ONLY | `capacitor.config.ts:20-24`; no `src` import | Behavior unverified |
| 5 | `cordova-plugin-file` present + `cordovaClearCach` | LEGACY | `package.json:45`; `useAppStorage.ts:142` | Review removal path |
| 6 | `@capacitor-community/media 9.x` on Capacitor core 8 project | PARTIALLY_VERIFIED | `package.json:21` vs core `8.3.4` | Verify compat on update |
| 7 | `presentationOptions: []` — no OS-level foreground banner | VERIFIED | `capacitor.config.ts:27`; custom toast in `useNotification.ts` | Kills/inactive-tray behavior needs device test |
| 8 | Potential duplicate push listeners (`addListeners` from 2+ call sites) | PARTIALLY_VERIFIED | `useAuthen.ts:54`; `useNotification.ts:332` | Duplicate toasts/nav — guard |
| 9 | Cold-start notification tap before router/auth ready | UNKNOWN | no readiness gate at `onNotifyView` | May misroute — gate needed |
| 10 | Tokens in Preferences, no secure storage | VERIFIED risk | `useAppStorage.ts`; no secure plugin in `package.json` | Documented risk; never log tokens |
| 11 | No SQLite/IndexedDB/migrations; offline claims unsupported | NOT_FOUND | grep `sqlite|jeep|indexedDB` → noise only | Do not promise offline-first |
| 12 | Web save-to-gallery explicit TODO no-op | VERIFIED gap | `useFileSystem.ts:124-153` | Web export needs design |
| 13 | `pinia` in devDependencies (runtime import) | CONFLICTING | `package.json:84`; `main.ts:2` | Move to dependencies on next dep task |
| 14 | `CHAT` notification function is a no-op | VERIFIED gap | `useNotification.ts:242` | Product decision needed |
| 15 | No `appUrlOpen`/intent-filter/associated-domain evidence | NOT_FOUND | greps + missing native dirs | Deep links unsupported until implemented |
