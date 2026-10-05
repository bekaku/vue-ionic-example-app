# Task: Mobile UI refresh

## Metadata

- Task ID: 008
- Status: DONE
- Priority: Medium
- Created: 2026-10-05
- Updated: 2026-10-05

## Objective

Implement the proposed clean mobile UI with readable hierarchy, existing brand colour, rounded surfaces, short interaction motion, and a translucent floating tab bar. Keep changes reviewable and reversible on the active branch.

## Background

- VERIFIED: `src/main.ts` › `startApp` imports shared styles and forces Ionic iOS mode.
- VERIFIED: `BasePage`, `BaseButton`, `BaseCard`, `BaseIcon` and theme tokens already provide reusable UI foundations.
- VERIFIED: `tabs/home.vue` reads static demo data from `libs/data.ts`; its segment previously changed selection without changing displayed sections.
- VERIFIED: `tabs/index.vue` owns Ionic tabs and reserves their layout space; preserve its route nesting, callbacks and timer ownership.
- VERIFIED: existing Home search and recommendation links include missing destinations (`router/index.ts` route records); replacement shortcuts target existing routes.
- VERIFIED baseline: `vue-tsc --noEmit` fails with two errors for undefined `index`/`item` in `pages/example/virtual-scroller.vue:149` before edits.
- PARTIALLY_VERIFIED: native rendering/safe areas require devices; no native projects are committed.

## Scope

Shared visual tokens and base card/button/page styles; Home layout and localized copy; tab appearance and BaseIcon usage. Functional Home sections and existing-route shortcuts.

## Out of Scope

