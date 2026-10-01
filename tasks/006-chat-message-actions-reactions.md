# Task: Chat message actions and reaction counts

## Metadata

- Task ID: 006
- Status: DONE
- Priority: Medium
- Created: 2026-09-25
- Updated: 2026-09-25

## Objective

Add More and Emoji controls to each chat message, highlight the Emoji control when `liked` is true, and show `reactionEngage` counts ordered by descending `total`.

## Background

- VERIFIED: `src/components/MessageItem.vue` renders individual `GroupChatMsgDto` messages and currently has no action controls or reaction summary.
- VERIFIED: `src/types/models.ts` defines `liked`, `emojiType`, and `reactionEngage`; `src/types/common.ts` defines the six `EmojiType` values.
- VERIFIED: `src/libs/data.ts` includes a message with multiple reaction counts, including totals of 10, 2, and 1.

## Scope

- Add accessible More and Emoji buttons that emit message action events for future menus.
- Highlight the Emoji button for `liked` messages.
- Render reaction symbols and counts sorted by descending total without mutating the DTO.

## Out of Scope

- Menu entries, reaction API calls, persistence, and modifying reaction counts on tap.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md` + `skills/mobile/SKILL.md`
- `.agents/skills/mobile-components/SKILL.md` + `skills/mobile/COMPONENTS.md`
- `.agents/skills/mobile-testing/SKILL.md` + `skills/mobile/TESTING.md`

## Required Skills

- [x] mobile-core
- [x] mobile-components
- [x] mobile-testing

## Existing Implementation to Inspect

- `src/components/MessageItem.vue` — message body and styles.
- `src/types/models.ts` and `src/types/common.ts` — reaction DTO and enum.
- `src/libs/data.ts` — sample reaction counts.

## Implementation Plan

1. Add message action buttons and typed events.
2. Show reaction counts in descending order using a copied array.
3. Add accessible labels and record verification/impacts.

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] More and Emoji controls rendered for each message.
- [x] Emoji control highlighted when `liked` is true.
- [x] Reaction counts sorted largest first.
- [x] Button events expose the selected message.

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

Details: Shared Ionic/Vue component only.

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: Uses existing frontend DTO fields; buttons emit local events only.

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: No persisted values or mutation of fixture data.

## Testing and Verification

- Static (`pnpm exec vue-tsc --noEmit`; lint not required): PASSED (2026-09-25)
- Unit/component/API: NOT_RUN
- Manual web interaction: NOT_RUN
- Web build: NOT_RUN
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

## Risks

- More menu items and actual reaction selection have not been specified; buttons expose events for that later integration.
- Manual web interaction requires an authenticated session on the protected chat route.

## Evidence

- `src/components/MessageItem.vue` — action controls, events, and sorted reactions.
- `src/types/models.ts` — `GroupChatMsgDto` and `EmojiCountDto`.

## Completion Criteria

Controls and sorted counts implemented, impacts reviewed, verification recorded, and limitations disclosed.

## Final Summary

Added More and Emoji buttons to each message and typed action events carrying its DTO. The Emoji button uses the primary color when `liked` is true. Reaction symbols and counts render from a copied array sorted by descending `total`. Added Thai and English button labels. Typecheck passed; menu entries, reaction mutations, and manual/native interaction are outside this task.
