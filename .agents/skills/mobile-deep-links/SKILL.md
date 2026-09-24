---
name: mobile-deep-links
description: >
  Use this skill when handling inbound URLs, custom schemes, app links,
  universal links, or URL-bearing notification payloads.
---

# mobile-deep-links — Canonical Skill

## Purpose

Constrain deep-link work to verified behavior and untrusted-input handling.

## When to use

Any inbound-URL handling, scheme/domain config, cold/warm-start URL routing,
or auth-callback navigation. Ordinary notification taps use
`mobile-notifications` + `mobile-navigation`.

## Required reading

- `skills/mobile/DEEP_LINKS.md`
- `skills/mobile/NAVIGATION.md`

## Relevant project locations

- `src/router/index.ts`, `src/composables/useNotification.ts` (tap nav)
- `capacitor.config.ts` (no link config verified)

## Mandatory rules

1. No `appUrlOpen` listener and no committed intent-filters/associated
   domains are verified (NOT_FOUND) — do not claim support.
2. Notification taps are the only verified external navigation entry; they
   are not URL deep links unless a URL payload is introduced.
3. Treat every incoming URL as untrusted: validate, whitelist destinations,
   pass the auth guard.
4. Native link support needs Android + iOS config + `cap sync` + device proof.

## Implementation workflow

1. Declare scheme/host/path contract explicitly before coding.
2. Implement listener + validator + guarded router navigation.
3. Cover cold-start, warm-start, invalid-URL, duplicate-event cases.
4. Verify per `mobile-testing`, incl. SECURITY (untrusted input).

## Verification

URL-validation unit tests; end-to-end only with native config + device.
