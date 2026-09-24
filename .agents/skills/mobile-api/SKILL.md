---
name: mobile-api
description: >
  Use this skill when adding or changing REST API calls, HTTP client config,
  error handling, uploads/downloads, or network behavior.
---

# mobile-api — Canonical Skill

## Purpose

Keep all HTTP traffic on the `useApi()` fetch client with correct
auth, error, and networking semantics.

## When to use

New/changed endpoints, interceptors, timeout/retry, pagination, DTOs,
upload/download progress, offline/timeout handling.

## Required reading

- `skills/mobile/API.md`
- `docs/agent/API_INTEGRATION_CONTRACT.md`

## Relevant project locations

- `src/composables/useApi.ts`, `src/api/*Service.ts`
- `.env*` (keys only — never copy values)

## Mandatory rules

1. Use only `useApi()`; never add another client (axios was removed) or weaken TLS.
2. Never invent contracts — classify `VERIFIED_FRONTEND_USAGE` vs
   `UNVERIFIED_BACKEND_ASSUMPTION`; backend repo is out of scope.
3. Respect status ≥ 400 → `ApiFetchError`, `json-bigint`, and the shared 401
   refresh. Only a 403 from refresh removes auth; ordinary 403 rejects.
4. `localhost` in-app ≠ dev machine — use env base URLs; verify per platform.

## Implementation workflow

1. Confirm endpoint path/method/DTO and base URL against frontend usage;
   pass `baseURL` per call (CDN: `VITE_CDN_BASE_URL`, absolute URL: `'')`.
2. Call `useApi()` directly or add a service method — choose per
   `skills/mobile/API.md` §2 (no `src/api` file required for single-use
   endpoints); add error/loading states; avoid duplicate submits.
3. Handle timeout/offline/cancel paths explicitly.
4. Verify per `mobile-testing` (mocked API tests; device for real network).

## Verification

API-contract check (method/path/DTO), error-path tests; no invented backend
behavior.
