# API_INTEGRATION_CONTRACT — Frontend Usage Log

Backend (Spring Boot) is a separate repo — this file logs what the mobile app
actually calls. Do not invent backend behavior.

## Client (VERIFIED_FRONTEND_USAGE — `src/plugins/axios.ts`)

baseURL `VITE_API_BASE_URL`, `withCredentials:true`,
timeout `VITE_API_TIMOUT||180s`, `Accept-Apiclient`, `validateStatus<400`,
`json-bigint` for `\d{16,}`. Request: `Bearer` + `X-User-ID` +
`Accept-Language`. 401 → refresh queue; 403 → logout + `/auth/login`.

## Verified call-sites

| Method | Path | Caller | Class |
| ------ | ---- | ------ | ----- |
| GET | `/api/appUser/currentUserData` | `authenStore.initialAuthDataProcess` (`stores/authenStore.ts:44-47`) | VERIFIED_FRONTEND_USAGE |
| POST | `/api/auth/refreshToken` `{refreshToken:{refreshToken}}` | axios interceptor (`plugins/axios.ts:135-139`) | VERIFIED_FRONTEND_USAGE |
| POST | signin/signout (via `AuthenService.singin/singoutToServer`) | `useAuthen.ts:28,77-83,118-121` | VERIFIED_FRONTEND_USAGE (exact paths per `src/api/AuthenService.ts` — confirm before quoting) |
| POST | `uploadChunkApi` / `mergeChunkApi` (via `FileManagerService`) | `useFileUpload.ts:7,67` | VERIFIED_FRONTEND_USAGE (exact paths per service file) |
| POST/PUT | `refreshFcmToken`, `updateFcmSetting`, `findCountAllNotRead`, `updateReadNotify` (via `UserNotifyService`) | `useNotification.ts:15-20` | VERIFIED_FRONTEND_USAGE (exact paths per service file) |

## Assumptions (UNVERIFIED_BACKEND_ASSUMPTION)

Response DTO shapes (`UserDto`, `RefreshTokenResponse`, pagination, error
envelopes, date/bigint formats) are inferred from frontend types
(`src/types/`) — confirm against backend/spec before treating as contract.
No secrets are recorded here; env keys without values only.
