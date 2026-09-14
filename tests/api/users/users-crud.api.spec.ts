import { test, expect } from '../../../src/core/fixtures';
import { ResponseValidator } from '../../../src/api/response-validators/response.validator';
import {
  UserListResponseSchema,
  SingleUserResponseSchema,
  CreateUserResponseSchema,
  UpdateUserResponseSchema,
} from '../../../src/api/schemas/user.schema';
import { HttpStatus } from '../../../src/common/constants/http-status.constants';
import { ReportHelper } from '../../../src/core/reporting';

test.describe(
  'Users API - CRUD & Schema Validation',
  { tag: ['@api', '@smoke', '@regression', '@users'] },
  () => {
    test.beforeEach(async () => {
      ReportHelper.setAllureMetadata({
        epic: 'User Service API',
        feature: 'User Management Lifecycle',
        severity: 'critical',
      });
    });

    test('TC-API-001: [GET] Fetch paginated user list with schema validation', async ({
      userApiClient,
      testLogger,
    }) => {
      testLogger.info('Fetching page 1 of users');
      const response = await userApiClient.getUsers(1);

      const validator = ResponseValidator.of(response)
        .expectStatus(HttpStatus.OK)
        .expectHeader('content-type')
        .expectResponseTimeBelow(3000);

      // Validate runtime contract with Zod
      const validatedData = validator.validateSchema(UserListResponseSchema);
      expect(validatedData.page).toBe(1);
      expect(validatedData.data.length).toBeGreaterThan(0);
      expect(validatedData.data[0]).toHaveProperty('email');
    });

    test('TC-API-002: [GET] Fetch single user by ID', async ({ userApiClient, testLogger }) => {
      testLogger.info('Fetching user ID 2');
      const response = await userApiClient.getUserById(2);

      const validator = ResponseValidator.of(response)
        .expectStatus(HttpStatus.OK)
        .expectResponseTimeBelow(3000);

      const validatedData = validator.validateSchema(SingleUserResponseSchema);
      expect(validatedData.data.id).toBe(2);
      expect(validatedData.data.email).toBeTruthy();
    });

    test('TC-API-003: [POST] Create a new user', async ({
      userApiClient,
      testUser,
      testLogger,
    }) => {
      const payload = {
        name: `${testUser.firstName} ${testUser.lastName}`,
        job: testUser.jobTitle || 'Lead Automation Engineer',
      };

      testLogger.info(`Creating user with name: ${payload.name}`);
      const response = await userApiClient.createUser(payload);

      const validator = ResponseValidator.of(response)
        .expectStatus(HttpStatus.CREATED)
        .expectResponseTimeBelow(3000);

      const validatedData = validator.validateSchema(CreateUserResponseSchema);
      expect(validatedData.name).toBe(payload.name);
      expect(validatedData.job).toBe(payload.job);
      expect(validatedData.id).toBeDefined();
      expect(validatedData.createdAt).toBeDefined();
    });

    test('TC-API-004: [PUT] Update existing user data', async ({ userApiClient, testLogger }) => {
      const payload = {
        name: 'Jane Doe Enterprise',
        job: 'Principal QE Architect',
      };

      testLogger.info('Updating user ID 2');
      const response = await userApiClient.updateUser(2, payload);

      const validator = ResponseValidator.of(response)
        .expectStatus(HttpStatus.OK)
        .expectResponseTimeBelow(3000);

      const validatedData = validator.validateSchema(UpdateUserResponseSchema);
      expect(validatedData.name).toBe(payload.name);
      expect(validatedData.job).toBe(payload.job);
      expect(validatedData.updatedAt).toBeDefined();
    });

    test('TC-API-005: [PATCH] Partially update user field', async ({
      userApiClient,
      testLogger,
    }) => {
      const payload = {
        job: 'Staff Engineer - Performance',
      };

      testLogger.info('Patching user ID 2');
      const response = await userApiClient.patchUser(2, payload);

      ResponseValidator.of(response).expectStatus(HttpStatus.OK).expectResponseTimeBelow(3000);

      expect(response.body).toHaveProperty('job', payload.job);
      expect(response.body).toHaveProperty('updatedAt');
    });

    test('TC-API-006: [DELETE] Remove a user', async ({ userApiClient, testLogger }) => {
      testLogger.info('Deleting user ID 2');
      const response = await userApiClient.deleteUser(2);

      ResponseValidator.of(response)
        .expectStatus(HttpStatus.NO_CONTENT)
        .expectResponseTimeBelow(3000);
    });
  },
);
