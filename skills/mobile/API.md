# API — Detailed Reference

Authoritative home for HTTP/network rules. Entry:
`.agents/skills/mobile-api/SKILL.md`. Contract log:
`docs/agent/API_INTEGRATION_CONTRACT.md`.

## 1. Client (VERIFIED — `src/plugins/axios.ts`)

- `axios.create({baseURL: VITE_API_BASE_URL, withCredentials: true,
  timeout: VITE_API_TIMOUT || 180000,
  headers: {'Content-Type':'application/json','Accept-Apiclient':DefaultApiCLient},
  validateStatus: s => s < 400,
  transformResponse: json-bigint when /\d{16,}/ else JSON.parse})` (`:22-54`).
- Request interceptor (`:76-93`): `Authorization: Bearer <token>`,
  `X-User-ID`, `Accept-Language` from Preferences locale.
- Response interceptor (`:96-164`): non-401/`_retry` → reject; missing token →
  reject; token VALID → replay; concurrent 401s queue (`failedQueue` +
  `isRefreshing`); refresh `POST /api/auth/refreshToken`
  `{refreshToken:{refreshToken}}` → `setAuthToken(data)` → replay queue;
  refresh-403 → `removeAuthToken()` + `router.replace('/auth/login')`.

## 2. Services (VERIFIED pattern)

`src/api/*Service.ts` factories (`AuthenService`, `UserService`,
`FileManagerService` incl. `uploadChunkApi`/`mergeChunkApi`,
`UserNotifyService`, `SearchService`, `PermissionService`, `UtilService`).
Keep this pattern; one client only.

## 3. Networking realities (VERIFIED config)

- `.env.development`: `http://localhost:8080` (+CDN/WS); `.env.production`:
  `https://api/cdn.myapp.com`. In-app `localhost` ≠ host machine on
  device/emulator — select env deliberately.
- `capacitor.config.ts`: `androidScheme https`, `cleartext: true`,
  `allowMixedContent: true` — dev-convenience flags; never weaken further for
  prod without a security task.

## 4. Contract discipline

Classify every endpoint: `VERIFIED_FRONTEND_USAGE` (seen in `src/api` or
call-site), `VERIFIED_EXTERNAL_API_SPEC` (authorized spec doc), or
`UNVERIFIED_BACKEND_ASSUMPTION`. Verified paths include
`/api/appUser/currentUserData` and `/api/auth/refreshToken`; signin/signout
via `AuthenService`. Never invent methods/DTOs/pagination.

## 5. Failure handling (VERIFIED pieces)

Timeout (180s default), 401 queue, 403 logout, loading/confirm/toast UX via
`useBase`. Offline detection/retries beyond chunk-upload (1 MB, 3 retries in
`useFileUpload.ts:13-14,64-80`) are NOT_FOUND — do not claim offline support
from plugin presence.
