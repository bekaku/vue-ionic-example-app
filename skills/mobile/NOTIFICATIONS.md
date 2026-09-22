# NOTIFICATIONS — Detailed Reference

Authoritative home for push-notification rules. Entry:
`.agents/skills/mobile-notifications/SKILL.md`.

## 1. Stack (VERIFIED)

`@capacitor/push-notifications 8.1.1` + `@capacitor-community/fcm 8.1.0`,
orchestrated by `src/composables/useNotification.ts`, counts in
`src/stores/notificationStore.ts`, server calls via `UserNotifyService`.
Config: `PushNotifications.presentationOptions: []`
(`capacitor.config.ts:25-28`) — foreground presentation is custom (toast).

## 2. Flows (VERIFIED)

- Gate: `isNotifyPermited()` returns false on web (`:55-72`).
- Register: `checkPermissions → requestPermissions (if prompt) → register()`
  (`:253-273`); listeners: `registration` (saves `FcmTokenKey`),
  `registrationError` (`:81-106`).
- Notify listeners: `pushNotificationReceived` → toast with View/Close
  (`:114-149,190-225`); `pushNotificationActionPerformed` → `onNotifyView`
  (`:151-188,226-245`).
- Topics: `FCM.subscribeTo/unsubscribeFrom/deleteInstance`
  (`:286-318`); user topic `FCM_USER_TOPIC + userId`
  (`'io.mydomain.fcm.user.'`, `libs/constant.ts:131`).
- Logout: `userUnSubscribeFcm` → topic removal + optional
  `removeAllListeners/unregister` (`:340-361`); `onClearAllToken` also
  unregisters (`useAppStorage.ts:140-153`).

## 3. Navigation contract (VERIFIED, with conflict)

`onNotifyView`: marks read, then `SYSTEM_ANNOUNMENT`/`LIKE_POST` →
`appNavigateTo('/post/view/${functionId}')`; `CHAT` → no-op (`:235-244`).
`/post/view/:id` has no verified route in `router/index.ts` — treat as
CONFLICTING until tested (see `KNOWN_ISSUES.md`).

## 4. Risks (PARTIALLY_VERIFIED)

Duplicate `addListener` calls across entry points (`addListeners` invoked from
`manageNotificationToken` and `userSubscribeFcm`), cold-start taps before
router/auth readiness, and untested Android channels / iOS capabilities (no
native dirs to verify). Never store real tokens in docs.
