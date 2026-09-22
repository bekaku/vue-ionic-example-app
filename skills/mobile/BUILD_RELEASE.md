# BUILD_RELEASE — Detailed Reference

Authoritative home for build/release rules. Entry:
`.agents/skills/mobile-build-release/SKILL.md`. Guide:
`docs/agent/BUILD_RELEASE_GUIDE.md`.

## 1. Web build (VERIFIED)

- `package.json` scripts: `build:vite` = `vue-tsc && vite build`;
  `build` = `ionic build --prod`; output `dist/` = Capacitor `webDir`
  (`capacitor.config.ts:7`).
- Env selection: `.env.development` (localhost:8080 API/CDN/WS) vs
  `.env.production` (myapp.com). No secrets in frontend env files.

## 2. Capacitor workflow (VERIFIED config, NOT_FOUND projects)

- `capacitor.config.ts`: `appId com.bekaku.mobile.ion`, `appName 'Vue Ionic'`,
  `androidScheme https`, `cleartext true`, `allowMixedContent true`,
  Keyboard + Push + SplashScreen plugin config.
- No `android/`/`ios/` committed → sequence is `npx cap add android|ios`
  first, then `npx cap sync[.md]` per README. Never sync during docs tasks or
  blindly on dirty trees.

## 3. Release rules

- Identifiers/versions: `appId` fixed; version in `package.json` (`1.0.3`) +
  `VITE_APP_VERSION/VITE_CODE_VERSION`. Never change identifiers silently.
- Signing: no keystores/profiles in repo (none found) — never access or
  document secret material.
- Verification per release: build success, plugin compat, permissions, launch,
  auth, links/push (device), storage, offline claims, platform regression.
  Record web / Android / iOS separately; web ≠ native proof.
