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
