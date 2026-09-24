---
name: mobile-files-media
description: >
  Use this skill when working on camera, gallery, file pick/upload/download,
  file preview, sharing, or filesystem-backed media. For Preferences keys,
  use mobile-local-data.
---

# mobile-files-media — Canonical Skill

## Purpose

Enforce the verified file/media pipeline with platform-safe URI handling.

## When to use

Camera capture, photo picking, chunked upload, download/open/share, save to
gallery, permissions, scoped-storage/sandbox paths.

## Required reading

- `skills/mobile/FILES_MEDIA.md`

## Relevant project locations

- `src/composables/useFileSystem.ts` (active picker/save path),
  `src/composables/useUpload.ts` (active upload path)
- `src/composables/useCamera.ts` (currently no import callers)
- `src/composables/useFileDownload.ts`, `src/utils/FileUtils.ts`
- `src/api/FileManagerService.ts`

## Mandatory rules

1. Camera: `getPhoto` Uri + `webUseInput`, `pickImages`; never assume gallery
   save works on web (explicit TODO/no-op).
2. Save pipeline: base64 → `Filesystem.writeFile` (`Directory.Data`) →
   `Media.savePhoto` into `AppAlbumName` album.
3. Upload defaults: 1 MB chunks, one attempt unless `maxRetries` is
   overridden; `FormData` `uploadChunkApi` then merge DTO `mergeChunkApi`.
   In-memory chunk tracking is not restart-safe resume.
4. Validate paths, MIME, filenames; respect scoped storage / sandbox; request
   minimal permissions with `isWeb()` guards.

## Implementation workflow

1. Trace the caller's capture/pick → convert → store/upload → cleanup chain;
   do not assume the unreferenced `useCamera.ts` is the active path.
2. Handle permission-denied, cancel, retry-exhausted, large-file paths.
3. Clean temp files; confirm user-visible export location.
4. Verify per `mobile-testing`, incl. SECURITY (untrusted files).

## Verification

Mocked picker/upload unit tests; real capture/save/share only on device.
