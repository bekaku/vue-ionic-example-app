# AUTH — Detailed Reference

Authoritative home for authentication/security rules. Entry:
`.agents/skills/mobile-auth/SKILL.md`.

## 1. Mechanism (VERIFIED)

JWT `authenticationToken` + `refreshToken`, multi-account capable
(`src/composables/useAppStorage.ts:56-88,172-186`; `useAuthen.ts:72-92`).

- Signin: `singinProcess(emailOrUsername, password)` sends
  `{loginFrom: platform, fcmToken, deviceId}` via `AuthenService.singin`,
  then `setAuthToken(response)` + `setSysncActiveStatus()`.
- Storage (Capacitor Preferences): `AppAuthTokenKey_<uid>`,
  `AppAuthRefeshTokenKey_<uid>`, `AppAuthCuurentUserKey`
  (`src/libs/constant.ts`, `useAppStorage.ts`). No secure-storage plugin —
  **documented risk**; never copy tokens into docs/logs.
- Startup restore: `initialAuthDataProcess()` sets axios defaults then
  `GET /api/appUser/currentUserData`; on 200 `setAuthen(data)` + permissions
  into `appStore` (`authenStore.ts:37-61`).
- Signout: confirm → `userUnSubscribeFcm` → `singoutToServer({refreshToken,
  email})` → `destroyAuthDataAndRedirect()` → `window.location.replace('/')`
  (`useAuthen.ts:93-146`). `removeAuthToken()` fails over to the next stored
  account or clears all + `PushNotifications.removeAllListeners/unregister`
  (`useAppStorage.ts:100-153`).

## 2. Refresh semantics (VERIFIED)

See `API.md` §1. Concurrent 401s serialize on `isRefreshing`; replay with the
new token; failed refresh with 403 logs out. Resume-after-background reuses
stored tokens — no silent re-login is verified.

## 3. Route authorization (VERIFIED)

Router guard (`router/index.ts:237-254`) + in-app `rbac` directive
(`main.ts:53`) + `useRBAC`/`PermissionService`. Frontend checks are UI-only;
backend authorization is authoritative.

## 4. NOT implemented (NOT_FOUND — verify before claiming)

Biometric login, OAuth/external browser auth with callbacks, cookie-session
auth, native secure storage. Do not invent them.

## 5. Security rules

No hardcoded secrets; no token/PII logging; WebView/network flags stay as
configured; deep-link/file inputs validated (see `DEEP_LINKS.md`,
`FILES_MEDIA.md`). Record new risks in `KNOWN_ISSUES.md`, never fix silently
during docs tasks.
