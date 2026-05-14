import { RESOURCE_MANIFEST } from "../data/generated/resourceManifest.js";
import { canvasToPngBlob, downloadBlob } from "../core/export.js";
import {
  DISTAL_LIMB_ROLES,
  MATERIAL_PALETTES,
  cloneRenderSettings,
  effectiveRenderRole,
  effectiveRoleList,
  outputFrame,
  paletteById,
  renderResourceFrame
} from "../core/resourceRenderer.js";

const els = {};
const imageCache = new Map();
const textEncoder = new TextEncoder();
const zoomSteps = [0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8];
const zoomTargets = {
  frame: { canvasId: "previewCanvas", label: "Frame", defaultZoom: 3 },
  sheet: { canvasId: "sheetCanvas", label: "Sheet", defaultZoom: 1 },
  atlas: { canvasId: "atlasCanvas", label: "Atlas", defaultZoom: 0.75 }
};
const ANIMATION_GROUPS = ["Idle", "Move", "Actions", "Attack", "Damage", "Interaction", "Misc"];
const EXPRESSION_MIN = -100;
const EXPRESSION_MAX = 500;
const LOCKED_PROPORTION_GROUPS = {
  armLength: { paths: ["roles.front_arm.length", "roles.back_arm.length"] },
  armThickness: { paths: ["roles.front_arm.thickness", "roles.back_arm.thickness"] },
  legLength: { paths: ["roles.front_leg.length", "roles.back_leg.length"] },
  legThickness: { paths: ["roles.front_leg.thickness", "roles.back_leg.thickness"] }
};
const OUTLINE_LIMB_TARGETS = [
  "front_arm",
  "hand_front",
  "back_arm",
  "hand_back",
  "front_leg",
  "foot_front",
  "back_leg",
  "foot_back"
];
const MODULE_COLOR_ROLES = [
  "head",
  "torso",
  "front_arm",
  "hand_front",
  "back_arm",
  "hand_back",
  "front_leg",
  "foot_front",
  "back_leg",
  "foot_back",
  "weapon",
  "smear"
];
const EXPORT_VARIANTS = [
  { id: "material", label: "Material render", displayMode: "material" },
  { id: "source-rig", label: "Source rig", displayMode: "source" },
  { id: "role-mask", label: "Role mask", displayMode: "role-mask" },
  { id: "contour", label: "Contour mono", displayMode: "contour" }
];

let animation = RESOURCE_MANIFEST.animations.find(item => item.name === "Idle") || RESOURCE_MANIFEST.animations[0];
let frame = 0;
let playTimer = null;
let renderSettings = cloneRenderSettings();
let zooms = Object.fromEntries(Object.entries(zoomTargets).map(([key, item]) => [key, item.defaultZoom]));
let activeZoomTarget = "frame";
let atlasRenderToken = 0;
let viewMode = "frame-sheet";
let backgroundMode = "tiles";
let subGrid = { mode: "off", customSize: 16 };
let frameDurations = {};
let expressionStrengths = {};
let favoriteAnimationIds = new Set();
let exportAnimationIds = new Set();
let playbackToken = 0;
let exportPreviewAnimationId = null;
let exportPreviewFrame = 0;
let exportPreviewTimer = null;

boot();

function boot() {
  cacheElements();
  populateAnimationSelect();
  populatePaletteSelect();
  initializeAnimationState();
  setupStandardMarkers();
  bindEvents();
  syncControlsFromSettings();
  selectAnimation(animation.id);
}

function cacheElements() {
  [
    "animationSelect",
    "welcomeOverlay",
    "welcomeLoadBtn",
    "welcomeCreateBtn",
    "viewMode",
    "displayMode",
    "skeletonOverlay",
    "backgroundMode",
    "subGridMode",
    "subGridCustomSize",
    "subGridCustomField",
    "playBtn",
    "prevFrameBtn",
    "nextFrameBtn",
    "zoomOutBtn",
    "zoomInBtn",
    "zoomResetBtn",
    "zoomTargetSelect",
    "zoomLevelText",
    "importSettingsBtn",
    "settingsFileInput",
    "exportZipBtn",
    "exportDialog",
    "exportCloseBtn",
    "exportDownloadBtn",
    "exportPreviewPlayBtn",
    "exportPreviewCanvas",
    "exportPreviewLabel",
    "resetProportionsBtn",
    "favoriteAnimationBtn",
    "frameDurationInput",
    "exportAnimationList",
    "exportSelectionText",
    "exportStandardBtn",
    "exportFavoritesBtn",
    "exportAllBtn",
    "exportNoneBtn",
    "frameSlider",
    "frameLabel",
    "currentAnimationText",
    "currentFrameText",
    "modeLabel",
    "cellSizeText",
    "outputCanvasText",
    "frameCountText",
    "sheetSizeText",
    "sourcePathText",
    "boundsText",
    "sheetLabel",
    "atlasLabel",
    "stageBody",
    "framePanel",
    "sheetPanel",
    "atlasPanel",
    "previewCanvas",
    "sheetCanvas",
    "atlasCanvas",
    "paletteSelect",
    "palettePreview",
    "colorTuneEnabled",
    "colorTuneControls",
    "outlineMode",
    "outlinePixelPerfect",
    "outlineColor",
    "outlineThickness",
    "outlineThicknessValue",
    "shadingMode",
    "shadingStrength",
    "shadingStrengthValue",
    "lightDirection",
    "lightDirectionValue",
    "rearDepth",
    "rearDepthValue",
    "rimLight",
    "rimLightValue",
    "ambientOcclusion",
    "anchorBottom",
    "distalRoleMerge",
    "lockArmLength",
    "lockArmThickness",
    "lockLegLength",
    "lockLegThickness",
    "figureScaleX",
    "figureScaleY",
    "figureScaleLock",
    "eyesAccessory",
    "expressionStrength",
    "expressionStrengthValue",
    "randomSeedInput",
    "applySeedBtn",
    "randomizeBtn",
    "headShapeSelect",
    "limbShapeSelect"
  ].forEach(id => {
    els[id] = document.getElementById(id);
  });
  els.settingInputs = Array.from(document.querySelectorAll("[data-setting]"));
  els.roleToggles = Array.from(document.querySelectorAll("[data-role-enabled]"));
  els.outlineTargets = Array.from(document.querySelectorAll("[data-outline-target]"));
  els.colorInputs = Array.from(document.querySelectorAll("[data-color-role]"));
}

function populateAnimationSelect() {
  const groups = groupedAnimations(sortedAnimations(RESOURCE_MANIFEST.animations));

  animationGroupOrder(groups).forEach(group => {
    const items = groups.get(group) || [];
    if (!items.length) return;
    const optgroup = document.createElement("optgroup");
    optgroup.label = group;
    items.forEach(item => {
      const option = new Option(`${item.name} (${item.frameCount}f)`, item.id);
      optgroup.appendChild(option);
    });
    els.animationSelect.appendChild(optgroup);
  });
}

function sortedAnimations(items) {
  return [...items].sort((a, b) => {
    const groupDelta = animationGroupRank(animationGroup(a)) - animationGroupRank(animationGroup(b));
    if (groupDelta) return groupDelta;
    return animationSortLabel(a).localeCompare(animationSortLabel(b), undefined, { sensitivity: "base", numeric: true });
  });
}

function groupedAnimations(items) {
  const groups = new Map(ANIMATION_GROUPS.map(group => [group, []]));
  items.forEach(item => {
    const group = animationGroup(item);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  });
  return groups;
}

function animationGroupOrder(groups) {
  const known = ANIMATION_GROUPS.filter(group => groups.has(group));
  const extra = [...groups.keys()]
    .filter(group => !ANIMATION_GROUPS.includes(group))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }));
  return [...known, ...extra];
}

function animationGroupRank(group) {
  const index = ANIMATION_GROUPS.indexOf(group);
  return index === -1 ? ANIMATION_GROUPS.length : index;
}

function animationGroup(item) {
  const text = animationSortLabel(item);
  if (/\b(sword|katana|shoot|shooting|aim|attack|stab|punch|jab|cross)\b/.test(text)) return "Attack";
  if (/\b(hurt|damaged|damage|death|die|dead)\b/.test(text)) return "Damage";
  if (/\b(push|pull|hold|grab)\b/.test(text) && !/\bledge\b/.test(text)) return "Interaction";
  if (/\b(crouch[- ]?walk|walk|run)\b/.test(text)) return "Move";
  if (/\b(idle|crouch[- ]?idle)\b/.test(text)) return "Idle";
  if (/\b(jump|roll|dash|slide|climb|ledge|land|wall|air[- ]?spin|spin)\b/.test(text)) return "Actions";
  return "Misc";
}

function animationSortLabel(item) {
  return `${item.name} ${item.folder} ${item.file} ${item.id}`.toLowerCase();
}

function populatePaletteSelect() {
  const groups = new Map();
  MATERIAL_PALETTES.forEach(item => {
    const group = item.category || "Character presets";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  });
  els.paletteSelect.innerHTML = [...groups.entries()]
    .map(([group, items]) => `
      <optgroup label="${escapeHtml(group)}">
        ${items.map(item => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join("")}
      </optgroup>
    `)
    .join("");
}

function initializeAnimationState() {
  sortedAnimations(RESOURCE_MANIFEST.animations).forEach(item => ensureFrameDurations(item));
  exportAnimationIds = new Set(standardExportAnimationIds());
  renderExportAnimationList();
}

function setupStandardMarkers() {
  const defaults = cloneRenderSettings();
  els.settingInputs.forEach(input => {
    if (input.type !== "range") return;
    const standard = getNested(defaults, input.dataset.setting) ?? Number(input.defaultValue || input.value);
    const wrapper = document.createElement("div");
    wrapper.className = "range-standard-wrap";

    const marker = document.createElement("button");
    marker.className = "standard-reset-btn";
    marker.type = "button";
    marker.dataset.standardReset = input.dataset.setting;
    marker.dataset.standardValue = String(standard);
    marker.title = `Reset to standard ${Number(standard).toFixed(2)}x`;
    marker.setAttribute("aria-label", `Reset ${input.dataset.setting} to standard`);
    marker.textContent = "\u21ba";
    marker.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      resetSettingInputToStandard(input);
    });

    const header = input.closest(".slider-field")?.querySelector(":scope > label");
    const valueNode = header?.querySelector("b");
    const textNode = header
      ? [...header.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      : null;
    if (header && valueNode && textNode) {
      const labelGroup = document.createElement("span");
      labelGroup.className = "slider-label-main";
      const labelText = document.createElement("span");
      labelText.className = "slider-label-text";
      labelText.textContent = textNode.textContent.trim();
      labelGroup.append(labelText, marker);
      textNode.remove();
      header.insertBefore(labelGroup, valueNode);
    } else {
      wrapper.append(marker);
    }

    input.parentNode.insertBefore(wrapper, input);
    wrapper.append(input);
  });
}

