## Why

The current create form requires users to specify quantity, unit, and fridge date for every vegetable — even when they just want to quickly log "I put spinach in the fridge." This adds friction for casual usage. Users should be able to choose a simplified experience while retaining the option for granular tracking when needed.

## What Changes

- **Settings storage**: New `settings` table in Dexie DB to persist user preferences locally
- **Settings modal**: Accessible via new settings icon in header; contains toggle for "Simple create form" (default: on)
- **Adaptive create form**:
     - Simple mode: Shows only name/search + "Already cut/sliced" toggle. Assumes date = today, quantity/unit = null.
     - Advanced mode: Shows all fields (current behavior)
- **One-time override**: "More options" link in simple mode expands advanced fields for that single entry only; does not change the saved preference
- **List view unchanged**: Items display whatever data they have — quantity/unit still shown for items that have it

## Capabilities

### New Capabilities

- `user-settings`: Persistent user preferences stored in IndexedDB via Dexie. Includes settings table schema, read/write operations, and reactive hook for components.

### Modified Capabilities

<!-- No existing specs are changing requirements. The create form changes are implementation-level, not spec-level. -->

## Impact

- `src/lib/db.ts` — Add `settings` table with schema version bump
- `src/components/app-header.tsx` — Add settings icon/button
- `src/components/add-vegetable-form.tsx` — Conditionally render fields based on mode; add "More options" override
- New: `src/components/settings-modal.tsx` — Modal with settings toggle
- New: `src/hooks/use-user-settings.ts` — Hook for reading/writing settings with `useLiveQuery`
- New: `src/lib/user-settings.ts` — Types and default values for settings
