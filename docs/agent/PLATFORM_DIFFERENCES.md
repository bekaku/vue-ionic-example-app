# PLATFORM_DIFFERENCES — Verified Android / iOS / Web

No `android/`/`ios/` committed — manifest/Info.plist/Pod claims are UNKNOWN
until `npx cap add` + inspection. Below is only what `src/` + config prove.

| Area | Android (VERIFIED) | iOS (VERIFIED) | Web (VERIFIED fallback) |
| ---- | ------------------ | -------------- | ----------------------- |
| App mode | `mode:'ios'` forced (`main.ts:41`) | same | same |
| Back button | `useBackButton(-1)` confirm-exit (`App.vue:38-46`) | `swipeBackEnabled:false`; gesture UNKNOWN | browser back via history |
| Safe area | edge-to-edge + `--app-safe-area-*` when SDK≥35 (`useDevice.ts:91-97`) | inset fetch, visual proof UNKNOWN | n/a |
| StatusBar | `setStyle/setBackgroundColor` (`useTheme.ts`) | same calls; visual proof UNKNOWN | no-op |
| Notifications | register flow; channels UNKNOWN | permission flow; capabilities UNKNOWN | `isWeb()` → false/no-op |
| Camera/gallery | `getPhoto/pickImages` + Media album (`AppAlbumName`); perms UNKNOWN natively | same calls; NS keys UNKNOWN | `webUseInput` / file input |
| Filesystem | `Directory.Data` write; scoped-storage UNKNOWN | sandbox path UNKNOWN | limited / TODO no-op |
| Save-to-gallery | `Media.savePhoto` (+ album workaround comment) | same calls; proof missing | explicit TODO no-op |
| Storage | Preferences | Preferences | Preferences (IndexedDB-backed by plugin) |
| Network | `androidScheme https`, `cleartext:true`, `allowMixedContent:true` | ATS behavior UNKNOWN | CORS applies |
| Root/jailbreak | `isJailBreakOrRooted` (client hint) | same | always false |

Rule: never claim parity; record per-platform results separately.