function bindEvents() {
  els.welcomeCreateBtn.addEventListener("click", () => {
    els.welcomeOverlay.classList.add("hidden");
  });
  els.welcomeLoadBtn.addEventListener("click", () => els.settingsFileInput.click());
  els.animationSelect.addEventListener("change", event => selectAnimation(event.target.value));
  els.viewMode.addEventListener("change", () => {
    viewMode = els.viewMode.value;
    activeZoomTarget = viewMode === "atlas" ? "atlas" : viewMode === "sheet" ? "sheet" : "frame";
    els.zoomTargetSelect.value = activeZoomTarget;
    updateViewMode();
    renderAll();
  });
  els.displayMode.addEventListener("change", renderAll);
  els.skeletonOverlay.addEventListener("change", () => {
    renderSettings.skeletonOverlay = els.skeletonOverlay.checked;
    renderAll();
  });
  els.backgroundMode.addEventListener("change", () => {
    backgroundMode = els.backgroundMode.value;
    renderAll();
  });
  els.subGridMode.addEventListener("change", () => {
    subGrid.mode = els.subGridMode.value;
    syncSubGridControls();
    renderAll();
  });
  els.subGridCustomSize.addEventListener("input", () => {
    subGrid.customSize = clampNumber(Number(els.subGridCustomSize.value), 2, 96, 16);
    renderAll();
  });
  els.frameSlider.addEventListener("input", event => {
    frame = Number(event.target.value);
    renderCurrentFrame();
    renderSheet();
  });
  els.frameDurationInput.addEventListener("input", () => {
    setFrameDuration(animation.id, frame, Number(els.frameDurationInput.value));
    renderSheet();
  });
  els.prevFrameBtn.addEventListener("click", () => stepFrame(-1));
  els.nextFrameBtn.addEventListener("click", () => stepFrame(1));
  els.playBtn.addEventListener("click", togglePlayback);
  els.sheetCanvas.addEventListener("click", handleSheetClick);
  els.favoriteAnimationBtn.addEventListener("click", toggleCurrentFavorite);
  els.zoomTargetSelect.addEventListener("change", () => {
    activeZoomTarget = els.zoomTargetSelect.value;
    applyZoom();
  });
  els.zoomOutBtn.addEventListener("click", () => changeZoom(-1));
  els.zoomInBtn.addEventListener("click", () => changeZoom(1));
  els.zoomResetBtn.addEventListener("click", () => setZoom(zoomTargets[activeZoomTarget].defaultZoom, activeZoomTarget));
  els.importSettingsBtn.addEventListener("click", () => els.settingsFileInput.click());
  els.settingsFileInput.addEventListener("change", importSettingsFile);
  els.exportZipBtn.addEventListener("click", openExportDialog);
  els.exportCloseBtn.addEventListener("click", closeExportDialog);
  els.exportDownloadBtn.addEventListener("click", exportZip);
  els.exportPreviewPlayBtn.addEventListener("click", toggleExportPreviewPlayback);
  els.exportDialog.addEventListener("click", event => {
    if (event.target === els.exportDialog) closeExportDialog();
  });
  els.exportStandardBtn.addEventListener("click", () => setExportSelection("standard"));
  els.exportFavoritesBtn.addEventListener("click", () => setExportSelection("favorites"));
  els.exportAllBtn.addEventListener("click", () => setExportSelection("all"));
  els.exportNoneBtn.addEventListener("click", () => setExportSelection("none"));
  els.exportAnimationList.addEventListener("change", event => {
    const input = event.target.closest("[data-export-animation]");
    if (!input) return;
    if (input.checked) {
      exportAnimationIds.add(input.dataset.exportAnimation);
      exportPreviewAnimationId = input.dataset.exportAnimation;
      exportPreviewFrame = 0;
    } else {
      exportAnimationIds.delete(input.dataset.exportAnimation);
      if (exportPreviewAnimationId === input.dataset.exportAnimation) {
        exportPreviewAnimationId = selectedExportAnimations()[0]?.id || null;
        exportPreviewFrame = 0;
      }
    }
    updateExportSelectionUi();
  });
  els.exportAnimationList.addEventListener("input", event => {
    const slider = event.target.closest("[data-export-expression]");
    if (!slider) return;
    const item = RESOURCE_MANIFEST.animations.find(entry => entry.id === slider.dataset.exportExpression);
    if (!item) return;
    setExpressionStrength(item, Number(slider.value));
    const value = expressionStrength(item);
    slider.value = String(value);
    const row = slider.closest("[data-export-row]");
    const valueNode = row?.querySelector("[data-export-expression-value]");
    if (valueNode) valueNode.textContent = `${value}%`;
    if (animation.id === item.id) {
      syncExpressionControl();
      renderAll();
    }
    if (item.id === exportPreviewAnimationId || exportAnimationIds.has(item.id)) renderExportPreview();
  });
  els.exportAnimationList.addEventListener("click", async event => {
    const viewButton = event.target.closest("[data-export-view]");
    if (viewButton) {
      event.preventDefault();
      exportPreviewAnimationId = viewButton.dataset.exportView;
      exportPreviewFrame = 0;
      renderExportAnimationList();
      renderExportPreview();
      await selectAnimation(viewButton.dataset.exportView);
      return;
    }
    if (event.target.closest("[data-export-expression]")) return;
    if (event.target.closest("[data-export-animation]")) return;
    const row = event.target.closest("[data-export-row]");
    if (!row) return;
    const input = row.querySelector("[data-export-animation]");
    if (!input) return;
    input.checked = !input.checked;
    if (input.checked) {
      exportAnimationIds.add(input.dataset.exportAnimation);
      exportPreviewAnimationId = input.dataset.exportAnimation;
      exportPreviewFrame = 0;
    } else {
      exportAnimationIds.delete(input.dataset.exportAnimation);
      if (exportPreviewAnimationId === input.dataset.exportAnimation) {
        exportPreviewAnimationId = selectedExportAnimations()[0]?.id || null;
        exportPreviewFrame = 0;
      }
    }
    exportPreviewFrame = 0;
    updateExportSelectionUi();
  });
  [
    [els.previewCanvas, "frame"],
    [els.sheetCanvas, "sheet"],
    [els.atlasCanvas, "atlas"]
  ].forEach(([canvas, target]) => {
    canvas.addEventListener("mouseenter", () => {
      activeZoomTarget = target;
      els.zoomTargetSelect.value = target;
      applyZoom();
    });
    canvas.addEventListener("wheel", event => {
      event.preventDefault();
      activeZoomTarget = target;
      els.zoomTargetSelect.value = target;
      changeZoom(event.deltaY > 0 ? -1 : 1, target);
    }, { passive: false });
  });

  els.resetProportionsBtn.addEventListener("click", resetProportions);

  els.settingInputs.forEach(input => {
    input.addEventListener("input", () => {
      setNested(renderSettings, input.dataset.setting, Number(input.value));
      applyLinkedSettingInput(input);
      syncLockedProportionInput(input);
      if (input.id === "figureScaleX" && renderSettings.figureScale.lock) {
        renderSettings.figureScale.y = renderSettings.figureScale.x;
        els.figureScaleY.value = input.value;
        updateSettingValue(els.figureScaleY);
      } else if (input.id === "figureScaleY" && renderSettings.figureScale.lock) {
        renderSettings.figureScale.x = renderSettings.figureScale.y;
        els.figureScaleX.value = input.value;
        updateSettingValue(els.figureScaleX);
      }
      updateSettingValue(input);
      renderAll();
    });
  });

  els.figureScaleLock.addEventListener("change", () => {
    renderSettings.figureScale.lock = els.figureScaleLock.checked;
    if (renderSettings.figureScale.lock) {
      renderSettings.figureScale.y = renderSettings.figureScale.x;
      els.figureScaleY.value = String(renderSettings.figureScale.y);
      updateSettingValue(els.figureScaleY);
      renderAll();
    }
  });

  [
    [els.lockArmLength, "armLength"],
    [els.lockArmThickness, "armThickness"],
    [els.lockLegLength, "legLength"],
    [els.lockLegThickness, "legThickness"]
  ].forEach(([input, key]) => {
    input.addEventListener("change", () => {
      renderSettings.proportionLocks[key] = input.checked;
      if (input.checked) syncLockedProportionGroup(key);
      renderAll();
    });
  });

  els.roleToggles.forEach(input => {
    input.addEventListener("change", () => {
      const role = input.dataset.roleEnabled;
      renderSettings.roles[role].enabled = input.checked;
      syncProportionVisibility();
      renderAll();
    });
  });
  els.distalRoleMerge.addEventListener("change", () => {
    renderSettings.roleMerge = renderSettings.roleMerge || {};
    renderSettings.roleMerge.distalLimbs = els.distalRoleMerge.checked;
    syncMergedRoleControls();
    syncProportionVisibility();
    renderPalettePreview();
    syncColorInputs();
    renderColorTunePaletteChoices();
    renderAll();
  });

  [
    [els.eyesAccessory, "eyes"]
  ].forEach(([select, key]) => {
    select.addEventListener("change", () => {
      renderSettings.accessories[key] = select.value;
      renderAll();
    });
  });
  els.expressionStrength.addEventListener("input", () => {
    setExpressionStrength(animation, Number(els.expressionStrength.value));
    syncExpressionControl();
    renderAll();
  });
  [
    [els.headShapeSelect, "headShape"],
    [els.limbShapeSelect, "limbShape"]
  ].forEach(([select, key]) => {
    select.addEventListener("change", () => {
      renderSettings.experimental[key] = select.value;
      renderAll();
    });
  });
  els.randomizeBtn.addEventListener("click", randomizeEverything);
  els.applySeedBtn.addEventListener("click", applySeedFromInput);
  els.randomSeedInput.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    applySeedFromInput();
  });

  els.outlineTargets.forEach(input => {
    input.addEventListener("change", () => {
      renderSettings.outlineTargets[input.dataset.outlineTarget] = input.checked;
      renderAll();
    });
  });

  els.paletteSelect.addEventListener("change", () => {
    renderSettings.palette = els.paletteSelect.value;
    renderPalettePreview();
    syncColorInputs();
    renderColorTunePaletteChoices();
    renderAll();
  });
  els.colorTuneEnabled.addEventListener("change", () => {
    renderSettings.colorTuning.enabled = els.colorTuneEnabled.checked;
    syncColorTuneVisibility();
    renderPalettePreview();
    renderColorTunePaletteChoices();
    renderAll();
  });
  els.colorInputs.forEach(input => {
    input.addEventListener("input", () => {
      renderSettings.colorTuning.moduleColors[input.dataset.colorRole] = input.value;
      renderPalettePreview();
      renderColorTunePaletteChoices();
      renderAll();
    });
  });
  ["pointerdown", "mousedown"].forEach(type => {
    els.colorTuneControls.addEventListener(type, event => {
      if (!event.target.closest("[data-tune-swatch]")) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  });
  els.colorTuneControls.addEventListener("click", event => {
    const swatch = event.target.closest("[data-tune-swatch]");
    if (!swatch) return;
    event.preventDefault();
    event.stopPropagation();
    const role = swatch.dataset.tuneRole;
    const color = swatch.dataset.tuneSwatch;
    if (!role || !isHexColor(color)) return;
    if (renderSettings.roleMerge?.distalLimbs === true && DISTAL_LIMB_ROLES.includes(role)) return;
    renderSettings.colorTuning.enabled = true;
    renderSettings.colorTuning.moduleColors[role] = color;
    els.colorTuneEnabled.checked = true;
    syncColorInputs();
    renderPalettePreview();
    renderColorTunePaletteChoices();
    syncColorTuneVisibility();
    renderAll();
  });
  els.outlineMode.addEventListener("change", () => {
    renderSettings.outlineMode = els.outlineMode.value;
    renderAll();
  });
  els.outlinePixelPerfect.addEventListener("change", () => {
    renderSettings.outlinePixelPerfect = els.outlinePixelPerfect.checked;
    renderAll();
  });
  els.outlineColor.addEventListener("change", () => {
    renderSettings.outlineColor = els.outlineColor.value;
    renderAll();
  });
  els.outlineThickness.addEventListener("input", () => {
    renderSettings.outlineThickness = Number(els.outlineThickness.value);
    els.outlineThicknessValue.textContent = `${renderSettings.outlineThickness}px`;
    renderAll();
  });
  els.shadingMode.addEventListener("change", () => {
    renderSettings.shadingMode = els.shadingMode.value;
    renderAll();
  });
  els.shadingStrength.addEventListener("input", () => {
    renderSettings.shadingStrength = Number(els.shadingStrength.value);
    els.shadingStrengthValue.textContent = `${renderSettings.shadingStrength}%`;
    renderAll();
  });
  els.lightDirection.addEventListener("input", () => {
    renderSettings.lightDirection = Number(els.lightDirection.value);
    els.lightDirectionValue.textContent = `${renderSettings.lightDirection} deg`;
    renderAll();
  });
  els.rearDepth.addEventListener("input", () => {
    renderSettings.rearDepth = Number(els.rearDepth.value);
    els.rearDepthValue.textContent = `${renderSettings.rearDepth}%`;
    renderAll();
  });
  els.rimLight.addEventListener("input", () => {
    renderSettings.rimLight = Number(els.rimLight.value);
    els.rimLightValue.textContent = `${renderSettings.rimLight}%`;
    renderAll();
  });
  els.ambientOcclusion.addEventListener("change", () => {
    renderSettings.ambientOcclusion = els.ambientOcclusion.checked;
    renderAll();
  });
  els.anchorBottom.addEventListener("change", () => {
    renderSettings.frameAnchor.bottom = els.anchorBottom.checked;
    renderAll();
  });
}

async function selectAnimation(id) {
  const next = RESOURCE_MANIFEST.animations.find(item => item.id === id);
  if (!next) return;
  const wasPlaying = Boolean(playTimer);
  if (wasPlaying) stopPlayback();
  animation = next;
  ensureFrameDurations(animation);
  frame = 0;
  els.animationSelect.value = id;
  els.frameSlider.max = String(Math.max(0, animation.frameCount - 1));
  els.frameSlider.value = "0";
  await loadImage(animation);
  updateAnimationMeta();
  syncFavoriteButton();
  syncExpressionControl();
  renderAll();
  if (wasPlaying && els.viewMode.value === "frame-sheet") startPlayback();
}

async function loadImage(item) {
  if (imageCache.has(item.id)) return imageCache.get(item.id);
  const image = new Image();
  image.decoding = "async";
  image.src = encodeURI(item.path);
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error(`Failed to load ${item.path}`));
  });
  imageCache.set(item.id, image);
  return image;
}

