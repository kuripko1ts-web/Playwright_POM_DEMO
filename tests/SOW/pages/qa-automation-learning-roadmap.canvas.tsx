import { Callout, Divider, Grid, H1, H2, Pill, Stack, Stat, Table, Text } from 'cursor/canvas';

const phases = [
  ['Phase 0', 'Foundation baseline', 'P0', 'Repo clean run, stable structure, basic confidence'],
  ['Phase 1', 'Smoke suite', 'P0', 'Core auth/cart/checkout/logout flow in CI-ready shape'],
  ['Phase 2', 'Regression core', 'P1', 'Price/name/validation assertions with reusable POM methods'],
  ['Phase 3', 'Reliability + CI', 'P1', 'Tag-based execution, retries, reports, pipeline run'],
  ['Phase 4', 'Interview package', 'P2', 'Portfolio-ready README + demo-ready explanation'],
];

const milestoneRows = [
  ['M1', 'Login outcomes', 'Valid login + invalid password + locked user', '@smoke @auth'],
  ['M2', 'Cart essentials', 'Add items, verify badge count, verify cart names', '@smoke @cart'],
  ['M3', 'Checkout happy path', 'Complete order + success page assertions', '@smoke @checkout'],
  ['M4', 'Price integrity', 'Inventory prices match overview + totals formula', '@regression @checkout'],
  ['M5', 'Field validations', 'Required fields error coverage for checkout step one', '@regression @checkout @negative'],
  ['M6', 'Pipeline readiness', 'Run smoke in CI + HTML report artifact', '@ci'],
];

const workloadRows = [
  ['Phase 0', '4-6 hours', '2-3 days'],
  ['Phase 1', '8-12 hours', '4-6 days'],
  ['Phase 2', '10-14 hours', '5-7 days'],
  ['Phase 3', '6-10 hours', '3-5 days'],
  ['Phase 4', '4-6 hours', '2-3 days'],
];

const perSessionRows = [
  ['Session A (45-60m)', 'One new test case (Arrange -> Act -> Assert)'],
  ['Session B (45-60m)', 'Refactor to POM method + clean locator naming'],
  ['Session C (30-45m)', 'Run tagged suite + fix flaky/selectors + note learnings'],
];

const interviewRows = [
  ['Suite design', 'Why case is smoke vs regression'],
  ['Assertions', 'What business risk each assertion protects'],
  ['POM architecture', 'What belongs in POM vs in spec tests'],
  ['Stability', 'How you handle flakiness and retries'],
  ['CI', 'How PR checks differ from nightly runs'],
];

export default function QaAutomationLearningRoadmap() {
  return (
    <Stack gap={16}>
      <H1>QA Automation Learning Roadmap (SauceDemo)</H1>
      <Text tone="secondary">
        Goal: move from strong junior to job-ready junior+/middle-leaning level with consistent 2-3h/day study blocks.
      </Text>

      <Grid columns={4} gap={12}>
        <Stat label="Target Pace" value="2-3 h/day" />
        <Stat label="Total Effort" value="32-48 hours" />
        <Stat label="Approx Timeline" value="16-24 days" tone="success" />
        <Stat label="Learning Style" value="Phase-based (not date-based)" />
      </Grid>

      <Callout tone="success" title="Key reassurance">
        You are already doing real automation work. Using an AI agent is normal in modern QA engineering.
        Interview value comes from understanding and explaining your choices, not from writing everything fully alone.
      </Callout>

      <H2>Phase Plan</H2>
      <Table headers={['Phase', 'Focus', 'Priority', 'Exit Criteria']} rows={phases} />

      <Divider />
      <H2>Milestones (Complete in Order)</H2>
      <Table headers={['Milestone', 'Scope', 'Deliverable', 'Tags']} rows={milestoneRows} />

      <Divider />
      <H2>Estimated Time by Phase</H2>
      <Table headers={['Phase', 'Effort', 'Calendar with 2-3h/day']} rows={workloadRows} />

      <Divider />
      <H2>Recommended Session Template</H2>
      <Table headers={['Block', 'What to do']} rows={perSessionRows} />

      <Divider />
      <H2>Definition of Done (Per Test)</H2>
      <Stack gap={8}>
        <Text>- Clear test name describes behavior and expected outcome.</Text>
        <Text>- Uses POM actions; assertions stay in spec unless data helpers are needed.</Text>
        <Text>- At least one business assertion, not only visibility checks.</Text>
        <Text>- Tagged correctly (`@smoke` or `@regression`).</Text>
        <Text>- Stable run: passes at least 3 local runs before considered done.</Text>
      </Stack>

      <Divider />
      <H2>Interview Readiness Checklist</H2>
      <Table headers={['Topic', 'What you should answer clearly']} rows={interviewRows} />

      <Divider />
      <H2>Confidence Protocol (When You Feel Behind)</H2>
      <Stack gap={8}>
        <Text><Pill tone="info">Rule 1</Pill> One finished milestone is better than five half-done ideas.</Text>
        <Text><Pill tone="warning">Rule 2</Pill> If stuck 30+ minutes, ask AI for hints, then implement yourself.</Text>
        <Text><Pill tone="success">Rule 3</Pill> Keep a short learning log: what broke, how you fixed it, what changed in POM/tests.</Text>
      </Stack>
    </Stack>
  );
}
