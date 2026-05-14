# Spritemaster Resource Map

Generated from `showcase/resources` by `python scripts/build_resource_reference.py`.

## Summary

- Source PNG files: 42
- Animation records: 42
- Non-empty frames: 311
- Unique opaque colors: 74
- Generator target: `normalized-96x96`
- Normalized output frame: `96x96`
- Largest native source cell: `96x64`
- All source cells fit output: `True`

## Core Color Coding

### Head / skull (`head`)

Round head control volume. This is the anchor for face/hair/helmet layers.

Dominant colors: `#5fcde4` (14944), `#5fb4d9` (187), `#6e8b99` (3)

### Torso / hips (`torso`)

Main body mass and hip/root volume. Body motion starts here, then limbs follow.

Dominant colors: `#df7126` (6193), `#b35b20` (4915), `#c46423` (2754), `#b59428` (18), `#ff822e` (12), `#a8551e` (4)

### Back arm (`back_arm`)

Far-side arm chain. It is drawn behind torso/near limbs.

Dominant colors: `#6abe30` (7854), `#99e550` (2606), `#69ad31` (250), `#61ab2c` (37)

### Front arm (`front_arm`)

Near-side arm chain. It is drawn in front and drives hand/equipment placement.

Dominant colors: `#951799` (3497), `#af1ab2` (1298), `#76428a` (389), `#9c304d` (301), `#674085` (179), `#a3608f` (172), `#643875` (57), `#935c89` (54)

### Front leg (`front_leg`)

Near-side leg chain. In these source sprites it is the bright yellow limb.

Dominant colors: `#d1cc60` (8181), `#fbf236` (5595), `#c4bf5a` (212), `#f0e54a` (12)

### Back leg (`back_leg`)

Far-side leg chain. In these source sprites it is the red limb.

Dominant colors: `#ce5050` (4026), `#ac3232` (3470), `#d95763` (2272), `#bd4a4a` (172), `#b04853` (105), `#b34747` (68), `#b84d4d` (1)

### Ground/contact shadow (`shadow`)

Floor contact and dark guide pixels; not a body module.

Dominant colors: `#3d525c` (32)

### White guide / effect (`white_guide`)

White guide/effect pixels in some source sheets; not part of the colored limb rig.

Dominant colors: none detected.

### Weapon (`weapon`)

Held weapons and combat props separated from body limbs and motion smears.

Dominant colors: `#f065c4` (1216), `#a3608f` (744), `#fb8aff` (702), `#847e87` (390), `#bf6fa7` (93), `#ae1db3` (29), `#fffbb7` (2)

### Smear / effect (`smear`)

Motion smears, trails, pale guide effects, and attack arcs separated from held weapons.

Dominant colors: `#d77bba` (3145), `#f092d4` (2846), `#f7a3e0` (818), `#f9abff` (331), `#fdd9ff` (251), `#dbe3cf` (181), `#f098f5` (173), `#cdd4c3` (127)

## Native Frame Policy

Use the source cell size per animation as the authoritative slicing contract.
Do not use the obsolete generated32 crop path.
After slicing, place each frame bottom-centered into the normalized `96x96` output canvas.
Most locomotion and traversal sheets are `48x48`; several combat/action sheets intentionally use larger native cells for weapon reach, anticipation, or follow-through.

## Animation Sheets

