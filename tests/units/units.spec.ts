import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProjectsPage } from '../../src/pages/ProjectsPage';
import { UnitsPage } from '../../src/pages/UnitsPage';
import { TEST_USER } from '../../src/config/testConfig';
import { createRandomProjectData } from '../../src/utils/projectData';
import { createRandomUnitsData } from '../../src/utils/unitsData';

test.describe('Feature: Units Management', () => {
  test.describe.configure({ timeout: 900000 });

  test.beforeEach(async ({ page }) => {
    await test.step('Precondition: User logs in and Creates a new Project', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.gotoLogin();
      await loginPage.login(TEST_USER.email, TEST_USER.password);
      await loginPage.assertLoggedIn();

      const projectsPage = new ProjectsPage(page);
      const projectData = createRandomProjectData();

      await projectsPage.openCreateProjectFromMenu();
      await projectsPage.fillMandatoryFields(projectData);
      await projectsPage.submitProject();
      await projectsPage.assertProjectCreated();
    });
  });

  /**
   * TC07: Happy Path - Manual Unit Creation
   * Validates that units can be created manually via the UI form.
   */
  test('TC07 | Units | Validate manual unit creation in a price list', async ({ page }) => {
    const unitsPage = new UnitsPage(page);
    const unitsData = createRandomUnitsData();

    await test.step('1. Navigate to Units module', async () => {
      await unitsPage.goToUnitsFromSidebar();
    });

    await test.step('2. Fill and submit unit creation form', async () => {
      await unitsPage.createUnits(unitsData);
    });

    await test.step('3. Verify units created successfully', async () => {
      await unitsPage.assertUnitsCreated();
    });
  });

  /**
   * TC08: Deletion Logic
   * Validates that deleting a single unit (when others exist) DOES NOT remove the Price List.
   */
  test('TC08 | Units | Validate deleting a single unit keeps the price list', async ({ page }) => {
    const unitsPage = new UnitsPage(page);
    const unitsData = createRandomUnitsData();

    await test.step('1. Setup: Create multiple units', async () => {
      await unitsPage.goToUnitsFromSidebar();
      await unitsPage.createUnits(unitsData);
      await unitsPage.assertUnitsCreated();
    });

    await test.step('2. Verify Price List button exists initially', async () => {
      await unitsPage.openUnitsTab();
      const priceListButton = page.getByRole('button', { name: /Lista precios/i });
      await expect(priceListButton).toBeVisible({ timeout: 60_000 });
    });

    await test.step('3. Delete the first unit', async () => {
      await unitsPage.deleteFirstUnitAndAssertRowDecreased();
    });

    await test.step('4. Verify Price List button is STILL visible', async () => {
      const priceListButton = page.getByRole('button', { name: /Lista precios/i });
      await expect(priceListButton).toBeVisible({ timeout: 10_000 });
    });
  });

  /**
   * TC09: Edge Case - Last Unit Deletion
   * Validates that deleting the VERY LAST unit removes the Price List entirely.
   */
  test('TC09 | Units | Validate that deleting the last unit removes the price list', async ({ page }) => {
    const unitsPage = new UnitsPage(page);

    const baseUnitsData = createRandomUnitsData();
    const singleUnitData = {
      ...baseUnitsData,
      floors: '1',
      unitsPerFloor: '1',
    };

    await test.step('1. Setup: Create exactly ONE unit', async () => {
      await unitsPage.goToUnitsFromSidebar();
      await unitsPage.createUnits(singleUnitData);
      await unitsPage.assertUnitsCreated();
    });

    await test.step('2. Verify there is only 1 row', async () => {
      await unitsPage.openUnitsTab();
      const rowCount = await unitsPage.getUnitRowCount();
      expect(rowCount).toBe(1);
    });

    await test.step('3. Delete the last unit', async () => {
      await unitsPage.deleteLastUnitAndAssertPriceListRemoved();
    });

    await test.step('4. Verify Price List is gone', async () => {
      await unitsPage.assertPriceListNotExists('Lista precios');
    });
  });

  /**
   * TC02: Template Upload & Versioning
   * Validates that uploading a template with the same date reuses the existing price list version.
   */
  test('TC02 | Units | Validate that uploading template with same date reuses price list', async ({ page }) => {
    const unitsPage = new UnitsPage(page);
    const unitsData = createRandomUnitsData();

    
    const templatePath = path.resolve('tests/fixtures/template_unidades_25-11-2025-12_56.xlsx');
    const templatePath2 = path.resolve('tests/fixtures/template_unidades2_25-11-2025-12_56.xlsx');

    await test.step('1. Setup: Create initial units manually', async () => {
      await unitsPage.goToUnitsFromSidebar();
      await unitsPage.createUnits(unitsData);
      await unitsPage.assertUnitsCreated();
    });

    let priceListTextBefore = '';
    
    await test.step('2. Capture initial Price List name', async () => {
      await unitsPage.openUnitsTab();
      const priceListButton = page.getByRole('button', { name: /Lista precios/i });
      await expect(priceListButton).toBeVisible({ timeout: 60_000 });
      priceListTextBefore = (await priceListButton.textContent())?.trim() ?? '';
      console.log(`Initial Price List: ${priceListTextBefore}`);
    });

    await test.step('3. Upload Template (1st time)', async () => {
      await unitsPage.uploadUnitsTemplate(templatePath);
      await page.waitForTimeout(3000); 
    });

    await test.step('4. Upload Template (2nd time - Same Date)', async () => {
      await unitsPage.uploadUnitsTemplate(templatePath2);
      await page.waitForTimeout(3000); 
    });

    await test.step('5. Verify Price List name remains unchanged', async () => {
      const priceListButton = page.getByRole('button', { name: /Lista precios/i });
      await expect(priceListButton).toBeVisible({ timeout: 60_000 });
      
      const priceListTextAfter = (await priceListButton.textContent())?.trim() ?? '';
      console.log(`Final Price List: ${priceListTextAfter}`);
      
      expect(priceListTextAfter).toContain(priceListTextBefore);
    });
  });
});