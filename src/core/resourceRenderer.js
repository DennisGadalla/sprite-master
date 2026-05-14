export const ROLE_STYLES = {
  head: { label: "Head", color: "#5fcde4" },
  torso: { label: "Torso", color: "#df7126" },
  back_arm: { label: "Back arm", color: "#6abe30" },
  hand_back: { label: "Back hand", color: "#99e550" },
  front_arm: { label: "Front arm", color: "#f065c4" },
  hand_front: { label: "Front hand", color: "#af1ab2" },
  front_leg: { label: "Front leg", color: "#d1cc60" },
  foot_front: { label: "Front foot", color: "#fbf236" },
  back_leg: { label: "Back leg", color: "#d95763" },
  foot_back: { label: "Back foot", color: "#ac3232" },
  weapon: { label: "Weapon", color: "#6d8cff" },
  smear: { label: "Smear/effect", color: "#fdd9ff" },
  white_guide: { label: "Guide/effect", color: "#fdd9ff" },
  other: { label: "Unclassified", color: "#ff2a6d" },
  shadow: { label: "Shadow", color: "#3d525c" }
};

export const ROLE_ORDER = [
  "shadow",
  "back_leg",
  "foot_back",
  "back_arm",
  "hand_back",
  "torso",
  "head",
  "front_leg",
  "foot_front",
  "front_arm",
  "hand_front",
  "weapon",
  "smear",
  "white_guide",
  "other"
];

export const LIMB_ROLES = ["front_arm", "back_arm", "front_leg", "back_leg", "hand_front", "hand_back", "foot_front", "foot_back"];
export const LENGTH_ROLES = ["front_arm", "back_arm", "front_leg", "back_leg", "weapon", "smear"];
const SIZE_ROLES = ["head", "torso", "hand_front", "hand_back", "foot_front", "foot_back"];
const SHAPED_LIMB_ROLES = ["front_arm", "back_arm", "front_leg", "back_leg", "hand_front", "hand_back", "foot_front", "foot_back"];
const TORSO_LINKED_UPPER_ROLES = ["head", "front_arm", "back_arm", "hand_front", "hand_back"];
const DISTAL_ROLE_PARENT = {
  hand_front: "front_arm",
  hand_back: "back_arm",
  foot_front: "front_leg",
  foot_back: "back_leg"
};
export const DISTAL_LIMB_ROLES = Object.keys(DISTAL_ROLE_PARENT);
const EXPRESSION_SEAM_CONNECTIONS = [
  ["hand_front", "front_arm"],
  ["hand_back", "back_arm"],
  ["foot_front", "front_leg"],
  ["foot_back", "back_leg"],
  ["front_arm", "torso"],
  ["back_arm", "torso"],
  ["front_leg", "torso"],
  ["back_leg", "torso"],
  ["head", "torso"]
];
const CARDINAL_NEIGHBORS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export const MATERIAL_PALETTES = [
  {
    id: "warm-adventurer",
    name: "Warm skin / blue cloth",
    roles: {
      head: ramp("#f2c7a5", "#c88962", "#7a4738", "#241817"),
      front_arm: ramp("#f2c7a5", "#c88962", "#7a4738", "#241817"),
      back_arm: ramp("#d7a07d", "#a96b4d", "#633629", "#1e1514"),
      torso: ramp("#6f87a6", "#40566f", "#243244", "#151b22"),
      front_leg: ramp("#77685d", "#4c413b", "#2a2422", "#151313"),
      back_leg: ramp("#5f5550", "#3d3532", "#211e1d", "#111010"),
      white_guide: ramp("#fbf0ce", "#d7c58d", "#817148", "#2c251a"),
      other: ramp("#cfd6df", "#808996", "#444b57", "#171c22"),
      shadow: ramp("#4e5b63", "#35434c", "#1f2b32", "#11181c")
    }
  },
  {
    id: "deep-skin",
    name: "Deep skin / rust cloth",
    roles: {
      head: ramp("#d09364", "#8d563d", "#4a2b25", "#160f0f"),
      front_arm: ramp("#d09364", "#8d563d", "#4a2b25", "#160f0f"),
      back_arm: ramp("#b57952", "#6f4232", "#3b2320", "#130d0d"),
      torso: ramp("#c96f4a", "#7d342d", "#3f1d21", "#150d10"),
      front_leg: ramp("#465d72", "#27384c", "#172434", "#0d131a"),
      back_leg: ramp("#34495e", "#213246", "#111d2d", "#0b1018"),
      white_guide: ramp("#f1dfad", "#c0a468", "#695531", "#21190f"),
      other: ramp("#cbc3b5", "#827869", "#433d37", "#161412"),
      shadow: ramp("#4b3f3f", "#2f292b", "#1b181b", "#100e10")
    }
  },
  {
    id: "pale-rogue",
    name: "Pale skin / charcoal",
    roles: {
      head: ramp("#ffd7c2", "#d49b82", "#805447", "#25191a"),
      front_arm: ramp("#ffd7c2", "#d49b82", "#805447", "#25191a"),
      back_arm: ramp("#d6a28d", "#a06e5e", "#604039", "#1f1718"),
      torso: ramp("#666a76", "#3a3f4c", "#202631", "#11161d"),
      front_leg: ramp("#4e5664", "#2c3340", "#181f2a", "#0d1117"),
      back_leg: ramp("#414957", "#252d39", "#141b25", "#0a0f15"),
      white_guide: ramp("#f0e6dc", "#bdb0a4", "#675e58", "#201d1b"),
      other: ramp("#ccd1d9", "#7b838f", "#414954", "#141920"),
      shadow: ramp("#49505a", "#2d343e", "#181f28", "#0d1117")
    }
  },
  {
    id: "olive-traveler",
    name: "Olive skin / green gear",
    roles: {
      head: ramp("#d6b38a", "#9a6f4b", "#573a2a", "#191110"),
      front_arm: ramp("#d6b38a", "#9a6f4b", "#573a2a", "#191110"),
      back_arm: ramp("#b58d68", "#745138", "#422a21", "#15100f"),
      torso: ramp("#95a16a", "#566139", "#303820", "#12160f"),
      front_leg: ramp("#6a6252", "#403a31", "#24211d", "#11100f"),
      back_leg: ramp("#5a5448", "#36322c", "#1f1d1a", "#0f0e0d"),
      white_guide: ramp("#e8d7a7", "#b59e61", "#5f4f2c", "#1d170e"),
      other: ramp("#c4c8b0", "#797d66", "#3f4336", "#141711"),
      shadow: ramp("#495243", "#30382d", "#1b211a", "#0d100c")
    }
  },
  {
    id: "steel-violet",
    name: "Steel / violet accent",
    roles: {
      head: ramp("#d5e3ef", "#8fa4b8", "#4a5a70", "#141a22"),
      front_arm: ramp("#d5e3ef", "#8fa4b8", "#4a5a70", "#141a22"),
      back_arm: ramp("#aab9c9", "#68788e", "#39465a", "#111721"),
      torso: ramp("#b17dcc", "#764a9b", "#452663", "#160d20"),
      front_leg: ramp("#7f91ab", "#4b5b73", "#29364a", "#101722"),
      back_leg: ramp("#64748f", "#3e4a60", "#222d3e", "#0d131c"),
      white_guide: ramp("#f3e8ff", "#bd9ad5", "#68437d", "#21132a"),
      other: ramp("#d8dee8", "#8792a2", "#475161", "#151a22"),
      shadow: ramp("#445064", "#293242", "#171e2b", "#0c1119")
    }
  },
  {
    id: "dawnbringer-32",
    name: "DawnBringer 32 role set",
    source: "Lospec DawnBringer 32",
    sourceUrl: "https://lospec.com/palette-list/dawnbringer-32",
    roles: {
      head: ramp("#eec39a", "#d9a066", "#8f563b", "#45283c"),
      front_arm: ramp("#eec39a", "#d9a066", "#8f563b", "#45283c"),
      back_arm: ramp("#d9a066", "#8f563b", "#663931", "#222034"),
      torso: ramp("#639bff", "#306082", "#3f3f74", "#222034"),
      front_leg: ramp("#9badb7", "#595652", "#323c39", "#222034"),
      back_leg: ramp("#847e87", "#595652", "#323c39", "#222034"),
      white_guide: ramp("#ffffff", "#fbf236", "#8a6f30", "#524b24"),
      other: ramp("#cbdbfc", "#9badb7", "#696a6a", "#222034"),
      shadow: ramp("#5fcde4", "#3f3f74", "#222034", "#000000")
    }
  },
  {
    id: "endesga-32",
    name: "Endesga 32 action set",
    source: "Lospec Endesga 32",
    sourceUrl: "https://lospec.com/palette-list/endesga-32",
    roles: {
      head: ramp("#ead4aa", "#e8b796", "#c28569", "#3e2731"),
      front_arm: ramp("#ead4aa", "#e8b796", "#c28569", "#3e2731"),
      back_arm: ramp("#e4a672", "#b86f50", "#733e39", "#181425"),
      torso: ramp("#2ce8f5", "#0099db", "#124e89", "#181425"),
      front_leg: ramp("#8b9bb4", "#5a6988", "#3a4466", "#181425"),
      back_leg: ramp("#5a6988", "#3a4466", "#262b44", "#181425"),
      white_guide: ramp("#ffffff", "#fee761", "#feae34", "#733e39"),
      other: ramp("#c0cbdc", "#8b9bb4", "#5a6988", "#181425"),
      shadow: ramp("#265c42", "#193c3e", "#262b44", "#181425")
    }
  },
  {
    id: "aap-64",
    name: "AAP-64 cinematic set",
    source: "Lospec AAP-64",
    sourceUrl: "https://lospec.com/palette-list/aap-64",
    roles: {
      head: ramp("#f4d29c", "#dba463", "#8e5252", "#221c1a"),
      front_arm: ramp("#f4d29c", "#dba463", "#8e5252", "#221c1a"),
      back_arm: ramp("#e9b5a3", "#bb7547", "#71413b", "#141013"),
      torso: ramp("#20d6c7", "#249fde", "#285cc4", "#143464"),
      front_leg: ramp("#b3b9d1", "#6d758d", "#4a5462", "#242234"),
      back_leg: ramp("#8b93af", "#4a5462", "#333941", "#141013"),
      white_guide: ramp("#ffffff", "#ffd541", "#f9a31b", "#73172d"),
      other: ramp("#e3e6ff", "#849be4", "#477d85", "#122020"),
      shadow: ramp("#5daf8d", "#23674e", "#24523b", "#060608")
    }
  },
  {
    id: "pico-8",
    name: "PICO-8 console set",
    source: "PICO-8 system palette",
    sourceUrl: "https://pico8wiki.com/index.php?title=Palette",
    roles: {
      head: ramp("#fff1e8", "#ffccaa", "#ab5236", "#7e2553"),
      front_arm: ramp("#fff1e8", "#ffccaa", "#ab5236", "#7e2553"),
      back_arm: ramp("#ffccaa", "#ab5236", "#5f574f", "#1d2b53"),
      torso: ramp("#29adff", "#1d2b53", "#7e2553", "#000000"),
      front_leg: ramp("#c2c3c7", "#5f574f", "#1d2b53", "#000000"),
      back_leg: ramp("#83769c", "#5f574f", "#1d2b53", "#000000"),
      white_guide: ramp("#fff1e8", "#ffec27", "#ffa300", "#ab5236"),
      other: ramp("#c2c3c7", "#83769c", "#5f574f", "#000000"),
      shadow: ramp("#00e436", "#008751", "#1d2b53", "#000000")
    }
  }
];

MATERIAL_PALETTES.push(...buildAdditionalPalettes());
decoratePaletteMetadata();

MATERIAL_PALETTES.forEach(palette => {
  palette.roles.hand_front = palette.roles.hand_front || palette.roles.front_arm;
  palette.roles.hand_back = palette.roles.hand_back || palette.roles.back_arm;
  palette.roles.foot_front = palette.roles.foot_front || palette.roles.front_leg;
  palette.roles.foot_back = palette.roles.foot_back || palette.roles.back_leg;
  palette.roles.weapon = palette.roles.weapon || palette.roles.other;
  palette.roles.smear = palette.roles.smear || palette.roles.white_guide;
  palette.roles.other = palette.roles.other || palette.roles.weapon;
  palette.roles.white_guide = palette.roles.white_guide || palette.roles.smear;
});

export const DEFAULT_RENDER_SETTINGS = {
  palette: "warm-adventurer",
  outlineMode: "modules",
  outlinePixelPerfect: false,
  outlineColor: "palette",
  outlineThickness: 1,
  outlineTargets: {
    head: true,
    torso: true,
    front_arm: true,
    hand_front: true,
    back_arm: true,
    hand_back: true,
    front_leg: true,
    foot_front: true,
    back_leg: true,
    foot_back: true,
    limbs: true,
    weapon: false,
    smear: false,
    props: false
  },
  shadingMode: "banded",
  shadingStrength: 45,
  sourceControlShading: false,
  lightDirection: -135,
  rearDepth: 20,
  rimLight: 8,
  ambientOcclusion: true,
  skeletonOverlay: false,
  frameAnchor: {
    bottom: false
  },
  proportionLocks: {
    armLength: true,
    armThickness: true,
    legLength: true,
    legThickness: true
  },
  figureScale: {
    x: 1,
    y: 1,
    lock: true
  },
  colorTuning: {
    enabled: false,
    moduleColors: {}
  },
  roleMerge: {
    distalLimbs: false
  },
  accessories: {
    eyes: "none"
  },
  experimental: {
    expressionStrength: 0,
    headShape: "standard",
    limbShape: "standard"
  },
  roles: {
    head: { enabled: true, size: 1 },
    torso: { enabled: true, size: 1, length: 1 },
    front_arm: { enabled: true, length: 1, thickness: 1 },
    hand_front: { enabled: true, length: 1, thickness: 1, size: 1 },
    back_arm: { enabled: true, length: 1, thickness: 1 },
    hand_back: { enabled: true, length: 1, thickness: 1, size: 1 },
    front_leg: { enabled: true, length: 1, thickness: 1 },
    foot_front: { enabled: true, length: 1, thickness: 1, size: 1 },
    back_leg: { enabled: true, length: 1, thickness: 1 },
    foot_back: { enabled: true, length: 1, thickness: 1, size: 1 },
    weapon: { enabled: true, length: 1, thickness: 1 },
    smear: { enabled: true, length: 1, thickness: 1 },
    white_guide: { enabled: true, length: 1, thickness: 1 },
    other: { enabled: true, length: 1, thickness: 1 },
    shadow: { enabled: false, length: 1, thickness: 1 }
  }
};

export function cloneRenderSettings() {
  return JSON.parse(JSON.stringify(DEFAULT_RENDER_SETTINGS));
}

export function paletteById(id) {
  return MATERIAL_PALETTES.find(item => item.id === id) || MATERIAL_PALETTES[0];
}

