# API — Detailed Reference

Authoritative home for HTTP/network rules. Entry:
`.agents/skills/mobile-api/SKILL.md`. Contract log:
`docs/agent/API_INTEGRATION_CONTRACT.md`.

## 1. Client (VERIFIED — `src/composables/useApi.ts`)

Usage: `const api = useApi(); await api<T>(url, opts)`; full response via
`api.raw<T>()` (`status`, `headers`, parsed body in `_data`, `:381`).
Options: `method`, `body`, `query`, `baseURL`, `headers`, `responseType`
(`json|text|blob|arrayBuffer`), `timeout`, `signal`, `notify`,
`onDownloadProgress`.

- Native `fetch`, `credentials: 'same-origin'` = axios `withCredentials:false`
  (`:269`); timeout `VITE_API_TIMOUT || 180000` via `AbortController` (`:71`).
- Headers (`:155-168`, `:335`): `Accept-Apiclient`, `Accept-Language`
  (Preferences locale), `Authorization: Bearer` + `X-User-ID`,
  `X-Sync-Active` (`canSyncActiveStatusToServer`). Plain object body →
  JSON + `Content-Type: application/json`; `FormData`/`Blob` sent as-is
  (browser sets multipart boundary). No `Content-Type` on body-less calls.
- Response: `json-bigint` when `/\d{16,}/` else `JSON.parse` (`:82`);
  status ≥ 400 → `ApiFetchError` (`status`, `data`, `response`, `:299`).
- 401 (`:331-373`): missing token → reject; token VALID → retry once;
  otherwise one module-level `refreshPromise` shared by concurrent 401s
  (`:75`), `POST /api/auth/refreshTokenApi` `{refreshToken}` →
  `setAuthToken(data)` → retry; refresh-403 → `removeAuthToken()` +
  `router.replace('/auth/login')` (`:305-328`). Ordinary 403 rejects.
- Toasts (`notify`, default true): `AppException`/`ResponseMessage` bodies
  except 401/403, plus network/timeout errors (`:170-224`).
- Dev log prints url/method/status only — never body/headers (tokens).

axios (`plugins/axios.ts`, `useAxios.ts`) was removed on 2026-09-24; do not
re-add it. Demo: `pages/example/composables/use-api.vue`.

## 2. Where to call `useApi()` (direct call or service)

Both are allowed; one client only (`useApi()`). `useApi()` needs no
component setup context, so it works in pages, components, composables,
Pinia stores and services.

**Direct call (default for new, single-use endpoints)** — no `src/api` file
needed:

```ts
const api = useApi();
const items = await api<ApiListResponse<Permission>>('/api/permission', {
  query: { page: 0, size: 10 }
});
await api<ResponseMessage>(`/api/permission/${id}`, { method: 'DELETE' });
```

Examples: `pages/example/composables/use-api.vue`, `usePageFetch.ts:55`,
`authenStore.ts:42`.

**Add/extend a `src/api/*Service.ts` factory when** the endpoint is:
1. already in an existing service — reuse it, do not duplicate the call
   (`AuthenService`, `UserService`, `FileManagerService` incl.
   `uploadChunkApi`/`mergeChunkApi`, `UserNotifyService`, `SearchService`,
   `PermissionService`, `UtilService`);
2. called from 2+ places (pages/composables/stores);
3. auth/token/session related (`AuthenService`, see `AUTH.md`), or
4. needs request/response mapping beyond a single `api()` call.

Either way: type the response (`api<T>`, DTO in `src/types/`), keep
path/method/body per §4 contract discipline, and pass `baseURL` per call
(`getEnv('VITE_CDN_BASE_URL')` for CDN, `''` for absolute URLs) — no shared
mutable defaults. Forgot-password service methods return the 4xx
`ApiFetchResponse` instead of throwing (`AuthenService.ts:13-22`).

## 3. Networking realities (VERIFIED config)

- `.env.development`: `http://localhost:8080` (+CDN/WS); `.env.production`:
  `https://api/cdn.myapp.com`. In-app `localhost` ≠ host machine on
  device/emulator — select env deliberately.
- `capacitor.config.ts`: `androidScheme https`; `cleartext` and
  `allowMixedContent` are **off** unless synced with `CAP_ALLOW_HTTP=true`
  (dev builds against an `http://` backend only). Release: sync without it.

## 4. Contract discipline

Classify every endpoint: `VERIFIED_FRONTEND_USAGE` (seen in `src/api` or
call-site), `VERIFIED_EXTERNAL_API_SPEC` (authorized spec doc), or
`UNVERIFIED_BACKEND_ASSUMPTION`. Verified paths include
`/api/appUser/currentUserData` and `/api/auth/refreshTokenApi`; signin/signout
via `AuthenService`. Never invent methods/DTOs/pagination.

## 5. Failure handling (VERIFIED pieces)

Timeout (180s default), shared 401 refresh, refresh-403 logout, error toast in
`useApi.ts`, and loading/confirm/toast UX via `useBase`. Download progress:
`onDownloadProgress` (needs `Content-Length`; `useFileDownload.ts:123`). `useUpload.ts:14-15`
defaults to 1 MB chunks and one attempt (`maxRetries` is overridable);
there is no generic offline queue or retry policy. Inspect upload separately
from ordinary REST requests.
