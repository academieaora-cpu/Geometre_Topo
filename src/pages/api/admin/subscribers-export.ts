import type { APIRoute } from 'astro';
import { listSubscribers } from '../../../server/subscribers.ts';
import { csvCell } from '../../../server/validation.ts';

export const prerender = false;

/** Export des abonnés actifs, avec le lien de désabonnement à inclure dans chaque envoi. */
export const GET: APIRoute = async (ctx) => {
  const rows = (await listSubscribers()).filter((r) => !r.unsubscribed_at);
  const header = ['E-mail', 'Nom', 'Inscription', 'Date', 'Lien de désabonnement'];
  const lines = rows.map((r) => [
    r.email, r.name, r.source, r.created_at.toISOString(), `${ctx.url.origin}/api/unsubscribe?t=${r.unsubscribe_token}`,
  ].map(csvCell).join(';'));
  const csv = '﻿' + [header.map(csvCell).join(';'), ...lines].join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="abonnes-geometre-topo-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