export function effectiveRenderRole(role, settings = DEFAULT_RENDER_SETTINGS) {
  if (settings?.roleMerge?.distalLimbs === true && DISTAL_ROLE_PARENT[role]) {
    return DISTAL_ROLE_PARENT[role];
  }
  return role;
}

export function effectiveRoleList(roles, settings = DEFAULT_RENDER_SETTINGS) {
  return [...new Set(roles.map(role => effectiveRenderRole(role, settings)))];
}

export function torsoLinkedOffset(role, boxes, torsoLength) {
  if (!TORSO_LINKED_UPPER_ROLES.includes(role)) return { x: 0, y: 0 };
  const torso = boxes?.torso;
  if (!torso || Math.abs(torsoLength - 1) < 0.001) return { x: 0, y: 0 };
  const torsoTop = Number.isFinite(torso.minY) ? torso.minY : torso.maxY;
  const torsoBottom = Number.isFinite(torso.maxY) ? torso.maxY : torsoTop;
  if (role === "head") {
    return {
      x: 0,
      y: (torsoTop - torsoBottom) * (torsoLength - 1)
    };
  }
  const referenceRole = DISTAL_ROLE_PARENT[role] || role;
  const referenceBox = boxes[referenceRole] || boxes[role];
  if (!referenceBox) return { x: 0, y: 0 };
  const attachmentY = clamp(referenceBox.cy, torsoTop, torsoBottom);
  return {
    x: 0,
    y: (attachmentY - torsoBottom) * (torsoLength - 1)
  };
}

export function renderResourceFrame({ ctx, source, animation, frame, manifest, displayMode, settings, destX = 0, destY = 0 }) {
  const output = outputFrame(animation, manifest);
  const sourcePixels = readFramePixels(source, animation, frame);
  const sourcePoints = sourcePixelsToPoints(sourcePixels, animation, frame, manifest, output, settings, true);
  const allPoints = normalizePointRoles(addMissingLowerBodyPoints(sourcePoints, animation), settings);
  const points = allPoints.filter(point => settings.roles[point.role]?.enabled !== false);
  const rawBoxes = boxesForPoints(points);
  const sourceBoxes = boxesForPoints(allPoints);
  const weaponPose = deriveWeaponPose(allPoints, sourceBoxes, animation, frame, output);
  const transformed = transformPoints(points, rawBoxes, settings, output, { source, animation, frame, manifest });
  const roleLayers = buildRoleLayers(transformed, settings, output);
  const composed = composeRoles(roleLayers, settings, output);
  const skeleton = deriveSkeleton(composed, output);
  const headPose = deriveHeadPose(composed, animation, frame, output);
  headPose.accessories = settings.accessories || {};
  const colors = colorize(composed, displayMode, settings, rawBoxes, output);
  if (displayMode !== "contour") {
    applyOutlines(colors, composed, settings, output);
    applyAccessoryLayer(colors, composed, settings, output, headPose);
  }
  const preAnchorBounds = boundsForImageData(colors.imageData, output.width, output.height);
  const anchor = applyFrameAnchor(colors, settings, output, preAnchorBounds);
  const finalBounds = boundsForImageData(colors.imageData, output.width, output.height);
  ctx.putImageData(colors.imageData, destX, destY);
  if (settings.skeletonOverlay) {
    drawSkeletonOverlay(ctx, skeleton, destX, destY);
  }
  return {
    output,
    rolePixels: countRoles(composed.roleAt),
    roleColors: collectRoleColors(colors, composed.roleAt),
    bounds: finalBounds,
    roleBounds: composed.boxes,
    skeleton,
    anchor,
    headPose: publicHeadPose(headPose),
    weaponPose
  };
}

function publicHeadPose(headPose) {
  const { accessories, ...rest } = headPose || {};
  return rest;
}

export function outputFrame(animation, manifest) {
  const global = manifest.outputFrame || { width: 96, height: 96 };
  const normalized = animation.normalized || {};
  return {
    width: normalized.width || global.width,
    height: normalized.height || global.height,
    offsetX: Number.isFinite(normalized.offsetX)
      ? normalized.offsetX
      : Math.floor((global.width - animation.frameWidth) / 2),
    offsetY: Number.isFinite(normalized.offsetY)
      ? normalized.offsetY
      : global.height - animation.frameHeight
  };
}

export function roleForColor(hex, manifest) {
  const mapped = manifest.colorMap.colorToRole?.[hex.toLowerCase()];
  if (mapped) return mapped;
  for (const role of manifest.colorMap.roles) {
    if (role.colors.some(item => item.hex.toLowerCase() === hex.toLowerCase())) return role.role;
  }
  return "other";
}

const SMEAR_SOURCE_COLORS = new Set([
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
  "#ffffff"
]);

const FRONT_ARM_SOURCE_COLORS = new Set([
  "#643875",
  "#674085",
  "#76428a",
  "#935c89",
  "#951799",
  "#9c304d",
  "#a3608f",
  "#ad54b0",
  "#af1ab2"
]);

const BACK_ARM_SOURCE_COLORS = new Set([
  "#61ab2c",
  "#69ad31",
  "#6abe30",
  "#99e550"
]);

const WEAPON_SOURCE_COLORS = new Set([
  "#847e87",
  "#ae1db3",
  "#bf6fa7",
  "#f065c4",
  "#fb8aff",
  "#fffbb7"
]);

const WEAPON_CONTEXT_COLORS = new Set([
  "#a3608f"
]);

const SHADOW_SOURCE_COLORS = new Set([
  "#3d525c"
]);

function classifyRenderRole(role, hex, animation) {
  const color = hex.toLowerCase();
  if (role === "shadow" || SHADOW_SOURCE_COLORS.has(color)) return "shadow";
  if (role === "white_guide") return "smear";
  if (SMEAR_SOURCE_COLORS.has(color)) return "smear";
  if (WEAPON_SOURCE_COLORS.has(color)) return "weapon";
  if (isWeaponSheet(animation) && WEAPON_CONTEXT_COLORS.has(color)) return "weapon";
  if (FRONT_ARM_SOURCE_COLORS.has(color)) return "front_arm";
  if (BACK_ARM_SOURCE_COLORS.has(color)) return "back_arm";
  return role;
}

function isWeaponSheet(animation) {
  return /sword|katana|shoot|stab|attack/i.test(`${animation.name} ${animation.folder} ${animation.file}`);
}

function ramp(light, base, shadow, outline) {
  return { light, base, shadow, outline };
}

