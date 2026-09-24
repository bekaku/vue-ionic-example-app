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
`useNotification.ts` › `onNotifyView`). `onNotifyView` targets
`/post/view/${functionId}`, which has no route, and it is only reachable via
`addNotifyListeners()` — which nothing calls. Other links without a route:
`/user/view/:id`, `/notifications`, `/hashtag/*`, menu `/permission` `/role`
`/user` `/chats` `/feed` (KNOWN_ISSUES #23). All fall to the catch-all 404;
add the route before relying on a link.

## 4. Android back button (VERIFIED)

Single handler `useBackButton(-1, …)` in `src/App.vue:38-46`: if
`!ionRouter.canGoBack()` or path is `/tabs/home` → `appConfirm(exit)` → true
→ `App.exitApp()`. Rules: one handler only, intentional priority, no modal
handling verified — do not add competing handlers.

## 5. iOS navigation (PARTIALLY_VERIFIED)

`swipeBackEnabled: false` (`main.ts` › `startApp`); `BaseBackButton` default
`/tabs/home`. Gesture/stack behavior on iOS is UNKNOWN without device
evidence — never claim parity with Android.

## 6. Startup order to preserve

```text
router module registers beforeEach → app.use(router)
→ initial navigation may evaluate auth guard
→ router.isReady → initialAuthData (15 s) → .finally(app.mount) → IonRouterOutlet
→ page activation; routed pages may remain mounted when inactive
```

Do not assume auth restoration has completed when the guard first runs
(`src/main.ts` › `startApp`, `src/router/index.ts:237-254`).
