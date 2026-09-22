# FILES_MEDIA — Detailed Reference

Authoritative home for file/media rules. Entry:
`.agents/skills/mobile-files-media/SKILL.md`.

## 1. Capture/pick (VERIFIED — `useFileSystem.ts`)

- `onTakePicture()`: `Camera.getPhoto({quality 99, allowEditing false,
  saveToGallery false, resultType Uri, source Camera, webUseInput true, …})`
  (`:207-232`); single pick `takePickSiglePicture()` (Photos source,
  quality 100, `:251-280`); multi `pickImages({quality 100, limit})`
  (`:281-302`). Web paths converted via `urlToBlob` → `ChoosePhotoItem`
  (`:303-311`).
- Permissions helpers: `request/checkCameraPermissions`,
  `request/checkFileSystemPermissions`, all `isWeb()`-guarded (`:312-355`).

## 2. Save to gallery (VERIFIED, native-only)

`savePicture/saveFile → saveProcess`: base64 → `Filesystem.writeFile
({directory: Directory.Data})` → `Media.savePhoto({path: uri,
albumIdentifier: ensureDemoAlbum(), …})` into `AppAlbumName` album
(`:120-205`, `:17-41`). Web is an explicit TODO no-op returning empty paths
(`:124-132,146-153`). Android album-path workaround noted in comments
(`:38-40`).

## 3. Download/open/share (VERIFIED)

`useFileDownload.ts`: `Capacitor` platform check + `Filesystem` +
community `FileOpener.open({…})` (`:2-5,226`) + `Share.share`. Confirm MIME,
filename, and user-visible location per platform.

## 4. Upload (VERIFIED)

`useFileUpload.ts`: 1 MB `chunkSize`, `maxRetries = 3`, per-chunk
`uploadChunkApi(chunk, index, total, filename, chunkFileName)` with 1s
backoff (`:13-14,64-80`), then `mergeChunkApi`. Chunked ≠ resumable without
server-side proof; track `uploadedChunks`/`chunkFileName` as implemented.

## 5. Security

Validate paths/MIME/filenames; never trust `file://`/`content://`/blob URIs
interchangeably across Android/iOS/Web; keep permissions minimal.