function buildAdditionalPalettes() {
  return [
    freeColorPalette(),
    ...buildMonoPalettes(),
    lospecPalette("sweetie-16-plus", "Sweetie 16", "Popular pixel-art palettes", [
      "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179",
      "#29366f", "#3b5dc9", "#41a6f6", "#73eff7", "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
    ], {
      head: [12, 3, 2, 0], front_arm: [12, 3, 2, 0], back_arm: [4, 3, 2, 0],
      torso: [11, 10, 9, 8], front_leg: [13, 14, 15, 0], back_leg: [14, 15, 8, 0],
      white_guide: [12, 11, 10, 8], other: [13, 14, 15, 0], shadow: [15, 8, 0, 0]
    }, "https://lospec.com/palette-list/sweetie-16"),
    lospecPalette("vinik24", "Vinik24", "Popular pixel-art palettes", [
      "#000000", "#6f6776", "#9a9a97", "#c5ccb8", "#8b5580", "#c38890", "#a593a5", "#666092",
      "#9a4f50", "#c28d75", "#7ca1c0", "#416aa3", "#8d6268", "#be955c", "#68aca9", "#387080",
      "#6e6962", "#93a167", "#6eaa78", "#557064", "#9d9f7f", "#7e9e99", "#5d6872", "#433455"
    ], {
      head: [3, 9, 8, 0], front_arm: [3, 9, 8, 0], back_arm: [6, 12, 8, 0],
      torso: [10, 11, 7, 0], front_leg: [21, 22, 23, 0], back_leg: [17, 19, 16, 0],
      white_guide: [3, 20, 17, 16], other: [2, 1, 22, 0], shadow: [22, 23, 0, 0]
    }, "https://lospec.com/palette-list/vinik24"),
    lospecPalette("fantasy-24", "Fantasy 24", "Popular pixel-art palettes", [
      "#1f240a", "#39571c", "#a58c27", "#efac28", "#efd8a1", "#ab5c1c", "#183f39", "#ef692f",
      "#efb775", "#a56243", "#773421", "#724113", "#2a1d0d", "#392a1c", "#684c3c", "#927e6a",
      "#276468", "#ef3a0c", "#45230d", "#3c9f9c", "#9b1a0a", "#36170c", "#550f0a", "#300f0a"
    ], {
      head: [8, 9, 10, 12], front_arm: [8, 9, 10, 12], back_arm: [4, 5, 11, 12],
      torso: [19, 16, 6, 12], front_leg: [15, 14, 13, 12], back_leg: [2, 1, 0, 12],
      white_guide: [4, 3, 5, 12], other: [15, 14, 13, 12], shadow: [13, 12, 23, 23]
    }, "https://lospec.com/palette-list/fantasy-24"),
    lospecPalette("resurrect-32", "Resurrect 32", "Popular pixel-art palettes", [
      "#ffffff", "#fb6b1d", "#e83b3b", "#831c5d", "#c32454", "#f04f78", "#f68181", "#fca790",
      "#e3c896", "#ab947a", "#966c6c", "#625565", "#3e3546", "#0b5e65", "#0b8a8f", "#1ebc73",
      "#91db69", "#fbff86", "#fbb954", "#cd683d", "#9e4539", "#7a3045", "#6b3e75", "#905ea9",
      "#a884f3", "#eaaded", "#8fd3ff", "#4d9be6", "#4d65b4", "#484a77", "#30e1b9", "#8ff8e2"
    ], {
      head: [7, 19, 20, 12], front_arm: [7, 19, 20, 12], back_arm: [8, 9, 10, 12],
      torso: [31, 30, 14, 13], front_leg: [26, 27, 28, 29], back_leg: [24, 23, 22, 12],
      white_guide: [0, 17, 18, 20], other: [25, 23, 11, 12], shadow: [11, 12, 29, 29]
    }, "https://lospec.com/palette-list/resurrect-32"),
    lospecPalette("lospec500", "Lospec500", "Popular pixel-art palettes", [
      "#10121c", "#2c1e31", "#6b2643", "#ac2847", "#ec273f", "#94493a", "#de5d3a", "#e98537",
      "#f3a833", "#4d3533", "#6e4c30", "#a26d3f", "#ce9248", "#dab163", "#e8d282", "#f7f3b7",
      "#1e4044", "#006554", "#26854c", "#5ab552", "#9de64e", "#008b8b", "#62a477", "#a6cb96",
      "#d3eed3", "#3e3b65", "#3859b3", "#3388de", "#36c5f4", "#6dead6", "#5e5b8c", "#8c78a5",
      "#b0a7b8", "#deceed", "#9a4d76", "#c878af", "#cc99ff", "#fa6e79", "#ffa2ac", "#ffd1d5",
      "#f6e8e0", "#ffffff"
    ], {
      head: [40, 38, 37, 0], front_arm: [40, 38, 37, 0], back_arm: [15, 13, 11, 0],
      torso: [29, 28, 27, 25], front_leg: [24, 23, 22, 16], back_leg: [32, 31, 30, 25],
      white_guide: [41, 15, 8, 5], other: [33, 32, 30, 0], shadow: [30, 25, 0, 0]
    }, "https://lospec.com/palette-list/lospec500"),
    lospecPalette("pico-8-extended", "PICO-8 extended", "Popular pixel-art palettes", [
      "#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
      "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa",
      "#291814", "#111d35", "#422136", "#125359", "#742f29", "#49333b", "#a28879", "#f3ef7d",
      "#be1250", "#ff6c24", "#a8e72e", "#00b543", "#065ab5", "#754665", "#ff6e59", "#ff9d81"
    ], {
      head: [15, 31, 4, 16], front_arm: [15, 31, 4, 16], back_arm: [22, 4, 20, 16],
      torso: [12, 28, 1, 17], front_leg: [6, 5, 1, 0], back_leg: [13, 5, 17, 0],
      white_guide: [7, 10, 9, 4], other: [6, 13, 5, 0], shadow: [5, 1, 17, 0]
    }, "https://pico8wiki.com/index.php?title=Palette"),
    rolePalette("emerald-ramp", "Emerald ramp", "Color ramps", [
      "#eaffd6", "#7bf382", "#28a95f", "#0f5b3b",
      "#b8f6d2", "#4bc47c", "#217a50", "#0a3326",
      "#c4ff73", "#72c442", "#336b2f", "#081f18",
      "#dcfff0", "#7bd7bf", "#2b7f73", "#0d2f35",
      "#efffe8", "#a8dd7c", "#517f3a", "#152513"
    ], {
      head: ["#dcfff0", "#7bd7bf", "#2b7f73", "#0d2f35"],
      front_arm: ["#eaffd6", "#7bf382", "#28a95f", "#0f5b3b"],
      back_arm: ["#b8f6d2", "#4bc47c", "#217a50", "#0a3326"],
      torso: ["#c4ff73", "#72c442", "#336b2f", "#081f18"],
      front_leg: ["#efffe8", "#a8dd7c", "#517f3a", "#152513"],
      back_leg: ["#b8d58f", "#6b9c4a", "#375832", "#111d12"],
      white_guide: ["#f0fff8", "#9df5da", "#39a88e", "#113f43"],
      other: ["#d7ffe3", "#75c986", "#3f7a4a", "#142316"],
      shadow: ["#557064", "#2d4b42", "#172c28", "#071311"]
    }),
    rolePalette("crimson-ramp", "Crimson ramp", "Color ramps", [
      "#ffe3d6", "#ff9d7a", "#d94a4a", "#6b1d2b",
      "#ffd1d1", "#f06b72", "#a8324c", "#3a1428",
      "#ffe8a3", "#eea24a", "#a44d2a", "#2b1714",
      "#ffb8cf", "#dd5d88", "#8f2f5d", "#2c1224",
      "#f6dfcf", "#c98564", "#704034", "#1e1112"
    ], {
      head: ["#f6dfcf", "#c98564", "#704034", "#1e1112"],
      front_arm: ["#ffe3d6", "#ff9d7a", "#d94a4a", "#6b1d2b"],
      back_arm: ["#ffd1d1", "#f06b72", "#a8324c", "#3a1428"],
      torso: ["#ffb8cf", "#dd5d88", "#8f2f5d", "#2c1224"],
      front_leg: ["#ffe8a3", "#eea24a", "#a44d2a", "#2b1714"],
      back_leg: ["#d98b62", "#9c463d", "#5c2430", "#1a0e13"],
      white_guide: ["#fff0d1", "#ffca6e", "#b8623a", "#3a1f19"],
      other: ["#ffe2e8", "#bb7486", "#703d50", "#21121d"],
      shadow: ["#694a4c", "#422b35", "#251827", "#110b12"]
    }),
    rolePalette("azure-ramp", "Azure ramp", "Color ramps", [
      "#e0fbff", "#8be7ff", "#2c9dce", "#164b77",
      "#b6d8ff", "#5d8ee8", "#2b4b9d", "#131c4c",
      "#d8f0ff", "#7eb7d9", "#3f6b8c", "#14283a",
      "#c9ffe8", "#4fd0bf", "#247d86", "#10313e",
      "#f0f5ff", "#9aa8c2", "#4d5a78", "#171c29"
    ], {
      head: ["#f0f5ff", "#9aa8c2", "#4d5a78", "#171c29"],
      front_arm: ["#d8f0ff", "#7eb7d9", "#3f6b8c", "#14283a"],
      back_arm: ["#b6d8ff", "#5d8ee8", "#2b4b9d", "#131c4c"],
      torso: ["#e0fbff", "#8be7ff", "#2c9dce", "#164b77"],
      front_leg: ["#c9ffe8", "#4fd0bf", "#247d86", "#10313e"],
      back_leg: ["#8fb8d8", "#4c7ba1", "#274565", "#0d1826"],
      white_guide: ["#ffffff", "#b9f3ff", "#4fa7d2", "#1d4266"],
      other: ["#e4e8ff", "#8a95d8", "#475185", "#171832"],
      shadow: ["#40536a", "#29384d", "#151f31", "#0a0e18"]
    }),
    rolePalette("violet-ramp", "Violet ramp", "Color ramps", [
      "#fff0ff", "#d6a2ff", "#8a54d6", "#3a2266",
      "#ffd8fb", "#c56bea", "#74389c", "#27133d",
      "#c7c0ff", "#736de0", "#373f90", "#121838",
      "#f0d2ff", "#ad81d8", "#604277", "#201629",
      "#dceaff", "#8594bc", "#454d6d", "#151927"
    ], {
      head: ["#dceaff", "#8594bc", "#454d6d", "#151927"],
      front_arm: ["#fff0ff", "#d6a2ff", "#8a54d6", "#3a2266"],
      back_arm: ["#f0d2ff", "#ad81d8", "#604277", "#201629"],
      torso: ["#ffd8fb", "#c56bea", "#74389c", "#27133d"],
      front_leg: ["#c7c0ff", "#736de0", "#373f90", "#121838"],
      back_leg: ["#8f8ac4", "#56549a", "#2d3365", "#10162c"],
      white_guide: ["#fff4ff", "#e6c2ff", "#9161c4", "#31204e"],
      other: ["#eee6ff", "#a68dc8", "#5b4a77", "#1d1728"],
      shadow: ["#4c405c", "#302940", "#1b1728", "#0e0a15"]
    }),
    rolePalette("gold-ramp", "Gold ramp", "Color ramps", [
      "#fff8cf", "#ffd866", "#d18a2a", "#6d3b16",
      "#ffe6a6", "#e7a84b", "#9b5726", "#351a10",
      "#f7d9a8", "#bd7d44", "#71422b", "#211511",
      "#f0f0d8", "#b8a76f", "#665a32", "#1c190d",
      "#d8e0d0", "#85907c", "#465041", "#131812"
    ], {
      head: ["#f7d9a8", "#bd7d44", "#71422b", "#211511"],
      front_arm: ["#ffe6a6", "#e7a84b", "#9b5726", "#351a10"],
      back_arm: ["#d9a760", "#a05d2d", "#60311f", "#1c1110"],
      torso: ["#fff8cf", "#ffd866", "#d18a2a", "#6d3b16"],
      front_leg: ["#f0f0d8", "#b8a76f", "#665a32", "#1c190d"],
      back_leg: ["#b4ae86", "#75683e", "#3e3822", "#14110a"],
      white_guide: ["#ffffff", "#ffe987", "#c48d37", "#4c2b12"],
      other: ["#d8e0d0", "#85907c", "#465041", "#131812"],
      shadow: ["#5c5040", "#3b3027", "#211a16", "#0f0b09"]
    }),
    rolePalette("ink-grayscale", "Ink grayscale", "Color ramps", [
      "#ffffff", "#d8dfe3", "#a2adb4", "#69757d", "#414950", "#252a30", "#12161a", "#050608",
      "#ececec", "#c7c7c7", "#8d8d8d", "#595959", "#303030", "#171717", "#080808", "#000000",
      "#dce8ea", "#a8bec3", "#71868c", "#3e5058", "#1b272e", "#0d1217"
    ], {
      head: ["#ffffff", "#c7c7c7", "#69757d", "#12161a"],
      front_arm: ["#ececec", "#a2adb4", "#595959", "#0d1217"],
      back_arm: ["#d8dfe3", "#8d8d8d", "#414950", "#080808"],
      torso: ["#dce8ea", "#71868c", "#3e5058", "#050608"],
      front_leg: ["#c7c7c7", "#69757d", "#303030", "#000000"],
      back_leg: ["#a2adb4", "#595959", "#252a30", "#000000"],
      white_guide: ["#ffffff", "#d8dfe3", "#8d8d8d", "#171717"],
      other: ["#ececec", "#a8bec3", "#4f5a62", "#080808"],
      shadow: ["#595959", "#303030", "#171717", "#000000"]
    }),
    rolePalette("skin-lab-32", "Skin tone lab 32", "Large palettes", [
      "#fff2df", "#f7d5b4", "#e5b487", "#c98963", "#9f5f45", "#6e392f", "#3b1f21", "#160d10",
      "#f6cfa5", "#d99d70", "#a7654b", "#704034", "#2a1717", "#ead1bd", "#b88468", "#704a3f",
      "#ffd8c9", "#e9a38f", "#a95f5d", "#613342", "#f0b66f", "#bc7447", "#763e2b", "#271410",
      "#7b8fa1", "#506273", "#2b3848", "#101923", "#c9d2d8", "#7f8b96", "#404a55", "#151a21"
    ], {
      head: ["#fff2df", "#e5b487", "#9f5f45", "#3b1f21"],
      front_arm: ["#f7d5b4", "#c98963", "#6e392f", "#160d10"],
      back_arm: ["#f6cfa5", "#a7654b", "#704034", "#2a1717"],
      torso: ["#7b8fa1", "#506273", "#2b3848", "#101923"],
      front_leg: ["#c9d2d8", "#7f8b96", "#404a55", "#151a21"],
      back_leg: ["#7f8b96", "#506273", "#2b3848", "#101923"],
      white_guide: ["#fff2df", "#f0b66f", "#bc7447", "#271410"],
      other: ["#ead1bd", "#b88468", "#704a3f", "#160d10"],
      shadow: ["#704a3f", "#3b1f21", "#2a1717", "#0b0708"]
    }),
    rolePalette("forest-32", "Forest 32", "Large palettes", [
      "#f4ffe8", "#d7f7a8", "#a8d65d", "#72a43f", "#3f6f32", "#204227", "#0d2118", "#06100c",
      "#e2d6a2", "#b8a05b", "#7a6834", "#3f361e", "#f1c18f", "#b9794e", "#714129", "#24140f",
      "#9dd8b8", "#5aa57c", "#2f6f56", "#12362f", "#b3d1d5", "#71959c", "#3e5b64", "#172a32",
      "#f0f0ce", "#c6c68c", "#7e8051", "#3f4129", "#d9e4d0", "#8ca088", "#4b5d4f", "#18221c"
    ], {
      head: ["#f1c18f", "#b9794e", "#714129", "#24140f"],
      front_arm: ["#f1c18f", "#b9794e", "#714129", "#24140f"],
      back_arm: ["#d6a26f", "#93603e", "#563020", "#1b100d"],
      torso: ["#d7f7a8", "#72a43f", "#3f6f32", "#0d2118"],
      front_leg: ["#9dd8b8", "#5aa57c", "#2f6f56", "#12362f"],
      back_leg: ["#71959c", "#3e5b64", "#172a32", "#06100c"],
      white_guide: ["#f4ffe8", "#e2d6a2", "#b8a05b", "#3f361e"],
      other: ["#d9e4d0", "#8ca088", "#4b5d4f", "#18221c"],
      shadow: ["#4b5d4f", "#2c3f35", "#18221c", "#06100c"]
    }),
    rolePalette("ocean-32", "Ocean 32", "Large palettes", [
      "#f0ffff", "#c5f6ff", "#7fd7ea", "#3f9fca", "#226c9b", "#173f6b", "#10203f", "#080b1c",
      "#dbf7e8", "#8ce2c6", "#41a995", "#1c6f70", "#0f3d4c", "#071d28", "#d8d5ff", "#8f8deb",
      "#505ec4", "#263179", "#12163f", "#f4c6a0", "#c8835c", "#7b493d", "#2a1a1b", "#f1f4ff",
      "#b6c1d8", "#7685a3", "#42506f", "#1c2438", "#ffe0a3", "#dea84a", "#7d5424", "#21160d"
    ], {
      head: ["#f4c6a0", "#c8835c", "#7b493d", "#2a1a1b"],
      front_arm: ["#f4c6a0", "#c8835c", "#7b493d", "#2a1a1b"],
      back_arm: ["#c98c72", "#8d5447", "#4d2e31", "#171016"],
      torso: ["#c5f6ff", "#3f9fca", "#173f6b", "#080b1c"],
      front_leg: ["#d8d5ff", "#505ec4", "#263179", "#12163f"],
      back_leg: ["#b6c1d8", "#7685a3", "#42506f", "#1c2438"],
      white_guide: ["#f0ffff", "#7fd7ea", "#226c9b", "#10203f"],
      other: ["#dbf7e8", "#41a995", "#1c6f70", "#071d28"],
      shadow: ["#42506f", "#263179", "#12163f", "#080b1c"]
    }),
    rolePalette("neon-32", "Neon 32", "Large palettes", [
      "#fff6ff", "#ffb3ff", "#f05cff", "#9b2be8", "#52159c", "#22084d", "#0e0523", "#05020d",
      "#d4ffff", "#65f7ff", "#16b8ff", "#1764d8", "#132d86", "#07143f", "#e8ffb3", "#a6ff3f",
      "#43d94e", "#178a45", "#0a3c2d", "#ffe0a8", "#ff9f5a", "#e84a5f", "#8e244d", "#2d1025",
      "#f8f8ff", "#b2b7ff", "#6570d9", "#30398a", "#151946", "#ffffff", "#ffd6f0", "#ff79aa"
    ], {
      head: ["#ffe0a8", "#ff9f5a", "#8e244d", "#2d1025"],
      front_arm: ["#d4ffff", "#65f7ff", "#16b8ff", "#132d86"],
      back_arm: ["#e8ffb3", "#a6ff3f", "#178a45", "#0a3c2d"],
      torso: ["#ffb3ff", "#f05cff", "#9b2be8", "#22084d"],
      front_leg: ["#b2b7ff", "#6570d9", "#30398a", "#151946"],
      back_leg: ["#6570d9", "#30398a", "#151946", "#05020d"],
      white_guide: ["#ffffff", "#ffd6f0", "#ff79aa", "#8e244d"],
      other: ["#f8f8ff", "#65f7ff", "#1764d8", "#07143f"],
      shadow: ["#30398a", "#151946", "#07143f", "#05020d"]
    })
  ];
}

function buildMonoPalettes() {
  return [
    monoPalette("mono-white", "Mono white", "#f5f5f0"),
    monoPalette("mono-black", "Mono black", "#1a1b1f"),
    monoPalette("mono-red", "Mono red", "#d94b4b"),
    monoPalette("mono-orange", "Mono orange", "#de7a32"),
    monoPalette("mono-yellow", "Mono yellow", "#e6c84f"),
    monoPalette("mono-green", "Mono green", "#49b35f"),
    monoPalette("mono-cyan", "Mono cyan", "#3fbfc5"),
    monoPalette("mono-blue", "Mono blue", "#4c7dd9"),
    monoPalette("mono-purple", "Mono purple", "#8a5bd1"),
    monoPalette("mono-pink", "Mono pink", "#d968a6")
  ];
}

function monoPalette(id, name, base) {
  const light = mixHex(base, "#ffffff", 0.34);
  const shadow = mixHex(base, "#000000", 0.36);
  const outline = mixHex(base, "#000000", 0.68);
  const monoRamp = [light, base, shadow, outline];
  const roles = Object.fromEntries([
    "head",
    "front_arm",
    "back_arm",
    "torso",
    "front_leg",
    "back_leg",
    "white_guide",
    "weapon",
    "smear",
    "other",
    "shadow"
  ].map(role => [role, monoRamp]));
  return rolePalette(id, name, "Mono colors", [light, base, shadow, outline], roles);
}

function freeColorPalette() {
  return rolePalette("custom-free", "Custom free colors", "Custom", [
    "#f2c7a5", "#c88962", "#40566f", "#2f7d68",
    "#8c5fd3", "#d6c25d", "#6d7280", "#f6d6ff",
    "#0f1316", "#ffffff", "#ff5c8a", "#47d7ff",
    "#6df27d", "#f2b84b", "#7d4a32", "#232732"
  ], {
    head: ["#ffe2c7", "#c88962", "#7a4738", "#241817"],
    front_arm: ["#ffe2c7", "#c88962", "#7a4738", "#241817"],
    back_arm: ["#d7a07d", "#a96b4d", "#633629", "#1e1514"],
    torso: ["#8ba1c1", "#40566f", "#243244", "#151b22"],
    front_leg: ["#8fd8c4", "#2f7d68", "#1d493e", "#0c1d1a"],
    back_leg: ["#b19ce6", "#6b4ca3", "#37295f", "#130f21"],
    white_guide: ["#ffffff", "#f6d6ff", "#b06cc4", "#3f2450"],
    other: ["#e0e4ec", "#6d7280", "#373b46", "#111318"],
    shadow: ["#49505a", "#2d343e", "#181f28", "#0d1117"]
  }, { custom: true });
}

function rolePalette(id, name, category, colors, roleRamps, extra = {}) {
  return {
    id,
    name,
    category,
    colors,
    roles: Object.fromEntries(Object.entries(roleRamps).map(([role, values]) => [role, ramp(...values)])),
    ...extra
  };
}

function lospecPalette(id, name, category, colors, roleIndexes, sourceUrl) {
  return rolePalette(
    id,
    name,
    category,
    colors,
    Object.fromEntries(Object.entries(roleIndexes).map(([role, indexes]) => [
      role,
      indexes.map(index => colors[index])
    ])),
    { source: "Lospec / pixel-art reference palette", sourceUrl }
  );
}

