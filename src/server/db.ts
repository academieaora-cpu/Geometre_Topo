import postgres from 'postgres';
import { DATABASE_URL, POSTGRES_URL } from 'astro:env/server';
import schema from '../../db/schema.sql?raw';

let client: postgres.Sql | null = null;
let schemaReady: Promise<void> | null = null;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('DATABASE_URL non configurée');
  }
}

/** DATABASE_URL (Neon, saisie manuelle) ou POSTGRES_URL (intégration Supabase de Vercel). */
function connectionString(): string | undefined {
  return DATABASE_URL || POSTGRES_URL;
}

/**
 * Connexion PostgreSQL partagée par l'instance serverless.
 * `prepare: false` rend la connexion compatible avec les poolers en mode transaction
 * (Supabase port 6543, Neon pooler…).
 */
export function sql(): postgres.Sql {
  const url = connectionString();
  if (!url) throw new DatabaseNotConfiguredError();
  if (!client) {
    client = postgres(url, {
      max: 3,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
      onnotice: () => {},
      ssl: /localhost|127\.0\.0\.1/.test(url) ? false : 'require',
    });
  }
  return client;
}

/**
 * Crée les tables au premier usage (db/schema.sql est idempotent), une fois par instance.
 * Le verrou consultatif évite que deux instances démarrant en même temps se gênent.
 */
export async function db(): Promise<postgres.Sql> {
  const conn = sql();
  if (!schemaReady) {
    schemaReady = conn
      .begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(424242)`;
        await tx.unsafe(schema);
      })
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  await schemaReady;
  return conn;
}
