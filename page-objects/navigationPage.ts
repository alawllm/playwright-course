import { Locator, Page } from "@playwright/test";

class NavigationPage {
  // new type inside of the class
  readonly page: Page;
  readonly formLayoutsMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formLayoutsMenuItem = page.getByText("Form Layouts");
  }

  async formLayoutsPage() {
    await this.page.getByText("Forms").click();
    await this.formLayoutsMenuItem.click();
  }

  // extend with other page types
}

export { NavigationPage };
