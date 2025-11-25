import { Page, expect } from "@playwright/test";
import { projectsSelectors } from "../selectors/projects.selectors";

export class ProjectsPage {
  constructor(private page: Page) {}  // ================= NAVIGATION =================
  /**
   * Opens the 'Create Project' modal via the main application menu.
   */

  async openCreateProjectFromMenu() {
    console.log('🔹 Opening "Create Project" menu...');
    await this.page.click(projectsSelectors.menuButton);

    const createProject = this.page.getByRole("menuitem", {
      name: "Agregar proyecto",
      exact: true,
    });

    await createProject.waitFor({ state: "visible", timeout: 10000 });
    await createProject.click();
    console.log('✅ "Create Project" modal opened.');
  }  // ================= PRIVATE HELPERS =================
  /**
   * Selects an option from an Autocomplete dropdown by clicking the input to open the full list,
   * then selecting the option directly without relying on typing/filtering.
   * @param inputSelector Selector for the Autocomplete input field.
   * @param value The text value to search and select (e.g., "EUR", "Argentina").
   */

  private async selectAutocompleteByValue(
    inputSelector: string,
    value: string
  ) {
    const input = this.page.locator(inputSelector);
    if (!(await input.count())) {
      console.warn(`⚠️ Autocomplete input not found: ${inputSelector}`);
      return;
    }

    console.log(`🔹 Selecting value via FILL + Keyboard: "${value}"...`);

    await input.waitFor({ state: "visible", timeout: 10000 });
    await expect(input).toBeEnabled({ timeout: 20000 });
    await input.click({ force: true });
    await input.fill(value);

    await this.page.waitForTimeout(1000);

    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue(value, { timeout: 10000 });
    console.log(`✅ Value "${value}" successfully set and verified.`);
  }
  /**
   * Opens an Autocomplete field (e.g., State/City) and selects the first available option.
   */

  private async selectFirstAutocompleteOption(inputSelector: string) {
    const input = this.page.locator(inputSelector);
    if (!(await input.count())) return; // INCREASED TIMEOUT FOR DEPENDENCY WAITING

    await input.waitFor({ state: "visible", timeout: 10000 });
    await expect(input).toBeEnabled({ timeout: 20000 });

    await input.click();
    await input.type("a", { delay: 40 });

    const firstOption = this.page
      .locator(projectsSelectors.autocompleteFirstOption)
      .first();

    if (await firstOption.count()) {
      await firstOption.waitFor({ state: "visible", timeout: 5000 });
      await firstOption.click();
    }
  }
  /**
   * Sets a date in a date-picker input with a retry mechanism.
   */

  private async setDate(selector: string, date: string) {
    const input = this.page.locator(selector);
    if (!(await input.count())) return;

    await input.click({ force: true }); // Retry loop to ensure the date sticks

    for (let i = 0; i < 2; i++) {
      await input.fill("");
      await input.type(date, { delay: 60 });
      await input.press("Tab");

      const current = await input.inputValue();
      if (current === date) return;
    }
  } // --------- PUBLIC ACTIONS ---------

  async uploadLogoIfNeeded(filePath: string | null) {
    if (!filePath) return;
    console.log("🔹 Uploading project logo...");
    await this.page.click(projectsSelectors.uploadLogoClickable);
    await this.page.setInputFiles('input[type="file"]', filePath);
  }
  /**
   * Fills all mandatory fields in the project creation form.
   */

  async fillMandatoryFields(data: {
    projectName: string;
    currency: string;
    country: string;
    address: string;
    addressNumber: string;
    startDate: string;
    endDate: string;
    businessName: string;
    businessDocumentNumber: string;
    registrationDate: string;
    documentType: string;
    documentNumber: string;
  }) {
    console.log("🔹 Filling mandatory project fields...");
    const d = data;

    await this.page.fill(projectsSelectors.projectNameInput, d.projectName);

    await this.selectAutocompleteByValue(
      projectsSelectors.currencyInput,
      d.currency
    );

    await this.selectAutocompleteByValue(
      projectsSelectors.countryInput,
      d.country
    );

    await this.selectFirstAutocompleteOption(projectsSelectors.stateInput);
    await this.selectFirstAutocompleteOption(projectsSelectors.cityInput);

    await this.page.fill(projectsSelectors.addressInput, d.address);
    await this.page.fill(projectsSelectors.addressNumberInput, d.addressNumber);

    await this.setDate(projectsSelectors.startDateInput, d.startDate);
    await this.setDate(projectsSelectors.endDateInput, d.endDate);

    await this.selectFirstAutocompleteOption(
      projectsSelectors.constructionTypeInput
    );

    const businessInput = this.page.locator(
      projectsSelectors.businessNameInput
    );
    if (await businessInput.count()) {
      await businessInput.fill(d.businessName);
      await this.page.keyboard.press("Enter");
    }

    const businessDocType = this.page.locator(
      projectsSelectors.businessDocumentTypeInput
    );

    if (await businessDocType.count()) {
      await expect(businessDocType).toBeEnabled({ timeout: 20000 });
      await this.selectAutocompleteByValue(
        projectsSelectors.businessDocumentTypeInput,
        d.documentType
      );
    }

    const businessDocNumber = this.page.locator(
      projectsSelectors.businessDocumentNumberInput
    );

    if (await businessDocNumber.count()) {
      await expect(businessDocNumber).toBeEnabled({ timeout: 20000 });
      await businessDocNumber.fill(d.businessDocumentNumber);
    }

    console.log("✅ All mandatory fields filled.");
  }

  async submitProject() {
    console.log("🔹 Submitting project...");
    const button = this.page.locator(projectsSelectors.registerButton);

    await this.page.keyboard.press("Tab");
    await this.page.waitForTimeout(500);

    await expect(button).toBeEnabled({ timeout: 10000 });
    await button.click();
    console.log("✅ Project submitted.");
  }
  async assertProjectCreated() {
    console.log("🔹 Waiting for success toast...");
    const toast = this.page.locator(projectsSelectors.toastSuccess);

    await toast.waitFor({
      state: "visible",
      timeout: 40000,
    });

    await expect(toast).toBeVisible();
    console.log("✅ Project creation verified.");
  }

  async assertRegisterDisabled() {
    await expect(
      this.page.locator(projectsSelectors.registerButton)
    ).toBeDisabled();
  }

  async assertDuplicateProjectError() {
    console.log("🔹 Verifying duplicate error...");
    const errorToast = this.page.locator(
      projectsSelectors.duplicateProjectErrorText
    );
    await errorToast.waitFor({ state: "visible", timeout: 40000 });
    await expect(errorToast).toBeVisible();
  }
}
