import {
  authorizedBenchmarkApps,
  benchmarkFixtureManifest
} from "../../benchmark/src/corpus";

export const JOURNEY_GRAPH_VERSION = "v1";

export interface NaturalLanguageJourneyInput {
  readonly appId: string;
  readonly fixtureId: string;
  readonly goal: string;
  readonly constraints?: readonly string[];
}

export interface NaturalLanguageJourneyValidation {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export interface JourneyGraphNode {
  readonly id: string;
  readonly intent: string;
  readonly target?: string;
}

export interface JourneyGraphAssertion {
  readonly id: string;
  readonly type: string;
  readonly target: string;
}

export interface JourneyRecoveryRule {
  readonly id: string;
  readonly maxAttempts: number;
  readonly strategy: string;
}

export interface CompiledNaturalLanguageJourney {
  readonly graphVersion: typeof JOURNEY_GRAPH_VERSION;
  readonly appId: string;
  readonly fixtureId: string;
  readonly nodes: readonly JourneyGraphNode[];
  readonly assertions: readonly JourneyGraphAssertion[];
  readonly recoveryRules: readonly JourneyRecoveryRule[];
}

const authorizedAppIds = new Set<string>(
  authorizedBenchmarkApps.map((app) => app.id)
);

function fixtureMatchesApp(appId: string, fixtureId: string): boolean {
  return benchmarkFixtureManifest.some(
    (fixture) => fixture.id === fixtureId && fixture.appId === appId
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function routeForApp(appId: string): string {
  return `/${appId}`;
}

export function validateNaturalLanguageJourney(
  input: NaturalLanguageJourneyInput
): NaturalLanguageJourneyValidation {
  const errors: string[] = [];

  if (!authorizedAppIds.has(input.appId)) {
    errors.push(`app is not in the owned benchmark corpus: ${input.appId}`);
  }

  if (!fixtureMatchesApp(input.appId, input.fixtureId)) {
    errors.push(
      `fixture does not belong to app in the owned benchmark corpus: ${input.fixtureId}`
    );
  }

  if (!input.goal.trim()) {
    errors.push("journey goal is required");
  }

  input.constraints?.forEach((constraint, index) => {
    if (!constraint.trim()) {
      errors.push(`constraint ${index + 1} is empty`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

export function compileNaturalLanguageJourney(
  input: NaturalLanguageJourneyInput
): CompiledNaturalLanguageJourney {
  const validation = validateNaturalLanguageJourney(input);

  if (!validation.valid) {
    throw new Error(
      `Cannot compile invalid natural-language journey: ${validation.errors.join("; ")}`
    );
  }

  const journeySlug = slugify(input.goal) || "journey";

  return {
    graphVersion: JOURNEY_GRAPH_VERSION,
    appId: input.appId,
    fixtureId: input.fixtureId,
    nodes: [
      {
        id: `${input.appId}-${journeySlug}-navigate`,
        intent: "navigate",
        target: routeForApp(input.appId)
      },
      {
        id: `${input.appId}-${journeySlug}-perform`,
        intent: "click",
        target: input.goal
      },
      {
        id: `${input.appId}-${journeySlug}-finish`,
        intent: "finish",
        target: "journey complete"
      }
    ],
    assertions: [
      {
        id: `${input.appId}-${journeySlug}-verdict`,
        type: "semantic",
        target: input.goal
      }
    ],
    recoveryRules: [
      {
        id: `${input.appId}-${journeySlug}-bounded-retry`,
        maxAttempts: 2,
        strategy: "bounded-retry"
      }
    ]
  };
}
