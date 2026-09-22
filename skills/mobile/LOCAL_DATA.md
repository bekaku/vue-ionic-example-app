# LOCAL_DATA — Detailed Reference

Authoritative home for persistence rules. Entry:
`.agents/skills/mobile-local-data/SKILL.md`.

## 1. Implementation (VERIFIED)

Capacitor Preferences only via `src/utils/StorageUtil.ts`:

- `saveStorage(key, value, isJson=true)`, `loadStorage<T>(key, parseJson=true)`,
  `removeStorage(key)`, `clearStorage(except=[LocaleKey, ThemeKey, FcmTokenKey,
  DeviceIdAtt, RefreshTokenProcessAtt])` which preserves listed keys across
  clears (`:29-49`).
- Auth keys namespaced per user (`useAppStorage.ts`); misc keys in
  `src/libs/constant.ts` (`PrefixKey`-based cache keys, `FCM_SETTING`, etc.).

## 2. NOT implemented (NOT_FOUND)

SQLite / Capacitor-SQLite / jeep-sqlite / IndexedDB / migrations / encryption /
offline-first sync / conflict resolution. Searches for `sqlite|jeep|indexedDB`
hit only noise — do not invent a database layer or copy MySQL/Flyway
conventions here.

## 3. Change rules (future tasks)

Any persisted-key change must review: existing schema/keys, upgrade path for
installed apps, existing-data preservation, Android/iOS parity (no native
dirs committed — verify), failure recovery, logout cleanup, and tests. Keep
`clearStorage`'s preserved-key list intact unless a task explicitly changes it
with migration coverage.
