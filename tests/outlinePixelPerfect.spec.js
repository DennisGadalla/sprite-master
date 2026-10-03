import { test, expect } from "@playwright/test";

test.use({ channel: "chrome" });

test("pixel-perfect outline expands from the source mask with cardinal neighbors", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000/index.html");
  await page.locator("#welcomeCreateBtn").click();
  await page.locator("#displayMode").selectOption("role-mask");
  await setSelect(page, "#outlineMode", "off");
  const baseImage = await previewImageData(page);

  await setSelect(page, "#outlineMode", "modules");
  await setCheckbox(page, "#outlinePixelPerfect", true);
  await setSelect(page, "#outlineColor", "black");
  await setRange(page, "#outlineThickness", "1");

  const stats = await page.locator("#previewCanvas").evaluate((canvas, base) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const roleColors = new Set([
      "95,205,228", "223,113,38", "106,190,48", "153,229,80", "240,101,196", "175,26,178",
      "209,204,96", "251,242,54", "217,87,99", "172,50,50", "109,140,255", "253,217,255"
    ]);
    const baseRole = (x, y) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return 0;
      const index = (y * width + x) * 4;
      return roleColors.has(`${base.data[index]},${base.data[index + 1]},${base.data[index + 2]}`);
    };
    let outlinePixels = 0;
    let detached = 0;
    let diagonalOnly = 0;

    for (let index = 0; index < data.length; index += 4) {
      const isNewBlack = data[index] === 16 && data[index + 1] === 17 && data[index + 2] === 20 && data[index + 3] === 255;
      if (!isNewBlack) continue;
      const pixel = index / 4;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      outlinePixels += 1;
      const cardinal = baseRole(x - 1, y) || baseRole(x + 1, y) || baseRole(x, y - 1) || baseRole(x, y + 1);
      const diagonal = baseRole(x - 1, y - 1) || baseRole(x + 1, y - 1) || baseRole(x - 1, y + 1) || baseRole(x + 1, y + 1);
      if (!cardinal) detached += 1;
      if (!cardinal && diagonal) diagonalOnly += 1;
    }

    return { outlinePixels, detached, diagonalOnly };
  }, baseImage);

  expect(stats.outlinePixels).toBeGreaterThan(20);
  expect(stats.detached).toBe(0);
  expect(stats.diagonalOnly).toBe(0);
});

async function previewImageData(page) {
  return page.locator("#previewCanvas").evaluate((canvas) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return { width: canvas.width, height: canvas.height, data: [...data] };
  });
}

async function setSelect(page, selector, value) {
  await page.locator(selector).evaluate((select, nextValue) => {
    select.value = nextValue;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
  await page.waitForTimeout(80);
}

async function setCheckbox(page, selector, checked) {
  await page.locator(selector).evaluate((input, nextChecked) => {
    input.checked = nextChecked;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, checked);
  await page.waitForTimeout(80);
}

async function setRange(page, selector, value) {
  await page.locator(selector).evaluate((input, nextValue) => {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
  await page.waitForTimeout(80);
}
