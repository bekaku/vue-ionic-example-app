---
name: mobile-navigation
description: >
  Use this skill when changing routes, tabs, guards, back-button behavior,
  or any navigation flow including notification-tap navigation.
---

# mobile-navigation — Canonical Skill

## Purpose

Preserve the verified `@ionic/vue-router` navigation model and back-button
behavior.

## When to use

Routes, tabs, guards, params, redirects, modals-as-pages, back-button, or
notification/deep-link entry navigation.

## Required reading

- `skills/mobile/NAVIGATION.md`
- `docs/agent/MOBILE_ARCHITECTURE.md` (router flow)

## Relevant project locations

- `src/router/index.ts`, `src/App.vue`, `src/pages/tabs/index.vue`
- `src/composables/useBase.ts` (`appNavigateTo`, `getCurrentPath`)

## Mandatory rules

1. Guard: only `meta.noRequireAuth === true` bypasses auth (`router/index.ts`).
2. Single `useBackButton(-1, …)` in `App.vue` — never add competing handlers.
3. Tabs are children of `/tabs/` (`home/chat/other`); keep nesting consistent.
4. Route navigation through the guard. Several links point at routes that do
   not exist (`/post/view/:id`, `/user/view/:id`, `/notifications`,
   `/hashtag/*`, menu `/permission` `/role` `/user` `/chats` `/feed` —
   KNOWN_ISSUES #23); they fall to the catch-all 404. Add the route before
   relying on a link.

## Implementation workflow

1. Trace the affected route chain + guard outcome.
2. Test forward, back, guard-redirect, and tab-switch paths.
3. Confirm back-button priority/cleanup; no duplicate listeners.
4. Verify per `mobile-testing`, including lifecycle on cached pages.

## Verification

Route/guard unit checks + manual navigation matrix on web; Android back-button
only verified on device/emulator.
