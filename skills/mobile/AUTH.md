# AUTH — Detailed Reference

Authoritative home for authentication/security rules. Entry:
`.agents/skills/mobile-auth/SKILL.md`.

## 1. Mechanism (VERIFIED)

JWT `authenticationToken` + `refreshToken`, multi-account capable
(`useAppStorage.ts` › `getCurrentUserToken`/`setAuthToken`/`switchUser`;
`useAuthen.ts` › `singinProcess`). `userId` is a snowflake **string**; storage
keys use it verbatim.

- Signin: `singinProcess(emailOrUsername, password)` sends
  `{loginFrom: platform, fcmToken, deviceId}` via `AuthenService.singin`,
  then `setAuthToken(response)` + `setSysncActiveStatus()`.
- Storage (Capacitor Preferences): `AppAuthTokenKey_<uid>`,
  `AppAuthRefeshTokenKey_<uid>`, `AppAuthCuurentUserKey`
  (`src/libs/constant.ts`, `useAppStorage.ts`). No secure-storage plugin —
  **documented risk**; never copy tokens into docs/logs.
- Startup restore: `initialAuthDataProcess()` calls
  `api.raw('/api/appUser/currentUserData', {notify:false, timeout:15000})`;
  on 200 `setAuthen(_data)` + permissions into `appStore`
  (`authenStore.ts` › `initialAuthDataProcess`). `main.ts` catches
  `ApiFetchError` 403 → `removeAuthToken()` + `/auth/login`; network/timeout
  still mounts, and `initAuthen` retries once without throwing
  (`useAuthen.ts` › `initAuthen`). App always mounts in `finally`.
- Signout: confirm → `userUnSubscribeFcm` → `singoutToServer({refreshToken,
  email})` → `destroyAuthDataAndRedirect()` → `window.location.replace('/')`
  (`useAuthen.ts` › `signOut`, `destroyAuthDataAndRedirect`).
  `removeAuthToken()` fails over to the next stored account or clears all +
  `PushNotifications.removeAllListeners/unregister` (`useAppStorage.ts` ›
  `removeAuthToken`, `onClearAllToken`). Login and account switch reload the
  app with `window.location.replace`, so `main.ts` startup runs again.

## 2. Refresh semantics (VERIFIED)

See `API.md` §1. Concurrent 401s share one `refreshPromise`
(`useApi.ts:75`); retry with the new token; failed refresh with 403 logs out.
`useApi` dev logging prints url/method/status only (the token-logging axios
interceptor was removed). Do not copy token values into issues, tests, or
docs. Resume-after-background reuses stored tokens —
no silent re-login is verified.

## 3. Route authorization (VERIFIED)

Router guard (`router/index.ts:237-254`) + in-app `rbac` directive
(`main.ts` › `startApp`) + `useRBAC`/`PermissionService`. Frontend checks are UI-only;
backend authorization is authoritative.

## 4. NOT implemented (NOT_FOUND — verify before claiming)

Biometric login, OAuth/external browser auth with callbacks, cookie-session
auth, native secure storage. Do not invent them.

## 5. Security rules

No hardcoded secrets; no token/PII logging; WebView/network flags stay as
configured; deep-link/file inputs validated (see `DEEP_LINKS.md`,
`FILES_MEDIA.md`). Record new risks in `KNOWN_ISSUES.md`, never fix silently
during docs tasks.