function updateAnimationMeta() {
  const output = outputFrame(animation, RESOURCE_MANIFEST);
  els.cellSizeText.textContent = `${animation.frameWidth}x${animation.frameHeight}`;
  els.outputCanvasText.textContent = `${output.width}x${output.height}`;
  els.frameCountText.textContent = String(animation.frameCount);
  els.sheetSizeText.textContent = `${animation.sourceWidth}x${animation.sourceHeight}`;
  els.sourcePathText.textContent = animation.path.replace(`${RESOURCE_MANIFEST.sourceRoot}/`, "");
  els.sheetLabel.textContent = `${animation.frameCount} frames, ${output.width}x${output.height} cells`;
}

function renderAll() {
  updateViewMode();
  renderCurrentFrame();
  renderSheet();
  if (els.viewMode.value === "atlas") renderAtlasOverview();
  applyZoom();
}

function renderCurrentFrame() {
  const source = imageCache.get(animation.id);
  if (!source) return;
  const current = animation.frames[frame] || animation.frames[0];
  const output = outputFrame(animation, RESOURCE_MANIFEST);
  const canvas = els.previewCanvas;
  canvas.width = output.width;
  canvas.height = output.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  const renderInfo = renderPreviewFrame(ctx, {
    ctx,
    source,
    animation,
    frame: current,
    manifest: RESOURCE_MANIFEST,
    displayMode: els.displayMode.value,
    settings: settingsForAnimation(animation),
    previewOverlays: true
  });

  els.frameLabel.textContent = `${frame} / ${animation.frameCount - 1}`;
  els.frameSlider.value = String(frame);
  els.frameDurationInput.value = String(frameDuration(animation, frame));
  els.currentAnimationText.textContent = animation.name;
  els.currentFrameText.textContent = `${current.index} (${frame + 1} / ${animation.frameCount})`;
  els.modeLabel.textContent = modeLabel();
  els.boundsText.textContent = renderInfo.bounds
    ? `${renderInfo.bounds.w}x${renderInfo.bounds.h} at ${renderInfo.bounds.x},${renderInfo.bounds.y}`
    : "empty";
}

function handleSheetClick(event) {
  if (!animation.frameCount) return;
  const output = outputFrame(animation, RESOURCE_MANIFEST);
  const rect = els.sheetCanvas.getBoundingClientRect();
  const scaleX = els.sheetCanvas.width / rect.width;
  const scaleY = els.sheetCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  if (y < 0 || y >= output.height || x < 0) return;
  const nextFrame = Math.floor(x / output.width);
  if (nextFrame < 0 || nextFrame >= animation.frameCount) return;
  frame = nextFrame;
  renderCurrentFrame();
  renderSheet();
}

function renderSheet() {
  const source = imageCache.get(animation.id);
  if (!source) return;
  const output = outputFrame(animation, RESOURCE_MANIFEST);
  const labelH = 18;
  const width = Math.max(1, animation.frameCount) * output.width;
  const height = output.height + labelH;
  const canvas = els.sheetCanvas;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#101316";
  ctx.fillRect(0, 0, width, height);
  ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "top";

  animation.frames.forEach((item, index) => {
    const x = index * output.width;
    renderPreviewFrame(ctx, {
      ctx,
      source,
      animation,
      frame: item,
      manifest: RESOURCE_MANIFEST,
      displayMode: els.displayMode.value,
      settings: settingsForAnimation(animation),
      destX: x,
      destY: 0,
      previewOverlays: true
    });
    ctx.strokeStyle = item.index === frame ? "#e8bb6d" : "#33464c";
    ctx.strokeRect(x + 0.5, 0.5, output.width - 1, output.height - 1);
    ctx.fillStyle = item.index === frame ? "#e8bb6d" : "#9dadad";
    ctx.fillText(`f${item.index} ${frameDuration(animation, index)}ms`, x + 3, output.height + 3);
  });
  applyZoom();
}

async function renderAtlasOverview() {
  const token = ++atlasRenderToken;
  els.atlasLabel.textContent = "rendering...";
  const settings = cloneCurrentSettings();
  const result = await createAtlasCanvas({
    settings,
    displayMode: els.displayMode.value,
    includeLabels: true,
    previewOverlays: true
  });
  if (token !== atlasRenderToken) return;
  copyCanvas(els.atlasCanvas, result.canvas);
  els.atlasLabel.textContent = `${result.manifest.animations.length} animations, ${result.manifest.atlas.width}x${result.manifest.atlas.height}`;
  applyZoom();
}

function updateViewMode() {
  viewMode = els.viewMode.value;
  els.framePanel.classList.toggle("hidden", viewMode !== "frame-sheet");
  els.sheetPanel.classList.toggle("hidden", viewMode === "atlas");
  els.atlasPanel.classList.toggle("hidden", viewMode !== "atlas");
  els.stageBody.classList.toggle("sheet-only", viewMode === "sheet");
  els.stageBody.classList.toggle("atlas-only", viewMode === "atlas");

  const animated = viewMode === "frame-sheet";
  els.playBtn.disabled = !animated;
  els.prevFrameBtn.disabled = !animated;
  els.nextFrameBtn.disabled = !animated;
  els.frameSlider.disabled = !animated;
  if (!animated) syncPlayback();
}

function changeZoom(delta, target = activeZoomTarget) {
  const currentZoom = zooms[target] ?? zoomTargets[target].defaultZoom;
  const index = zoomSteps.findIndex(item => item === currentZoom);
  const current = index === -1 ? zoomSteps.findIndex(item => item > currentZoom) - 1 : index;
  const nextIndex = Math.min(zoomSteps.length - 1, Math.max(0, current + delta));
  setZoom(zoomSteps[nextIndex], target);
}

function setZoom(value, target = activeZoomTarget) {
  zooms[target] = zoomSteps.reduce((closest, item) => (
    Math.abs(item - value) < Math.abs(closest - value) ? item : closest
  ), zoomSteps[0]);
  applyZoom();
}

function applyZoom() {
  const active = zoomTargets[activeZoomTarget] || zoomTargets.frame;
  const activeZoom = zooms[activeZoomTarget] ?? active.defaultZoom;
  els.zoomTargetSelect.value = activeZoomTarget;
  els.zoomLevelText.textContent = `${active.label} ${Math.round(activeZoom * 100)}%`;
  Object.entries(zoomTargets).forEach(([target, item]) => {
    const canvas = els[item.canvasId];
    if (!canvas) return;
    const zoom = zooms[target] ?? item.defaultZoom;
    canvas.style.width = `${Math.max(1, Math.round(canvas.width * zoom))}px`;
    canvas.style.height = `${Math.max(1, Math.round(canvas.height * zoom))}px`;
  });
}

async function exportZip() {
  const button = els.exportDownloadBtn || els.exportZipBtn;
  const previousLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Exporting...";
  try {
    const pkg = await createExportPackage();
    downloadBlob(pkg.blob, "spritemaster-resource-export.zip");
    closeExportDialog();
  } catch (error) {
    console.error(error);
    window.alert(error.message || "Could not create export ZIP.");
  } finally {
    button.disabled = false;
    button.textContent = previousLabel;
  }
}

