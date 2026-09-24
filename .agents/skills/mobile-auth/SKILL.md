---
name: mobile-auth
description: >
  Use this skill when working on login, logout, session restore, tokens,
  route guards, or any authentication and authorization behavior.
---

# mobile-auth — Canonical Skill

## Purpose

Preserve the verified JWT + refresh-token auth model and its security
boundaries.

## When to use

Login/logout, token storage/refresh, multi-account switch, guards, biometric
or OAuth proposals (verify-first — neither is implemented).

## Required reading

- `skills/mobile/AUTH.md`
- `skills/mobile/API.md`
- `docs/agent/API_INTEGRATION_CONTRACT.md`

## Relevant project locations

- `src/composables/useAuthen.ts`, `src/composables/useAppStorage.ts`
- `src/stores/authenStore.ts`, `src/api/AuthenService.ts`, `src/router/index.ts`

## Mandatory rules

1. Tokens live in Capacitor Preferences (`AppAuthTokenKey_<uid>` etc.) —
   no secure-storage plugin exists (documented risk); never copy tokens.
2. 401 → shared refresh + retry via `/api/auth/refreshTokenApi` in
   `useApi.ts`; refresh-403 → `removeAuthToken()` + login redirect.
3. Guard rule: `noRequireAuth === true` or valid `authenticationToken`.
4. Frontend role checks are UI-only; backend authorization is authoritative.
   Never log request bodies/headers/responses carrying tokens (`useApi`
   logs url/method/status only).

## Implementation workflow

1. Trace token lifecycle (signin → store → attach → refresh → logout).
2. Test concurrent-401, failed-refresh, resume-after-background, switch-user.
3. Confirm logout cleanup (tokens, FCM unregister, cached user data).
4. Verify per `mobile-testing`, incl. SECURITY checklist.

## Verification

Auth-flow tests with mocked storage/API; no hardcoded secrets or logged
tokens; device needed for resume/background proof.
