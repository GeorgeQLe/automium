const ADAPTER_INTEGRATION_BOUNDARIES = [
  "identity-provider",
  "audit-sink",
  "file-storage",
  "job-queue",
  "search-backend",
  "realtime-transport"
] as const;

// --- Types derived from frozen constants ---

export type AdapterBoundary = (typeof ADAPTER_INTEGRATION_BOUNDARIES)[number];

// --- Adapter interface contracts ---

export interface IdentityProviderAdapter {
  readonly boundary: "identity-provider";
  authenticate(credentials: Record<string, unknown>): Promise<{ identityId: string; provider: string }>;
  validateToken(token: string): Promise<{ valid: boolean; identityId?: string }>;
}

export interface AuditSinkAdapter {
  readonly boundary: "audit-sink";
  emit(event: Record<string, unknown>): Promise<{ persisted: boolean; eventId: string }>;
  query(filter: Record<string, unknown>): Promise<{ events: Record<string, unknown>[] }>;
}

export interface FileStorageAdapter {
  readonly boundary: "file-storage";
  store(fileId: string, data: Uint8Array, metadata: Record<string, unknown>): Promise<{ stored: boolean; location: string }>;
  retrieve(fileId: string): Promise<{ data: Uint8Array; metadata: Record<string, unknown> }>;
  remove(fileId: string): Promise<{ removed: boolean }>;
}

export interface JobQueueAdapter {
  readonly boundary: "job-queue";
  enqueue(job: Record<string, unknown>): Promise<{ enqueued: boolean; jobId: string }>;
  dequeue(): Promise<{ job: Record<string, unknown> | null }>;
  acknowledge(jobId: string): Promise<{ acknowledged: boolean }>;
}

export interface SearchBackendAdapter {
  readonly boundary: "search-backend";
  index(entry: Record<string, unknown>): Promise<{ indexed: boolean; entryId: string }>;
  search(query: string, filters: Record<string, unknown>): Promise<{ results: Record<string, unknown>[] }>;
}

export interface RealtimeTransportAdapter {
  readonly boundary: "realtime-transport";
  publish(topic: string, payload: Record<string, unknown>, audience: string[]): Promise<{ published: boolean; recipientCount: number }>;
  subscribe(topic: string, recipientId: string): Promise<{ subscribed: boolean }>;
  unsubscribe(topic: string, recipientId: string): Promise<{ unsubscribed: boolean }>;
}

// --- Adapter type map ---

type AdapterTypeMap = {
  "identity-provider": IdentityProviderAdapter;
  "audit-sink": AuditSinkAdapter;
  "file-storage": FileStorageAdapter;
  "job-queue": JobQueueAdapter;
  "search-backend": SearchBackendAdapter;
  "realtime-transport": RealtimeTransportAdapter;
};

// --- Registry ---

export interface AdapterRegistry {
  register<B extends AdapterBoundary>(boundary: B, adapter: AdapterTypeMap[B]): void;
  get<B extends AdapterBoundary>(boundary: B): AdapterTypeMap[B] | undefined;
  has(boundary: AdapterBoundary): boolean;
  boundaries(): readonly AdapterBoundary[];
}

export function createAdapterRegistry(): AdapterRegistry {
  const adapters = new Map<AdapterBoundary, unknown>();

  return {
    register<B extends AdapterBoundary>(boundary: B, adapter: AdapterTypeMap[B]): void {
      adapters.set(boundary, adapter);
    },
    get<B extends AdapterBoundary>(boundary: B): AdapterTypeMap[B] | undefined {
      return adapters.get(boundary) as AdapterTypeMap[B] | undefined;
    },
    has(boundary: AdapterBoundary): boolean {
      return adapters.has(boundary);
    },
    boundaries(): readonly AdapterBoundary[] {
      return [...adapters.keys()];
    },
  };
}
