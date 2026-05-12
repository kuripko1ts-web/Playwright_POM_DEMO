import { Callout, Divider, Grid, H1, H2, Pill, Stack, Stat, Table, Text } from 'cursor/canvas';

const smokeRows = [
  ['SMK-01', 'P0', 'Login valid user', '@smoke @auth', 'Inventory page opened, products visible'],
  ['SMK-02', 'P0', 'Login locked_out_user', '@smoke @auth @negative', 'Error shown, user stays on login'],
  ['SMK-03', 'P0', 'Login wrong password', '@smoke @auth @negative', 'Error shown, user stays on login'],
  ['SMK-04', 'P0', 'Add 1 item to cart', '@smoke @cart', 'Cart badge = 1'],
  ['SMK-05', 'P0', 'Checkout happy path (1 item)', '@smoke @checkout', 'Order complete message shown'],
  ['SMK-06', 'P0', 'Logout from app menu', '@smoke @auth', 'Return to login page'],
];

const regressionRows = [
  ['REG-01', 'P1', 'All known users login outcomes', '@regression @auth', 'standard/locked/problem/performance users behave as expected'],
  ['REG-02', 'P1', 'Cart qty and item names', '@regression @cart', 'Badge, cart names, cart count exactly match selected items'],
  ['REG-03', 'P1', 'Inventory price vs overview price', '@regression @checkout', 'Each item price in overview equals inventory price'],
  ['REG-04', 'P1', 'Order totals math', '@regression @checkout', 'itemTotal = sum(items), total = itemTotal + tax'],
  ['REG-05', 'P1', 'Checkout required fields', '@regression @checkout @negative', 'firstName/lastName/postalCode validations show correct errors'],
  ['REG-06', 'P2', 'Remove item from cart', '@regression @cart', 'Badge decreases, item absent in cart'],
  ['REG-07', 'P2', 'Sort Low->High / High->Low', '@regression @inventory', 'Visible product order matches selected sort'],
  ['REG-08', 'P2', 'Back Home after order', '@regression @checkout', 'Returns to inventory and session remains valid'],
];

const assertionRows = [
  ['Login success', 'URL contains `/inventory.html`; inventory list visible; burger menu visible'],
  ['Login failure', 'Error container visible; exact error text check; URL still login'],
  ['Cart action', 'Badge value check; add button changes to Remove; item name appears in cart'],
  ['Checkout step one', 'Continue blocked when required field missing; exact message check'],
  ['Checkout overview', 'Names match selected items; prices match inventory; totals formula is correct'],
  ['Finish', 'Thank you title visible; complete image visible; Back Home button visible'],
  ['Logout', 'URL is login page; username and password inputs visible'],
];

const businessFlows = [
  ['BF-1 Purchase Happy Path', 'Login -> Add 2 items -> Cart -> Checkout -> Finish -> Logout', 'P0, always green in CI'],
  ['BF-2 Authentication Guard', 'Try invalid users/passwords -> verify blocked access and messages', 'P0, protects entrypoint'],
  ['BF-3 Price Integrity', 'Capture inventory prices -> compare in overview -> verify totals math', 'P1, protects money logic'],
];

export default function SauceDemoSowTrainingCanvas() {
  return (
    <Stack gap={16}>
      <H1>SauceDemo Training SOW + Test Matrix</H1>
      <Text tone="secondary">
        Goal: build a realistic learning project with prioritized smoke and regression coverage, clear assertions,
        and business-flow tracking.
      </Text>

      <Grid columns={4} gap={12}>
        <Stat label="Release Target" value="Demo web shop" />
        <Stat label="Smoke Cases" value="6 (P0)" tone="success" />
        <Stat label="Regression Cases" value="8 (P1/P2)" />
        <Stat label="Main Flows" value="3 business flows" />
      </Grid>

      <Callout tone="info" title="SOW Scope (Training Version)">
        Functional UI E2E automation for authentication, cart, checkout, and logout. Out of scope for now:
        cross-browser matrix expansion, API mocks, visual testing, and performance benchmarking.
      </Callout>

      <H2>Business Flows (Real-Life Style)</H2>
      <Table headers={['Flow ID', 'Flow', 'Success Criteria']} rows={businessFlows} />

      <Divider />
      <H2>Smoke Matrix (@smoke)</H2>
      <Table headers={['Case ID', 'Priority', 'Scenario', 'Tags', 'Expected Result']} rows={smokeRows} />

      <Divider />
      <H2>Regression Matrix (@regression)</H2>
      <Table headers={['Case ID', 'Priority', 'Scenario', 'Tags', 'Expected Result']} rows={regressionRows} />

      <Divider />
      <H2>Assertion Checklist (What to Assert)</H2>
      <Table headers={['Step', 'Required Assertions']} rows={assertionRows} />

      <Divider />
      <H2>Execution Policy</H2>
      <Stack gap={8}>
        <Text>- Pull request gate: run all `@smoke` on each PR.</Text>
        <Text>- Nightly gate: run full `@regression` suite.</Text>
        <Text>- Test data: use known SauceDemo users and deterministic selected items.</Text>
        <Text>- Flaky rule: test can retry once, then must be triaged and fixed.</Text>
        <Text>- Definition of done: all P0 green + no open critical defects.</Text>
      </Stack>

      <Divider />
      <H2>Learning Roadmap (Priority Order)</H2>
      <Stack gap={8}>
        <Text><Pill tone="success">Phase 1</Pill> Implement all smoke tests with stable locators and clean POM actions.</Text>
        <Text><Pill tone="info">Phase 2</Pill> Add regression price and total validation (money-related assertions).</Text>
        <Text><Pill tone="warning">Phase 3</Pill> Add negative validations and sorting/removal scenarios.</Text>
      </Stack>
    </Stack>
  );
}
