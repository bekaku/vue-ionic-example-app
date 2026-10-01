# Task: Message item component and reply navigation

## Metadata

- Task ID: 005
- Status: DONE
- Priority: Medium
- Created: 2026-09-25
- Updated: 2026-09-25

## Objective

Extract the chat room's message UI into `src/components/MessageItem.vue`, show `GroupChatMsgDto.dtoReplyTo` as a reply preview, and focus the referenced message when the preview is tapped.

## Background

- VERIFIED: `src/pages/chat/index.vue` renders each message and reveals older fixture messages in batches.
- VERIFIED: `src/types/models.ts` defines optional `GroupChatMsgDto.dtoReplyTo` and string-compatible `IdType` IDs.
- VERIFIED: `src/libs/data.ts` includes a message with `dtoReplyTo`; sample messages come from a static frontend fixture.

## Scope

- Move message rendering and styles into `MessageItem.vue`.
- Render an interactive reply preview for messages with `dtoReplyTo`.
- Reveal older batches as needed, scroll to and focus the referenced message ID; log `open modal` if the target cannot be found.
- Use existing theme colors for the chat background, message bubbles, reply preview, and composer in light and dark modes.
- Use a white chat background in light mode and a gradient of the existing primary tint, base, and shade colors for sent messages.

## Out of Scope

- Backend/API, persistence, actual modal implementation, and unrelated chat features.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md` + `skills/mobile/SKILL.md`
- `.agents/skills/mobile-components/SKILL.md` + `skills/mobile/COMPONENTS.md`
- `.agents/skills/mobile-testing/SKILL.md` + `skills/mobile/TESTING.md`
- `.agents/skills/mobile-lifecycle/SKILL.md` + `skills/mobile/LIFECYCLE.md`

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-components
- [x] mobile-lifecycle

## Existing Implementation to Inspect

- `src/pages/chat/index.vue` — message rendering, pagination, and Ionic scroll element.
- `src/types/models.ts` — `GroupChatMsgDto` and `IdType`.
- `src/libs/data.ts` — static message fixture.

## Implementation Plan

1. Extract the message row into a typed component with a reply-click event.
2. In the chat room, reveal the referenced message and scroll/focus it, or log the modal placeholder when absent.
3. Record verification and platform impacts.

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] Message rows rendered through `MessageItem.vue`.
- [x] Reply preview is shown for `dtoReplyTo` and emits its ID.
- [x] Reply target is focused, including targets in older batches.
- [x] Missing target logs `open modal`.
- [x] Chat surfaces use theme-aware colors in light and dark modes.
- [x] Light chat background is white and sent bubbles use a primary-color gradient.

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

Details: Shared Ionic/Vue UI only.

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: Reads existing `GroupChatMsgDto` from the static frontend fixture.

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: No persisted data changes.

## Testing and Verification

- Static (`pnpm exec vue-tsc --noEmit`; lint not required): PASSED (2026-09-25)
- Scoped dark selector compilation: PASSED (`body[color-theme=dark] .chat-room-content[data-v-…]`)
- Unit/component/API: NOT_RUN
- Manual web interaction: NOT_RUN (protected route needs an authenticated session)
- Web build: NOT_RUN
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

## Risks

- The fixture includes only part of the reported chat history; a reply target outside included rows can only use the requested modal placeholder.
- Manual web interaction needs an authenticated session because the route is protected.

## Evidence

- `src/pages/chat/index.vue` — reply target lookup and focus.
- `src/components/MessageItem.vue` — reply preview and event.
- `src/pages/chat/index.vue` — scoped `body[color-theme='dark']` override for `IonContent` background.

## Completion Criteria

Implementation complete, impacts reviewed, verification recorded, and limitations disclosed.

## Final Summary

Extracted message rendering into `MessageItem.vue`, added an interactive reply preview, and connected it to chat-room lookup and focus. A target in older batches is revealed before scrolling; a missing target logs `open modal`. The chat has a white background in light mode and a scoped, body-theme dark background rule that was checked against Vue's generated selector. Sent bubbles use a gradient of primary color variants. Typecheck passed; manual web and Android/iOS checks were not run.
