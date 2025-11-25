import { Page, expect } from "@playwright/test";
import { unitsSelectors } from "../selectors/units.selectors";

export type UnitsFormData = {
  pricePerM2: string;
  floors: string;
  unitsPerFloor: string;
  typologySearch?: string;
};

export class UnitsPage {
  constructor(private page: Page) {}  // ================= NAVIGATION =================
  /**
   * Navigates to the Units section via the sidebar menu (Commercial > Units).
   */

  async goToUnitsFromSidebar() {
    console.log("🔹 Navigating to Commercial > Units...");

    const comercialItem = this.page
      .locator(unitsSelectors.comercialSidebarItem)
      .first();

    await comercialItem.waitFor({ state: "visible", timeout: 10000 });
    await comercialItem.click();

    const unidadesItem = this.page.locator(
      unitsSelectors.comercialUnitsMenuItem
    );

    await unidadesItem.waitFor({ state: "visible", timeout: 10000 });
    await unidadesItem.click();

    const unitsTab = this.page.locator(unitsSelectors.unitsTab);
    if (await unitsTab.count()) {
      await unitsTab.click();
    }
    console.log("✅ Navigated to Units page.");
  }

  async openUnitsTab() {
    const unitsTab = this.page.locator(unitsSelectors.unitsTab);

    await unitsTab.waitFor({ state: "visible", timeout: 10_000 });
    await unitsTab.click();
  }  // ================= PRIVATE HELPERS =================
  /**
   * Selects the first available Typology option from the Autocomplete field.
   * @param search
   */

  private async selectFirstTypology(search?: string) {
    console.log(`🔹 Selecting typology. Search: "${search || "none"}"`);
    const input = this.page.locator(unitsSelectors.typologiesInput);

    await input.waitFor({ state: "visible", timeout: 10000 });
    await expect(input).toBeEnabled({ timeout: 10000 });

    await input.click();

    if (search && search.trim().length > 0) {
      await input.fill("");
      await input.type(search, { delay: 40 });
    } else {
      await input.press("ArrowDown");
    }

    const option = this.page
      .locator(
        'ul[role="listbox"] li.MuiAutocomplete-option, ul[role="listbox"] li'
      )
      .first();

    await option.waitFor({ state: "visible", timeout: 10000 });
    await option.click();
    console.log("✅ Typology selected.");
  }  // ================= PUBLIC ACTIONS =================
  /**
   * Fills the mandatory fields for the Units/Areas creation form.
   */

  async fillMandatoryFields(data: UnitsFormData) {
    console.log("🔹 Filling mandatory unit fields...");
    const d = data;

    await this.page.fill(unitsSelectors.pricePerM2Input, d.pricePerM2);

    await this.page.fill(unitsSelectors.floorsInput, d.floors);

    await this.page.fill(unitsSelectors.unitsPerFloorInput, d.unitsPerFloor);

    await this.selectFirstTypology(d.typologySearch);
    console.log("✅ Mandatory fields filled.");
  }
  /**
   * Clicks the button to create units / save areas.
   */

  async submitUnitsForm() {
    console.log("🔹 Submitting units form...");
    const createButton = this.page.locator(unitsSelectors.createUnitsButton);
    await createButton.waitFor({ state: "visible", timeout: 10000 });
    await expect(createButton).toBeEnabled({ timeout: 10000 });
    await createButton.click();
    console.log("✅ Units form submitted.");
  }
  /**
   * Wrapper method to fill fields and submit.
   */

  async createUnits(data: UnitsFormData) {
    await this.fillMandatoryFields(data);
    await this.submitUnitsForm();
  }
  /**
   * Verifies the success toast ("Areas del proyecto creadas").
   */

  async assertUnitsCreated() {
    console.log("🔹 Verifying success toast for units creation...");
    const toast = this.page.locator(unitsSelectors.unitsToastSuccess);
    await toast.waitFor({ state: "visible", timeout: 15000 });
    await expect(toast).toBeVisible();
    console.log("✅ Units creation verified.");
  }

