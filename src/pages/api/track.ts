import type { APIRoute } from 'astro';
import { parseClick, recordClick } from '../../server/clicks.ts';
import { sameOrigin } from '../../server/http.ts';

export const prerender = false;

/**
 * Comptage anonyme d'un clic sur un bouton de contact (envoyé par navigator.sendBeacon).
 * Aucune donnée personnelle, aucune IP, aucun cookie. Répond toujours 204 : un échec de
 * comptage ne doit jamais gêner le visiteur.
 */
export const POST: APIRoute = async (ctx) => {
  if (!sameOrigin(ctx)) return new Response(null, { status: 204 });
  try {
    const text = await ctx.request.text();
    if (text.length > 1000) return new Response(null, { status: 204 });
    const click = parseClick(JSON.parse(text));
    if (click) await recordClick(click);
  } catch (err) {
    console.error('[track]', err instanceof Error ? err.message : err);
  }
  return new Response(null, { status: 204 });
};
