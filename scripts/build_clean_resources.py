from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image

from build_resource_reference import (
    OUTPUT_FRAME,
    ROOT,
    ROLE_RULES,
    DERIVED_ROLE_INFO,
    infer_frame_spec,
    make_id,
    normalize_bounds,
    normalized_contract,
    resource_animation_name,
    write_js,
    write_json,
)


LEGACY_RESOURCE_ROOT = ROOT / "showcase" / "resources"
CLEAN_ROOT = ROOT / "showcase" / "clean_resource"
OUT_DIR = ROOT / "src" / "data" / "generated"
QA_DIR = ROOT / "qa_screenshots"

CLEAN_ROLE_COLORS = {
    "head": "#5fcde4",
    "torso": "#df7126",
    "back_arm": "#6abe30",
    "hand_back": "#99e550",
    "front_arm": "#f065c4",
    "hand_front": "#af1ab2",
    "front_leg": "#d1cc60",
    "foot_front": "#fbf236",
    "back_leg": "#d95763",
    "foot_back": "#ac3232",
    "weapon": "#6d8cff",
    "smear": "#fdd9ff",
    "white_guide": "#fdfbca",
    "shadow": "#3d525c",
    "other": "#ff2a6d",
}

DISTAL_ROLE_INFO = {
    "hand_back": {
        "label": "Back hand",
        "family": "limb_distal",
        "description": "Distal hand pixels attached to the rear arm in the side-scroller rig.",
    },
    "hand_front": {
        "label": "Front hand",
        "family": "limb_distal",
        "description": "Distal hand pixels attached to the visible front arm in the side-scroller rig.",
    },
    "foot_front": {
        "label": "Front foot",
        "family": "limb_distal",
        "description": "Distal foot pixels attached to the visible front leg in the side-scroller rig.",
    },
    "foot_back": {
        "label": "Back foot",
        "family": "limb_distal",
        "description": "Distal foot pixels attached to the rear leg in the side-scroller rig.",
    },
}


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    QA_DIR.mkdir(parents=True, exist_ok=True)
    clean_pngs = collect_clean_pngs(CLEAN_ROOT)
    manifest = analyze_clean_pngs(clean_pngs)
    write_json(OUT_DIR / "resourceManifest.json", manifest)
    write_js(OUT_DIR / "resourceManifest.js", manifest)
    write_clean_map(ROOT / "showcase" / "clean-resource-map.md", manifest)
    write_json(QA_DIR / "resource-clean-audit.json", build_clean_audit(manifest))
    print(json.dumps(manifest["summary"], indent=2))


def collect_clean_pngs(root: Path = CLEAN_ROOT) -> list[Path]:
    pngs = sorted(path for path in root.rglob("*.png") if path.is_file())
    if not pngs:
        raise SystemExit(f"No cleaned resources found in {root.relative_to(ROOT)}.")
    return pngs


def analyze_clean_pngs(paths: list[Path]) -> dict:
    manifest = {
        "schema": "spritemaster.resource_manifest.v1",
        "sourceRoot": "showcase/clean_resource",
        "cleanedResource": True,
        "canvasTarget": "normalized-96x96",
        "outputFrame": {
            "width": OUTPUT_FRAME[0],
            "height": OUTPUT_FRAME[1],
            "anchor": "bottom-center",
            "policy": "Slice cleaned source sheets at their native cell size, then place each cell bottom-centered into a fixed 96x96 output canvas.",
        },
        "sourceFramePolicy": "Hand-curated clean sheets preserve native source cell sizes and use canonical role colors.",
        "animations": [],
    }
    global_colors: Counter[str] = Counter()
    role_colors: dict[str, Counter[str]] = defaultdict(Counter)

    for path in paths:
        record = analyze_clean_sheet(path)
        manifest["animations"].append(record)
        for color, count in record["colorHistogram"].items():
            global_colors[color] += count
        for frame in record["frames"]:
            for role, colors in frame["roleColors"].items():
                for color, count in colors.items():
                    role_colors[role][color] += count

    manifest["colorMap"] = build_clean_color_map(role_colors, global_colors)
    manifest["summary"] = {
        "resourceFiles": len(paths),
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
        "roles": sorted(role for role, counter in role_colors.items() if sum(counter.values()) > 0),
    }
    return manifest