  async getUnitRowCount(): Promise<number> {
    return this.page.locator(unitsSelectors.unitRows).count();
  }
  /**
   * Deletes the first unit row and verifies the row count decreased.
   * Handles the confirmation modal.
   */

  async deleteFirstUnitAndAssertRowDecreased() {
    console.log("🔹 Deleting first unit row...");
    const rows = this.page.locator(unitsSelectors.unitRows);
    await rows.first().waitFor({ state: "visible", timeout: 10000 });

    const before = await this.getUnitRowCount();
    expect(before).toBeGreaterThan(0);

    const deleteButton = this.page.locator(unitsSelectors.firstRowDeleteButton);

    await deleteButton.waitFor({ state: "visible", timeout: 10000 });
    await deleteButton.click();

    const confirmBtn = this.page.getByRole("button", { name: /Confirmar/i });
    if (await confirmBtn.count()) {
      await confirmBtn.first().click();
    }

    await expect
      .poll(
        async () => {
          return this.getUnitRowCount();
        },
        { timeout: 10000 }
      )
      .toBeLessThan(before);
    console.log("✅ Unit deleted and row count verified.");
  }
  /**
   * Deletes the last remaining unit and verifies the entire Price List is removed.
   */

  async deleteLastUnitAndAssertPriceListRemoved() {
    console.log("🔹 Deleting the last unit (expecting price list removal)...");
    const rows = this.page.locator(unitsSelectors.unitRows);
    const count = await rows.count();
    expect(count).toBe(1); 

    const deleteButton = this.page.locator(unitsSelectors.firstRowDeleteButton);

    await deleteButton.waitFor({ state: "visible", timeout: 10000 });
    await deleteButton.click();

    const confirmBtn = this.page.getByRole("button", { name: /Confirmar/i });
    if (await confirmBtn.count()) {
      await confirmBtn.first().click();
    }

    await expect(rows).toHaveCount(0);

    const priceListBtn = this.page.locator(unitsSelectors.priceListButton);
    await expect(priceListBtn).not.toBeVisible({ timeout: 10000 });
    console.log("✅ Last unit and price list successfully removed.");
  }
  /**
   * Uploads a units template file.
   * @param filePath The local path to the template file.
   */

  async uploadUnitsTemplate(filePath: string) {
    console.log(`🔹 Uploading template file from: ${filePath}`);
    const unitsTab = this.page.locator(unitsSelectors.unitsTab);
    if (await unitsTab.count()) {
      await unitsTab.click();
    }

    const templatesBtn = this.page
      .locator(unitsSelectors.templatesButton)
      .first();
    await templatesBtn.waitFor({ state: "visible", timeout: 10_000 });
    await templatesBtn.click();

    const uploadItem = this.page.getByRole("button", {
      name: "Cargar Template de Unidades",
      exact: true,
    });

    await uploadItem.waitFor({ state: "visible", timeout: 10_000 });
    await uploadItem.click();

    const input = this.page.locator(unitsSelectors.uploadTemplateInput);
    await input.waitFor({ state: "attached", timeout: 10_000 });
    await input.setInputFiles(filePath);

    const submitBtn = this.page.getByRole("button", {
      name: "Cargar",
      exact: true,
    });
    await submitBtn.waitFor({ state: "visible", timeout: 10_000 });
    await submitBtn.click();
    console.log("✅ Template submitted.");
  }

  async assertPriceListExists(namePart: string) {
    console.log("🔹 Verifying price list existence...");
    const btn = this.page
      .getByRole("button", { name: new RegExp(namePart, "i") })
      .first();
    await expect(btn).toBeVisible({ timeout: 10000 });
    console.log("✅ Price list button found.");
  }

  async assertPriceListNotExists(namePart: string) {
    console.log("🔹 Verifying price list non-existence...");
    const btn = this.page
      .getByRole("button", { name: new RegExp(namePart, "i") })
      .first();
    await expect(btn).not.toBeVisible({ timeout: 10000 });
    console.log("✅ Price list button not found.");
  }
}