function decoratePaletteMetadata() {
  const fullPalettes = {
    "dawnbringer-32": [
      "#000000", "#222034", "#45283c", "#663931", "#8f563b", "#df7126", "#d9a066", "#eec39a",
      "#fbf236", "#99e550", "#6abe30", "#37946e", "#4b692f", "#524b24", "#323c39", "#3f3f74",
      "#306082", "#5b6ee1", "#639bff", "#5fcde4", "#cbdbfc", "#ffffff", "#9badb7", "#847e87",
      "#696a6a", "#595652", "#76428a", "#ac3232", "#d95763", "#d77bba", "#8f974a", "#8a6f30"
    ],
    "endesga-32": [
      "#be4a2f", "#d77643", "#ead4aa", "#e4a672", "#b86f50", "#733e39", "#3e2731", "#a22633",
      "#e43b44", "#f77622", "#feae34", "#fee761", "#63c74d", "#3e8948", "#265c42", "#193c3e",
      "#124e89", "#0099db", "#2ce8f5", "#ffffff", "#c0cbdc", "#8b9bb4", "#5a6988", "#3a4466",
      "#262b44", "#181425", "#ff0044", "#68386c", "#b55088", "#f6757a", "#e8b796", "#c28569"
    ],
    "pico-8": [
      "#000000", "#1d2b53", "#7e2553", "#008751", "#ab5236", "#5f574f", "#c2c3c7", "#fff1e8",
      "#ff004d", "#ffa300", "#ffec27", "#00e436", "#29adff", "#83769c", "#ff77a8", "#ffccaa"
    ]
  };
  MATERIAL_PALETTES.forEach(palette => {
    if (!palette.category) {
      palette.category = palette.source ? "Reference palettes" : "Character presets";
    }
    if (!palette.colors && fullPalettes[palette.id]) {
      palette.colors = fullPalettes[palette.id];
    }
    if (!palette.colors) {
      palette.colors = Object.values(palette.roles).flatMap(role => [role.light, role.base, role.shadow, role.outline]);
    }
  });
}

function readFramePixels(source, animation, frame) {
  const scratch = document.createElement("canvas");
  scratch.width = animation.frameWidth;
  scratch.height = animation.frameHeight;
  const sctx = scratch.getContext("2d", { willReadFrequently: true });
  sctx.imageSmoothingEnabled = false;
  const sourceWidth = source.naturalWidth || source.width || animation.sourceWidth || animation.frameWidth;
  const sourceHeight = source.naturalHeight || source.height || animation.sourceHeight || animation.frameHeight;
  const sourceW = Math.max(0, Math.min(animation.frameWidth, sourceWidth - frame.sourceX));
  const sourceH = Math.max(0, Math.min(animation.frameHeight, sourceHeight - frame.sourceY));
  if (sourceW <= 0 || sourceH <= 0) {
    return sctx.getImageData(0, 0, animation.frameWidth, animation.frameHeight);
  }
  sctx.drawImage(
    source,
    frame.sourceX,
    frame.sourceY,
    sourceW,
    sourceH,
    0,
    0,
    sourceW,
    sourceH
  );
  return sctx.getImageData(0, 0, animation.frameWidth, animation.frameHeight);
}

function sourcePixelsToPoints(imageData, animation, frame, manifest, output, settings, includeDisabled = false) {
  const points = [];
  for (let y = 0; y < animation.frameHeight; y += 1) {
    for (let x = 0; x < animation.frameWidth; x += 1) {
      const index = (y * animation.frameWidth + x) * 4;
      const a = imageData.data[index + 3];
      if (a === 0) continue;
      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      const hex = rgbToHex(r, g, b);
      const manifestRole = roleForColor(hex, manifest);
      const role = manifest.cleanedResource === true
        ? manifestRole
        : classifyRenderRole(manifestRole, hex, animation);
      if (!includeDisabled && settings.roles[role]?.enabled === false) continue;
      points.push({
        x: x + output.offsetX,
        y: y + output.offsetY,
        sourceX: x,
        sourceY: y,
        role,
        hex,
        r,
        g,
        b,
        a,
        luminance: luminance(r, g, b),
        frameIndex: frame.index
      });
    }
  }
  return points;
}

function addMissingLowerBodyPoints(points, animation) {
  if (!needsLowerBodyFallback(points, animation)) return points;
  const torso = boxesForPoints(points).torso || boxesForPoints(points).head;
  if (!torso) return points;
  const result = points.slice();
  const hipY = clamp(Math.round(torso.maxY), 0, 95);
  const hipX = Math.round(torso.cx);
  appendSyntheticLimb(result, "back_leg", [
    { x: hipX - 2, y: hipY },
    { x: hipX - 4, y: hipY + 5 },
    { x: hipX - 7, y: hipY + 10 }
  ]);
  appendSyntheticLimb(result, "front_leg", [
    { x: hipX + 1, y: hipY },
    { x: hipX + 3, y: hipY + 5 },
    { x: hipX + 7, y: hipY + 10 }
  ]);
  return result;
}

function needsLowerBodyFallback(points, animation) {
  if (points.some(point => point.role === "front_leg" || point.role === "back_leg")) return false;
  const text = `${animation?.id || ""} ${animation?.name || ""} ${animation?.folder || ""} ${animation?.file || ""}`.toLowerCase();
  return /\bkatana\b.*\bair\b|\bair\b.*\bkatana\b|\bkatana\b.*\brun(?:ning)?\b.*\battack\b|\bkatana\b.*upper.body/.test(text);
}

function appendSyntheticLimb(points, role, joints) {
  for (let index = 0; index < joints.length - 1; index += 1) {
    appendSyntheticLine(points, role, joints[index], joints[index + 1]);
  }
}

function appendSyntheticLine(points, role, a, b) {
  const color = ROLE_STYLES[role]?.color || ROLE_STYLES.other.color;
  const rgb = hexToRgb(color);
  const dx = Math.abs(b.x - a.x);
  const dy = Math.abs(b.y - a.y);
  const sx = a.x < b.x ? 1 : -1;
  const sy = a.y < b.y ? 1 : -1;
  let error = dx - dy;
  let x = a.x;
  let y = a.y;
  while (true) {
    points.push({
      x: clamp(x, 0, 95),
      y: clamp(y, 0, 95),
      sourceX: x,
      sourceY: y,
      role,
      hex: color,
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: 255,
      luminance: luminance(rgb.r, rgb.g, rgb.b),
      frameIndex: -1,
      synthetic: true
    });
    if (x === b.x && y === b.y) break;
    const e2 = error * 2;
    if (e2 > -dy) {
      error -= dy;
      x += sx;
    }
    if (e2 < dx) {
      error += dx;
      y += sy;
    }
  }
}

function normalizePointRoles(points, settings) {
  return points.map(point => {
    const role = effectiveRenderRole(point.role, settings);
    return role === point.role ? point : { ...point, originalRole: point.originalRole || point.role, role };
  });
}

function boxesForPoints(points) {
  const boxes = {};
  for (const point of points) {
    if (!boxes[point.role]) {
      boxes[point.role] = {
        minX: point.x,
        minY: point.y,
        maxX: point.x,
        maxY: point.y,
        minLum: point.luminance,
        maxLum: point.luminance,
        count: 0
      };
    }
    const box = boxes[point.role];
    box.minX = Math.min(box.minX, point.x);
    box.minY = Math.min(box.minY, point.y);
    box.maxX = Math.max(box.maxX, point.x);
    box.maxY = Math.max(box.maxY, point.y);
    box.minLum = Math.min(box.minLum, point.luminance);
    box.maxLum = Math.max(box.maxLum, point.luminance);
    box.count += 1;
  }
  for (const box of Object.values(boxes)) {
    box.cx = (box.minX + box.maxX) / 2;
    box.cy = (box.minY + box.maxY) / 2;
    box.w = box.maxX - box.minX + 1;
    box.h = box.maxY - box.minY + 1;
  }
  return boxes;
}

const motionProfileCache = new WeakMap();

function transformPoints(points, boxes, settings, output, context = {}) {
  const torso = boxes.torso || boxes.head || boundsForPoints(points);
  const rolePoints = groupPointsByRole(points);
  const torsoLength = clamp(settings.roles.torso?.length ?? 1, 0.65, 1.65);
  const lengthSpecs = {};
  for (const role of LENGTH_ROLES) {
    const pointsForRole = points.filter(point => lengthControlRole(point.role) === role);
    const attachment = role === "weapon" || role === "smear"
      ? boxes.front_arm || boxes.torso || boxes.head || torso
      : torso;
    lengthSpecs[role] = lengthTransformSpec(pointsForRole, attachment);
  }

  const transformed = points.map(point => {
    const roleSettings = settings.roles[point.role] || {};
    const roleBox = boxes[point.role] || torso;
    let x = point.x;
    let y = point.y;
    const baseX = point.x;
    const baseY = point.y;
    let shapeScale = { x: 1, y: 1 };

    const controlRole = lengthControlRole(point.role);
    const controlSettings = settings.roles[controlRole] || roleSettings;

    if (LENGTH_ROLES.includes(controlRole) && lengthSpecs[controlRole]) {
      const { anchor, axis } = lengthSpecs[controlRole];
      const length = roleLengthScale(controlRole, controlSettings);
      const vx = x - anchor.x;
      const vy = y - anchor.y;
      const parallel = vx * axis.x + vy * axis.y;
      const px = axis.x * parallel;
      const py = axis.y * parallel;
      const ox = vx - px;
      const oy = vy - py;
      x = anchor.x + px * length + ox;
      y = anchor.y + py * length + oy;
    }

    if (SIZE_ROLES.includes(point.role)) {
      const shape = roleShapeScale(point.role, settings);
      shapeScale = shape;
      const size = clamp(roleSettings.size ?? 1, 0.55, 1.65);
      const length = point.role === "torso" ? clamp(roleSettings.length ?? 1, 0.65, 1.65) : size;
      const anchor = point.role === "head" || point.role === "torso"
        ? { x: roleBox.cx, y: roleBox.maxY }
        : { x: roleBox.cx, y: roleBox.cy };
      x = anchor.x + (x - anchor.x) * size * shape.x;
      y = anchor.y + (y - anchor.y) * length * shape.y;
    } else if (SHAPED_LIMB_ROLES.includes(point.role)) {
      const shape = roleShapeScale(point.role, settings);
      shapeScale = shape;
      const anchor = { x: roleBox.cx, y: roleBox.cy };
      x = anchor.x + (x - anchor.x) * shape.x;
      y = anchor.y + (y - anchor.y) * shape.y;
    }

    const linkedOffset = torsoLinkedOffset(point.role, boxes, torsoLength);
    x += linkedOffset.x;
    y += linkedOffset.y;

    return {
      ...point,
      baseX,
      baseY,
      x,
      y,
      lengthScale: point.role === "torso"
        ? torsoLength
        : LENGTH_ROLES.includes(controlRole) ? roleLengthScale(controlRole, controlSettings) : 1,
      sizeScale: SIZE_ROLES.includes(point.role) ? clamp(roleSettings.size ?? 1, 0.55, 1.65) : 1,
      shapeScale
    };
  });

  const expressed = applyExpressionStrength(transformed, boxes, settings, output, context);
  const scaled = applyFigureScale(expressed, settings, output);
  return fitPointsToOutput(scaled, output);
}

function applyExpressionStrength(points, boxes, settings, output, context) {
  const strength = clamp(Number(settings.experimental?.expressionStrength || 0), -100, 500);
  if (!strength || !points.length || !context.source || !context.animation || !context.frame || !context.manifest) {
    return points;
  }

  const profile = animationMotionProfile(context.source, context.animation, context.manifest, output, settings);
  const frameProfile = profile.frames.get(context.frame.index);
  if (!frameProfile || !profile.averageBounds) return points;

  const currentBoxes = boxesForPoints(points);
  const amount = strength > 0
    ? (strength / 100) * 0.35
    : (strength / 100) * 0.45;
  const currentTorso = currentBoxes.torso || currentBoxes.head || boundsForPoints(points);
  const averageTorso = profile.averageRoles.torso || profile.averageRoles.head || profile.averageBounds;
  const currentBounds = boundsForPoints(points);
  const globalDelta = {
    x: (currentBounds.cx - profile.averageBounds.cx) * 0.35,
    y: (currentBounds.cy - profile.averageBounds.cy) * 0.35
  };

  return points.map(point => {
    const currentRole = currentBoxes[point.role] || boxes[point.role] || currentTorso;
    const averageRole = profile.averageRoles[point.role] || currentRole;
    const currentVector = {
      x: currentRole.cx - currentTorso.cx,
      y: currentRole.cy - currentTorso.cy
    };
    const averageVector = {
      x: averageRole.cx - averageTorso.cx,
      y: averageRole.cy - averageTorso.cy
    };
    const roleDelta = {
      x: currentVector.x - averageVector.x,
      y: currentVector.y - averageVector.y
    };
    const dynamicRole = LIMB_ROLES.includes(point.role) || point.role === "weapon" || point.role === "smear" || point.role === "head";
    const roleWeight = dynamicRole ? 0.55 : 0.25;

    return {
      ...point,
      x: point.x + (roleDelta.x * roleWeight + globalDelta.x * 0.5) * amount,
      y: point.y + (roleDelta.y * roleWeight + globalDelta.y * 0.5) * amount,
      expressionScale: 1 + amount
    };
  });
}

function applyFigureScale(points, settings, output) {
  const sx = clamp(Number(settings.figureScale?.x ?? 1), 0.05, 2);
  const sy = clamp(Number(settings.figureScale?.y ?? 1), 0.05, 2);
  if ((Math.abs(sx - 1) < 0.001 && Math.abs(sy - 1) < 0.001) || !points.length) return points;
  const bounds = boundsForPoints(points);
  const anchorX = bounds.cx;
  const anchorY = bounds.maxY;
  return points.map(point => ({
    ...point,
    x: anchorX + (point.x - anchorX) * sx,
    y: anchorY + (point.y - anchorY) * sy,
    figureScale: { x: sx, y: sy }
  }));
}

function animationMotionProfile(source, animation, manifest, output, settings = DEFAULT_RENDER_SETTINGS) {
  let sourceCache = motionProfileCache.get(source);
  if (!sourceCache) {
    sourceCache = new Map();
    motionProfileCache.set(source, sourceCache);
  }
  const key = `${animation.id}:${output.width}x${output.height}:${output.offsetX}:${output.offsetY}:mergeDistal=${settings?.roleMerge?.distalLimbs === true}`;
  if (sourceCache.has(key)) return sourceCache.get(key);

  const frames = new Map();
  const roleSums = {};
  const boundsSum = { cx: 0, cy: 0, w: 0, h: 0, count: 0 };
  for (const frame of animation.frames || []) {
    const pixels = readFramePixels(source, animation, frame);
    const framePoints = normalizePointRoles(
      addMissingLowerBodyPoints(sourcePixelsToPoints(pixels, animation, frame, manifest, output, DEFAULT_RENDER_SETTINGS, true), animation),
      settings
    );
    const roleBoxes = boxesForPoints(framePoints);
    const bounds = framePoints.length ? boundsForPoints(framePoints) : null;
    frames.set(frame.index, { boxes: roleBoxes, bounds });
    if (bounds) {
      boundsSum.cx += bounds.cx;
      boundsSum.cy += bounds.cy;
      boundsSum.w += bounds.w;
      boundsSum.h += bounds.h;
      boundsSum.count += 1;
    }
    Object.entries(roleBoxes).forEach(([role, box]) => {
      if (!roleSums[role]) roleSums[role] = { cx: 0, cy: 0, w: 0, h: 0, count: 0 };
      roleSums[role].cx += box.cx;
      roleSums[role].cy += box.cy;
      roleSums[role].w += box.w;
      roleSums[role].h += box.h;
      roleSums[role].count += 1;
    });
  }

  const averageRoles = {};
  Object.entries(roleSums).forEach(([role, sum]) => {
    averageRoles[role] = averageBox(sum);
  });
  const profile = {
    frames,
    averageRoles,
    averageBounds: boundsSum.count ? averageBox(boundsSum) : null
  };
  sourceCache.set(key, profile);
  return profile;
}

