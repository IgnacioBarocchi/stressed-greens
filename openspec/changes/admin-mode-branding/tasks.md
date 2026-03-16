## 1. Persist admin mode in user settings

- [x] 1.1 Add `adminMode: boolean` to `UserSettings` in `src/lib/user-settings.ts` and to `DEFAULT_USER_SETTINGS` (default `false`)
- [x] 1.2 On app load, initialize `adminModeAtom` from persisted `UserSettings.adminMode` (e.g. in a root/layout effect or a small sync module that reads settings and sets the atom once)
- [x] 1.3 When the admin toggle is changed in the settings modal, write the new value to the settings table and update `adminModeAtom` so existing consumers (shortcut, page gating) stay in sync
- [x] 1.4 Ensure keyboard shortcut (if kept) updates the atom and persists to settings when toggling admin

## 2. Admin branding (styles + badge)

- [x] 2.1 Define admin brand color: add a Tailwind theme token (e.g. `admin` or use `violet-600`) for border and badge background
- [x] 2.2 Create shared admin styling: font-mono for admin text, border class using the admin color; export a class list or wrapper (e.g. `adminCardClasses` or `AdminCard`) for reuse
- [x] 2.3 Create `AdmBadge` component: pill shape, admin brand background, white "adm" text; use for one badge per admin block (top-right or next to heading)
- [x] 2.4 Add `aria-label` or similar on `AdmBadge` for accessibility

## 3. Settings modal: Admin section

- [x] 3.1 Add an "Admin" section to the settings modal below existing toggles; apply admin branding (mono font, purple border, "adm" badge)
- [x] 3.2 In the Admin section, add the admin mode toggle bound to `UserSettings.adminMode` (read/write via `useUserSettings` and sync to `adminModeAtom`)
- [x] 3.3 When admin is on, show in the Admin section: entry to open/preview 3D debug card, Load mock data, Clear mock data, Import, Export (reuse existing handlers where they exist)
- [x] 3.4 When admin is off, show only the toggle in the Admin section; hide or disable the action buttons/links

## 4. Apply branding to existing admin surfaces

- [x] 4.1 Apply admin branding (border, mono font, AdmBadge) to the mock/clear data block on the main page when admin is on
- [x] 4.2 Apply admin branding to the 3D debug card container
- [x] 4.3 Apply admin branding to import/export controls (wherever they are rendered in an admin context)
- [x] 4.4 Apply admin branding to any other admin-only switch or button that uses the new identity

## 5. Verification

- [ ] 5.1 With admin off (and after reload), confirm no admin UI in main flow (mock/clear hidden); open settings and confirm admin toggle is off and admin actions are hidden or disabled
- [ ] 5.2 Turn admin on in settings; reload and confirm admin stays on; confirm branded admin section and visible entries for 3D debug, load/clear mock, import/export
- [ ] 5.3 Confirm all admin-only blocks (mock/clear, 3D debug card, import/export) display the shared branding (mono font, purple border, "adm" pill)
