# BUILD_RELEASE_GUIDE — Actual Procedure

## Web build (VERIFIED — `package.json`, `capacitor.config.ts`)

```bash
pnpm install --shamefully-hoist   # per README
pnpm build:vite                    # vue-tsc && vite build → dist/
pnpm build                         # ionic build --prod → dist/
pnpm preview                       # local preview
pnpm lint                          # eslint (optional, not a verification gate)
pnpm test:unit                     # vitest
pnpm test:e2e                       # cypress
```

`dist/` is the Capacitor `webDir`. Dev server: `pnpm dev` (vite :3004) or
`pnpm ion-dev` (ionic :8001).

## Environments (VERIFIED — `.env*`)

| File | API | Notes |
| ---- | --- | ----- |
| `.env.development` | `http://localhost:8080` | CDN/WS same host |
| `.env.production` | `https://api.myapp.com` (+cdn) | test-server URLs commented |
| `.env` / `.env.development.example` | keys incl. timeout, paging, stores, versions | values redacted in docs |

Mode helpers: `useConfig()` (`isDevMode/isTestMode/isDevelopMode/isProdMode`).

## Capacitor (VERIFIED config; projects NOT_FOUND)

`appId com.bekaku.mobile.ion`, `appName Vue Ionic`, `androidScheme https`,
`cleartext`/`allowMixedContent` only with `CAP_ALLOW_HTTP=true` (dev sync;
never for release), Keyboard/Push/Splash config.
No `android/`/`ios/` committed:

```bash
npx cap add android && npx cap add ios  # first time only
npx cap sync          # after each web build with native/plugin changes
npx cap sync android  # per README
npx cap sync ios
```

Never sync during docs tasks. Review plugin compat + permissions + Pods/Gradle
before syncing (see `NATIVE_PLUGINS.md`).

## Release verification (per platform)

Build success → plugin compat → permissions → launch → auth → (device only:
push, links, capture/save/share, storage) → offline-claim check → regression.
Record web / Android / iOS separately. No signing material in repo — never
document secrets.
