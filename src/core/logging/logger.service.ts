import * as path from 'path';
import * as fs from 'fs';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import 'winston-daily-rotate-file';
import { config } from '../config';
import { maskSensitiveDataFormat, customConsoleFormat } from './log-formatter';

export interface LogMetadata {
  correlationId?: string;
  testName?: string;
  step?: string;
  durationMs?: number;
  [key: string]: unknown;
}

/**
 * Enterprise Centralized Logger Service.
 * Provides structured logging, correlation IDs, log masking, and dual transports.
 */
export class LoggerService {
  private static instance: LoggerService;
  private readonly baseLogger: WinstonLogger;

  private constructor() {
    const logDir = path.resolve(process.cwd(), config.LOG_DIR || 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const loggerTransports = [];

    // Console Transport
    if (config.LOG_TO_CONSOLE) {
      loggerTransports.push(
        new transports.Console({
          level: config.LOG_LEVEL,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.colorize(),
            maskSensitiveDataFormat(),
            customConsoleFormat,
          ),
        }),
      );
    }

    // Rotating File Transport (JSON Structured Logs)
    if (config.LOG_TO_FILE) {
      loggerTransports.push(
        new transports.DailyRotateFile({
          dirname: logDir,
          filename: 'framework-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: config.LOG_LEVEL,
          format: format.combine(maskSensitiveDataFormat(), format.timestamp(), format.json()),
        }),
      );

      // Dedicated Error Log File
      loggerTransports.push(
        new transports.DailyRotateFile({
          dirname: logDir,
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          format: format.combine(maskSensitiveDataFormat(), format.timestamp(), format.json()),
        }),
      );
    }

    this.baseLogger = createLogger({
      level: config.LOG_LEVEL,
      transports: loggerTransports,
    });
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public getLogger(correlationId?: string): ScopedLogger {
    return new ScopedLogger(this.baseLogger, correlationId);
  }
}

/**
 * Context-aware Scoped Logger with correlation ID injection
 */
export class ScopedLogger {
  constructor(
    private readonly winstonLogger: WinstonLogger,
    public readonly correlationId: string = 'GLOBAL',
  ) {}

  public info(message: string, meta: LogMetadata = {}): void {
    this.winstonLogger.info(message, { correlationId: this.correlationId, ...meta });
  }

  public debug(message: string, meta: LogMetadata = {}): void {
    this.winstonLogger.debug(message, { correlationId: this.correlationId, ...meta });
  }

  public warn(message: string, meta: LogMetadata = {}): void {
    this.winstonLogger.warn(message, { correlationId: this.correlationId, ...meta });
  }

  public error(message: string, error?: Error | unknown, meta: LogMetadata = {}): void {
    const errorDetails =
      error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : { rawError: error };

    this.winstonLogger.error(message, {
      correlationId: this.correlationId,
      ...errorDetails,
      ...meta,
    });
  }

  public logTestStart(testTitle: string, tags: string[] = []): void {
    this.info(`>>> TEST STARTED: ${testTitle}`, {
      event: 'TEST_START',
      tags,
    });
  }

  public logTestEnd(testTitle: string, status: string, durationMs: number): void {
    this.info(`<<< TEST ENDED: ${testTitle} [${status.toUpperCase()}] (${durationMs}ms)`, {
      event: 'TEST_END',
      status,
      durationMs,
    });
  }

  public logStep(stepDescription: string): void {
    this.info(`  -> STEP: ${stepDescription}`, { step: stepDescription });
  }

  public logRequest(
    method: string,
    url: string,
    headers: Record<string, unknown>,
    body?: unknown,
  ): void {
    this.info(`API Request: [${method.toUpperCase()}] ${url}`, {
      event: 'API_REQUEST',
      method,
      url,
      headers,
      body,
    });
  }

  public logResponse(
    method: string,
    url: string,
    status: number,
    durationMs: number,
    responseBody?: unknown,
  ): void {
    this.info(
      `API Response: [${method.toUpperCase()}] ${url} - Status: ${status} (${durationMs}ms)`,
      {
        event: 'API_RESPONSE',
        method,
        url,
        status,
        durationMs,
        responseBody,
      },
    );
  }

  public logExecutionSummary(summary: Record<string, unknown>): void {
    this.info(`=== EXECUTION SUMMARY ===`, {
      event: 'EXECUTION_SUMMARY',
      ...summary,
    });
  }
}

export const logger = LoggerService.getInstance().getLogger();
