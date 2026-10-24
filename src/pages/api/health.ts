import type { APIRoute } from 'astro';
import { DatabaseNotConfiguredError, sql } from '../../server/db.ts';
import { json } from '../../server/http.ts';

export const prerender = false;

/**
 * Point de contrôle pour la surveillance (bipeur GitHub, UptimeRobot…).
 * 200 = site et base de données opérationnels ; 503 = base indisponible ou non configurée.
 * Aucune information interne (version, erreur, hôte) n'est divulguée.
 */
export const GET: APIRoute = async () => {
  let database = 'ok';
  try {
    await Promise.race([
      sql()`select 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
    ]);
  } catch (err) {
    database = err instanceof DatabaseNotConfiguredError ? 'non_configuree' : 'indisponible';
  }
  const ok = database === 'ok';
  return json({ status: ok ? 'ok' : 'degrade', database, time: new Date().toISOString() }, ok ? 200 : 503);
};

export const HEAD: APIRoute = async (ctx) => {
  const res = await GET(ctx);
  return new Response(null, { status: res.status, headers: { 'Cache-Control': 'no-store' } });
};
