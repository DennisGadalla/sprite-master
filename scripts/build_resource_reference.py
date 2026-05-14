from __future__ import annotations

import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
RESOURCE_ROOT = ROOT / "showcase" / "resources"
OUT_DIR = ROOT / "src" / "data" / "generated"
QA_DIR = ROOT / "qa_screenshots"
OUTPUT_FRAME = (96, 96)

FRAME_HINT_RE = re.compile(r"(\d{2,3})x(\d{2,3})", re.IGNORECASE)
FRAME_CANDIDATES = [(48, 48), (64, 64), (80, 64), (60, 64), (96, 48), (80, 48), (96, 64), (32, 32)]

ROLE_RULES = [
    {
        "role": "head",
        "label": "Head / skull",
        "family": "cyan",
        "description": "Round head control volume. This is the anchor for face/hair/helmet layers.",
        "hue": (165, 205),
        "sat_min": 0.25,
        "value_min": 0.45,
    },
    {
        "role": "torso",
        "label": "Torso / hips",
        "family": "orange",
        "description": "Main body mass and hip/root volume. Body motion starts here, then limbs follow.",
        "hue": (15, 55),
        "sat_min": 0.35,
        "value_min": 0.25,
    },
    {
        "role": "back_arm",
        "label": "Back arm",
        "family": "green",
        "description": "Far-side arm chain. It is drawn behind torso/near limbs.",
        "hue": (75, 145),
        "sat_min": 0.35,
        "value_min": 0.25,
    },
    {
        "role": "front_arm",
        "label": "Front arm",
        "family": "magenta",
        "description": "Near-side arm chain. It is drawn in front and drives hand/equipment placement.",
        "hue": (285, 345),
        "sat_min": 0.3,
        "value_min": 0.22,
    },
    {
        "role": "front_leg",
        "label": "Front leg",
        "family": "yellow",
        "description": "Near-side leg chain. In these source sprites it is the bright yellow limb.",
        "hue": (48, 72),
        "sat_min": 0.45,
        "value_min": 0.35,
    },
    {
        "role": "back_leg",
        "label": "Back leg",
        "family": "red",
        "description": "Far-side leg chain. In these source sprites it is the red limb.",
        "hue": (350, 20),
        "sat_min": 0.35,
        "value_min": 0.2,
    },
    {
        "role": "shadow",
        "label": "Ground/contact shadow",
        "family": "dark-neutral",
        "description": "Floor contact and dark guide pixels; not a body module.",
        "hue": None,
        "sat_max": 0.35,
        "value_max": 0.28,
    },
    {
        "role": "white_guide",
        "label": "White guide / effect",
        "family": "white",
        "description": "White guide/effect pixels in some source sheets; not part of the colored limb rig.",
        "hue": None,
        "sat_max": 0.18,
        "value_min": 0.72,
    },
]

DERIVED_ROLE_INFO = {
    "weapon": {
        "label": "Weapon",
        "family": "weapon-neutral",
        "description": "Held weapons and combat props separated from body limbs and motion smears.",
    },
    "smear": {
        "label": "Smear / effect",
        "family": "motion-effect",
        "description": "Motion smears, trails, pale guide effects, and attack arcs separated from held weapons.",
    },
}

SMEAR_SOURCE_COLORS = {
    "#b2b8b1",
    "#b9c0b7",
    "#bac0b8",
    "#c9d0c4",
    "#cdd4c3",
    "#cfd6c3",
    "#d5f2f8",
    "#d77bba",
    "#d8eec9",
    "#dbe3cf",
    "#e0e7d6",
    "#e4f8d1",
    "#e7f0da",
    "#e9c9c9",
    "#eac3eb",
    "#ebd4c5",
    "#edcef0",
    "#eea6f5",
    "#f092d4",
    "#f098f5",
    "#f2d1d1",
    "#f3f1d5",
    "#f3fbe4",
    "#f6dac6",
    "#f7a3e0",
    "#f9abff",
    "#fbc2ff",
    "#fdd9ff",
    "#fdfbca",
    "#5f616e",
    "#7f8389",
    "#a7ada8",
    "#ffffff",
}

FRONT_ARM_SOURCE_COLORS = {
    "#643875",
    "#674085",
    "#76428a",
    "#935c89",
    "#951799",
    "#9c304d",
    "#a3608f",
    "#ad54b0",
    "#af1ab2",
}

