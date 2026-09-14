/**
 * Standardized enterprise timeout constants (in milliseconds)
 */
export const Timeouts = {
  INSTANT: 500,
  VERY_SHORT: 1000,
  SHORT: 3000,
  MEDIUM: 5000,
  DEFAULT: 10000,
  LONG: 30000,
  PAGE_LOAD: 30000,
  VERY_LONG: 60000,
  POLLING_INTERVAL: 250,
} as const;

export type TimeoutKey = keyof typeof Timeouts;
