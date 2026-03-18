## Context

The app is Vite + React with React Router; settings are a modal opened from the header. A single theme (dark) is applied via root class. Recipe finder calls a Tauri/Rust action and renders results; vegetable list shows cards with a delete button. There is no onboarding, no swipe gestures, no undo after delete, and no toast when recipe fetch fails. The codebase uses shadcn-style components under `src/components/ui/`. User settings are persisted (e.g. localStorage or similar).

## Goals / Non-Goals

**Goals:**

- Settings as full page on small viewports, modal on large; back and header logo navigate to home.
- Runtime theme switch (legacy | vercel) with persistence; legacy = current look.
- Recipe search shows 5 skeleton cards while loading.
- First-time users see a skippable slide tour; "tour seen" persisted.
- Cursor rule: prefer `src/components/ui/` when adding/implementing components.
- Swipe-to-delete on vegetable cards alongside existing button.
- Undo snackbar after delete(s), time-limited restore, safe-area aware.
- Toast on recipe fetch failure with fallback message; use UI folder.

**Non-Goals:**

- Changing data models or backend contracts.
- Full design system overhaul beyond the second theme option.
- Tour as overlay/tooltips; we use slides only.
- Removing the existing delete button (swipe is additive).

## Decisions

1. **Settings: route vs modal by viewport**
   - Use a dedicated route (e.g. `/settings`). On viewport below a breakpoint (e.g. `md`), render settings as the only content (full page). Above breakpoint, keep current modal behavior from header. Header logo links to `/` (home); when on `/settings`, back (browser/Android back or explicit back control) or logo goes home. *Alternative:* Always full page on mobile; would require routing and layout changes only. Chosen: single route, conditional rendering (page vs modal) by breakpoint so desktop keeps modal UX.

2. **Theme application**
   - Add a user setting `theme: 'legacy' | 'vercel'`. Default `legacy`. Apply by setting a class or data attribute on the root (e.g. `data-theme="vercel"` or `.theme-vercel`). Legacy uses current `globals.css`; add a second theme file (e.g. Vercel/tweakcn variables) that is active when root has the vercel class. No build-time swap—both themes available; runtime toggle only. *Alternative:* Separate HTML or build variant; rejected to keep one bundle and simple switching.

3. **Recipe skeletons**
   - While `loading` (or equivalent) is true in the recipe-finder flow, render 5 placeholder cards using the Skeleton component from `src/components/ui/skeleton` (add if missing). Same approximate layout as recipe cards. Hide when results arrive. Count of 5 is fixed per proposal.

4. **First-session tour**
   - Add a persisted flag (e.g. in user settings) `tourSeen: boolean`. On first load when `!tourSeen`, show a slide-based tour (full-screen or prominent card); each slide one idea (purpose, fridge tracker, recipe finder, sort by freshness, settings). Skip button on every slide; after last or skip, set `tourSeen = true` and persist. No overlay/tooltips; slides only. *Alternative:* Non-dismissible tutorial; rejected in favor of skippable.

5. **Prefer UI folder rule**
   - Add a Cursor rule file under `.cursor/rules` (e.g. `generic/prefer-ui-folder.mdc`) stating: when the user asks for new or modified UI components, check and use existing components in `src/components/ui/` (shadcn) before implementing from scratch. Reference badge example (use `@/components/ui/badge` rather than custom badge).

6. **Swipe-to-delete**
   - Use touch handlers (or a small library e.g. react-swipeable) on the vegetable card container. On swipe-to-reveal or swipe-threshold, call the same `onRemove` as the delete button so behavior is identical. Ensure horizontal swipe does not conflict with vertical scroll (e.g. constrain direction or threshold). *Alternative:* Long-press; rejected in favor of swipe for discoverability.

7. **Undo snackbar**
   - On delete, push item(s) to a "recently deleted" queue and start a timer (e.g. 5s). Show a bottom snackbar (use Sonner or shadcn toast/snackbar if available) with "Undo". Snackbar positioned above safe-area bottom (e.g. `bottom: env(safe-area-inset-bottom)` + offset). If user clicks Undo within the window, re-add the item(s) and clear from queue; otherwise after 5s remove from queue and commit delete. Batch: multiple quick deletes can show one snackbar with single Undo restoring all in that window. Prefer UI folder component for snackbar/toast.

8. **Recipe fetch error toast**
   - In the recipe-finder flow, when the Rust/invoke call fails (catch), show a toast (using `src/components/ui` toast or Sonner) with a message that content could not be loaded and the app is showing default/fallback results. Same toast system as undo snackbar if possible (e.g. toast variant or placement).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Theme CSS variables clash (legacy vs vercel) | Scope Vercel theme under a single root class/attribute; keep legacy as default variable set. |
| Tour shown every time if persistence fails | Treat missing `tourSeen` as false; ensure settings save runs before closing tour. |
| Swipe conflicts with list scroll | Use horizontal swipe only with clear threshold; or use a library that distinguishes direction. |
| Undo window too short or too long | Default 5s; consider making duration configurable later if needed. |
| Multiple toasts/snackbars | Use a single toast/snackbar provider; queue or replace messages as per UI component behavior. |

## Migration Plan

- Deploy as normal: new route, new theme file, new settings keys. Default theme `legacy` and `tourSeen` false for existing users (first load after deploy shows tour once). No data migration.
- Rollback: revert deploy; existing users keep persisted theme/tourSeen; no breaking change.

## Open Questions

- Exact breakpoint for "small" (settings as page): suggest `md` (e.g. 768px); confirm in implementation.
- Whether to add Geist font for Vercel theme or rely on existing font stack; can be decided when adding the Vercel CSS.
