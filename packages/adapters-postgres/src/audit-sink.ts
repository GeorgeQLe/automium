import { randomUUID } from "node:crypto";

export function createAuditSinkAdapter(db: unknown) {
  return {
    boundary: "audit-sink" as const,

    async emit(event: Record<string, unknown>): Promise<{ persisted: boolean; eventId: string }> {
      const eventId = (event.eventId as string) ?? randomUUID();
      // TODO: INSERT into audit_events via Drizzle once db is wired
      return { persisted: false, eventId };
    },

    async query(
      _filter: Record<string, unknown>,
    ): Promise<{ events: Record<string, unknown>[] }> {
      // TODO: SELECT from audit_events via Drizzle once db is wired
      return { events: [] };
    },
  };
}
