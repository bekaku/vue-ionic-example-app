/**
 * Snowflake-style ID generator (64-bit bigint, time-sortable)
 *
 * Layout (compatible in spirit with the IDs already present in the dumped
 * data, e.g. 350885844724224000):
 *   41 bits  - milliseconds since EPOCH (custom epoch: 2024-01-01)
 *   10 bits  - node id (0-1023), from SNOWFLAKE_NODE_ID env var, default 1
 *   12 bits  - per-millisecond sequence (0-4095)
 *
 * Returned as a JS `bigint` so it maps directly onto Drizzle's
 * `bigint(..., { mode: 'bigint' })` columns.
 */

const EPOCH = 1704067200000n // 2024-01-01T00:00:00Z
const NODE_BITS = 10n
const SEQ_BITS = 12n
const NODE_ID = BigInt(Number(1) & 0x3FF)

let lastTimestamp = -1n
let sequence = 0n

export function generateSnowFlakeId(): bigint {
  let timestamp = BigInt(Date.now())

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1n) & 0xFFFn
    if (sequence === 0n) {
      // sequence overflow within the same ms: spin to next ms
      while (timestamp <= lastTimestamp) {
        timestamp = BigInt(Date.now())
      }
    }
  } else {
    sequence = 0n
  }

  lastTimestamp = timestamp

  const ts = (timestamp - EPOCH) << (NODE_BITS + SEQ_BITS)
  const node = NODE_ID << SEQ_BITS

  return ts | node | sequence
}

/** Helper for API responses / JSON: bigint ต้องแปลงเป็น string ก่อน serialize */
export function idToString(value: bigint | null | undefined): string | null {
  return value === null || value === undefined ? null : value.toString()
}
