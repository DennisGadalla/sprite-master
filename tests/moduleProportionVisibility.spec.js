import { test, expect } from "@playwright/test";

test.use({ channel: "chrome" });

test("modules panel appears before proportions and hides inactive proportion controls", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000/index.html");
  await page.locator("#welcomeCreateBtn").click();

  const order = await page.locator(".control-dock .panel h2").evaluateAll(heads => heads.map(head => head.textContent.trim()));
  expect(order.indexOf("Modules")).toBeLessThan(order.indexOf("Proportions"));

  await moduleToggle(page, "head").uncheck();
  await expect(page.locator("[data-setting='roles.head.size']").locator("xpath=ancestor::*[contains(@class, 'slider-field')][1]")).toHaveClass(/hidden/);
  await expect(page.locator(".control-subhead", { hasText: "Head" })).toHaveClass(/hidden/);

  await moduleToggle(page, "head").check();
  await expect(page.locator("[data-setting='roles.head.size']").locator("xpath=ancestor::*[contains(@class, 'slider-field')][1]")).not.toHaveClass(/hidden/);

  await moduleToggle(page, "front_arm").uncheck();
  await expect(page.locator("[data-setting='roles.front_arm.length']").locator("xpath=ancestor::*[contains(@class, 'slider-field')][1]")).toHaveClass(/hidden/);
  await expect(page.locator("[data-setting='roles.back_arm.length']").locator("xpath=ancestor::*[contains(@class, 'slider-field')][1]")).not.toHaveClass(/hidden/);
  await expect(page.locator("#lockArmLength").locator("xpath=ancestor::*[contains(@class, 'toggle-line')][1]")).toHaveClass(/hidden/);

  await page.locator("#distalRoleMerge").check();
  await expect(page.locator("#handSize").locator("xpath=ancestor::*[contains(@class, 'slider-field')][1]")).toHaveClass(/hidden/);
  await expect(page.locator("#footSize").locator("xpath=ancestor::*[contains(@class, 'slider-field')][1]")).toHaveClass(/hidden/);
});

function moduleToggle(page, role) {
  return page.locator(`[data-role-enabled='${role}']`);
}
