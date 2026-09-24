---
name: mobile-core
description: >
  Use this skill for any Ionic Vue + Capacitor mobile work: Vue architecture,
  Composition API, TypeScript, state, env config, shared conventions.
  Required for every implementation task alongside mobile-testing.
---

# mobile-core — Canonical Skill

## Purpose

Establish the verified mobile app architecture and shared conventions. This is
the mandatory foundation skill for all implementation tasks.

## When to use

Every mobile implementation task. Add domain skills per `SKILLS.md`.

## Required reading

- `skills/mobile/SKILL.md`
- `docs/agent/PROJECT_REFERENCE.md`
- `docs/agent/MOBILE_ARCHITECTURE.md`

## Relevant project locations

- `src/main.ts`, `src/App.vue`, `src/router/index.ts`
- `src/stores/`, `src/composables/useConfig.ts`, `src/libs/constant.ts`
- `package.json`, `pnpm-lock.yaml`, `capacitor.config.ts`, `tsconfig.json`

## Mandatory rules

1. Composition API + `<script setup lang="ts">`, strict TS, `@/` alias.
2. App mode forced `mode: 'ios'` (`src/main.ts`). Do not change per-platform.
3. Trace state through Pinia stores, composables, and callers before choosing
   the change location; `src/pages/example/` is demonstration code.
4. Env via `import.meta.env` (`VITE_*`); never commit secret values.
5. `pnpm` only; do not upgrade/alter dependencies in docs tasks.
6. Classify findings with file:line evidence; no invented versions/contracts.

## Implementation workflow

1. Read AGENTS.md + SKILLS.md + this entry + required reading.
2. Inspect entry, router, stores, composables actually involved.
3. Write task file for substantial work; implement minimally; reuse `base/`.
4. Verify per `mobile-testing`; report web/Android/iOS separately.

## Verification

Typecheck + relevant unit/component checks; lint is not required
(`skills/mobile/TESTING.md` §2). Disclose what was NOT_RUN.
