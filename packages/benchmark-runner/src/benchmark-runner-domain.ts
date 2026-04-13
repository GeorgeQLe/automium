export const BENCHMARK_RUNNER_REPORT_VERSION = "v1";

export interface BenchmarkPlannerBackend {
  readonly id: string;
  readonly vendor: string;
  readonly model: string;
}

export interface BenchmarkComparisonInput {
  readonly corpusVersion: string;
  readonly appIds: readonly string[];
  readonly planners: readonly BenchmarkPlannerBackend[];
  readonly repetitions: number;
}

export interface BenchmarkPlannerReport {
  readonly plannerId: string;
  readonly appIds: readonly string[];
  readonly repetitions: number;
}

export interface BenchmarkComparisonReport {
  readonly reportVersion: typeof BENCHMARK_RUNNER_REPORT_VERSION;
  readonly corpusVersion: string;
  readonly plannerReports: readonly BenchmarkPlannerReport[];
  readonly metrics: {
    readonly repeatability: number;
    readonly passRate: number;
    readonly medianJourneyLatencyMs: number;
    readonly tokenSpend: {
      readonly total: number;
      readonly average: number;
    };
    readonly recoverySuccessRate: number;
  };
}

function notImplemented<T>(operation: string): T {
  throw new Error(`Step 7.3/7.6 not implemented: ${operation}`);
}

export function comparePlannerBackends(
  _input: BenchmarkComparisonInput
): BenchmarkComparisonReport {
  return notImplemented("comparePlannerBackends");
}
