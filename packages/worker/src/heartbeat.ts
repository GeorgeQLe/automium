export interface HeartbeatReporterConfig {
  workerId: string;
}

export function createHeartbeatReporter(config: HeartbeatReporterConfig) {
  return {
    report: async () => {},
    stop: () => {},
  };
}
