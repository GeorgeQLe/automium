export interface BenchmarkCorpusManifest {
  readonly version: string;
  readonly journeys: readonly string[];
}

export const BENCHMARK_CORPUS_VERSION = "draft";

export const benchmarkCorpusManifest: BenchmarkCorpusManifest = {
  version: BENCHMARK_CORPUS_VERSION,
  journeys: []
};
