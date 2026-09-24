---
name: mobile-local-data
description: >
  Use this skill when changing persisted local data, storage keys, caches,
  or any offline/sync behavior.
---

# mobile-local-data — Canonical Skill

## Purpose

Constrain local persistence to the verified Preferences-only model and block
invented offline architectures.

## When to use

Storage keys, caches, logout cleanup, quota/expiry, or any SQLite/offline
proposal (verify-first — none is implemented).

## Required reading

- `skills/mobile/LOCAL_DATA.md`

## Relevant project locations

- `src/utils/StorageUtil.ts`, `src/composables/useAppStorage.ts`
- `src/composables/useCache.ts`, `src/libs/constant.ts` (keys)

## Mandatory rules

1. App persistence uses Capacitor Preferences. No app-managed
   SQLite/IndexedDB database or migration layer is present.
2. `clearStorage` preserves locale/theme/FCM/device keys — keep that list.
3. Any schema/key change must review existing data, upgrade path, Android/iOS
   parity, logout cleanup, and tests.
4. Never claim encryption, offline-first sync, or conflict resolution —
   all NOT_FOUND.

## Implementation workflow

1. Inventory affected keys + readers/writers + logout path.
2. Plan preserve-vs-migrate for existing user data.
3. Implement with namespaced keys and cleanup.
4. Verify per `mobile-testing`, incl. upgrade + logout scenarios.

## Verification

Storage round-trip + preservation + logout-cleanup checks; sync claims need
queue/conflict evidence.
