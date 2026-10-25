import type { APIRoute } from 'astro';
import { sameOrigin } from '../../../../server/http.ts';
import { deleteSubscriber } from '../../../../server/subscribers.ts';

export const prerender = false;

/** Suppression définitive d'un abonné (droit à l'effacement). Accès protégé par le middleware. */
export const POST: APIRoute = async (ctx) => {
  if (!sameOrigin(ctx)) return ctx.redirect('/admin/abonnes', 303);
  const id = ctx.params.id ?? '';
  const form = await ctx.request.formData();
  if (/^[0-9a-f-]{36}$/i.test(id) && form.get('confirm') === 'oui') await deleteSubscriber(id);
  return ctx.redirect('/admin/abonnes', 303);
};
