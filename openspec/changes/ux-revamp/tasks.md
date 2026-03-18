## 1. Cursor rule

- [x] 1.1 Add `.cursor/rules/generic/prefer-ui-folder.mdc`: when adding or implementing UI components, check and use `src/components/ui/` (e.g. shadcn) before building from scratch; reference badge example

## 2. User settings and theme

- [x] 2.1 Add user setting `theme: 'legacy' | 'vercel'` (default `legacy`) and persist
- [x] 2.2 Add Vercel/tweakcn theme CSS (scoped under root class or data-theme) and keep legacy as current globals
- [x] 2.3 Apply theme at runtime from setting (root class or data attribute) on load and when setting changes
- [x] 2.4 Add theme dropdown in settings (Legacy / Vercel)
- [x] 2.5 Add user setting `tourSeen: boolean` (default false) and persist

## 3. Settings responsive layout

- [x] 3.1 Add route `/settings` and settings page view
- [x] 3.2 On viewport below breakpoint (e.g. md): render settings as full page when on `/settings`; on large viewport keep modal from header
- [x] 3.3 Header logo links to `/`; when on `/settings`, back (browser/Android back or explicit back control) and logo navigate to home
- [x] 3.4 Wire header settings trigger: small viewport navigate to `/settings`, large open modal

## 4. Recipe loading skeletons

- [x] 4.1 Add or use Skeleton component from `src/components/ui/skeleton` if missing
- [x] 4.2 In recipe finder: while loading, show 5 skeleton cards in same approximate layout as recipe cards; hide when results or error/empty

## 5. First-session tour

- [x] 5.1 Build skippable slide-based tour (purpose, fridge tracker, recipe finder, sort by freshness, settings); skip button on each slide
- [x] 5.2 On first load when `!tourSeen`, show tour; on skip or complete set `tourSeen = true` and persist
- [x] 5.3 Do not show tour when `tourSeen` is true

## 6. Swipe to delete

- [x] 6.1 Add swipe gesture (touch or library) on vegetable card; horizontal swipe past threshold calls same onRemove as delete button
- [x] 6.2 Ensure swipe does not conflict with vertical list scroll (direction/threshold)

## 7. Undo snackbar

- [x] 7.1 On delete: push item(s) to recent-deleted queue, start 5s timer, show bottom snackbar with Undo (use UI folder toast/snackbar if available)
- [x] 7.2 Position snackbar above safe-area bottom inset
- [x] 7.3 Undo within 5s restores item(s) and dismisses; after 5s commit delete and dismiss
- [x] 7.4 Batch: multiple quick deletes show one snackbar; Undo restores all in that window

## 8. Recipe error toast

- [x] 8.1 In recipe finder: on Rust/invoke fetch failure (catch), show toast that content could not be loaded and app is using default/fallback results
- [x] 8.2 Use same toast system as undo snackbar (UI folder or Sonner)

## 9. Verification

- [ ] 9.1 Verify settings: full page on small, modal on large; back and logo to home
- [ ] 9.2 Verify theme switch legacy/vercel persists and applies
- [ ] 9.3 Verify recipe skeletons and tour (first load vs after skip)
- [ ] 9.4 Verify swipe-to-delete and undo snackbar (restore and timeout)
- [ ] 9.5 Verify recipe failure toast when fetch fails
