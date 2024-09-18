import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button triggering AJAX request").click();
});

test("auto waiting", async ({ page }) => {
  // playwright waits up to 30 seconds for the element to appear
  const successButton = page.locator(".bg-success");
  // the test will wait for the element to appear
  await successButton.waitFor({ state: "attached" });
  const text = await successButton.allTextContents();

  expect(text).toContain("Data loaded with AJAX get request.");
});

test("alternative waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  //wait for elment
  // await page.waitForSelector(".bg-success");

  //wait for particular response
  await page.waitForResponse("http://uitestingplayground.com/ajax");

  // wait for network calls to be completed - not recommended
  // await page.waitForLoadState("networkidle");

  // waiting for timeout - not recommended
  // await page.waitForTimeout(5000)

  const text = await successButton.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});