function openExportDialog() {
  const selected = selectedExportAnimations();
  exportPreviewAnimationId = selected.some(item => item.id === exportPreviewAnimationId)
    ? exportPreviewAnimationId
    : selected[0]?.id || null;
  exportPreviewFrame = 0;
  renderExportAnimationList();
  renderExportPreview();
  syncExportPreviewPlayback();
  els.exportDialog.classList.remove("hidden");
  els.exportDialog.setAttribute("aria-hidden", "false");
}

function closeExportDialog() {
  stopExportPreviewPlayback();
  els.exportDialog.classList.add("hidden");
  els.exportDialog.setAttribute("aria-hidden", "true");
}

function drawEmptyExportPreview() {
  const canvas = els.exportPreviewCanvas;
  canvas.width = 520;
  canvas.height = 120;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#101316";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#c7d4d4";
  ctx.font = "13px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("No animations selected for export.", 18, 18);
  ctx.fillStyle = "#7f9295";
  ctx.fillText("Select an animation in the export list to preview it.", 18, 42);
}

function toggleExportPreviewPlayback() {
  if (exportPreviewTimer) {
    stopExportPreviewPlayback();
    return;
  }
  startExportPreviewPlayback();
}

function startExportPreviewPlayback() {
  const item = exportPreviewAnimation();
  if (!item || item.frameCount <= 1) return;
  stopExportPreviewPlayback(false);
  els.exportPreviewPlayBtn.textContent = "Pause Preview";
  const tick = async () => {
    const current = exportPreviewAnimation();
    if (!current) {
      stopExportPreviewPlayback();
      return;
    }
    exportPreviewFrame = (exportPreviewFrame + 1) % current.frameCount;
    await renderExportPreview();
    exportPreviewTimer = window.setTimeout(tick, frameDuration(current, exportPreviewFrame));
  };
  exportPreviewTimer = window.setTimeout(tick, frameDuration(item, exportPreviewFrame));
}

function stopExportPreviewPlayback(updateLabel = true) {
  if (exportPreviewTimer) {
    window.clearTimeout(exportPreviewTimer);
    exportPreviewTimer = null;
  }
  if (updateLabel && els.exportPreviewPlayBtn) els.exportPreviewPlayBtn.textContent = "Play Preview";
}

function syncExportPreviewPlayback() {
  const item = exportPreviewAnimation();
  els.exportPreviewPlayBtn.disabled = !item || item.frameCount <= 1;
  if (!item || item.frameCount <= 1) stopExportPreviewPlayback();
}

function exportPreviewAnimation() {
  return RESOURCE_MANIFEST.animations.find(entry => entry.id === exportPreviewAnimationId) || null;
}

function highlightExportPreviewSelection() {
  els.exportAnimationList.querySelectorAll("[data-export-animation]").forEach(input => {
    input.closest("[data-export-row]")?.classList.toggle("active", input.dataset.exportAnimation === exportPreviewAnimationId);
  });
}

async function importSettingsFile() {
  const file = els.settingsFileInput.files?.[0];
  els.settingsFileInput.value = "";
  if (!file) return;
  const previousLabel = els.importSettingsBtn.textContent;
  els.importSettingsBtn.disabled = true;
  els.importSettingsBtn.textContent = "Importing...";
  try {
    const data = JSON.parse(await file.text());
    await applySettingsPreset(data);
  } catch (error) {
    console.error(error);
    window.alert("Could not import settings JSON.");
  } finally {
    els.importSettingsBtn.disabled = false;
    els.importSettingsBtn.textContent = previousLabel;
  }
}

async function createExportPackage() {
  const exportSettings = cloneCurrentSettings();
  const settingsPreset = createSettingsPreset();
  const selectedAnimations = selectedExportAnimations();
  if (!selectedAnimations.length) throw new Error("No animations selected for export.");
  const files = [];
  const variants = {};

  for (const variant of EXPORT_VARIANTS) {
    const atlasResult = await createAtlasCanvas({
      settings: exportSettings,
      displayMode: variant.displayMode,
      includeLabels: false,
      animations: selectedAnimations,
      atlasFile: `${variant.id}/atlas.png`
    });
    const atlasName = `${variant.id}/atlas.png`;
    files.push({
      name: atlasName,
      data: await blobToBytes(await canvasToPngBlob(atlasResult.canvas))
    });

    const animationEntries = [];
    for (const item of selectedAnimations) {
      const sheetResult = await createAnimationSheetCanvas(item, {
        settings: exportSettings,
        displayMode: variant.displayMode
      });
      const fileName = `${variant.id}/animations/${safeName(item.id)}.png`;
      files.push({
        name: fileName,
        data: await blobToBytes(await canvasToPngBlob(sheetResult.canvas))
      });
      animationEntries.push({
        ...atlasResult.manifest.animations.find(entry => entry.id === item.id),
        sheet: {
          file: fileName,
          frameWidth: sheetResult.frameWidth,
          frameHeight: sheetResult.frameHeight,
          width: sheetResult.canvas.width,
          height: sheetResult.canvas.height,
          columns: sheetResult.columns,
          rows: sheetResult.rows,
          frames: sheetResult.frames
        }
      });
    }

    variants[variant.id] = {
      label: variant.label,
      displayMode: variant.displayMode,
      atlas: atlasResult.manifest.atlas,
      animations: animationEntries
    };
  }

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: {
      resource: RESOURCE_MANIFEST.sourceRoot,
      normalizedCanvas: RESOURCE_MANIFEST.outputFrame,
      totalAnimations: RESOURCE_MANIFEST.animations.length
    },
    exportSelection: {
      selectedAnimationIds: selectedAnimations.map(item => item.id),
      favoriteAnimationIds: [...favoriteAnimationIds],
      excludedAnimationIds: sortedAnimations(RESOURCE_MANIFEST.animations)
        .filter(item => !exportAnimationIds.has(item.id))
        .map(item => item.id)
    },
    render: {
      displayMode: "material",
      palette: exportSettings.palette,
      outlineMode: exportSettings.outlineMode,
      outlinePixelPerfect: exportSettings.outlinePixelPerfect,
      outlineColor: exportSettings.outlineColor,
      outlineThickness: exportSettings.outlineThickness,
      skeletonOverlay: exportSettings.skeletonOverlay,
      shadingMode: exportSettings.shadingMode,
      shadingStrength: exportSettings.shadingStrength,
      sourceControlShading: exportSettings.sourceControlShading,
      lightDirection: exportSettings.lightDirection,
      rearDepth: exportSettings.rearDepth,
      rimLight: exportSettings.rimLight,
      ambientOcclusion: exportSettings.ambientOcclusion,
      figureScale: exportSettings.figureScale,
      frameAnchor: exportSettings.frameAnchor,
      colorTuning: exportSettings.colorTuning,
      accessories: exportSettings.accessories,
      experimental: exportSettings.experimental,
      roles: exportSettings.roles,
      outlineTargets: exportSettings.outlineTargets
    },
    settingsFile: "settings.json",
    expressionStrengths,
    variants,
    atlas: variants.material.atlas,
    animations: variants.material.animations
  };

  files.push({
    name: "settings.json",
    data: textEncoder.encode(JSON.stringify(settingsPreset, null, 2))
  });

  files.push({
    name: "manifest.json",
    data: textEncoder.encode(JSON.stringify(manifest, null, 2))
  });

  return {
    blob: createZip(files),
    fileCount: files.length,
    manifest
  };
}

async function createAnimationSheetCanvas(item, options) {
  const source = await loadImage(item);
  const output = outputFrame(item, RESOURCE_MANIFEST);
  const columns = Math.max(1, item.frameCount);
  const canvas = document.createElement("canvas");
  canvas.width = columns * output.width;
  canvas.height = output.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const frames = [];
  item.frames.forEach((sourceFrame, index) => {
    const renderInfo = renderResourceFrame({
      ctx,
      source,
      animation: item,
      frame: sourceFrame,
      manifest: RESOURCE_MANIFEST,
      displayMode: options.displayMode,
      settings: settingsForAnimation(item, options.settings),
      destX: index * output.width,
      destY: 0
    });
    frames.push({
      index,
      sourceIndex: sourceFrame.index,
      x: index * output.width,
      y: 0,
      width: output.width,
      height: output.height,
      durationMs: frameDuration(item, index),
      headPose: renderInfo.headPose,
      weaponPose: renderInfo.weaponPose,
      bounds: renderInfo.bounds,
      bottomAnchor: renderInfo.anchor
    });
  });
  return {
    canvas,
    columns,
    rows: 1,
    frameWidth: output.width,
    frameHeight: output.height,
    frames
  };
}

async function createAtlasCanvas({ settings, displayMode, includeLabels, previewOverlays = false, animations = sortedAnimations(RESOURCE_MANIFEST.animations), atlasFile = "atlas.png" }) {
  animations = sortedAnimations(animations).filter(item => item.frameCount > 0);
  const frameWidth = RESOURCE_MANIFEST.outputFrame.width;
  const frameHeight = RESOURCE_MANIFEST.outputFrame.height;
  const labelWidth = includeLabels ? 220 : 0;
  const rowGap = includeLabels ? 8 : 0;
  const maxFrames = Math.max(...animations.map(item => item.frameCount), 1);
  const width = labelWidth + maxFrames * frameWidth;
  const height = Math.max(1, animations.length * frameHeight + Math.max(0, animations.length - 1) * rowGap);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);
  if (includeLabels) {
    ctx.fillStyle = "#101316";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
    ctx.textBaseline = "top";
  }

  const manifestAnimations = [];
  for (let row = 0; row < animations.length; row += 1) {
    const item = animations[row];
    const source = await loadImage(item);
    const y = row * (frameHeight + rowGap);
    const atlasFrames = [];
    if (includeLabels) {
      ctx.fillStyle = row % 2 === 0 ? "#151d20" : "#11181b";
      ctx.fillRect(0, y, width, frameHeight);
      ctx.fillStyle = "#edf4f4";
      ctx.fillText(item.name, 12, y + 12);
      ctx.fillStyle = "#9dadad";
      ctx.fillText(`${item.frameCount}f  ${item.frameWidth}x${item.frameHeight}`, 12, y + 32);
      ctx.fillText(item.folder, 12, y + 52);
    }

    item.frames.forEach((sourceFrame, index) => {
      const x = labelWidth + index * frameWidth;
      let renderInfo;
      if (includeLabels) {
        renderInfo = renderPreviewFrame(ctx, {
          source,
          animation: item,
          frame: sourceFrame,
          manifest: RESOURCE_MANIFEST,
          displayMode,
          settings: settingsForAnimation(item, settings),
          destX: x,
          destY: y,
          previewOverlays
        });
        ctx.strokeStyle = "#26373d";
        ctx.strokeRect(x + 0.5, y + 0.5, frameWidth - 1, frameHeight - 1);
      } else {
        renderInfo = renderResourceFrame({
          ctx,
          source,
          animation: item,
          frame: sourceFrame,
          manifest: RESOURCE_MANIFEST,
          displayMode,
          settings: settingsForAnimation(item, settings),
          destX: x,
          destY: y
        });
      }
      atlasFrames.push({
        index,
        sourceIndex: sourceFrame.index,
        x,
        y,
        width: frameWidth,
        height: frameHeight,
        durationMs: frameDuration(item, index),
        headPose: renderInfo.headPose,
        weaponPose: renderInfo.weaponPose,
        bounds: renderInfo.bounds,
        bottomAnchor: renderInfo.anchor
      });
    });

    manifestAnimations.push({
      id: item.id,
      name: item.name,
      folder: item.folder,
      source: {
        file: item.path,
        frameWidth: item.frameWidth,
        frameHeight: item.frameHeight,
        width: item.sourceWidth,
        height: item.sourceHeight
      },
      atlas: {
        file: atlasFile,
        row,
        x: labelWidth,
        y,
        width: item.frameCount * frameWidth,
        height: frameHeight,
        frameWidth,
        frameHeight,
        frames: atlasFrames
      }
    });
  }

  return {
    canvas,
    manifest: {
      atlas: {
        file: atlasFile,
        layout: includeLabels ? "overview-with-labels" : "one-animation-per-row",
        width,
        height,
        frameWidth,
        frameHeight,
        labelWidth,
        rowGap
      },
      animations: manifestAnimations
    }
  };
}

