export function createSearchBackendAdapter(db: unknown) {
  return {
    boundary: "search-backend" as const,

    async index(
      entry: Record<string, unknown>,
    ): Promise<{ indexed: boolean; entryId: string }> {
      const entryId = entry.entryId as string;
      // TODO: INSERT into search_entries via Drizzle once db is wired
      return { indexed: false, entryId };
    },

    async search(
      _query: string,
      _filters: Record<string, unknown>,
    ): Promise<{ results: Record<string, unknown>[] }> {
      // TODO: SELECT from search_entries with ts_query once db is wired
      return { results: [] };
    },
  };
}
