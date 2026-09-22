---
name: mobile-api
description: >
  Use this skill when adding or changing REST API calls, HTTP client config,
  error handling, uploads/downloads, or network behavior.
---

# mobile-api — Canonical Skill

## Purpose

Keep all HTTP traffic on the single verified axios client with correct
auth, error, and networking semantics.

## When to use

New/changed endpoints, interceptors, timeout/retry, pagination, DTOs,
upload/download progress, offline/timeout handling.

## Required reading

- `skills/mobile/API.md`
- `docs/agent/API_INTEGRATION_CONTRACT.md`

## Relevant project locations

- `src/plugins/axios.ts`, `src/api/*Service.ts`, `src/composables/useAxios.ts`
- `.env*` (keys only — never copy values)

## Mandatory rules

1. Use only `src/plugins/axios.ts`; never add a second client or weaken TLS.
2. Never invent contracts — classify `VERIFIED_FRONTEND_USAGE` vs
   `UNVERIFIED_BACKEND_ASSUMPTION`; backend repo is out of scope.
3. Respect `validateStatus < 400`, `json-bigint` path, 401-refresh-queue and
   403-logout semantics.
4. `localhost` in-app ≠ dev machine — use env base URLs; verify per platform.

## Implementation workflow

1. Confirm endpoint path/method/DTO against frontend usage evidence.
2. Implement service method + error/loading states; avoid duplicate submits.
3. Handle timeout/offline/cancel paths explicitly.
4. Verify per `mobile-testing` (mocked API tests; device for real network).

## Verification

API-contract check (method/path/DTO), error-path tests; no invented backend
behavior.
