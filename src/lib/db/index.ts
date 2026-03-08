import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

let _db: BetterSQLite3Database<typeof schema> | null = null;

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    if (!_db) {
      const DB_PATH = path.join(process.cwd(), "data", "governance.db");
      const sqlite = new Database(DB_PATH);
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");
      _db = drizzle(sqlite, { schema });
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});
