# Spritemaster Resource Generator

Resource-native viewer for the side-scroller color rig in `showcase/clean_resource`.
The current app is intentionally narrowed to the real source sheets first:
native source slicing, normalized 96x96 output frames, color-coded limbs,
role-aware proportion controls, palettes, per-module color tuning, outlines, shading, variable
frame timing, sheet overviews, favorites, and ZIP sprite exports.

## Prerequisites

- Node.js 18+ installed
- No additional npm packages are required for the dev server
- Python installed only if you want to regenerate the resource manifest after editing clean resources

## Launch locally

From the project root:

```powershell
npm start
```

or:

```powershell
npm run dev
```

Then open in your browser:

```text
http://127.0.0.1:8000
```

To use a different port in PowerShell:

```powershell
$env:PORT=8010; npm start
```

The equivalent command without npm is:

```powershell
node scripts/serve.mjs
```

## Regenerate clean-resource metadata

`showcase/clean_resource` is the stable, hand-curated resource folder. The metadata script scans that folder and does not rewrite PNG files.

If you add, rename, delete, or edit files in `showcase/clean_resource`, regenerate the manifest, clean-resource map, and audit with:

```powershell
python scripts/build_clean_resources.py
```

## Structure

```text
index.html              App shell
src/styles/app.css      Product UI styling
src/data/generated/*    Resource manifest generated from showcase/clean_resource
src/core/export.js      Browser download and PNG blob helpers
src/core/resourceRenderer.js
                        Role-aware proportions, material, outline, and lighting renderer
src/ui/app.js           Generator UI, playback, zoom, overview, and ZIP export workflow
scripts/build_resource_reference.py
                        Source-sheet scanner and color-role manifest builder
scripts/build_clean_resources.py
                        Clean-resource scanner that writes generated metadata
scripts/serve.mjs       Dependency-free local dev server
showcase/clean-resource-map.md
                        Human-readable canonical clean-role map
showcase/clean_resource
                        Stable hand-curated source PNGs used by the app
```

## Current Scope

- Source resources are authoritative; old showcase gifs are not used.
- Native mixed frame sizes are preserved for slicing instead of forced into 32x32.
- Every sliced frame is bottom-centered into a normalized 96x96 output canvas.
- Most core motions are 48x48; larger actions stay 64x64, 80x64, 96x48, etc. before normalization.
- The obsolete `showcase/generated32` crop path was removed.
- The app groups all resource animations in the top-left selector.
- Animation ordering is semantic: Idle, Move, Actions, Attack, Damage, Interaction, then Misc. The same ordering is used for the all-animations overview and ZIP atlas/manifest.
- `Play`, `Prev`, and `Next` step through the native frames in the frame editing view.
- `Frame + Sheet`, `Sheet Overview`, and `All Animations` switch between animated editing and non-animated sheet overviews.
- Frame, animation-sheet, and atlas canvases keep independent zoom levels. The zoom target selector and mouse-wheel-over-canvas zoom update only the active canvas.
- Preview backgrounds can switch between tiles, white, and black for readability; ZIP export still writes transparent PNGs.
- `Anchor frames to bottom` optionally shifts each rendered frame so the visible sprite bounds touch the bottom of the 96x96 canvas. Export manifests include per-frame `bottomAnchor` data with baseline, shift, and pre-anchor bounds.
- `Material render` applies palettes, per-module color tuning, lighting, outlines, and role transforms.
- Resource control-color brightness is ignored in material render by default. Source rig colors classify modules; generated lighting/shading controls own the final material tones, so Jump/Dash source color variants do not create palette mismatches.
- Every rendered frame derives a `headPose` with `angleDeg`, turn label, center, radius, and confidence. Eyes use that rotated local head coordinate system so rolls, air spins, jumps, slides, and other head-tilted motions place accessories from the same pose metadata exported in the manifest.
- Accessories are currently limited to generated eye variants. Hair, beard, cape, and cloth motion experiments were removed from the active code and should be reintroduced only after a new dedicated design pass.
- Beta weapon replacement can suppress source weapon/smear pixels and draw formula one-handed weapons such as hammer, axe, club, and spear. The replacement derives its anchor and rotation from the source weapon or attack smear axis so swing/stab frames keep the original motion direction.
- Palette presets are grouped into character presets, reference palettes, custom colors, color ramps, and large palettes.
- Large and reference palettes show their full swatch sets, including palettes with more than 16 colors.
- `Custom free colors` opens the per-module color picker workflow directly.
- `Source-colored rig` shows transformed source colors.
- `Role mask` remaps pixels to semantic roles for development checks.
- Proportion controls can scale arm/leg length, thickness, head size, torso size, weapon length/thickness, and smear length/thickness.
- Proportion sliders show a small standard marker for the default value and include a proportions-only reset.
- Limb and weapon length use attachment-aware point-cloud transforms with gap fill, then fit the transformed frame back into the 96x96 output envelope before clamping.
- Lengthened limbs are repaired as transformed color areas by connecting neighboring source pixels after scaling, then filling small one-pixel holes. This avoids streaks from the old limb position.
- Module toggles can hide/show major semantic body parts, weapons, and smears independently.
- Weapons and smears are separated semantic roles with explicit source-color mapping. Unknown colors no longer fall back to `weapon`; non-weapon sheets keep purple control colors as arms, while hit/slide/trail colors map to `smear`.
- Source/contact shadow pixels are classified as `shadow` and hidden by default, including the dark Dash contact color `#3d525c`.
- Accessory dropdowns add generated eye variants anchored to the frame's head bounds.
- Fine tune module colors lets each semantic module override the selected palette from clickable full-palette swatches first, with the color wheel kept as a custom-color fallback.
- Skeleton joint/bone inspection is no longer exposed in the UI; the app stays focused on generator controls.
- Outline modes include off, silhouette, limbs, modules, and separation, with separate targets for body parts, weapons, and smears.
- Lighting modes include off, banded, soft, toon AO, and depth bias with strength/direction controls.
- The outline menu includes a pixel-perfect mode that uses single-pixel cardinal neighbors to avoid diagonal doubles and thick outline growth.
- Frame timing is editable per frame; defaults lengthen common key poses such as idle holds, attack anticipation/recovery, and action endpoints.
- ZIP export downloads `atlas.png`, selected PNG sheets in `animations/`, a `manifest.json` that maps exported animations into the atlas, and a reloadable `settings.json` preset for generator controls.
- `Import Settings` accepts the exported `settings.json` and restores render controls, module toggles, accessories, colors, frame timing, favorites, export selection, preview background, selected animation, frame, view mode, and zooms. Exported PNGs remain transparent regardless of imported preview background.
- Confirmed role mapping: green is back/far arm; magenta is front/near arm; non-rig combat colors are split into weapon and smear/effect roles.
