# Task: Date-fns composable migration

## Metadata

- Task ID: 010
- Status: DONE
- Priority: Medium
- Created: 2026-10-05
- Updated: 2026-10-05

## Objective

Adapt the provided Nuxt useDateFns API to Ionic Vue and migrate every DateUtil function consumer plus duplicate date formatting. Keep FORMAT_DATE_TIME_ALT = dd/MM/yyyy HH:mm.

## Background

VERIFIED: DateUtil contains date-fns helpers; useBase, chat, pickers, device/store, cache, file utilities and fixture data consume them. The working tree already contains user changes in useApi and tolerant parsing in DateUtil; preserve useApi and carry tolerant parsing into the new composable. Date-fns 4.4.0 is installed (package + lock). Nuxt injection is not present; direct imports are required.

## Scope

New useDateFns; DateUtil constants/aliases; all old helper callers and useBase date wrappers; duplicate Home/download/chat date formatting; regression tests.

## Out of Scope

Backend/Nuxt repos, API/auth behavior, storage schema, native configuration, dependency changes and deployment.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- mobile-core/testing/components/build-release/local-data skill entries and required references
- `docs/agent/*.md` evidence files

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-components, mobile-build-release, mobile-local-data

## Existing Implementation to Inspect

DateUtil, useBase, useLang, date picker/chat/Home components, useDevice/deviceStore/useCache and FileUtils; main/App/router traced in prior UI tasks. Required references and native/env config reviewed; no env values copied.

## Implementation Plan

1. Create locale-aware factory with setup and explicit-locale usage.
2. Migrate function imports, retain constants and data contracts.
3. Verify malformed inputs, ISO/custom formats, locale switching, auto formats, difference signs and date-picker/file/cache contracts.

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] Migration and regression tests

## Platform Impact Assessment

- [x] Android
- [x] iOS
- [x] Web
- [x] Shared code
- [ ] Not applicable

## Native Plugin Impact

- [x] No native plugin changes
- [ ] Existing plugin modified
- [ ] New plugin required
- [ ] Android configuration required
- [ ] iOS configuration required
- [ ] Native permissions affected
- [ ] Capacitor sync required
- [ ] Native compatibility verification required

Details: Shared JS only; no sync required.

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: Display/input parsing only; no endpoints or DTO changes. User useApi edit is unrelated and preserved.

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: Cache date key retains device toLocaleDateString; filename timestamp and signed minute differences retain existing contracts.

## Testing and Verification

- Static (typecheck `vue-tsc --noEmit`; lint not required): FAILED only for the two existing virtual-scroller.vue errors (#27); no new errors
- Unit/component: PASSED, 23 tests across 5 files. New date tests cover ISO/legacy/custom input, invalid inputs, locale refs/setup switching, auto formats/calendar days, signed differences, comparisons, filename/cache/duration contracts and date-picker events. Focused tests also PASSED under TZ=America/New_York (10 tests), including DST. API: NOT_APPLICABLE
- Web build: PASSED, pnpm exec vite build --outDir /tmp/mobile-date-fns-build; existing CSS/chunk warnings remain
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

(Use PASSED / FAILED / NOT_RUN / NOT_APPLICABLE / BLOCKED. Web ≠ native proof.
Choose checks from the changed behavior and platform impacts. If a check
fails, compare with the existing baseline and record both results; an old
failure is not a reason to omit a relevant check.)

## Risks

No committed native projects/devices; native verification unavailable. Rendering invalid dates must remain non-throwing. Localized formatting reads the locale at call time; machine/date key formats remain stable.

## Evidence

src/composables/useDateFns.ts; src/utils/DateUtil.ts; migrated consumers; tests/unit/useDateFns.spec.ts.

## Completion Criteria

Implementation complete, applicable build/platform checks performed, impacts
reviewed, API dependencies resolved or excluded, checkpoints done,
limitations disclosed.

## Final Summary

DONE. Added useDateFns and migrated every DateUtil helper import plus date formatting in Home, downloads and local chat messages. DateUtil retains format constants/aliases; useBase date wrappers removed and auth-session display migrated directly. Updated the core reference and added regression tests. Web tests/build and diff/format checks passed. Static fails only on the existing virtual-scroller baseline; Android/iOS NOT_RUN. No dependency, auth, native, storage or API contract changes. The pre-existing user useApi edit remains untouched; the tolerant DateUtil parsing change was retained in the new composable. Raw JWT/ID-generation clocks are not formatting helpers and remain unchanged. No commit or push performed.

## Follow-up: resolve static baseline (2026-10-05)

User requested fixing both baseline errors. Traced the generated virtual TS:
the static HTTPS `src` in BaseAvatar was rewritten incorrectly by vue-tsc,
producing cascading `index`/`item` errors despite valid slot scope. Moved
the URL to `avatarUrl` and bound `:src`, preserving the image and slot markup.
KNOWN_ISSUES #27 moved to Resolved with corrected evidence.

STATIC: PASSED (`pnpm exec vue-tsc --noEmit`, exit 0) on the entire current
working tree, including date migration. `git diff --check`: PASSED.
No additional unit/build checks for this constant-binding fix; previous date
unit/build results remain recorded above. Android/iOS: NOT_RUN.
Platform impact: shared template compilation; Native/API/Local Data impact:
none. Small targeted fix; no new task required. No commit/push performed.
