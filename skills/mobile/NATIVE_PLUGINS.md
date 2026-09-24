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
| `App` | ACTIVE | `App.vue` › `onBeforeMount` (`appStateChange`, `exitApp`) |
| `Device` | ACTIVE | `useDevice.ts` (`isWeb`, `getInfo`); `AppUtil.ts` |
| `Preferences` | ACTIVE | `StorageUtil.ts`; `useAppStorage.ts` |
| `Camera` | ACTIVE via `useFileSystem` | `useFileSystem.ts` › `onTakePicture`, `takePickSiglePicture`, `pickPhotoAlbum`; `useCamera.ts` is unreferenced |
| `Filesystem` | ACTIVE | `useFileSystem.ts` › `saveProcess`; `useFileDownload.ts` › `downloadFile` |
| `PushNotifications` | ACTIVE (registration only) | `useNotification.ts` › `registerNotifications`, `addListeners`; config `presentationOptions: []` |
| `@capacitor-community/fcm` | ACTIVE | `useNotification.ts` › `subscribeTopic`, `unSubscribeTopic`, `deleteInstance` |
| `@capacitor-community/file-opener` | ACTIVE | `useFileDownload.ts` › `openFile` |
| `@capacitor-community/media` | ACTIVE | `useFileSystem.ts` › `createAlbumIfNotExist`, `ensureDemoAlbum`, `saveProcess` |
| `Share` | ACTIVE | `useFileDownload.ts` › `shareFile` |
| `Clipboard` | ACTIVE | `useBase.ts` (copy helper) |
| `StatusBar` | ACTIVE | `useTheme.ts` |
| `@capacitor-community/device-security-detect` | ACTIVE | `useDevice.ts` › `isRootDetected` |
| `capacitor-plugin-safe-area` | ACTIVE | `useDevice.ts` › `setSafeArea` |
| `Keyboard` | CONFIGURED_ONLY | `capacitor.config.ts` `plugins.Keyboard`; no `src` import (NOT_FOUND) |
| `Haptics` | REMOVED | `pnpm remove @capacitor/haptics` 2026-09-24 |
| `cordova-plugin-file` | LEGACY (still used) | `AppUtil.ts` › `cacheClear` → `window.cordova.file`, called from `useAppStorage.ts` › `onClearAllToken` |

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
