## 1. Single source: admin mode from settings only

- [x] 1.1 Remove adminModeAtom usage from all components; read adminMode from useUserSettings().settings.adminMode
- [x] 1.2 Remove useSyncAdminFromSettings; ensure shortcut and settings modal only write/read UserSettings.adminMode
- [x] 1.3 Delete or deprecate adminModeAtom (and sync hook) once all consumers use settings

## 2. 3D debug as user setting (sub-setting of admin)

- [x] 2.1 Add show3dDebug to UserSettings and DEFAULT_USER_SETTINGS (default false)
- [x] 2.2 In settings Admin section, add "Show 3D debug card" toggle when admin is on; persist show3dDebug
- [x] 2.3 VegetableList and Debug3dCard: show 3D debug when settings.adminMode && settings.show3dDebug; remove or repurpose debug3dAtom
- [x] 2.4 "Show 3D debug card" button in settings: set show3dDebug true and optionally close modal

## 3. Leva panel visibility

- [x] 3.1 Add component that renders Leva with hidden={!settings.show3dDebug} (when admin on) or hidden={true} (when admin off)
- [x] 3.2 Mount this component so the Leva panel visibility is controlled by the 3D debug setting

## 4. Admin switch branding

- [x] 4.1 Style the Admin mode switch so its checked (on) state uses the admin brand color for the fill

## 5. Verification

- [ ] 5.1 With admin off, no admin UI, no 3D debug card, no Leva panel
- [ ] 5.2 With admin on and 3D debug off, admin section visible, no debug card, Leva panel hidden
- [ ] 5.3 With admin on and 3D debug on, debug card visible, Leva panel visible; admin switch has admin color when on
