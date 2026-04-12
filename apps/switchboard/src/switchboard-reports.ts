import type { SwitchboardReportSummary } from "./switchboard-domain";
import { createSwitchboardReportSummary } from "./switchboard-domain";

export type SwitchboardGeneratedReportSummary = SwitchboardReportSummary & {
  from?: string;
  to?: string;
  generatedAt: string;
};

export function createReportSummary(
  params: Parameters<typeof createSwitchboardReportSummary>[0] & {
    from?: string;
    to?: string;
  }
): SwitchboardGeneratedReportSummary {
  return {
    ...createSwitchboardReportSummary(params),
    from: params.from,
    to: params.to,
    generatedAt: new Date().toISOString(),
  };
}
