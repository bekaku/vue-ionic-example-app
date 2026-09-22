# NATIVE_PLUGIN_INVENTORY — Verified Matrix (Capacitor 8.3.4 core)

Legend: ACTIVE = import + init + call-site in `src/`; CONFIGURED_ONLY =
config without usage; UNUSED = declared, no usage; LEGACY = superseded.

| Plugin | Installed | Purpose | Android | iOS | Web | Init / Permissions | Relevant files | Limitations / Evidence |
| ------ | --------- | ------- | ------- | --- | --- | ------------------ | -------------- | ---------------------- |
| `App` | 8.1.0 | state, exit | yes* | yes* | stub | `addListener appStateChange`, `exitApp` | `App.vue:7,33,43`; `useAxios.ts:5` | *native proof needs device; no native dirs |
| `Device` | 8.0.2 | info/id/platform | yes* | yes* | yes | `getInfo/getId` | `useDevice.ts:1`; `AppUtil.ts:4` | `isWeb()` = platform=='web' |
| `Preferences` | 8.0.1 | all local data | yes* | yes* | yes | no perm | `StorageUtil.ts:1`; `useAppStorage.ts:5` | no encryption |
| `Camera` | 8.2.0 | capture/pick | yes* | yes* | input fallback | `getPhoto/pickImages/request+check` + `webUseInput` | `useFileSystem.ts:7,208-302` | permissions UNKNOWN natively |
| `Filesystem` | 8.1.2 | write app files | yes* | yes* | limited | `writeFile Directory.Data`, `request/checkPermissions` | `useFileSystem.ts:8,174`; `useFileDownload.ts:4` | scoped-storage rules unverified |
| `PushNotifications` | 8.1.1 | push | yes* | yes* | no-op | `check/request/register/unregister`, 4 listeners; config `presentationOptions: []` | `useNotification.ts`; `capacitor.config.ts:25-28` | channels/capabilities UNKNOWN |
| `@capacitor-community/fcm` | 8.1.0 | topics/instance | yes* | yes* | n/a | `subscribeTo/unsubscribeFrom/deleteInstance` | `useNotification.ts:6,288-324` | version vs core: verify on update |
| `@capacitor-community/file-opener` | 8.0.1 | open downloads | yes* | yes* | n/a | `FileOpener.open` | `useFileDownload.ts:2,226` | MIME handling per file |
| `@capacitor-community/media` | 9.1.0 | gallery save | yes* | yes* | no-op | `getAlbums/createAlbum/savePhoto` → `AppAlbumName` | `useFileSystem.ts:5-6,18-41` | core-9-range plugin on core-8 project — verify on update |
| `Share` | 8.0.1 | share | yes* | yes* | limited | `Share.share` | `useFileDownload.ts:5` | — |
| `Clipboard` | 8.0.1 | copy | yes* | yes* | yes | direct call | `useBase.ts:14` | — |
| `StatusBar` | 8.0.2 | style/color | yes* | yes* | no-op | `setStyle/setBackgroundColor` | `useTheme.ts:6,30-99`; `login.vue:24-62` | — |
| `device-security-detect` | 8.0.0 | root/jailbreak | yes* | yes* | guarded false | `isJailBreakOrRooted` | `useDevice.ts:8,79` |绕行 risk: client-side only |
| `safe-area` | 5.0.0 | insets | yes* | yes* | n/a | `getSafeAreaInsets`; edge-to-edge SDK≥35 | `useDevice.ts:9,82-122` | iOS visual proof missing |
| `Keyboard` | 8.0.3 | resize/style | yes* | yes* | n/a | config `resize: Body` | `capacitor.config.ts:20-24` | CONFIGURED_ONLY, no src import |
| `Haptics` | 8.0.2 | haptics | yes* | yes* | n/a | none | `package.json:29` only | UNUSED |
| `cordova-plugin-file` | 8.1.3 | legacy file | UNKNOWN | UNKNOWN | n/a | `cordovaClearCach` | `package.json:45`; `AppUtil`; `useAppStorage.ts:142` | LEGACY |

`*` Native support per plugin docs; repo has no `android/`/`ios/` to confirm
manifests, Info.plist, Pods — classify native config UNKNOWN until `cap add`.
