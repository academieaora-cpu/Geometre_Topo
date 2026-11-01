import { db } from './db.ts';
import { clean } from './validation.ts';
import { CLICK_CHANNELS, TRACK_EVENTS, type ClickChannel } from '../data/tracking.ts';

export interface ClickInput { channel: ClickChannel; location: string; page: string; source: string }

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
