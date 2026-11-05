/**
 * Robots et générateurs d'aperçu de lien (WhatsApp, Facebook, Telegram…) : ils ouvrent un lien
 * dès qu'il est collé dans un message. Leurs visites ne sont pas des personnes et ne sont pas comptées.
 */
const PREVIEW_AGENTS = /bot|crawl|spider|slurp|preview|whatsapp|facebookexternalhit|meta-externalagent|telegram|slack|discord|skype|linkedin/i;

export function isLinkPreview(userAgent: string | null | undefined): boolean {
  return !userAgent || PREVIEW_AGENTS.test(userAgent);
}
