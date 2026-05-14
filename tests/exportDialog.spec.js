import { test, expect } from "@playwright/test";

test.use({ channel: "chrome" });

test("export zip picker buttons and expression sliders are usable", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000/index.html");
  await page.locator("#welcomeCreateBtn").click();
  await page.locator("#exportZipBtn").click();

  await expect(page.locator("#exportDialog")).not.toHaveClass(/hidden/);

  const total = await page.locator("[data-export-animation]").count();
  await page.locator("#exportNoneBtn").click();
  await expect(page.locator("#exportSelectionText")).toHaveText(`0 / ${total}`);
  await expect(page.locator("[data-export-animation]:checked")).toHaveCount(0);

  await page.locator("#exportAllBtn").click();
  await expect(page.locator("#exportSelectionText")).toHaveText(`${total} / ${total}`);
  await expect(page.locator("[data-export-animation]:checked")).toHaveCount(total);

  await page.locator("#exportStandardBtn").click();
  const selectedText = await page.locator("#exportSelectionText").textContent();
  const selected = Number((selectedText || "").split("/")[0].trim());
  expect(selected).toBeGreaterThan(0);
  expect(selected).toBeLessThanOrEqual(total);

  await page.locator("#exportNoneBtn").click();
  const rows = page.locator("[data-export-row]");
  await rows.nth(0).locator("b").click();
  await expect(page.locator("#exportSelectionText")).toHaveText(`1 / ${total}`);
  await expect(rows.nth(0).locator("[data-export-animation]")).toBeChecked();
  const oneSelectedPreview = await page.locator("#exportPreviewCanvas").evaluate(canvas => ({
    width: canvas.width,
    height: canvas.height
  }));

  await rows.nth(1).locator("b").click();
  await expect(page.locator("#exportSelectionText")).toHaveText(`2 / ${total}`);
  await expect(rows.nth(1).locator("[data-export-animation]")).toBeChecked();
  const twoSelectedPreview = await page.locator("#exportPreviewCanvas").evaluate(canvas => ({
    width: canvas.width,
    height: canvas.height
  }));
  expect(twoSelectedPreview.height).toBeGreaterThan(oneSelectedPreview.height);
  expect(twoSelectedPreview.width).toBeGreaterThan(220);
  expect(twoSelectedPreview.width).toBe(oneSelectedPreview.width);

  const firstSlider = page.locator("[data-export-expression]").first();
  await expect(firstSlider).toBeVisible();
  await expect(firstSlider).toBeInViewport();

  const metrics = await firstSlider.evaluate(slider => {
    const list = slider.closest(".export-list");
    const sliderRect = slider.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    return {
      sliderWidth: sliderRect.width,
      sliderRight: sliderRect.right,
      listRight: listRect.right
    };
  });
  expect(metrics.sliderWidth).toBeGreaterThanOrEqual(120);
  expect(metrics.sliderRight).toBeLessThanOrEqual(metrics.listRight + 1);

  const before = Number(await firstSlider.inputValue());
  const box = await firstSlider.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await expect.poll(async () => Number(await firstSlider.inputValue())).toBeGreaterThan(before);

  const after = await firstSlider.inputValue();
  await expect(firstSlider.locator("xpath=ancestor::*[@data-export-row][1]").locator("[data-export-expression-value]")).toHaveText(`${after}%`);
});
