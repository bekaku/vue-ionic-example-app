# LIFECYCLE — Detailed Reference

Authoritative home for lifecycle rules. Entry:
`.agents/skills/mobile-lifecycle/SKILL.md`.

## 1. App launch (VERIFIED)

`src/main.ts:54-66` (`router.isReady → initialAuthData → mount`) plus
`src/App.vue:26-47` (`onBeforeMount`: `setSafeArea()`, `initThemeLanguge()`,
`App.addListener('appStateChange')`, `initAuthen()`, `useBackButton`).
`initAuthen` (`useAuthen.ts:33-52`): token present → `initialAuthDataProcess()`
(`GET /api/appUser/currentUserData`) → notification/FCM setup + `initialAppNav()`.

## 2. Foreground/background (VERIFIED hook, UNKNOWN duration)

`App.addListener('appStateChange', ({isActive}) =>
deviceStore.setAppStateChange(isActive))` (`App.vue:33-35`). Rules: refresh on
resume explicitly; never assume background JS runs indefinitely or that
termination callbacks fire.

## 3. Ionic view vs Vue lifecycles (VERIFIED principle)

- Vue `onMounted/onBeforeMount` run once per cached page lifetime.
- Ionic `onIonViewWillEnter/DidEnter/WillLeave/DidLeave` run per activation.
- Data refresh belongs on view-enter; subscriptions/listeners attach on enter
  (or once, guarded) and detach on leave/destroy. Stale closures over inactive
  pages are a known leak source (see `KNOWN_ISSUES.md`).

## 4. Listener safety checklist

Registered once (back button, appStateChange, push listeners) → guarded by
`isWeb()`/permission where native → not duplicated on re-entry → removed on
logout/leave (`removeAllListeners` + `unregister` in `useAppStorage.ts:140-153`,
`useNotification.ts:319-322,352-357`).

## 5. State restoration (VERIFIED)

Restored: auth user (`initialAuthData`), theme/locale (`initThemeLanguge`),
current-user pointer (`AppAuthCuurentUserKey`). NOT restored (NOT_FOUND):
navigation stack, draft forms, pending uploads, DB connections (no DB).
