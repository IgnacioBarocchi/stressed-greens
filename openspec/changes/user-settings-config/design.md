## Context

The app currently has a single create form that shows all fields (quantity, unit, date, cut toggle). The proposal calls for a user-configurable "simple mode" that hides optional fields, with a one-time override mechanism.

Existing patterns:

- Dexie singleton in `db.ts` with versioned schema migrations
- Reactive reads via `useLiveQuery` in hooks
- Pure helpers in `src/lib/` for domain logic
- UI components use Radix-based primitives from `src/components/ui/`

## Goals / Non-Goals

**Goals:**

- Persist a single user preference (`simpleCreateForm`) across sessions
- Provide a settings modal accessible from the header
- Adapt the create form based on the saved preference
- Allow one-time override via "More options" without changing the saved setting

**Non-Goals:**

- Multi-user or cloud sync (this is local-only)
- Complex settings UI (just one toggle for now)
- Changing how items are displayed in the list view

## Decisions

### 1. Settings storage: Single-row table

**Decision:** Store settings as a single row with a fixed ID (`"user-settings"`) rather than a key-value store.

**Rationale:**

- Simpler reads/writes — just `db.settings.get("user-settings")` and `db.settings.put({ id, ...settings })`
- Type-safe — the row is a typed `UserSettings` object
- Sufficient for current scope (one boolean) and future additions (just add fields)

**Alternative considered:** Key-value table (`{ key: string, value: any }`). More flexible but requires serialization and loses type safety. Overkill for a single-user app with few settings.

### 2. Schema version bump to v3

**Decision:** Add `settings` table in Dexie schema version 3.

```ts
this.version(3).stores({
        vegetables: "id, fridgeDate, isMock",
        settings: "id",
});
```

**Rationale:** Follows existing pattern (v1 → v2 added `isMock` index). Dexie handles migration automatically.

### 3. Settings type with defaults

**Decision:** Define `UserSettings` type and `DEFAULT_USER_SETTINGS` constant in `src/lib/user-settings.ts`.

```ts
interface UserSettings {
        id: "user-settings";
        simpleCreateForm: boolean;
}

const DEFAULT_USER_SETTINGS: UserSettings = {
        id: "user-settings",
        simpleCreateForm: true, // simple mode ON by default
};
```

**Rationale:**

- Centralized defaults — hook returns defaults when no row exists (first launch)
- Extensible — add fields here as settings grow
- Pure module — no DB dependency, easy to test

### 4. Hook design: `useUserSettings()`

**Decision:** Single hook that returns `{ settings, updateSettings, isLoading }`.

```ts
function useUserSettings() {
        const settings = useLiveQuery(() => db.settings.get("user-settings"));
        const resolved = settings ?? DEFAULT_USER_SETTINGS;

        const updateSettings = (partial: Partial<Omit<UserSettings, "id">>) => {
                db.settings.put({ ...resolved, ...partial });
        };

        return { settings: resolved, updateSettings, isLoading: settings === undefined };
}
```

**Rationale:**

- Reactive — `useLiveQuery` re-renders on DB changes
- Handles missing row — returns defaults on first launch
- Simple API — components just read `settings.simpleCreateForm` and call `updateSettings({ simpleCreateForm: false })`

### 5. Override mechanism: Local component state

**Decision:** Add `showAdvanced` state to `AddVegetableForm`. When true, render all fields regardless of `settings.simpleCreateForm`.

**Rationale:**

- No persistence needed — resets naturally when form closes (state destroyed)
- No DB writes — doesn't touch the saved preference
- Simple UX — "More options" link sets `showAdvanced = true`

### 6. Modal component: Use existing Dialog primitive

**Decision:** Create `SettingsModal` using `src/components/ui/dialog.tsx` (Radix Dialog).

**Rationale:**

- Consistent with existing UI patterns
- Accessible by default (focus trap, escape to close)
- Mobile-friendly

### 7. Header settings icon

**Decision:** Add a Settings (gear) icon button to `AppHeader`, positioned on the right side. Clicking opens `SettingsModal`.

**Rationale:**

- Standard placement for settings
- Uses lucide-react `Settings` icon (already in dependencies)

## Risks / Trade-offs

| Risk                                                                | Mitigation                                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| First-time users see no settings row → could cause undefined errors | Hook returns `DEFAULT_USER_SETTINGS` when row is missing                            |
| Adding more settings later could bloat the single row               | Acceptable for local app; if many settings, can refactor to key-value later         |
| "More options" override might confuse users expecting it to persist | Clear UX: it's a link that expands fields, not a mode toggle                        |
| Schema migration from v2 → v3                                       | Dexie handles automatically; no data migration needed since `settings` is new table |

## Open Questions

None — scope is small and decisions are straightforward.
