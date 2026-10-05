# STANDARD_PAGE_COMPONENT — Verified Conventions

Inspected: `BasePage.vue`, `tabs/home.vue`, `tabs/other.vue`, `auth/login.vue`.

## Layout (VERIFIED)

`BasePage (IonPage) > slot header (IonHeader > BaseToolbar > start/title/actions)
> IonContent > slot default`. Props: `pageTitle`, `showBackLink` (default
true, default href `/tabs/home`), `translucent/scrollY/fullscreen`,
`headerNoBorder/dark`, scroll events (`on-scroll/up/down`).

## Rules

1. New route pages must use `BasePage` as the root, with `page-title` +
   `show-back-link` (`tabs/home.vue` › `BasePage` sets `false` for the root tab) and
   `page-default-back-link` for the back target. Only the existing
   login/index/tabs shell and the tab-router example shell use `IonPage`
   directly (`TempAlt`/`TempFecth` are unrouted legacy files). For a page that needs its
   own `IonContent` ref or an `IonFooter`, use the `#content` slot
   (`pages/chat/index.vue`; `skills/mobile/COMPONENTS.md` §1).
2. Header actions via `#start` / `#actions-end` slots; content in
   `BaseCard` sections; lists via `IonList>IonItem`.
3. State from Pinia (`useAuthenStore`), theme via `useTheme`, strings via
   `useLang`; no hardcoded user-visible copy without i18n.
4. For new behavior that must repeat on cached-page re-entry, use Ionic view
   hooks and cleanup listeners with the owning view. The only current
   `onIonView*` call site is `pages/chat/index.vue:297` (`onIonViewDidEnter`,
   imported at `:18`).
5. StatusBar per screen where needed (`login.vue` › `onMounted` pattern).
6. Conflicts: if implementations diverge, follow the majority + newest usage
   and log the conflict in `KNOWN_ISSUES.md` — do not invent a universal
   pattern.
7. Loaders from `appLoading()` are dismissed in `finally` around API calls
   (`pages/settings/account-settings/*.vue`); `useApi` already toasts errors.

## UI refresh (2026-10-05, VERIFIED source; web visual check)

`main.ts` imports `mobile-ui.scss` after `variables.scss`. BasePage and
BaseButton expose `app-base-page` / `app-base-button` classes for shared
visual defaults. `tabs/home.vue` › `home-layout` displays localized demo
data with functional sections and responsive card grids;
`mobile-ui.scss` › `.app-tab-bar` supplies the inset translucent surface to
`tabs/index.vue` and `BaseTabs.vue`, including both UI tab examples (task
009 makes the main shell's bar float over content; BaseTabs stays in flow). Button widths adapt to the tab count. CSS fallback and reduced-motion/transparency
queries are present; OS preference behaviour and native safe areas remain
unverified on devices. See `tasks/008-mobile-ui-refresh.md`.

## Design system 2027 (2026-10-05, task 009)

Every page inherits the shared look (`skills/mobile/COMPONENTS.md` §6).
`BasePage` is translucent by default; the main tab bar floats over content
(`tabs/index.vue` › `ion-tabs.app-tabs-overlay`) and tab pages reserve
`--app-tab-bar-space`. Start a new page from this skeleton and compose with
the utilities instead of page-scoped look CSS:

```vue
<BasePage :page-title="t('x.title')" collapse="condense" fullscreen>
  <main class="app-page app-page-narrow">
    <section class="app-section">
      <div class="app-section-header">
        <h2>{{ t('x.section') }}</h2>
        <BaseButton clear size="small" @click="...">{{ t('x.more') }}</BaseButton>
      </div>
      <BaseCard :margin="false" class="app-surface app-surface-flush">
        <IonList><BaseMenuItem v-for="item in items" :key="item.value" :item /></IonList>
      </BaseCard>
    </section>
  </main>
</BasePage>
```

Reference pages: `tabs/home.vue` (dashboard), `tabs/other.vue`
(settings/grouped list), `tabs/chat.vue` (searchable list).

## Icon examples (2026-10-05, VERIFIED)

`pages/example/ui/icon.vue` demonstrates Lucide through `BaseIcon` and
`BaseButton`, alongside the existing icon sets. For the icon API and copyable
examples, use [COMPONENTS.md — Lucide icons](../../skills/mobile/COMPONENTS.md#lucide-icons-verified).
Use these shared wrappers when adding icons to a new page.
