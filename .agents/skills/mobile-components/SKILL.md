---
name: mobile-components
description: >
  Use this skill when creating, modifying, or debugging Ionic Vue components,
  pages, forms, dialogs, or theme/safe-area UI behavior.
---

# mobile-components — Canonical Skill

## Purpose

Enforce the verified Ionic component and page conventions.

## When to use

Any page, shared component, form, dialog, loading/empty/error state, or theme
change.

## Required reading

- `skills/mobile/COMPONENTS.md`
- `docs/agent/STANDARD_PAGE_COMPONENT.md`

## Relevant project locations

- `src/pages/`, `src/components/base/` (`BasePage.vue`, `BaseButton.vue`, …)
- `src/assets/css/`, `src/composables/useTheme.ts`, `src/composables/useDevice.ts`

## Mandatory rules

1. New route pages must use `BasePage` as the root (use its `#content` slot
   when the page needs its own `IonContent` ref or an `IonFooter`). Only the
   existing login, index, and tabs shell use `IonPage` directly.
2. Reuse `src/components/base/*`; no Quasar/Nuxt components. Buttons must
   use `BaseButton` — never a native `<button>` or bare `IonButton`; icons
   must use `BaseIcon` — never a bare `<ion-icon>`; avatars must use
   `BaseAvatar` — never a bare `<ion-avatar>`; images must use
   `BaseImage` — never a bare `<img>`/`<ion-img>`; user-written text
   must use `BaseContentItem` with `is-escape-html` and a `useId()`
   `content-id`; action menus must use `BaseDropdownMenu` (`items` +
   `@on-select`), not a hand-built `BasePopover` list
   (see `skills/mobile/COMPONENTS.md` §1).
3. For re-entry behavior, use Ionic page lifecycle; current pages do not
   establish a universal view-hook pattern.
4. Do not invent brand colors; respect existing theme + safe-area handling.
   Colours come from `color.scss` (Tailwind v4 palette, `50…950`:
   `text-red-500`, `bg-gray-100`, `var(--color-zinc-800)`); no Quasar colour
   names or `1–14` shades. Theme values use the `--app-<group>-<role>`
   tokens in `variables.scss` (dark overrides the same token), valued from
   the palette — no raw hex (see `skills/mobile/COMPONENTS.md` §5).
5. For page-specific dark styles in a scoped Vue SFC, target the page class under
   `body[color-theme='dark']`; for Ionic `IonContent`, set `--background`.
   Check the selector pattern in `skills/mobile/COMPONENTS.md` §5.

## Implementation workflow

1. Inspect the target page and its nearest reusable component/peer pattern.
2. Reuse base components; wire props/emits/slots/v-model consistently.
3. Handle loading/error/empty states; clean up listeners on leave.
4. Verify per `mobile-testing` (component + lifecycle where cached).

## Verification

Component render/interaction checks; visual check on web; native check only
with device/emulator evidence.
