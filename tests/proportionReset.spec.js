import { test, expect } from "@playwright/test";

test.use({ channel: "chrome" });

test("proportion slider standard buttons reset individual controls", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000/index.html");
  await page.locator("#welcomeCreateBtn").click();

  const ranges = page.locator("[data-setting][type='range']");
  await expect(page.locator(".standard-marker")).toHaveCount(0);
  await expect(page.locator("[data-standard-reset]")).toHaveCount(await ranges.count());

  await setRange(page, "[data-setting='roles.front_arm.length']", "1.5");
  await expect(page.locator("#frontArmLengthValue")).toHaveText("1.50x");
  await expect(page.locator("#backArmLengthValue")).toHaveText("1.50x");

  await page.locator("[data-standard-reset='roles.front_arm.length']").click();
  await expect(page.locator("[data-setting='roles.front_arm.length']")).toHaveJSProperty("value", "1");
  await expect(page.locator("[data-setting='roles.back_arm.length']")).toHaveJSProperty("value", "1");
  await expect(page.locator("#frontArmLengthValue")).toHaveText("1.00x");
  await expect(page.locator("#backArmLengthValue")).toHaveText("1.00x");
});

async function setRange(page, selector, value) {
  await page.locator(selector).evaluate((input, nextValue) => {
    input.value = nextValue;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}
