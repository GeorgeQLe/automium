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

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.3/7.6 not implemented: ${operation}`);
}

export function validateNaturalLanguageJourney(
  _input: NaturalLanguageJourneyInput
): NaturalLanguageJourneyValidation {
  return notImplemented("validateNaturalLanguageJourney");
}

export function compileNaturalLanguageJourney(
  _input: NaturalLanguageJourneyInput
): CompiledNaturalLanguageJourney {
  return notImplemented("compileNaturalLanguageJourney");
}
