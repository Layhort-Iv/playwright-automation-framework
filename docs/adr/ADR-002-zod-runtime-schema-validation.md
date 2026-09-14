# ADR-002: Adoption of Zod for Configuration and API Schema Validation

## Status

Accepted

## Context

Enterprise automation requires:

1. Fail-fast validation of environment configuration (`.env`) to prevent invalid test runs from silently passing or producing misleading timeout failures.
2. Runtime schema & contract validation for API responses to guarantee that backend APIs conform to data types, required keys, and formats.

Alternatives evaluated:

1. **Joi**: Primarily designed for JavaScript, poor TypeScript static type inference.
2. **Ajv (JSON Schema)**: Requires JSON schema specifications, separate compilation step, cumbersome TypeScript type extraction.
3. **Yup**: Good, but weaker TypeScript inference and less functional composition compared to Zod.

## Decision

Adopt **Zod** as the single schema validation library across the entire framework.

## Consequences

- **Positive**:
  - Single Source of Truth: TypeScript interfaces are inferred automatically (`z.infer<typeof Schema>`).
  - Zero code generation required.
  - Informative, formatted error trees on validation failures.
- **Negative**:
  - Adds ~50KB runtime bundle size (negligible for test framework).
