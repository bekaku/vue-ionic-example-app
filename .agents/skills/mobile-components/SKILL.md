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

1. Pages use `BasePage` (`IonPage > IonHeader/Toolbar > IonContent`).
2. Reuse `src/components/base/*`; no Quasar/Nuxt components.
3. Ionic page lifecycle governs cached pages — not `onMounted` alone.
4. Do not invent brand colors; respect existing theme + safe-area handling.

## Implementation workflow

1. Inspect 2+ representative pages/components before choosing a pattern.
2. Reuse base components; wire props/emits/slots/v-model consistently.
3. Handle loading/error/empty states; clean up listeners on leave.
4. Verify per `mobile-testing` (component + lifecycle where cached).

## Verification

Component render/interaction checks; visual check on web; native check only
with device/emulator evidence.
