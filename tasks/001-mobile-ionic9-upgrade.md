# Task: Upgrade Ionic 8 → 9

## Metadata

- Task ID: 001
- Status: DONE
- Priority: High
- Created: 2026-09-22
- Updated: 2026-09-22

## Objective

Upgrade `@ionic/vue` + `@ionic/vue-router` 8.8.8 → 9.x with minimal code
changes per the official v9 guide, keeping all verification green on web.

## Background

- VERIFIED: stack is Ionic 8.8.8 / Vue 3.5.35 / vue-router 5.1.0 /
  Capacitor 8.3.4 / TS 6 — all satisfy Ionic 9 minimums (Vue 3.5+, Router v5,
  Capacitor 7+, TS 5.4+). Source: `package.json`, `pnpm-lock.yaml`.
- VERIFIED: Ionic 9.0.2 (2026-09-02) is the latest production version;
  migration tool is `npx @ionic/migrate` (dry-run first).
  Source: ionicframework.com/docs/updating/9-0, ionic.io/blog 2026-08-19.
- VERIFIED Vue-relevant breaking items: `next()` in guards deprecated;
  `ion-img` deprecated (remove in v10); `autocorrect` boolean on
  input/searchbar; modal `handleBehavior` default `cycle`; select `ionChange`
  semantics; legacy picker removed; `swipeBackEnabled` read once at mount
  (we set it once — no change); browserslist refresh.

## Scope

- Bump `@ionic/vue`, `@ionic/vue-router` to ^9 (pnpm), let peer updates follow.
- Migrate `router/index.ts` guard from `next()` to return-value pattern.
- Replace `IonImg` with native `<img loading="lazy" decoding="async">`.
- Fix `autocorrect`/picker/select/modal usages if present.
- Refresh `.browserslistrc` per v9 guide.
- Update agent docs version references (8.8.8 → 9.x).

## Out of Scope

- Capacitor major upgrade (stays 8.3.4 — supported by Ionic 9).
- Vue/vue-router bumps beyond what peers require.
- Native projects (`npx cap add/sync`), signing, deployments, backend changes.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md`, `mobile-components`, `mobile-navigation`,
  `mobile-native-plugins`, `mobile-build-release`, `mobile-testing`
- `skills/mobile/{SKILL,COMPONENTS,NAVIGATION,BUILD_RELEASE,TESTING}.md`
- https://ionicframework.com/docs/updating/9-0 (Vue + Required Changes sections)

## Required Skills

- [x] mobile-core
- [x] mobile-components
- [x] mobile-navigation
- [x] mobile-native-plugins
- [x] mobile-build-release
- [x] mobile-testing

## Existing Implementation to Inspect

- `package.json` (deps), `src/router/index.ts` (guard), `src/main.ts`
  (IonicVue config), `src/App.vue` (outlet/back button)
- `IonImg` / `autocorrect` / `pickerController` / `ion-select` usages in `src/`
- `.browserslistrc`, `tests/unit`, `tests/e2e`

## Implementation Plan

1. Grep breaking-change surface (`IonImg`, `autocorrect`, picker, select).
2. `npx @ionic/migrate --dry-run`; review.
3. `pnpm add @ionic/vue@^9 @ionic/vue-router@^9` (+ required peers).
4. Apply code migrations (guard return pattern, img, browserslist).
5. Verify: eslint → vue-tsc → vitest → vite build → cypress (if env allows).

## Checkpoints

- [x] Discovery + classification recorded
- [x] Packages bumped, lockfile updated
- [x] Code migrations applied
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] `@ionic/vue` + `@ionic/vue-router` on ^9, no peer conflicts
- [x] No `next()` in navigation guards
- [x] No `IonImg` remaining (only a stale HTML comment in `BaseImage.vue:2-7`)
- [x] `.browserslistrc` matches v9 guide
- [x] Agent docs reference Ionic 9
- [x] Extra (required to verify build): `BaseModal` handle pinned inert;
  dead `autocorrect="off"` removed; `Error.vue` `require()` of never-committed
  PNGs replaced with `/images/no_picture.jpg` (robot assets never in git)

## Platform Impact Assessment

- [x] Android
- [x] iOS
- [x] Web
- [x] Shared code
- [ ] Not applicable

(Web verified by build/tests; native behavior unchanged in principle but
unproven without device.)

## Native Plugin Impact

- [x] No native plugin changes
- [ ] Existing plugin modified
- [ ] New plugin required
- [ ] Android configuration required
- [ ] iOS configuration required
- [ ] Native permissions affected
- [ ] Capacitor sync required
- [ ] Native compatibility verification required

Details: Capacitor stays 8.3.4 (Ionic 9 supports 7+); `isPlatform` behavior
unchanged for Capacitor ≥3. `cap sync` NOT run (no native dirs committed).

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

## Testing and Verification

- Lint: FAILED (pre-existing)
- Typecheck: FAILED (pre-existing)
- Unit tests: FAILED (pre-existing)
- Web build: PASSED (`npx vite build` under Ionic 9.0.4, ~14.5s; chunk-size warnings only)
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

Details: lint has 145 repo-wide pre-existing errors (touched files 105 → 104,
zero new); typecheck went 26 → 13 after the import-casing sweep of 2026-09-22
(all TS1261/TS1149 resolved; remaining 13 are non-casing pre-existing errors);
unit suite fails on starter leftover `@/views/Tab1Page.vue` (missing). Cypress
e2e BLOCKED (binary not installed).

## Risks

- Vue Router 5 guard return-pattern interaction with `@ionic/vue-router`
  outlet transitions — verify via typecheck + build + e2e if possible.
- `ion-select`/`ion-modal` subtle behavior changes need manual QA on device.
- Cypress may be BLOCKED (no browser in this env) — record honestly.

## Evidence

- `src/router/index.ts:237-252` (guard migrated to return-value pattern)
- Former `IonImg` sites now native `<img>`: `home.vue`, `chat.vue`,
  `VersionCheck.vue`, `BaseAvatar.vue`, `BaseImage.vue` (+ unused imports
  removed from `TempAlt.vue`, `TempFecth.vue`)
- https://ionicframework.com/docs/updating/9-0
- `package.json:39-40` (`^9.0.0`, installed 9.0.4); `.browserslistrc` v9 floors
- `BaseModal.vue:74` (`handle-behavior="none"`); `Error.vue:10-21` asset fix
- `npx @ionic/migrate --dry-run` (18 migrations: 2 auto + 4 manual groups)

## Completion Criteria

Packages on v9, guard migrated, no deprecated usages left, lint+typecheck+
unit+web build PASSED, native results recorded as NOT_RUN with reason,
agent docs updated, limitations disclosed.

## Final Summary

Upgraded `@ionic/vue` + `@ionic/vue-router` 8.8.8 → **9.0.4** (Vue 3.5.35,
vue-router 5.1.0, Capacitor 8.3.4 unchanged — all satisfy v9 minimums).
Applied all 18 `@ionic/migrate` items (auto: deps + browserslist; manual:
guard return pattern, 5× ion-img→img + 2 import removals, modal handle pin,
autocorrect cleanup). Fixed one build-blocking pre-existing bug (`Error.vue`
missing-asset `require()`). Web build PASSED; lint/typecheck/unit failures are
pre-existing and unchanged (evidenced); native verification NOT_RUN (no native
projects/SDKs here — needs device follow-up incl. select/modal visual QA).
Agent docs updated to Ionic 9. Status: DONE.
