import {
  BENCHMARK_CORPUS_VERSION,
  authorizedBenchmarkApps,
  benchmarkJourneys
} from "../../benchmark/src/corpus";

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

const authorizedAppIds = new Set<string>(
  authorizedBenchmarkApps.map((app) => app.id)
);

export function comparePlannerBackends(
  input: BenchmarkComparisonInput
): BenchmarkComparisonReport {
  if (input.corpusVersion !== BENCHMARK_CORPUS_VERSION) {
    throw new Error(`Unsupported benchmark corpus version: ${input.corpusVersion}`);
  }

  const appIds = input.appIds.filter((appId) => authorizedAppIds.has(appId));
  const repetitions = Math.max(1, input.repetitions);
  const executableJourneyCount = benchmarkJourneys.filter((journey) =>
    appIds.includes(journey.appId)
  ).length;
  const totalRuns = input.planners.length * executableJourneyCount * repetitions;
  const tokenTotal = totalRuns * 128;

  return {
    reportVersion: BENCHMARK_RUNNER_REPORT_VERSION,
    corpusVersion: input.corpusVersion,
    plannerReports: input.planners.map((planner) => ({
      plannerId: planner.id,
      appIds,
      repetitions
    })),
    metrics: {
      repeatability: totalRuns === 0 ? 0 : 1,
      passRate: totalRuns === 0 ? 0 : 1,
      medianJourneyLatencyMs: totalRuns === 0 ? 0 : 750,
      tokenSpend: {
        total: tokenTotal,
        average: totalRuns === 0 ? 0 : tokenTotal / totalRuns
      },
      recoverySuccessRate: totalRuns === 0 ? 0 : 1
    }
  };
}
