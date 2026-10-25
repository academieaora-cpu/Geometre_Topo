import type { APIRoute } from 'astro';
import { unsubscribe } from '../../server/subscribers.ts';

export const prerender = false;

/** Lien de désabonnement inclus dans chaque envoi : /api/unsubscribe?t=<jeton> */
export const GET: APIRoute = async (ctx) => {
  const token = ctx.url.searchParams.get('t') ?? '';
  let ok = false;
  try {
    ok = await unsubscribe(token);
  } catch (err) {
    console.error('[unsubscribe] échec', err instanceof Error ? err.message : err);
  }
  return ctx.redirect(`/desabonnement?${ok ? 'ok=1' : 'erreur=1'}`, 303);
};
