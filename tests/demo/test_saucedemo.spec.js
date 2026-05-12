import { test, expect } from '@playwright/test';
import { Login_logout } from './login_loguot.js';
import { Checkout } from './login_loguot.js';
import { OrderValidationPage } from './pages/orderValidation.js';

test('test @log', async ({ page }) => {
  const loginLogout = new Login_logout(page);

  await loginLogout.gotoLoginPage();
  await loginLogout.login('standard_user', 'secret_sauce');
  await loginLogout.logout();

});

test.describe('Order', () => {
  const expectedProducts = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Backpack'];

  test.beforeEach(async ({ page }) => {
    const loginLogout = new Login_logout(page);
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');
  });

  test('cart has correct quantity and product names', async ({ page }) => {
    const orderValidation = new OrderValidationPage(page);

    await orderValidation.addProductsToCartByNames(expectedProducts);
    await expect(await orderValidation.getCartBadgeText()).toBe(String(expectedProducts.length));

    await orderValidation.openCart();
    const cartNames = (await orderValidation.getCartProductNames()).map((name) => name.trim());
    await expect(cartNames.sort()).toEqual([...expectedProducts].sort());
  });

  test('overview prices match inventory prices', async ({ page }) => {
    const orderValidation = new OrderValidationPage(page);
    const checkout = new Checkout(page);
    const loginLogout = new Login_logout(page);

    const inventoryProducts = await orderValidation.getInventoryProductsByNames(expectedProducts);
    await orderValidation.addProductsToCartByNames(expectedProducts);
    await orderValidation.openCart();
    await orderValidation.proceedToOverview('Pavel', 'Kuripko', '323322');

    const overviewProducts = await orderValidation.getOverviewProducts();

    for (const expectedProduct of inventoryProducts) {
      const overviewProduct = overviewProducts.find((product) => product.name === expectedProduct.name);
      await expect(overviewProduct?.price).toBe(expectedProduct.price);
    }

    await checkout.Finish.click();
    await checkout.backtohome.click();
    await loginLogout.logout();
  });
});