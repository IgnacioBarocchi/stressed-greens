## 1. Dependencies

- [x] 1.1 Install Jotai via pnpm

## 2. UI Store

- [x] 2.1 Create UI store module (e.g. src/store/atoms.ts or src/lib/ui-store.ts) with expandedCardId atom (string | null) and debug3dAtom (boolean, default false)
- [x] 2.2 Update VegetableList to read expandedCardId from store and write on toggle; remove local useState for expandedCardId
- [x] 2.3 Update VegetableCard to read isExpanded from store and call store setter for onToggleExpand; keep props API or switch to store-only

## 3. Canvas Event Boundary

- [x] 3.1 Add onPointerDown with stopPropagation to the canvas wrapper div in VegetableCard3dCanvas so pointer events do not bubble to the card

## 4. Debug Mode – Auto-expand First Card

- [x] 4.1 When debug3d is true and the list has items, set expandedCardId to the first item’s id (e.g. in VegetableList or equivalent, guarded so it runs when debug or items change)

## 5. Debug Mode – Camera Logger

- [x] 5.1 Add a component inside the R3F canvas that uses useThree() to read camera; when debug3d is true, render a full-screen transparent click target with onClick that logs camera position, quaternion (or rotation), and fov to console
- [x] 5.2 Gate the camera-logger so it only renders when debug3d is true (e.g. read debug3dAtom in parent and pass or read inside canvas)

## 6. Manual Verification

- [ ] 6.1 Verify orbit-drag on canvas does not expand or collapse the card
- [ ] 6.2 Verify click on canvas does not toggle card; click on card outside canvas still toggles
- [ ] 6.3 With debug on, verify debug card appears above list, click on canvas logs camera, and toggle button switches mascot dance/crawl
