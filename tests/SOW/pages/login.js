import { expect } from '@playwright/test';

export class Login_logout {

    constructor(page) {
        this.page = page;

        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.menubutton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');

        // Каталог
        this.inventoryList = page.locator('.inventory_list');

        // Вітрина: товари + кошик
        this.addToCartBikeLight = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.addToCartFleeceJacket = page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
        this.removeBikeLight = page.locator('[data-test="remove-sauce-labs-bike-light"]');
        this.removeFleeceJacket = page.locator('[data-test="remove-sauce-labs-fleece-jacket"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');

        // Кошик + checkout
        this.cartItem = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.totalLabel = page.locator('[data-test="total-label"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.orderCompleteHeader = page.locator('[data-test="complete-header"]');
        this.backToProductsButton = page.locator('[data-test="back-to-products"]');

        // Сортування
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.inventoryItemNames = page.locator('.inventory_item_name');
        this.inventoryItemPrices = page.locator('.inventory_item_price');
    }
    async gotoLoginPage() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async logout() {
        await this.menubutton.click();
        await this.logoutLink.click();
    }
    async verifyCheckoutValidationError(expectedMessage) {
        await this.continueButton.click();
        const errorLocator = this.page.locator('[data-test="error"]');
        await expect(errorLocator).toBeVisible();
        await expect(errorLocator).toContainText(expectedMessage);
    }

    // Вітрина ADD, Remove, check
    async addSingleItemBikeLightToCart() {
        await this.addToCartBikeLight.click();
        await expect(this.removeBikeLight).toBeVisible();
        await expect(this.shoppingCartLink).toBeVisible();
    }

    // Вітрина 2×ADD, Remove, check
    async addTwoItemsBikeLightAndFleeceToCart() {
        await this.addToCartBikeLight.click();
        await this.addToCartFleeceJacket.click();
        await expect(this.removeBikeLight).toBeVisible();
        await expect(this.removeFleeceJacket).toBeVisible();
        await expect(this.shoppingCartLink).toBeVisible();
    }

    // Кошик: відкрити, 2 lines, checkout
    async openShoppingCartAndAssertTwoItems() {
        await this.shoppingCartLink.click();
        await expect(this.checkoutButton).toBeVisible();
        await expect(this.cartItem).toHaveCount(2);
        await expect(this.page.getByText('Sauce Labs Bike Light')).toBeVisible();
        await expect(this.page.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
    }
    async openShoppingCartAndAssertOneItems() {
        await this.shoppingCartLink.click();
        await expect(this.checkoutButton).toBeVisible();
        await expect(this.cartItem).toHaveCount(1);
        await expect(this.page.getByText('Sauce Labs Bike Light')).toBeVisible();
    }

    // Checkout: форма → finish → каталог
    async completeCheckoutFromCart(firstName, lastName, postalCode) {
        await this.checkoutButton.click();
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await expect(this.totalLabel).toBeVisible();
        await expect(this.finishButton).toBeVisible();
        await this.finishButton.click();
        await expect(this.orderCompleteHeader).toBeVisible();
        await expect(this.backToProductsButton).toBeVisible();
        await this.backToProductsButton.click();
    }
    async Checkoutstepone(firstName, lastName, postalCode) {
        await expect(this.page.locator('[data-test="secondary-header"]')).toBeVisible({ timeout: 10000 });
        await expect(this.page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible({ timeout: 10000 });
        await expect(this.page.locator('[data-test="continue-shopping"]')).toBeVisible({ timeout: 10000 });
        await this.page.locator('[data-test="checkout"]').click();
        await expect(this.page.locator('[data-test="firstName"]')).toBeVisible();
        await expect(this.page.locator('[data-test="lastName"]')).toBeVisible();
        await expect(this.page.locator('[data-test="postalCode"]')).toBeVisible();
        await expect(this.page.locator('[data-test="secondary-header"]')).toBeVisible();
        await this.page.locator('[data-test="continue"]').click();
        await expect(this.page.locator('[data-test="error"]')).toContainText('Error: First Name is required');

        await this.firstNameInput.fill(firstName);
        await this.page.locator('[data-test="continue"]').click();
        await expect(this.page.locator('[data-test="error"]')).toBeVisible();
        await expect(this.page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');

        await this.lastNameInput.fill(lastName);
        await this.page.locator('[data-test="continue"]').click();
        await expect(this.page.locator('[data-test="error"]')).toBeVisible();
        await expect(this.page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await expect(this.totalLabel).toBeVisible();
        await expect(this.finishButton).toBeVisible();
        await this.finishButton.click();
        await expect(this.orderCompleteHeader).toBeVisible();
        await expect(this.backToProductsButton).toBeVisible();
        await this.backToProductsButton.click();
    }

    // Price Integrity Methods
    async getInventoryItemPrice(productName) {
        const priceLocator = this.page.locator(
            `.inventory_item:has-text("${productName}") .inventory_item_price`
        );
        const priceText = await priceLocator.textContent();
        return parseFloat(priceText.replace('$', ''));
    }

    async getCartItemPrice(productName) {
        const priceLocator = productName
            ? this.page.locator(`.cart_item:has-text("${productName}") .inventory_item_price`)
            : this.page.locator('.inventory_item_price');
        const priceText = await priceLocator.first().textContent();
        return parseFloat(priceText.replace('$', ''));
    }

    async getCheckoutOverviewPrices() {
        const subtotalLocator = this.page.locator('[data-test="subtotal-label"]');
        const taxLocator = this.page.locator('[data-test="tax-label"]');
        const totalLocator = this.page.locator('[data-test="total-label"]');

        const subtotalText = await subtotalLocator.textContent();
        const taxText = await taxLocator.textContent();
        const totalText = await totalLocator.textContent();

        return {
            subtotal: parseFloat(subtotalText.match(/\$([\d.]+)/)[1]),
            tax: parseFloat(taxText.match(/\$([\d.]+)/)[1]),
            total: parseFloat(totalText.match(/\$([\d.]+)/)[1])
        };
    }

    async verifyPriceMath(inventoryPrice, checkoutPrices) {
        // Verify subtotal matches inventory price
        expect(checkoutPrices.subtotal).toBe(inventoryPrice);

        // Verify total = subtotal + tax
        const calculatedTotal = checkoutPrices.subtotal + checkoutPrices.tax;
        expect(checkoutPrices.total).toBeCloseTo(calculatedTotal, 2);
    }

    // Cart Verification Methods
    async getCartBadgeCount() {
        const badge = this.page.locator('[data-test="shopping-cart-badge"]');
        if (await badge.isVisible()) {
            const count = await badge.textContent();
            return parseInt(count);
        }
        return 0;
    }

    async getCartItemsData() {
        await this.shoppingCartLink.click();
        const cartItems = [];
        const itemElements = await this.page.locator('.cart_item').all();

        for (const item of itemElements) {
            const nameLocator = item.locator('[data-test="inventory-item-name"]');
            const quantityLocator = item.locator('[data-test="item-quantity"]');
            const priceLocator = item.locator('.inventory_item_price');

            const name = await nameLocator.textContent();
            const quantity = await quantityLocator.textContent();
            const price = await priceLocator.textContent();

            cartItems.push({
                name: name.trim(),
                quantity: parseInt(quantity),
                price: parseFloat(price.replace('$', ''))
            });
        }

        return cartItems;
    }

    async verifyCartMatchesSelection(expectedItems) {
        // Get actual cart data
        const actualCartItems = await this.getCartItemsData();
        const actualBadgeCount = await this.getCartBadgeCount();

        // Calculate total expected quantity
        const expectedTotalQty = expectedItems.reduce((sum, item) => sum + item.quantity, 0);

        console.log(`🛒 Cart Badge Count: ${actualBadgeCount}, Expected Qty: ${expectedTotalQty}`);
        expect(actualBadgeCount).toBe(expectedTotalQty);

        // Verify items count matches
        expect(actualCartItems.length).toBe(expectedItems.length);

        // Verify each item
        for (let i = 0; i < expectedItems.length; i++) {
            console.log(`✓ Item ${i + 1}: ${actualCartItems[i].name} | Qty: ${actualCartItems[i].quantity}`);
            expect(actualCartItems[i].name).toContain(expectedItems[i].name);
            expect(actualCartItems[i].quantity).toBe(expectedItems[i].quantity);
        }
    }

    // Методи для сортування
    async selectSortOption(option) {
        await this.sortDropdown.selectOption(option);
    }

    async getProductNames() {
        const names = await this.inventoryItemNames.allTextContents();
        return names;
    }

    async getProductPrices() {
        const priceTexts = await this.inventoryItemPrices.allTextContents();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    async verifySortLowToHigh() {
        await this.selectSortOption('lohi'); // Price (low to high)
        const prices = await this.getProductPrices();

        for (let i = 1; i < prices.length; i++) {
            if (prices[i] < prices[i - 1]) {
                throw new Error(`Sort failed: ${prices[i - 1]} should be <= ${prices[i]}`);
            }
        }
    }

    async verifySortHighToLow() {
        await this.selectSortOption('hilo'); // Price (high to low)
        const prices = await this.getProductPrices();

        for (let i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                throw new Error(`Sort failed: ${prices[i - 1]} should be >= ${prices[i]}`);
            }
        }
    }
    async verifyEmptyNames() {
        const namesV = await this.getProductNames(); // Отримуємо масив назв ["Sauce Labs Backpack", ...]

        for (let i = 0; i < namesV.length; i++) {
            // Перевіряємо довжину кожного рядка
            if (namesV[i].length < 1) {
                throw new Error(`Помилка: Назва товару під номером ${i + 1} порожня!`);
            }

            // Якщо ти хочеш, щоб назва була не менше 2 символів (як у твоєму прикладі):
            if (namesV[i].length < 2) {
                throw new Error(`Помилка: Назва "${namesV[i]}" занадто коротка (менше 2 символів)`);
            }
        }
        
    }

}