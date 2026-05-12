import { test, expect } from '@playwright/test';
import { Login_logout } from './pages/login.js';
//import { Checkout } from './login_loguot.js';
//import { OrderValidationPage } from './pages/orderValidation.js';



test('SMK-01: Login valid user @smoke @auth @SMK-01', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();

    await loginLogout.logout();
});



test('SMK-02: Login NOTvalid user @smoke @auth @negative @BF-2', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    // await page.pause();
    await loginLogout.login('312', 'secret_sauce');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and password do not match any user in this service");

});

test('SMK-03: Login NOTvalid password @smoke @auth @negative @BF-2', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    //await page.pause();
    await loginLogout.login('standard_user', '32132');

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and password do not match any user in this service");
    // await page.close();
});


test('SMK-04: Add 1 item to cart @smoke @cart', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    // Goto + login
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Verify inventory page
    await expect(loginLogout.inventoryList).toBeVisible();

    // Add 1 item to cart
    await loginLogout.addSingleItemBikeLightToCart();
    await loginLogout.openShoppingCartAndAssertOneItems();

    // await expect(loginLogout.shoppingCartBadge).toHaveText('1');
});

test('SMK-05: Checkout happy path (1 item) @smoke @checkout', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    // Goto + login
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Add 1 item to cart
    await loginLogout.addSingleItemBikeLightToCart();

    // Open cart and proceed to checkout + Verify order complete
    await loginLogout.shoppingCartLink.click();
    await loginLogout.completeCheckoutFromCart('John', 'Doe', '12345');

    // Logout
    await loginLogout.logout();
});
test('SMK-06 Logout from app menu @smoke @auth', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    // Login first
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Verify logged in
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginLogout.menubutton).toBeVisible();

    // Logout
    await loginLogout.logout();

    // Verify returned to login page
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
});




// E2E: логін → вітрина → кошик → checkout → logout
test('BF-1: Add 2 items to cart @smoke @cart', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    // Goto + login
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Каталог + вітрина 2×ADD, Remove, check
    await expect(loginLogout.inventoryList).toBeVisible();
    await loginLogout.addTwoItemsBikeLightAndFleeceToCart();

    // Кошик
    await loginLogout.openShoppingCartAndAssertTwoItems();

    // Checkout
    await loginLogout.completeCheckoutFromCart('pavel', 'KKK', '123');

    // Logout
    await loginLogout.logout();
});

test('BF-3/REG-03: Price Integrity @smoke @auth @negative @BF-3 @REG-03 @regression @checkout', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');
    //await page.pause();
    // Step 1: Capture inventory prices
    const bikeLightInventoryPrice = await loginLogout.getInventoryItemPrice('Sauce Labs Bike Light');
    console.log(`📦 Bike Light Inventory Price: $${bikeLightInventoryPrice}`);

    // Step 2: Add item to cart and verify
    await loginLogout.addSingleItemBikeLightToCart();

    // Step 3: Open cart and verify price
    await loginLogout.shoppingCartLink.click();
    const cartPrice = await loginLogout.getCartItemPrice();
    console.log(`🛒 Bike Light Cart Price: $${cartPrice}`);
    expect(cartPrice).toBe(bikeLightInventoryPrice);

    // Step 4: Proceed to checkout overview and verify totals
    await loginLogout.checkoutButton.click();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    // Fill form to reach overview
    await loginLogout.firstNameInput.fill('Pavel');
    await loginLogout.lastNameInput.fill('Test');
    await loginLogout.postalCodeInput.fill('12345');
    await loginLogout.continueButton.click();

    // Step 5: Compare prices in overview and verify math
    const checkoutPrices = await loginLogout.getCheckoutOverviewPrices();
    console.log(`💰 Checkout Overview - Subtotal: $${checkoutPrices.subtotal}, Tax: $${checkoutPrices.tax}, Total: $${checkoutPrices.total}`);

    // Verify math
    await loginLogout.verifyPriceMath(bikeLightInventoryPrice, checkoutPrices);
    console.log(`✅ Price integrity verified!`);


    // Complete order
    await loginLogout.finishButton.click();
    await expect(loginLogout.orderCompleteHeader).toBeVisible();
    await loginLogout.logout();
});


