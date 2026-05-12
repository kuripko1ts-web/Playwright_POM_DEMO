import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.js';

test('login and logout', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.gotoLoginPage();

  await loginPage.login('tomsmith', 'SuperSecretPassword!');

  await expect(page).toHaveURL(/.*secure/);
  await loginPage.logout();
  await expect(page).toHaveURL(/.*login/);
});