import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index.js";

export function createDb(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Database URL is required. Pass it as an argument or set DATABASE_URL environment variable.",
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}
