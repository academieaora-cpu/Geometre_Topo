/** Canaux de contact comptés (comptage anonyme des clics), dans l'ordre d'affichage de l'administration. */
export const CLICK_CHANNELS = {
  whatsapp: 'WhatsApp',
  telephone: 'Appel',
  email: 'E-mail',
  devis: 'Bouton devis',
  maps: 'Google Maps',
  avis: 'Lien d’avis',
  reseau: 'Réseaux sociaux',
} as const;
export type ClickChannel = keyof typeof CLICK_CHANNELS;

/** Événements des attributs data-track du site → canal compté. Partagé par le navigateur et le serveur. */
export const TRACK_EVENTS: Record<string, ClickChannel> = {
  click_whatsapp: 'whatsapp',
  click_phone: 'telephone',
  click_email: 'email',
  cta_devis: 'devis',
  click_maps: 'maps',
  click_review: 'avis',
  click_social: 'reseau',
};

/** Événement envoyé une fois par onglet, à la première page vue : compte une visite et sa source. */
export const VISIT_EVENT = 'visit';

/**
 * Source des visiteurs venus du bouton « Site Web » de la fiche Google, à condition que le lien de la fiche
 * porte ?utm_source=google&utm_medium=fiche (sinon ils sont confondus avec la recherche Google).
 */
export const FICHE_GOOGLE_SOURCE = 'google/fiche';

/** Nom lisible d'une source de visite (telle que l'enregistre le navigateur : utm, publicité ou site d'origine). */
export function sourceLabel(source: string): string {
  const s = source.toLowerCase();
  if (s === FICHE_GOOGLE_SOURCE) return 'Fiche Google (bouton « Site Web »)';
  if (s === 'google/cpc') return 'Annonce Google';
  if (s === 'direct') return 'Accès direct (lien tapé, favori, message)';
  if (/^(google\.[a-z.]+|maps\.google\.[a-z.]+)$/.test(s)) return 'Recherche Google';
  if (/(^|\.)facebook\.com$|^fb\.me$/.test(s) || s.startsWith('facebook')) return 'Facebook';
  if (/(^|\.)instagram\.com$/.test(s) || s.startsWith('instagram')) return 'Instagram';
  if (/(^|\.)whatsapp\.com$|^wa\.me$/.test(s)) return 'WhatsApp';
  if (/(^|\.)bing\.com$/.test(s)) return 'Bing';
  return source;
}
