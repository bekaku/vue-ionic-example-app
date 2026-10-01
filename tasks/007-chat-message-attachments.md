# Task: Show chat message images and files

## Metadata

- Task ID: 007
- Status: IN_PROGRESS
- Priority: Medium
- Created: 2026-09-25
- Updated: 2026-09-25

## Objective

Render `GroupChatMsgDto.files` in the chat message component using `BaseFileItems.vue`, with image grid and other-file list layouts, and record the verified convention in `AGENTS.md`.

## Background

- VERIFIED: `src/components/chat/MessageItem.vue` currently shows a type label when `chatMsg` is empty, even if `message.files` contains attachments.
- VERIFIED: `GroupChatMsgDto.files` contains `GroupChatFileDto.fileManager` entries; `FileManager.fileMimeType` distinguishes images.
- VERIFIED: `BaseFileItems.vue` accepts `items`, `layout`, `limit`, `gridSize`, and `showViewDialog` props. Ionic `IonCol size` is a fraction of `--ion-grid-columns` (default 12).
- NOT_FOUND: `getFilesItems` and `getImageItems` helpers are not present in the current working tree; this task adds them in `MessageItem.vue`.

## Scope

- Extract image and non-image `FileManager` values from each message.
- Display images in a grid with `gridSize="1"` for one image and `"6"` otherwise, with limit 4; make the single-image grid use one total column.
- Display other files as a list with limit 4.
- Preserve text and reply content, avoid type-only placeholder when attachments exist, and document the verified rule in `AGENTS.md`.

## Out of Scope

- Uploads, backend/API changes, native plugin configuration, and changes to `BaseFileItems.vue` behavior.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md` + `skills/mobile/SKILL.md`
- `.agents/skills/mobile-components/SKILL.md` + `skills/mobile/COMPONENTS.md`
- `.agents/skills/mobile-files-media/SKILL.md` + `skills/mobile/FILES_MEDIA.md`
- `.agents/skills/mobile-testing/SKILL.md` + `skills/mobile/TESTING.md`

## Required Skills

- [x] mobile-core
- [x] mobile-components
- [x] mobile-files-media
- [x] mobile-testing

## Existing Implementation to Inspect

- `src/components/chat/MessageItem.vue` — message content and styles.
- `src/components/base/BaseFileItems.vue` — layout and file viewer props.
- `src/types/models.ts` — chat and file DTOs.
- `src/libs/data.ts` — sample messages with image and PDF attachments.

## Implementation Plan

1. Derive separate image and other-file collections from `message.files` without mutating the DTO.
2. Render both collections through `BaseFileItems` with the requested layouts and limits.
3. Add repository guidance and record verification and impacts.

## Checkpoints

- [x] Discovery + classification recorded
- [ ] Implementation complete
- [ ] Impacts reviewed (Platform/Native/API/Data)
- [ ] Verification recorded

## Implementation Checklist

- [ ] Image grid renders with the requested sizing and limit.
- [ ] Other files render in a list with limit 4.
- [ ] Text-only, mixed, empty, and unsent messages keep appropriate content.
- [ ] `AGENTS.md` records the verified attachment pattern.

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

Details: Reuses existing `BaseFileItems` and file viewer behavior.

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: Reads existing frontend DTO fields and sample data.

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: No persisted data changes.

## Testing and Verification

- Static (`pnpm exec vue-tsc --noEmit`; lint not required): NOT_RUN
- Unit/component/API: NOT_RUN
- Manual web interaction: NOT_RUN
- Web build: NOT_RUN
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

## Risks

- Remote media links in the fixture require network access to preview.
- Manual access to the chat route requires an authenticated session.

## Evidence

- `src/components/chat/MessageItem.vue` — image and file extraction/rendering.
- `src/components/base/BaseFileItems.vue` — layout, limit, grid size, and viewer props.
- `AGENTS.md` — chat attachment rendering convention.

## Completion Criteria

Rendering and documentation complete, impacts reviewed, and verification/limitations recorded.

## Final Summary

Pending.
