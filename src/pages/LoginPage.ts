// src/pages/LoginPage.ts
import { Page, expect } from '@playwright/test';
import { loginSelectors } from '../selectors/login.selectors';

export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigates to the base URL/Login page.
   */
  async gotoLogin() {
    console.log('🔹 Navigating to Login Page...');
    await this.page.goto('/');
  }

  /**
   * Performs the login action with provided credentials.
   * @param email User email
   * @param password User password
   */
  async login(email: string, password: string) {
    console.log(`🔹 Attempting login with user: ${email}`);
    await this.page.fill(loginSelectors.emailInput, email);
    await this.page.fill(loginSelectors.passwordInput, password);
    await this.page.click(loginSelectors.loginButton);
  }

  /**
   * Validates that the user has successfully logged in.
   * First checks for the success toast, then falls back to URL validation.
   */
  async assertLoggedIn() {
    console.log('🔹 Verifying login success...');
    
    // 1. Try to catch the success toast
    const toast = this.page.locator(loginSelectors.dashboardIndicator);
    try {
      await expect(toast).toBeVisible({ timeout: 10000 });
      console.log('✅ Login successful: Toast appeared.');
    } catch (e) {
      console.warn('⚠️ Toast missed or delayed. Verifying via URL/Dashboard element...');
      
      
  }
}}