# FILES_MEDIA — Detailed Reference

Authoritative home for file/media rules. Entry:
`.agents/skills/mobile-files-media/SKILL.md`.

## 1. Capture/pick (VERIFIED — active path)

- `onTakePicture()`: `Camera.getPhoto({quality 99, allowEditing false,
  saveToGallery false, resultType Uri, source Camera, webUseInput true, …})`
  (`:207-232`); single pick `takePickSiglePicture()` (Photos source,
  quality 100, `:251-280`); multi `pickImages({quality 100, limit})`
  (`:281-302`). Web paths converted via `urlToBlob` → `ChoosePhotoItem`
  (`:303-311`).
- Permissions helpers: `request/checkCameraPermissions`,
  `request/checkFileSystemPermissions`, all `isWeb()`-guarded (`:312-355`).
- `src/composables/useCamera.ts` offers `takePhoto`,
  `chooseFromGallery`, video capture/playback and HEIC conversion. It is
  currently unreferenced by `src/` imports. Do not replace the active picker
  path without tracing consumers and testing the new API per platform.

## 2. Save to gallery (VERIFIED, native-only)

`savePicture/saveFile → saveProcess`: base64 → `Filesystem.writeFile
({directory: Directory.Data})` → `Media.savePhoto({path: uri,
albumIdentifier: ensureDemoAlbum(), …})` into `AppAlbumName` album
(`:120-205`, `:17-41`). Web: `savePicture`/`saveFile` hand the file to the
browser as a download via `downloadFromBlob` (`:120-159`). Android album-path
workaround noted in comments (`:38-40`). `saveProcess` awaits
`Media.savePhoto` and throws on failure (`:161-195`), so a returned result
means the gallery save succeeded.

## 3. Download/open/share (VERIFIED)

`useFileDownload.ts`: `Capacitor` platform check + `Filesystem` +
community `FileOpener.open({…})` (`:2-5,226`) + `Share.share`. Confirm MIME,
filename, and user-visible location per platform.

## 4. Upload (VERIFIED)

`useUpload.ts:14-15,89-197`: defaults to 1 MB chunks and `MAX_RETRIES = 1`;
callers can override `chunkSize` and `maxRetries`. For each chunk it sends
`FormData` with `FileUploadKey`, `originalFilename`, `chunkFilename`,
`chunkNumber` (one-based), and `totalChunks` to
`POST /api/fileManager/uploadChunkApi` on the CDN base URL. It then sends a
merge DTO to `POST /api/fileManager/mergeChunkApi` (`FileManagerService.ts:41-61`).
`uploadedChunks` is in-memory and cleared when an upload starts; there is no
verified restart-safe resume or delay between retries. Check caller behavior
for partial upload, thumbnail, and merge failure.

## 5. Security

Validate paths/MIME/filenames; never trust `file://`/`content://`/blob URIs
interchangeably across Android/iOS/Web; keep permissions minimal.