function renderPalettePreview() {
  const palette = paletteById(renderSettings.palette);
  const roles = effectiveModuleColorRoles();
  const roleSwatches = roles
    .map(role => `<i style="background:${moduleBaseColor(role, palette)}" title="${role}"></i>`)
    .join("");
  const paletteSwatches = (palette.colors || roles.map(role => moduleBaseColor(role, palette)))
    .map(color => `<i style="background:${color}" title="${color}"></i>`)
    .join("");
  els.palettePreview.innerHTML = `
    <div class="palette-preview-row">
      <b>Modules</b>
      <div class="palette-swatches">${roleSwatches}</div>
    </div>
    <div class="palette-preview-row">
      <b>${palette.colors?.length ? `Full palette (${palette.colors.length})` : "Palette colors"}</b>
      <div class="palette-full-swatches">${paletteSwatches}</div>
    </div>
  `;
}

function moduleBaseColor(role, palette = paletteById(renderSettings.palette)) {
  const effectiveRole = effectiveRenderRole(role, renderSettings);
  const custom = renderSettings.colorTuning.enabled ? renderSettings.colorTuning.moduleColors[effectiveRole] : null;
  return isHexColor(custom) ? custom : (palette.roles[effectiveRole] || palette.roles.other).base;
}

function effectiveModuleColorRoles() {
  return effectiveRoleList(MODULE_COLOR_ROLES, renderSettings);
}

function syncControlsFromSettings() {
  els.displayMode.value = "material";
  els.backgroundMode.value = backgroundMode;
  els.subGridMode.value = subGrid.mode;
  els.subGridCustomSize.value = String(subGrid.customSize);
  syncSubGridControls();
  els.paletteSelect.value = renderSettings.palette;
  els.zoomTargetSelect.value = activeZoomTarget;
  if (renderSettings.outlineMode === "pixel-perfect") {
    renderSettings.outlineMode = "modules";
    renderSettings.outlinePixelPerfect = true;
  }
  els.outlineMode.value = renderSettings.outlineMode;
  els.outlinePixelPerfect.checked = renderSettings.outlinePixelPerfect === true;
  els.outlineColor.value = renderSettings.outlineColor;
  els.outlineThickness.value = String(renderSettings.outlineThickness);
  els.outlineThicknessValue.textContent = `${renderSettings.outlineThickness}px`;
  els.skeletonOverlay.checked = renderSettings.skeletonOverlay === true;
  els.shadingMode.value = renderSettings.shadingMode;
  els.shadingStrength.value = String(renderSettings.shadingStrength);
  els.shadingStrengthValue.textContent = `${renderSettings.shadingStrength}%`;
  els.lightDirection.value = String(renderSettings.lightDirection);
  els.lightDirectionValue.textContent = `${renderSettings.lightDirection} deg`;
  els.rearDepth.value = String(renderSettings.rearDepth);
  els.rearDepthValue.textContent = `${renderSettings.rearDepth}%`;
  els.rimLight.value = String(renderSettings.rimLight);
  els.rimLightValue.textContent = `${renderSettings.rimLight}%`;
  els.ambientOcclusion.checked = renderSettings.ambientOcclusion;
  els.anchorBottom.checked = renderSettings.frameAnchor?.bottom === true;
  els.lockArmLength.checked = renderSettings.proportionLocks?.armLength !== false;
  els.lockArmThickness.checked = renderSettings.proportionLocks?.armThickness !== false;
  els.lockLegLength.checked = renderSettings.proportionLocks?.legLength !== false;
  els.lockLegThickness.checked = renderSettings.proportionLocks?.legThickness !== false;
  els.figureScaleLock.checked = renderSettings.figureScale?.lock !== false;
  els.colorTuneEnabled.checked = renderSettings.colorTuning.enabled;
  els.distalRoleMerge.checked = renderSettings.roleMerge?.distalLimbs === true;
  els.eyesAccessory.value = renderSettings.accessories?.eyes || "none";
  els.headShapeSelect.value = renderSettings.experimental?.headShape || "standard";
  els.limbShapeSelect.value = renderSettings.experimental?.limbShape || "standard";
  syncExpressionControl();

  els.settingInputs.forEach(input => {
    input.value = String(getNested(renderSettings, input.dataset.setting));
    updateSettingValue(input);
  });
  els.roleToggles.forEach(input => {
    const role = input.dataset.roleEnabled;
    input.checked = renderSettings.roles[role]?.enabled !== false;
  });
  els.outlineTargets.forEach(input => {
    input.checked = renderSettings.outlineTargets[input.dataset.outlineTarget] !== false;
  });
  renderPalettePreview();
  syncColorInputs();
  syncColorTuneVisibility();
  syncMergedRoleControls();
  syncProportionVisibility();
  renderColorTunePaletteChoices();
  applyZoom();
}

function syncColorInputs() {
  const palette = paletteById(renderSettings.palette);
  els.colorInputs.forEach(input => {
    input.value = moduleBaseColor(input.dataset.colorRole, palette);
  });
}

function syncColorTuneVisibility() {
  els.colorTuneControls.classList.toggle("hidden", !renderSettings.colorTuning.enabled);
}

function syncSubGridControls() {
  els.subGridCustomField.classList.toggle("hidden", subGrid.mode !== "custom");
}

function syncMergedRoleControls() {
  const merged = renderSettings.roleMerge?.distalLimbs === true;
  const distalRoles = new Set(DISTAL_LIMB_ROLES);
  els.roleToggles.forEach(input => {
    if (!distalRoles.has(input.dataset.roleEnabled)) return;
    input.disabled = merged;
    input.closest("label")?.classList.toggle("control-disabled", merged);
  });
  els.outlineTargets.forEach(input => {
    if (!distalRoles.has(input.dataset.outlineTarget)) return;
    input.disabled = merged;
    input.closest("label")?.classList.toggle("control-disabled", merged);
  });
  els.colorInputs.forEach(input => {
    if (!distalRoles.has(input.dataset.colorRole)) return;
    input.disabled = merged;
    input.closest("label")?.classList.toggle("control-disabled", merged);
  });
  els.settingInputs.forEach(input => {
    const distal = isDistalSettingPath(input.dataset.setting);
    if (!distal) return;
    input.disabled = merged;
    input.closest(".slider-field")?.classList.toggle("control-disabled", merged);
    const resetButton = input.closest(".range-standard-wrap")?.querySelector("[data-standard-reset]");
    if (resetButton) resetButton.disabled = merged;
  });
}

function syncProportionVisibility() {
  els.settingInputs.forEach(input => {
    const field = input.closest(".slider-field");
    if (!field) return;
    const roles = proportionInputRoles(input);
    const hidden = roles.length > 0 && !roles.some(roleControlVisible);
    field.classList.toggle("hidden", hidden);
  });

  [
    [els.lockArmLength, ["front_arm", "back_arm"]],
    [els.lockArmThickness, ["front_arm", "back_arm"]],
    [els.lockLegLength, ["front_leg", "back_leg"]],
    [els.lockLegThickness, ["front_leg", "back_leg"]]
  ].forEach(([input, roles]) => {
    input.closest(".toggle-line")?.classList.toggle("hidden", roles.filter(roleControlVisible).length < 2);
  });

  const scaleVisible = !els.figureScaleX.closest(".slider-field")?.classList.contains("hidden")
    || !els.figureScaleY.closest(".slider-field")?.classList.contains("hidden");
  els.figureScaleLock.closest(".toggle-line")?.classList.toggle("hidden", !scaleVisible);

  document.querySelectorAll(".control-subhead").forEach(head => {
    const roles = proportionSectionRoles(head.textContent);
    if (!roles) return;
    const hidden = roles.length > 0 && !roles.some(roleControlVisible);
    head.classList.toggle("hidden", hidden);
  });
}

function proportionInputRoles(input) {
  const roles = new Set();
  const pathRole = String(input.dataset.setting || "").match(/^roles\.([^.]+)\./)?.[1];
  if (pathRole) roles.add(pathRole);
  input.dataset.linkedRoles?.split(",").map(item => item.trim()).filter(Boolean).forEach(role => roles.add(role));
  return [...roles];
}

function proportionSectionRoles(label) {
  const name = String(label || "").trim().toLowerCase();
  if (name === "head") return ["head"];
  if (name === "torso") return ["torso"];
  if (name === "arms") return ["front_arm", "back_arm", "hand_front", "hand_back"];
  if (name === "legs") return ["front_leg", "back_leg", "foot_front", "foot_back"];
  return null;
}

function roleControlVisible(role) {
  if (renderSettings.roles?.[role]?.enabled === false) return false;
  if (renderSettings.roleMerge?.distalLimbs === true && DISTAL_LIMB_ROLES.includes(role)) return false;
  return true;
}

function isDistalSettingPath(path) {
  return DISTAL_LIMB_ROLES.some(role => String(path || "").startsWith(`roles.${role}.`));
}

function applyLinkedSettingInput(input, nextValue = Number(input.value)) {
  const roles = input.dataset.linkedRoles?.split(",").map(item => item.trim()).filter(Boolean);
  const key = input.dataset.linkedKey;
  if (!roles?.length || !key) return;
  const value = Number(nextValue);
  roles.forEach(role => {
    if (!renderSettings.roles[role]) return;
    renderSettings.roles[role][key] = value;
  });
}

