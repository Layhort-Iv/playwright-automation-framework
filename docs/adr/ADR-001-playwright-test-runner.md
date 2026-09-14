# ADR-001: Adoption of Playwright as Unified Automation Engine

## Status

Accepted

## Context

The engineering organization required a unified, robust, and modern test automation framework capable of running cross-browser UI tests and high-throughput REST API tests in parallel, with minimal flakiness and native trace capturing.

Legacy options evaluated:

1. **Selenium WebDriver**: Requires external driver binaries, lacks native network interception, slow execution speed, complex multi-tab management.
2. **Cypress**: Limited cross-browser support (WebKit/Safari is experimental or third-party), cannot handle multi-tab or multi-origin windows, lacks native parallel worker architecture without paid SaaS dashboard.

## Decision

Adopt **Playwright** (`@playwright/test`) as the core automation test runner.

## Consequences

- **Positive**:
  - Out-of-the-box support for Chromium, Firefox, WebKit, and mobile viewport emulation.
  - Native auto-waiting for actionability (visible, stable, enabled, receiving events).
  - Built-in `APIRequestContext` eliminating need for external HTTP test runners.
  - Native tracing, video recording, DOM snapshots, and network inspection.
  - Free built-in worker-level parallelism and sharding (`--shard=1/4`).
- **Negative**:
  - Requires modern Node.js environment (v18+).
  - Learning curve for teams migrating from legacy Selenium Java frameworks.
