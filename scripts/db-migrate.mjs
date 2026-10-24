// Applique db/schema.sql sur la base indiquée par DATABASE_URL (idempotent).
// Usage : DATABASE_URL="postgres://..." npm run db:migrate
import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL manquante.');
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {}, ssl: /localhost|127\.0\.0\.1/.test(url) ? false : 'require' });
try {
  const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
  await sql.unsafe(schema);
  const [{ n }] = await sql`select count(*)::int as n from leads`;
  console.log(`Schéma appliqué. Prospects en base : ${n}`);
} catch (err) {
  console.error('Échec de la migration :', err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
