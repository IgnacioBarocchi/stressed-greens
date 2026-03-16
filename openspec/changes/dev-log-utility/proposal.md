## Why

Developers need to log debug or diagnostic information during development without that output appearing in production builds. Raw `console.log` (and similar) runs in all environments, which adds noise and can expose internal details. A single utility that logs only when the app is in development mode keeps the codebase consistent and avoids accidental production logging.

## What Changes

- Add a small utility (e.g. `devLog` or similar) that forwards to `console` only when running in dev mode (e.g. `import.meta.env.DEV` in Vite).
- Place it in `src/lib/` so it can be used app-wide.
- Optionally support the same call pattern as `console.log` (variadic arguments) for drop-in replacement where desired.

## Capabilities

### New Capabilities

- `dev-log`: A dev-only logging helper. When not in dev mode, calls are no-ops (or minimal overhead). Defines the public API (function name, signature, behavior in dev vs production) and where it lives in the project.

### Modified Capabilities

- None.

## Impact

- **Code**: New file under `src/lib/` (e.g. `dev-log.ts` or similar). No existing files are required to change; adoption can be incremental.
- **APIs**: No external APIs. Internal usage is optional (replace `console.log` in dev paths as needed).
- **Dependencies**: None. Relies on the existing Vite/build setup for `import.meta.env.DEV`.
- **Systems**: Build output unchanged; production bundles can tree-shake or strip no-op calls.
