# API_INTEGRATION_CONTRACT — Frontend Usage Log

Backend (Spring Boot) is a separate repo — this file logs what the mobile app
actually calls. Do not invent backend behavior.

## Client (VERIFIED_FRONTEND_USAGE — `src/composables/useApi.ts`)

Native `fetch`; baseURL `VITE_API_BASE_URL`, `credentials:'same-origin'`
(= axios `withCredentials:false`), timeout `VITE_API_TIMOUT||180s`,
`Accept-Apiclient`, status ≥ 400 throws, `json-bigint` for `\d{16,}`.
Request: `Bearer` + `X-User-ID` + `Accept-Language` + `X-Sync-Active`.
401 → shared refresh; refresh request returning 403 → remove token +
`/auth/login` (`useApi.ts:305-373`). Details: `skills/mobile/API.md` §1.
Migrated from `src/plugins/axios.ts` on 2026-09-24
(`tasks/migrate-axios-to-useapi.md`).

## Verified call-sites

| Method | Path | Caller | Class |
| ------ | ---- | ------ | ----- |
| GET | `/api/appUser/currentUserData` | `authenStore.initialAuthDataProcess` (`stores/authenStore.ts:42`) | VERIFIED_FRONTEND_USAGE |
| POST | `/api/auth/refreshTokenApi` `{refreshToken}` | `src/composables/useApi.ts:305-312` | VERIFIED_FRONTEND_USAGE |
| POST | `/api/auth/loginApi`, `/api/auth/logoutApi` | `src/api/AuthenService.ts:27,33`; `src/composables/useAuthen.ts:77-83,118-121` | VERIFIED_FRONTEND_USAGE |
| POST | `/api/fileManager/uploadChunkApi` (`FormData`), `/api/fileManager/mergeChunkApi` (DTO), CDN base URL | `src/composables/useUpload.ts:121-127,167-192`; `src/api/FileManagerService.ts:29-36` | VERIFIED_FRONTEND_USAGE |
| POST/PUT | `refreshFcmToken`, `updateFcmSetting`, `findCountAllNotRead`, `updateReadNotify` (via `UserNotifyService`) | `useNotification.ts:15-20` | VERIFIED_FRONTEND_USAGE (exact paths per service file) |

## Assumptions (UNVERIFIED_BACKEND_ASSUMPTION)

Response DTO shapes (`UserDto`, `RefreshTokenResponse`, pagination, error
envelopes, date/bigint formats) are inferred from frontend types
(`src/types/`) — confirm against backend/spec before treating as contract.
No secrets are recorded here; env keys without values only.
Since the fetch migration, body-less requests no longer send
`Content-Type: application/json` (UNVERIFIED_BACKEND_ASSUMPTION that the
backend does not require it). axios removed 2026-09-24. Never copy token
values into audit output.
