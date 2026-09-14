# ADR-003: Centralized Winston Logging with Correlation IDs and Sanitization

## Status

Accepted

## Context

When running hundreds of tests in parallel across distributed CI runners, standard `console.log` statements are interleaved, unsearchable, lack execution context, and risk leaking sensitive test credentials (passwords, tokens, PII) into CI logs and artifact storage.

Alternatives evaluated:

1. **Console.log**: No structured metadata, no log levels, no file rotation, leaks secrets.
2. **Pino**: Extremely fast for Node servers, but Winston provides superior formatting pipelines, daily rotation ecosystem, and simple transport configurability for QA reporting.

## Decision

Implement a centralized `LoggerService` utilizing **Winston** with:

- Correlation IDs (`uuidv4()`) scoped per test run and injected into HTTP requests.
- Custom recursive `DataMasker` format redacting secrets (`password`, `token`, `secret`, `authorization`, `creditcard`).
- Dual transports: human-readable colored Console and rotating JSON log files (`logs/framework-%DATE%.log`).

## Consequences

- **Positive**:
  - Full traceability: Every test step and API request is traceable via correlation ID.
  - Security compliance: Zero accidental credential leaks in build logs.
  - Structured historical records for post-mortem debugging.
- **Negative**:
  - Requires maintaining custom formatters to preserve Winston internal symbols.