test('REG-01/BF-2: All known users login outcomes @regression @auth @cart @REG-01 @BF-2', async ({ page }) => {
    const loginLogout = new Login_logout(page);
    // standard_user
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();

    await loginLogout.logout();

    //locked_out_user
    await loginLogout.login('locked_out_user', 'secret_sauce');
    //await page.pause();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page.getByText('Swag Labs')).toBeVisible();
    await page.locator('[data-test="error-button"]').click();

    //locked_out_user
    await loginLogout.login('problem_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();

    await loginLogout.logout();
    // performance_glitch_user
    await loginLogout.login('performance_glitch_user', 'secret_sauce');
    // Add significant delay for performance glitch user
    await page.waitForTimeout(5000); // 5 second delay for slow loading

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();

    await loginLogout.logout();
    //error_user
    await loginLogout.login('error_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();

    await loginLogout.logout();
    //visual_user
    await loginLogout.login('visual_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();

    await loginLogout.logout();

});

test('REG-02: Cart qty and item names match selection @regression @cart @REG-02', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    // Goto + login
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Step 1: Add Bike Light to cart (1 item)
    await loginLogout.addSingleItemBikeLightToCart();
    let badgeCount = await loginLogout.getCartBadgeCount();
    expect(badgeCount).toBe(1);
    console.log(`✅ Badge shows 1 item after adding Bike Light`);

    // Step 2: Add Fleece Jacket (now 2 items total)
    await loginLogout.addToCartFleeceJacket.click();
    badgeCount = await loginLogout.getCartBadgeCount();
    expect(badgeCount).toBe(2);
    console.log(`✅ Badge shows 2 items after adding Fleece Jacket`);

    // Step 3: Open cart and verify items match selection
    const expectedItems = [
        { name: 'Bike Light', quantity: 1 },
        { name: 'Fleece Jacket', quantity: 1 }
    ];

    await loginLogout.verifyCartMatchesSelection(expectedItems);
    console.log(`✅ Cart contents exactly match selected items`);

    // Logout
    await loginLogout.logout();
});



test('REG-04: Order totals math  @REG-04 @regression @checkout ', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');
    //await page.pause();
    // Step 1: Capture inventory prices
    const SLOPrice = await loginLogout.getInventoryItemPrice('Sauce Labs Onesie');
    console.log(`📦 Sauce Labs Onesie Price: $${SLOPrice}`);
    const SLBTPrice = await loginLogout.getInventoryItemPrice('Sauce Labs Bolt T-Shirt');
    console.log(`📦 Sauce Labs Bolt T-Shirt Price: $${SLBTPrice}`);
    

    // Step 2: Add 2 items to cart and verify
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await loginLogout.shoppingCartLink.click();

    // Step 3: Open cart and verify prices
    const cart1Price = await loginLogout.getCartItemPrice('Sauce Labs Onesie');
    console.log(`🛒 Sauce Labs Onesie Cart Price: $${cart1Price}`);
    expect(cart1Price).toBe(SLOPrice);

    const cart2Price = await loginLogout.getCartItemPrice('Sauce Labs Bolt T-Shirt');
    console.log(`🛒 Sauce Labs Bolt T-Shirt Cart Price: $${cart2Price}`);
    expect(cart2Price).toBe(SLBTPrice);

    // Step 4: Proceed to checkout overview and verify totals
    await loginLogout.checkoutButton.click();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();

    // Fill form to reach overview
    await loginLogout.firstNameInput.fill('Pavel');
    await loginLogout.lastNameInput.fill('Test');
    await loginLogout.postalCodeInput.fill('12345');
    await loginLogout.continueButton.click();

    // Step 5: Compare prices in overview and verify math
    const checkoutPrices = await loginLogout.getCheckoutOverviewPrices();
    console.log(`💰 Checkout Overview - Subtotal: $${checkoutPrices.subtotal}, Tax: $${checkoutPrices.tax}, Total: $${checkoutPrices.total}`);

    // Verify math
    const expectedSubtotal = SLOPrice + SLBTPrice;
    await loginLogout.verifyPriceMath(expectedSubtotal, checkoutPrices);
    console.log(`✅ Price integrity verified!`);

    // Complete order
    await loginLogout.finishButton.click();
    await expect(loginLogout.orderCompleteHeader).toBeVisible();
    await loginLogout.logout();
});
test('REG-05: Checkout step one @REG-05 @checkout @regression @ @negative', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');
    //await page.pause();
    await loginLogout.addSingleItemBikeLightToCart();
    await loginLogout.shoppingCartLink.click();
    await loginLogout.Checkoutstepone('PAvel', 'P1', '321');
    await loginLogout.logout();
});
test('REG-06: Remove item from cart @regression @cart @REG-06', async ({ page }) => {
    const loginLogout = new Login_logout(page);
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(loginLogout.menubutton).toBeVisible();
    await expect(loginLogout.inventoryList).toBeVisible();
    await loginLogout.addTwoItemsBikeLightAndFleeceToCart();
    //await page.pause();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('2');
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toContainText('1');
    await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();

    // When cart is empty, badge should not be visible (not show "0")
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    await page.locator('[data-test="continue-shopping"]').click();
    await loginLogout.logout();
});

