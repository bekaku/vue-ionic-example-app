# Task: App design system 2027 (glass chrome + tonal surfaces)

## Metadata

- Task ID: 009
- Status: DONE
- Priority: Medium
- Created: 2026-10-05
- Updated: 2026-10-05

## Objective

Raise the UI from task 008 to a coherent, reusable design system based on the
current platform direction (iOS 26 Liquid Glass, Material 3 Expressive):
floating translucent chrome over edge-to-edge content, tonal borderless
surfaces with concentric radii, iOS-style inset grouped lists with tinted icon
chips, large titles on root tabs, and spring-like motion. The user requires
the look to apply to **every page, including pages added later**, so it lives
in tokens, global styles, base components and documented rules rather than
page-scoped CSS.

## Background

- VERIFIED: `variables.scss` `:root` holds `--app-*` tokens; `mobile-ui.scss`
  styles `ion-card`, `.app-base-button`, `.app-base-page` and `.app-tab-bar`
  (task 008).
- VERIFIED: `tabs/index.vue` keeps `.app-tab-bar` in Ionic layout flow, so
  the glass bar never has content behind it.
- VERIFIED: `BasePage.vue` already supports `translucent` and
  `collapse="condense"` (large title), but no page uses them.
- VERIFIED: `BaseMenuItems.vue` renders section labels inside the card
  (`IonCardHeader`), used by `tabs/other.vue` and `pages/example/ui/menu.vue`.
