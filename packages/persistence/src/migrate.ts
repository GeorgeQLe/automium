import { migrate as drizzleMigrate } from "drizzle-orm/neon-http/migrator";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

export async function migrate(db: NeonHttpDatabase): Promise<void> {
  await drizzleMigrate(db, {
    migrationsFolder: new URL("../drizzle", import.meta.url).pathname,
  });
}