function averageBox(sum) {
  return {
    cx: sum.cx / sum.count,
    cy: sum.cy / sum.count,
    w: sum.w / sum.count,
    h: sum.h / sum.count,
    minX: sum.cx / sum.count - sum.w / sum.count / 2,
    maxX: sum.cx / sum.count + sum.w / sum.count / 2,
    minY: sum.cy / sum.count - sum.h / sum.count / 2,
    maxY: sum.cy / sum.count + sum.h / sum.count / 2,
    count: sum.count
  };
}

function roleLengthScale(role, roleSettings) {
  const max = role === "weapon" || role === "smear" ? 2.5 : 1.8;
  return clamp(roleSettings.length ?? 1, 0.5, max);
}

function roleShapeScale(role, settings) {
  if (role === "head") {
    switch (settings.experimental?.headShape || "standard") {
      case "narrow":
        return { x: 0.82, y: 1.08 };
      case "wide":
        return { x: 1.16, y: 0.94 };
      case "tall":
        return { x: 0.94, y: 1.22 };
      case "flat":
        return { x: 1.2, y: 0.82 };
      default:
        return { x: 1, y: 1 };
    }
  }
  if (SHAPED_LIMB_ROLES.includes(role)) {
    switch (settings.experimental?.limbShape || "standard") {
      case "slim":
        return { x: 0.86, y: 1.04 };
      case "chunky":
        return { x: 1.18, y: 1.02 };
      case "long-taper":
        return { x: role.includes("hand") || role.includes("foot") ? 0.92 : 0.95, y: 1.12 };
      case "flat-feet":
        return role.includes("foot") ? { x: 1.3, y: 0.8 } : { x: 1, y: 1 };
      default:
        return { x: 1, y: 1 };
    }
  }
  return { x: 1, y: 1 };
}

function lengthControlRole(role) {
  return DISTAL_ROLE_PARENT[role] || role;
}

function fitPointsToOutput(points, output) {
  if (!points.length) return points;
  const bounds = boundsForPoints(points.map(point => ({
    ...point,
    x: Math.round(point.x),
    y: Math.round(point.y)
  })));
  const growsNorth = points.some(point => (point.figureScale?.y ?? 1) > 1.001);
  const shiftX = fitAxisShift(bounds.minX, bounds.maxX, output.width);
  const shiftY = growsNorth
    ? fitNorthScaleShift(bounds.minY, bounds.maxY, output.height)
    : fitAxisShift(bounds.minY, bounds.maxY, output.height);
  return points.map(point => ({
    ...point,
    baseX: clamp(Math.round(point.baseX + shiftX), 0, output.width - 1),
    baseY: clamp(Math.round(point.baseY + shiftY), 0, output.height - 1),
    x: clamp(Math.round(point.x + shiftX), 0, output.width - 1),
    y: clamp(Math.round(point.y + shiftY), 0, output.height - 1)
  }));
}

function fitAxisShift(min, max, size) {
  const span = max - min + 1;
  if (span > size) return Math.round((size - 1 - min - max) / 2);
  if (min < 0) return -min;
  if (max >= size) return size - 1 - max;
  return 0;
}

function fitNorthScaleShift(min, max, size) {
  if (max >= size) return size - 1 - max;
  if (min < 0) return 0;
  return 0;
}

function groupPointsByRole(points) {
  const groups = {};
  for (const point of points) {
    if (!groups[point.role]) groups[point.role] = [];
    groups[point.role].push(point);
  }
  return groups;
}

function lengthTransformSpec(points, attachmentBox) {
  if (!points.length || !attachmentBox) return null;
  const anchor = nearestPointToBox(points, attachmentBox);
  const distal = farthestPoint(points, anchor);
  const dx = distal.x - anchor.x;
  const dy = distal.y - anchor.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) return null;
  return {
    anchor,
    distal,
    axis: {
      x: dx / length,
      y: dy / length
    }
  };
}

function buildRoleLayers(points, settings, output) {
  const layers = {};
  for (const role of ROLE_ORDER) layers[role] = new Array(output.width * output.height).fill(null);
  const grouped = groupPointsByRole(points);

  for (const point of points) {
    paintRolePoint(layers[point.role], point, output);
  }

  for (const role of ROLE_ORDER) {
    const rolePoints = grouped[role] || [];
    if (roleNeedsGeometryRepair(rolePoints)) {
      connectTransformedSourceNeighbors(layers[role], rolePoints, output);
      layers[role] = repairRoleArea(repairRoleArea(layers[role], output), output);
    }
  }

  for (const role of ROLE_ORDER) {
    const roleSettings = settings.roles[role] || {};
    const thickness = SIZE_ROLES.includes(role) ? (roleSettings.size ?? 1) : (roleSettings.thickness ?? 1);
    layers[role] = adjustThickness(layers[role], output, thickness);
    if (Math.abs(Number(settings.experimental?.expressionStrength || 0)) >= 1) {
      layers[role] = removeTinyRoleFragments(layers[role], output);
    }
  }

  bridgeExpressionSeams(layers, settings, output);
  return layers;
}

function roleNeedsGeometryRepair(rolePoints) {
  return rolePoints.some(point => (
    Math.abs((point.lengthScale ?? 1) - 1) > 0.04
    || Math.abs((point.sizeScale ?? 1) - 1) > 0.04
    || Math.abs((point.shapeScale?.x ?? 1) - 1) > 0.04
    || Math.abs((point.shapeScale?.y ?? 1) - 1) > 0.04
    || Math.abs((point.figureScale?.x ?? 1) - 1) > 0.04
    || Math.abs((point.figureScale?.y ?? 1) - 1) > 0.04
    || Math.abs((point.expressionScale ?? 1) - 1) > 0.04
  ));
}

function skeletonSourceFromLayers(layers, output) {
  const pointsByRole = {};
  const boxes = {};
  for (const role of ROLE_ORDER) {
    const layer = layers[role];
    if (!layer) continue;
    const points = [];
    for (let index = 0; index < layer.length; index += 1) {
      if (!layer[index]) continue;
      points.push({ x: index % output.width, y: (index / output.width) | 0 });
    }
    if (!points.length) continue;
    pointsByRole[role] = points;
    boxes[role] = boundsForPoints(points);
    boxes[role].count = points.length;
  }
  return { boxes, pointsByRole };
}

function paintRolePoint(layer, point, output) {
  if (!layer) return;
  const index = point.y * output.width + point.x;
  layer[index] = point;
}

function connectTransformedSourceNeighbors(layer, points, output) {
  const bySource = new Map();
  for (const point of points) {
    bySource.set(`${point.sourceX},${point.sourceY}`, point);
  }
  for (const point of points) {
    const right = bySource.get(`${point.sourceX + 1},${point.sourceY}`);
    const down = bySource.get(`${point.sourceX},${point.sourceY + 1}`);
    if (right) paintRoleLine(layer, point.x, point.y, right.x, right.y, point, output);
    if (down) paintRoleLine(layer, point.x, point.y, down.x, down.y, point, output);
  }
}

function paintRoleLine(layer, x0, y0, x1, y1, point, output) {
  let ix0 = Math.round(x0);
  let iy0 = Math.round(y0);
  const ix1 = Math.round(x1);
  const iy1 = Math.round(y1);
  const dx = Math.abs(ix1 - ix0);
  const sx = ix0 < ix1 ? 1 : -1;
  const dy = -Math.abs(iy1 - iy0);
  const sy = iy0 < iy1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    if (inside(ix0, iy0, output)) {
      const index = iy0 * output.width + ix0;
      layer[index] = { ...point, x: ix0, y: iy0, interpolated: true };
    }
    if (ix0 === ix1 && iy0 === iy1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      ix0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      iy0 += sy;
    }
  }
}

function repairRoleArea(layer, output) {
  const next = layer.slice();
  for (let y = 1; y < output.height - 1; y += 1) {
    for (let x = 1; x < output.width - 1; x += 1) {
      const index = y * output.width + x;
      if (next[index]) continue;
      const left = layer[y * output.width + x - 1];
      const right = layer[y * output.width + x + 1];
      const up = layer[(y - 1) * output.width + x];
      const down = layer[(y + 1) * output.width + x];
      const diagonalA = layer[(y - 1) * output.width + x - 1] && layer[(y + 1) * output.width + x + 1];
      const diagonalB = layer[(y - 1) * output.width + x + 1] && layer[(y + 1) * output.width + x - 1];
      const neighbors = [left, right, up, down].filter(Boolean);
      if (left && right) next[index] = { ...left, x, y, repaired: true };
      else if (up && down) next[index] = { ...up, x, y, repaired: true };
      else if (neighbors.length >= 3) next[index] = { ...neighbors[0], x, y, repaired: true };
      else if (diagonalA) next[index] = { ...layer[(y - 1) * output.width + x - 1], x, y, repaired: true };
      else if (diagonalB) next[index] = { ...layer[(y - 1) * output.width + x + 1], x, y, repaired: true };
    }
  }
  return next;
}

function adjustThickness(layer, output, thickness) {
  if (thickness < 0.82) return erode(layer, output, thickness < 0.64 ? 2 : 1);
  if (thickness > 1.22) return dilate(layer, output, thickness > 1.85 ? 2 : 1);
  return layer;
}

function bridgeExpressionSeams(layers, settings, output) {
  const strength = Math.abs(Number(settings.experimental?.expressionStrength || 0));
  if (strength < 1) return;
  const maxDistance = clamp(4 + Math.round(strength / 35), 4, 22);
  for (const [childRole, parentRole] of EXPRESSION_SEAM_CONNECTIONS) {
    if (settings.roles[childRole]?.enabled === false || settings.roles[parentRole]?.enabled === false) continue;
    const child = layers[childRole];
    const parent = layers[parentRole];
    if (!child || !parent) continue;
    const pair = nearestLayerPair(child, parent, output, maxDistance);
    if (!pair || pair.distance <= 1) continue;
    const bridgePoint = child[pair.childIndex] || parent[pair.parentIndex];
    paintRoleManhattanLine(child, pair.child.x, pair.child.y, pair.parent.x, pair.parent.y, bridgePoint, output);
  }
}

function removeTinyRoleFragments(layer, output) {
  const components = layerComponents(layer, output);
  if (components.length <= 1) return layer;
  const largest = components[0]?.pixels.length || 0;
  if (largest < 8) return layer;
  const threshold = Math.max(4, Math.floor(largest * 0.08));
  const next = layer.slice();
  components.slice(1).forEach(component => {
    if (component.pixels.length > threshold) return;
    component.pixels.forEach(index => {
      next[index] = null;
    });
  });
  return next;
}

function layerComponents(layer, output) {
  const seen = new Uint8Array(layer.length);
  const components = [];
  for (let index = 0; index < layer.length; index += 1) {
    if (!layer[index] || seen[index]) continue;
    const pixels = [];
    const queue = [index];
    seen[index] = 1;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      pixels.push(current);
      const x = current % output.width;
      const y = (current / output.width) | 0;
      for (const [dx, dy] of CARDINAL_NEIGHBORS) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inside(nx, ny, output)) continue;
        const nextIndex = ny * output.width + nx;
        if (!layer[nextIndex] || seen[nextIndex]) continue;
        seen[nextIndex] = 1;
        queue.push(nextIndex);
      }
    }
    components.push({ pixels });
  }
  components.sort((a, b) => b.pixels.length - a.pixels.length);
  return components;
}

function nearestLayerPair(childLayer, parentLayer, output, maxDistance) {
  const childPoints = layerPixels(childLayer, output);
  const parentPoints = layerPixels(parentLayer, output);
  if (!childPoints.length || !parentPoints.length) return null;
  const maxDistanceSq = maxDistance * maxDistance;
  let best = null;
  for (const child of childPoints) {
    for (const parent of parentPoints) {
      const dx = child.x - parent.x;
      const dy = child.y - parent.y;
      const distanceSq = dx * dx + dy * dy;
      if (distanceSq > maxDistanceSq) continue;
      if (!best || distanceSq < best.distanceSq) {
        best = {
          child,
          parent,
          childIndex: child.index,
          parentIndex: parent.index,
          distanceSq
        };
      }
    }
  }
  if (!best) return null;
  return { ...best, distance: Math.sqrt(best.distanceSq) };
}

function layerPixels(layer, output) {
  const points = [];
  for (let index = 0; index < layer.length; index += 1) {
    if (!layer[index]) continue;
    points.push({
      index,
      x: index % output.width,
      y: (index / output.width) | 0
    });
  }
  return points;
}

function paintRoleManhattanLine(layer, x0, y0, x1, y1, point, output) {
  const ix0 = Math.round(x0);
  const iy0 = Math.round(y0);
  const ix1 = Math.round(x1);
  const iy1 = Math.round(y1);
  const horizontalFirst = Math.abs(ix1 - ix0) >= Math.abs(iy1 - iy0);
  if (horizontalFirst) {
    paintRoleAxisLine(layer, ix0, iy0, ix1, iy0, point, output);
    paintRoleAxisLine(layer, ix1, iy0, ix1, iy1, point, output);
  } else {
    paintRoleAxisLine(layer, ix0, iy0, ix0, iy1, point, output);
    paintRoleAxisLine(layer, ix0, iy1, ix1, iy1, point, output);
  }
}

function paintRoleAxisLine(layer, x0, y0, x1, y1, point, output) {
  const dx = Math.sign(x1 - x0);
  const dy = Math.sign(y1 - y0);
  let x = x0;
  let y = y0;
  while (true) {
    if (inside(x, y, output)) {
      const index = y * output.width + x;
      layer[index] = { ...point, x, y, seamBridge: true };
    }
    if (x === x1 && y === y1) break;
    x += dx;
    y += dy;
  }
}

function erode(layer, output, iterations) {
  let current = layer;
  for (let pass = 0; pass < iterations; pass += 1) {
    const next = current.slice();
    for (let y = 0; y < output.height; y += 1) {
      for (let x = 0; x < output.width; x += 1) {
        const index = y * output.width + x;
        if (!current[index]) continue;
        const neighbors = countFilledNeighbors(current, output, x, y);
        if (neighbors < 3) next[index] = null;
      }
    }
    current = next;
  }
  return current;
}

function dilate(layer, output, radius) {
  const next = layer.slice();
  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const index = y * output.width + x;
      const point = layer[index];
      if (!point) continue;
      for (let oy = -radius; oy <= radius; oy += 1) {
        for (let ox = -radius; ox <= radius; ox += 1) {
          if (Math.abs(ox) + Math.abs(oy) > radius + 1) continue;
          const nx = x + ox;
          const ny = y + oy;
          if (!inside(nx, ny, output)) continue;
          const nIndex = ny * output.width + nx;
          if (!next[nIndex]) {
            next[nIndex] = { ...point, x: nx, y: ny, dilated: true, luminance: point.luminance };
          }
        }
      }
    }
  }
  return next;
}