BACK_ARM_SOURCE_COLORS = {
    "#61ab2c",
    "#69ad31",
    "#6abe30",
    "#99e550",
}

WEAPON_SOURCE_COLORS = {
    "#847e87",
    "#ae1db3",
    "#bf6fa7",
    "#f065c4",
    "#fb8aff",
    "#fffbb7",
}

WEAPON_CONTEXT_COLORS = {
    "#a3608f",
}

SHADOW_SOURCE_COLORS = {
    "#3d525c",
}


@dataclass(frozen=True)
class FrameSpec:
    width: int
    height: int


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    QA_DIR.mkdir(parents=True, exist_ok=True)

    pngs = sorted(path for path in RESOURCE_ROOT.rglob("*.png") if path.is_file())
    manifest = {
        "schema": "spritemaster.resource_manifest.v1",
        "sourceRoot": "showcase/resources",
        "canvasTarget": "normalized-96x96",
        "outputFrame": {
            "width": OUTPUT_FRAME[0],
            "height": OUTPUT_FRAME[1],
            "anchor": "bottom-center",
            "policy": "Slice source sheets at their native cell size, then place each cell bottom-centered into a fixed 96x96 output canvas. Do not crop to 32x32.",
        },
        "sourceFramePolicy": "Use original resource frames as authoritative for slicing. Most base motions are 48x48; attacks and extended actions use larger native cells such as 64x64, 80x64, and 96x48. The viewer/export canvas is normalized to 96x96 after slicing.",
        "animations": [],
    }
    global_colors: Counter[str] = Counter()
    role_colors: dict[str, Counter[str]] = defaultdict(Counter)

    contact_items = []
    for path in pngs:
        record, image = analyze_sheet(path)
        manifest["animations"].append(record)
        contact_items.append((record, image))
        for color, count in record["colorHistogram"].items():
            global_colors[color] += count
        for frame in record["frames"]:
            for role, count in frame["rolePixels"].items():
                for color, c in frame["roleColors"].get(role, {}).items():
                    role_colors[role][color] += c

    color_map = build_color_map(global_colors, role_colors)
    manifest["colorMap"] = color_map
    manifest["summary"] = {
        "resourceFiles": len(pngs),
        "animationRecords": len(manifest["animations"]),
        "totalFrames": sum(item["frameCount"] for item in manifest["animations"]),
        "uniqueOpaqueColors": len(global_colors),
        "maxSourceFrame": {
            "width": max((item["frameWidth"] for item in manifest["animations"]), default=0),
            "height": max((item["frameHeight"] for item in manifest["animations"]), default=0),
        },
        "allSourceFramesFitOutput": all(
            item["frameWidth"] <= OUTPUT_FRAME[0] and item["frameHeight"] <= OUTPUT_FRAME[1]
            for item in manifest["animations"]
        ),
        "roles": [role["role"] for role in color_map["roles"]],
    }

    write_json(OUT_DIR / "resourceManifest.json", manifest)
    write_js(OUT_DIR / "resourceManifest.js", manifest)
    write_markdown(ROOT / "showcase" / "resources-map.md", manifest)
    write_contact_sheet(QA_DIR / "resource-animation-contact-sheet.png", contact_items)

    print(json.dumps(manifest["summary"], indent=2))


def analyze_sheet(path: Path) -> tuple[dict, Image.Image]:
    image = Image.open(path).convert("RGBA")
    frame = infer_frame_spec(path, image)
    cols = max(1, math.ceil(image.width / frame.width))
    rows = max(1, math.ceil(image.height / frame.height))
    frames = []
    sheet_colors: Counter[str] = Counter()

    for row in range(rows):
        for col in range(cols):
            x = col * frame.width
            y = row * frame.height
            cell = image.crop((x, y, x + frame.width, y + frame.height))
            frame_record = analyze_frame(cell, len(frames), x, y, path)
            if not frame_record["empty"]:
                frames.append(frame_record)
                sheet_colors.update(frame_record["colorHistogram"])

    normalized = normalized_contract(frame)
    for frame_record in frames:
        frame_record["outputX"] = normalized["offsetX"]
        frame_record["outputY"] = normalized["offsetY"]
        frame_record["outputBounds"] = normalize_bounds(frame_record["bounds"], normalized)

    rel = path.relative_to(ROOT).as_posix()
    animation_name = resource_animation_name(path)
    record = {
        "id": make_id(path.relative_to(RESOURCE_ROOT).with_suffix("").as_posix()),
        "name": animation_name,
        "folder": path.parent.relative_to(RESOURCE_ROOT).as_posix(),
        "file": path.name,
        "path": rel,
        "sourceWidth": image.width,
        "sourceHeight": image.height,
        "frameWidth": frame.width,
        "frameHeight": frame.height,
        "normalized": normalized,
        "cols": cols,
        "rows": rows,
        "frameCount": len(frames),
        "colorHistogram": dict(sorted(sheet_colors.items(), key=lambda item: (-item[1], item[0]))),
        "frames": frames,
    }
    return record, image