- `Air Spin` -> `showcase/resources/Air Spin/player air spin 48x48.png`: 6 frames, 48x48 source cells, 6 cols x 1 rows
- `Climb (facing back of player)` -> `showcase/resources/Climb (facing back of player)/player climb-back 48x48.png`: 4 frames, 48x48 source cells, 4 cols x 1 rows
- `Climb (facing side of player) / old climb` -> `showcase/resources/Climb (facing side of player)/old climb/Player Side-Climb 48x48.png`: 4 frames, 48x48 source cells, 4 cols x 1 rows
- `Climb (facing side of player)` -> `showcase/resources/Climb (facing side of player)/Player Side-Climb 48x48.png`: 4 frames, 48x48 source cells, 4 cols x 1 rows
- `Crouch-Idle` -> `showcase/resources/Crouch-Idle/Player Crouch-Idle 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Crouch-Walk` -> `showcase/resources/Crouch-Walk/player crouch-walk 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Dash` -> `showcase/resources/Dash/dash.png`: 9 frames, 48x48 source cells, 9 cols x 1 rows
- `Death` -> `showcase/resources/Death/Player Death 64x64.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Hurt-Damaged` -> `showcase/resources/Hurt-Damaged/Player Hurt 48x48.png`: 4 frames, 48x48 source cells, 4 cols x 1 rows
- `Idle` -> `showcase/resources/Idle/Player Idle 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Jump` -> `showcase/resources/Jump/player jump 48x48.png`: 3 frames, 48x48 source cells, 3 cols x 1 rows
- `Jump 6f 1` -> `showcase/resources/Jump/player jump left 48x48-sheet.png`: 6 frames, 48x48 source cells, 6 cols x 1 rows
- `Jump 6f 2` -> `showcase/resources/Jump/player new jump 48x48.png`: 6 frames, 48x48 source cells, 6 cols x 1 rows
- `Katana Air Attack` -> `showcase/resources/Katana Air Attack/player katana air attack (upper body) 80x64.png`: 9 frames, 80x64 source cells, 9 cols x 1 rows
- `Katana Attack-Sheathe` -> `showcase/resources/Katana Attack-Sheathe/player katana attack-sheathe 80x64.png`: 10 frames, 80x64 source cells, 10 cols x 1 rows
- `Katana Continuous Attack` -> `showcase/resources/Katana Continuous Attack/player katana continuous attack 80x64.png`: 9 frames, 80x64 source cells, 9 cols x 1 rows
- `Katana Run` -> `showcase/resources/Katana Run/player katana run 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Katana Run Attack` -> `showcase/resources/Katana Run Attack/player katana running attack (upper body).png`: 10 frames, 64x64 source cells, 10 cols x 1 rows
- `Katana walk` -> `showcase/resources/Katana walk/katana walk.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Land` -> `showcase/resources/Land/player land 48x48.png`: 9 frames, 48x48 source cells, 9 cols x 1 rows
- `Ledge Grab-Climb` -> `showcase/resources/Ledge Grab-Climb/player ledge climb 48x48.png`: 5 frames, 48x48 source cells, 5 cols x 1 rows
- `Pull` -> `showcase/resources/Pull/Player Pull 48x48.png`: 6 frames, 48x48 source cells, 6 cols x 1 rows
- `Punch` -> `showcase/resources/Punch/Player Punch 64x64.png`: 8 frames, 64x64 source cells, 8 cols x 1 rows
- `Punch Cross` -> `showcase/resources/Punch Cross/Player Punch Cross 64x64.png`: 7 frames, 64x64 source cells, 7 cols x 1 rows
- `Punch Jab` -> `showcase/resources/Punch Jab/Player Jab 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Push` -> `showcase/resources/Push/player push 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `PushPull (idle state)` -> `showcase/resources/PushPull (idle state)/player push idle 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Roll` -> `showcase/resources/Roll/Player Roll 48x48.png`: 7 frames, 48x48 source cells, 7 cols x 1 rows
- `Run` -> `showcase/resources/Run/player run 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Shooting (running and aiming)` -> `showcase/resources/Shooting (running and aiming)/Player Running Aiming 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Shooting (running and aiming)` -> `showcase/resources/Shooting (running and aiming)/Player Running Shooting 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Shooting (two-handed)` -> `showcase/resources/Shooting (two-handed)/player shoot 2H 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Slide` -> `showcase/resources/Slide/Player Slide 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Sword Attack` -> `showcase/resources/Sword Attack/player sword atk 64x64.png`: 6 frames, 64x64 source cells, 6 cols x 1 rows
- `Sword Idle` -> `showcase/resources/Sword Idle/Player Sword Idle 48x48.png`: 10 frames, 48x48 source cells, 10 cols x 1 rows
- `Sword Run` -> `showcase/resources/Sword Run/Player Sword Run 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Sword Stab` -> `showcase/resources/Sword Stab/Player Sword Stab 96x48.png`: 7 frames, 96x48 source cells, 7 cols x 1 rows
- `Walk` -> `showcase/resources/Walk/PlayerWalk 48x48.png`: 8 frames, 48x48 source cells, 8 cols x 1 rows
- `Wall Land` -> `showcase/resources/Wall Land/Player Wall Land (left) 48x48.png`: 6 frames, 48x48 source cells, 6 cols x 1 rows
- `Wall Land` -> `showcase/resources/Wall Land/player wall land 48x48.png`: 6 frames, 48x48 source cells, 6 cols x 1 rows
- `Wall Slide` -> `showcase/resources/Wall Slide/player wall slide (left) 48x48.png`: 3 frames, 48x48 source cells, 3 cols x 1 rows
- `Wall Slide` -> `showcase/resources/Wall Slide/player wall slide 48x48.png`: 3 frames, 48x48 source cells, 3 cols x 1 rows
