# FILES_MEDIA — Detailed Reference

Authoritative home for file/media rules. Entry:
`.agents/skills/mobile-files-media/SKILL.md`.

## 1. Capture/pick (VERIFIED — active paths)

Two picker paths exist; use the one the consuming UI already uses.

- `BaseChoosePhoto.vue` › `takePicture/pickPhoto/pickVideo/recordVideo`
  calls `useCamera` (not `useFileSystem`): its `onTakePicture/onPickPhoto/
  onPickVideo/onRecordVideo` (backed by the `Camera.takePhoto` /
  `chooseFromGallery` / `recordVideo` plugin methods) → `FileManager` via
  `getFileFromResult`
  (HEIC/HEIF → JPEG via `heic-to`, snowflake `uniqueId`, size/dimensions/
  duration/thumbnail mapping). Props `multiple/limit/choices/icon/label/
  fullWidth` (+ declared-but-unused `forWeb`), `v-model FileManager[]`,
  emits `on-change` (the other four declared emits are commented out at the
  send sites); video picks
  validate `LIMIT_VDO_SIZE` / `LIMIT_VIDEO_SECOND` and materialize
  `thumbnailFile` (`initialFileVdo`). Choice UI is a `BaseModal` + `IonList`
  sheet. Consumed by avatar/cover settings and the file-picker /
  image-cropper examples.
- `useFileSystem.ts` photo helpers (`onTakePicture`, `onPickPhoto`,
  `takePickSiglePicture`, `pickPhotoAlbum` via `Camera.getPhoto` /
  `Camera.pickImages` → `ChoosePhotoItem`) have no `src/` import caller at
  this review; do not wire new UI to them without tracing consumers and
  testing per platform. Its active `src/` usage is gallery save/permissions
  (§2, `BaseImageView`, `BaseFileView`).
- Permission helpers (`request/checkCameraPermissions`,
  `request/checkFileSystemPermissions`) are `isWeb()`-guarded.

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

Viewing chain (VERIFIED): `BaseFileItems` (`layout` grid/list, `limit`
0 = all, `showViewDialog`, `+N` remaining overlay) → tap opens
`BaseFileView` (`v-model:show`, `item`, `image-list`, `select-index`),
which routes by `getFileType(file.fileMime)`: `pdf` →
`BasePdfViewDialog` (direct `filePath`, or a local `File` blob —
`BaseFileView` never passes `:fetch`, so `fethCdnData` only runs when a
caller sets `fetch` on `BasePdfView` directly);
`image` → `BaseImageViewDialog` (single item, or the full `image-list`
for swipe); other types → permission-gated `downloadDocument` (only when
`fetch`). `BaseImageView` (`files`/`images`, `fetch`, `dark`,
`height`/`width`) renders a zoomable swiper, fetching remote sources
through `fethCdnData` + `useBlobUrls().track`, exposing
`onNext/onPrev/zoomIn/zoomOut/onDelete/onDownload/onShare`.
`BasePdfView` (`src`, `fetch`, `isBlob`, `showDownload`/`showShare`)
renders `BasePdfViewCore` with a scale/page toolbar, fetching via
`fethCdnData(src, 'response')` → `track(getBlobUrlFromResponse(...))`.
Demo: `src/pages/example/image-view.vue` (grid/list/slide/mix from
`libs/data` › `imageItemsData`/`pdfItemsData`).

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