// test('REG-07: Sort Low->High / High->Low @regression @inventory @REG-07', async ({ page }) => {
//     const loginLogout = new Login_logout(page);

//     await loginLogout.gotoLoginPage();
//     await loginLogout.login('standard_user', 'secret_sauce');

//     await expect(page).toHaveURL(/\/inventory\.html$/);
//    await page.pause();

//     await loginLogout.logout();
// });
test('REG-07: Sort Low->High / High->Low @regression @inventory @REG-07', async ({ page }) => {
    const loginLogout = new Login_logout(page);
//await page.pause();
    // Login
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Verify inventory page is loaded
    await expect(loginLogout.inventoryList).toBeVisible();

    // Test 1: Sort Low to High
    console.log('Testing Price (low to high) sort...');
    await loginLogout.verifySortLowToHigh();
    console.log('✓ Low to High sort passed');

    // Test 2: Sort High to Low
    console.log('Testing Price (high to low) sort...');
    await loginLogout.verifySortHighToLow();
    console.log('✓ High to Low sort passed');

    // Logout
    await loginLogout.logout();
});

test('REG-08: Back Home after order completion @regression @checkout @REG-08', async ({ page }) => {
    const loginLogout = new Login_logout(page);

    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');

    // Add item to cart
    await loginLogout.addSingleItemBikeLightToCart();

    // Go to cart and checkout
    await loginLogout.shoppingCartLink.click();
    await loginLogout.checkoutButton.click();

    // Fill checkout form
    await loginLogout.firstNameInput.fill('Pavel');
    await loginLogout.lastNameInput.fill('Test');
    await loginLogout.postalCodeInput.fill('12345');
    await loginLogout.continueButton.click();

    // Complete order
    await loginLogout.finishButton.click();

    // Verify order complete page
    await expect(loginLogout.orderCompleteHeader).toBeVisible();
    await expect(loginLogout.backToProductsButton).toBeVisible();

    // Click Back Home and verify navigation to inventory
    await loginLogout.backToProductsButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginLogout.inventoryList).toBeVisible();

    await loginLogout.logout();
});


test('REG-09: Verify all product names are present @REG-09 @regression @checkout', async ({ page }) => {
    const loginLogout = new Login_logout(page);
    await loginLogout.gotoLoginPage();
    await loginLogout.login('standard_user', 'secret_sauce');
    
    await loginLogout.verifyEmptyNames(); // Твій новий метод
    console.log(`✅ Всі назви товарів валідні та не порожні.`);
});