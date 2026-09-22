# MOBILE_ARCHITECTURE — Actual Implementation

## Startup (VERIFIED)

```mermaid
flowchart TD
  A[main.ts startApp] --> B[createApp + IonicVue mode ios + Pinia + i18n + router]
  B --> C[provide AxiosKey, rbac directive]
  C --> D[router.isReady]
  D --> E[authenStore.initialAuthData GET /api/appUser/currentUserData]
  E -->|403| F[removeAuthToken + replace /auth/login]
  E -->|200/no token| G[app.mount #app]
  G --> H[App.vue onBeforeMount: setSafeArea, initThemeLanguge, appStateChange listener, initAuthen, useBackButton -1]
```

## Router + guard (VERIFIED)

```mermaid
flowchart TD
  A[IonRouterOutlet] --> B[beforeEach: noRequireAuth?]
  B -->|true| C[next]
  B -->|false| D[getCurrentUserToken has authenticationToken?]
  D -->|yes| C
  D -->|no| E[redirect /auth/login replace]
```

Tabs `/tabs/` → `home/chat/other`. Public: ``, `/auth/login`,
`/auth/forgot-password`, `/settings/languge`, `/settings/appearance`,
`/test`, 404.

## Auth + API (VERIFIED)

Signin (`useAuthen.singinProcess`) → Preferences per-user tokens → request
interceptor attaches Bearer/X-User-ID/Locale → 401 refresh queue
(`POST /api/auth/refreshToken`) → replay; 403 → logout + login redirect.
Signout → FCM unsubscribe → server signout → clear + `location.replace('/')`.

## Storage / plugins / lifecycle (VERIFIED)

- Storage: Preferences only (`StorageUtil`), preserved keys on clear.
- Plugins behind `useDevice().isWeb()` guards; wrappers in composables.
- `appStateChange` → `deviceStore`; cached Ionic pages need view-enter
  refresh + leave cleanup; background execution not guaranteed.
