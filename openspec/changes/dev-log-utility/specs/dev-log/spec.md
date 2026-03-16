# Dev-Log Spec – Development-Only Logging

## 1. Purpose

This spec defines the dev-only logging utility so that:

- Debug or diagnostic logs run only in development and are no-ops in production.
- The public API is a single, variadic function usable as a drop-in for `console.log` in dev paths.
- Behavior is testable and consistent with the Vite build (e.g. `import.meta.env.DEV`).

---

## 2. Scope and Location

- **Entry point:** `src/lib/dev-log.ts` (or equivalent under `src/lib/`).
- **Export:** One named export (e.g. `devLog`). No new dependencies; uses Vite’s `import.meta.env.DEV`.

---

## ADDED Requirements

### Requirement: Dev-only log function

The system SHALL provide a function that forwards its arguments to `console.log` when the app is running in development mode, and SHALL perform a no-op when not in development mode.

#### Scenario: Logging in development

- **WHEN** the app is built or run with development mode enabled (e.g. `import.meta.env.DEV === true`) and the dev-log function is called with one or more arguments
- **THEN** the same arguments are passed to `console.log` and the call behaves like `console.log(...args)`

#### Scenario: No-op in production

- **WHEN** the app is built for production (e.g. `import.meta.env.DEV === false` or the value is stripped) and the dev-log function is called with any arguments
- **THEN** nothing is written to the console and the function returns without side effects (or with minimal, negligible overhead)

### Requirement: Variadic API

The dev-log function SHALL accept variadic arguments (same call pattern as `console.log`) so that existing `console.log(...)` calls can be replaced with the dev-log function without changing argument lists.

#### Scenario: Single argument

- **WHEN** the dev-log function is called in development with a single argument (e.g. a string or object)
- **THEN** that argument is passed through to `console.log` unchanged

#### Scenario: Multiple arguments

- **WHEN** the dev-log function is called in development with multiple arguments (e.g. a message and interpolated values)
- **THEN** all arguments are passed through to `console.log` in order, unchanged

### Requirement: Placement in src/lib

The dev-log utility SHALL live under `src/lib/` (e.g. `src/lib/dev-log.ts`) and SHALL be the single source for this capability so that the rest of the app can import it app-wide.

#### Scenario: Import from lib

- **WHEN** any module in the app imports the dev-log function from its canonical path under `src/lib/`
- **THEN** it receives the same dev-only logging behavior and SHALL not need any other module for this purpose
