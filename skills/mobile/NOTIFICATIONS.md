# NOTIFICATIONS — Detailed Reference

Authoritative home for push-notification rules. Entry:
`.agents/skills/mobile-notifications/SKILL.md`.

## 1. Stack (VERIFIED)

`@capacitor/push-notifications` + `@capacitor-community/fcm`
(resolved 8.1.2 and 8.1.0 in the 2026-09-24 lockfile),
orchestrated by `src/composables/useNotification.ts`, counts in
`src/stores/notificationStore.ts`, server calls via `UserNotifyService`.
Config: `PushNotifications.presentationOptions: []`
(`capacitor.config.ts:25-28`) — foreground presentation is custom (toast).

## 2. Flows (VERIFIED)

- Gate: `isNotifyPermited()` returns false on web (`:55-72`).
- Register: `checkPermissions → requestPermissions (if prompt) → register()`
  (`registerNotifications`, `:250`); listeners: `registration` (saves `FcmTokenKey`, never logs the token),
  `registrationError` (`addListeners`, `:79-102`). Handles are kept module-level
  (`:17`) and removed before re-adding, calls are serialized — safe to call from
  App.vue, Index.vue, login and the toggle.
- Notify listeners: `pushNotificationReceived` → toast with View/Close;
  `pushNotificationActionPerformed` → `onNotifyView` — both in
  `addNotifyListeners()` (`:104`), which **nothing calls** (NOT_FOUND caller):
  foreground toast and tap navigation are currently inactive.
- Topics: `FCM.subscribeTo/unsubscribeFrom/deleteInstance`
  (`:286-318`); user topic `FCM_USER_TOPIC + userId`
  (`'io.mydomain.fcm.user.'`, `libs/constant.ts:131`).
- Logout: `userUnSubscribeFcm` → topic removal + optional
  `removeAllListeners/unregister` (`:340-361`); `onClearAllToken` also
  unregisters (`useAppStorage.ts:140-153`).

## 3. Navigation contract (VERIFIED, with conflict)

`onNotifyView`: marks read, then `SYSTEM_ANNOUNMENT`/`LIKE_POST` →
`appNavigateTo('/post/view/${functionId}')`; `CHAT` → no-op (`:235-244`).
`/post/view/:id` has no route in `router/index.ts` — treat as CONFLICTING
until a destination is specified and tested (see `KNOWN_ISSUES.md`).

## 4. Risks (PARTIALLY_VERIFIED)

If `addNotifyListeners` is wired up, make it replace-not-stack like
`addListeners` and gate cold-start taps on router/auth readiness. Also and untested Android channels / iOS capabilities (no
native dirs to verify). Never store real tokens in docs.
