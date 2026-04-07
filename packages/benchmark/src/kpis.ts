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

export const KPI_NAMES: string[] = [];

export const VERDICT_TAXONOMY: BenchmarkVerdict[] = [];

export function aggregateBenchmarkKpis(
  outcomes: readonly BenchmarkRunOutcome[]
): BenchmarkKpiSummary {
  const totalTokenSpend = outcomes.reduce(
    (sum, outcome) => sum + outcome.tokenSpend,
    0
  );

  return {
    repeatability: 0,
    passRate: 0,
    medianJourneyLatencyMs: 0,
    tokenSpend: {
      total: totalTokenSpend,
      average: outcomes.length === 0 ? 0 : totalTokenSpend / outcomes.length
    },
    recoverySuccessRate: 0
  };
}
