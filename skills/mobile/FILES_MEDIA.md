# FILES_MEDIA — Detailed Reference

Authoritative home for file/media rules. Entry:
`.agents/skills/mobile-files-media/SKILL.md`.

## 1. Capture/pick (VERIFIED — active path)

Symbols below are in `useFileSystem.ts` unless noted.

- `onTakePicture()`: `Camera.getPhoto({quality 99, allowEditing false,
  saveToGallery false, resultType Uri, source Camera, webUseInput true, …})`;
  `onPickPhoto(multiple, limit)` dispatches to single `takePickSiglePicture()`
  (Photos source, quality 100) or multi `pickPhotoAlbum(limit)`
  (`Camera.pickImages`). Web paths converted by `getFileFromWebPath`
  (`urlToBlob`) → `ChoosePhotoItem`.
- Permissions helpers: `request/checkCameraPermissions`,
  `request/checkFileSystemPermissions`, all `isWeb()`-guarded.
- `src/composables/useCamera.ts` offers `takePhoto`,
  `chooseFromGallery`, video capture/playback and HEIC conversion. It is
  currently unreferenced by `src/` imports. Do not replace the active picker
  path without tracing consumers and testing the new API per platform.

## 2. Save to gallery (VERIFIED, native-only)

`savePicture`/`saveFile` → `saveProcess`: base64 → `Filesystem.writeFile
({directory: Directory.Data})` → `Media.savePhoto({path: uri,
albumIdentifier: ensureDemoAlbum(), …})` into `AppAlbumName` album
(`createAlbumIfNotExist`, `ensureDemoAlbum`). Web: `savePicture`/`saveFile`
hand the file to the browser as a download via `downloadFromBlob`. Android
album-path workaround noted in comments near `ensureDemoAlbum`. `saveProcess`
awaits `Media.savePhoto` and throws on failure, so a returned result means the
gallery save succeeded. (A commented-out older `savePicture` sits above the
active one — edit the active one.)

## 3. Download/open/share (VERIFIED)

`useFileDownload.ts` › `downloadFile` fetches via `useApi` (`responseType:
'blob'`, `onDownloadProgress`, `baseURL: ''`) → `Filesystem.writeFile`
(`Directory.Documents`); `openFile` → community `FileOpener.open`,
`shareFile` → `Share.share`. Wrappers: `downloadImage`, `downloadPDF`,
`downloadDocument`, `downloadAndShareFile`. Use these for user downloads
(`BaseFileView`, `BasePdfView`, `BaseImageView`). Confirm MIME, filename, and
user-visible location per platform.

Viewing remote files: `FileManagerService.fethCdnData(path, 'blob' |
'arraybuffer' | 'response')` returns a blob URL / buffer / raw response;
release blob URLs with `useBlobUrls().track` (auto-revoked on unmount).

## 4. Upload (VERIFIED)

`useUpload.ts:14-15,89-197`: defaults to 1 MB chunks and `MAX_RETRIES = 1`;
callers can override `chunkSize` and `maxRetries`. For each chunk it sends
`FormData` with `FileUploadKey`, `originalFilename`, `chunkFilename`,
`chunkNumber` (one-based), and `totalChunks` to
`POST /api/fileManager/uploadChunkApi` on the CDN base URL. It then sends a
merge DTO to `POST /api/fileManager/mergeChunkApi` (`FileManagerService.ts` ›
`uploadChunkApi`, `mergeChunkApi`).
`uploadedChunks` is in-memory and cleared when an upload starts; there is no
verified restart-safe resume or delay between retries. Check caller behavior
for partial upload, thumbnail, and merge failure.

## 5. Security

Validate paths/MIME/filenames; never trust `file://`/`content://`/blob URIs
interchangeably across Android/iOS/Web; keep permissions minimal.
