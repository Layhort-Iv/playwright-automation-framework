import { format } from 'winston';
import { DataMasker } from '../security/masker';

/**
 * Custom Winston format that recursively sanitizes any sensitive fields.
 */
export const maskSensitiveDataFormat = format(info => {
  const symbols = Object.getOwnPropertySymbols(info);
  const maskedInfo = DataMasker.maskObject(info);
  for (const sym of symbols) {
    (maskedInfo as unknown as Record<symbol, unknown>)[sym] = (
      info as unknown as Record<symbol, unknown>
    )[sym];
  }
  return maskedInfo;
});

/**
 * Formats console output for developer clarity and immediate feedback.
 */
export const customConsoleFormat = format.printf(
  ({ timestamp, level, message, correlationId, ...meta }) => {
    const idStr = correlationId ? `[${correlationId}]` : '[-]';
    const metaKeys = Object.keys(meta);
    const metaStr = metaKeys.length ? ` | ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}] ${idStr}: ${message}${metaStr}`;
  },
);
