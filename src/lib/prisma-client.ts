import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Database connection settings (Turso / libSQL).
 *
 *   TURSO_DATABASE_URL + TURSO_AUTH_TOKEN — set automatically when Turso is connected to Vercel
 *   DATABASE_URL + DATABASE_AUTH_TOKEN    — the same, under generic names
 *   neither                               — local file prisma/dev.db (development)
 */
export function databaseConfig() {
  const url = (process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./prisma/dev.db").trim();
  const authToken = (process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN || "").trim() || undefined;
  if (!/^(libsql|https?|wss?|file):/i.test(url)) {
    throw new Error(
      `Database URL must be a Turso/libSQL address (libsql://…) or a local file (file:…), got "${url.split(":")[0]}:…". ` +
        "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
    );
  }
  return { url, authToken };
}

export function createPrismaClient() {
  return new PrismaClient({ adapter: new PrismaLibSQL(databaseConfig()) });
}
