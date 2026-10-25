import type { APIRoute } from 'astro';
import { site } from '../../config/site.ts';
import { DatabaseNotConfiguredError } from '../../server/db.ts';
import { ipHash, json, sameOrigin } from '../../server/http.ts';
import { MAX_SUBSCRIPTIONS_PER_HOUR, recentSubscriptionsFromIp, subscribe, verifyGoogleCredential } from '../../server/subscribers.ts';
import { clean, isValidEmail } from '../../server/validation.ts';

export const prerender = false;

/**
 * Abonnement aux conseils : soit avec un compte Google (jeton vérifié par Google),
 * soit avec une adresse e-mail et une case de consentement.
 */
export const POST: APIRoute = async (ctx) => {
  if (!sameOrigin(ctx)) return json({ ok: false, error: 'Origine non autorisée.' }, 403);
  let body: Record<string, unknown>;
  try {
    const text = await ctx.request.text();
    if (text.length > 6000) return json({ ok: false, error: 'Requête trop volumineuse.' }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: 'Format invalide.' }, 400);
  }

  let email: string;
  let name: string | null = null;
  let source: 'google' | 'email';

  if (typeof body.credential === 'string') {
    const identity = await verifyGoogleCredential(body.credential, site.googleClientId);
    if (!identity) return json({ ok: false, error: 'La connexion Google n’a pas pu être vérifiée. Réessayez.' }, 401);
    ({ email, name } = identity);
    source = 'google';
  } else {
    if (clean(body.website, 100) !== '') return json({ ok: false, error: 'Envoi refusé.' }, 400);
    email = clean(body.email, 254).toLowerCase();
    if (!isValidEmail(email)) return json({ ok: false, error: 'Indiquez une adresse e-mail valide.' }, 422);
    if (body.consent !== true && body.consent !== 'true') {
      return json({ ok: false, error: 'Cochez la case pour accepter de recevoir nos conseils.' }, 422);
    }
    source = 'email';
  }

  const ip = ipHash(ctx);
  try {
    if ((await recentSubscriptionsFromIp(ip)) >= MAX_SUBSCRIPTIONS_PER_HOUR) {
      return json({ ok: false, error: 'Trop de tentatives. Réessayez plus tard.' }, 429);
    }
    const created = await subscribe(email, name, source, ip);
    return json({ ok: true, created, name: name ?? undefined }, created ? 201 : 200);
  } catch (err) {
    console.error('[subscribe] échec', err instanceof DatabaseNotConfiguredError ? 'base non configurée' : err instanceof Error ? err.message : err);
    return json({ ok: false, error: 'L’abonnement n’a pas pu être enregistré pour le moment. Réessayez plus tard.' }, 503);
  }
};
