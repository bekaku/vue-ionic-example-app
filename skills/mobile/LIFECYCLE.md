# LIFECYCLE — Detailed Reference

Authoritative home for lifecycle rules. Entry:
`.agents/skills/mobile-lifecycle/SKILL.md`.

## 1. App launch (VERIFIED)

`src/main.ts` › `startApp` (`router.isReady → initialAuthData → .finally(mount)`) plus
`src/App.vue:26-47` (`onBeforeMount`: `setSafeArea()`, `initThemeLanguge()`,
`App.addListener('appStateChange')`, `initAuthen()`, `useBackButton`).
`initAuthen` (`useAuthen.ts` › `initAuthen`): token present and no `auth` yet →
retry `initialAuthDataProcess()` (`GET /api/appUser/currentUserData`, errors
caught) → notification/FCM setup + `initialAppNav()`.

## 2. Foreground/background (VERIFIED hook, UNKNOWN duration)

`App.addListener('appStateChange', ({isActive}) =>
deviceStore.setAppStateChange(isActive))` (`App.vue:33-35`). Rules: refresh on
resume explicitly; never assume background JS runs indefinitely or that
termination callbacks fire.

## 3. Ionic view vs Vue lifecycles (implementation guidance)

- Vue `onMounted/onBeforeMount` run once per cached page lifetime.
- Ionic `onIonViewWillEnter/DidEnter/WillLeave/DidLeave` are available for
  routed page activation; no current page imports them (`src/pages/` search).
- Data refresh belongs on view-enter; subscriptions/listeners attach on enter
  (or once, guarded) and detach on leave/destroy. Stale closures over inactive
  pages are a known leak source (see `KNOWN_ISSUES.md`).

## 4. Listener safety checklist

Identify the owner first (app, routed view, composable, or auth session).
Keep listener handles or an explicit registration guard, avoid duplicate
registration, and remove listeners when the owner ends. Reference pattern:
`useNotification.ts` › `addListeners` keeps module-level handles, removes
them before re-adding, and serializes calls. `App.vue:33-35` registers
`appStateChange` without saving a handle (root-owned, lives for the app).

`watch(source, fn, { immediate: true })` calls `fn` synchronously at the
`watch` line — a `const fn` declared below it throws "Cannot access before
initialization" at mount (typecheck/build do not catch this).

## 5. State restoration (VERIFIED)

Restored: auth user (`initialAuthData`), theme/locale (`initThemeLanguge`),
current-user pointer (`AppAuthCuurentUserKey`). NOT restored (NOT_FOUND):
navigation stack, draft forms, pending uploads, DB connections (no DB).
