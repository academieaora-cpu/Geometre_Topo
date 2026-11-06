import type { APIRoute } from 'astro';
import { parseClick, parseVisit, recordClick, recordVisit } from '../../server/clicks.ts';
import { sameOrigin } from '../../server/http.ts';

export const prerender = false;

/**
 * Comptage anonyme (envoyé par navigator.sendBeacon) : une visite par onglet, et chaque clic sur un
 * bouton de contact. Aucune donnée personnelle, aucune IP, aucun cookie. Répond toujours 204 : un échec
 * de comptage ne doit jamais gêner le visiteur.
 */
export const POST: APIRoute = async (ctx) => {
  if (!sameOrigin(ctx)) return new Response(null, { status: 204 });
  try {
    const text = await ctx.request.text();
    if (text.length > 1000) return new Response(null, { status: 204 });
    const body = JSON.parse(text);
    const visit = parseVisit(body);
    if (visit) await recordVisit(visit);
    else {
      const click = parseClick(body);
      if (click) await recordClick(click);
    }
  } catch (err) {
    console.error('[track]', err instanceof Error ? err.message : err);
  }
  return new Response(null, { status: 204 });
};
