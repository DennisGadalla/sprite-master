import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const LENGTH_CONTROLS = [
  { name: "torsoLength", selector: "[data-setting='roles.torso.length']", high: "1.65", low: "0.65" },
  { name: "frontArmLength", selector: "[data-setting='roles.front_arm.length']", high: "1.75", low: "0.55" },
  { name: "backArmLength", selector: "[data-setting='roles.back_arm.length']", high: "1.75", low: "0.55" },
  { name: "frontLegLength", selector: "[data-setting='roles.front_leg.length']", high: "1.75", low: "0.55" },
  { name: "backLegLength", selector: "[data-setting='roles.back_leg.length']", high: "1.75", low: "0.55" },
  { name: "weaponLength", selector: "[data-setting='roles.weapon.length']", high: "2.50", low: "0.50" },
  { name: "smearLength", selector: "[data-setting='roles.smear.length']", high: "2.50", low: "0.50" }
];

test.use({ channel: "chrome" });

test("length controls do not create canvas stripe holes", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000/index.html");
  await page.locator("#welcomeCreateBtn").click();
  await page.locator("#animationSelect").evaluate(select => {
    const option = [...select.options].find(item => /^Idle\b/.test(item.textContent || ""));
    if (!option) throw new Error("Idle animation option not found");
    select.value = option.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.locator("#displayMode").selectOption("role-mask");
  await page.locator("#viewMode").selectOption("frame-sheet");
  await page.waitForTimeout(250);

  const diagnostics = [];
  for (const control of LENGTH_CONTROLS) {
    for (const [position, value] of [["high", control.high], ["low", control.low]]) {
      await setSlider(page, control.selector, value);
      await page.waitForTimeout(80);
      const scan = await scanPreviewCanvas(page);
      diagnostics.push({ control: control.name, position, value, ...scan });
      await page.screenshot({
        path: `qa_screenshots/length-${control.name}-${position}.png`,
        fullPage: false
      });
      await setSlider(page, control.selector, "1");
      await page.waitForTimeout(40);
    }
  }

  mkdirSync("qa_screenshots", { recursive: true });
  writeFileSync(
    join("qa_screenshots", "length-artifacts.json"),
    `${JSON.stringify(diagnostics, null, 2)}\n`,
    "utf8"
  );

  expect(diagnostics.filter(item => item.stripeHoles > 0)).toEqual([]);
});

test("Air Attack 2 stays inside the output frame across frames and length controls", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000/index.html");
  await page.locator("#welcomeCreateBtn").click();
  await selectAnimationByText(page, /^Air Attack 2\b/);
  await page.locator("#displayMode").selectOption("role-mask");
  await page.locator("#viewMode").selectOption("frame-sheet");
  await page.waitForTimeout(250);

  const diagnostics = [];
  for (const frame of [0, 1, 2, 3]) {
    await setSlider(page, "#frameSlider", String(frame));
    await page.waitForTimeout(80);
    diagnostics.push({ frame, control: "default", ...(await scanRoleBounds(page)) });
  }
  for (const control of LENGTH_CONTROLS) {
    await setSlider(page, control.selector, control.high);
    await page.waitForTimeout(80);
    diagnostics.push({ frame: "current", control: control.name, value: control.high, ...(await scanRoleBounds(page)) });
    await setSlider(page, control.selector, "1");
  }

  mkdirSync("qa_screenshots", { recursive: true });
  writeFileSync(
    join("qa_screenshots", "air-attack-2-bounds.json"),
    `${JSON.stringify(diagnostics, null, 2)}\n`,
    "utf8"
  );

  expect(diagnostics.filter(item => item.rolePixels === 0 || !item.bounds)).toEqual([]);
  expect(diagnostics.filter(item => item.control === "default" && item.touchesEdge)).toEqual([]);
});

async function selectAnimationByText(page, pattern) {
  await page.locator("#animationSelect").evaluate((select, source) => {
    const regex = new RegExp(source);
    const option = [...select.options].find(item => regex.test(item.textContent || ""));
    if (!option) throw new Error(`Animation option not found for ${source}`);
    select.value = option.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, pattern.source);
}

async function setSlider(page, selector, value) {
  await page.locator(selector).evaluate((input, nextValue) => {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

async function scanPreviewCanvas(page) {
  return page.locator("#previewCanvas").evaluate(canvas => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    const roleColors = new Set([
      "5fcde4", "df7126", "6abe30", "99e550", "f065c4", "af1ab2",
      "d1cc60", "fbf236", "d95763", "ac3232", "6d8cff", "fdd9ff"
    ]);
    const roleAt = (x, y) => {
      const offset = (y * width + x) * 4;
      if (data[offset + 3] === 0) return "";
      const key = [data[offset], data[offset + 1], data[offset + 2]]
        .map(value => value.toString(16).padStart(2, "0"))
        .join("");
      return roleColors.has(key) ? key : "";
    };
    let rolePixels = 0;
    let stripeHoles = 0;
    const samples = [];
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        if (roleAt(x, y)) {
          rolePixels += 1;
          continue;
        }
        const above = roleAt(x, y - 1);
        const below = roleAt(x, y + 1);
        const left = roleAt(x - 1, y);
        const right = roleAt(x + 1, y);
        const vertical = above && above === below;
        const horizontal = left && left === right;
        if (!vertical && !horizontal) continue;
        stripeHoles += 1;
        if (samples.length < 20) samples.push({ x, y, vertical, horizontal, role: above || left });
      }
    }
    return { width, height, rolePixels, stripeHoles, samples };
  });
}

async function scanRoleBounds(page) {
  return page.locator("#previewCanvas").evaluate(canvas => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    const roleColors = new Set([
      "5fcde4", "df7126", "6abe30", "99e550", "f065c4", "af1ab2",
      "d1cc60", "fbf236", "d95763", "ac3232", "6d8cff", "fdd9ff"
    ]);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    let rolePixels = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4;
        if (data[offset + 3] === 0) continue;
        const key = [data[offset], data[offset + 1], data[offset + 2]]
          .map(value => value.toString(16).padStart(2, "0"))
          .join("");
        if (!roleColors.has(key)) continue;
        rolePixels += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    return {
      rolePixels,
      bounds: rolePixels ? { minX, minY, maxX, maxY } : null,
      touchesEdge: rolePixels > 0 && (minX <= 0 || minY <= 0 || maxX >= width - 1 || maxY >= height - 1)
    };
  });
}
