export function createRealtimeTransportAdapter(config: unknown) {
  return {
    boundary: "realtime-transport" as const,

    async publish(
      _topic: string,
      _payload: Record<string, unknown>,
      _audience: string[],
    ): Promise<{ published: boolean; recipientCount: number }> {
      return { published: false, recipientCount: 0 };
    },

    async subscribe(
      _topic: string,
      _recipientId: string,
    ): Promise<{ subscribed: boolean }> {
      return { subscribed: false };
    },

    async unsubscribe(
      _topic: string,
      _recipientId: string,
    ): Promise<{ unsubscribed: boolean }> {
      return { unsubscribed: false };
    },
  };
}
