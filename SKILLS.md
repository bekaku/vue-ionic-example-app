# SKILLS.md — Canonical Skill Routing (Mobile Repository)

Read `AGENTS.md` first. For implementation, load `mobile-core` and
`mobile-testing`, then add each domain skill that matches the code or behavior
being changed. Read each selected entry point and its required reference;
documentation-only audits use this map for review without loading every skill.

| Change touches | Add skill(s) |
| ------------ | ------------ |
| Pages, components, forms, theme, safe area UI | mobile-components |
| Routes, tabs, guards, back button, notification tap destination | mobile-navigation |
| App or cached page lifecycle, listener ownership | mobile-lifecycle |
| REST calls, HTTP client, upload/download transport | mobile-api |
| Login, tokens, session, authorization | mobile-auth, mobile-api |
| Preferences keys, cache, offline/sync behavior | mobile-local-data |
| Push, FCM, notification permission or tap | mobile-notifications, mobile-native-plugins |
| Incoming URLs, schemes, app/universal links | mobile-deep-links, mobile-navigation |
| Camera, gallery, file pick/preview/upload/save/share | mobile-files-media; add mobile-native-plugins for device operations |
| Native plugin calls, permissions or configuration | mobile-native-plugins |
| Web/native build, Capacitor sync, release | mobile-build-release |
| Dependencies: add/remove/update, `pnpm audit` fixes | mobile-core; add mobile-native-plugins for Capacitor plugins (then `npx cap sync` → mobile-build-release) |

## Canonical skill locations

- Entry points: `.agents/skills/<skill>/SKILL.md` (13 skills).
- Detailed references: `skills/mobile/` (`SKILL.md` = core, plus
  `COMPONENTS.md`, `NAVIGATION.md`, `NATIVE_PLUGINS.md`, `LIFECYCLE.md`,
  `API.md`, `AUTH.md`, `LOCAL_DATA.md`, `NOTIFICATIONS.md`, `DEEP_LINKS.md`,
  `FILES_MEDIA.md`, `BUILD_RELEASE.md`, `TESTING.md`).

| Skill | Entry point | Detailed reference |
| ----- | ----------- | ------------------ |
| mobile-core | `.agents/skills/mobile-core/SKILL.md` | `skills/mobile/SKILL.md` |
| mobile-components | `.agents/skills/mobile-components/SKILL.md` | `skills/mobile/COMPONENTS.md` |
| mobile-navigation | `.agents/skills/mobile-navigation/SKILL.md` | `skills/mobile/NAVIGATION.md` |
| mobile-native-plugins | `.agents/skills/mobile-native-plugins/SKILL.md` | `skills/mobile/NATIVE_PLUGINS.md` |
| mobile-lifecycle | `.agents/skills/mobile-lifecycle/SKILL.md` | `skills/mobile/LIFECYCLE.md` |
| mobile-api | `.agents/skills/mobile-api/SKILL.md` | `skills/mobile/API.md` |
| mobile-auth | `.agents/skills/mobile-auth/SKILL.md` | `skills/mobile/AUTH.md` |
| mobile-local-data | `.agents/skills/mobile-local-data/SKILL.md` | `skills/mobile/LOCAL_DATA.md` |
| mobile-notifications | `.agents/skills/mobile-notifications/SKILL.md` | `skills/mobile/NOTIFICATIONS.md` |
| mobile-deep-links | `.agents/skills/mobile-deep-links/SKILL.md` | `skills/mobile/DEEP_LINKS.md` |
| mobile-files-media | `.agents/skills/mobile-files-media/SKILL.md` | `skills/mobile/FILES_MEDIA.md` |
| mobile-build-release | `.agents/skills/mobile-build-release/SKILL.md` | `skills/mobile/BUILD_RELEASE.md` |
| mobile-testing | `.agents/skills/mobile-testing/SKILL.md` | `skills/mobile/TESTING.md` |

## Cross-domain examples

```text
Task: Implement push notification tap navigation for authenticated users.

Required skills:
mobile-core, mobile-notifications, mobile-navigation,
mobile-native-plugins, mobile-testing
```

Add `mobile-auth` if the task changes token/session or guard behavior, and
`mobile-lifecycle` if it changes listener ownership or cold-start timing.

For a file upload UI using `useUpload`, add `mobile-components`,
`mobile-files-media`, and `mobile-api`. Add `mobile-native-plugins` only if
the change also touches capture, storage, sharing, or native permissions.

## Rules

- Add skills for actual cross-domain behavior; a notification tap does not
  require `mobile-deep-links` unless it also handles an incoming URL.
- Do not load all 13 skills by default.
- Canonical entry points use progressive disclosure; full rules live in
  `skills/mobile/*.md`, evidence in `docs/agent/*.md`.
