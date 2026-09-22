---
name: mobile-lifecycle
description: >
  Use this skill when handling app foreground/background, Ionic view events,
  Vue mount/unmount, or listener registration and cleanup.
---

# mobile-lifecycle — Canonical Skill

## Purpose

Enforce correct lifecycle semantics across Capacitor App events, Ionic cached
pages, and Vue components.

## When to use

Launch/resume/pause logic, session restore, data refresh on view enter,
background behavior, listener/memory-leak fixes.

## Required reading

- `skills/mobile/LIFECYCLE.md`
- `docs/agent/MOBILE_ARCHITECTURE.md` (startup flow)

## Relevant project locations

- `src/App.vue`, `src/main.ts`, `src/stores/deviceStore.ts`
- `src/composables/useAuthen.ts`, pages using Ionic view hooks

## Mandatory rules

1. `App.addListener('appStateChange')` is the only verified app-state hook.
2. Cached pages stay mounted — refresh on Ionic view Enter, clean up on Leave.
3. Never assume background JS runs indefinitely or termination fires.
4. Listeners must be registered once, guarded, and removed appropriately.

## Implementation workflow

1. Map which lifecycle layer owns the behavior (App / Ionic view / Vue).
2. Implement refresh + cleanup symmetrically; avoid stale-state closures.
3. Test launch, resume, pause, view-switch sequences.
4. Verify per `mobile-testing` LIFECYCLE checks.

## Verification

Lifecycle event tests where feasible; background/termination limits disclosed
as NOT verified without device evidence.
