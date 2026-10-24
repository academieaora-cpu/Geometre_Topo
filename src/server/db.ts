import postgres from 'postgres';
import { DATABASE_URL } from 'astro:env/server';

let client: postgres.Sql | null = null;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('DATABASE_URL non configurée');
  }
}

/**
 * Connexion PostgreSQL partagée par l'instance serverless.
 * `prepare: false` rend la connexion compatible avec les poolers en mode transaction
 * (Supabase port 6543, Neon pooler…).
 */
export function sql(): postgres.Sql {
  if (!DATABASE_URL) throw new DatabaseNotConfiguredError();
  if (!client) {
    client = postgres(DATABASE_URL, {
      max: 3,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: /localhost|127\.0\.0\.1/.test(DATABASE_URL) ? false : 'require',
    });
  }
  return client;
}