function syncLockedProportionInput(input) {
  const lock = lockedProportionForPath(input.dataset.setting);
  if (!lock || renderSettings.proportionLocks?.[lock.key] === false) return;
  const value = Number(input.value);
  lock.paths.forEach(path => {
    setNested(renderSettings, path, value);
    const peer = els.settingInputs.find(item => item.dataset.setting === path);
    if (peer && peer !== input) {
      peer.value = String(value);
      updateSettingValue(peer);
    }
  });
}

function syncLockedProportionGroup(key) {
  const lock = LOCKED_PROPORTION_GROUPS[key];
  if (!lock) return;
  const value = Number(getNested(renderSettings, lock.paths[0]));
  lock.paths.forEach(path => {
    setNested(renderSettings, path, value);
    const input = els.settingInputs.find(item => item.dataset.setting === path);
    if (input) {
      input.value = String(value);
      updateSettingValue(input);
    }
  });
}

function lockedProportionForPath(path) {
  return Object.entries(LOCKED_PROPORTION_GROUPS)
    .map(([key, group]) => ({ key, ...group }))
    .find(group => group.paths.includes(path));
}

function renderColorTunePaletteChoices() {
  const palette = paletteById(renderSettings.palette);
  const colors = uniquePaletteColors(palette);
  const merged = renderSettings.roleMerge?.distalLimbs === true;
  els.colorInputs.forEach(input => {
    const role = input.dataset.colorRole;
    const current = moduleBaseColor(role, palette).toLowerCase();
    const disabled = merged && DISTAL_LIMB_ROLES.includes(role);
    const label = input.closest("label");
    if (!label) return;
    let swatches = label.querySelector(".module-palette-swatches");
    if (!swatches) {
      swatches = document.createElement("div");
      swatches.className = "module-palette-swatches";
      label.appendChild(swatches);
    }
    swatches.innerHTML = colors
      .map(color => {
        const normalized = color.toLowerCase();
        const active = normalized === current ? " active" : "";
        return `<button type="button" class="module-palette-swatch${active}" data-tune-role="${escapeHtml(role)}" data-tune-swatch="${escapeHtml(normalized)}" style="background:${escapeHtml(normalized)}" title="${escapeHtml(normalized)}"${disabled ? " disabled" : ""}></button>`;
      })
      .join("");
  });
}

function uniquePaletteColors(palette) {
  const roles = effectiveModuleColorRoles();
  const colors = palette.colors || roles.flatMap(role => {
    const ramp = palette.roles[role] || palette.roles.other;
    return [ramp.light, ramp.base, ramp.shadow, ramp.outline];
  });
  return [...new Set(colors.filter(isHexColor).map(color => color.toLowerCase()))];
}

function seedCustomColorsFromPalette(palette) {
  effectiveModuleColorRoles().forEach(role => {
    if (!isHexColor(renderSettings.colorTuning.moduleColors[role])) {
      renderSettings.colorTuning.moduleColors[role] = (palette.roles[role] || palette.roles.other).base;
    }
  });
}

function ensureFrameDurations(item) {
  if (!item?.id) return [];
  const existing = Array.isArray(frameDurations[item.id]) ? frameDurations[item.id] : [];
  frameDurations[item.id] = item.frames.map((_, index) => sanitizeDuration(existing[index], defaultFrameDuration(item, index)));
  return frameDurations[item.id];
}

function frameDuration(item, index) {
  const durations = ensureFrameDurations(item);
  return sanitizeDuration(durations[index], defaultFrameDuration(item, index));
}

function setFrameDuration(animationId, index, value) {
  const item = RESOURCE_MANIFEST.animations.find(entry => entry.id === animationId);
  if (!item) return;
  const durations = ensureFrameDurations(item);
  durations[index] = sanitizeDuration(value, defaultFrameDuration(item, index));
}

function sanitizeDuration(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1000, Math.max(40, Math.round(number / 10) * 10));
}

function defaultFrameDuration(item, index) {
  const group = animationGroup(item);
  const count = Math.max(1, item.frameCount);
  const label = animationSortLabel(item);
  let base = item.frameWidth > 64 ? 110 : 130;
  if (group === "Idle") base = 180;
  if (group === "Move") base = /\brun\b/.test(label) ? 80 : 105;
  if (group === "Attack") base = 85;
  if (group === "Damage") base = 170;
  if (group === "Interaction") base = 140;

  if (count <= 1) return Math.max(base, 220);
  const first = index === 0;
  const last = index === count - 1;
  const contact = index === Math.max(1, Math.floor(count * 0.42));
  const passing = group === "Move" && index % 2 === 0;

  if (group === "Attack") {
    if (first) return base + 70;
    if (contact) return Math.max(50, base - 25);
    if (last) return base + 45;
  }
  if (group === "Idle" && (first || last)) return base + 60;
  if (group === "Move" && passing) return base + 20;
  if (["Actions", "Damage", "Interaction"].includes(group) && (first || last)) return base + 35;
  return base;
}

function cloneFrameDurations() {
  const result = {};
  sortedAnimations(RESOURCE_MANIFEST.animations).forEach(item => {
    result[item.id] = ensureFrameDurations(item).slice();
  });
  return result;
}

function mergeFrameDurations(imported) {
  const next = {};
  sortedAnimations(RESOURCE_MANIFEST.animations).forEach(item => {
    const source = Array.isArray(imported?.[item.id]) ? imported[item.id] : [];
    next[item.id] = item.frames.map((_, index) => sanitizeDuration(source[index], defaultFrameDuration(item, index)));
  });
  return next;
}

function mergeExpressionStrengths(imported) {
  const next = {};
  sortedAnimations(RESOURCE_MANIFEST.animations).forEach(item => {
    next[item.id] = clampNumber(Number(imported?.[item.id]), EXPRESSION_MIN, EXPRESSION_MAX, 0);
  });
  return next;
}

function toggleCurrentFavorite() {
  if (favoriteAnimationIds.has(animation.id)) favoriteAnimationIds.delete(animation.id);
  else {
    favoriteAnimationIds.add(animation.id);
    exportAnimationIds.add(animation.id);
  }
  syncFavoriteButton();
  renderExportAnimationList();
}

function syncFavoriteButton() {
  const active = favoriteAnimationIds.has(animation.id);
  els.favoriteAnimationBtn.classList.toggle("active", active);
  els.favoriteAnimationBtn.textContent = active ? "★" : "☆";
  els.favoriteAnimationBtn.setAttribute("aria-pressed", String(active));
}

function standardExportAnimationIds() {
  const groups = new Set(["Idle", "Move", "Actions", "Attack", "Damage"]);
  const ids = sortedAnimations(RESOURCE_MANIFEST.animations)
    .filter(item => groups.has(animationGroup(item)) && item.frameCount > 0)
    .map(item => item.id);
  favoriteAnimationIds.forEach(id => {
    if (validAnimationId(id) && !ids.includes(id)) ids.push(id);
  });
  return ids;
}

function selectedExportAnimations() {
  return sortedAnimations(RESOURCE_MANIFEST.animations).filter(item => exportAnimationIds.has(item.id));
}

function expressionStrength(item = animation) {
  return clampNumber(Number(expressionStrengths[item.id]), EXPRESSION_MIN, EXPRESSION_MAX, 0);
}

function setExpressionStrength(item, value) {
  if (!item?.id) return;
  expressionStrengths[item.id] = clampNumber(Number(value), EXPRESSION_MIN, EXPRESSION_MAX, 0);
}

function syncExpressionControl() {
  const value = expressionStrength(animation);
  els.expressionStrength.value = String(value);
  els.expressionStrengthValue.textContent = `${value}%`;
}

function settingsForAnimation(item, base = renderSettings) {
  const next = JSON.parse(JSON.stringify(base));
  next.experimental = next.experimental || {};
  next.experimental.expressionStrength = expressionStrength(item);
  return next;
}

function setExportSelection(mode) {
  if (mode === "all") {
    exportAnimationIds = new Set(sortedAnimations(RESOURCE_MANIFEST.animations).map(item => item.id));
  } else if (mode === "favorites") {
    exportAnimationIds = new Set([...favoriteAnimationIds].filter(validAnimationId));
  } else if (mode === "none") {
    exportAnimationIds = new Set();
  } else {
    exportAnimationIds = new Set(standardExportAnimationIds());
  }
  exportPreviewAnimationId = selectedExportAnimations()[0]?.id || null;
  exportPreviewFrame = 0;
  updateExportSelectionUi();
}

function renderExportAnimationListLegacy() {
  const items = sortedAnimations(RESOURCE_MANIFEST.animations);
  els.exportAnimationList.innerHTML = items.map(item => {
    const favorite = favoriteAnimationIds.has(item.id);
    const checked = exportAnimationIds.has(item.id) ? " checked" : "";
    const active = item.id === exportPreviewAnimationId ? " active" : "";
    return `
      <label class="${active}">
        <input data-export-animation="${escapeHtml(item.id)}" type="checkbox"${checked}>
        <span class="favorite-glyph">${favorite ? "★" : ""}</span>
        <b title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</b>
        <small>${item.frameCount}f</small>
      </label>
    `;
  }).join("");
  updateExportSelectionUi();
}

function renderExportAnimationList() {
  const groups = groupedAnimations(sortedAnimations(RESOURCE_MANIFEST.animations));
  const html = [];
  animationGroupOrder(groups).forEach(group => {
    const items = groups.get(group) || [];
    if (!items.length) return;
    html.push(`<div class="export-list-group">${escapeHtml(group)}</div>`);
    items.forEach(item => {
      const favorite = favoriteAnimationIds.has(item.id);
      const checked = exportAnimationIds.has(item.id) ? " checked" : "";
      const active = item.id === exportPreviewAnimationId ? " active" : "";
      const strength = expressionStrength(item);
      html.push(`
        <div class="export-list-row${active}" data-export-row="${escapeHtml(item.id)}">
          <input data-export-animation="${escapeHtml(item.id)}" type="checkbox"${checked}>
          <button class="export-view-btn" data-export-view="${escapeHtml(item.id)}" type="button" aria-label="View ${escapeHtml(item.name)}" title="View animation">&#128065;</button>
          <span class="favorite-glyph">${favorite ? "*" : ""}</span>
          <b title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</b>
          <input class="export-expression-slider" data-export-expression="${escapeHtml(item.id)}" type="range" min="${EXPRESSION_MIN}" max="${EXPRESSION_MAX}" step="5" value="${strength}" aria-label="Expression strength for ${escapeHtml(item.name)}">
          <span class="export-expression-value" data-export-expression-value>${strength}%</span>
          <small>${item.frameCount}f</small>
        </div>
      `);
    });
  });
  els.exportAnimationList.innerHTML = html.join("");
  updateExportSelectionUi();
}

