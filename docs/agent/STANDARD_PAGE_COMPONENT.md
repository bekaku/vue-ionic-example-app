# STANDARD_PAGE_COMPONENT — Verified Conventions

Inspected: `BasePage.vue`, `tabs/home.vue`, `tabs/other.vue`, `auth/login.vue`.

## Layout (VERIFIED)

`BasePage (IonPage) > slot header (IonHeader > BaseToolbar > start/title/actions)
> IonContent > slot default`. Props: `pageTitle`, `showBackLink` (default
true, default href `/tabs/home`), `translucent/scrollY/fullscreen`,
`headerNoBorder/dark`, scroll events (`on-scroll/up/down`).

## Rules

1. New route pages need an `IonPage` root. Prefer `BasePage` with `page-title`
   + `show-back-link` for standard screens (`home.vue:41-44` sets `false` for
   the root tab); login/index/tabs shell use `IonPage` directly.
2. Header actions via `#start` / `#actions-end` slots; content in
   `BaseCard` sections; lists via `IonList>IonItem`.
3. State from Pinia (`useAuthenStore`), theme via `useTheme`, strings via
   `useLang`; no hardcoded user-visible copy without i18n.
4. For new behavior that must repeat on cached-page re-entry, use Ionic view
   hooks and cleanup listeners with the owning view. No existing page imports
   those hooks as of this review.
5. StatusBar per screen where needed (`login.vue:38-62` pattern).
6. Conflicts: if implementations diverge, follow the majority + newest usage
   and log the conflict in `KNOWN_ISSUES.md` — do not invent a universal
   pattern.
