import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
  // by tag name
  await page.locator("input").first().click();

  // by id
  await page.locator("#inputEmail1").click();

  // by class
  page.locator(".shape-rectangle");

  // by attribute
  page.locator('[placeholder="Email"]');

  // by entire class value
  page.locator(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
  );

  // combine different selectors
  page.locator("input[placeholder='Email'][nbinput]");

  // by XPath (NOT RECOMMENDED)
  page.locator("//*[@id='inputEmail1']");

  // by partial text match
  page.locator(':text("Using")');

  // by exact text match
  page.locator(':text-is("Using the Grid")');
});

test("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();
  await page.getByRole("button", { name: "Sign in" }).first().click();
  await page.getByLabel("Email").first().click();
  await page.getByPlaceholder("Jane Doe").click();
  await page.getByText("Using the grid").click();
  // await page.getByTitle("IoT Dashboard").click();

  // considered pretty good practice - define your own test ids
  // however is not user-facing
  await page.getByTestId("SignIn").click();
});

test("locating child elements", async ({ page }) => {
  // await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  // chaining also possible
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 1")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  // bad practice
  // await page.locator("nb-card").nth(3).click();
});

test("parent elements", async ({ page }) => {
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .first()
    .click();

  await page
    .locator("nb-card", { has: page.locator("#inputEmail1") })
    .getByRole("textbox", { name: "Email" })
    .first()
    .click();

  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();

  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();
  // go one level up in DOM
  await page
    .locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing the locators", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });

  await emailField.fill("test@test.com");
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("extracting values", async ({ page }) => {
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();
  expect(buttonText).toEqual("Submit");

  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents();
  expect(allRadioButtonsLabels).toContain("Option 1");

  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("testœtest.com");
  const emailValue = await emailField.inputValue();

  expect(emailValue).toEqual("testœtest.com");

  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

//test('assertions', async ({ page }) => {
// choose text content - assert text content to equal sth
// choose element - assert the element to have specific value
// soft assertion - test can continue even if the assertion fails - expect.soft
//})