function updateExportSelectionUi() {
  els.exportSelectionText.textContent = `${exportAnimationIds.size} / ${RESOURCE_MANIFEST.animations.length}`;
  if (!validAnimationId(exportPreviewAnimationId)) {
    exportPreviewAnimationId = selectedExportAnimations()[0]?.id || null;
    exportPreviewFrame = 0;
  }
  els.exportAnimationList.querySelectorAll("[data-export-animation]").forEach(input => {
    input.checked = exportAnimationIds.has(input.dataset.exportAnimation);
    input.closest("[data-export-row]")?.classList.toggle("active", input.dataset.exportAnimation === exportPreviewAnimationId);
  });
  els.exportAnimationList.querySelectorAll("[data-export-expression]").forEach(slider => {
    const item = RESOURCE_MANIFEST.animations.find(entry => entry.id === slider.dataset.exportExpression);
    if (!item) return;
    const value = expressionStrength(item);
    slider.value = String(value);
    const row = slider.closest("[data-export-row]");
    const valueNode = row?.querySelector("[data-export-expression-value]");
    if (valueNode) valueNode.textContent = `${value}%`;
  });
  if (!els.exportDialog.classList.contains("hidden")) {
    renderExportPreview();
    syncExportPreviewPlayback();
  }
}

async function renderExportPreview() {
  const selectedItems = selectedExportAnimations();
  if (!selectedItems.length) {
    stopExportPreviewPlayback();
    drawEmptyExportPreview();
    els.exportPreviewLabel.textContent = "No animations selected.";
    return;
  }

  if (!selectedItems.some(item => item.id === exportPreviewAnimationId)) {
    exportPreviewAnimationId = selectedItems[0]?.id || null;
    exportPreviewFrame = 0;
  }
  const activeItem = exportPreviewAnimation() || selectedItems[0];
  await Promise.all(selectedItems.map(item => loadImage(item)));
  const output = RESOURCE_MANIFEST.outputFrame;
  const gutter = 8;
  const labelWidth = 220;
  const canvas = els.exportPreviewCanvas;
  canvas.width = labelWidth + output.width;
  canvas.height = selectedItems.length * output.height + Math.max(0, selectedItems.length - 1) * gutter;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#101316";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "top";

  selectedItems.forEach((item, row) => {
    const y = row * (output.height + gutter);
    const source = imageCache.get(item.id);
    const frameIndex = exportPreviewFrame % Math.max(1, item.frameCount);
    const sourceFrame = item.frames[frameIndex];

    ctx.fillStyle = row % 2 === 0 ? "#151d20" : "#11181b";
    ctx.fillRect(0, y, canvas.width, output.height);
    ctx.fillStyle = item.id === exportPreviewAnimationId ? "#e8bb6d" : "#edf4f4";
    ctx.fillText(item.name, 12, y + 12);
    ctx.fillStyle = "#9dadad";
    ctx.fillText(`${item.frameCount}f  expression ${expressionStrength(item)}%`, 12, y + 32);
    ctx.fillText(item.folder, 12, y + 52);

    if (sourceFrame) {
      renderResourceFrame({
        ctx,
        source,
        animation: item,
        frame: sourceFrame,
        manifest: RESOURCE_MANIFEST,
        displayMode: "material",
        settings: settingsForAnimation(item),
        destX: labelWidth,
        destY: y
      });
      ctx.strokeStyle = item.id === exportPreviewAnimationId ? "#e8bb6d" : "#26373d";
      ctx.strokeRect(labelWidth + 0.5, y + 0.5, output.width - 1, output.height - 1);
      ctx.fillStyle = item.id === exportPreviewAnimationId ? "#e8bb6d" : "#c7d4d4";
      ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`f${frameIndex}`, labelWidth + 3, y + output.height - 13);
      ctx.font = "12px ui-sans-serif, system-ui, sans-serif";
    }
  });

  els.exportPreviewLabel.textContent = `${selectedItems.length} selected for export. Playing preview frame ${exportPreviewFrame + 1}. Focus: ${activeItem.name}.`;
  highlightExportPreviewSelection();
}

function validAnimationId(id) {
  return RESOURCE_MANIFEST.animations.some(item => item.id === id);
}

function randomizeEverything() {
  const seed = freshRandomSeed();
  els.randomSeedInput.value = seed;
  applyRandomSeed(seed);
}

function applySeedFromInput() {
  const seed = els.randomSeedInput.value.trim();
  if (!seed) {
    randomizeEverything();
    return;
  }
  applyRandomSeed(seed);
}

function applyRandomSeed(seed) {
  const rng = seededRandom(seed);
  const pick = items => items[Math.floor(rng() * items.length)];
  const palettes = MATERIAL_PALETTES.map(item => item.id);
  const defaults = cloneRenderSettings();
  renderSettings = cloneRenderSettings();
  renderSettings.palette = pick(palettes);
  setExpressionStrength(animation, Math.round((-15 + rng() * 35) / 5) * 5);
  renderSettings.accessories.eyes = pick(["none", "dot", "bright", "line", "sleepy", "wide", "dual", "hollow"]);
  renderSettings.shadingMode = pick(["banded", "soft", "toon-ao", "depth"]);
  renderSettings.outlineMode = pick(["silhouette", "modules", "separation"]);
  renderSettings.outlinePixelPerfect = rng() > 0.35;
  renderSettings.outlineThickness = rng() > 0.82 ? 2 : 1;
  renderSettings.experimental.headShape = pick(["standard", "standard", "narrow", "wide", "tall", "flat"]);
  renderSettings.experimental.limbShape = pick(["standard", "standard", "slim", "chunky", "long-taper", "flat-feet"]);
  renderSettings.proportionLocks.armLength = rng() > 0.2;
  renderSettings.proportionLocks.armThickness = rng() > 0.2;
  renderSettings.proportionLocks.legLength = rng() > 0.2;
  renderSettings.proportionLocks.legThickness = rng() > 0.2;
  renderSettings.shadingStrength = snapRange(rng, 25, 85, 5);
  renderSettings.lightDirection = snapRange(rng, -160, -20, 5);
  renderSettings.rearDepth = snapRange(rng, 5, 45, 5);
  renderSettings.rimLight = snapRange(rng, 0, 24, 4);
  renderSettings.ambientOcclusion = rng() > 0.15;

  for (const input of els.settingInputs) {
    const path = input.dataset.setting;
    const standard = Number(getNested(defaults, path));
    if (!Number.isFinite(standard)) continue;
    const value = randomizedSettingValue(path, standard, rng);
    setNested(renderSettings, path, value);
    applyLinkedSettingInput(input, value);
  }
  Object.entries(renderSettings.proportionLocks).forEach(([key, enabled]) => {
    if (enabled) syncLockedProportionGroup(key);
  });
  renderSettings.figureScale.lock = rng() > 0.25;
  if (renderSettings.figureScale.lock) {
    const scale = snapRange(rng, 0.88, 1.16, 0.01);
    renderSettings.figureScale.x = scale;
    renderSettings.figureScale.y = scale;
  }
  syncControlsFromSettings();
  renderAll();
}

function randomizedSettingValue(path, standard, rng) {
  if (path === "figureScale.x" || path === "figureScale.y") return snapRange(rng, 0.88, 1.16, 0.01);
  if (path.endsWith(".length")) {
    const wider = path.includes("weapon") || path.includes("smear");
    return snapRange(rng, wider ? 0.8 : 0.85, wider ? 1.45 : 1.24, 0.01);
  }
  if (path.endsWith(".thickness")) {
    const wider = path.includes("weapon") || path.includes("smear");
    return snapRange(rng, wider ? 0.85 : 0.9, wider ? 1.35 : 1.22, 0.01);
  }
  if (path.endsWith(".size")) return snapRange(rng, 0.9, 1.18, 0.01);
  return Math.round(standard * 100) / 100;
}

function snapRange(rng, min, max, step) {
  const value = min + (max - min) * rng();
  return Math.round(value / step) * step;
}

function freshRandomSeed() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const values = new Uint32Array(2);
    cryptoApi.getRandomValues(values);
    return `pm-${values[0].toString(36)}-${values[1].toString(36)}`;
  }
  return `pm-${Date.now().toString(36)}-${Math.floor(Math.random() * 0xffffffff).toString(36)}`;
}

