# Task: Chat history and message history infinite scrolling

## Metadata

- Task ID: 004
- Status: DONE
- Priority: Medium
- Created: 2026-09-25
- Updated: 2026-09-25

## Objective

Replace the hardcoded chat list in `src/pages/tabs/chat.vue` with a paged view of the sample `chatHistoryListApi` data, and add a chat detail page that shows `chatMessageListApi` with an example of loading older messages when scrolling to the top.

## Background

- Before implementation, `src/pages/tabs/chat.vue` rendered hardcoded names/messages and navigated to `/chat`.
- `src/libs/data.ts` exports `chatHistoryListApi` and `chatMessageListApi` as static `ApiListResponse` fixtures (not network functions). The chat history fixture contains 10 rows and the message fixture contains 11 rows; pagination metadata exceeds the fixture data.
- Message fixture rows use `groupId: 17`, while chat history IDs are `1`–`10`; the detail page therefore uses the same sample message fixture for each valid chat instead of claiming a verified per-chat relationship.
- Before implementation, `src/router/index.ts` nested `/tabs/chat` under the tabs outlet but had no chat detail route.
- `src/components/base/BaseInfiniteScroll.vue` wraps Ionic infinite scroll and emits `on-infinite`.

## Scope

- Show chat history from the sample fixture with local page-sized batches and bottom infinite scroll.
- Add a protected standalone chat detail route keyed by the string chat ID, outside the tabs outlet.
- Show sample chat messages in the reverse order of the API list so its first message appears last, initially reveal the newest batch, and prepend older messages on top infinite scroll while maintaining scroll position.
- Keep any message composer behavior local to the demo; do not introduce backend API contracts.

## Out of Scope

- Backend/API changes, sending messages to a server, persistence, attachments, and native plugin changes.
- Sibling repositories, deployments, and unrelated chat features.

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/mobile-core/SKILL.md` + `skills/mobile/SKILL.md`
- `.agents/skills/mobile-components/SKILL.md` + `skills/mobile/COMPONENTS.md`
- `.agents/skills/mobile-navigation/SKILL.md` + `skills/mobile/NAVIGATION.md`
- `.agents/skills/mobile-lifecycle/SKILL.md` + `skills/mobile/LIFECYCLE.md`
- `.agents/skills/mobile-testing/SKILL.md` + `skills/mobile/TESTING.md`
- `docs/agent/PROJECT_REFERENCE.md`, `docs/agent/MOBILE_ARCHITECTURE.md`, `docs/agent/STANDARD_PAGE_COMPONENT.md`

## Required Skills

- [x] mobile-core
- [x] mobile-testing
- [x] mobile-components
- [x] mobile-navigation
- [x] mobile-lifecycle

## Existing Implementation to Inspect

- `src/pages/tabs/chat.vue` — current chat tab list.
- `src/libs/data.ts` and `src/types/models.ts` — sample chat and message DTOs.
- `src/router/index.ts` and `src/pages/tabs/index.vue` — tabs route/outlet.
- `src/components/base/BaseInfiniteScroll.vue` — infinite-scroll wrapper.

## Implementation Plan

1. Replace hardcoded chat list with fixture-backed search and local pagination.
2. Add a standalone route and chat detail page using the chat ID.
3. Start with the newest messages, reveal older batches until the content can scroll, then prepend older fixture messages on top infinite scroll while preserving the viewport position.
4. Record impacts and available verification in this task file.

## Checkpoints

- [x] Discovery + classification recorded
- [x] Implementation complete
- [x] Impacts reviewed (Platform/Native/API/Data)
- [x] Verification recorded

## Implementation Checklist

- [x] Chat history fixture rendered with bottom infinite scroll.
- [x] List item navigates to the matching detail route.
- [x] Detail page renders fixture messages and top infinite scroll for older messages.
- [x] Empty/invalid chat route handled.

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

Details: Ionic/Vue UI and router only; no native plugin calls.

## API Contract Impact

- [x] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: UI reads static frontend fixtures from `src/libs/data.ts`; no transport call is added.

## Local Data Impact

- [x] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: No persisted values or caches.

## Testing and Verification

- Static (`pnpm exec vue-tsc --noEmit`; lint not required): PASSED (2026-09-25)
- Unit/component/API (list targeted checks): NOT_RUN
- Lifecycle (cached page re-entry and top infinite scroll): BLOCKED (protected route requires an authenticated test session)
- Manual web interaction/visual check: BLOCKED (browser redirected to `/auth/login/`)
- Web build: NOT_RUN
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

## Risks

- The fixtures are short static samples and their `totalPages`, `totalElements`, and `last` metadata do not correspond to the number of included rows; UI pagination must stop at the included fixture rows.
- The message fixture has a date that is out of sequence and currently repeats ID `665`; the room follows the API's list order and uses ID plus timestamp for stable rendering keys.
- Message fixture group IDs do not match chat history IDs, so every valid detail route demonstrates the same message sample. Sending from the composer only adds an in-memory demo message; it does not call a backend or persist data.
- Web interaction remains unverified without an authenticated test session; Android/iOS presentation is unverified without device/emulator checks.

## Evidence

- `src/pages/tabs/chat.vue` — `filteredChats`, `loadMoreChats`, and `openChat`.
- `src/libs/data.ts` — `chatHistoryListApi` and `chatMessageListApi` fixture exports.
- `src/pages/chat/index.vue` — `prepareConversation`, `loadOlderMessages`, and `onIonViewDidEnter`.
- `src/router/index.ts` — standalone `/chat/:chatId` route.
- `src/components/base/BaseInfiniteScroll.vue` — reusable Ionic infinite-scroll wrapper.

## Completion Criteria

Feature implemented, impacts reviewed, verification status recorded, and limitations disclosed. Native behavior must remain NOT_RUN without device/emulator evidence.

## Final Summary

Implemented fixture-backed chat history with bottom infinite scroll, a protected standalone `/chat/:chatId` detail route outside the tabs outlet, and a message page that prepends older sample messages at the top while preserving the viewport. Message display reverses API list order so the first item is last, without reordering by inconsistent fixture timestamps. The detail page reveals enough older messages to allow scrolling when the first batch is too short, and both infinite scroll handlers stay enabled while their load is in progress so Ionic can complete and fire again. Typecheck PASSED; web interaction and lifecycle checks are BLOCKED by the login guard, while Android and iOS remain NOT_RUN.
