---
name: mobile-build-release
description: >
  Use this skill when building, syncing Capacitor, or preparing Android/iOS
  releases and environment configuration.
---

# mobile-build-release — Canonical Skill

## Purpose

Pin the verified build/sync/release sequence and stop unsafe assumptions.

## When to use

Web builds, `cap add/sync`, Gradle/Xcode config, versioning, signing,
environment selection, release verification, CI.

## Required reading

- `skills/mobile/BUILD_RELEASE.md`
- `docs/agent/BUILD_RELEASE_GUIDE.md`

## Relevant project locations

- `package.json` (scripts), `capacitor.config.ts` (`webDir: dist`),
- `.env*`, `vite.config.ts`, `cypress.config.ts`

## Mandatory rules

1. `pnpm build` invokes `ionic build --prod` and targets `dist/`; web output
   does not establish native success.
2. No `android/`/`ios/` committed. A native project must exist before sync;
   review generated/native changes and working-tree state before running it.
3. Inspect current `.env*` keys and selected mode without copying values;
   device localhost differs from the developer machine.
4. Never touch signing creds/identifiers; record ANDROID/IOS results only
   when actually executed.

## Implementation workflow

1. Confirm target env + platform + version bump (if any).
2. Web build → cap sync (explicit) → native build → smoke checklist.
3. Verify plugins/permissions/launch/auth/links/push/storage per release.
4. Record per-platform results; disclose NOT_RUN explicitly.

## Verification

BUILD/RELEASE matrix per platform; web ≠ native proof.
