# NOTIFICATIONS — Detailed Reference

Authoritative home for push-notification rules. Entry:
`.agents/skills/mobile-notifications/SKILL.md`.

## 1. Stack (VERIFIED)

`@capacitor/push-notifications` + `@capacitor-community/fcm`
(resolved 8.1.2 and 8.1.0 in the 2026-09-24 lockfile),
orchestrated by `src/composables/useNotification.ts`, counts in
`src/stores/notificationStore.ts`, server calls via `UserNotifyService`.
Config: `PushNotifications.presentationOptions: []`
(`capacitor.config.ts` `plugins.PushNotifications`) — foreground
presentation would be a custom toast (inactive, see §2).

## 2. Flows (VERIFIED)

Symbols below are in `useNotification.ts` unless noted.

- Gate: `isNotifyPermited()` returns false on web.
- Register: `registerNotifications` = `checkPermissions → requestPermissions
  (if prompt) → register()`. `addListeners` adds `registration` (saves
  `FcmTokenKey`, never logs the token) + `registrationError`. Handles live in
  module-level `registrationHandles` and are removed before re-adding; calls
  are serialized via `listenerQueue` — safe to call from App.vue, Index.vue,
  login and the settings toggle.
- Notify listeners: `pushNotificationReceived` → `reciveNotificationToast`;
  `pushNotificationActionPerformed` → `onNotifyView` — both in
  `addNotifyListeners()`, which **nothing calls** (NOT_FOUND caller), so
  foreground toast and tap navigation are currently inactive.
- Topics: `subscribeTopic`/`unSubscribeTopic`/`deleteInstance` (FCM plugin);
  user topic `FCM_USER_TOPIC + String(userId)` (`libs/constant.ts`
  `FCM_USER_TOPIC = 'io.mydomain.fcm.user.'`).
- Logout: `userUnSubscribeFcm` → topic removal + optional `removeAllListeners`
  (also clears `registrationHandles`) + `unregister`; `useAppStorage.ts` ›
  `onClearAllToken` also unregisters.

## 3. Navigation contract (VERIFIED, with conflict)

`onNotifyView`: marks read, then `SYSTEM_ANNOUNMENT`/`LIKE_POST` →
`appNavigateTo('/post/view/${functionId}')`; `CHAT` → no-op.
`/post/view/:id` has no route in `router/index.ts` — treat as CONFLICTING
until a destination is specified and tested (see `KNOWN_ISSUES.md`).

## 4. Risks (PARTIALLY_VERIFIED)

Before wiring `addNotifyListeners`: create the tap destination route (#23),
make it replace-not-stack like `addListeners`, and gate cold-start taps on
router/auth readiness (#9). Android channels / iOS capabilities are untested
(no native dirs to verify). Never store real tokens in docs.
