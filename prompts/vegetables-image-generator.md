Cilantro
IMPORTANT: NO BACKGROUND - NO TABLE, PLATFORM, ETC

Generate Ultra-realistic editorial photograph of a fresh Cilantro, square format 400x400 resolution, fully isolated against absolute pure black (#000000), no visible surface, no table, no horizon line, no environmental context. The vegetable exists in optical isolation with no cast shadow on any plane, no reflections, no caustics, no spatial grounding elements — the frame contains only the specimen and controlled light falloff into black. Background must remain mathematically black, fading naturally via lens vignette and light falloff only — not gradient backdrop fabric. Portions of the vegetable’s outer contour subtly dissolve into darkness while primary structural edges remain crisp and tactile. Single directional soft key light positioned 45° to the side and slightly above, sculpting volume through chiaroscuro. No rim-light halo effect. No edge glow separation. Shadows must collapse cleanly into black without revealing a physical surface. Deep tonal gradation with biologically accurate specular highlights appropriate to the vegetable’s skin type. Captured on full-frame sensor simulation with 100mm macro lens. Controlled shallow depth of field with restrained falloff — focus prioritized on the structural core (stem, crown, or central mass depending on specimen). Subtle natural chromatic aberration and authentic color science. No HDR stacking, no digital over-sharpening. Surface rendering must emphasize micro-texture: pores, natural dimpling, faint dehydration lines if realistic, stem fiber detail, minor asymmetries, small dust particles permissible. Reflectivity must behave organically — no plastic gloss, no CGI smoothness, no synthetic surface polish. Color palette must remain botanically accurate with nuanced tonal variation, never hyper-saturated. Contrast is high but natural, preserving realistic dynamic range roll-off. Mood: museum specimen documentation meets dark editorial food photography. Cinematic restraint. Photographic authenticity prioritized over perfection. No illustration. No 3D render. No artificial smoothness. No stock-photo lighting. No visible environment. Only the vegetable and light disappearing into black.


V2

Ultra-realistic editorial photograph of a fresh bell pepper, square format 400x400 resolution, fully isolated against absolute pure black (#000000). No visible surface, no table, no horizon line, no environmental cues. The vegetable exists in optical isolation with no cast shadow plane, no reflections, no caustics, no spatial grounding elements.

Background must remain mathematically black, achieved through light falloff and negative fill — not a visible backdrop gradient. Portions of the outer contour naturally dissolve into shadow while primary structural ridges remain defined.

Single directional soft key light positioned 45° to the side and slightly above. Light must behave physically: uneven highlight distribution, slight intensity variance across curvature, no symmetrical gloss banding. No rim-light glow. No edge halo separation. Shadows collapse cleanly into black.

Full-frame camera simulation, 100mm macro lens. Controlled shallow depth of field with realistic optical falloff. Subtle lens breathing. Very slight chromatic aberration at high-contrast edges. Mild sensor grain structure (fine, organic, not digital noise).

Surface detail must emphasize biological irregularity:

micro-pores

faint dimpling

subtle hydration variation

tiny surface blemishes

minor asymmetry in lobes

non-uniform color density

slight imperfections near the stem crown

Reflectivity must be restrained and organic — slightly waxy but not glossy. No plastic sheen. No CGI smoothness. No hyper-clean surface.

Color science: natural red bell pepper tonality with slight hue shifts across planes (crimson to deep vermilion). Midtones slightly compressed to avoid commercial stock clarity. Preserve natural dynamic range roll-off.

Mood: museum specimen under controlled lighting. Dark, restrained, high-contrast editorial realism. Imperfection prioritized over polish.

No illustration. No 3D render. No synthetic smoothness. No HDR. No stock-photo aesthetic. No visible environment. Only the vegetable and light dissolving into black.

broccoli

Ultra-realistic editorial photograph of a fresh broccoli crown, square format 400×400 resolution, fully isolated against absolute pure black (#000000). No visible surface, no table, no horizon line, no environmental context. The vegetable exists in optical isolation with no cast shadow plane, no reflections, no caustics, no spatial grounding elements — the frame contains only the specimen and controlled light falloff into black.

Background must remain mathematically black, achieved through light falloff and negative fill — not a gradient backdrop or fabric. Portions of the broccoli’s outer contour subtly dissolve into darkness while key structural edges remain tactile and defined.

Single directional soft key light positioned 45° to the side and slightly above, sculpting the crown through restrained chiaroscuro. No rim-light halo effect. No edge glow separation. Shadows collapse cleanly into black without revealing a physical surface.

Captured on full-frame sensor simulation with 100 mm macro lens. Controlled shallow depth of field with gentle falloff — focus prioritized on the central floret clusters, allowing outer crowns to soften slightly. Subtle natural chromatic aberration and authentic color science. No HDR stacking, no digital over-sharpening.

Surface rendering must emphasize broccoli’s fractal botanical structure: dense clusters of tiny florets, irregular branching stems, natural asymmetry in the crown silhouette. Texture should appear dry-matte and granular, with minimal specular reflection.

## V0 App template

You are a senior product designer and front-end architect.

Your task is to generate a highly structured, implementation-ready prompt that I will paste into v0 (Vercel AI UI generator).

The output you produce must itself be a prompt — not an explanation.

The generated prompt must instruct v0 to create a modern, mobile-first, dark-mode UX boilerplate for a vegetable inventory management app.

Project Context:
This is a fridge vegetable tracker focused on shelf-life prioritization and minimal friction data entry.

Core Features:
1. Add vegetable items via:
   - Autocomplete from a preset vegetable database
   - OR manual custom entry
2. Fields per item:
   - vegetable (name)
   - quantity (number + unit)
   - fridge date (date added)
   - in-fridge lifespan whole (derived from preset DB)
   - in-fridge lifespan cut (derived from preset DB)
   - wasCut (boolean)
3. Users only manually input:
   - quantity
   - wasCut flag
   - fridge date (default today)
   Lifespan values come from the preset vegetable database and are not user-editable.
4. List view sorted automatically by urgency (items with least remaining life first).
5. Delete action (mark as eaten → remove from active list).
6. “Find Recipes” action:
   - Displays a list of vegan recipe URLs (mock placeholder URLs for now).
   - Render URL previews using Open Graph metadata card layout.
7. Include a JSON array example:
   - Provide a clean domain model schema.
   - Provide a small preset vegetable dataset (example: bell pepper, spinach, carrot, zucchini, broccoli).
8. UI Requirements:
   - Hyper-modern dark mode.
   - Mobile-first layout.
   - Clean typography.
   - Autocomplete input.
   - Card-based list with visual urgency indicator.
   - Smooth micro-interactions.
9. Architecture Notes (for awareness, not overexplained in UI):
   - This boilerplate will later migrate to Tauri (Vite + Rust).
   - State will later use Dexie (IndexedDB offline-first).
   - Keep component structure modular and state logic easily extractable.
10. Output format from v0 should be:
   - React / Next-compatible structure.
   - Clearly separated components.
   - Mock state handling.

Constraints:
- Do not over-explain.
- Do not provide backend logic.
- Focus on UX structure and component architecture.
- Include the JSON domain model and preset vegetable dataset inline in the prompt.

Deliverable:
Only output the final prompt to be pasted into v0.
Do not include commentary.