Backend/sibling repositories, authentication/API behavior, storage keys, dependencies, native configuration, signing, deployment, unrelated baseline errors.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md`, `skills/mobile/SKILL.md`
- `.agents/skills/mobile-components/SKILL.md`, `skills/mobile/COMPONENTS.md`
- `.agents/skills/mobile-testing/SKILL.md`, `skills/mobile/TESTING.md`
- `.agents/skills/mobile-navigation/SKILL.md`, `skills/mobile/NAVIGATION.md`
- `.agents/skills/mobile-build-release/SKILL.md`, `skills/mobile/BUILD_RELEASE.md`
- `docs/agent/PROJECT_REFERENCE.md`, `MOBILE_ARCHITECTURE.md`, `KNOWN_ISSUES.md`, `STANDARD_PAGE_COMPONENT.md`, `BUILD_RELEASE_GUIDE.md`

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-components
- [x] mobile-navigation
- [x] mobile-build-release

## Existing Implementation to Inspect

`main.ts` › `startApp`, `App.vue`, router route records, `tabs/home.vue`, `tabs/index.vue`, `BasePage`, `BaseButton`, `BaseCard`, `BaseToolbar`, `BaseSegment`, `useTheme`, `useLang`, `useDevice`, `useBase`, `authenStore`, `tabStore`, `libs/data.ts`, locale catalogs, theme palette, package/lockfile and env keys.

## Implementation Plan

1. Preserve clean baseline and record impact/verification limits.
2. Add shared visual tokens and scoped base styles; refresh Home and localize copy.
3. Style tabs with an inset glass surface while reserving tab/safe-area space.
4. Verify Home sections, shortcuts, responsive themes, typecheck and web build.

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] Shared light/dark tokens; solid fallback for glass; reduced motion support
- [x] Responsive Home with demo-data label, functional sections and valid shortcuts
- [x] Floating tabs with safe area and visible selection/keyboard focus
- [x] Verification and rollback instructions

## Platform Impact Assessment

- [x] Android
- [x] iOS
- [x] Web
- [x] Shared code
- [ ] Not applicable

Shared Vue/CSS UI only. Native parity is unverified.

## Native Plugin Impact

- [x] No native plugin changes
- [ ] Existing plugin modified
- [ ] New plugin required
- [ ] Android configuration required
- [ ] iOS configuration required
- [ ] Native permissions affected
- [ ] Capacitor sync required
- [ ] Native compatibility verification required

Details: existing safe-area vars retained; no plugin operations added.

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: static dashboard fixtures reused; no endpoints invented.

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: existing theme/locale persistence unchanged.

## Testing and Verification

- Static: FAILED (baseline and final have the same two pre-existing virtual-scroller errors, no additional errors)
- Unit/component: PASSED (`pnpm exec vitest run`: 3 files, 11 tests; Home mount, section switching, full activity, localization and shortcuts covered)
- Web visual/interaction: PASSED in a temporary isolated UI harness using actual Vue components/Ionic router (320×740, 390×844, 1024×900; light/dark; Thai/English; analytics/activity; Home → Chat → Other → Home). Simulated bottom safe area 34px shows the last sales row above the reserved tab bar. Harness removed after verification. This does not verify production login or device behaviour.
- Web build: PASSED (`pnpm exec vite build --outDir /tmp/mobile-ui-2027-final-build`). Warnings: unresolved pre-existing Prompt font reference, Ionic `host-context` minification, large chunks.
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

## Risks

Native keyboard and safe-area behaviour require device verification. CSS glass approximates translucency; it does not implement Apple's native optical material. Shared base styling affects existing screens.

## Evidence

Source symbols recorded above; current lockfile resolves Ionic 9.0.6, Vue 3.5.43 and Capacitor core 8.5.2 (dated architecture snapshot differs). Working tree was clean before edits.

## Completion Criteria

UI implemented, applicable verification recorded, baseline failures distinguished, impacts reviewed, limitations disclosed.

## Final Summary

DONE for the UI refresh. Changed application files:

- `src/assets/css/variables.scss`, new `src/assets/css/mobile-ui.scss`, `src/main.ts`
- `src/components/base/BaseButton.vue`, `src/components/base/BasePage.vue`
- `src/pages/tabs/home.vue`, `src/pages/tabs/index.vue`
- new `src/locales/en/dashboard.ts`, `src/locales/th/dashboard.ts`; locale `index.ts` files
- new `tests/unit/HomeDashboard.spec.ts`

Updated cited Home/theme evidence in `skills/mobile/COMPONENTS.md` and
`docs/agent/STANDARD_PAGE_COMPONENT.md`; recorded the pre-existing typecheck
failure as KNOWN_ISSUES #27. Removed unconditional `aria-hidden` from the
nested tab outlet so active page content is accessible; Ionic still owns cached
page visibility. No new listeners, routes, authentication, API, dependency or
persisted-data changes. New motion reduction covers added CSS interactions;
existing chart-library animations were not changed. OS preference fallback
queries were inspected, not toggled on the host.

Web tests and build passed. Android/iOS/device checks NOT_RUN. STATIC remains
FAILED only for the recorded baseline errors. `git diff --check` passed.

Screenshots: `/tmp/mobile-ui-2027-light.jpg`, `/tmp/mobile-ui-2027-dark.jpg`.
Starting working tree was clean; no commit/branch/push was made. The exact
tracked/new-file diff is saved to `/tmp/mobile-ui-2027-backup/ui-refresh.patch`
for rollback. Inspect subsequent user edits before reverse-applying; preserve
unrelated work. New-file snapshots and original tracked contents are retained
in `/tmp/mobile-ui-2027-backup/change-manifest.json`.


## Follow-up: active tab indicator (2026-10-05)

User requested a smaller active pill after the full-height selected surface
looked clipped. `tabs/index.vue` › `.tab-icon` now reserves the same 52×30px
icon area for every tab, with the accent fill only on the selected icon area.
The label retains the selected colour. Removed native-part margins that could
push the full-height element beyond the bar. Routes/callbacks unchanged.

Web visual/interaction: PASSED (all three tabs and Home return, light/dark,
390×844 viewport, isolated actual-component preview removed after verification).
Static: FAILED with the same two baseline virtual-scroller errors; no new errors.
`git diff --check` and targeted Prettier check: PASSED. Android/iOS: NOT_RUN.
No new unit tests or build needed for this localized CSS/markup correction.
Screenshot: `/tmp/mobile-tabbar-active.jpg`. Rollback snapshot updated.

## Follow-up: app font (2026-10-05)

Changed the app family to local Noto Sans Thai Looped in `variables.scss`.
Registered Light/Regular/Medium/Bold as weights 300/400/500/700 with
`font-display: swap` and corrected relative asset paths. Existing Ionic font
token references remain. `.form-input` and legacy `.reply-form textarea` now
use the same family token. Home, tab labels and shared button styles use 500
instead of 600; the Home heading uses 700 instead of 750. Updated font evidence
in `skills/mobile/COMPONENTS.md`. User-supplied TTF files were not modified.

Web BUILD: PASSED (`pnpm exec vite build --outDir /tmp/mobile-font-build`),
all four TTF assets emitted; the old unresolved Prompt font warning is gone.
Other existing Ionic CSS/large-chunk warnings remain.
STATIC: FAILED with the same two baseline virtual-scroller errors, no new errors.
Web visual: PASSED at 390×844 and 320×740; Thai headings, segment labels,
tab labels and stat numbers fit. Browser confirms the applied family and
loaded 400/500/700 faces. Weight 300 is declared/packaged but unused on Home
and therefore lazily unloaded. Legacy comment CSS has no current import.
Android/iOS: NOT_RUN. No unit tests added for CSS-only font changes.
`git diff --check`: PASSED. Screenshot: `/tmp/mobile-noto-font.jpg`.
Font-only pre-change snapshot: `/tmp/mobile-font-backup/before-font-change.json`.
The overall UI rollback excludes the user's newly supplied TTF assets.

## Follow-up: shared example tabs (2026-10-05)

User identified that `/example/ui/tabs` and `/example/ui/tabs-router/tab1`
still used the old tab bar. Moved the main tab styles into `.app-tab-bar` in
`mobile-ui.scss` and applied them to `BaseTabs.vue`. The selected icon pill
uses the configured active colour; sizing adapts to the visible tab count.
Top placement excludes the bottom safe-area inset. Main tabs use the same
shared class. Updated component/page evidence in the two existing docs.

BaseTabs now uses IonLabel, respects disabled items, permits empty item lists,
and removes unconditional `aria-hidden` from its routed outlet. Existing
ACL filtering and change events remain. The in-page example uses
`:fullscreen="false"` so its panel clears the header. No production routes,
authentication, API, native plugins or local-data behavior changed. Platform
impact: Web/Android/iOS presentation; native checks remain NOT_RUN.

UNIT/COMPONENT: PASSED, all 13 tests in 4 files (`pnpm exec vitest run`),
including BaseTabs disabled/empty/ACL/event checks.
BUILD: PASSED (`pnpm exec vite build --outDir /tmp/mobile-shared-tabs-build`);
existing Ionic CSS and chunk warnings remain.
STATIC: FAILED only for the same two virtual-scroller baseline errors (#27).
Web visual/interaction: PASSED, 390×844 in-page panels and router tabs,
Tab1→Tab2→Tab4 and browser back, disabled Videos, light/dark routed tabs,
and 1024×768 centered four-tab surface. Browser warnings/errors: none.
Temporary isolated preview entry points were removed; viewport reset/tab closed.
Android/iOS: NOT_RUN. `git diff --check`: PASSED. Status: DONE.
Screenshots: `/tmp/mobile-example-tabs.jpg`,
`/tmp/mobile-example-router-tabs.jpg`, `/tmp/mobile-example-router-tabs-dark.jpg`.
Overall rollback snapshots updated, still excluding user-supplied TTF assets.

## Follow-up: dark card surface (2026-10-05)

Corrected `variables.scss` › `body[color-theme='dark']` to map
`--app-bg-surface` to `--app-bg-surface-dark` instead of the page background.
IonCard and its list items now share zinc-900; page background remains zinc-950.
This applies to consumers of the shared surface token, including cards; no
component, route, native-plugin, API or local-data behavior changes.

Web visual: PASSED using the actual Appearance page in an isolated preview
at 390×844, dark and light. Computed dark card/item colours match (24,24,27)
and differ from page (9,9,11). Preview files removed and viewport/tab cleaned.
STATIC: FAILED with the same two baseline virtual-scroller errors (#27).
UNIT/BUILD: NOT_RUN for this single token correction; visual inspection is
the relevant check. Android/iOS: NOT_RUN. `git diff --check`: PASSED.
Status: DONE. Screenshot: `/tmp/mobile-dark-card-fixed.jpg`. Rollback updated.
