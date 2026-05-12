export class OrderValidationPage {
    constructor(page) {
        this.page = page;
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartItemNames = page.locator('.cart_item .inventory_item_name');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.overviewItemNames = page.locator('.cart_item .inventory_item_name');
        this.overviewItemPrices = page.locator('.cart_item .inventory_item_price');
    }

    inventoryItemByName(name) {
        return this.page.locator('.inventory_item').filter({
            has: this.page.locator('.inventory_item_name', { hasText: name }),
        });
    }

    async getInventoryProductsByNames(names) {
        const products = [];

        for (const name of names) {
            const item = this.inventoryItemByName(name);
            const priceText = (await item.locator('.inventory_item_price').first().textContent())?.trim() ?? '';
            products.push({ name, price: priceText });
        }

        return products;
    }

    async addProductsToCartByNames(names) {
        for (const name of names) {
            await this.inventoryItemByName(name).getByRole('button', { name: 'Add to cart' }).click();
        }
    }

    async openCart() {
        await this.cartLink.click();
    }

    async getCartBadgeText() {
        return (await this.cartBadge.textContent())?.trim() ?? '';
    }

    async getCartProductNames() {
        return await this.cartItemNames.allTextContents();
    }

    async proceedToOverview(firstName, lastName, postalCode) {
        await this.checkoutButton.click();
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();
    }

    async getOverviewProducts() {
        const names = await this.overviewItemNames.allTextContents();
        const prices = await this.overviewItemPrices.allTextContents();

        return names.map((name, index) => ({
            name: name.trim(),
            price: (prices[index] ?? '').trim(),
        }));
    }
}