function composeRoles(layers, settings, output) {
  const roleAt = new Array(output.width * output.height).fill(null);
  const pointAt = new Array(output.width * output.height).fill(null);
  for (const role of ROLE_ORDER) {
    if (settings.roles[role]?.enabled === false) continue;
    const layer = layers[role];
    for (let index = 0; index < layer.length; index += 1) {
      if (!layer[index]) continue;
      roleAt[index] = role;
      pointAt[index] = layer[index];
    }
  }
  healComposedExpressionGaps(roleAt, pointAt, settings, output);
  return { roleAt, pointAt, boxes: boxesForComposed(roleAt, output.width, output.height) };
}

function healComposedExpressionGaps(roleAt, pointAt, settings, output) {
  const strength = Math.abs(Number(settings.experimental?.expressionStrength || 0));
  if (strength < 1) return;
  const maxDistance = clamp(2 + Math.round(strength / 90), 2, 8);
  const components = composedComponents(roleAt, output);
  if (components.length <= 1) return;
  const connected = [components[0]];
  for (const component of components.slice(1)) {
    const pair = nearestComponentPair(component, connected, output, maxDistance);
    if (!pair) continue;
    const sourceRole = roleAt[pair.fromIndex] || roleAt[pair.toIndex];
    const sourcePoint = pointAt[pair.fromIndex] || pointAt[pair.toIndex] || { role: sourceRole, x: pair.from.x, y: pair.from.y };
    paintComposedManhattanLine(roleAt, pointAt, pair.from.x, pair.from.y, pair.to.x, pair.to.y, sourceRole, sourcePoint, output);
    connected.push(component);
  }
}

function composedComponents(roleAt, output) {
  const seen = new Uint8Array(roleAt.length);
  const components = [];
  for (let index = 0; index < roleAt.length; index += 1) {
    if (!roleAt[index] || seen[index]) continue;
    const pixels = [];
    const queue = [index];
    seen[index] = 1;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      pixels.push(current);
      const x = current % output.width;
      const y = (current / output.width) | 0;
      for (const [dx, dy] of CARDINAL_NEIGHBORS) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inside(nx, ny, output)) continue;
        const nextIndex = ny * output.width + nx;
        if (!roleAt[nextIndex] || seen[nextIndex]) continue;
        seen[nextIndex] = 1;
        queue.push(nextIndex);
      }
    }
    components.push({ pixels });
  }
  components.sort((a, b) => b.pixels.length - a.pixels.length);
  return components;
}

function nearestComponentPair(component, connectedComponents, output, maxDistance) {
  const maxDistanceSq = maxDistance * maxDistance;
  let best = null;
  for (const fromIndex of component.pixels) {
    const from = { x: fromIndex % output.width, y: (fromIndex / output.width) | 0 };
    for (const connected of connectedComponents) {
      for (const toIndex of connected.pixels) {
        const to = { x: toIndex % output.width, y: (toIndex / output.width) | 0 };
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq > maxDistanceSq) continue;
        if (!best || distanceSq < best.distanceSq) {
          best = { from, to, fromIndex, toIndex, distanceSq };
        }
      }
    }
  }
  return best;
}

function paintComposedManhattanLine(roleAt, pointAt, x0, y0, x1, y1, role, point, output) {
  const horizontalFirst = Math.abs(x1 - x0) >= Math.abs(y1 - y0);
  if (horizontalFirst) {
    paintComposedAxisLine(roleAt, pointAt, x0, y0, x1, y0, role, point, output);
    paintComposedAxisLine(roleAt, pointAt, x1, y0, x1, y1, role, point, output);
  } else {
    paintComposedAxisLine(roleAt, pointAt, x0, y0, x0, y1, role, point, output);
    paintComposedAxisLine(roleAt, pointAt, x0, y1, x1, y1, role, point, output);
  }
}

function paintComposedAxisLine(roleAt, pointAt, x0, y0, x1, y1, role, point, output) {
  const dx = Math.sign(x1 - x0);
  const dy = Math.sign(y1 - y0);
  let x = x0;
  let y = y0;
  while (true) {
    if (inside(x, y, output)) {
      const index = y * output.width + x;
      if (!roleAt[index]) {
        roleAt[index] = role;
        pointAt[index] = { ...point, role, x, y, seamBridge: true };
      }
    }
    if (x === x1 && y === y1) break;
    x += dx;
    y += dy;
  }
}

function colorize(composed, displayMode, settings, rawBoxes, output) {
  const imageData = new ImageData(output.width, output.height);
  const palette = paletteById(settings.palette);
  const colorAt = new Array(output.width * output.height).fill(null);
  for (let index = 0; index < composed.roleAt.length; index += 1) {
    const role = composed.roleAt[index];
    if (!role) continue;
    const point = composed.pointAt[index];
    const x = index % output.width;
    const y = (index / output.width) | 0;
    const roleBox = composed.boxes[role] || rawBoxes[role];
    const sourceBox = rawBoxes[role] || roleBox;
    const color = pixelColor({ role, point, x, y, roleBox, sourceBox, displayMode, settings, palette, composed, output });
    const offset = index * 4;
    imageData.data[offset] = color.r;
    imageData.data[offset + 1] = color.g;
    imageData.data[offset + 2] = color.b;
    imageData.data[offset + 3] = 255;
    colorAt[index] = rgbToHex(color.r, color.g, color.b);
  }
  return { imageData, colorAt };
}

function pixelColor({ role, point, x, y, roleBox, sourceBox, displayMode, settings, palette, composed, output }) {
  if (displayMode === "role-mask") {
    return hexToRgb(ROLE_STYLES[role]?.color || ROLE_STYLES.other.color);
  }
  if (displayMode === "contour") {
    return hexToRgb("#ffffff");
  }

  let color;
  if (displayMode === "source") {
    color = point ? { r: point.r, g: point.g, b: point.b } : hexToRgb(ROLE_STYLES[role]?.color || ROLE_STYLES.other.color);
  } else {
    color = materialColor(role, point, palette, sourceBox, settings);
  }

  if (settings.shadingMode !== "off" && displayMode !== "role-mask" && displayMode !== "contour") {
    color = applyLighting(color, { role, x, y, roleBox, settings, composed, output });
  }
  return color;
}

function materialColor(role, point, palette, roleBox, settings) {
  const roleRamp = tunedRoleRamp(role, palette, settings);
  const shade = settings.sourceControlShading ? sourceShade(point, roleBox) : 0.5;
  if (shade > 0.72) return hexToRgb(mixHex(roleRamp.base, roleRamp.light, Math.min(1, (shade - 0.72) / 0.28)));
  if (shade < 0.36) return hexToRgb(mixHex(roleRamp.base, roleRamp.shadow, Math.min(1, (0.36 - shade) / 0.36)));
  return hexToRgb(roleRamp.base);
}

function tunedRoleRamp(role, palette, settings) {
  const baseRamp = palette.roles[role] || palette.roles.other;
  const custom = settings?.colorTuning?.enabled ? settings.colorTuning.moduleColors?.[role] : null;
  if (!custom || !isHexColor(custom)) return baseRamp;
  return ramp(
    mixHex(custom, "#ffffff", 0.36),
    custom,
    mixHex(custom, "#000000", 0.34),
    mixHex(custom, "#000000", 0.68)
  );
}

function sourceShade(point, roleBox) {
  if (!point || !roleBox || roleBox.maxLum === roleBox.minLum) return 0.5;
  return clamp((point.luminance - roleBox.minLum) / (roleBox.maxLum - roleBox.minLum), 0, 1);
}

function applyLighting(color, { role, x, y, roleBox, settings, composed, output }) {
  const strength = clamp(settings.shadingStrength / 100, 0, 2);
  const radians = settings.lightDirection * Math.PI / 180;
  const lx = Math.cos(radians);
  const ly = Math.sin(radians);
  const cx = roleBox ? roleBox.cx : output.width / 2;
  const cy = roleBox ? roleBox.cy : output.height / 2;
  const rx = Math.max(2, (roleBox?.w || output.width) / 2);
  const ry = Math.max(2, (roleBox?.h || output.height) / 2);
  const nx = (x - cx) / rx;
  const ny = (y - cy) / ry;
  const lit = clamp(nx * lx + ny * ly, -1, 1);
  let amount = 0;

  if (settings.shadingMode === "soft") {
    amount = lit * 0.42 * strength;
  } else if (settings.shadingMode === "banded") {
    amount = lit > 0.32 ? 0.28 * strength : lit < -0.18 ? -0.36 * strength : 0;
  } else if (settings.shadingMode === "toon-ao") {
    amount = lit > 0.25 ? 0.24 * strength : lit < -0.12 ? -0.42 * strength : -0.06 * strength;
  } else if (settings.shadingMode === "depth") {
    amount = lit > 0.35 ? 0.15 * strength : -0.18 * strength;
  }

  if (isRearDepthRole(role)) {
    amount -= (settings.rearDepth / 100) * 0.45;
  }

  if (settings.ambientOcclusion && touchesDifferentRole(composed.roleAt, output, x, y, role)) {
    amount -= 0.16 * strength;
  }

  if (settings.rimLight > 0 && isRimPixel(composed.roleAt, output, x, y, role, lx, ly)) {
    amount += (settings.rimLight / 100) * 0.45;
  }

  return amount >= 0 ? lighten(color, amount) : darken(color, -amount);
}

function applyOutlines(colors, composed, settings, output) {
  if (settings.outlineMode === "off") return;
  const base = new Uint8ClampedArray(colors.imageData.data);
  const roleAt = composed.roleAt;
  applyPixelPerfectOutline(colors, composed, settings, output);

  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const index = y * output.width + x;
      const role = roleAt[index];
      const config = outlineConfig(role, settings);
      if (!role || !config.enabled || config.mode === "off" || config.thickness <= 0) continue;
      const thickness = config.thickness;
      for (let oy = -thickness; oy <= thickness; oy += 1) {
        for (let ox = -thickness; ox <= thickness; ox += 1) {
          if (Math.abs(ox) + Math.abs(oy) > thickness + 1) continue;
          const nx = x + ox;
          const ny = y + oy;
          if (!inside(nx, ny, output)) continue;
          const nIndex = ny * output.width + nx;
          const neighborRole = roleAt[nIndex];
          const shouldExternal = !config.pixelPerfect && !neighborRole && config.mode !== "separation";
          const shouldInternal = neighborRole
            && neighborRole !== role
            && internalOutline(role, neighborRole, settings, config.mode)
            && role === internalOutlineWinner(role, neighborRole, config.mode);
          if (!shouldExternal && !shouldInternal) continue;
          const outline = outlineColor(role, settings, config.color);
          const target = shouldInternal ? index : nIndex;
          const offset = target * 4;
          colors.imageData.data[offset] = outline.r;
          colors.imageData.data[offset + 1] = outline.g;
          colors.imageData.data[offset + 2] = outline.b;
          colors.imageData.data[offset + 3] = 255;
          colors.colorAt[target] = rgbToHex(outline.r, outline.g, outline.b);
        }
      }
    }
  }

  if (settings.outlineMode === "silhouette") {
    for (let index = 0; index < roleAt.length; index += 1) {
      const role = roleAt[index];
      if (role && outlineConfig(role, settings).mode === "silhouette") {
        const offset = index * 4;
        colors.imageData.data[offset] = base[offset];
        colors.imageData.data[offset + 1] = base[offset + 1];
        colors.imageData.data[offset + 2] = base[offset + 2];
        colors.imageData.data[offset + 3] = base[offset + 3];
      }
    }
  }

  cleanupExternalOutlineOrphans(colors, composed, output);
}

function applyPixelPerfectOutline(colors, composed, settings, output) {
  const roleAt = composed.roleAt;
  const candidates = new Map();
  const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const index = y * output.width + x;
      const role = roleAt[index];
      const config = outlineConfig(role, settings);
      if (!role || !config.enabled || config.mode === "off" || !config.pixelPerfect || config.mode === "separation") continue;
      for (const [ox, oy] of offsets) {
        const nx = x + ox;
        const ny = y + oy;
        if (!inside(nx, ny, output)) continue;
        const target = ny * output.width + nx;
        if (roleAt[target]) continue;
        candidates.set(target, role);
      }
    }
  }

  const keep = [];
  for (const [index, role] of candidates.entries()) {
    const x = index % output.width;
    const y = (index / output.width) | 0;
    if (countRoleNeighbors(roleAt, output, x, y, 4) === 0) continue;
    if (createsOutlineDoubleBlock(candidates, roleAt, output, x, y)) continue;
    keep.push([index, role]);
  }

  keep.forEach(([index, role]) => {
    const outline = outlineColor(role, settings, outlineConfig(role, settings).color);
    const offset = index * 4;
    colors.imageData.data[offset] = outline.r;
    colors.imageData.data[offset + 1] = outline.g;
    colors.imageData.data[offset + 2] = outline.b;
    colors.imageData.data[offset + 3] = 255;
    colors.colorAt[index] = rgbToHex(outline.r, outline.g, outline.b);
  });
}

function cleanupExternalOutlineOrphans(colors, composed, output) {
  const data = colors.imageData.data;
  const clear = [];
  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const index = y * output.width + x;
      if (composed.roleAt[index] || data[index * 4 + 3] === 0) continue;
      const base4 = countRoleNeighbors(composed.roleAt, output, x, y, 4);
      const base8 = countRoleNeighbors(composed.roleAt, output, x, y, 8);
      const outline8 = countExternalOutlineNeighbors(data, composed.roleAt, output, x, y);
      if (base4 === 0 && base8 === 0 && outline8 === 0) {
        clear.push(index);
      }
    }
  }
  clear.forEach(index => clearOutlinePixel(colors, index));
}

function countExternalOutlineNeighbors(data, roleAt, output, x, y) {
  let count = 0;
  forEachNeighbor(output, x, y, 8, (nx, ny) => {
    const index = ny * output.width + nx;
    if (!roleAt[index] && data[index * 4 + 3] > 0) count += 1;
  });
  return count;
}

function clearOutlinePixel(colors, index) {
  const offset = index * 4;
  colors.imageData.data[offset] = 0;
  colors.imageData.data[offset + 1] = 0;
  colors.imageData.data[offset + 2] = 0;
  colors.imageData.data[offset + 3] = 0;
  colors.colorAt[index] = null;
}

function createsOutlineDoubleBlock(candidates, roleAt, output, x, y) {
  const index = y * output.width + x;
  const corners = [
    [[0, 0], [-1, 0], [0, -1], [-1, -1]],
    [[0, 0], [1, 0], [0, -1], [1, -1]],
    [[0, 0], [-1, 0], [0, 1], [-1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]]
  ];
  return corners.some(block => {
    const cells = block.map(([ox, oy]) => ({ x: x + ox, y: y + oy }));
    if (cells.some(cell => !inside(cell.x, cell.y, output))) return false;
    const outlineCount = cells.filter(cell => {
      const cellIndex = cell.y * output.width + cell.x;
      return cellIndex === index || candidates.has(cellIndex);
    }).length;
    const baseCount = cells.filter(cell => roleAt[cell.y * output.width + cell.x]).length;
    return outlineCount >= 3 && baseCount === 0;
  });
}

