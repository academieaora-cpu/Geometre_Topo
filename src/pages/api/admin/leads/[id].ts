import type { APIRoute } from 'astro';
import { sameOrigin } from '../../../../server/http.ts';
import { addNote, anonymizeLead, deleteLead, getLead, updateStatus } from '../../../../server/leads.ts';
import { LEAD_STATUSES, type LeadStatus } from '../../../../server/validation.ts';

export const prerender = false;

/** Actions sur un prospect (accès réservé : vérifié par le middleware). */
export const POST: APIRoute = async (ctx) => {
  const id = ctx.params.id ?? '';
  const admin = ctx.locals.admin!;
  const back = (msg: string) => ctx.redirect(`/admin/prospects/${id}?msg=${msg}`, 303);
  if (!sameOrigin(ctx)) return back('origine');

  const found = await getLead(id);
  if (!found) return ctx.redirect('/admin?msg=introuvable', 303);

  const form = await ctx.request.formData();
  const action = String(form.get('action') ?? '');

  switch (action) {
    case 'status': {
      const status = String(form.get('status') ?? '');
      if (!(status in LEAD_STATUSES)) return back('statut-invalide');
      await updateStatus(id, status as LeadStatus, admin);
      return back('statut');
    }
    case 'note': {
      const note = String(form.get('note') ?? '').trim().slice(0, 4000);
      if (!note) return back('note-vide');
      await addNote(id, note, admin);
      return back('note');
    }
    case 'anonymize':
      if (form.get('confirm') !== 'oui') return back('confirmation');
      await anonymizeLead(id, admin);
      return back('anonymise');
    case 'delete':
      if (form.get('confirm') !== 'oui') return back('confirmation');
      await deleteLead(id);
      return ctx.redirect('/admin?msg=supprime', 303);
    default:
      return back('action-inconnue');
  }
};
