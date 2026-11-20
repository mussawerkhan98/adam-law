/**
 * Brings the database up to date with prisma/schema.prisma, then adds starter content on first run.
 * Runs automatically during `npm run build` (so every Vercel deploy), and by hand with `npm run setup`.
 *
 * - Creates missing tables and indexes.
 * - Adds columns that are new in the schema to existing tables.
 * - Runs prisma/seed.ts only when the database is new (no site settings yet), so content
 *   you delete in the admin panel is never put back.
 *
 * Never drops or changes existing data. Renaming or removing a field needs a manual migration.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createClient } from "@libsql/client";
import { databaseConfig } from "../src/lib/prisma-client";

if (existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch {}
}

const config = databaseConfig();
if (process.env.VERCEL && config.url.startsWith("file:")) {
  console.error(
    "\n✖ No Turso database connected. In Vercel → Settings → Environment Variables, add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (or connect Turso under Storage), then redeploy.\n",
  );
  process.exit(1);
}

const run = (cmd: string) => execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });

async function main() {
  const client = createClient(config);
  const where = config.url.startsWith("file:") ? config.url : config.url.replace(/^(\w+:\/\/[^/?]+).*/, "$1");
  console.log(`Database: ${where}`);

  // Full CREATE script for the current schema.
  const sql = run("npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script");
  const statements = sql
    .split(/;\s*\n/)
    .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);

  const existingTables = new Set(
    (await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'")).rows.map((r) => String(r.name)),
  );

  let created = 0;
  let added = 0;
  for (const stmt of statements) {
    const table = stmt.match(/^CREATE TABLE "([^"]+)"/)?.[1];
    if (table && existingTables.has(table)) {
      // Existing table: add any columns the schema now has but the table doesn't.
      const have = new Set((await client.execute(`PRAGMA table_info("${table}")`)).rows.map((r) => String(r.name)));
      const body = stmt.slice(stmt.indexOf("(") + 1, stmt.lastIndexOf(")"));
      for (const line of body.split("\n").map((l) => l.trim().replace(/,$/, ""))) {
        const col = line.match(/^"([^"]+)"\s/)?.[1];
        if (!col || have.has(col)) continue;
        if (/PRIMARY KEY/i.test(line) || (/NOT NULL/i.test(line) && !/DEFAULT/i.test(line))) {
          console.warn(`! Can't add ${table}.${col} automatically (required field without a default) — add a @default in the schema.`);
          continue;
        }
        await client.execute(`ALTER TABLE "${table}" ADD COLUMN ${line}`);
        console.log(`+ column ${table}.${col}`);
        added++;
      }
      continue;
    }
    const safe = stmt
      .replace(/^CREATE TABLE /, "CREATE TABLE IF NOT EXISTS ")
      .replace(/^CREATE (UNIQUE )?INDEX /, "CREATE $1INDEX IF NOT EXISTS ");
    await client.execute(safe);
    if (table) {
      console.log(`+ table ${table}`);
      created++;
    }
  }
  console.log(created || added ? `Schema updated (${created} tables, ${added} columns).` : "Schema already up to date.");

  const { rows } = await client.execute('SELECT COUNT(*) AS n FROM "SiteSettings"');
  client.close();
  if (Number(rows[0].n) === 0) {
    console.log("New database — adding starter content and the admin account…");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
