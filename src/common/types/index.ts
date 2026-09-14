/**
 * Core type definitions used across the enterprise framework
 */

export type EnvironmentName = 'local' | 'dev' | 'qa' | 'uat' | 'staging' | 'prod';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface KeyValuePairs {
  [key: string]: string | number | boolean | undefined;
}

export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: T;
  durationMs: number;
  url: string;
  correlationId: string;
}

export interface UserCredentials {
  username: string;
  password: string;
  role?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
