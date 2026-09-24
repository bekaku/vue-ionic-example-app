# NATIVE_PLUGIN_INVENTORY — Source Usage and Declared Plugins

Reviewed against `package.json` and the lockfile importer on 2026-09-24.
Versions can change; confirm both files before plugin work. Native runtime
behavior remains UNKNOWN without an Android/iOS project and device check.

Legend: ACTIVE = import + call-site in `src/`; CONFIGURED_ONLY =
config without usage; UNUSED = declared, no usage; LEGACY = superseded.

| Plugin | Installed | Purpose | Android | iOS | Web | Init / Permissions | Relevant files | Limitations / Evidence |
| ------ | --------- | ------- | ------- | --- | --- | ------------------ | -------------- | ---------------------- |
| `App` | 8.1.1 | state, exit | yes* | yes* | stub | `addListener appStateChange`, `exitApp` | `App.vue` › `onBeforeMount` | *native proof needs device; no native dirs |
| `Device` | 8.0.3 | info/id/platform | yes* | yes* | yes | `getInfo/getId` | `useDevice.ts`; `AppUtil.ts` | `isWeb()` = platform=='web' |
| `Preferences` | 8.0.1 | all local data | yes* | yes* | yes | no perm | `StorageUtil.ts`; `useAppStorage.ts` | no encryption |
| `Camera` | 8.2.4 | capture/pick | yes* | yes* | input fallback | `getPhoto/pickImages/request+check` + `webUseInput` | active `useFileSystem.ts` › `onTakePicture`/`takePickSiglePicture`/`pickPhotoAlbum`; unreferenced `useCamera.ts` | permissions UNKNOWN natively |
| `Filesystem` | 8.1.3 | write app files | yes* | yes* | limited | `writeFile Directory.Data`/`Documents`, `request/checkPermissions` | `useFileSystem.ts` › `saveProcess`; `useFileDownload.ts` › `downloadFile` | scoped-storage rules unverified |
| `PushNotifications` | 8.1.2 | push | yes* | yes* | no-op | `check/request/register/unregister`; 2 active listeners (`registration`, `registrationError`); received/tap listeners defined but not registered; config `presentationOptions: []` | `useNotification.ts` › `addListeners`, `addNotifyListeners`; `capacitor.config.ts` `plugins.PushNotifications` | channels/capabilities UNKNOWN |
| `@capacitor-community/fcm` | 8.1.0 | topics/instance | yes* | yes* | n/a | `subscribeTo/unsubscribeFrom/deleteInstance` | `useNotification.ts` › `subscribeTopic`/`unSubscribeTopic`/`deleteInstance` | version vs core: verify on update |
| `@capacitor-community/file-opener` | 8.0.1 | open downloads | yes* | yes* | n/a | `FileOpener.open` | `useFileDownload.ts` › `openFile` | MIME handling per file |
| `@capacitor-community/media` | 9.1.0 | gallery save | yes* | yes* | browser download | `getAlbums/createAlbum/savePhoto` → `AppAlbumName` | `useFileSystem.ts` › `ensureDemoAlbum`, `saveProcess` | core-9-range plugin on core-8 project — verify on update |
| `Share` | 8.0.2 | share | yes* | yes* | limited | `Share.share` | `useFileDownload.ts` › `shareFile` | — |
| `Clipboard` | 8.0.1 | copy | yes* | yes* | yes | direct call | `useBase.ts` | — |
| `StatusBar` | 8.0.3 | style/color | yes* | yes* | no-op | `setStyle/setBackgroundColor` | `useTheme.ts`; `login.vue` › `onMounted` | — |
| `device-security-detect` | 8.0.0 | root/jailbreak | yes* | yes* | guarded false | `isJailBreakOrRooted` | `useDevice.ts` › `isRootDetected` | client-side check only |
| `safe-area` | 5.0.1 | insets | yes* | yes* | n/a | `getSafeAreaInsets`; edge-to-edge SDK≥35 | `useDevice.ts` › `setSafeArea` | iOS visual proof missing |
| `Keyboard` | 8.0.5 | resize/style | yes* | yes* | n/a | config `resize: Body` | `capacitor.config.ts` `plugins.Keyboard` | CONFIGURED_ONLY, no src import |
| `Haptics` | — | haptics | — | — | n/a | none | removed from `package.json` 2026-09-24 | REMOVED |
| `cordova-plugin-file` | 8.1.3 | cache clear | UNKNOWN | UNKNOWN | n/a | `window.cordova.file` | `AppUtil.ts` › `cacheClear`, via `useAppStorage.ts` › `onClearAllToken` | LEGACY but still called on logout |

`*` Source paths target native behavior; no Android/iOS runtime result is
recorded here. The repo has no `android/`/`ios/` to confirm manifests,
Info.plist, or Pods — classify native config UNKNOWN until inspected.
