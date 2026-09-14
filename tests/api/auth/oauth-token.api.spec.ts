import { test, expect } from '../../../src/core/fixtures';
import { BaseApiClient } from '../../../src/api/client/base-api.client';
import { BearerAuthStrategy } from '../../../src/api/auth/bearer-auth.strategy';
import { BasicAuthStrategy } from '../../../src/api/auth/basic-auth.strategy';
import { ApiKeyAuthStrategy } from '../../../src/api/auth/api-key-auth.strategy';
import { OAuth2ClientCredentialsStrategy } from '../../../src/api/auth/oauth2-client-credentials.strategy';
import { ResponseValidator } from '../../../src/api/response-validators/response.validator';
import { HttpStatus } from '../../../src/common/constants/http-status.constants';
import { ReportHelper } from '../../../src/core/reporting';

test.describe(
  'API Authentication - Strategy Pattern',
  { tag: ['@api', '@regression', '@auth'] },
  () => {
    test.beforeEach(async () => {
      ReportHelper.setAllureMetadata({
        epic: 'Security & Identity',
        feature: 'Authentication Strategies',
        severity: 'critical',
      });
    });

    test('TC-AUTH-001: Execute request using Bearer Token Strategy', async ({
      request,
      envConfig,
      testLogger,
    }) => {
      testLogger.info('Testing BearerAuthStrategy');
      const token = 'enterprise_token_sample_123';
      const bearerStrategy = new BearerAuthStrategy(token);

      // Verify strategy unit contract
      const applied = await bearerStrategy.apply({});
      expect(applied.headers.Authorization).toBe(`Bearer ${token}`);

      // Verify client integration
      const client = new BaseApiClient(request, envConfig.API_BASE_URL, testLogger);
      client.setAuthStrategy(bearerStrategy);

      const response = await client.get('/users?page=1');
      // ReqRes detects the bearer token and advises x-api-key requirement
      ResponseValidator.of(response).expectStatusIn([HttpStatus.OK, HttpStatus.UNAUTHORIZED]);
      expect(response.correlationId).toBeDefined();
    });

    test('TC-AUTH-002: Execute request using Basic Authentication Strategy', async ({
      request,
      envConfig,
      testLogger,
    }) => {
      testLogger.info('Testing BasicAuthStrategy');
      const basicStrategy = new BasicAuthStrategy('api_user', 'api_secret_password');

      // Verify Base64 encoding contract
      const applied = await basicStrategy.apply({});
      expect(applied.headers.Authorization).toContain('Basic ');

      const client = new BaseApiClient(request, envConfig.API_BASE_URL, testLogger);
      client.setAuthStrategy(basicStrategy);

      const response = await client.get('/users?page=1');
      ResponseValidator.of(response).expectStatusIn([HttpStatus.OK, HttpStatus.UNAUTHORIZED]);
    });

    test('TC-AUTH-003: Execute request using API Key Header Strategy', async ({
      request,
      envConfig,
      testLogger,
    }) => {
      testLogger.info('Testing ApiKeyAuthStrategy with valid API key');
      const client = new BaseApiClient(request, envConfig.API_BASE_URL, testLogger);
      client.setAuthStrategy(new ApiKeyAuthStrategy('reqres-free-v1', { keyName: 'x-api-key' }));

      const response = await client.get('/users?page=1');
      ResponseValidator.of(response).expectStatus(HttpStatus.OK);
      expect(response.headers['content-type']).toBeDefined();
    });

    test('TC-AUTH-004: Execute request using OAuth2 Client Credentials Strategy', async ({
      request,
      envConfig,
      testLogger,
    }) => {
      testLogger.info('Testing OAuth2ClientCredentialsStrategy');
      const oauthStrategy = new OAuth2ClientCredentialsStrategy({
        tokenUrl: envConfig.AUTH_TOKEN_URL || `${envConfig.API_BASE_URL}/login`,
        clientId: envConfig.AUTH_CLIENT_ID || 'client_123',
        clientSecret: envConfig.AUTH_CLIENT_SECRET || 'secret_456',
      });

      const token = await oauthStrategy.getValidToken();
      expect(token).toBeTruthy();

      const applied = await oauthStrategy.apply({});
      expect(applied.headers.Authorization).toBe(`Bearer ${token}`);

      const client = new BaseApiClient(request, envConfig.API_BASE_URL, testLogger);
      client.setAuthStrategy(oauthStrategy);

      const response = await client.get('/users?page=1');
      ResponseValidator.of(response).expectStatusIn([HttpStatus.OK, HttpStatus.UNAUTHORIZED]);
    });
  },
);