def analyze_clean_sheet(path: Path) -> dict:
    image = Image.open(path).convert("RGBA")
    frame = infer_frame_spec(path, image)
    cols = max(1, -(-image.width // frame.width))
    rows = max(1, -(-image.height // frame.height))
    frames = []
    sheet_colors: Counter[str] = Counter()

    for row in range(rows):
        for col in range(cols):
            x = col * frame.width
            y = row * frame.height
            cell = image.crop((x, y, x + frame.width, y + frame.height))
            frame_record = analyze_clean_frame(cell, len(frames), x, y)
            if not frame_record["empty"]:
                frames.append(frame_record)
                sheet_colors.update(frame_record["colorHistogram"])

    normalized = normalized_contract(frame)
    for frame_record in frames:
        frame_record["outputX"] = normalized["offsetX"]
        frame_record["outputY"] = normalized["offsetY"]
        frame_record["outputBounds"] = normalize_bounds(frame_record["bounds"], normalized)

    rel = path.relative_to(ROOT).as_posix()
    clean_relative = path.relative_to(CLEAN_ROOT).as_posix()
    return {
        "id": make_id(Path(clean_relative).with_suffix("").as_posix()),
        "name": resource_animation_name(LEGACY_RESOURCE_ROOT / clean_relative),
        "folder": str(Path(clean_relative).parent).replace("\\", "/"),
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


def analyze_clean_frame(cell: Image.Image, index: int, source_x: int, source_y: int) -> dict:
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
            role = clean_role_for_color(color)
            hist[color] += 1
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
        "roleColors": {role: dict(colors.most_common()) for role, colors in sorted(role_color_hist.items())},
    }


def build_clean_color_map(role_colors: dict[str, Counter[str]], global_colors: Counter[str]) -> dict:
    roles = []
    role_info = {
        **{rule["role"]: rule for rule in ROLE_RULES},
        **DERIVED_ROLE_INFO,
        **DISTAL_ROLE_INFO,
        "other": {"label": "Other / unclassified", "family": "misc", "description": "Canonical miscellaneous role pixels."},
    }
    for role, color in CLEAN_ROLE_COLORS.items():
        info = role_info.get(role, {"label": role, "family": role, "description": "Canonical clean role."})
        counter = role_colors.get(role, Counter())
        roles.append({
            "role": role,
            "label": info["label"],
            "family": info["family"],
            "description": info["description"],
            "canonicalColor": color,
            "totalPixels": sum(counter.values()),
            "colors": [{"hex": hex_color, "pixels": count} for hex_color, count in counter.most_common()],
        })
    return {
        "classification": "canonical cleaned role-color map generated from hand-curated clean PNGs",
        "cleaned": True,
        "roles": roles,
        "colorToRole": {color: role for role, color in CLEAN_ROLE_COLORS.items()},
        "globalColors": [{"hex": color, "pixels": count} for color, count in global_colors.most_common()],
    }


def build_clean_audit(manifest: dict) -> dict:
    conflicts = []
    for color, role in manifest["colorMap"]["colorToRole"].items():
        conflicts.append({"color": color, "role": role, "roles": {role: 1}})
    low_role_frames = []
    for record in manifest["animations"]:
        if record["frameWidth"] > 64 or is_partial_body_sheet(record):
            continue
        for frame in record["frames"]:
            missing = [role for role in ("head", "torso", "front_leg", "back_leg") if frame["rolePixels"].get(role, 0) < 8]
            if missing:
                low_role_frames.append({
                    "animation": record["id"],
                    "name": record["name"],
                    "frame": frame["index"],
                    "missingOrLowRoles": missing,
                    "rolePixels": frame["rolePixels"],
                })
    return {
        "schema": "spritemaster.clean_resource_audit.v1",
        "sourceRoot": manifest["sourceRoot"],
        "summary": {
            **manifest["summary"],
            "canonicalRoleColors": len(CLEAN_ROLE_COLORS),
            "colorRoleConflicts": 0,
            "framesMissingMajorBodyRoles": len(low_role_frames),
        },
        "canonicalColorMap": manifest["colorMap"]["colorToRole"],
        "framesMissingMajorBodyRoles": low_role_frames,
    }


def write_clean_map(path: Path, manifest: dict) -> None:
    lines = [
        "# Spritemaster Clean Resource Map",
        "",
        "Generated by `python scripts/build_clean_resources.py`.",
        "",
        f"- Clean source root: `{manifest['sourceRoot']}`",
        f"- Resource files: `{manifest['summary']['resourceFiles']}`",
        f"- Frames: `{manifest['summary']['totalFrames']}`",
        f"- Canonical opaque colors: `{manifest['summary']['uniqueOpaqueColors']}`",
        "",
        "## Canonical role colors",
        "",
    ]
    for role, color in CLEAN_ROLE_COLORS.items():
        lines.append(f"- `{role}` -> `{color}`")
    lines.extend(["", "## Animations", ""])
    for record in manifest["animations"]:
        lines.append(f"- `{record['name']}`: `{record['frameCount']}` frames, `{record['frameWidth']}x{record['frameHeight']}`, `{record['path']}`")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def clean_role_for_color(color: str) -> str:
    color = color.lower()
    for role, role_color in CLEAN_ROLE_COLORS.items():
        if color == role_color:
            return role
    return "other"
    return classify_source_color(clean, path)


def is_partial_body_sheet(record: dict) -> bool:
    text = f"{record['name']} {record['file']} {record['folder']}".lower()
    return any(token in text for token in ("upper-body", "shoot", "stab", "wall", "ledge", "climb"))


if __name__ == "__main__":
    main()
