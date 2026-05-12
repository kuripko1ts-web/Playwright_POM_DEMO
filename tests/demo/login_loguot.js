// create exported class for login and logout for https://www.saucedemo.com/
// await page.locator('[data-test="checkout"]').click();
//   await page.locator('[data-test="firstName"]').fill('Pavel');
//   await page.locator('[data-test="firstName"]').press('Tab');
//   await page.locator('[data-test="lastName"]').fill('Kuripko');
//   await page.locator('[data-test="lastName"]').press('Tab');
//   await page.locator('[data-test="postalCode"]').fill('323322');
//  await page.locator('[data-test="continue"]').click();


export class Checkout {

    constructor(page) {
        this.page = page;
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.totalLabel = page.locator('[data-test="total-label"]');
        this.Finish = page.locator('[data-test="finish"]');
        this.backtohome = page.locator('[data-test="back-to-products"]');
    }

    async checkout(firstName, lastName, postalCode) {
        await this.shoppingCartLink.click();
        await this.checkoutButton.click();
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();

        const totalText = (await this.totalLabel.textContent())?.trim() ?? 'Total not found';
        console.log(`[Checkout] Order total: ${totalText}`);

        await this.Finish.click();
        await this.backtohome.click();
    }

}   


export class Login_logout {

    constructor(page) {
        this.page = page;

        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.menubutton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
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
}  