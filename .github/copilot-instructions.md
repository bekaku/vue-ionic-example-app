# Copilot Instructions — Mobile Repository (Ionic Vue + Capacitor)

The authority is `AGENTS.md` + `SKILLS.md` at the repository root.

- This is the **mobile repo only** (`vue-ionic-mobile`: Ionic Vue + Capacitor).
  Do not edit backend (Spring Boot) or web frontend (Quasar) code; document
  cross-repo dependencies in the task instead.
- Before changing code: read `AGENTS.md` and `SKILLS.md`, load the routed
  `.agents/skills/*/SKILL.md` entry points plus their required
  `skills/mobile/*.md` references, and inspect the existing implementation
  (`src/main.ts`, `src/App.vue`, `src/router/`, relevant composables/stores).
- Conventions: Composition API + `<script setup lang="ts">`, `@/` alias,
  `Base*` components in `src/components/base/`, `IonPage`-based pages,
  Pinia stores, single axios client (`src/plugins/axios.ts`), Capacitor
  Preferences for local data, `useDevice().isWeb()` guards for native calls.
- Never run `npx cap sync`, change native config/signing/permissions, or claim
  Android/iOS verification from a web-only build. Record platform results
  separately (web / Android / iOS).
