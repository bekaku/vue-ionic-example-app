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

1. Build is `ionic build --prod` → `dist/`; never claim native success from it.
2. No `android/`/`ios/` committed — `npx cap add` first; never `cap sync`
   during docs tasks or on a dirty tree without review.
3. Env: `.env.development` (localhost:8080) vs `.env.production`
   (api/cdn myapp.com); no secrets in frontend env files.
4. Never touch signing creds/identifiers; record ANDROID/IOS results only
   when actually executed.

## Implementation workflow

1. Confirm target env + platform + version bump (if any).
2. Web build → cap sync (explicit) → native build → smoke checklist.
3. Verify plugins/permissions/launch/auth/links/push/storage per release.
4. Record per-platform results; disclose NOT_RUN explicitly.

## Verification

BUILD/RELEASE matrix per platform; web ≠ native proof.
