# Change: Add Form Expansion

**Status:** Ready for implementation  
**Spec:** See `openspec/specs/add-form-expansion-proposal.md` for full design, UX rationale, and architecture.

## Summary

Expand the Add Vegetable form with:

1. **Progressive disclosure** — Quantity, unit, fridge date, and wasCut toggle are hidden until a vegetable is selected (preset or custom).
2. **Empty-state custom entry** — When search has no matches, show "Add as custom vegetable"; selecting it reveals secondary fields and uses the typed name.
3. **Visual preset grid** — When the search input is focused, show a card below with a responsive grid of preset tiles (image + name). Grid is **filtered by search** (same as dropdown); **matching substring in each name is highlighted**. Empty search shows all presets.
4. **Data model** — Add `imageUrl` to `VegetablePreset` and `VegetableItem`; use `https://placehold.co/400x400` as default.

## Out of scope (this change)

- Removing or pruning UI components.
- Backend or API changes (app remains offline-first).

## Reference

- Full proposal: `openspec/specs/add-form-expansion-proposal.md`
- Product definition: `openspec/specs/product-definition.md`
- DB interface: `openspec/specs/db-interface-spec.md`
