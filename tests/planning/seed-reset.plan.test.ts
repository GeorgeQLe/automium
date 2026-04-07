import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const repoRootUrl = new URL("../../", import.meta.url);

type SeedResetPlanContract = {
  readonly product: string;
  readonly filePath: string;
  readonly journeys: readonly string[];
};

async function readProjectMarkdown(filePath: string): Promise<string> {
  try {
    return await readFile(new URL(filePath, repoRootUrl), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        `Expected Phase 2 planning artifact ${filePath} to exist, but it has not been created yet.`
      );
    }

    throw error;
  }
}

const benchmarkJourneyContracts: readonly SeedResetPlanContract[] = [
  {
    product: "Altitude",
    filePath: "tests/fixtures/altitude-seed-reset-plan.md",
    journeys: [
      "create workspace and project",
      "create and update work items",
      "move work items across states and views",
      "plan a cycle and attach work items",
      "group work into modules",
      "create a wiki page linked to a project",
      "attach a file to a work item",
      "inspect analytics or progress summaries"
    ]
  },
  {
    product: "Switchboard",
    filePath: "tests/fixtures/switchboard-seed-reset-plan.md",
    journeys: [
      "create and configure inboxes",
      "receive and manage incoming conversations",
      "assign, tag, and prioritize conversations",
      "add internal notes and mention teammates",
      "use canned responses and macros",
      "apply automation rules and observe routed outcomes",
      "resolve, snooze, reopen, and report on conversations"
    ]
  },
  {
    product: "Foundry",
    filePath: "tests/fixtures/foundry-seed-reset-plan.md",
    journeys: [
      "create an app from scratch",
      "connect a datasource",
      "create and bind queries",
      "lay out widgets on a page",
      "build CRUD flows with table and form surfaces",
      "use JavaScript logic in builder workflows",
      "create and use custom widgets",
      "branch, publish, and view the runtime app"
    ]
  }
];

describe("owned benchmark seed and reset planning contract", () => {
  it("requires docs/benchmarks/owned-products.md to freeze the benchmark journey and reset model", async () => {
    const content = await readProjectMarkdown("docs/benchmarks/owned-products.md");

    expect(content).toContain("# Owned Product Benchmark Journeys");
    expect(content).toContain("## Owned Benchmark Journeys");
    expect(content).toContain("## Deterministic Seed and Reset Requirements");
    expect(content).toContain("## Fixture Plan References");
    expect(content).toContain("stable URLs");
    expect(content).toContain("reset hooks");
    expect(content).toContain("deterministic fixtures");

    for (const contract of benchmarkJourneyContracts) {
      expect(content).toContain(contract.product);

      for (const journey of contract.journeys) {
        expect(content).toContain(journey);
      }
    }
  });

  for (const contract of benchmarkJourneyContracts) {
    it(`requires ${contract.filePath} to define ${contract.product} seed and reset behavior`, async () => {
      const content = await readProjectMarkdown(contract.filePath);

      expect(content).toContain(`# ${contract.product} Seed and Reset Plan`);
      expect(content).toContain("## Seed Data");
      expect(content).toContain("## Reset Workflow");
      expect(content).toContain("## Stable URLs");
      expect(content).toContain("## Journey Coverage");
      expect(content).toContain("deterministic");
      expect(content).toContain("reset hook");

      for (const journey of contract.journeys) {
        expect(content).toContain(journey);
      }
    });
  }
});
