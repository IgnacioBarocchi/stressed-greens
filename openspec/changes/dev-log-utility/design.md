## Context

The app is Vite + TypeScript, frontend-only, with logic in `src/lib/`. There is no shared logging abstraction; debug output uses `console.log` directly, which runs in all environments. The proposal introduces a dev-only logging utility to centralize and gate that behavior.

## Goals / Non-Goals

**Goals:**

- Provide a single function that logs only when the app is in development (e.g. Vite `import.meta.env.DEV`).
- Place it in `src/lib/` for app-wide use.
- Match `console.log`-style variadic usage so it can replace `console.log` in dev paths with minimal friction.
- Keep production impact negligible (no-op or tree-shaken).

**Non-Goals:**

- Replacing all existing `console.log` usage in one go.
- Log levels, formatting, or remote logging.
- Any backend or external logging service.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Dev detection** | Use `import.meta.env.DEV` (Vite) | Already provided by the stack; no new env or build config. In production builds it is replaced with a literal, enabling dead-code elimination. |
| **API shape** | Single function, variadic `(...args: unknown[]) => void` | Drop-in for `console.log(...)`. No need for multiple methods (log/warn/error) unless we add them later; proposal scopes to “log things only in dev.” |
| **Location** | `src/lib/dev-log.ts` | Aligns with existing rule: pure logic and utilities in `src/lib/`. |
| **Export** | Named export (e.g. `devLog`) | Clear, searchable, and consistent with the rest of the codebase. |

**Alternatives considered:**

- **Wrapping `console`:** We could expose `devLog.log` / `.warn` etc. Deferred; a single `devLog` satisfies current needs and keeps the API small.
- **Build-time stripping:** Rely on a plugin to strip `console.*` in production. Not chosen: we want an explicit, in-source gate so dev-only logs are obvious and we avoid stripping logs that might be intentional in production (e.g. errors).

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| **Call sites still use `console.log`** | Adoption is incremental; no mandatory migration. Docs or a short comment in the utility can recommend `devLog` for dev-only output. |
| **`import.meta.env` not available in tests** | Vitest runs with Vite’s env; `import.meta.env.DEV` is typically `true` in test runs. If we need production behavior in tests, we can inject a flag or keep the implementation a thin wrapper that’s easy to test. |
| **Minimal API** | If we later need `devWarn` / `devError`, we can add them in the same module without changing the existing export. |

## Migration Plan

- Add `src/lib/dev-log.ts` and wire it to `import.meta.env.DEV`.
- No rollout or feature flags; usage is optional and incremental.
- Rollback: remove or replace calls to the utility if needed; no shared state or migrations.

## Open Questions

None. Scope is limited to a single utility and one new file.
