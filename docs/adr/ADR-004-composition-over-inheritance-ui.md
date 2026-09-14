# ADR-004: Composition over Deep Inheritance in UI Page Objects

## Status

Accepted

## Context

Traditional Page Object Models heavily lean on inheritance hierarchies (e.g. `BasePage -> AuthenticatedPage -> NavigationPage -> DashboardPage -> UserDashboardPage`). This introduces tight coupling, the "fragile base class" problem, and causes base classes to accumulate hundreds of uncoordinated helper methods.

## Decision

Enforce **Composition over Inheritance** across all UI automation objects:

- `BasePage` remains lean, abstract, and provides only fundamental page mechanics (locators, smart waiting, safe clicks, failure capture).
- Pages compose dedicated `LayoutObjects` (`HeaderLayout`, `SidebarLayout`, `FooterLayout`), `ComponentObjects` (`TableComponent`, `ModalComponent`, `ToastComponent`), and `Widgets` (`DropdownWidget`, `DatepickerWidget`, `PaginationWidget`).
- Reusable state (e.g., authentication) is encapsulated into Playwright fixtures (`authenticatedPage`), not inherited base classes.

## Consequences

- **Positive**:
  - Modular, highly reusable components across multiple pages.
  - Minimal code duplication (DRY).
  - Clear separation of concerns and high readability.
  - Easy to unit test and maintain components independently.
- **Negative**:
  - Developers must instantiate or receive sub-components rather than calling inherited `this.clickHeaderSearch()`.
