# NATIVE_PLUGINS — Detailed Reference

Authoritative home for Capacitor plugin rules. Entry:
`.agents/skills/mobile-native-plugins/SKILL.md`. Inventory:
`docs/agent/NATIVE_PLUGIN_INVENTORY.md`.

## 1. Classification method

A plugin is ACTIVE only with import + initialization + call-site evidence in
`src/` plus config where required. `package.json` presence alone =
DECLARED, never ACTIVE.

## 2. Verified matrix (Capacitor 8.3.4 core)

| Plugin | Verdict | Evidence |
| ------ | ------- | -------- |
| `App` 8.1.0 | ACTIVE (Android/iOS/Web*) | `App.vue:7,33,43`; `useAxios.ts:5` |
| `Device` 8.0.2 | ACTIVE | `useDevice.ts:1`; `AppUtil.ts:4` |
| `Preferences` 8.0.1 | ACTIVE | `StorageUtil.ts:1`; `useAppStorage.ts:5` |
| `Camera` 8.2.0 | ACTIVE | `useFileSystem.ts:7,208-302` |
| `Filesystem` 8.1.2 | ACTIVE | `useFileSystem.ts:8`; `useFileDownload.ts:4` |
| `PushNotifications` 8.1.1 | ACTIVE | `useNotification.ts:7`; config `presentationOptions: []` |
| `@capacitor-community/fcm` 8.1.0 | ACTIVE | `useNotification.ts:6,288-310` |
| `@capacitor-community/file-opener` 8.0.1 | ACTIVE | `useFileDownload.ts:2,226` |
| `@capacitor-community/media` 9.1.0 | ACTIVE | `useFileSystem.ts:5-6,18-41` |
| `Share` 8.0.1 | ACTIVE | `useFileDownload.ts:5` |
| `Clipboard` 8.0.1 | ACTIVE | `useBase.ts:14` |
| `StatusBar` 8.0.2 | ACTIVE | `useTheme.ts:6,30-99` |
| `@capacitor-community/device-security-detect` 8.0.0 | ACTIVE | `useDevice.ts:8,79` |
| `capacitor-plugin-safe-area` 5.0.0 | ACTIVE | `useDevice.ts:9,84` |
| `Keyboard` 8.0.3 | CONFIGURED_ONLY | `capacitor.config.ts:20-24`; no `src` import (NOT_FOUND) |
| `Haptics` 8.0.2 | UNUSED | declared; no `src` import (NOT_FOUND) |
| `cordova-plugin-file` 8.1.3 | LEGACY | declared; `cordovaClearCach` in `AppUtil`/`useAppStorage.ts:142` |

Android/iOS packages `8.3.4` are DECLARED; no `android/`/`ios/` dirs committed
(NOT_FOUND) so manifest/Info.plist/Pods claims are UNKNOWN until `cap add`.

## 3. Wrapper pattern (VERIFIED)

Shared composables abstract plugins: `useDevice` (Device/SafeArea/Security),
`useFileSystem` (Camera/Filesystem/Media), `useNotification`
(Push/FCM), `useTheme` (StatusBar), `useAppStorage`+`StorageUtil`
(Preferences). Reuse them; no new architecture without a task.

## 4. Platform guard (VERIFIED)

`useDevice().isWeb()` (`Device.getInfo().platform == 'web'`,
`useDevice.ts:39-44`) gates every native call with a web fallback/no-op
pattern (notifications, save-to-gallery TODO, permission requests). Never call
native APIs unguarded.

## 5. Future install/update checklist

Capacitor 8 compat → pnpm pin → Android permissions/Gradle → iOS
Info.plist/entitlements/Pods → `cap sync` need → device runtime proof. Do not
sync during docs tasks.
