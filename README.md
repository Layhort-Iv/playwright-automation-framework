# Enterprise Playwright + TypeScript Automation Framework

[![Playwright](https://img.shields.io/badge/Playwright-v1.50+-45ba4b.svg?logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7+-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS_%3E%3D20-339933.svg?logo=node.js)](https://nodejs.org/)
[![Allure Report](https://img.shields.io/badge/Allure-Reporting-ff69b4.svg?logo=qameta)](https://allurereport.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An enterprise-grade, application-agnostic end-to-end automation framework engineered for UI and REST API testing across any web application (React, Angular, Vue, Next.js, Nuxt.js, ASP.NET, Java, Python, legacy micro-frontends, SaaS platforms, and enterprise portals).

Built with **Clean Architecture**, **SOLID principles**, **Composition over Inheritance**, **Strong Typing**, **Pluggable Authentication Strategies**, **Centralized Structured Logging with Correlation IDs**, and **Dual Reporting (Playwright HTML + Allure)**.

---

## Table of Contents
1. [Key Capabilities](#key-capabilities)
2. [Technology Stack & Dependency Justification](#technology-stack--dependency-justification)
3. [Repository Structure](#repository-structure)
4. [Enterprise Design Principles](#enterprise-design-principles)
5. [Prerequisites & Quick Start](#prerequisites--quick-start)
6. [Execution Commands & Scripts](#execution-commands--scripts)
7. [Multi-Environment Configuration](#multi-environment-configuration)
8. [UI Automation Architecture](#ui-automation-architecture)
9. [API Automation Architecture](#api-automation-architecture)
10. [Logging & Security Redaction](#logging--security-redaction)
11. [Reporting Strategy](#reporting-strategy)
12. [CI/CD Pipelines](#cicd-pipelines)
13. [Troubleshooting & Documentation Links](#troubleshooting--documentation-links)

---

## 1. Key Capabilities

- **Agnostic & Scalable**: Decoupled from any specific application domain or frontend/backend stack.
- **Composition-Based Page Object Model**: Eliminates bloated base classes by composing layouts, widgets, and domain components.
- **Pluggable API Authentication**: Swap between Bearer Token, Basic Auth, API Key (Header/Query), and OAuth2 Client Credentials without modifying test specs.
- **Fail-Fast Configuration**: Zod-validated environment configurations prevent erroneous test execution at startup.
- **Centralized Structured Logging**: Winston logger with correlation ID tracking (`X-Correlation-ID`) and automated credential/secret redaction.
- **Data Isolation & Collision Avoidance**: Dynamic test data builders and factories using Faker.js and UUID ensure safety across parallel workers.
- **Enterprise Reporting**: Native Playwright HTML traces and rich Allure dashboards with steps, logs, and failure artifacts automatically attached.
- **Production CI/CD**: Ready-to-use GitHub Actions workflows for Pull Requests (Quality Gate), Main Branch (Matrix Regression), and Nightly (Sharded Suite).

---

## 2. Technology Stack & Dependency Justification

| Dependency | Why It Exists | Problem It Solves | Enterprise Alternatives & Rationale |
| :--- | :--- | :--- | :--- |
| **`@playwright/test`** | Core Test Engine & Runner | Provides unified, multi-browser execution (Chromium, Firefox, WebKit), web-first auto-waiting, network mocking, and tracing. | *Cypress* (lacks native WebKit/Safari, multi-tab, and parallel worker isolation without paid cloud); *Selenium* (slower, requires external driver management, lacks built-in tracing). |
| **`typescript`** | Programming Language & Typing | Enforces strict compile-time type safety, IDE refactoring, autocompletion, and catches bugs before runtime. | *Plain JavaScript* (lacks type safety, leads to brittle locator and payload contracts in enterprise teams). |
| **`zod`** | Schema & Contract Validation | Enforces fail-fast validation for environment configuration and runtime schema assertions on API responses. | *Joi / Yup* (weaker TypeScript type inference); *Ajv* (requires complex JSON schema compilation; Zod provides zero-code-gen static inference via `z.infer<T>`). |
| **`winston` & `winston-daily-rotate-file`** | Centralized Logging Service | Produces structured JSON logs, daily log rotation, and human-readable colored console logs with correlation IDs. | *Pino* (faster in web servers, but Winston has richer custom format pipelines and daily file rotation for QA audit logs); *Console.log* (interleaved, unsearchable, risks secret leakage). |
| **`@faker-js/faker` & `uuid`** | Test Data Generation | Generates realistic, unique test entities (names, emails, addresses, IDs) on-the-fly. | *Static/Hardcoded JSON* (causes state collisions when multiple workers execute tests against shared environments in parallel). |
| **`allure-playwright` & `allure-commandline`** | Enterprise QA Reporting | Delivers historical executive reporting, defect categorization, trend charts, and step attachments. | *ExtentReports* (outdated in Node); *Standard JUnit* (lacks step-level visualization, video embedding, and trend analytics). |
| **`dotenv` & `cross-env`** | Environment Variable Management | Loads `.env.<env>` files and standardizes shell environment passing across Windows, macOS, and Linux. | *Native Shell Variables* (incompatible across developer OS and CI/CD agents). |
| **`eslint` & `prettier`** | Code Quality & Consistency | Enforces automated static analysis, prevents anti-patterns, and formats code automatically. | *Manual Code Reviews* (time-consuming; automated pre-commit hooks catch errors before push). |
| **`husky` & `lint-staged`** | Git Pre-Commit Hooks | Automatically lints, formats, and verifies staged files before committing to Git. | *Post-push CI failures* (Husky stops unformatted code before it reaches the remote repository). |

---

## 3. Repository Structure

```text
plawright-automation-framework/
│
├── .github/
│   └── workflows/
│       ├── pr.yml                 # PR Quality Gate (Lint, Typecheck, Smoke tests)
│       ├── main.yml               # Main branch cross-browser matrix regression & report archiving
│       └── nightly.yml            # Nightly 4-way sharded execution (--shard=X/4) & Allure publishing
│
├── configs/                       # Multi-environment configuration files
│   ├── .env.example               # Template for environment settings
│   ├── .env.local                 # Local execution overrides
│   ├── .env.dev                   # Development environment configuration
│   ├── .env.qa                    # QA environment configuration
│   ├── .env.uat                   # UAT environment configuration
│   ├── .env.staging               # Staging environment configuration
│   └── .env.prod                  # Production-safe read-only configuration
│
├── docs/                          # Enterprise framework documentation
│   ├── architecture.md            # In-depth architectural design, layers, and extension guide
│   ├── contributing.md            # Git branching, PR standards, code style, pre-commit hooks
│   ├── troubleshooting.md         # Diagnostic triage guides for common errors and flakiness
│   ├── checklist.md               # 25-point Production Readiness Checklist
│   └── adr/                       # Architecture Decision Records
│       ├── ADR-001-playwright-test-runner.md
│       ├── ADR-002-zod-runtime-schema-validation.md
│       ├── ADR-003-winston-structured-logging.md
│       └── ADR-004-composition-over-inheritance-ui.md
│
├── scripts/                       # Reusable CLI utility scripts
│   ├── run-tests.sh               # Shell runner for multi-env tag filtering
│   ├── generate-allure.sh         # Allure report generation and local server
│   └── clean-artifacts.sh         # Cleans old test-results, reports, and logs
│
├── src/
│   ├── common/                    # Cross-cutting primitives
│   │   ├── constants/             # Timeouts, HTTP status codes, test tags
│   │   ├── errors/                # Custom typed exceptions (Element, API, Schema)
│   │   ├── types/                 # Shared TypeScript interfaces & types
│   │   └── utils/                 # WaitUtils, StringUtils, DateUtils
│   ├── core/                      # Core infrastructure layer
│   │   ├── config/                # Zod-validated ConfigService singleton
│   │   ├── logging/               # Winston logger with correlation IDs & formatters
│   │   ├── security/              # DataMasker (log redaction) & SecretManager
│   │   ├── reporting/             # Dual report helper (Playwright + Allure steps)
│   │   └── fixtures/              # Custom Playwright test runner with extended typed fixtures
│   ├── ui/                        # UI Automation Layer (Composition-based POM)
│   │   ├── base/                  # BasePage (smart waits, resilient actions, failure capture)
│   │   ├── components/            # Reusable components (TableComponent, ModalComponent, Toast)
│   │   ├── layouts/               # HeaderLayout, SidebarLayout, FooterLayout
│   │   ├── widgets/               # DropdownWidget, DatepickerWidget, PaginationWidget
│   │   └── pages/                 # Domain pages (LoginPage, InventoryPage, CheckoutPage)
│   ├── api/                       # API Automation Layer
│   │   ├── client/                # BaseApiClient (Playwright request context with correlation IDs & logging)
│   │   ├── auth/                  # Pluggable Auth Strategies (Bearer, Basic, API Key, OAuth2)
│   │   ├── request-builders/      # Fluent request builder
│   │   ├── response-validators/   # Fluent assertions on status, latency, and schema
│   │   ├── domain-clients/        # Domain clients (UserApiClient, AuthApiClient)
│   │   └── schemas/               # Zod API contract schemas
│   └── data/                      # Test Data Management
│       ├── models/                # Typed data interfaces (UserModel, OrderModel)
│       ├── builders/              # Fluent data builders (UserBuilder, OrderBuilder)
│       ├── factories/             # Instant model factories (UserFactory)
│       ├── dynamic/               # DataGenerator (Faker + UUID wrapper)
│       └── static/                # Static datasets and JSON mock fixtures
│
├── tests/
│   ├── ui/                        # UI Test Specifications
│   │   ├── auth/login.smoke.spec.ts
│   │   ├── inventory/inventory.regression.spec.ts
│   │   └── checkout/checkout.e2e.spec.ts
│   └── api/                       # API Test Specifications
│       ├── users/users-crud.api.spec.ts
│       ├── auth/oauth-token.api.spec.ts
│       └── contracts/schema-validation.api.spec.ts
│
├── .eslintrc.json / eslint.config.mjs
├── .prettierrc
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

---

## 4. Enterprise Design Principles

1. **SOLID Principles**:
   - **Single Responsibility**: Each class has one job (e.g. `TableComponent` inspects tables; `DataMasker` redacts secrets).
   - **Open/Closed**: New auth strategies implement `IAuthStrategy` without modifying existing clients or tests.
   - **Liskov Substitution**: Strategy implementations and Page objects can be swapped transparently.
   - **Interface Segregation**: Clean interfaces (`IAuthStrategy`, `UserModel`, `UserCredentials`).
   - **Dependency Inversion**: Tests depend on injected fixtures, not concrete instances.
2. **Composition Over Inheritance**: Pages compose `HeaderLayout`, `SidebarLayout`, and `DropdownWidget` instead of extending huge base classes.
3. **DRY & Clean Architecture**: Logic is strictly partitioned across layers.
4. **Strong Typing & Zero-Implicit Any**: Enforced by TypeScript `strict: true`.

---

## 5. Prerequisites & Quick Start

### Prerequisites
- **Node.js**: v20.x or v22.x LTS (tested on Node v24 LTS)
- **npm**: v9.0+

### Installation
```bash
# Clone repository and navigate to directory
git clone <repo-url>
cd plawright-automation-framework

# Install npm dependencies
npm install

# Install Playwright browser binaries (Chromium)
npx playwright install chromium
```

---

## 6. Execution Commands & Scripts

### Core Test Suites
```bash
# Run all tests in local environment
npm run test

# Run UI test suite on Chromium
npm run test:ui

# Run API test suite (headless, no browser overhead)
npm run test:api

# Run fast smoke tests (@smoke)
npm run test:smoke

# Run full regression suite (@regression)
npm run test:regression
```

### Multi-Environment Execution
```bash
# Execute against DEV environment
npm run test:dev

# Execute against QA environment
npm run test:qa

# Execute against STAGING environment
npm run test:staging

# Execute sanity check against PROD (read-only)
npm run test:prod
```

### Interactive & Debugging Modes
```bash
# Run tests in headed browser mode
npm run test:headed

# Run tests in Playwright interactive debugger / inspector
npm run test:debug
```

### Code Quality & Formatting
```bash
# Run TypeScript static type check
npm run typecheck

# Run ESLint check
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Verify code formatting with Prettier
npm run format:check
```

---

## 7. Multi-Environment Configuration

Environment variables are defined in `configs/.env.<env>` and loaded dynamically via `cross-env TEST_ENV=<env>`.
All values are strictly validated at framework startup by `ConfigService` against `EnvSchema` (Zod):

```ini
# configs/.env.qa
TEST_ENV=qa
BASE_URL=https://qa.saucedemo.com
API_BASE_URL=https://reqres.in/api
HEADLESS=true
WORKERS=4
RETRIES=1
TIMEOUT=35000
LOG_LEVEL=info
AUTH_TYPE=apikey
API_KEY=reqres-free-v1
```

If a required key is missing or malformed, execution stops immediately with a detailed error.

---

## 8. UI Automation Architecture

### Composition over Inheritance
```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { HeaderLayout } from '../layouts/header.layout';
import { DropdownWidget } from '../widgets/dropdown.widget';

export class InventoryPage extends BasePage {
  public readonly header: HeaderLayout;
  public readonly sortDropdown: DropdownWidget;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderLayout(page);
    this.sortDropdown = new DropdownWidget(page, page.locator('.product_sort_container'));
  }
}
```

### Custom Test Fixtures
Tests require zero manual instantiation:
```typescript
import { test, expect } from '../../../src/core/fixtures';

test('Add item to cart', async ({ inventoryPage }) => {
  await inventoryPage.waitForPageLoaded();
  await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
  expect(await inventoryPage.header.getCartCount()).toBe(1);
});
```

---

## 9. API Automation Architecture

### Pluggable Strategy Pattern
Swap authentication without changing test code:
```typescript
// Bearer Token
client.setAuthStrategy(new BearerAuthStrategy('token_xyz'));

// API Key (Header or Query Param)
client.setAuthStrategy(new ApiKeyAuthStrategy('key_abc', { keyName: 'x-api-key' }));

// OAuth2 Client Credentials (auto token caching & refresh)
client.setAuthStrategy(new OAuth2ClientCredentialsStrategy({
  tokenUrl: 'https://auth.company.com/oauth/token',
  clientId: 'client_id',
  clientSecret: 'client_secret'
}));
```

### Fluent Request Builder & Response Validator
```typescript
const response = await userApiClient.getUsers(1);

ResponseValidator.of(response)
  .expectStatus(200)
  .expectResponseTimeBelow(2500)
  .expectHeader('content-type')
  .validateSchema(UserListResponseSchema);
```

---

## 10. Logging & Security Redaction

Winston logs every test lifecycle event, API request, and API response with a unique `correlationId` (`X-Correlation-ID`):

```text
2026-09-14 09:33:59.076 [info] [646d1579-47b8-4b2d-baf7-8e0c8f2bb5ce]: >>> TEST STARTED: TC-LOGIN-001 | {"event":"TEST_START"}
2026-09-14 09:33:59.703 [info] [646d1579-47b8-4b2d-baf7-8e0c8f2bb5ce]:   -> STEP: Filling [Password input] with value: ***REDACTED***
2026-09-14 09:33:59.954 [info] [646d1579-47b8-4b2d-baf7-8e0c8f2bb5ce]: <<< TEST ENDED: TC-LOGIN-001 [PASSED] (876ms)
```

The recursive `DataMasker` ensures passwords, authorization headers, credit cards, and API secrets are never written to logs or report attachments.

---

## 11. Reporting Strategy

### Dual Reporting Setup
- **Playwright HTML Report**: Includes full interactive DOM snapshots, network waterfall, console logs, and action timeline.
- **Allure Report**: Provides defect categorization, historical trends, executive dashboards, and step trees.

```bash
# View Playwright HTML report
npm run report:html

# Generate Allure Report
npm run report:allure:generate

# Open Allure Report in browser
npm run report:allure:open
```

---

## 12. CI/CD Pipelines

Pre-configured GitHub Actions workflows in `.github/workflows/`:
1. **`pr.yml` (Pull Request Quality Gate)**:
   - Runs `typecheck`, `eslint`, and `prettier`.
   - Executes `@smoke` tests on Chromium.
   - Blocks merge if any test or check fails.
2. **`main.yml` (Main Branch Matrix Regression)**:
   - Runs cross-browser matrix across Chromium, Firefox, WebKit, and API.
   - Consolidates test artifacts and publishes reports.
3. **`nightly.yml` (Nightly Sharded Suite)**:
   - Shards tests across 4 parallel jobs (`--shard=1/4` to `4/4`).
   - Generates and publishes complete Allure reports.

---

## 13. Troubleshooting & Documentation Links

- [Architecture Guide & Design Decisions](docs/architecture.md)
- [Engineering Contribution Guide](docs/contributing.md)
- [Troubleshooting & Triage Guide](docs/troubleshooting.md)
- [25-Point Production Readiness Checklist](docs/checklist.md)
- [ADR-001: Playwright Adoption](docs/adr/ADR-001-playwright-test-runner.md)
- [ADR-002: Zod Schema Validation](docs/adr/ADR-002-zod-runtime-schema-validation.md)
- [ADR-003: Winston Structured Logging](docs/adr/ADR-003-winston-structured-logging.md)
- [ADR-004: Composition over Inheritance](docs/adr/ADR-004-composition-over-inheritance-ui.md)
