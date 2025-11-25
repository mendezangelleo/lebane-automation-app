// tests/projects/projects.spec.ts
import { test } from "@playwright/test";
import { LoginPage } from "../../src/pages/LoginPage";
import { ProjectsPage } from "../../src/pages/ProjectsPage";
import { TEST_USER } from "../../src/config/testConfig";
import { createRandomProjectData } from "../../src/utils/projectData";

test.describe("Feature: Project Creation", () => {
  test.describe.configure({ timeout: 900000 });

  test.beforeEach(async ({ page }) => {
    await test.step("Precondition: User logs in", async () => {
      const loginPage = new LoginPage(page);
      await loginPage.gotoLogin();
      await loginPage.login(TEST_USER.email, TEST_USER.password);
      await loginPage.assertLoggedIn();
    });
  });

  // ----------------------------------------------------------------------------------

  /**
   * TC01: Happy Path
   * Validates that a project can be created successfully when all mandatory fields are provided.
   */
  test("TC01 | Projects | Validate project creation with all mandatory fields", async ({
    page,
  }) => {
    const projectsPage = new ProjectsPage(page);
    const projectData = createRandomProjectData();

    await test.step('1. Open "Create Project" modal', async () => {
      await projectsPage.openCreateProjectFromMenu();
    });

    await test.step(`2. Fill mandatory fields (Project: ${projectData.projectName})`, async () => {
      console.info(`Data used for TC01: ${projectData.projectName}`);
      await projectsPage.fillMandatoryFields(projectData);
    });

    await test.step("3. Submit the form", async () => {
      await projectsPage.submitProject();
    });

    await test.step("4. Verify success toast", async () => {
      await projectsPage.assertProjectCreated();
    });
  });

  // ----------------------------------------------------------------------------------

  /**
   * TC02: Negative Test
   * Validates that the "Register" button remains disabled if mandatory fields are missing.
   */
  test("TC02 | Projects | Validate project is not created when mandatory fields are missing", async ({
    page,
  }) => {
    const projectsPage = new ProjectsPage(page);

    await test.step('1. Open "Create Project" modal', async () => {
      await projectsPage.openCreateProjectFromMenu();
    });

    await test.step('2. Verify "Register" button is disabled initially', async () => {
      await projectsPage.assertRegisterDisabled();
    });
  });

  // ----------------------------------------------------------------------------------

  /**
   * TC03: Edge Case - Duplicate Project Creation
   * Validates that the system prevents creating two projects with the exact same name.
   */
  test("TC03 | Projects | Validate error when creating an already existing project", async ({
    page,
  }) => {
    const projectsPage = new ProjectsPage(page);

    const duplicatedName = `Duplicate Project QA ${Date.now()}`;
    const projectData = {
      ...createRandomProjectData(),
      projectName: duplicatedName,
    };

    await test.step("Phase 1: Create the original project", async () => {
      console.info(`Creating ORIGINAL project: ${duplicatedName}`);
      await projectsPage.openCreateProjectFromMenu();
      await projectsPage.fillMandatoryFields(projectData);
      await projectsPage.submitProject();
      await projectsPage.assertProjectCreated();
    });

    await test.step("Phase 2: Attempt to create the duplicate project", async () => {
      console.info(`Attempting to create DUPLICATE project: ${duplicatedName}`);

      const duplicateData = {
        ...createRandomProjectData(),
        projectName: duplicatedName,
      };

      await projectsPage.openCreateProjectFromMenu();
      await projectsPage.fillMandatoryFields(duplicateData);
      await projectsPage.submitProject();
    });

    await test.step("3. Verify duplicate error message", async () => {
      await projectsPage.assertDuplicateProjectError();
    });
  });
});
