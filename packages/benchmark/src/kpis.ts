export type BenchmarkVerdict =
  | "pass"
  | "fail"
  | "inconclusive"
  | "unsupported";

export interface BenchmarkRunOutcome {
  readonly verdict: BenchmarkVerdict;
  readonly latencyMs: number;
  readonly tokenSpend: number;
  readonly recovered: boolean;
  readonly deterministicKey: string;
}

export interface BenchmarkKpiSummary {
  readonly repeatability: number;
  readonly passRate: number;
  readonly medianJourneyLatencyMs: number;
  readonly tokenSpend: {
    readonly total: number;
    readonly average: number;
  };
  readonly recoverySuccessRate: number;
}

export const KPI_NAMES = [
  "repeatability",
  "passRate",
  "medianJourneyLatencyMs",
  "tokenSpend",
  "recoverySuccessRate"
] as const;

export const VERDICT_TAXONOMY = [
  "pass",
  "fail",
  "inconclusive",
  "unsupported"
] as const satisfies readonly BenchmarkVerdict[];

function median(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

function calculateRepeatability(
  outcomes: readonly BenchmarkRunOutcome[]
): number {
  if (outcomes.length === 0) {
    return 0;
  }

  const verdictCountsByKey = new Map<
    string,
    Map<BenchmarkVerdict, number>
  >();

  for (const outcome of outcomes) {
    const verdictCounts =
      verdictCountsByKey.get(outcome.deterministicKey) ??
      new Map<BenchmarkVerdict, number>();
    verdictCounts.set(
      outcome.verdict,
      (verdictCounts.get(outcome.verdict) ?? 0) + 1
    );
    verdictCountsByKey.set(outcome.deterministicKey, verdictCounts);
  }

  let stableRuns = 0;

  for (const verdictCounts of verdictCountsByKey.values()) {
    let dominantVerdictCount = 0;

    for (const count of verdictCounts.values()) {
      dominantVerdictCount = Math.max(dominantVerdictCount, count);
    }

    stableRuns += dominantVerdictCount;
  }

  return stableRuns / outcomes.length;
}

function calculateRecoverySuccessRate(
  outcomes: readonly BenchmarkRunOutcome[]
): number {
  const recoveredOutcomes = outcomes.filter((outcome) => outcome.recovered);

  if (recoveredOutcomes.length === 0) {
    return 0;
  }

  const successfulRecoveries = recoveredOutcomes.filter(
    (outcome) => outcome.verdict === "pass"
  ).length;

  return successfulRecoveries / recoveredOutcomes.length;
}

export function aggregateBenchmarkKpis(
  outcomes: readonly BenchmarkRunOutcome[]
): BenchmarkKpiSummary {
  const totalTokenSpend = outcomes.reduce(
    (sum, outcome) => sum + outcome.tokenSpend,
    0
  );
  const passingRuns = outcomes.filter((outcome) => outcome.verdict === "pass");

  return {
    repeatability: calculateRepeatability(outcomes),
    passRate: outcomes.length === 0 ? 0 : passingRuns.length / outcomes.length,
    medianJourneyLatencyMs: median(
      outcomes.map((outcome) => outcome.latencyMs)
    ),
    tokenSpend: {
      total: totalTokenSpend,
      average: outcomes.length === 0 ? 0 : totalTokenSpend / outcomes.length
    },
    recoverySuccessRate: calculateRecoverySuccessRate(outcomes)
  };
}
