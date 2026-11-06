import { db } from './db.ts';
import { clean } from './validation.ts';
import { CLICK_CHANNELS, TRACK_EVENTS, VISIT_EVENT, type ClickChannel } from '../data/tracking.ts';

export interface ClickInput { channel: ClickChannel; location: string; page: string; source: string }
export interface VisitInput { page: string; source: string }

/** Valide une visite envoyée par le navigateur (première page vue de l'onglet) ; null sinon. */
export function parseVisit(body: Record<string, unknown>): VisitInput | null {
  if (clean(body.event, 40) !== VISIT_EVENT) return null;
  const page = clean(body.page, 120);
  if (page.startsWith('/admin')) return null;
  return { page, source: clean(body.source, 60) || 'direct' };
}

export async function recordVisit(v: VisitInput): Promise<void> {
  await (await db())`insert into site_visits (source, page) values (${v.source}, ${v.page || null})`;
}

export interface SourceFunnel {
  source: string;
  visits: number;
  /** Clics sur WhatsApp, l'appel ou l'e-mail par les visiteurs venus de cette source. */
  contacts: number;
  /** Clics sur un bouton « Demander un devis ». */
  devis: number;
}

/** Visites et contacts des 30 derniers jours, par source de visite (les sources les plus fréquentes). */
export async function funnelBySource(): Promise<SourceFunnel[]> {
  const rows = await (await db())<SourceFunnel[]>`
    with v as (
      select source, count(*)::int as visits from site_visits
      where created_at > now() - interval '30 days' group by source
    ), c as (
      select source,
             count(*) filter (where channel in ('whatsapp', 'telephone', 'email'))::int as contacts,
             count(*) filter (where channel = 'devis')::int as devis
      from contact_clicks
      where created_at > now() - interval '30 days' and source is not null
      group by source
    )
    select coalesce(v.source, c.source) as source, coalesce(v.visits, 0) as visits,
           coalesce(c.contacts, 0) as contacts, coalesce(c.devis, 0) as devis
    from v full join c on c.source = v.source
    where coalesce(v.source, c.source) <> 'lien-avis'
    order by visits desc, contacts desc
    limit 8`;
  return [...rows];
}

/** Valide un clic envoyé par le navigateur ; null si l'événement n'est pas compté. */
export function parseClick(body: Record<string, unknown>): ClickInput | null {
  const channel = TRACK_EVENTS[clean(body.event, 40)];
  if (!channel) return null;
  return {
    channel,
    location: clean(body.location, 60),
    page: clean(body.page, 120),
    source: clean(body.source, 60) || 'direct',
  };
}

export async function recordClick(c: ClickInput): Promise<void> {
  await (await db())`
    insert into contact_clicks (channel, location, page, source)
    values (${c.channel}, ${c.location || null}, ${c.page || null}, ${c.source})`;
}

export interface ClickStats {
  byChannel: { channel: ClickChannel; week: number; month: number }[];
  bySource: { source: string; month: number }[];
}

/** Clics des 7 et 30 derniers jours, par canal et par source. */
export async function clickStats(): Promise<ClickStats> {
  const q = await db();
  const [channels, sources] = await Promise.all([
    q<{ channel: ClickChannel; week: number; month: number }[]>`
      select channel,
             count(*) filter (where created_at > now() - interval '7 days')::int as week,
             count(*)::int as month
      from contact_clicks where created_at > now() - interval '30 days'
      group by channel`,
    q<{ source: string; month: number }[]>`
      select source, count(*)::int as month
      from contact_clicks
      where created_at > now() - interval '30 days' and channel in ('whatsapp', 'telephone', 'email')
      group by source order by month desc limit 6`,
  ]);
  const byChannel = (Object.keys(CLICK_CHANNELS) as ClickChannel[]).map((channel) => {
    const row = channels.find((r) => r.channel === channel);
    return { channel, week: row?.week ?? 0, month: row?.month ?? 0 };
  });
  return { byChannel, bySource: [...sources] };
}
