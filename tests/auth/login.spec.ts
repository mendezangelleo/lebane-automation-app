import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { TEST_USER } from '../../src/config/testConfig';

test.describe('Feature: Authentication', () => {
  
  /**
   * TC00: Validate that a user with valid credentials can access the dashboard.
   * Priority: Critical
   */
  test('TC00 | Login | Validate successful user login', async ({ page }) => {
    
   
    const loginPage = new LoginPage(page);

    await test.step('1. Navigate to the application', async () => {
      await loginPage.gotoLogin();
    });

    await test.step('2. Submit valid credentials', async () => {
      console.log(`Test User: ${TEST_USER.email}`);
      await loginPage.login(TEST_USER.email, TEST_USER.password);
    });

    await test.step('3. Verify successful redirection to Dashboard', async () => {
      await loginPage.assertLoggedIn();
    });

  });
});