function applyFrameAnchor(colors, settings, output, bounds) {
  const enabled = settings.frameAnchor?.bottom === true;
  const baselineY = output.height - 1;
  const empty = !bounds;
  const shiftY = enabled && bounds ? baselineY - bounds.maxY : 0;
  if (shiftY !== 0) shiftColorBuffer(colors, output, 0, shiftY);
  return {
    mode: enabled ? "bottom" : "source",
    enabled,
    baselineY,
    shiftX: 0,
    shiftY,
    preAnchorBounds: bounds,
    empty
  };
}

function shiftColorBuffer(colors, output, shiftX, shiftY) {
  const source = new Uint8ClampedArray(colors.imageData.data);
  const sourceColors = colors.colorAt.slice();
  colors.imageData.data.fill(0);
  colors.colorAt.fill(null);
  for (let y = 0; y < output.height; y += 1) {
    for (let x = 0; x < output.width; x += 1) {
      const sourceIndex = y * output.width + x;
      const sourceOffset = sourceIndex * 4;
      if (source[sourceOffset + 3] === 0) continue;
      const nx = x + shiftX;
      const ny = y + shiftY;
      if (!inside(nx, ny, output)) continue;
      const targetIndex = ny * output.width + nx;
      const targetOffset = targetIndex * 4;
      colors.imageData.data[targetOffset] = source[sourceOffset];
      colors.imageData.data[targetOffset + 1] = source[sourceOffset + 1];
      colors.imageData.data[targetOffset + 2] = source[sourceOffset + 2];
      colors.imageData.data[targetOffset + 3] = source[sourceOffset + 3];
      colors.colorAt[targetIndex] = sourceColors[sourceIndex];
    }
  }
}

function deriveWeaponPose(points, boxes, animation, frame, output) {
  const weaponPoints = points.filter(point => point.role === "weapon");
  const smearPoints = points.filter(point => point.role === "smear");
  const swingPoints = smearPoints.length > weaponPoints.length * 1.5 ? smearPoints : [...weaponPoints, ...smearPoints];
  const handBox = boxes.front_arm || boxes.back_arm || boxes.torso || boxes.head || boundsForPoints(points);
  const weaponBox = boxes.weapon || boxes.smear;
  let anchor = handBox ? { x: handBox.cx, y: handBox.cy } : { x: output.width / 2, y: output.height / 2 };
  let tip = weaponBox ? farthestPoint([...weaponPoints, ...smearPoints], anchor) : null;

  if (swingPoints.length) {
    anchor = nearestPointToBox(swingPoints, handBox);
    tip = farthestPoint(swingPoints, anchor);
  } else if (handBox) {
    tip = { x: handBox.cx + 18, y: handBox.cy - 2 };
  }

  const dx = (tip?.x ?? anchor.x + 18) - anchor.x;
  const dy = (tip?.y ?? anchor.y) - anchor.y;
  const length = Math.max(10, Math.hypot(dx, dy));
  const angleDeg = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
  const scale = animation?.frameWidth > 80 ? 1.25 : animation?.frameWidth > 64 ? 1.12 : 1;
  return {
    anchor: { x: Math.round(anchor.x), y: Math.round(anchor.y) },
    tip: { x: Math.round(tip?.x ?? anchor.x + 18), y: Math.round(tip?.y ?? anchor.y) },
    angleDeg,
    length: Math.round(length),
    scale,
    source: swingPoints.length
      ? (smearPoints.length > weaponPoints.length * 1.5 ? "source-smear-axis" : "source-weapon-axis")
      : "front-hand-default"
  };
}

function deriveHeadPose(composed, animation, frame, output) {
  const head = composed.boxes?.head;
  if (!head) {
    return {
      angleDeg: 0,
      turn: "right-profile",
      confidence: 0,
      source: "missing-head"
    };
  }

  const text = `${animation?.id || ""} ${animation?.name || ""} ${animation?.folder || ""} ${animation?.file || ""}`.toLowerCase();
  const frameIndex = Number(frame?.index || 0);
  const frameCount = Math.max(1, Number(animation?.frameCount || 1));
  const t = frameCount <= 1 ? 0 : frameIndex / (frameCount - 1);
  const torso = composed.boxes?.torso;
  const relative = torso ? {
    dx: head.cx - torso.cx,
    dy: head.cy - torso.cy
  } : { dx: 0, dy: 0 };
  let angle = 0;
  let turn = "right-profile";
  let source = "side-profile-default";
  let confidence = 0.55;

  if (/\bair[- ]?spin|spin\b/.test(text)) {
    angle = normalizeAngle(frameIndex * (360 / frameCount));
    source = "air-spin-cycle";
    confidence = 0.88;
  } else if (/\broll\b/.test(text)) {
    angle = normalizeAngle(frameIndex * (360 / frameCount) + 25);
    source = "roll-cycle";
    confidence = 0.9;
  } else if (/\bdeath|die|dead\b/.test(text)) {
    angle = t < 0.25 ? 20 : t < 0.55 ? 65 : 92;
    source = "falling-death";
    confidence = 0.82;
  } else if (/\bslide\b/.test(text)) {
    angle = -22;
    source = "slide-lean";
    confidence = 0.78;
  } else if (/\bdash\b/.test(text)) {
    angle = -18;
    source = "dash-lean";
    confidence = 0.78;
  } else if (/\bhurt|damaged|damage\b/.test(text)) {
    angle = -16 + t * 28;
    source = "hurt-recoil";
    confidence = 0.72;
  } else if (/\bjump|land|wall\b/.test(text)) {
    angle = -14 + t * 28;
    source = "jump-arc";
    confidence = 0.72;
  } else if (/\bcrouch\b/.test(text)) {
    angle = 8;
    source = "crouch-forward";
    confidence = 0.68;
  } else if (/\bclimb.*back|back.*climb/.test(text)) {
    angle = 0;
    turn = "back-facing";
    source = "climb-back";
    confidence = 0.7;
  } else if (/\bclimb|ledge\b/.test(text)) {
    angle = clamp((relative.dy + 4) * 3, -28, 28);
    source = "climb-head-body-relation";
    confidence = 0.66;
  } else if (/\brun\b/.test(text)) {
    angle = -7 + Math.sin(t * Math.PI * 2) * 4;
    source = "run-bob";
    confidence = 0.64;
  } else if (/\bwalk\b/.test(text)) {
    angle = -3 + Math.sin(t * Math.PI * 2) * 3;
    source = "walk-bob";
    confidence = 0.62;
  } else if (/\bidle\b/.test(text)) {
    angle = Math.sin(t * Math.PI * 2) * 2;
    source = "idle-breath";
    confidence = 0.62;
  } else if (/\battack|punch|jab|shoot|stab\b/.test(text)) {
    angle = clamp(relative.dy * 2 + (t - 0.5) * 18, -24, 24);
    source = "action-anticipation";
    confidence = 0.64;
  }

  if (turn !== "back-facing" && relative.dx < -head.w * 0.25 && !/\bleft\b/.test(text)) {
    turn = "right-profile-lean-back";
  }
  if (/\bleft\b/.test(text)) {
    turn = "left-source";
  }

  return {
    angleDeg: Math.round(normalizeAngle(angle)),
    turn,
    confidence,
    source,
    center: { x: Math.round(head.cx), y: Math.round(head.cy) },
    radius: {
      x: Math.round(Math.max(2, head.w / 2)),
      y: Math.round(Math.max(2, head.h / 2))
    },
    relativeToTorso: {
      dx: Math.round(relative.dx),
      dy: Math.round(relative.dy)
    }
  };
}

function normalizeAngle(value) {
  let angle = Number(value) || 0;
  while (angle > 180) angle -= 360;
  while (angle <= -180) angle += 360;
  return angle;
}

function applyAccessoryLayer(colors, composed, settings, output, headPose) {
  const accessories = settings.accessories || {};
  const boxes = composed.boxes || {};
  drawEyeAccessory(colors, boxes, output, accessories.eyes, headPose);
}

function drawEyeAccessory(colors, boxes, output, style, headPose) {
  if (!style || style === "none" || !boxes.head) return;
  const head = boxes.head;
  const eye = headPoint(head, headPose, 0.28, -0.08, output);
  const eyeX = eye.x;
  const eyeY = eye.y;
  const dark = "#171311";
  const light = "#f7f1dc";
  const accent = "#6bcbe8";

  if (style === "dot") {
    paintPixel(colors, output, eyeX, eyeY, dark, true);
  } else if (style === "bright") {
    paintPixel(colors, output, eyeX, eyeY, light, true);
    paintPixel(colors, output, eyeX + 1, eyeY, dark, true);
  } else if (style === "line") {
    paintPixel(colors, output, eyeX - 1, eyeY, dark, true);
    paintPixel(colors, output, eyeX, eyeY, dark, true);
  } else if (style === "glow") {
    paintPixel(colors, output, eyeX - 1, eyeY, accent, true);
    paintPixel(colors, output, eyeX, eyeY, "#d6fbff", true);
    paintPixel(colors, output, eyeX + 1, eyeY, mixHex(accent, "#000000", 0.25), true);
  } else if (style === "sleepy") {
    drawAccessoryLine(colors, output, { x: eyeX - 1, y: eyeY }, { x: eyeX + 1, y: eyeY + 1 }, dark, true);
  } else if (style === "wide") {
    paintPixel(colors, output, eyeX - 1, eyeY, light, true);
    paintPixel(colors, output, eyeX, eyeY, dark, true);
    paintPixel(colors, output, eyeX + 1, eyeY, light, true);
  } else if (style === "visor") {
    drawAccessoryLine(colors, output, headPoint(head, headPose, 0.08, -0.08, output), headPoint(head, headPose, 0.45, -0.08, output), "#11151c", true);
    paintPixel(colors, output, eyeX, eyeY, accent, true);
  } else if (style === "dual") {
    const rear = headPoint(head, headPose, 0.05, -0.08, output);
    paintPixel(colors, output, rear.x, rear.y, dark, true);
    paintPixel(colors, output, eyeX, eyeY, dark, true);
  } else if (style === "hollow") {
    paintPixel(colors, output, eyeX - 1, eyeY, "#08090b", true);
    paintPixel(colors, output, eyeX, eyeY, "#08090b", true);
    paintPixel(colors, output, eyeX + 1, eyeY, "#423646", false);
  }
}

function headPoint(head, headPose, localX, localY, output) {
  const radians = ((headPose?.angleDeg || 0) * Math.PI) / 180;
  const rx = Math.max(2, head.w / 2);
  const ry = Math.max(2, head.h / 2);
  const x = localX * rx;
  const y = localY * ry;
  return {
    x: clampInt(Math.round(head.cx + x * Math.cos(radians) - y * Math.sin(radians)), 0, output.width - 1),
    y: clampInt(Math.round(head.cy + x * Math.sin(radians) + y * Math.cos(radians)), 0, output.height - 1)
  };
}

function drawAccessoryLine(colors, output, a, b, color, overwrite) {
  let x0 = a.x;
  let y0 = a.y;
  const x1 = b.x;
  const y1 = b.y;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    paintPixel(colors, output, x0, y0, color, overwrite);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function paintPixel(colors, output, x, y, hex, overwrite) {
  if (!inside(x, y, output)) return;
  const index = y * output.width + x;
  const offset = index * 4;
  if (!overwrite && colors.imageData.data[offset + 3] !== 0) return;
  const rgb = hexToRgb(hex);
  colors.imageData.data[offset] = rgb.r;
  colors.imageData.data[offset + 1] = rgb.g;
  colors.imageData.data[offset + 2] = rgb.b;
  colors.imageData.data[offset + 3] = 255;
  colors.colorAt[index] = hex.toLowerCase();
}

function emptyColorBuffer(output) {
  return {
    imageData: new ImageData(output.width, output.height),
    colorAt: new Array(output.width * output.height).fill(null)
  };
}

function deriveSkeleton(composed, output) {
  const boxes = composed.boxes;
  const nodes = {};
  const bones = [];

  if (boxes.torso) {
    const torso = boxes.torso;
    nodes.root = joint("root", "torso", torso.cx, torso.maxY);
    nodes.pelvis = joint("pelvis", "torso", torso.cx, torso.minY + torso.h * 0.72);
    nodes.chest = joint("chest", "torso", torso.cx, torso.minY + torso.h * 0.28);
    bones.push(bone("spine_lower", "root", "pelvis", "torso"));
    bones.push(bone("spine_upper", "pelvis", "chest", "torso"));
  }

  if (boxes.head) {
    const head = boxes.head;
    nodes.head = joint("head", "head", head.cx, head.cy);
    nodes.neck = joint(
      "neck",
      "head",
      boxes.torso ? boxes.torso.cx : head.cx,
      boxes.torso ? Math.min(boxes.torso.minY, head.maxY + 1) : head.maxY
    );
    bones.push(bone("neck", "neck", "head", "head"));
    if (nodes.chest) bones.push(bone("chest_neck", "chest", "neck", "torso"));
  }

  addLimbSkeleton({ role: "front_arm", distalRole: "hand_front", names: ["front_shoulder", "front_elbow", "front_wrist"], bones, nodes, composed, boxes, output });
  addLimbSkeleton({ role: "back_arm", distalRole: "hand_back", names: ["back_shoulder", "back_elbow", "back_wrist"], bones, nodes, composed, boxes, output });
  addLimbSkeleton({ role: "front_leg", distalRole: "foot_front", names: ["front_hip", "front_knee", "front_ankle"], bones, nodes, composed, boxes, output });
  addLimbSkeleton({ role: "back_leg", distalRole: "foot_back", names: ["back_hip", "back_knee", "back_ankle"], bones, nodes, composed, boxes, output });

  return {
    nodes: Object.fromEntries(Object.entries(nodes).map(([key, value]) => [key, roundJoint(value)])),
    bones: bones.filter(item => nodes[item.a] && nodes[item.b])
  };
}

function addLimbSkeleton({ role, distalRole, names, bones, nodes, composed, boxes, output }) {
  const roleBox = boxes[role];
  const torso = boxes.torso || boxes.head;
  if (!roleBox || roleBox.count < 2 || !torso) return;
  const points = [...rolePoints(composed, role, output), ...rolePoints(composed, distalRole, output)];
  if (points.length < 2) return;
  const attachment = limbAttachmentBox(role, torso);
  const anchorSeed = nearestPointToBox(points, attachment);
  const distalSeed = farthestPoint(points, anchorSeed);
  const axis = axisBetween(anchorSeed, distalSeed);
  const shoulderOrHip = crossSectionJoint(points, anchorSeed, axis, 0.08, 0.18);
  const elbowOrKnee = crossSectionJoint(points, anchorSeed, axis, 0.52, 0.16);
  const wristOrAnkle = crossSectionJoint(points, anchorSeed, axis, 0.94, 0.14);
  nodes[names[0]] = joint(names[0], role, shoulderOrHip.x, shoulderOrHip.y);
  nodes[names[1]] = joint(names[1], role, elbowOrKnee.x, elbowOrKnee.y);
  nodes[names[2]] = joint(names[2], role, wristOrAnkle.x, wristOrAnkle.y);
  bones.push(bone(`${role}_upper`, names[0], names[1], role));
  bones.push(bone(`${role}_lower`, names[1], names[2], role));
}

function limbAttachmentBox(role, torso) {
  const pad = 4;
  const isArm = role.includes("arm");
  const minY = isArm ? torso.minY - 1 : torso.minY + torso.h * 0.48;
  const maxY = isArm ? torso.minY + torso.h * 0.58 : torso.maxY + pad;
  return {
    minX: torso.minX - pad,
    maxX: torso.maxX + pad,
    minY,
    maxY,
    cx: torso.cx,
    cy: (minY + maxY) / 2,
    w: torso.w + pad * 2,
    h: maxY - minY + 1
  };
}

function axisBetween(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length, length };
}