- VERIFIED baseline: `vue-tsc --noEmit` = 2 pre-existing errors
  (`virtual-scroller.vue:149`, KNOWN_ISSUES #27); `vitest run` = 4 files /
  13 tests passed.

## Scope

Tokens and global styles; `BasePage`, `BaseMenuItems`, `BaseMenuItem`,
`BaseSegment`, `tabs/index.vue` (overlay glass tab bar); restyle Home, Chat
and Other root tabs with shared utility classes; document the system for future pages.

## Out of Scope

Routes, auth, API, storage keys, native config/plugins, dependencies,
brand-colour changes, sibling repositories.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md`, `skills/mobile/SKILL.md`
- `.agents/skills/mobile-components/SKILL.md`, `skills/mobile/COMPONENTS.md`
- `.agents/skills/mobile-testing/SKILL.md`, `skills/mobile/TESTING.md`
- `docs/agent/STANDARD_PAGE_COMPONENT.md`, `tasks/008-mobile-ui-refresh.md`

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-components

## Existing Implementation to Inspect

`main.ts` style imports, `variables.scss`, `mobile-ui.scss`, `BasePage`,
`BaseCard`, `BaseMenuItems`, `BaseMenuItem`, `BaseSegment`, `BaseTabs`,
`BaseIcon`, `tabs/index.vue`, `tabs/home.vue`, `tabs/chat.vue`,
`tabs/other.vue`, `UserLoginedCard`, unit tests in `tests/unit/`.

## Implementation Plan

1. Tokens: radii scale, glass material, spring easing, page/surface tones.
2. Global styles: glass header/tab bar, cards, inset lists, menu icon chips,
   segment, searchbar, modal sheet, page utility classes, entrance motion.
3. Base components: BasePage translucent by default; BaseMenuItems labels
   above cards; BaseMenuItem icon chip; BaseSegment class hook.
4. Tab bar overlays content; tab pages reserve its height via a token.
5. Restyle root tabs with the utilities; document rules for future pages.
6. Verify: typecheck, unit tests, web build, web visual (light/dark, 390/320).

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] Tokens + global styles with fallbacks (no backdrop-filter, reduced
      motion/transparency, high contrast)
- [x] Base component defaults
- [x] Root tabs restyled with shared utilities
- [x] Docs: COMPONENTS.md, STANDARD_PAGE_COMPONENT.md, mobile-components skill

## Platform Impact Assessment

- [x] Android
- [x] iOS
- [x] Web
- [x] Shared code
- [ ] Not applicable

Shared Vue/CSS presentation. Native rendering/safe areas unverified.

## Native Plugin Impact

- [x] No native plugin changes
- [ ] Existing plugin modified
- [ ] New plugin required
- [ ] Android configuration required
- [ ] iOS configuration required
- [ ] Native permissions affected
- [ ] Capacitor sync required
- [ ] Native compatibility verification required

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

- Static: FAILED only for the 2 baseline errors (#27, `virtual-scroller.vue:149`); no new errors
- Unit/component: PASSED (`pnpm exec vitest run`, 4 files / 13 tests, existing Home tests unchanged)
- Web build: PASSED (`pnpm exec vite build --outDir <scratchpad>`); only existing chunk-size warnings
- Web visual: PASSED on the running dev server (390×844, 320×740, 1024×800; light + dark;
  Home overview/analytics, Chat, Other, `/example/ui/tabs`, `/settings/appearance`).
  Computed styles confirmed glass header (`backdrop-filter: saturate(1.8) blur(24px)`),
  absolute tab bar and `--padding-bottom: calc(96px + 0px)` on tab content.
  Auth guard was passed with temporary placeholder Preferences keys in the
  preview browser (local backend returned 401/400; app mounted); keys removed afterwards.
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator/physical device: NOT_RUN

## Risks

Global defaults (translucent header, card/list styles) affect every page.
CSS backdrop blur approximates, not replicates, native glass. Overlay tab bar
relies on the reserved-content-padding token for tab pages.

## Evidence

See Background.

## Completion Criteria

System implemented and documented, verification recorded, limitations disclosed.

## Final Summary

DONE. Files: `variables.scss` (task 009 tokens, page tone zinc-100),
`mobile-ui.scss` (rewritten in 8 sections: surfaces, lists, controls, chrome,
tab bar, page utilities, motion, fallbacks), `BasePage` (`translucent`
default `true`), `BaseMenuItem` (`.app-menu-item`, `.app-menu-icon` chip,
default icon 18px; dead commented markup removed), `BaseMenuItems` (group
label above the card only for items with children), `BaseSegment`
(`.app-segment`), `tabs/index.vue` (`app-tabs-overlay`), `tabs/home.vue`,
`tabs/chat.vue`, `tabs/other.vue` (large titles, utilities, version footer),
`UserLoginedCard` (tokens instead of inline styles; hidden when no `auth`;
profile-count badge only when > 1 account). Docs: `skills/mobile/COMPONENTS.md`
§1/§2/§6, `docs/agent/STANDARD_PAGE_COMPONENT.md` (new-page skeleton),
`.agents/skills/mobile-components/SKILL.md` rule 6.

No routes, auth, API, storage keys, native config or dependencies changed.
Android/iOS/device: NOT_RUN — glass blur, safe-area insets with the overlay
tab bar, and keyboard behaviour need device verification. `git diff --check`:
PASSED. No commit made.

## Follow-up: charts not rendering on `/example/charts` (2026-10-05)

Pre-existing bug, not caused by the design system. Each chart component
(`ChartArea/Radial/Radar/Pie/Sparklines`) renders `apexchart` only when its
`visibilityRef` wrapper is intersecting with width > 0. In
`pages/example/charts.vue` the wrapper is the only child of
`IonRow.ion-justify-content-center` (flex), so with no rendered chart it
shrank to 0×0 and never rendered; Sparklines worked because `IonCol` gives
width. Fixes in all five components:

1. Wrapper `style="width: 100%; min-width: 0"`.
2. `observeVisibility`: a chart now mounts on first view and stays mounted
   while scrolled away; it is dropped only when width is 0 (hidden cached
   page) — previously it was destroyed and re-animated on every scroll out.

Web visual: PASSED at 390×844. All 19 charts render after scrolling and stay
mounted. Back navigation and Home analytics → Chat → Home are clean, with no
NaN/SVG console errors. STATIC: same 2 baseline errors. UNIT: 13/13 PASSED.
Android/iOS: NOT_RUN.

## Follow-up: login page (2026-10-05)

User reported the login form looked odd with borders between inputs. Causes:
the task-009 card list rule added separators to every `ion-item` in a card,
including the form rows, and the global `ion-input --background` drew a second
box inside `.wee-login-input`. Fixes:

- `mobile-ui.scss`: separators only for direct card rows or `IonList` without
  `lines="none"`; new `.app-form` / `.app-field` filled-field utilities
  (focus ring, transparent inner input). Documented in COMPONENTS.md §6.
- `AppLoginForm.vue`: `app-field` inputs (no IonList/IonItem), `BaseButton`
  password toggle with localized `aria-label`
  (`authen.showPassword/hidePassword`, en + th), wrapping consent checkbox,
  pill submit (`BaseButton type="submit"`), compact language chip. Submit,
  verify-duplicate, terms gating and `#top`/`#additionalAction` slots kept.
- `login.vue`: brand gradient hero (`--app-bg-hero`, `BaseImage` logo) with
  rounded overlapping sheet; animated squares removed. Status bar, login
  check and timers unchanged.

Web visual: PASSED at 390×844 and 320×640, light and dark, field focus, and
terms checked → submit enabled. The form was not submitted. `add-account.vue`
reuses the form but was not opened (it requires auth); it uses only the
`#top` slot. STATIC: PASSED (0 errors; the working tree also contains
concurrent task-010 edits, including the virtual-scroller fix). UNIT: PASSED
(23/23, includes task-010 tests). Android/iOS: NOT_RUN. Not committed.

## Follow-up: signature login screen (2026-10-05)

The user asked for a world-class login and a link to the theme page.
`login.vue` now has:
- an animated brand aurora (three palette radial orbs, transform-only
  animation, static SVG grain), which stops under `prefers-reduced-motion`
- a glass squircle logo
- a glass top bar with a theme button → `/settings/appearance` and a language
  button → `/settings/languge` (both `noRequireAuth`)
- a solid form card headed by `authen.welcomeBack` / `authen.loginSubtitle`
  (en + th)

`AppLoginForm` changes:
- floating labels
- a gradient pill submit with a sheen sweep, clipped by the native part,
  that stops under reduced motion; muted disabled state
- new `showLanguage` prop (default `true`; login passes `false`)

`add-account.vue` behaviour is unchanged.

Web visual: PASSED at 390×844 and 320×640, light and dark. Terms checked →
submit enabled. The theme button navigates to `/settings/appearance` and back.
`aria-label` is forwarded to the native button. The form was not submitted.
Android/iOS: NOT_RUN. Performance of backdrop blur plus animated orbs on
low-end Android is unverified.

## Follow-up: colours follow `--ion-color-primary` (2026-10-05)

The user changed `--ion-color-primary` to teal (`#00bba7`). Several
task-009 colours did not follow, because they used the fixed
`--color-primary-*` scale or fixed palette hues:
- `--app-text-accent`: icon-chip icons and the active tab
- `--app-bg-hero`, the login aurora and the login submit gradient
- live/online dots

All of these now derive from `--ion-color-primary` (+ `-tint/-shade/-contrast`),
`--ion-color-success` and `--ion-color-danger` via `color-mix()`. New
`--app-live` token. The login status bar reads the computed
`--ion-color-primary` (falling back to `DefaultColor`). Rule recorded in
COMPONENTS.md §6 "Colour source".

Left as is: the pre-existing `--app-chat-bubble-received-text` (indigo-950
text), `DefaultColor` in `libs/constant.ts` (still `#3880ff`, only a fallback
now), the `/example/ui/tabs` demo's explicit `active-color="amber-800"`, and
the fixed `--color-primary-*` scale in `color.scss`.

Web visual: PASSED. Other/Home/login in light and dark show teal chips, active
tab, hero and aurora. Android/iOS (status bar colour): NOT_RUN.

## Follow-up: primary-tinted backgrounds (2026-10-05, trial — ROLLED BACK)

The user asked for primary-toned backgrounds: a faint wash in light mode and
deep primary-toned neutrals in dark mode, as in their reference. Changes are
in `variables.scss` only:
- `--app-bg-page` = primary 7% on white; `--app-bg-bar` follows the page
- dark page/surface/elevated = primary 10/14/18% on zinc-900/800/700
- new `--app-tint-ink` for `--app-bg-sunken` and `--app-hairline`
- chat received bubble/input, dark segment and dark glass tinted
- dark hero brightened (70%→32% primary on black) so it stands out from cards

Cards stay white in light mode. Web visual: PASSED (Home/Other/Chat, light +
dark, 390×844).

Rolled back on the user's request ("does not fit"): the patch was
reverse-applied, so `variables.scss` matches its state before the trial
(neutral zinc backgrounds; colour-source tokens from the previous follow-up
kept). The patch file was removed.
