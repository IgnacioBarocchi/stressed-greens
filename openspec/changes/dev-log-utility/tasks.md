## 1. Implementation

- [x] 1.1 Create `src/lib/dev-log.ts` with a function that accepts variadic arguments (`...args: unknown[]`) and forwards them to `console.log` when `import.meta.env.DEV` is true
- [x] 1.2 In the same file, make the function a no-op when not in development (e.g. when `import.meta.env.DEV` is false)
- [x] 1.3 Export the function as a named export `devLog`
- [x] 1.4 Add the project’s standard file header comment to `src/lib/dev-log.ts`

## 2. Verification

- [x] 2.1 Add unit tests for `devLog`: when dev mode is enabled, calls forward to `console.log` with the same arguments
- [x] 2.2 Add unit test(s) for `devLog`: when not in dev mode, calls do not invoke `console.log` (or document Vitest env behavior if DEV is always true in tests)
