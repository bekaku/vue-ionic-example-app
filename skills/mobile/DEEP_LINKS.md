# DEEP_LINKS — Detailed Reference

Authoritative home for deep-link rules. Entry:
`.agents/skills/mobile-deep-links/SKILL.md`.

## 1. Status (VERIFIED absence)

- No `appUrlOpen` listener in `src/` (NOT_FOUND).
- No committed `android/` intent-filters nor `ios/` associated
  domains/entitlements (NOT_FOUND — directories absent; `cap add` required).
- No custom-scheme/Universal-Link/App-Link config in `capacitor.config.ts`
  (NOT_FOUND).
- No inbound navigation is active: notification taps would go through
  `useNotification.ts` › `onNotifyView` → `/post/view/:id` (no route), but
  `addNotifyListeners()` is never called (KNOWN_ISSUES #23, #24).

## 2. Rules for future work

1. Declare the contract first: scheme/host/path (Android) + associated domain
   (iOS) + route mapping.
2. Treat every incoming URL as untrusted: parse defensively, whitelist
   destinations, enforce the auth guard, handle invalid/duplicate events.
3. Cover cold-start (app killed), warm-start (backgrounded), and already-open
   cases; wait for router + auth readiness before navigating.
4. Native work needs manifest/intent-filter + Info.plist/entitlements +
   `cap sync` + per-platform device proof.

## 3. Share intents (NOT_FOUND)

No share-intent filters, MIME config, or file-URI ingress handling verified.
Do not invent.
