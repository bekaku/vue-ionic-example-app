---
name: mobile-native-plugins
description: >
  Use this skill when implementing, modifying, configuring, or debugging
  Capacitor native plugins, permissions, or Android/iOS integrations.
---

# mobile-native-plugins — Canonical Skill

## Purpose

Govern the complete native-plugin lifecycle with verified per-platform evidence.

## When to use

Any plugin call, wrapper, permission, platform-guard, install/update, or
native debugging task.

## Required reading

- `skills/mobile/NATIVE_PLUGINS.md`
- `docs/agent/NATIVE_PLUGIN_INVENTORY.md`
- `docs/agent/PLATFORM_DIFFERENCES.md`

## Relevant project locations

- `src/composables/useDevice.ts`, `src/composables/useFileSystem.ts`, etc.
- `capacitor.config.ts`, `package.json`, `pnpm-lock.yaml`

## Mandatory rules

1. Check each operation's platform support and existing wrapper. Use
   `isWeb()` where behavior differs; Camera and Preferences have web paths.
2. Classify each plugin ACTIVE / CONFIGURED_ONLY / UNUSED / LEGACY / UNKNOWN
   with import + config + usage evidence — never from `package.json` alone.
3. `Keyboard` direct usage is NOT_FOUND in `src` (config-only);
   `cordova-plugin-file` is LEGACY (used via `window.cordova.file`).
   `Haptics` was removed.
4. Plugin install/update reviews: Capacitor 8 compat, pnpm pin, Android
   permissions/Gradle, iOS Info.plist/entitlements/Pods, `cap sync` need,
   device runtime check. Never sync during docs tasks.

## Implementation workflow

1. Inventory plugin version + Android/iOS/Web support + permissions.
2. Reuse existing wrapper pattern (composable/service), keep platform guards.
3. Handle permissions, errors, listener cleanup.
4. Verify per `mobile-testing` (mock on web; device for native proof).

## Verification

Web fallback check + mocked unit tests; NATIVE_PLUGIN/ANDROID/IOS checks only
with emulator/device evidence.
