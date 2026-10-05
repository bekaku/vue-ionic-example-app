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