function crossSectionJoint(points, anchor, axis, ratio, bandRatio) {
  const projections = points.map(point => ({
    point,
    projection: (point.x - anchor.x) * axis.x + (point.y - anchor.y) * axis.y
  }));
  const min = Math.min(...projections.map(item => item.projection));
  const max = Math.max(...projections.map(item => item.projection));
  const span = Math.max(1, max - min);
  const target = min + span * ratio;
  const band = Math.max(1.15, span * bandRatio);
  let candidates = projections
    .filter(item => Math.abs(item.projection - target) <= band)
    .map(item => item.point);
  if (!candidates.length) {
    candidates = [projections.reduce((best, item) => (
      Math.abs(item.projection - target) < best.d ? { ...item.point, d: Math.abs(item.projection - target) } : best
    ), { ...points[0], d: Infinity })];
  }
  const sum = candidates.reduce((total, point) => ({
    x: total.x + point.x,
    y: total.y + point.y
  }), { x: 0, y: 0 });
  return {
    x: sum.x / candidates.length,
    y: sum.y / candidates.length
  };
}

function rolePoints(composed, role, output) {
  if (composed.pointsByRole?.[role]) return composed.pointsByRole[role];
  const points = [];
  for (let index = 0; index < composed.roleAt.length; index += 1) {
    if (composed.roleAt[index] !== role) continue;
    points.push({ x: index % output.width, y: (index / output.width) | 0 });
  }
  return points;
}

function nearestPointToBox(points, box) {
  return points.reduce((best, point) => {
    const d = distanceToBoxSquared(point, box);
    return d < best.d ? { ...point, d } : best;
  }, { ...points[0], d: Infinity });
}

function farthestPoint(points, from) {
  return points.reduce((best, point) => {
    const dx = point.x - from.x;
    const dy = point.y - from.y;
    const d = dx * dx + dy * dy;
    return d > best.d ? { ...point, d } : best;
  }, { ...points[0], d: -1 });
}

function midpointJoint(points, anchor, distal) {
  const target = {
    x: anchor.x + (distal.x - anchor.x) * 0.52,
    y: anchor.y + (distal.y - anchor.y) * 0.52
  };
  return points.reduce((best, point) => {
    const dx = point.x - target.x;
    const dy = point.y - target.y;
    const d = dx * dx + dy * dy;
    return d < best.d ? { ...point, d } : best;
  }, { ...points[0], d: Infinity });
}

function joint(name, role, x, y) {
  return { name, role, x, y };
}

function roundJoint(item) {
  return {
    ...item,
    x: Math.round(item.x),
    y: Math.round(item.y)
  };
}

function bone(name, a, b, role) {
  return { name, a, b, role };
}

function distanceToBoxSquared(point, box) {
  const x = clamp(point.x, box.minX, box.maxX);
  const y = clamp(point.y, box.minY, box.maxY);
  const dx = point.x - x;
  const dy = point.y - y;
  return dx * dx + dy * dy;
}

function drawSkeletonOverlay(ctx, skeleton, destX, destY) {
  const nodes = skeleton.nodes || {};
  for (const item of skeleton.bones || []) {
    const a = nodes[item.a];
    const b = nodes[item.b];
    if (!a || !b) continue;
    drawPixelLine(ctx, a, b, "#05070a", destX, destY, 2);
    drawPixelLine(ctx, a, b, skeletonColor(item.role), destX, destY, 1);
  }
  for (const node of Object.values(nodes)) {
    drawJoint(ctx, node, destX, destY);
  }
}

function drawPixelLine(ctx, a, b, color, destX, destY, thickness) {
  let x0 = Math.round(a.x);
  let y0 = Math.round(a.y);
  const x1 = Math.round(b.x);
  const y1 = Math.round(b.y);
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = color;
  while (true) {
    drawPixelBlock(ctx, destX + x0, destY + y0, thickness);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

function drawJoint(ctx, node, destX, destY) {
  const x = destX + Math.round(node.x);
  const y = destY + Math.round(node.y);
  ctx.fillStyle = "#05070a";
  ctx.fillRect(x - 1, y - 1, 3, 3);
  ctx.fillStyle = skeletonColor(node.role);
  ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = "#f8f5d4";
  ctx.fillRect(x, y, 1, 1);
}

function drawPixelBlock(ctx, x, y, thickness) {
  const half = Math.floor(thickness / 2);
  ctx.fillRect(Math.round(x) - half, Math.round(y) - half, thickness, thickness);
}

function skeletonColor(role) {
  if (role === "torso") return "#f8e16c";
  if (ROLE_STYLES[role]) return ROLE_STYLES[role].color;
  return "#f8e16c";
}

function internalOutline(role, neighborRole, settings, mode = effectiveOutlineMode(role, settings)) {
  if (mode === "modules") return true;
  if (mode === "separation") return true;
  if (mode === "limbs") return LIMB_ROLES.includes(role) || LIMB_ROLES.includes(neighborRole);
  return false;
}

function internalOutlineWinner(role, neighborRole, mode) {
  if (mode === "limbs") {
    const roleIsLimb = LIMB_ROLES.includes(role);
    const neighborIsLimb = LIMB_ROLES.includes(neighborRole);
    if (roleIsLimb && !neighborIsLimb) return role;
    if (!roleIsLimb && neighborIsLimb) return neighborRole;
  }
  const roleOrder = ROLE_ORDER.indexOf(role);
  const neighborOrder = ROLE_ORDER.indexOf(neighborRole);
  return roleOrder >= neighborOrder ? role : neighborRole;
}

function outlineTarget(role, settings) {
  if (Object.prototype.hasOwnProperty.call(settings.outlineTargets || {}, role)) {
    return settings.outlineTargets[role];
  }
  if (role === "head") return settings.outlineTargets.head;
  if (role === "torso") return settings.outlineTargets.torso;
  if (LIMB_ROLES.includes(role)) return settings.outlineTargets.limbs;
  if (role === "weapon") return settings.outlineTargets.weapon ?? settings.outlineTargets.props;
  if (role === "smear") return settings.outlineTargets.smear ?? settings.outlineTargets.props;
  return settings.outlineTargets.props;
}

function isRearDepthRole(role) {
  return role === "back_arm" || role === "hand_back" || role === "back_leg" || role === "foot_back";
}

function outlineConfig(role, settings) {
  const enabled = outlineTarget(role, settings);
  const rawMode = settings.outlineMode;
  const legacyPixelPerfect = rawMode === "pixel-perfect";
  const mode = legacyPixelPerfect ? "modules" : rawMode;
  const color = settings.outlineColor;
  const thickness = Number(settings.outlineThickness || 1);
  const pixelPerfect = legacyPixelPerfect || settings.outlinePixelPerfect === true;
  return {
    enabled,
    mode,
    color,
    pixelPerfect,
    thickness: Math.max(0, Math.min(3, Math.round(thickness)))
  };
}

function effectiveOutlineMode(role, settings) {
  return outlineConfig(role, settings).mode;
}

function outlineColor(role, settings, colorMode = settings.outlineColor) {
  if (colorMode === "black") return hexToRgb("#101114");
  if (colorMode === "cool") return hexToRgb("#1b2a36");
  if (isHexColor(colorMode)) return hexToRgb(colorMode);
  const palette = paletteById(settings.palette);
  return hexToRgb(tunedRoleRamp(role, palette, settings).outline);
}

function boxesForComposed(roleAt, width, height) {
  const boxes = {};
  for (let index = 0; index < roleAt.length; index += 1) {
    const role = roleAt[index];
    if (!role) continue;
    const x = index % width;
    const y = (index / width) | 0;
    if (!boxes[role]) boxes[role] = { minX: x, minY: y, maxX: x, maxY: y, count: 0 };
    const box = boxes[role];
    box.minX = Math.min(box.minX, x);
    box.minY = Math.min(box.minY, y);
    box.maxX = Math.max(box.maxX, x);
    box.maxY = Math.max(box.maxY, y);
    box.count += 1;
  }
  for (const box of Object.values(boxes)) {
    box.cx = (box.minX + box.maxX) / 2;
    box.cy = (box.minY + box.maxY) / 2;
    box.w = box.maxX - box.minX + 1;
    box.h = box.maxY - box.minY + 1;
  }
  return boxes;
}

function limbAnchor(roleBox, torso) {
  const corners = [
    { x: roleBox.minX, y: roleBox.minY },
    { x: roleBox.maxX, y: roleBox.minY },
    { x: roleBox.minX, y: roleBox.maxY },
    { x: roleBox.maxX, y: roleBox.maxY },
    { x: roleBox.cx, y: roleBox.minY },
    { x: roleBox.cx, y: roleBox.maxY },
    { x: roleBox.minX, y: roleBox.cy },
    { x: roleBox.maxX, y: roleBox.cy }
  ];
  return corners.reduce((best, point) => {
    const d = distanceSquared(point, torso);
    return d < best.d ? { ...point, d } : best;
  }, { ...corners[0], d: Infinity });
}

function limbAxis(roleBox, anchor) {
  const corners = [
    { x: roleBox.minX, y: roleBox.minY },
    { x: roleBox.maxX, y: roleBox.minY },
    { x: roleBox.minX, y: roleBox.maxY },
    { x: roleBox.maxX, y: roleBox.maxY },
    { x: roleBox.cx, y: roleBox.minY },
    { x: roleBox.cx, y: roleBox.maxY },
    { x: roleBox.minX, y: roleBox.cy },
    { x: roleBox.maxX, y: roleBox.cy }
  ];
  const far = corners.reduce((best, point) => {
    const dx = point.x - anchor.x;
    const dy = point.y - anchor.y;
    const d = dx * dx + dy * dy;
    return d > best.d ? { ...point, d } : best;
  }, { ...corners[0], d: -1 });
  const dx = far.x - anchor.x;
  const dy = far.y - anchor.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}

function boundsForPoints(points) {
  if (!points.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0, cx: 0, cy: 0, w: 1, h: 1 };
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    w: maxX - minX + 1,
    h: maxY - minY + 1
  };
}

function boundsForRoleAt(roleAt, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < roleAt.length; index += 1) {
    if (!roleAt[index]) continue;
    const x = index % width;
    const y = (index / width) | 0;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function boundsForImageData(imageData, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  const data = imageData.data;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      if (data[offset + 3] === 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) return null;
  return {
    x: minX,
    y: minY,
    minX,
    minY,
    maxX,
    maxY,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    w: maxX - minX + 1,
    h: maxY - minY + 1
  };
}

function countRoles(roleAt) {
  const counts = {};
  for (const role of roleAt) {
    if (!role) continue;
    counts[role] = (counts[role] || 0) + 1;
  }
  return counts;
}

function collectRoleColors(colors, roleAt) {
  const roleColors = {};
  for (let index = 0; index < roleAt.length; index += 1) {
    const role = roleAt[index];
    const color = colors.colorAt[index];
    if (!role || !color) continue;
    if (!roleColors[role]) roleColors[role] = {};
    roleColors[role][color] = (roleColors[role][color] || 0) + 1;
  }
  return roleColors;
}

function countFilledNeighbors(layer, output, x, y) {
  let count = 0;
  const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const [ox, oy] of offsets) {
    const nx = x + ox;
    const ny = y + oy;
    if (!inside(nx, ny, output)) continue;
    if (layer[ny * output.width + nx]) count += 1;
  }
  return count;
}

function countRoleNeighbors(roleAt, output, x, y, neighborMode) {
  let count = 0;
  forEachNeighbor(output, x, y, neighborMode, (nx, ny) => {
    if (roleAt[ny * output.width + nx]) count += 1;
  });
  return count;
}

function forEachNeighbor(output, x, y, neighborMode, callback) {
  for (let oy = -1; oy <= 1; oy += 1) {
    for (let ox = -1; ox <= 1; ox += 1) {
      if (ox === 0 && oy === 0) continue;
      if (neighborMode === 4 && Math.abs(ox) + Math.abs(oy) !== 1) continue;
      const nx = x + ox;
      const ny = y + oy;
      if (!inside(nx, ny, output)) continue;
      callback(nx, ny);
    }
  }
}

function touchesDifferentRole(roleAt, output, x, y, role) {
  const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (const [ox, oy] of offsets) {
    const nx = x + ox;
    const ny = y + oy;
    if (!inside(nx, ny, output)) continue;
    const neighbor = roleAt[ny * output.width + nx];
    if (neighbor && neighbor !== role) return true;
  }
  return false;
}

function isRimPixel(roleAt, output, x, y, role, lx, ly) {
  const nx = x - Math.sign(lx || 1);
  const ny = y - Math.sign(ly || 1);
  if (!inside(nx, ny, output)) return true;
  return roleAt[ny * output.width + nx] !== role;
}

function inside(x, y, output) {
  return x >= 0 && y >= 0 && x < output.width && y < output.height;
}

function clampInt(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function distanceSquared(point, box) {
  const dx = point.x - box.cx;
  const dy = point.y - box.cy;
  return dx * dx + dy * dy;
}

function luminance(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function rgbToHex(r, g, b) {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value));
}

function mixHex(a, b, amount) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex(
    Math.round(ca.r + (cb.r - ca.r) * amount),
    Math.round(ca.g + (cb.g - ca.g) * amount),
    Math.round(ca.b + (cb.b - ca.b) * amount)
  );
}

function lighten(color, amount) {
  return {
    r: clamp(Math.round(color.r + (255 - color.r) * amount), 0, 255),
    g: clamp(Math.round(color.g + (255 - color.g) * amount), 0, 255),
    b: clamp(Math.round(color.b + (255 - color.b) * amount), 0, 255)
  };
}

function darken(color, amount) {
  return {
    r: clamp(Math.round(color.r * (1 - amount)), 0, 255),
    g: clamp(Math.round(color.g * (1 - amount)), 0, 255),
    b: clamp(Math.round(color.b * (1 - amount)), 0, 255)
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
