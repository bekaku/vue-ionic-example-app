# NAVIGATION — Detailed Reference

Authoritative home for navigation rules. Entry:
`.agents/skills/mobile-navigation/SKILL.md`.

## 1. Router setup (VERIFIED)

`src/router/index.ts:230-233`: `createRouter` from `@ionic/vue-router` with
`createWebHistory(import.meta.env.BASE_URL)`. Outlet: `IonRouterOutlet` in
`src/App.vue:51`. Routes include `` (index, public), `/about`, `/auth/login`
(public), `/auth/add-account`, `/auth/forgot-password` (public),
`/settings/*`, `/tabs/` → children `home/chat/other` (+ `''→/tabs/home`),
`/example/*` (demo), `/test`, `/:catchAll → 404` (public).

## 2. Guard (VERIFIED)

`router/index.ts:237-252` — `beforeEach` uses the Vue Router 5 return-value
pattern (no `next()`): `to.meta.noRequireAuth === true` → `return true`;
else `getCurrentUserToken()` must return `authenticationToken` → `return true`,
else `return { path: '/auth/login/', replace: true }`. Rule: every new protected
route relies on this guard; every public route must set the flag explicitly.

## 3. Programmatic navigation (VERIFIED)

`useBase` exposes `appNavigateTo` / `getCurrentPath` (used in `App.vue:39`,
`useNotification.ts:240`). Notification taps call
`appNavigateTo('/post/view/${functionId}')` — note `/post/view/:id` has no
verified route entry in `router/index.ts` (CONFLICTING — record/test before
relying; see `KNOWN_ISSUES.md`).

## 4. Android back button (VERIFIED)

Single handler `useBackButton(-1, …)` in `src/App.vue:38-46`: if
`!ionRouter.canGoBack()` or path is `/tabs/home` → `appConfirm(exit)` → true
→ `App.exitApp()`. Rules: one handler only, intentional priority, no modal
handling verified — do not add competing handlers.

## 5. iOS navigation (PARTIALLY_VERIFIED)

`swipeBackEnabled: false` (`main.ts:45`); `BaseBackButton` default
`/tabs/home`. Gesture/stack behavior on iOS is UNKNOWN without device
evidence — never claim parity with Android.

## 6. Verified flow

```text
App launch → router.isReady → initialAuthData → IonRouterOutlet
→ beforeEach (auth guard) → Page activation → Page deactivation (cached)
```
