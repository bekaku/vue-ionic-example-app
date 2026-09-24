# Task: Migrate HTTP calls from axios/useAxios to useApi (fetch)

## Metadata

- Task ID: migrate-axios-to-useapi
- Status: VERIFYING
- Priority: Medium
- Created: 2026-09-24
- Updated: 2026-09-24

## Objective

Move every app HTTP call to the new ofetch-style `useApi()` composable
(`src/composables/useApi.ts`, native `fetch`). `src/plugins/axios.ts` and
`src/composables/useAxios.ts` are kept (not deleted) per user request.

## Scope

- `src/api/*Service.ts` (7 services), `usePageFetch.ts`, `useFileDownload.ts`,
  `stores/authenStore.ts`, `pages/auth/forgot-password.vue`,
  `components/base/BasePdfView.vue`, `utils/FileUtils.ts`, `types/common.ts`.

## Out of Scope

- (Follow-up done 2026-09-24) axios removed: deleted `plugins/axios.ts`,
  `plugins/AxiosSymbols.ts`, `useAxios.ts`, `use-axios.vue` + route/nav,
  `main.ts` `provide(AxiosKey)`, types `RequestType`/`DefaultAxiosInstance`,
  `pnpm remove axios` (package.json + lockfile).

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-api
- [x] mobile-auth (token refresh path moved into useApi)
- [x] mobile-files-media (download/CDN fetch)

## Implementation Summary

- `useApi` parity with axios: `withCredentials:false` → `credentials:'same-origin'`,
  `Accept-Apiclient`, `Accept-Language`, `Bearer` + `X-User-ID`,
  `X-Sync-Active` (from useAxios), json-bigint, status ≥ 400 throws,
  401 → shared refresh (`POST /api/auth/refreshTokenApi`), refresh 403 →
  `removeAuthToken()` + `/auth/login`. Added `onDownloadProgress`.
- `callAxios<T>(req)` → `api<T>(url, { method, body, baseURL })`; URLs and
  bodies kept byte-identical. `multipart/form-data` header dropped for
  `FormData` (browser sets boundary).
- `callAxiosProcess` (forgot password) → `api.raw` returning the 4xx response
  instead of throwing, so the page's existing error branches run
  (`res.data` → `res._data`).
- `fethCdnData` `'axiosresponse'` → `'response'` (`ResponseDataType`);
  `getBlobFromAxiosResponse`/`getFileNameFromAxiosResponse` →
  `getBlobUrlFromResponse`/`getFileNameFromResponse` (sync; fixes missing
  `await` in `BasePdfView`).
- Demo page `pages/example/composables/use-api.vue` (route + nav "useApi").
- `useApi` dev log reduced to url/method/status (was logging options incl.
  refresh-token body).
- Agent docs updated to `useApi`: `AGENTS.md` §9, `SKILLS`-routed
  `.agents/skills/mobile-api`, `mobile-auth`, `skills/mobile/API.md`,
  `AUTH.md`, `SKILL.md`, `docs/agent/API_INTEGRATION_CONTRACT.md`,
  `MOBILE_ARCHITECTURE.md`, `PROJECT_REFERENCE.md`, `KNOWN_ISSUES.md`
  (#18–19 → LEGACY, new #22).

## Platform Impact Assessment

- [x] Android
- [x] iOS
- [x] Web
- [x] Shared code

## Native Plugin Impact

- [x] No native plugin changes

## API Contract Impact

- [x] No API changes (same method/path/body; VERIFIED_FRONTEND_USAGE)

Details: `Content-Type: application/json` is no longer sent on body-less
GET/PUT/DELETE requests — UNVERIFIED_BACKEND_ASSUMPTION that the backend
does not require it.

## Local Data Impact

- [x] No local data changes (same Preferences token keys via useAppStorage)

## Testing and Verification

- Static: ESLint on changed files PASSED (0 errors; pre-existing unused-var
  warnings). `vue-tsc`: no errors in changed files; project total 109
  (baseline 110, pre-existing errors elsewhere).
- Unit: FAILED (pre-existing) — `tests/unit/example.spec.ts` imports missing
  `@/views/Tab1Page.vue`; unrelated to this change.
- Web build (`vite build`): PASSED
- Web runtime (login, refresh, upload, CDN image/PDF, download): NOT_RUN
- Android build / emulator / device: NOT_RUN
- iOS build / simulator / device: NOT_RUN

## Risks

- fetch on native WebView is subject to CORS (axios XHR was too); verify
  against real API + CDN on device.
- Download progress needs `Content-Length` from the server.

## Final Summary

Implementation complete; runtime verification on web/Android/iOS pending.
