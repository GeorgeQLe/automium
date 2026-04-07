import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const repoRootUrl = new URL("../../../", import.meta.url);

type MarkdownArtifactContract = {
  readonly filePath: string;
  readonly title: string;
  readonly sections: readonly string[];
  readonly phrases: readonly string[];
};

async function readProjectMarkdown(filePath: string): Promise<string> {
  try {
    return await readFile(new URL(filePath, repoRootUrl), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        `Expected Phase 2 parity artifact ${filePath} to exist, but it has not been created yet.`
      );
    }

    throw error;
  }
}

function assertMarkdownContract(
  content: string,
  contract: MarkdownArtifactContract
): void {
  expect(content).toContain(`# ${contract.title}`);

  for (const section of contract.sections) {
    expect(content).toContain(section);
  }

  for (const phrase of contract.phrases) {
    expect(content).toContain(phrase);
  }
}

const featureMatrixContracts: readonly MarkdownArtifactContract[] = [
  {
    filePath: "docs/parity/altitude-feature-matrix.md",
    title: "Altitude Feature Matrix",
    sections: [
      "## Purpose",
      "## Required Parity Surface",
      "## Major Resources Requiring API Compatibility",
      "## Collaboration Requirements",
      "## Integration Model",
      "## Benchmark-Critical Journeys"
    ],
    phrases: [
      "workspaces and workspace settings",
      "project creation and project-scoped membership",
      "work items with types, fields, states, priorities, estimates, labels, dates, assignees, comments, attachments, and activity history",
      "multiple work item views and saved views",
      "cycles",
      "modules",
      "pages or wiki",
      "dashboards or analytics views for progress and status",
      "intake or backlog capture flow",
      "notifications",
      "command palette or global action surface",
      "REST APIs and webhooks for major resources",
      "create workspace and project",
      "attach a file to a work item",
      "inspect analytics or progress summaries"
    ]
  },
  {
    filePath: "docs/parity/switchboard-feature-matrix.md",
    title: "Switchboard Feature Matrix",
    sections: [
      "## Purpose",
      "## Required Parity Surface",
      "## Channels",
      "## Major Resources Requiring API Compatibility",
      "## Collaboration Requirements",
      "## Benchmark-Critical Journeys"
    ],
    phrases: [
      "accounts and workspace settings",
      "inbox management",
      "channel configuration",
      "contacts and contact profiles",
      "conversations and threaded messages",
      "assignments and teams",
      "private notes and mentions",
      "canned responses",
      "macros",
      "automation rules",
      "activity and audit history",
      "REST APIs and webhook surfaces for major resources",
      "website live chat",
      "API channel",
      "email",
      "WhatsApp",
      "Telegram",
      "resolve, snooze, reopen, and report on conversations"
    ]
  },
  {
    filePath: "docs/parity/foundry-feature-matrix.md",
    title: "Foundry Feature Matrix",
    sections: [
      "## Purpose",
      "## Required Parity Surface",
      "## Datasource and Integration Model",
      "## Widget Requirement",
      "## Major Resources Requiring API Compatibility",
      "## Collaboration Requirements",
      "## Benchmark-Critical Journeys"
    ],
    phrases: [
      "organizations or workspaces",
      "applications and pages",
      "editor/runtime split",
      "drag-and-drop canvas and layout system",
      "widget library",
      "datasource configuration",
      "queries and action execution",
      "JavaScript objects or equivalent embedded logic units",
      "widget bindings to queries and state",
      "page navigation, modals, tabs, and forms",
      "custom widget support",
      "version control and branching workflows",
      "deployment and share or publish workflows",
      "connect a datasource",
      "create and use custom widgets",
      "branch, publish, and view the runtime app"
    ]
  }
];

const apiMatrixContracts: readonly MarkdownArtifactContract[] = [
  {
    filePath: "docs/parity/altitude-api-matrix.md",
    title: "Altitude API Compatibility Matrix",
    sections: ["## Major Resource Coverage", "## Adapter Inventory"],
    phrases: [
      "workspaces",
      "projects",
      "work items",
      "work item types",
      "cycles",
      "modules",
      "comments or activity entries",
      "pages",
      "attachments",
      "members and roles",
      "source control",
      "chat",
      "alerts",
      "webhooks"
    ]
  },
  {
    filePath: "docs/parity/switchboard-api-matrix.md",
    title: "Switchboard API Compatibility Matrix",
    sections: ["## Major Resource Coverage", "## Channel Coverage"],
    phrases: [
      "accounts",
      "users",
      "inboxes",
      "contacts",
      "conversations",
      "messages",
      "labels",
      "canned responses",
      "macros",
      "automation rules",
      "reports",
      "website live chat",
      "API channel",
      "email",
      "Facebook",
      "Instagram",
      "LINE",
      "SMS",
      "TikTok",
      "X or Twitter",
      "voice or phone"
    ]
  },
  {
    filePath: "docs/parity/foundry-api-matrix.md",
    title: "Foundry API Compatibility Matrix",
    sections: ["## Major Resource Coverage", "## Datasource and Integration Coverage"],
    phrases: [
      "workspaces or organizations",
      "apps",
      "pages",
      "widgets",
      "datasources",
      "queries",
      "JavaScript objects",
      "branches or versions",
      "deployments",
      "permissions",
      "Postgres-compatible SQL source",
      "MySQL-compatible SQL source",
      "REST API datasource",
      "Git integration",
      "custom widget packaging"
    ]
  }
];

describe("owned product parity artifact contract", () => {
  for (const contract of featureMatrixContracts) {
    it(`requires ${contract.filePath} to freeze the ${contract.title}`, async () => {
      const content = await readProjectMarkdown(contract.filePath);

      assertMarkdownContract(content, contract);
    });
  }

  for (const contract of apiMatrixContracts) {
    it(`requires ${contract.filePath} to freeze the ${contract.title}`, async () => {
      const content = await readProjectMarkdown(contract.filePath);

      assertMarkdownContract(content, contract);
    });
  }
});
