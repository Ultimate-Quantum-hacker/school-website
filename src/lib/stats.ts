/**
 * Parse a small "stat string" like "620+", "95%", "Est. 2003", or
 * "1,200" into the parts a CountUp component needs.
 *
 * Returns null if no numeric portion is found, so callers can fall
 * back to rendering the original string verbatim.
 */
export interface ParsedStat {
  prefix: string;
  number: number;
  suffix: string;
}

const NUMBER_PATTERN = /[\d,]+(?:\.\d+)?/;

export function parseStatString(input: string): ParsedStat | null {
  const match = input.match(NUMBER_PATTERN);
  if (!match) return null;
  const raw = match[0];
  const number = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(number)) return null;
  const idx = match.index ?? 0;
  return {
    prefix: input.slice(0, idx),
    number,
    suffix: input.slice(idx + raw.length),
  };
}
