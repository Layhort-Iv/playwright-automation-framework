# Engineering Contribution Guide

Welcome to the Enterprise Automation Framework repository. This guide establishes the standards, workflows, and quality gates expected of every contributor to maintain reliability, readability, and scalability across large teams.

---

## 1. Branching & Release Model

We adopt **Trunk-Based Development** with short-lived feature branches:

```text
main (protected)
  │
  ├── feature/AUTH-101-login-mfa
  ├── bugfix/INV-204-cart-count-flakiness
  └── chore/CORE-012-upgrade-playwright-1.50
```

### Naming Conventions:

- Feature branch: `feature/<JIRA-ID>-<short-description>` (e.g., `feature/QE-104-checkout-discount-spec`)
- Bugfix branch: `bugfix/<JIRA-ID>-<short-description>` (e.g., `bugfix/QE-209-element-timeout`)
- Chore/Maintenance: `chore/<description>` (e.g., `chore/dep-updates`)

---

## 2. Pull Request Standards & Quality Gates

Every Pull Request must satisfy the automated **Pull Request Quality Gate** before merge:

1. **Static Typecheck**: `npm run typecheck` (0 errors permitted).
2. **Linting & Code Style**: `npm run lint` (0 errors, 0 warnings).
3. **Format Verification**: `npm run format:check` (Prettier rules).
4. **Smoke Suite Pass**: `npm run test:smoke` (100% pass rate).
5. **No Hardcoded Credentials**: Passwords, tokens, or secret keys must use `SecretManager` or `config`.
6. **Unique Test Tags**: Every spec must include tags (e.g., `@ui`, `@smoke`, `@regression`, `@feature-name`).

---

## 3. Coding Standards & Best Practices

### 3.1 Web-First Assertions

Always prefer Playwright's auto-retrying web-first assertions over arbitrary sleep statements:

```typescript
// ❌ Anti-pattern: Hardcoded sleep
await WaitUtils.sleep(5000);
expect(await button.isVisible()).toBe(true);

// ✅ Best Practice: Web-first assertion with auto-polling
await expect(button).toBeVisible({ timeout: 10000 });
```

### 3.2 Dynamic Test Data Isolation

Never reuse hardcoded emails or IDs across parallel workers:

```typescript
// ❌ Anti-pattern: Collides in parallel execution
const user = { email: 'test@company.com' };

// ✅ Best Practice: Dynamic factory/builder with unique UUID/timestamp
const user = UserBuilder.aUser().withRole('admin').build();
```

### 3.3 Composition over Inheritance

Do NOT bloat `BasePage`. If a UI element represents a reusable table, modal, or layout component, build a separate `ComponentObject` or `LayoutObject` and compose it into the page.

---

## 4. Git Pre-Commit Hooks (Husky & lint-staged)

Husky automatically runs `lint-staged` on staged files before each commit:

- TypeScript/JavaScript: runs `eslint --fix` and `prettier --write`.
- Markdown/JSON/YAML: runs `prettier --write`.
