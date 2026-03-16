## Why

The app is mobile-first (Android); current UX uses a settings modal and single theme, no loading states for recipe search, no onboarding, and delete-only flows without undo or clear error feedback. A revamp improves small-screen usability, theme choice, perceived performance, first-time understanding, and recovery from mistakes or failures.

## What Changes

- **Settings on small screens:** On small viewports, settings render as a full page (not a modal). Back button or tapping the app header logo returns to home.
- **Theme switcher:** User can choose theme at runtime: "legacy" (current style, default) and "vercel" (Vercel/tweakcn-inspired CSS). Current style is preserved; no breaking visual change by default.
- **Recipe loading skeletons:** While recipe search is loading, show 5 skeleton cards instead of empty or spinner.
- **First-session tour:** Skippable slide-based tour (not overlay tooltips) for first-time users: app purpose (fridge tracker for vegans), recipe finder, items sorted by freshness, and settings. Can be skipped.
- **Prefer UI folder rule:** Add a Cursor rule so that when components are requested, existing `src/components/ui/` (e.g. shadcn) are used where applicable instead of building from scratch.
- **Swipe to delete:** On mobile, user can swipe a vegetable card to delete the record, in addition to the existing delete button.
- **Undo snackbar:** After delete(s), a bottom snackbar with an "Undo" action appears; user has a short window (e.g. 5s) to restore recently deleted records. Snackbar respects safe-area bottom inset.
- **Recipe fetch error toast:** When the Rust recipe action fails, show a toast (using UI folder if available) that content could not be loaded and the app is falling back to default results.

## Capabilities

### New Capabilities

- `settings-responsive-layout`: Settings as full page on small viewports; modal on larger. Navigation: back or header logo to home.
- `theme-switcher`: Runtime theme selection between "legacy" (default) and "vercel" (tweakcn-inspired); current style retained as legacy.
- `recipe-loading-skeletons`: Show a fixed number (e.g. 5) of skeleton cards while recipe search results are loading.
- `first-session-tour`: Skippable slide-based onboarding (purpose, fridge tracker, recipe finder, sort by freshness, settings).
- `swipe-to-delete`: Swipe gesture on vegetable card deletes the record; complements existing delete button.
- `undo-snackbar`: Bottom snackbar with Undo after delete(s); time-limited restore; respects safe-area bottom.
- `recipe-error-toast`: Toast when recipe fetch fails, explaining fallback to default results; prefer UI folder component.

### Modified Capabilities

(No existing specs in openspec/specs require requirement-level changes for this revamp.)

## Impact

- **Routing:** Settings as route/page on small screens; back and header logo navigation.
- **Styles:** New theme CSS (e.g. Vercel/tweakcn variables); theme applied at runtime (e.g. class or data attribute on root).
- **Components:** Settings modal vs page, recipe skeletons, tour slides, vegetable list (swipe), snackbar, toast; prefer `src/components/ui/` where applicable.
- **User settings:** New persisted setting for theme (legacy | vercel) and likely a "tour seen" flag.
- **Cursor:** New rule under `.cursor/rules` to prefer UI folder components when implementing or adding components.
