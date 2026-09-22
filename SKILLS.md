# SKILLS.md — Canonical Skill Routing (Mobile Repository)

Read `AGENTS.md` first. Then load **exactly** the skills below for your task.
All implementation tasks require `mobile-core` + `mobile-testing`.

| Task | Required skills |
| ---- | --------------- |
| General mobile work | mobile-core, mobile-testing |
| Ionic component | mobile-core, mobile-components, mobile-testing |
| Navigation | mobile-core, mobile-navigation, mobile-lifecycle, mobile-testing |
| Capacitor plugin | mobile-core, mobile-native-plugins, mobile-testing |
| Lifecycle | mobile-core, mobile-lifecycle, mobile-testing |
| REST API | mobile-core, mobile-api, mobile-testing |
| Authentication | mobile-core, mobile-auth, mobile-api, mobile-testing |
| SQLite/local storage | mobile-core, mobile-local-data, mobile-testing |
| Push notifications | mobile-core, mobile-notifications, mobile-native-plugins, mobile-testing |
| Deep links | mobile-core, mobile-deep-links, mobile-navigation, mobile-testing |
| Files/media | mobile-core, mobile-files-media, mobile-native-plugins, mobile-testing |
| Build/release | mobile-core, mobile-build-release, mobile-testing |

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

## Cross-domain example

```text
Task: Implement push notification navigation for authenticated users.

Required skills:
mobile-core, mobile-notifications, mobile-deep-links, mobile-navigation,
mobile-auth, mobile-native-plugins, mobile-lifecycle, mobile-testing
```

## Rules

- Load additional skills only for the actual task domain.
- Never auto-load all 13 skills.
- Canonical entry points use progressive disclosure; full rules live in
  `skills/mobile/*.md`, evidence in `docs/agent/*.md`.
