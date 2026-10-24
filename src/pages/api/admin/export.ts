import type { APIRoute } from 'astro';
import { serviceOptions } from '../../../data/services.ts';
import { leadsForExport } from '../../../server/leads.ts';
import { csvCell, LEAD_STATUSES, PREFERRED_CONTACTS, SITUATIONS, TIMELINES } from '../../../server/validation.ts';

export const prerender = false;

const label = (map: Record<string, string>, key: string | null) => (key ? map[key] ?? key : '');

/** Export CSV (UTF-8 avec BOM pour Excel) des prospects correspondant aux filtres. */
export const GET: APIRoute = async (ctx) => {
  const p = ctx.url.searchParams;
  const rows = await leadsForExport({
    q: p.get('q') ?? undefined,
    status: p.get('status') ?? undefined,
    service: p.get('service') ?? undefined,
    from: p.get('from') ?? undefined,
    to: p.get('to') ?? undefined,
  });
  const services = Object.fromEntries(serviceOptions.map((s) => [s.value, s.label]));
  const header = ['Référence', 'Date', 'Statut', 'Nom', 'Téléphone', 'E-mail', 'Contact préféré', 'Service',
    'Localité', 'Quartier', 'Superficie', 'Situation', 'Délai', 'Description', 'Source', 'Page', 'Accord prospection'];
  const lines = rows.map((r) => [
    r.reference, r.created_at.toISOString(), label(LEAD_STATUSES, r.status), r.full_name, r.phone, r.email,
    label(PREFERRED_CONTACTS, r.preferred_contact), services[r.service] ?? r.service, r.locality, r.neighborhood,
    r.area, label(SITUATIONS, r.situation), label(TIMELINES, r.timeline), r.description, r.source, r.source_page,
    r.consent_marketing ? 'oui' : 'non',
  ].map(csvCell).join(';'));
  const csv = '﻿' + [header.map(csvCell).join(';'), ...lines].join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="prospects-geometre-topo-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
