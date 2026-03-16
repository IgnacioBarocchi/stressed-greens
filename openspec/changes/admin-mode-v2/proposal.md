## Why

Admin mode v1 introduced a settings toggle and branding but left two sources of truth: `adminModeAtom` (Jotai) and `UserSettings.adminMode` (Dexie), with sync logic between them. That duality is error-prone and confusing. In addition, 3D debug visibility is still driven by an internal `debug3dAtom` instead of being a user-facing setting. Extending admin mode to a single source of truth (user settings only) and making 3D debug a proper sub-setting improves maintainability and matches user intent: "admin mode" and "show 3D debug" are both preferences.

## What Changes

- **Single source for admin mode**: Admin mode is **only** a user setting (`UserSettings.adminMode`). Remove `adminModeAtom` and any sync; all UI that gates on admin (mock/clear, admin section, shortcut) reads from `useUserSettings().settings.adminMode`. The keyboard shortcut updates the setting (writes to DB) instead of an atom.
- **3D debug as a user setting (sub-setting of admin)**: Add a persisted setting (e.g. `UserSettings.show3dDebug`) that is only meaningful when admin mode is on. When admin is off, 3D debug is considered off and the debug card is hidden. When admin is on, the user can toggle "Show 3D debug card" in settings; that value is persisted. The 3D debug card and any Leva-dependent UI use this setting instead of `debug3dAtom`. Remove or repurpose `debug3dAtom` so it is no longer the source of truth for 3D debug visibility.
- **Leva panel visibility**: The Leva library supports a `hidden` prop on its root component (`<Leva hidden={true} />`). Implement a component that renders Leva (or wraps the Leva provider/panel) and sets `hidden={true}` when the 3D debug setting is off, and `hidden={false}` when it is on, so the controls panel only appears when the user has 3D debug enabled.
- **Admin switch styling**: The "Admin mode" switch in the settings modal should use the admin brand color for its fill when checked (on state), so it is visually consistent with the rest of the admin branding.

## Capabilities

### New Capabilities

- **admin-single-source**: Admin mode is exclusively a user setting; no Jotai atom for admin. All reads/writes go through `UserSettings.adminMode` and the settings modal or shortcut.
- **3d-debug-setting**: 3D debug visibility is a persisted user setting (`show3dDebug` or equivalent) that is only editable when admin mode is on. It is a sub-setting of admin (dependency: admin on → 3D debug can be toggled; admin off → 3D debug off / hidden).
- **leva-visibility**: A component or wrapper that controls the Leva panel visibility via the `hidden` prop based on the 3D debug setting.
- **admin-switch-branding**: The Admin mode switch in settings uses the admin brand color for its checked (on) state.

### Modified Capabilities

- **admin-mode-branding / admin-mode-settings**: Remove dependency on `adminModeAtom`; use only `UserSettings.adminMode`. Remove sync hooks (e.g. `useSyncAdminFromSettings`) and shortcut updates the setting directly.
- **3D debug card / VegetableList**: Show the 3D debug card when admin is on **and** the 3D debug setting is on; read from settings, not from `debug3dAtom`.
- **Settings modal**: Admin section toggle for "Show 3D debug card" when admin is on; both toggles (admin mode, 3D debug) persist to user settings. Admin mode switch styled with admin color when on.

## Impact

- **Store/atoms**: Remove or stop using `adminModeAtom` for gating; remove or repurpose `debug3dAtom` so 3D debug visibility comes from settings. Keep `expandedCardIdAtom` if still needed for UI state.
- **UserSettings**: Add `show3dDebug: boolean` (default `false`); ensure it is only applied when `adminMode` is true in the UI.
- **Components**: Page, MockDataActions, settings modal, VegetableList, Debug3dCard, and any consumer of admin or 3D debug read from `useUserSettings()`. Shortcut writes to `updateSettings({ adminMode })`. New: Leva visibility wrapper; admin switch uses admin-colored fill when checked.
- **Hooks**: Remove `useSyncAdminFromSettings`; update `useAdminShortcut` to toggle `UserSettings.adminMode` only. No atom sync.
- **Dependencies**: Leva already in use; use its `hidden` prop for the panel.
