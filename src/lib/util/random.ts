// ── Seeded PRNG ──────────────────────────────────────────────────────────────
// Mulberry32: a simple, fast, 32-bit seeded pseudo-random number generator.
// Produces deterministic sequences for identical seeds, ensuring demo profiles
// generate identical data across page reloads.

export function createSeededRandom(seed: number) {
  let state = seed | 0;

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    /** Returns a float in [0, 1) */
    random: next,

    /** Returns an integer in [min, max] inclusive */
    between(min: number, max: number): number {
      return Math.round(min + next() * (max - min));
    },

    /** Picks a random element from an array */
    pick<T>(arr: T[]): T {
      return arr[Math.floor(next() * arr.length)];
    },
  };
}
