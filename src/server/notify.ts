import { NOTIFY_EMAIL_FROM, NOTIFY_EMAIL_TO, RESEND_API_KEY } from 'astro:env/server';
import { serviceOptions } from '../data/services.ts';
import { PREFERRED_CONTACTS, SITUATIONS, type LeadInput } from './validation.ts';

export type NotificationResult = 'sent' | 'failed' | 'disabled';

export function notificationsConfigured(): boolean {
  return Boolean(RESEND_API_KEY && NOTIFY_EMAIL_TO && NOTIFY_EMAIL_FROM);
}

/**
 * Prévient le responsable qu'une nouvelle demande est arrivée (API Resend).
 * L'e-mail ne contient qu'un résumé non sensible et un lien vers l'administration :
 * les coordonnées complètes restent consultables uniquement dans l'espace protégé.
 */
export async function notifyNewLead(
  lead: LeadInput,
  reference: string,
  adminUrl: string,
): Promise<{ status: NotificationResult; detail?: string }> {
  if (!notificationsConfigured()) return { status: 'disabled' };
  const service = serviceOptions.find((s) => s.value === lead.service)?.label ?? lead.service;
  const lines = [
    `Nouvelle demande ${reference}`,
    '',
    `Service : ${service}`,
    `Localité : ${lead.locality}${lead.neighborhood ? ` (${lead.neighborhood})` : ''}`,
    `Situation : ${lead.situation ? SITUATIONS[lead.situation] : 'non précisée'}`,
    `Contact préféré : ${PREFERRED_CONTACTS[lead.preferredContact]}`,
    `Prénom / nom : ${lead.fullName}`,
    '',
    `Consulter et traiter la demande : ${adminUrl}`,
  ];
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: NOTIFY_EMAIL_FROM,
        to: NOTIFY_EMAIL_TO!.split(',').map((s) => s.trim()),
        subject: `Nouvelle demande ${reference} – ${service} – ${lead.locality}`,
        text: lines.join('\n'),
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { status: 'failed', detail: `HTTP ${res.status}` };
    return { status: 'sent' };
  } catch (err) {
    return { status: 'failed', detail: err instanceof Error ? err.name : 'erreur' };
  }
}
