# COMPONENTS — Detailed Reference (Ionic Vue)

Authoritative home for component/page rules. Entry:
`.agents/skills/mobile-components/SKILL.md`.

## 1. Page structure (VERIFIED)

Standard page = `BasePage.vue` wrapping
`IonPage > (IonHeader > Toolbar) > IonContent` (`src/components/base/BasePage.vue:78-...`).
Representative: `src/pages/tabs/home.vue:42-64` uses `BasePage` with
`#start` / `#actions-end` slots, then `BaseCard` sections. Rules:

- Never ship raw-`<div>` pages; always `BasePage`/`IonPage`.
- Props pattern per `BasePage.vue:14-50`: `pageTitle`, `showBackLink`,
  `pageDefaultBackLink='/tabs/home'`, `translucent`, `scrollY/fullscreen`, etc.
- Reuse `src/components/base/*` (`BaseButton`, `BaseCard`, `BaseIcon`,
  `BaseSegment`, `BaseTextHeader`, `BaseToolbar`, `BaseBackButton`,
  `BaseAvatar`). Do not add Quasar components.

## 2. Ionic components in use (VERIFIED, sample)

`IonApp` + `IonRouterOutlet` (`App.vue`), `IonPage/Header/Toolbar/Title/Content`,
`IonButtons/Row`, `IonList/Item/Label/Badge/CardContent/Img`
(`home.vue:24-31`, `BasePage.vue`). Modals/alerts/toasts exist via controllers
(`toastController` in `useNotification.ts:198`; `appConfirm/appLoading` in
`useBase.ts`). Inspect the target area before assuming a component is unused.

## 3. Forms/validation/dialogs/loading

Validation via `src/composables/useValidation.ts`; RBAC via `rbac` directive
(`main.ts:53`); feedback via `useBase` toasts/confirms/loaders. Keep
loading/error/empty states explicit on every data page.

## 4. Ionic lifecycle (VERIFIED principle)

Ionic caches tab pages: components stay mounted while inactive. `onMounted`
alone misses re-entry refreshes — use `onIonViewWillEnter/DidEnter/WillLeave`
for fetch/subscribe/cleanup decisions. Symmetric cleanup prevents stale
listeners (see `LIFECYCLE.md`).

## 5. Theme/UX (VERIFIED)

- Theme CSS in `src/assets/css/` (`color.scss`, `variables.scss`, …) + dark
  mode via `useTheme` (`isDark`, StatusBar sync). Do not invent brand colors.
- Safe areas: `useDevice().setSafeArea()` (`useDevice.ts:82-122`) applies
  `capacitor-plugin-safe-area` insets; Android SDK ≥ 35 gets `edge-to-edge`
  + `--app-safe-area-*` vars. iOS behavior is UNKNOWN without device evidence
  (see `PLATFORM_DIFFERENCES.md`).
- Keyboard: config-only (`capacitor.config.ts:20-24`, `KeyboardResize.Body`);
  no direct `@capacitor/keyboard` import in `src` (NOT_FOUND) — verify before
  claiming behavior. StatusBar colors set per screen (`login.vue:24-62`,
  `useTheme.ts:30-99`).
