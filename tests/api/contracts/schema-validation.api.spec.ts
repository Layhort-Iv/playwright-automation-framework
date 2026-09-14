import { test, expect } from '../../../src/core/fixtures';
import { z } from 'zod';
import { ResponseValidator } from '../../../src/api/response-validators/response.validator';
import { UserItemSchema } from '../../../src/api/schemas/user.schema';
import { SchemaValidationError } from '../../../src/common/errors/schema-validation.error';
import { ReportHelper } from '../../../src/core/reporting';

test.describe(
  'API Contracts - Schema Verification & Regression',
  { tag: ['@api', '@contract', '@regression'] },
  () => {
    test.beforeEach(async () => {
      ReportHelper.setAllureMetadata({
        epic: 'API Governance',
        feature: 'Contract & Schema Compliance',
        severity: 'critical',
      });
    });

    test('TC-CON-001: Successfully validate User Item schema contract', async ({
      userApiClient,
      testLogger,
    }) => {
      testLogger.info('Validating UserItem schema contract');
      const response = await userApiClient.getUserById(1);

      const validator = ResponseValidator.of(response).expectStatus(200);

      const UserEnvelopeSchema = z.object({
        data: UserItemSchema,
      });

      const parsed = validator.validateSchema(UserEnvelopeSchema);
      expect(parsed.data.email).toContain('@');
      expect(typeof parsed.data.first_name).toBe('string');
    });

    test('TC-CON-002: Detect breaking contract schema mutations', async ({
      userApiClient,
      testLogger,
    }) => {
      testLogger.info('Verifying that schema regressions are caught at runtime');
      const response = await userApiClient.getUserById(1);

      // Deliberately introduce a strict schema expectation that violates the real response
      const IncompatibleSchema = z.object({
        data: z.object({
          non_existent_field_required: z.string(),
        }),
      });

      const validator = ResponseValidator.of(response);

      expect(() => {
        validator.validateSchema(IncompatibleSchema);
      }).toThrow(SchemaValidationError);
    });
  },
);
