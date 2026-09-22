# Task: <name>

## Metadata

- Task ID:
- Status: TODO
- Priority: Medium
- Created: YYYY-MM-DD
- Updated: YYYY-MM-DD

## Objective

<One-paragraph goal tied to verified implementation.>

## Background

<Evidence, file:line refs, classification VERIFIED/PARTIALLY_VERIFIED/NOT_FOUND.>

## Scope

<In-scope changes.>

## Out of Scope

<Backend/Quaker sibling repos, unrelated refactors, signing, deployments unless authorized.>

## Required Reading

- `AGENTS.md`, `SKILLS.md`
- `.agents/skills/<skill>/SKILL.md` + linked `skills/mobile/*.md`
- `docs/agent/*.md` evidence files

## Required Skills

- [ ] mobile-core
- [ ] mobile-testing
- [ ] (add domain skills per SKILLS.md routing matrix)

## Existing Implementation to Inspect

<Paths + key symbols to trace before editing.>

## Implementation Plan

1. …
2. …

## Checkpoints

- [ ] Discovery + classification recorded
- [ ] Implementation complete
- [ ] Impacts reviewed (Platform/Native/API/Data)
- [ ] Verification recorded

## Implementation Checklist

- [ ] …

## Platform Impact Assessment

- [ ] Android
- [ ] iOS
- [ ] Web
- [ ] Shared code
- [ ] Not applicable

## Native Plugin Impact

- [ ] No native plugin changes
- [ ] Existing plugin modified
- [ ] New plugin required
- [ ] Android configuration required
- [ ] iOS configuration required
- [ ] Native permissions affected
- [ ] Capacitor sync required
- [ ] Native compatibility verification required

Details: <plugins, versions, config files>

## API Contract Impact

- [ ] No API changes
- [ ] Request contract changed
- [ ] Response contract changed
- [ ] Authentication changed
- [ ] Backend changes required
- [ ] Backend contract unknown

Details: <method/path/DTO classification>

## Local Data Impact

- [ ] No local data changes
- [ ] Schema change
- [ ] Data migration required
- [ ] Existing data preservation required
- [ ] Logout cleanup affected
- [ ] Offline synchronization affected

Details: <keys, preservation plan>

## Testing and Verification

- Lint: NOT_RUN
- Typecheck: NOT_RUN
- Unit tests: NOT_RUN
- Web build: NOT_RUN
- Android build: NOT_RUN
- iOS build: NOT_RUN
- Emulator test: NOT_RUN
- Physical device test: NOT_RUN

(Use PASSED / FAILED / NOT_RUN / NOT_APPLICABLE / BLOCKED. Web ≠ native proof.)

## Risks

<Native parity, cold-start, listener duplication, offline claims, missing SDKs.>

## Evidence

<File:line refs supporting the change.>

## Completion Criteria

Implementation complete, applicable tests performed, impacts reviewed, API
dependencies resolved or excluded, checkpoints done, limitations disclosed.

## Final Summary

<Files changed, verification per platform, limitations, status.>