function seededRandom(seedText) {
  let seed = 2166136261;
  for (const char of String(seedText)) {
    seed ^= char.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function resetProportions() {
  const defaults = cloneRenderSettings();
  els.settingInputs.forEach(input => {
    const standard = getNested(defaults, input.dataset.setting);
    if (!Number.isFinite(Number(standard))) return;
    setNested(renderSettings, input.dataset.setting, Number(standard));
    input.value = String(standard);
    applyLinkedSettingInput(input);
    updateSettingValue(input);
  });
  Object.entries(renderSettings.proportionLocks || {}).forEach(([key, enabled]) => {
    if (enabled) syncLockedProportionGroup(key);
  });
  renderAll();
}

function resetSettingInputToStandard(input) {
  if (!input || input.disabled) return;
  const defaults = cloneRenderSettings();
  const standard = getNested(defaults, input.dataset.setting);
  if (!Number.isFinite(Number(standard))) return;
  setNested(renderSettings, input.dataset.setting, Number(standard));
  input.value = String(standard);
  applyLinkedSettingInput(input);
  syncLockedProportionInput(input);
  if (input.id === "figureScaleX" && renderSettings.figureScale.lock) {
    renderSettings.figureScale.y = renderSettings.figureScale.x;
    els.figureScaleY.value = input.value;
    updateSettingValue(els.figureScaleY);
  } else if (input.id === "figureScaleY" && renderSettings.figureScale.lock) {
    renderSettings.figureScale.x = renderSettings.figureScale.y;
    els.figureScaleX.value = input.value;
    updateSettingValue(els.figureScaleX);
  }
  updateSettingValue(input);
  renderAll();
}

function updateSettingValue(input) {
  const output = document.getElementById(input.dataset.value);
  if (!output) return;
  output.textContent = `${Number(input.value).toFixed(2)}x`;
}

function stepFrame(delta) {
  frame = (frame + delta + animation.frameCount) % animation.frameCount;
  renderCurrentFrame();
  renderSheet();
}

function togglePlayback() {
  if (els.viewMode.value !== "frame-sheet") return;
  if (playTimer) {
    stopPlayback();
    return;
  }
  startPlayback();
}

function startPlayback() {
  if (els.viewMode.value !== "frame-sheet") return;
  stopPlayback();
  els.playBtn.textContent = "Stop";
  const token = ++playbackToken;
  const tick = () => {
    if (token !== playbackToken || els.viewMode.value !== "frame-sheet") return;
    stepFrame(1);
    playTimer = setTimeout(tick, frameDuration(animation, frame));
  };
  playTimer = setTimeout(tick, frameDuration(animation, frame));
}

function stopPlayback() {
  if (playTimer) {
    clearTimeout(playTimer);
    playTimer = null;
  }
  playbackToken += 1;
  els.playBtn.textContent = "Play";
}

function syncPlayback() {
  stopPlayback();
}

function modeLabel() {
  if (els.displayMode.value === "role-mask") return "Role mask";
  if (els.displayMode.value === "contour") return "Contour";
  return els.displayMode.value === "source" ? "Source" : "Material";
}

function drawChecker(ctx, x, y, w, h, size) {
  for (let yy = 0; yy < h; yy += size) {
    for (let xx = 0; xx < w; xx += size) {
      ctx.fillStyle = ((xx / size + yy / size) % 2 === 0) ? "#151d20" : "#1d282d";
      ctx.fillRect(x + xx, y + yy, size, size);
    }
  }
}

function renderPreviewFrame(targetCtx, options) {
  const output = outputFrame(options.animation, RESOURCE_MANIFEST);
  const buffer = document.createElement("canvas");
  buffer.width = output.width;
  buffer.height = output.height;
  const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
  bufferCtx.imageSmoothingEnabled = false;
  const renderInfo = renderResourceFrame({
    ...options,
    ctx: bufferCtx,
    destX: 0,
    destY: 0
  });
  const destX = options.destX || 0;
  const destY = options.destY || 0;
  drawPreviewBackground(targetCtx, destX, destY, output.width, output.height);
  targetCtx.drawImage(buffer, destX, destY);
  if (options.previewOverlays) {
    drawSubGrid(targetCtx, destX, destY, output.width, output.height);
  }
  return renderInfo;
}

function drawSubGrid(ctx, x, y, w, h) {
  const size = subGridSize();
  if (!size) return;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(232, 187, 109, 0.72)";
  ctx.beginPath();
  for (let gx = x + size; gx < x + w; gx += size) {
    ctx.moveTo(gx + 0.5, y + 0.5);
    ctx.lineTo(gx + 0.5, y + h - 0.5);
  }
  for (let gy = y + size; gy < y + h; gy += size) {
    ctx.moveTo(x + 0.5, gy + 0.5);
    ctx.lineTo(x + w - 0.5, gy + 0.5);
  }
  ctx.stroke();
  ctx.restore();
}

function subGridSize() {
  if (subGrid.mode === "32") return 32;
  if (subGrid.mode === "48") return 48;
  if (subGrid.mode === "custom") return clampNumber(Number(subGrid.customSize), 2, 96, 16);
  return 0;
}

function drawPreviewBackground(ctx, x, y, w, h) {
  if (backgroundMode === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, w, h);
    return;
  }
  if (backgroundMode === "black") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(x, y, w, h);
    return;
  }
  drawChecker(ctx, x, y, w, h, 4);
}

function copyCanvas(target, source) {
  target.width = source.width;
  target.height = source.height;
  const ctx = target.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.drawImage(source, 0, 0);
}

function cloneCurrentSettings() {
  return JSON.parse(JSON.stringify(renderSettings));
}

function createSettingsPreset() {
  return {
    schema: "spritemaster.settings.v1",
    version: 1,
    generatedAt: new Date().toISOString(),
    source: {
      resource: RESOURCE_MANIFEST.sourceRoot,
      normalizedCanvas: RESOURCE_MANIFEST.outputFrame
    },
    renderSettings: cloneCurrentSettings(),
    frameDurations: cloneFrameDurations(),
    expressionStrengths: { ...expressionStrengths },
    favorites: {
      animationIds: [...favoriteAnimationIds]
    },
    ui: {
      displayMode: els.displayMode.value,
      backgroundMode,
      viewMode,
      animationId: animation.id,
      frame,
      randomSeed: els.randomSeedInput.value.trim(),
      subGrid: { ...subGrid },
      zooms: { ...zooms },
      activeZoomTarget
    },
    export: {
      pngBackground: "transparent",
      selectedAnimationIds: [...exportAnimationIds],
      standardAnimationIds: standardExportAnimationIds()
    }
  };
}

async function applySettingsPreset(data) {
  const preset = normalizeSettingsPreset(data);
  renderSettings = mergeRenderSettings(preset.renderSettings);
  frameDurations = mergeFrameDurations(preset.frameDurations);
  expressionStrengths = mergeExpressionStrengths(preset.expressionStrengths);
  favoriteAnimationIds = new Set((preset.favorites?.animationIds || []).filter(validAnimationId));
  exportAnimationIds = new Set((preset.export?.selectedAnimationIds || standardExportAnimationIds()).filter(validAnimationId));
  backgroundMode = validOption(els.backgroundMode, preset.ui.backgroundMode) ? preset.ui.backgroundMode : "tiles";
  subGrid = normalizeSubGrid(preset.ui.subGrid);
  viewMode = validOption(els.viewMode, preset.ui.viewMode) ? preset.ui.viewMode : "frame-sheet";
  activeZoomTarget = zoomTargets[preset.ui.activeZoomTarget] ? preset.ui.activeZoomTarget : "frame";
  if (typeof preset.ui.randomSeed === "string") {
    els.randomSeedInput.value = preset.ui.randomSeed;
  }
  if (isPlainObject(preset.ui.zooms)) {
    zooms = { ...zooms, ...Object.fromEntries(Object.entries(preset.ui.zooms).filter(([key, value]) => zoomTargets[key] && Number.isFinite(value))) };
  }

  syncControlsFromSettings();
  renderExportAnimationList();
  els.displayMode.value = validOption(els.displayMode, preset.ui.displayMode) ? preset.ui.displayMode : "material";
  els.viewMode.value = viewMode;
  els.zoomTargetSelect.value = activeZoomTarget;

  const importedAnimation = RESOURCE_MANIFEST.animations.find(item => item.id === preset.ui.animationId);
  if (importedAnimation) {
    await selectAnimation(importedAnimation.id);
  }
  frame = clampNumber(Number(preset.ui.frame), 0, Math.max(0, animation.frameCount - 1), 0);
  els.frameSlider.value = String(frame);
  updateViewMode();
  renderAll();
  syncPlayback();
  els.welcomeOverlay.classList.add("hidden");
}

function normalizeSettingsPreset(data) {
  if (data?.schema === "spritemaster.settings.v1") {
    return {
      renderSettings: data.renderSettings || {},
      frameDurations: data.frameDurations || {},
      expressionStrengths: data.expressionStrengths || {},
      favorites: data.favorites || {},
      export: data.export || {},
      ui: data.ui || {}
    };
  }
  if (data?.renderSettings || data?.ui) {
    return {
      renderSettings: data.renderSettings || {},
      frameDurations: data.frameDurations || {},
      expressionStrengths: data.expressionStrengths || {},
      favorites: data.favorites || {},
      export: data.export || {},
      ui: data.ui || {}
    };
  }
  if (data?.render) {
    return {
      renderSettings: data.render,
      frameDurations: data.frameDurations || {},
      expressionStrengths: data.expressionStrengths || {},
      favorites: data.favorites || {},
      export: data.export || {},
      ui: {
        displayMode: data.render.displayMode,
        backgroundMode: "tiles"
      }
    };
  }
  throw new Error("Unsupported Spritemaster settings JSON.");
}

function normalizeSubGrid(value) {
  const allowed = new Set(["off", "32", "48", "custom"]);
  const mode = allowed.has(value?.mode) ? value.mode : "off";
  return {
    mode,
    customSize: clampNumber(Number(value?.customSize), 2, 96, 16)
  };
}

function mergeRenderSettings(imported) {
  const next = cloneRenderSettings();
  mergeKnown(next, isPlainObject(imported) ? imported : {});
  normalizeLegacyOutlineTargets(next, imported);
  normalizeLegacyOutlineSettings(next);
  return next;
}

function normalizeLegacyOutlineTargets(settings, imported) {
  const importedTargets = isPlainObject(imported?.outlineTargets) ? imported.outlineTargets : null;
  if (!importedTargets || !Object.prototype.hasOwnProperty.call(importedTargets, "limbs")) return;
  OUTLINE_LIMB_TARGETS.forEach(role => {
    if (!Object.prototype.hasOwnProperty.call(importedTargets, role)) {
      settings.outlineTargets[role] = Boolean(importedTargets.limbs);
    }
  });
}

function normalizeLegacyOutlineSettings(settings) {
  if (settings.outlineMode === "pixel-perfect") {
    settings.outlineMode = "modules";
    settings.outlinePixelPerfect = true;
  }
}

function mergeKnown(target, source) {
  Object.entries(source).forEach(([key, value]) => {
    if (!(key in target)) return;
    if (key === "moduleColors" && isPlainObject(value)) {
      target[key] = Object.fromEntries(Object.entries(value).filter(([, color]) => isHexColor(color)));
      return;
    }
    if (isPlainObject(target[key]) && isPlainObject(value)) {
      mergeKnown(target[key], value);
      return;
    }
    target[key] = value;
  });
}

function validOption(select, value) {
  return Array.from(select.options).some(option => option.value === value);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function setNested(target, path, value) {
  const parts = path.split(".");
  let node = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    node = node[parts[index]];
  }
  node[parts[parts.length - 1]] = value;
}

function getNested(target, path) {
  return path.split(".").reduce((node, key) => node?.[key], target);
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

async function blobToBytes(blob) {
  return new Uint8Array(await blob.arrayBuffer());
}

function safeName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "animation";
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

function createZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const now = new Date();
  const time = dosTime(now);
  const date = dosDate(now);

  files.forEach(file => {
    const nameBytes = textEncoder.encode(file.name.replace(/\\/g, "/"));
    const data = file.data instanceof Uint8Array ? file.data : new Uint8Array(file.data);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, time, true);
    localView.setUint16(12, date, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    local.set(nameBytes, 30);
    localParts.push(local, data);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, time, true);
    centralView.setUint16(14, date, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, 0, true);
    centralView.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length + data.length;
  });

  const centralOffset = offset;
  const centralSize = centralParts.reduce((sum, item) => sum + item.length, 0);
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, files.length, true);
  eocdView.setUint16(10, files.length, true);
  eocdView.setUint32(12, centralSize, true);
  eocdView.setUint32(16, centralOffset, true);
  eocdView.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, eocd], { type: "application/zip" });
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = crcTable[(crc ^ data[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTime(date) {
  return (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
}

function dosDate(date) {
  return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
}

window.spritemasterResources = {
  manifest: RESOURCE_MANIFEST,
  createExportPackage,
  applySettingsPreset,
  createSettingsPreset,
  get animation() {
    return animation;
  },
  get frame() {
    return frame;
  },
  get zoom() {
    return zooms[activeZoomTarget];
  },
  get zooms() {
    return zooms;
  },
  get renderSettings() {
    return renderSettings;
  },
  get backgroundMode() {
    return backgroundMode;
  },
};
