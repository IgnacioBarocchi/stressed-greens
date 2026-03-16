## 1. Dependencies

- [x] 1.1 Install @react-three/fiber, @react-three/drei, and three via pnpm

## 2. Settings

- [x] 2.1 Add use3dGraphics (boolean, default false) to UserSettings and DEFAULT_USER_SETTINGS in src/lib/user-settings.ts
- [x] 2.2 Add "Use 3D graphics" toggle to settings modal and wire to updateSettings

## 3. List State

- [x] 3.1 Add expandedCardId state (string | null) to VegetableList
- [x] 3.2 Pass isExpanded and onToggleExpand (or equivalent) into each VegetableCard

## 4. Card Expand and Canvas

- [x] 4.1 Make card body (or dedicated area) clickable to toggle expand; call onToggleExpand on click
- [x] 4.2 Ensure remove button click does not trigger expand (e.g. stopPropagation)
- [x] 4.3 Create inline 3D canvas component (R3F Canvas + Drei Box) with fixed aspect ratio wrapper
- [x] 4.4 Mount canvas only when card is expanded and settings.use3dGraphics is true; unmount otherwise
- [x] 4.5 Render default Drei Box inside the canvas (phase 1 content)

## 5. Manual Verification

- [ ] 5.1 Verify expand/collapse and single-open behavior when 3D is on
- [ ] 5.2 Verify no 3D canvas when "Use 3D graphics" is off
- [ ] 5.3 Verify remove button does not expand card
- [ ] 5.4 Verify setting persists after reload
