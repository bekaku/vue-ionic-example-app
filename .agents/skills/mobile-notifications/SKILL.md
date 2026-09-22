---
name: mobile-notifications
description: >
  Use this skill when working on push notifications, FCM topics, device
  tokens, or notification-tap navigation.
---

# mobile-notifications — Canonical Skill

## Purpose

Preserve the verified PushNotifications + community FCM implementation and
its navigation contract.

## When to use

Permission/register/unregister flows, token sync, topic subscribe, foreground
toasts, tap navigation, logout cleanup.

## Required reading

- `skills/mobile/NOTIFICATIONS.md`
- `skills/mobile/LIFECYCLE.md` (cold-start/readiness)

## Relevant project locations

- `src/composables/useNotification.ts`, `src/stores/notificationStore.ts`
- `capacitor.config.ts` (`PushNotifications.presentationOptions: []`)

## Mandatory rules

1. Web path is a no-op via `isWeb()`; never register on web.
2. Flows: check → request → register; logout → unsubscribe + unregister.
3. Tap navigates to `/post/view/:id` only for `SYSTEM_ANNOUNMENT`/`LIKE_POST`;
   `CHAT` is a verified no-op. Never invent new destinations.
4. Avoid duplicate listeners; navigation must wait for router+auth readiness.

## Implementation workflow

1. Trace permission → registration → token → topic → listener chain.
2. Handle foreground/background/cold-start distinctly.
3. Never log real device tokens.
4. Verify per `mobile-testing`; device required for real delivery proof.

## Verification

Mocked listener/navigation tests on web; delivery/tap on emulator/device only.
