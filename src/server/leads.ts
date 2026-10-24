import { sql } from './db.ts';
import { secureRandom } from './crypto.ts';
import { LEAD_STATUSES, makeReference, type LeadInput, type LeadStatus } from './validation.ts';

export interface LeadRow {
  id: string;
  reference: string;
  full_name: string;
  phone: string;
  email: string;
  preferred_contact: string;
  service: string;
  locality: string;
  neighborhood: string | null;
  area: string | null;
  situation: string | null;
  description: string | null;
  timeline: string | null;
  has_documents: string | null;
  source: string;
  source_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: LeadStatus;
  consent_processing: boolean;
  consent_marketing: boolean;
  consent_at: Date;
  notification_status: string;
  created_at: Date;
  updated_at: Date;
  anonymized_at: Date | null;
}

export interface LeadEvent {
  id: number;
  type: string;
  content: string | null;
  actor: string | null;
  created_at: Date;
}

/** Nombre maximal de demandes acceptées par heure depuis une même adresse IP. */
export const MAX_LEADS_PER_HOUR = 5;

export async function recentLeadsFromIp(ipHash: string): Promise<number> {
  const [row] = await sql()`
    select count(*)::int as n from leads
    where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
  return row.n as number;
}

/** Enregistre la demande. Ne renvoie qu'après validation (commit) de l'insertion. */
export async function insertLead(lead: LeadInput, ipHash: string): Promise<{ id: string; reference: string }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = makeReference(new Date(), secureRandom);
    try {
      return await sql().begin(async (tx) => {
        const [row] = await tx`
          insert into leads (
            reference, full_name, phone, email, preferred_contact, service, locality, neighborhood, area,
            situation, description, timeline, has_documents, source, source_page, referrer,
            utm_source, utm_medium, utm_campaign, consent_processing, consent_marketing, ip_hash
          ) values (
            ${reference}, ${lead.fullName}, ${lead.phone}, ${lead.email}, ${lead.preferredContact},
            ${lead.service}, ${lead.locality}, ${lead.neighborhood}, ${lead.area}, ${lead.situation},
            ${lead.description}, ${lead.timeline}, ${lead.hasDocuments}, ${lead.source}, ${lead.sourcePage},
            ${lead.referrer}, ${lead.utmSource}, ${lead.utmMedium}, ${lead.utmCampaign},
            ${lead.consentProcessing}, ${lead.consentMarketing}, ${ipHash}
          ) returning id, reference`;
        await tx`insert into lead_events (lead_id, type, content, actor)
                 values (${row.id}, 'created', ${'Demande reçue via ' + lead.source}, 'site')`;
        return { id: row.id as string, reference: row.reference as string };
      });
    } catch (err: unknown) {
      // Collision (très improbable) sur la référence : on régénère.
      if ((err as { code?: string }).code === '23505' && attempt < 2) continue;
      throw err;
    }
  }
  throw new Error('Impossible de générer une référence unique');
}

export async function setNotificationStatus(id: string, status: string, detail?: string): Promise<void> {
  await sql()`update leads set notification_status = ${status} where id = ${id}`;
  await sql()`insert into lead_events (lead_id, type, content, actor)
              values (${id}, 'notification', ${`Notification e-mail : ${status}${detail ? ` (${detail})` : ''}`}, 'site')`;
}

export interface LeadFilters {
  q?: string;
  status?: string;
  service?: string;
  from?: string;
  to?: string;
  page?: number;
}

export const PAGE_SIZE = 25;

export async function listLeads(f: LeadFilters): Promise<{ rows: LeadRow[]; total: number }> {
  const db = sql();
  const conditions = [db`true`];
  if (f.q) {
    const like = `%${f.q.replace(/[\\%_]/g, (c) => '\\' + c)}%`;
    conditions.push(db`(full_name ilike ${like} or phone ilike ${like} or email ilike ${like}
                        or locality ilike ${like} or service ilike ${like} or reference ilike ${like})`);
  }
  if (f.status && f.status in LEAD_STATUSES) conditions.push(db`status = ${f.status}`);
  else if (!f.status) conditions.push(db`status <> 'archive'`);
  if (f.service) conditions.push(db`service = ${f.service}`);
  if (f.from && /^\d{4}-\d{2}-\d{2}$/.test(f.from)) conditions.push(db`created_at >= ${f.from}::date`);
  if (f.to && /^\d{4}-\d{2}-\d{2}$/.test(f.to)) conditions.push(db`created_at < (${f.to}::date + 1)`);

  const where = conditions.reduce((acc, c) => db`${acc} and ${c}`);
  const page = Math.max(1, f.page ?? 1);
  const rows = await db<LeadRow[]>`
    select * from leads where ${where}
    order by created_at desc limit ${PAGE_SIZE} offset ${(page - 1) * PAGE_SIZE}`;
  const [{ n }] = await db`select count(*)::int as n from leads where ${where}`;
  return { rows, total: n as number };
}

export async function leadsForExport(f: LeadFilters): Promise<LeadRow[]> {
  const all: LeadRow[] = [];
  for (let page = 1; page <= 400; page++) {
    const { rows } = await listLeads({ ...f, page });
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }
  return all;
}

export async function statusCounts(): Promise<Record<string, number>> {
  const rows = await sql()`select status, count(*)::int as n from leads group by status`;
  return Object.fromEntries(rows.map((r) => [r.status as string, r.n as number]));
}

export async function leadsLast7Days(): Promise<number> {
  const [row] = await sql()`select count(*)::int as n from leads where created_at > now() - interval '7 days'`;
  return row.n as number;
}

export async function getLead(id: string): Promise<{ lead: LeadRow; events: LeadEvent[] } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [lead] = await sql()<LeadRow[]>`select * from leads where id = ${id}`;
  if (!lead) return null;
  const events = await sql()<LeadEvent[]>`
    select id, type, content, actor, created_at from lead_events where lead_id = ${id} order by created_at desc`;
  return { lead, events };
}

export async function updateStatus(id: string, status: LeadStatus, actor: string): Promise<boolean> {
  const rows = await sql()`
    update leads set status = ${status}, updated_at = now() where id = ${id} and status <> ${status} returning id`;
  if (rows.length === 0) return false;
  await sql()`insert into lead_events (lead_id, type, content, actor)
              values (${id}, 'status', ${'Statut : ' + LEAD_STATUSES[status]}, ${actor})`;
  return true;
}

export async function addNote(id: string, note: string, actor: string): Promise<void> {
  await sql()`insert into lead_events (lead_id, type, content, actor) values (${id}, 'note', ${note}, ${actor})`;
  await sql()`update leads set updated_at = now() where id = ${id}`;
}

/**
 * Anonymise une demande : les données d'identification et le texte libre sont effacés,
 * seules les informations statistiques (service, localité, dates, statut) sont conservées.
 */
export async function anonymizeLead(id: string, actor: string): Promise<void> {
  await sql().begin(async (tx) => {
    await tx`
      update leads set full_name = 'Anonymisé', phone = '', email = '', neighborhood = null, area = null,
        description = null, referrer = null, ip_hash = null, consent_marketing = false,
        anonymized_at = now(), updated_at = now(), status = 'archive'
      where id = ${id}`;
    await tx`delete from lead_events where lead_id = ${id} and type = 'note'`;
    await tx`insert into lead_events (lead_id, type, content, actor) values (${id}, 'anonymized', 'Données personnelles effacées', ${actor})`;
  });
}

export async function deleteLead(id: string): Promise<void> {
  await sql()`delete from leads where id = ${id}`;
}

// --- Limitation des tentatives de connexion ---

export async function recordLoginAttempt(ipHash: string, success: boolean): Promise<void> {
  await sql()`insert into login_attempts (ip_hash, success) values (${ipHash}, ${success})`;
  await sql()`delete from login_attempts where created_at < now() - interval '7 days'`;
}

/** true si la connexion doit être temporairement bloquée. */
export async function loginLocked(ipHash: string): Promise<boolean> {
  const [row] = await sql()`
    select
      count(*) filter (where ip_hash = ${ipHash})::int as from_ip,
      count(*)::int as total
    from login_attempts
    where success = false and created_at > now() - interval '15 minutes'`;
  return (row.from_ip as number) >= 5 || (row.total as number) >= 30;
}
