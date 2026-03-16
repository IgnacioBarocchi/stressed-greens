## Context

The app has a list of vegetable cards (`VegetableList` → `VegetableCard`). Settings are persisted in Dexie (`settings` table, `useUserSettings` hook) and edited via a modal. This change adds optional expandable 3D previews per card, gated by a new setting and rendered with React Three Fiber (R3F) and Drei. The project uses pnpm for package management.

## Goals / Non-Goals

**Goals:**

- One card at a time can expand to show an inline R3F+Drei canvas; click same card to collapse, click another to switch.
- "Use 3D graphics" toggle in the existing settings modal; when off, no 3D expansion (cards behave as today or expand without canvas, per spec).
- Phase 1: canvas content is a default Drei `Box` only.
- Dependencies installed via pnpm; 3D canvas only mounted when expanded and setting on.

**Non-Goals:**

- Vegetable-specific 3D models or geometry (future phase).
- Multiple cards expanded at once.
- 3D outside the card (e.g. full-screen or overlay).

## Decisions

### 1. Dependencies and package manager

**Decision:** Add `@react-three/fiber`, `@react-three/drei`, and `three` using **pnpm** (`pnpm add @react-three/fiber @react-three/drei three`).

**Rationale:** Project already uses pnpm; lockfile and install scripts stay consistent.

**Alternative:** npm or yarn — rejected to keep a single package manager.

### 2. Where expanded-card state lives

**Decision:** Hold "which card is expanded" in the **list parent** (`VegetableList`): e.g. `expandedCardId: string | null`. Pass into each card: `isExpanded={expandedCardId === item.id}` and `onToggleExpand={() => setExpandedCardId(prev => prev === item.id ? null : item.id)}` (or equivalent).

**Rationale:** Single-open rule is a list-level constraint; parent already owns the list of items, so it’s the natural place. Cards stay presentational and avoid cross-card coordination.

**Alternative:** Global store (e.g. context or Zustand) — overkill for a single list and one expanded id.

### 3. When to mount the 3D canvas

**Decision:** Mount the R3F canvas only when (1) the card is expanded and (2) `settings.use3dGraphics` is true. Unmount when either condition is false.

**Rationale:** Avoids running WebGL when 3D is disabled or when the user has collapsed the card; keeps GPU and CPU use minimal.

### 4. Settings schema extension

**Decision:** Add `use3dGraphics: boolean` to `UserSettings` and `DEFAULT_USER_SETTINGS` (default `false`). No new DB table or migration; same `settings` row, one new field. Settings modal gets a second toggle, "Use 3D graphics".

**Rationale:** Matches existing pattern (single row, typed object); `useUserSettings` and `updateSettings` already support partial updates.

### 5. Card click target

**Decision:** Use a single clickable area for "toggle expand": the whole card body (or a dedicated tap target) toggles expand/collapse. Remove button (e.g. checkmark) must not trigger expand — use `stopPropagation` or a separate click handler so "mark as eaten" and "toggle expand" do not conflict.

**Rationale:** Mobile-friendly, one clear gesture; avoid accidental expand when removing.

### 6. Canvas size and layout

**Decision:** Inline canvas with fixed aspect ratio (e.g. full width of card, height ~120–160px or similar). Use a wrapper div with explicit dimensions; R3F `Canvas` with `gl={{ antialias: true }}` and `camera` props as needed. No full-screen or modal for phase 1.

**Rationale:** Keeps the list readable and avoids layout shift; explicit size avoids R3F resize issues.

## Risks / Trade-offs

| Risk                                   | Mitigation                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| R3F/Drei/three increase bundle size    | Lazy-load the 3D component (e.g. `React.lazy` + `Suspense`) so the 3D libs load only when 3D is used.    |
| WebGL not supported or fails on device | Canvas in error boundary; on error, show a short fallback message and collapse or hide 3D for that card. |
| Multiple canvases if user toggles fast | Single-open ensures at most one canvas; unmount on collapse so only one canvas exists at a time.         |
| Remove vs expand click conflict        | Separate handlers; remove button stops propagation so card click handler doesn’t run.                    |

## Open Questions

None for phase 1. Vegetable-specific geometry and lazy-loading strategy can be decided in a later change.
