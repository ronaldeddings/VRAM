/**
 * Test PostgreSQL connection from Bun
 */
import { SQL } from "bun";

const POSTGRES_URL = process.env.POSTGRES_URL || "postgres://ronaldeddings@localhost:5432/vram_embeddings";

console.log("Testing PostgreSQL connection from Bun...\n");

try {
  const sql = new SQL(POSTGRES_URL);

  // Test basic query
  const result = await sql`SELECT version()`;
  console.log("✅ Connected to PostgreSQL");
  const version = (result[0] as { version: string }).version;
  console.log(`   Version: ${version.split(",")[0]}`);

  // Test pgvector extension
  const vectorResult = await sql`SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'`;
  if (vectorResult.length > 0) {
    console.log(`✅ pgvector extension: v${(vectorResult[0] as { extversion: string }).extversion}`);
  }

  // Test table existence
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  console.log(`✅ Tables found: ${tables.map((t: { tablename: string }) => t.tablename).join(", ")}`);

  // Test vector type
  await sql`SELECT '[1,2,3]'::vector(3)`;
  console.log("✅ Vector type working");

  // Test 4096-dim vector (our embedding size)
  const testVec = Array(4096).fill(0).map(() => Math.random() * 0.01);
  const vecString = `[${testVec.join(",")}]`;
  await sql.unsafe(`SELECT '${vecString}'::vector(4096)`);
  console.log("✅ 4096-dimension vectors supported");

  await sql.close();
  console.log("\n🎉 All PostgreSQL tests passed!");

} catch (error) {
  console.error("❌ Connection failed:", (error as Error).message);
  process.exit(1);
}
