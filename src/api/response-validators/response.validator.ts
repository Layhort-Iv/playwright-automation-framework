import { expect } from '@playwright/test';
import { ZodType } from 'zod';
import { ApiResponse } from '../../common/types';
import { SchemaValidationError } from '../../common/errors/schema-validation.error';

/**
 * Fluent Response Validator for API contract, status, and payload assertions.
 */
export class ResponseValidator<T = unknown> {
  constructor(private readonly response: ApiResponse<T>) {}

  public static of<T>(response: ApiResponse<T>): ResponseValidator<T> {
    return new ResponseValidator(response);
  }

  public expectStatus(expectedStatus: number): this {
    expect(
      this.response.status,
      `Expected status ${expectedStatus} but received ${this.response.status} for ${this.response.url}`,
    ).toBe(expectedStatus);
    return this;
  }

  public expectStatusIn(allowedStatuses: number[]): this {
    expect(
      allowedStatuses,
      `Expected status to be one of [${allowedStatuses.join(', ')}] but got ${this.response.status}`,
    ).toContain(this.response.status);
    return this;
  }

  public expectHeader(name: string, expectedValue?: string): this {
    const headerValue = this.response.headers[name.toLowerCase()];
    expect(headerValue, `Expected header '${name}' to exist`).toBeDefined();
    if (expectedValue !== undefined) {
      expect(headerValue).toBe(expectedValue);
    }
    return this;
  }

  public expectResponseTimeBelow(maxMs: number): this {
    expect(
      this.response.durationMs,
      `Response time ${this.response.durationMs}ms exceeded threshold of ${maxMs}ms`,
    ).toBeLessThanOrEqual(maxMs);
    return this;
  }

  /**
   * Validates response body against a Zod schema for contract & type-safety.
   */
  public validateSchema<S extends ZodType>(schema: S): S['_output'] {
    const result = schema.safeParse(this.response.body);
    if (!result.success) {
      throw new SchemaValidationError(
        schema.description || 'ZodSchema',
        result.error.issues,
        this.response.body,
      );
    }
    return result.data;
  }

  /**
   * Validates custom JSON schema shape.
   */
  public validateShape(
    validatorFn: (body: T) => boolean,
    failureMessage = 'Custom shape validation failed',
  ): this {
    const valid = validatorFn(this.response.body);
    expect(valid, failureMessage).toBe(true);
    return this;
  }

  public getBody(): T {
    return this.response.body;
  }

  public getResponse(): ApiResponse<T> {
    return this.response;
  }
}
