## Context

Admin mode v1 (admin-mode-branding) added `UserSettings.adminMode` and a sync path: `adminModeAtom` (Jotai) was kept and synced with settings via `useSyncAdminFromSettings` and the shortcut. That created two sources of truth. 3D debug visibility is still driven by `debug3dAtom`. This change makes user settings the **only** source for both admin mode and 3D debug: we **eliminate** the admin atom entirely and remove the 3D debug atom as the source of truth. Admin mode and "show 3D debug" live only in `UserSettings`; components read from `useUserSettings()` and the shortcut writes only to settings.

## Goals / Non-Goals

**Goals:**

- Admin mode and 3D debug are user settings only; no Jotai atoms for either. Eliminate `adminModeAtom`; remove or repurpose `debug3dAtom`.
- Leva panel visibility follows the 3D debug setting (hidden when admin off or show3dDebug off).
- Admin mode switch uses admin brand color when checked.

**Non-Goals:**

- Changing how mock/clear, import/export, or the 3D canvas work beyond where they read admin/3D debug state.
- Adding new admin features; this is a refactor of state source only (and Leva/switch UI).

## Decisions

### 1. Eliminate adminModeAtom

**Decision:** Remove `adminModeAtom` from `src/store/atoms.ts` and from all imports/usages. Every component that currently reads `adminModeAtom` or `useAtomValue(adminModeAtom)` SHALL instead read `useUserSettings().settings.adminMode`. The settings modal and the keyboard shortcut SHALL write only to user settings via `updateSettings({ adminMode })`. No sync hook, no atom.

**Rationale:** Single source of truth. Admin mode is a user preference and belongs in the settings table; keeping an atom duplicates state and requires error-prone sync.

### 2. Remove useSyncAdminFromSettings

**Decision:** Delete the hook `useSyncAdminFromSettings` and remove any call to it (e.g. from Home/page). No component shall sync settings → atom on load, because there is no admin atom.

**Rationale:** Sync exists only to bridge atom and settings; once the atom is gone, the hook is obsolete.

### 3. Shortcut updates only user settings

**Decision:** `useAdminShortcut` SHALL call `updateSettings({ adminMode: !current })` (using current value from `useUserSettings().settings.adminMode`). It SHALL NOT use `useSetAtom(adminModeAtom)`.

**Rationale:** Shortcut is just another way to toggle the same setting; one write path.

### 4. Add show3dDebug to UserSettings and eliminate debug3dAtom as source of truth

**Decision:** Add `show3dDebug: boolean` to `UserSettings` and `DEFAULT_USER_SETTINGS` (default `false`). Remove `debug3dAtom` from `src/store/atoms.ts` (or leave it unused and delete all references). All logic that currently uses `debug3dAtom` to show/hide the 3D debug card or Leva SHALL use `settings.adminMode && settings.show3dDebug` instead.

**Rationale:** 3D debug is a sub-setting of admin; it belongs in the same settings store. No second source of truth.

### 5. Leva visibility component

**Decision:** Add a component (e.g. `LevaVisibility` or wrap at app root) that renders Leva's root/panel with `hidden={!(settings.adminMode && settings.show3dDebug)}`. Mount it where Leva is currently provided (e.g. root layout or a parent of the 3D canvas). The component reads `useUserSettings().settings` and passes `hidden` reactively.

**Rationale:** Leva's `hidden` prop controls the panel; one place owns visibility from settings.

### 6. Admin switch checked state uses admin color

**Decision:** In the settings modal, the "Admin mode" switch SHALL use the admin brand color (e.g. `data-[state=checked]:bg-admin` or equivalent Tailwind/theme token) for its fill when checked. Use the same `--color-admin` (or `admin`) token as borders and AdmBadge.

**Rationale:** Visual consistency with the rest of the admin branding.

### 7. Keep expandedCardIdAtom

**Decision:** Keep `expandedCardIdAtom` in the store for UI state (which card is expanded). It is not a user preference and is not persisted.

**Rationale:** Unrelated to admin/3D debug; no need to move to settings.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Components that don't have access to useUserSettings (e.g. deep in tree) | Pass `adminMode` / `show3dDebug` as props from a parent that has useUserSettings, or use a small context that only exposes settings (no atom). Prefer props where the tree is shallow. |
| Leva panel mount location | Leva may need to be at root so useControls elsewhere can connect; ensure the visibility wrapper is a parent of where Leva is rendered and has access to settings. |

## Migration Plan

1. Add `show3dDebug` to UserSettings; default false.
2. Replace every `useAtomValue(adminModeAtom)` (and similar) with `useUserSettings().settings.adminMode`; replace every `useAtomValue(debug3dAtom)` with `(settings.adminMode && settings.show3dDebug)`.
3. Update shortcut to only call `updateSettings({ adminMode })`; remove setAdminMode / atom.
4. Remove useSyncAdminFromSettings and its usage.
5. Delete adminModeAtom and debug3dAtom from atoms.ts (or remove all usages and then delete).
6. Add Leva visibility component and mount it; wire `hidden` to settings.
7. Add "Show 3D debug card" toggle in Admin section; style Admin mode switch with admin color when on.
8. Verification: admin and 3D debug behavior unchanged from user perspective, with single source in settings.

## Open Questions

None; elimination of atoms is explicit.
