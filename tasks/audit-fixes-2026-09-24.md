# Task: Project audit fixes (2026-09-24)

## Metadata

- Task ID: audit-fixes-2026-09-24
- Status: VERIFYING
- Priority: High
- Created: 2026-09-24
- Updated: 2026-09-24

## Objective

Fix the audit findings that need no product decision or unknown backend
contract; log the rest in `docs/agent/KNOWN_ISSUES.md` (#23–26).

## Implementation Summary

- Security: removed full-token log (`pages/auth/login.vue`) and FCM token logs
  (`useNotification.ts`); `capacitor.config.ts` cleartext/mixed content now
  off unless `CAP_ALLOW_HTTP=true`; `BaseContentHtml` escapes `highLightText`
  before injecting into `v-html`.
- Push: `addListeners` keeps listener handles module-level, removes them
  before re-adding, serializes calls (no more stacked `registration`
  listeners).
- Files: `BaseFileView` download now uses `useFileDownload.downloadDocument`
  (old `downloadCdnData` never saved; removed). New `useBlobUrls` revokes blob
  URLs in `BaseImage`, `BaseAvatar`, `BaseImageView`, `BasePdfView`.
  `BaseAvatar` no longer overwrites the fetched blob with `src` and no longer
  fetches twice; `BaseImage` dropped `document.querySelector('img')`.
  `useFileSystem` web save → browser download; `saveProcess` awaits
  `Media.savePhoto`.
- Deps: removed `install`, `js-cookie`, `sanitize-html`,
  `@types/sanitize-html`, `animate.css`, `@capacitor/haptics`; `pinia` moved to
  dependencies. Kept `cordova-plugin-file` (used via `window.cordova.file`).
- Dead code: deleted `utils/InjectTyped.ts`, type `IMethod`.
- Tests: `tests/unit/useApi.spec.ts` (7 tests).

## Not changed (needs decision / contract)

- #23 missing pages (`/post/view`, `/user/view`, `/notifications`, `/hashtag`,
  menu routes), #24 `addNotifyListeners` never called, #25 stubbed services,
  #26 untracked `useCamera.ts`, #10 secure token storage (needs native plugin).

## Platform Impact Assessment

- [x] Android (cleartext/mixed content, haptics removal → `npx cap sync`)
- [x] iOS (haptics removal → `npx cap sync`)
- [x] Web (web save download)
- [x] Shared code

## Native Plugin Impact

- [x] Existing plugin modified (`@capacitor/haptics` removed)
- [x] Capacitor sync required
- [x] Android configuration required (`cleartext`/`allowMixedContent` gated)

## API Contract Impact

- [x] No API changes

## Local Data Impact

- [x] No local data changes

## Testing and Verification

- Static (`vue-tsc --noEmit`): PASSED (0 errors)
- Unit (`pnpm exec vitest run`): PASSED (7/7, `useApi`)
- Web build (`vite build`): PASSED
- Web runtime: NOT_RUN
- Android build / device: NOT_RUN
- iOS build / device: NOT_RUN

## Risks

- Dev builds against an `http://` API on device now need
  `CAP_ALLOW_HTTP=true npx cap sync`.
- Push registration listener behavior needs device verification.
