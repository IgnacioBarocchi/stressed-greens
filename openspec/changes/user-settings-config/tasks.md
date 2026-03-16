## 1. Database & Types

- [x] 1.1 Create `src/lib/user-settings.ts` with `UserSettings` type and `DEFAULT_USER_SETTINGS` constant
- [x] 1.2 Add `settings` table to `FridgeDb` class in `src/lib/db.ts` (schema version 3)
- [x] 1.3 Update `VegetableItem` type to allow `quantity: number | null` and `unit: string | null`

## 2. Settings Hook

- [x] 2.1 Create `src/hooks/use-user-settings.ts` with `useUserSettings()` hook
- [x] 2.2 Implement `useLiveQuery` for reactive settings read
- [x] 2.3 Implement `updateSettings` function for partial updates

## 3. Settings Modal

- [x] 3.1 Create `src/components/settings-modal.tsx` using Dialog primitive
- [x] 3.2 Add "Simple create form" toggle with label and description
- [x] 3.3 Wire toggle to `updateSettings({ simpleCreateForm })` on change

## 4. Header Integration

- [x] 4.1 Add Settings icon button to `src/components/app-header.tsx`
- [x] 4.2 Add state to control settings modal open/close
- [x] 4.3 Render `SettingsModal` and connect to header button

## 5. Create Form Adaptation

- [x] 5.1 Import `useUserSettings` in `add-vegetable-form.tsx`
- [x] 5.2 Add `showAdvanced` local state for one-time override
- [x] 5.3 Conditionally render quantity/unit/date fields based on mode
- [x] 5.4 Add "More options" link that sets `showAdvanced = true`
- [x] 5.5 Update `handleSubmit` to use `null` for quantity/unit when in simple mode
- [x] 5.6 Reset `showAdvanced` to `false` after form submission

## 6. List View Updates

- [x] 6.1 Update `vegetable-card.tsx` to handle `null` quantity/unit gracefully
- [x] 6.2 Only display quantity/unit section when values are present

## 7. Build Payload Updates

- [x] 7.1 Update `buildAddItemPayload` in `vegetables-data.ts` to accept nullable quantity/unit
- [x] 7.2 Update payload builder tests if they exist

## 8. Manual Verification

- [ ] 8.1 Verify settings persist after page reload
- [ ] 8.2 Verify simple mode hides fields and uses correct defaults
- [ ] 8.3 Verify "More options" expands fields without persisting
- [ ] 8.4 Verify list view displays items correctly with/without quantity
