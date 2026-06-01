import fs from "fs";
import path from "path";
import { getDb } from "./client";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

export function runMigrations(): void {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = new Set(
    database
      .prepare("SELECT id FROM schema_migrations")
      .all()
      .map((r) => (r as { id: string }).id)
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    database.exec(sql);
    database
      .prepare("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)")
      .run(file, new Date().toISOString());
    console.log(`[db] Applied migration ${file}`);
  }
}
