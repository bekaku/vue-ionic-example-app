# NATIVE_PLUGINS — Detailed Reference

Authoritative home for Capacitor plugin rules. Entry:
`.agents/skills/mobile-native-plugins/SKILL.md`. Inventory:
`docs/agent/NATIVE_PLUGIN_INVENTORY.md`.

## 1. Classification method

A plugin is ACTIVE only with import + call-site evidence in
`src/` plus config where required. `package.json` presence alone =
DECLARED, never ACTIVE.

## 2. Active integration map (check current package/lock versions)

| Plugin | Verdict | Evidence |
| ------ | ------- | -------- |
| `App` | ACTIVE | `App.vue:7,33,43` |
| `Device` | ACTIVE | `useDevice.ts:1`; `AppUtil.ts:4` |
| `Preferences` | ACTIVE | `StorageUtil.ts:1`; `useAppStorage.ts:5` |
| `Camera` | ACTIVE via `useFileSystem` | `useFileSystem.ts:7,208-302`; `useCamera.ts` is unreferenced |
| `Filesystem` | ACTIVE | `useFileSystem.ts:8`; `useFileDownload.ts:4` |
| `PushNotifications` | ACTIVE | `useNotification.ts:7`; config `presentationOptions: []` |
| `@capacitor-community/fcm` | ACTIVE | `useNotification.ts:6,288-310` |
| `@capacitor-community/file-opener` | ACTIVE | `useFileDownload.ts:2,226` |
| `@capacitor-community/media` | ACTIVE | `useFileSystem.ts:5-6,18-41` |
| `Share` | ACTIVE | `useFileDownload.ts:5,245` |
| `Clipboard` | ACTIVE | `useBase.ts:14,256` |
| `StatusBar` | ACTIVE | `useTheme.ts:6,30-99` |
| `@capacitor-community/device-security-detect` | ACTIVE | `useDevice.ts:8,79` |
| `capacitor-plugin-safe-area` | ACTIVE | `useDevice.ts:9,84` |
| `Keyboard` | CONFIGURED_ONLY | `capacitor.config.ts:20-24`; no `src` import (NOT_FOUND) |
| `Haptics` | REMOVED | `pnpm remove @capacitor/haptics` 2026-09-24 |
| `cordova-plugin-file` | LEGACY | declared; `cordovaClearCach` in `AppUtil`/`useAppStorage.ts:142` |

Android/iOS packages are DECLARED; no `android/`/`ios/` dirs committed
(NOT_FOUND) so manifest/Info.plist/Pods claims are UNKNOWN until `cap add`.

## 3. Wrapper pattern (VERIFIED)

Shared composables abstract plugins: `useDevice` (Device/SafeArea/Security),
`useFileSystem` (active Camera/Filesystem/Media path), `useNotification`
(Push/FCM), `useTheme` (StatusBar), `useAppStorage`+`StorageUtil`
(Preferences). Reuse them; no new architecture without a task.

## 4. Platform guard (VERIFIED)

`useDevice().isWeb()` (`Device.getInfo().platform == 'web'`,
`useDevice.ts:39-44`) is used where behavior differs by platform.
`Preferences` and `Camera.getPhoto` also have web paths; `PushNotifications`
registration is skipped on web. Before adding a call, check the operation's
platform support, existing wrapper, permission path, and fallback. Do not
assume the current wrappers gate every call.

## 5. Future install/update checklist

Capacitor 8 compat → pnpm pin → Android permissions/Gradle → iOS
Info.plist/entitlements/Pods → `cap sync` need → device runtime proof. Do not
sync during docs tasks.