def normalized_contract(frame: FrameSpec) -> dict:
    width, height = OUTPUT_FRAME
    return {
        "width": width,
        "height": height,
        "offsetX": (width - frame.width) // 2,
        "offsetY": height - frame.height,
        "anchor": "bottom-center",
        "fits": frame.width <= width and frame.height <= height,
    }


def normalize_bounds(bounds: dict | None, normalized: dict) -> dict | None:
    if not bounds:
        return None
    return {
        "x": bounds["x"] + normalized["offsetX"],
        "y": bounds["y"] + normalized["offsetY"],
        "w": bounds["w"],
        "h": bounds["h"],
    }


def analyze_frame(cell: Image.Image, index: int, source_x: int, source_y: int, path: Path) -> dict:
    pixels = cell.load()
    hist: Counter[str] = Counter()
    role_pixels: Counter[str] = Counter()
    role_color_hist: dict[str, Counter[str]] = defaultdict(Counter)
    min_x, min_y = cell.width, cell.height
    max_x, max_y = -1, -1

    for y in range(cell.height):
        for x in range(cell.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            color = f"#{r:02x}{g:02x}{b:02x}"
            hist[color] += 1
            role = classify_source_color(color, path)
            role_pixels[role] += 1
            role_color_hist[role][color] += 1
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

    empty = max_x < 0
    return {
        "index": index,
        "sourceX": source_x,
        "sourceY": source_y,
        "empty": empty,
        "bounds": None if empty else {"x": min_x, "y": min_y, "w": max_x - min_x + 1, "h": max_y - min_y + 1},
        "colorHistogram": dict(sorted(hist.items(), key=lambda item: (-item[1], item[0]))),
        "rolePixels": dict(sorted(role_pixels.items())),
        "roleColors": {role: dict(colors.most_common(8)) for role, colors in sorted(role_color_hist.items())},
    }


def infer_frame_spec(path: Path, image: Image.Image) -> FrameSpec:
    hints = FRAME_HINT_RE.findall(path.name)
    if hints:
        w, h = map(int, hints[-1])
        if image.width % w == 0 and image.height % h == 0:
            return FrameSpec(w, h)
        if image.width > w and image.height == h:
            return FrameSpec(w, h)

    folder_hints = FRAME_HINT_RE.findall(str(path.parent))
    if folder_hints:
        w, h = map(int, folder_hints[-1])
        if image.width % w == 0 and image.height % h == 0:
            return FrameSpec(w, h)
        if image.width > w and image.height == h:
            return FrameSpec(w, h)

    if image.height in (48, 64, 96) and image.width % image.height == 0:
        return FrameSpec(image.height, image.height)

    possible = [
        FrameSpec(w, h)
        for w, h in FRAME_CANDIDATES
        if image.width % w == 0 and image.height % h == 0
    ]
    if possible:
        return min(possible, key=lambda spec: (image.height // spec.height, abs(spec.height - image.height), spec.width * spec.height))

    return FrameSpec(image.width, image.height)


def classify_color(r: int, g: int, b: int) -> str:
    h, s, v = rgb_to_hsv_degrees(r, g, b)
    for rule in ROLE_RULES:
        if matches_rule(h, s, v, rule):
            return rule["role"]
    return "other"


def classify_source_color(color: str, path: Path | None) -> str:
    clean = color.lower()
    base_role = classify_hex_base(clean)
    if clean in SHADOW_SOURCE_COLORS:
        return "shadow"
    if clean in SMEAR_SOURCE_COLORS or base_role == "white_guide":
        return "smear"
    if clean in WEAPON_SOURCE_COLORS:
        return "weapon"
    if path and is_weapon_sheet(path) and clean in WEAPON_CONTEXT_COLORS:
        return "weapon"
    if clean in FRONT_ARM_SOURCE_COLORS:
        return "front_arm"
    if clean in BACK_ARM_SOURCE_COLORS:
        return "back_arm"
    return base_role


def is_weapon_sheet(path: Path) -> bool:
    try:
        parts = path.relative_to(RESOURCE_ROOT).parts
    except ValueError:
        parts = path.parts
    haystack = " ".join(parts).lower()
    return bool(re.search(r"sword|katana|shoot|stab|attack", haystack))


def matches_rule(h: float, s: float, v: float, rule: dict) -> bool:
    if "sat_min" in rule and s < rule["sat_min"]:
        return False
    if "sat_max" in rule and s > rule["sat_max"]:
        return False
    if "value_min" in rule and v < rule["value_min"]:
        return False
    if "value_max" in rule and v > rule["value_max"]:
        return False
    hue_range = rule.get("hue")
    if hue_range is None:
        return True
    start, end = hue_range
    if start <= end:
        return start <= h <= end
    return h >= start or h <= end


def rgb_to_hsv_degrees(r: int, g: int, b: int) -> tuple[float, float, float]:
    nr, ng, nb = r / 255, g / 255, b / 255
    mx = max(nr, ng, nb)
    mn = min(nr, ng, nb)
    delta = mx - mn
    if delta == 0:
        h = 0.0
    elif mx == nr:
        h = (60 * ((ng - nb) / delta) + 360) % 360
    elif mx == ng:
        h = 60 * ((nb - nr) / delta + 2)
    else:
        h = 60 * ((nr - ng) / delta + 4)
    s = 0 if mx == 0 else delta / mx
    return h, s, mx


def build_color_map(global_colors: Counter[str], role_colors: dict[str, Counter[str]]) -> dict:
    roles = []
    for rule in ROLE_RULES:
        role = rule["role"]
        counter = role_colors.get(role, Counter())
        roles.append({
            "role": role,
            "label": rule["label"],
            "family": rule["family"],
            "description": rule["description"],
            "totalPixels": sum(counter.values()),
            "colors": [{"hex": color, "pixels": count} for color, count in counter.most_common(12)],
        })
    for role, info in DERIVED_ROLE_INFO.items():
        counter = role_colors.get(role, Counter())
        roles.append({
            "role": role,
            "label": info["label"],
            "family": info["family"],
            "description": info["description"],
            "totalPixels": sum(counter.values()),
            "colors": [{"hex": color, "pixels": count} for color, count in counter.most_common(12)],
        })
    other_counter = role_colors.get("other", Counter())
    if other_counter:
        roles.append({
            "role": "other",
            "label": "Other / unclassified",
            "family": "misc",
            "description": "Pixels outside the known core limb, weapon, and smear/effect role codes.",
            "totalPixels": sum(other_counter.values()),
            "colors": [{"hex": color, "pixels": count} for color, count in other_counter.most_common(12)],
        })
    return {
        "classification": "HSV threshold map generated from source resource PNGs",
        "roles": roles,
        "colorToRole": {color: classify_source_color(color, None) for color in sorted(global_colors)},
        "globalColors": [{"hex": color, "pixels": count} for color, count in global_colors.most_common(40)],
    }


def classify_hex(color: str) -> str:
    return classify_source_color(color, None)


def classify_hex_base(color: str) -> str:
    clean = color.lstrip("#")
    return classify_color(int(clean[0:2], 16), int(clean[2:4], 16), int(clean[4:6], 16))


def resource_animation_name(path: Path) -> str:
    folder = path.parent.relative_to(RESOURCE_ROOT).parts
    if folder and folder[-1].lower() == "jump":
        stem = path.stem.lower()
        if "jump left" in stem:
            return "Jump 6f 1"
        if "new jump" in stem:
            return "Jump 6f 2"
    if folder:
        return " / ".join(folder)
    return path.stem


def make_id(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def write_js(path: Path, data: dict) -> None:
    path.write_text(
        "export const RESOURCE_MANIFEST = "
        + json.dumps(data, indent=2)
        + ";\n",
        encoding="utf-8",
    )


def write_markdown(path: Path, manifest: dict) -> None:
    lines = [
        "# Spritemaster Resource Map",
        "",
        "Generated from `showcase/resources` by `python scripts/build_resource_reference.py`.",
        "",
        "## Summary",
        "",
        f"- Source PNG files: {manifest['summary']['resourceFiles']}",
        f"- Animation records: {manifest['summary']['animationRecords']}",
        f"- Non-empty frames: {manifest['summary']['totalFrames']}",
        f"- Unique opaque colors: {manifest['summary']['uniqueOpaqueColors']}",
        f"- Generator target: `{manifest['canvasTarget']}`",
        f"- Normalized output frame: `{manifest['outputFrame']['width']}x{manifest['outputFrame']['height']}`",
        f"- Largest native source cell: `{manifest['summary']['maxSourceFrame']['width']}x{manifest['summary']['maxSourceFrame']['height']}`",
        f"- All source cells fit output: `{manifest['summary']['allSourceFramesFitOutput']}`",
        "",
        "## Core Color Coding",
        "",
    ]
    for role in manifest["colorMap"]["roles"]:
        lines.append(f"### {role['label']} (`{role['role']}`)")
        lines.append("")
        lines.append(role["description"])
        lines.append("")
        if role["colors"]:
            swatches = ", ".join(f"`{item['hex']}` ({item['pixels']})" for item in role["colors"][:8])
            lines.append(f"Dominant colors: {swatches}")
        else:
            lines.append("Dominant colors: none detected.")
        lines.append("")

    lines.extend([
        "## Native Frame Policy",
        "",
        "Use the source cell size per animation as the authoritative slicing contract.",
        "Do not use the obsolete generated32 crop path.",
        "After slicing, place each frame bottom-centered into the normalized `96x96` output canvas.",
        "Most locomotion and traversal sheets are `48x48`; several combat/action sheets intentionally use larger native cells for weapon reach, anticipation, or follow-through.",
        "",
        "## Animation Sheets",
        ""
    ])
    for record in manifest["animations"]:
        lines.append(
            f"- `{record['name']}` -> `{record['path']}`: "
            f"{record['frameCount']} frames, {record['frameWidth']}x{record['frameHeight']} source cells, "
            f"{record['cols']} cols x {record['rows']} rows"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_contact_sheet(path: Path, items: list[tuple[dict, Image.Image]]) -> None:
    thumb = 64
    label_h = 26
    cols = 6
    rows = math.ceil(len(items) / cols)
    sheet = Image.new("RGBA", (cols * (thumb + 16) + 16, rows * (thumb + label_h + 16) + 16), "#162024ff")
    draw = ImageDraw.Draw(sheet)
    try:
        font = ImageFont.truetype("arial.ttf", 10)
    except OSError:
        font = ImageFont.load_default()

    for index, (record, image) in enumerate(items):
        col = index % cols
        row = index // cols
        x = 8 + col * (thumb + 16)
        y = 8 + row * (thumb + label_h + 16)
        first = normalized_preview_cell(image, record)
        preview = first.resize((thumb, thumb), Image.Resampling.NEAREST)
        draw.rectangle((x - 1, y - 1, x + thumb, y + thumb), outline="#5b767d")
        sheet.alpha_composite(preview, (x, y))
        label = record["name"].split("/")[-1].strip()
        draw.text((x, y + thumb + 3), label[:18], fill="#edf4f4", font=font)
        draw.text((x, y + thumb + 14), f"{record['frameCount']}f {record['frameWidth']}x{record['frameHeight']} -> 96", fill="#9dadad", font=font)
    sheet.save(path)


def first_non_empty_cell(image: Image.Image, record: dict) -> Image.Image:
    if not record["frames"]:
        return Image.new("RGBA", (record["frameWidth"], record["frameHeight"]), (0, 0, 0, 0))
    frame = record["frames"][0]
    return image.crop((
        frame["sourceX"],
        frame["sourceY"],
        frame["sourceX"] + record["frameWidth"],
        frame["sourceY"] + record["frameHeight"],
    ))


def normalized_preview_cell(image: Image.Image, record: dict) -> Image.Image:
    source = first_non_empty_cell(image, record)
    normalized = record["normalized"]
    cell = Image.new("RGBA", (normalized["width"], normalized["height"]), (0, 0, 0, 0))
    cell.alpha_composite(source, (normalized["offsetX"], normalized["offsetY"]))
    return cell


if __name__ == "__main__":
    main()
