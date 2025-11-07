import { Pool } from "pg";

// Default to docker-compose values if env is missing
const DEFAULT_DB_URL =
  "postgres://group19:C4G2025@localhost:5432/team19_db";

// Singleton Pool across hot reloads in dev
let pool = globalThis._team19_pg_pool;

if (!pool) {
  const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;
  if (!process.env.DATABASE_URL) {
    console.warn(
      "DATABASE_URL not set; using local docker default: " + DEFAULT_DB_URL
    );
  }

  pool = new Pool({
    connectionString,
    // No SSL for local docker Postgres
    ssl: false,
  });

  globalThis._team19_pg_pool = pool;
}

export function getDb() {
  return pool;
}
