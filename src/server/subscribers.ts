import { randomBytes } from 'node:crypto';
import { db } from './db.ts';

export interface SubscriberRow {
  id: string;
  email: string;
  name: string | null;
  source: 'google' | 'email';
  consent_at: Date;
  unsubscribe_token: string;
  unsubscribed_at: Date | null;
  created_at: Date;
}

export const MAX_SUBSCRIPTIONS_PER_HOUR = 10;

export async function recentSubscriptionsFromIp(ipHash: string): Promise<number> {
  const [row] = await (await db())`
    select count(*)::int as n from subscribers where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
  return row.n as number;
}

/** Inscrit (ou réinscrit) une adresse. Renvoie true si l'abonnement est nouveau. */
export async function subscribe(email: string, name: string | null, source: 'google' | 'email', ipHash: string): Promise<boolean> {
  const token = randomBytes(24).toString('base64url');
  const rows = await (await db())`
    insert into subscribers (email, name, source, unsubscribe_token, ip_hash)
    values (${email}, ${name}, ${source}, ${token}, ${ipHash})
    on conflict (email) do update set
      unsubscribed_at = null,
      consent_at = now(),
      name = coalesce(excluded.name, subscribers.name)
    returning (xmax = 0) as inserted`;
  return Boolean(rows[0]?.inserted);
}

export async function unsubscribe(token: string): Promise<boolean> {
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(token)) return false;
  const rows = await (await db())`
    update subscribers set unsubscribed_at = now() where unsubscribe_token = ${token} and unsubscribed_at is null returning id`;
  return rows.length > 0;
}

export async function listSubscribers(): Promise<SubscriberRow[]> {
  return (await db())<SubscriberRow[]>`select * from subscribers order by created_at desc limit 5000`;
}

export async function activeSubscriberCount(): Promise<number> {
  const [row] = await (await db())`select count(*)::int as n from subscribers where unsubscribed_at is null`;
  return row.n as number;
}

export async function deleteSubscriber(id: string): Promise<void> {
  await (await db())`delete from subscribers where id = ${id}`;
}

/**
 * Vérifie un jeton d'identité « Se connecter avec Google » auprès de Google.
 * Renvoie l'e-mail vérifié et le nom, ou null si le jeton est invalide.
 */
export async function verifyGoogleCredential(
  credential: string,
  clientId: string,
): Promise<{ email: string; name: string | null } | null> {
  if (!clientId || credential.length > 4096) return null;
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const info = (await res.json()) as Record<string, string>;
    const issuerOk = info.iss === 'accounts.google.com' || info.iss === 'https://accounts.google.com';
    const notExpired = Number(info.exp) * 1000 > Date.now();
    if (info.aud !== clientId || !issuerOk || !notExpired || info.email_verified !== 'true' || !info.email) return null;
    return { email: info.email.toLowerCase().slice(0, 254), name: info.name ? info.name.slice(0, 120) : null };
  } catch {
    return null;
  }
}
