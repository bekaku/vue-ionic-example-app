# COMPONENTS — Detailed Reference (Ionic Vue)

Authoritative home for component/page rules. Entry:
`.agents/skills/mobile-components/SKILL.md`.

## 1. Page structure (VERIFIED)

Standard page = `BasePage.vue` wrapping
`ion-page > (ion-header > Toolbar) > ion-content` (`src/components/base/BasePage.vue:85-167`).
Representative: `src/pages/tabs/home.vue` › `home-layout` uses `BasePage` with
`#start` / `#actions-end` slots, then responsive `BaseCard` sections and
`BaseSegment` to select overview, analytics or activity. Rules:

- Every new route page must use `BasePage` as its root; do not start a new
  page with a bare `IonPage`/`IonHeader`/`IonToolbar`. Only the existing
  custom shells (`auth/login.vue`, `Index.vue`, `tabs/index.vue`) and the
  tab-router example shell use `IonPage` directly (`TempAlt`/`TempFecth`
  are unrouted legacy files).
- Content goes in the default slot (wrapped in `BasePage`'s `IonContent`).
  When the page needs its own `IonContent` (a template ref for scrolling,
  `IonInfiniteScroll` at the top) or an `IonFooter`, fill the `#content`
  slot with `IonContent` + `IonFooter` as siblings — the header, title and
  back button still come from `BasePage` (`pages/chat/index.vue`). Scoped
  classes on elements in `#content` work as usual; a class passed through
  `content-class` lands on `BasePage`'s element, so style it with `:deep()`.
- Props pattern per `BasePage.vue:14-51`: `pageTitle`, `showBackLink`,
  `pageDefaultBackLink='/tabs/home'`, `translucent`, `scrollY/fullscreen`, etc.
- Reuse `src/components/base/*` (`BaseButton`, `BaseCard`, `BaseIcon`,
  `BaseSegment`, `BaseTextHeader`, `BaseToolbar`, `BaseBackButton`,
  `BaseAvatar`). Do not add Quasar components.
- Use `BaseButton` for every clickable button; do not add native `<button>`
  or a bare `IonButton`. Icon-only: `icon-only` + `:icon`
  (`app/PasswordForm.vue`), or `clear` + `round` with a
  `<BaseIcon slot="icon-only">` in the default slot when the icon needs
  exact sizing (`chat/MessageItem.vue` › `.message-action`). Custom look:
  override `IonButton` CSS custom properties (`--background`, `--color`,
  `--padding-*`, `--border-radius`) on a scoped class, not native `button`
  styles (`chat/MessageItem.vue` › `.message-action`, `.reply-preview`).
- Use `BaseIcon` for icons in new code; do not add a bare `<ion-icon>`.
  Ionicons: `:name="<ionicon>" icon-set="ion"`; SVG sets (`bootstrap-icons`,
  `mdi`, …) pass the path string as `name`. Size with `:size` (px, default
  20), not CSS `font-size` — `BaseIcon` sets `font-size` inline.
  `BaseIcon` also sets an inline `top: 3px` on ion icons to align them with
  text; pass `style="top: 0"` when the icon must sit centered (icon-only
  buttons, `chat/MessageItem.vue`). Colour comes from `color` (theme class)
  or inherits `currentColor` from the parent (e.g. the button `--color`).
- Use `BaseAvatar` for avatars in new code; do not add a bare `<ion-avatar>`.
  Pass the URL as `src` and the diameter as `:size` (px, default 32; it sets
  width/height inline). Add `fetch-image` only for CDN files that need
  `FileManagerService.fethCdnData` (§3); plain URLs go straight to `src`.
  `BaseAvatar` renders nothing when `src` is empty, so render the no-avatar
  fallback (e.g. an initial) as a `v-else` sibling, not in its slot
  (`chat/MessageItem.vue` › `.message-avatar-fallback`). Overlays such as an
  online dot go in the `#extra` slot; give the avatar `position: relative;
  overflow: visible` via a scoped class (`pages/tabs/chat.vue` ›
  `.chat-avatar`, `.online-indicator`).
- Use `BaseImage` for images in new code; do not add a bare `<img>` or
  `<ion-img>`. Props: `src`, `alt` (default `'img'` — pass a real one),
  `ratio` (`'1' | '4/3' | '16/9'`, default `'1'`; it reserves the box
  height before load), `fit` (default `'cover'`), `fetch` for CDN files
  that need `FileManagerService.fethCdnData` (§3). It shows a spinner until
  load and renders nothing when `src` is empty, so render any fallback as a
  `v-else` sibling. Size it with `style`/a scoped class on the component
  (`profile/Card.vue`, `base/BaseOpenGraphItem.vue`). Exceptions: avatars
  use `BaseAvatar`; the zoom target inside `BaseImageView` and the preview
  inside `BaseImageCropper` stay raw `<img>` because their libraries need
  the element. Existing raw `<img>` in pages (logos, `404.vue`, …) are
  legacy — convert when you touch them.
- Menus (a button that opens a list of actions to pick from — "more" ⋮/…
  menus, overflow/settings menus) use `BaseDropdownMenu`; do not hand-build
  `BasePopover` + `IonList`. It renders its own trigger (`BaseButton`,
  `clear` + `round` by default, ⋯ icon unless `:icon`/`label` is given) and a
  popover list of `BaseLabelValueItem`s. Pass `:items="LabelValue<T>[]"`
  (`label`, `value`, `icon`, `color: 'danger'` for destructive items; build
  them in a `computed` to show/hide items per state) and handle
  `@on-select(value)`. `class`, `aria-label` and other attributes go to the
  trigger button — always pass an `aria-label` for icon-only triggers. The
  trigger is inside the component, so style it from the parent with
  `:deep(.your-class)` (`chat/MessageItem.vue` › `.message-actions`). Popover
  width prop is spelled `witdh`. Use `BasePopover` only for custom,
  non-list content (e.g. the reaction picker in `chat/MessageItem.vue`).
- Render user-written text (posts, comments, chat messages) with
  `BaseContentItem`, not `{{ text }}` or `v-html`:
  `<BaseContentItem wrap-text :content="text" :content-id="id" is-escape-html
  hashtag-urlify show-more />`. Always pass `is-escape-html` for user input
  (it escapes then sanitizes before `v-html`). `content-id` must be unique on
  the screen — it becomes a DOM id and the link/hashtag class names — so use
  Vue `useId()` per component instance (`chat/MessageItem.vue`,
  `pages/example/content-text.vue`). Defaults to know: `show-copy-text` is
  on (pass `:show-copy-text="false"` to hide the copy button), `limit` is 4
  lines before "see more", tapping the text toggles expand unless `to` is
  set, and links/hashtags use `text-primary`. It renders nothing when
  `content` is empty, so keep any fallback text as a `v-else` sibling.

## 2. Ionic components in use (VERIFIED, sample)

`IonApp` + `IonRouterOutlet` (`App.vue`), `IonPage/Header/Toolbar/Title/Content`,
`IonButtons/Row`, `IonList/Item/Label/Badge/CardContent`
(`tabs/home.vue` › `home-sales`, `BasePage.vue`). Home uses `BaseImage`
for its brand logo. Modals/alerts/toasts exist via controllers
(`toastController` in `useNotification.ts` › `reciveNotificationToast`;
`appConfirm/appLoading` in `useBase.ts`). Inspect the target area before assuming a component is unused.

`BaseTabs.vue` and the main tabs shell share `mobile-ui.scss` › `.app-tab-bar`
for the inset surface and small selected icon pill. BaseTabs preserves its
`activeColor`/`color` props, supports top/bottom placement, adapts button widths
to the visible item count, and passes `item.disable` to Ionic. Both UI tab
examples use this component. Its routed outlet leaves cached page visibility
to Ionic; it is not hidden unconditionally from accessibility.

## 3. Forms/validation/dialogs/loading

Validation via `src/composables/useValidation.ts`; RBAC via `rbac` directive
(`main.ts` › `startApp`); feedback via `useBase` toasts/confirms/loaders. Add
loading/error/empty states where the new interaction needs them; dismiss
loaders in `finally` so a thrown `ApiFetchError` cannot leave them open.

Remote images/PDFs: `BaseImage`/`BaseAvatar` with `fetch`/`fetch-image` load
through `FileManagerService.fethCdnData` and release blob URLs via
`useBlobUrls`; reuse them instead of calling `fethCdnData` directly.
Component tests: `tests/unit/BaseAvatar.spec.ts` shows the jsdom + mocked
`@ionic/vue` pattern.

## 4. Ionic lifecycle (VERIFIED principle)

Ionic can keep routed pages mounted while inactive. For work that must repeat
on re-entry, use an Ionic view hook and pair listener setup with cleanup.
The only `onIonView*` call site is `pages/chat/index.vue:297`
(`onIonViewDidEnter`, imported at `:18`). See `LIFECYCLE.md`.

## 5. Theme/UX (VERIFIED)

- App font: `variables.scss` › `@font-face` registers local Noto Sans Thai
  Looped files at weights 300/400/500/700; `--app-font-family` feeds
  `--ion-font-family` and custom form text. Use the family token for overrides.
- Theme CSS in `src/assets/css/` (`color.scss`, `variables.scss`, `mobile-ui.scss`, …) + dark
  mode via `useTheme` (`isDark`, StatusBar sync). Do not invent brand colors.
- Colour palette (`color.scss`) is the Tailwind CSS v4 default palette plus
  the brand palettes `primary/success/danger/warning/info`, all as
  `--color-<name>-<shade>` with shades `50…950` (hex; Tailwind's oklch values
  converted to sRGB — keep new colours in hex, not `oklch()`). Every pair
  has `.text-<name>-<shade>` / `.bg-<name>-<shade>` (`!important`), e.g.
  `text-red-500`, `bg-gray-100`, `var(--color-zinc-800)`. Names: `red orange
  amber yellow lime green emerald teal cyan sky blue indigo violet purple
  fuchsia pink rose slate gray zinc neutral stone mauve olive mist taupe`.
  Quasar colour names and the `1–14` scale are removed — do not use
  `grey`, `blue-grey`, `deep-purple`, `light-blue`, `light-green`,
  `deep-orange`, `brown`, bare `text-red`, or `--grey-*`. Mapping used in the
  migration: `grey→gray`, `blue-grey→slate`, `deep-purple→violet`,
  `light-blue→sky`, `light-green→lime`, `deep-orange→orange`, Quasar shade
  `1…10 → 50…900` (bare name → `500`). Component `color` props typed
  `AppColor` (`src/types/common.ts`) accept `` `${ColorName}-${ColorShade}` ``
  plus the Ionic/semantic names (`primary`, `muted`, …); `BaseIcon`/`BaseTabs`
  turn them into `text-<color>`. Semantic `.text-primary/-danger/-warning/
  -success` and `.bg-primary/…` still map to the Ionic `--ion-color-*` vars.
- App design tokens live in `variables.scss` as `--app-<group>-<role>`,
  valued from the palette (`var(--color-gray-100)`), never raw hex. Light
  values sit in `:root`; `body[color-theme='dark']` overrides the same token,
  so components just use `var(--app-bg-page)` and get both themes. A `-dark`
  suffix is a fixed dark value for code that styles dark mode explicitly.
  Groups: `--app-bg-page/-surface/-bar(-dark)`, `--app-border(-light/
  -lighter)(-dark)`, `--app-text-body/-strong/-muted/-muted-alt(-dark)`,
  `--app-input-bg(-dark)`, `--app-form-input-bg/-border`,
  `--app-segment-*-dark`, `--app-chat-bubble-sent-bg`,
  `--app-chat-bubble-received-bg/-text`, `--app-chat-meta-sent-text`,
  `--app-chat-meta-received-text`, `--app-chat-input-bg/-border`,
  `--app-refresher-color`. New tokens follow the same pattern; do not add
  `--v-*`, `--wee-*`, or unprefixed custom variables. `--ion-*` variables
  (incl. `--ion-color-*` with their `-rgb/-shade/-tint`) stay Ionic's own
  theme values.
- The app marks the active theme on `body[color-theme='dark']`. For a page-specific
  override in a scoped Vue SFC, nest a unique page class under that body
  selector. Ionic `IonContent` paints from its `--background` custom property:

  ```vue
  <style scoped lang="scss">
  .chat-room-content {
    --background: #fff;
  }

  body[color-theme='dark'] {
    .chat-room-content {
      --background: var(--app-bg-page-dark);
    }
  }
  </style>
  ```

  Vue scopes the page class in this form while keeping the body selector global.
  Avoid `:global(body[color-theme='dark']) .page-class` in this project: the
  current Vue scoped-style compiler discards `.page-class` in that form, so
  the rule misses the page.
- Safe areas: `useDevice().setSafeArea()` (`useDevice.ts:82-122`) applies
  `capacitor-plugin-safe-area` insets; Android SDK ≥ 35 gets `edge-to-edge`
  + `--app-safe-area-*` vars. iOS behavior is UNKNOWN without device evidence
  (see `PLATFORM_DIFFERENCES.md`).
- Keyboard: config-only (`capacitor.config.ts` `plugins.Keyboard`, `KeyboardResize.Body`);
  no direct `@capacitor/keyboard` import in `src` (NOT_FOUND) — verify before
  claiming behavior. StatusBar colors set per screen (`login.vue` ›
  `onMounted` → `setStatusBarColor`; `useTheme.ts`).
