# Troubleshooting & Triage Guide

This guide provides immediate diagnostic steps and root-cause solutions for common test automation issues encountered during local development and CI/CD runs.

---

## 1. UI Issues & Locator Failures

### 1.1 Strict Mode Violation (`locator resolved to X elements`)

- **Symptom**: `Error: strict mode violation: locator('[data-test="error"], .error-message') resolved to 2 elements`.
- **Root Cause**: Playwright locator matches multiple elements in the DOM when an action expects a unique target.
- **Solution**:
  - Use precise scoped locators: `page.locator('[data-test="error"]').first()`
  - Combine with filters: `page.locator('.row').filter({ hasText: 'Item Name' })`
  - Avoid combining disparate selector classes into one comma-separated string unless selecting multiple elements with `all()`.

### 1.2 Timeout Waiting for Element Visible

- **Symptom**: `ElementInteractionError: Failed to perform 'click' on element [Submit Button] within 10000ms: Timeout 10000ms exceeded`.
- **Root Cause**: Element is either covered by an overlay/spinner, rendered inside an iframe, or delayed by network latency.
- **Solution**:
  - Check Playwright trace: `npx playwright show-trace test-results/<test-dir>/trace.zip`
  - Inspect the action log in the HTML report to see which condition (visible, stable, enabled) timed out.
  - If behind an animation or loading mask, wait for spinner hidden: `await page.locator('.spinner').waitFor({ state: 'hidden' })`.

### 1.3 Missing Browser Executable

- **Symptom**: `Error: browserType.launch: Executable doesn't exist at /home/.../webkit-.../pw_run.sh`.
- **Root Cause**: Playwright browser binaries for the selected browser engine are not yet downloaded.
- **Solution**:
  - Install targeted engine: `npx playwright install chromium`
  - Install all engines with OS dependencies: `npx playwright install --with-deps`

---

## 2. API Issues

### 2.1 401 Unauthorized on Public / Mock Endpoints

- **Symptom**: Endpoint returns `401 Unauthorized` with `missing_api_key` or `invalid_token`.
- **Root Cause**: Sending unexpected `Authorization: Bearer <mock_token>` headers to an API that expects either no credentials, an API Key (`x-api-key`), or a specific OAuth2 token.
- **Solution**:
  - Use the pluggable Strategy pattern:
    ```typescript
    client.setAuthStrategy(new ApiKeyAuthStrategy('valid-api-key', { keyName: 'x-api-key' }));
    ```
  - Inspect the structured outgoing headers in the log output or `reports/allure-results`.

### 2.2 Schema Mismatch (`SchemaValidationError`)

- **Symptom**: `SchemaValidationError: Payload failed schema validation for [UserListResponse]: Required at "page"`.
- **Root Cause**: The backend API changed its contract or returned an unexpected shape/null value.
- **Solution**:
  - View the raw payload attached to the test step in Allure or Playwright HTML report.
  - If it is a breaking backend regression, report defect with contract diff.
  - If intentional backend release, update Zod schema in `src/api/schemas/`.

---

## 3. Configuration & Startup Failures

### 3.1 `[ConfigService] Configuration validation failed for environment "..."`

- **Symptom**: Framework terminates immediately on test launch with JSON schema errors.
- **Root Cause**: One or more required environment variables in `.env.<env>` fail Zod validation (e.g. invalid URL, missing field).
- **Solution**:
  - Check the output error message. It specifies the exact key path and failure reason.
  - Copy `configs/.env.example` to `configs/.env.local` or provide overrides in your CI environment variables.

---

## 4. Flaky Test Quarantine Strategy

If an intermittent failure occurs due to third-party network instability:

1. Tag the test with `@flaky`:
   ```typescript
   test('TC-INV-004: Live currency converter', { tag: ['@ui', '@flaky'] }, async () => { ... });
   ```
2. Filter out in strict PR quality gates:
   ```bash
   npx playwright test --grep-invert "@flaky"
   ```
3. Run quarantined tests in an asynchronous monitoring pipeline to capture traces and fix timing bottlenecks.
