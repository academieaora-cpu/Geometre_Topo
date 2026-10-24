import type { APIRoute } from 'astro';
import { activeServices } from '../../data/services.ts';
import { DatabaseNotConfiguredError } from '../../server/db.ts';
import { ipHash, json, sameOrigin } from '../../server/http.ts';
import { insertLead, MAX_LEADS_PER_HOUR, recentLeadsFromIp, setNotificationStatus } from '../../server/leads.ts';
import { notifyNewLead } from '../../server/notify.ts';
import { validateLead } from '../../server/validation.ts';

export const prerender = false;

const MAX_BODY = 20_000;

/**
 * Réception d'une demande de devis / de contact.
 * - Requête JSON (formulaire avec JavaScript) : réponse JSON.
 * - Formulaire HTML classique (sans JavaScript) : redirection vers la page de confirmation ou d'erreur.
 * Une confirmation n'est renvoyée QUE si l'enregistrement en base a réussi.
 */
export const POST: APIRoute = async (ctx) => {
  const isJson = (ctx.request.headers.get('content-type') ?? '').includes('application/json');
  const fail = (status: number, body: Record<string, unknown>) =>
    isJson ? json(body, status) : ctx.redirect(`/demande-non-envoyee?motif=${status === 422 ? 'validation' : 'technique'}`, 303);

  if (!sameOrigin(ctx)) return fail(403, { ok: false, error: 'Origine non autorisée.' });

  const length = Number(ctx.request.headers.get('content-length') ?? 0);
  if (length > MAX_BODY) return fail(413, { ok: false, error: 'Demande trop volumineuse.' });

  let input: Record<string, unknown>;
  try {
    if (isJson) {
      const text = await ctx.request.text();
      if (text.length > MAX_BODY) return fail(413, { ok: false, error: 'Demande trop volumineuse.' });
      input = JSON.parse(text);
    } else {
      input = Object.fromEntries((await ctx.request.formData()).entries());
    }
    if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new Error('format');
  } catch {
    return fail(400, { ok: false, error: 'Format de demande invalide.' });
  }

  const result = validateLead(input, { services: activeServices.map((s) => s.slug) });
  if (!result.ok) {
    // Les robots détectés reçoivent une erreur neutre, sans enregistrement.
    if (result.spam) return fail(400, { ok: false, error: 'Envoi refusé. Réessayez dans quelques secondes.' });
    return fail(422, { ok: false, errors: result.errors });
  }

  const ip = ipHash(ctx);
  try {
    if ((await recentLeadsFromIp(ip)) >= MAX_LEADS_PER_HOUR) {
      return fail(429, { ok: false, error: 'Trop de demandes envoyées. Contactez-nous directement par téléphone ou WhatsApp.' });
    }
    const { id, reference } = await insertLead(result.data, ip);

    // La notification n'empêche jamais la confirmation : la demande est déjà enregistrée.
    const notif = await notifyNewLead(result.data, reference, `${ctx.url.origin}/admin/prospects/${id}`);
    await setNotificationStatus(id, notif.status, notif.detail).catch((err) =>
      console.error('[leads] statut de notification non enregistré', err instanceof Error ? err.message : err),
    );

    if (!isJson) return ctx.redirect(`/demande-envoyee?ref=${encodeURIComponent(reference)}`, 303);
    return json({ ok: true, reference }, 201);
  } catch (err) {
    // Journal technique sans donnée personnelle.
    console.error('[leads] échec d’enregistrement', err instanceof DatabaseNotConfiguredError ? 'base non configurée' : err instanceof Error ? err.message : err);
    return fail(503, {
      ok: false,
      error: 'Votre demande n’a pas pu être enregistrée suite à un problème technique. Réessayez ou contactez-nous directement.',
    });
  }
};
