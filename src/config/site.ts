/**
 * Configuration centrale du site Géomètre Topo.
 *
 * Les coordonnées publiques sont lues dans les variables d'environnement PUBLIC_*
 * (fichier .env en local, réglages du projet sur l'hébergeur en production).
 * Tant qu'une valeur n'est pas renseignée, le site masque l'élément concerné
 * (ou redirige vers le formulaire de devis) au lieu d'afficher une valeur inventée.
 */

const env = import.meta.env;

/** Ne garde que les chiffres (format international sans « + » ni espaces). */
function digits(value: string | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

const phoneRaw = (env.PUBLIC_PHONE ?? '').trim();
const whatsappDigits = digits(env.PUBLIC_WHATSAPP_NUMBER) || digits(phoneRaw);

export const site = {
  name: 'Géomètre Topo',
  legalName: 'Géomètre Topo',
  owner: 'Olou’ou Alain Stéphane',
  ownerTitle: 'Géomètre Topographe',
  tagline: 'Travaux topographiques et fonciers à Yaoundé et environs',
  description:
    'Géomètre topographe à Yaoundé : levé topographique, bornage et recherche de bornes, morcellement, dossier technique d’immatriculation, implantation et nivellement. Demandez votre devis.',
  locale: 'fr_CM',
  city: 'Yaoundé',
  region: 'Centre',
  country: 'CM',
  areaServed: ['Yaoundé', 'Environs de Yaoundé'],

  /** Numéro affiché et utilisé pour les liens tel: (ex. « +237 6XX XX XX XX »). */
  phone: phoneRaw,
  phoneHref: phoneRaw ? `tel:+${digits(phoneRaw)}` : '',
  /** Numéro WhatsApp au format international, chiffres uniquement (ex. 2376XXXXXXXX). */
  whatsapp: whatsappDigits,
  email: (env.PUBLIC_EMAIL ?? '').trim(),
  /** Horaires de disponibilité, texte libre (laisser vide tant qu'ils ne sont pas validés). */
  hours: (env.PUBLIC_HOURS ?? '').trim(),
  /** Liens vers les profils publics (Facebook, LinkedIn…), séparés par des virgules. */
  socials: (env.PUBLIC_SOCIAL_LINKS ?? '')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),

  /** Identifiant Google Analytics 4 (G-XXXX). Vide = aucun outil de mesure chargé. */
  gaId: (env.PUBLIC_GA_ID ?? '').trim(),
  /** Identifiant client OAuth Google (bouton « S'abonner avec Google »). Vide = abonnement par e-mail uniquement. */
  googleClientId: (env.PUBLIC_GOOGLE_CLIENT_ID ?? '').trim(),
  /** Jeton de vérification Google Search Console (méthode balise meta), facultatif. */
  googleSiteVerification: (env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '').trim(),
} as const;

/** Réseaux sociaux reconnus à partir de PUBLIC_SOCIAL_LINKS (icône et libellé). */
export const socialProfiles = site.socials.map((url) => {
  const host = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
  if (host.includes('facebook.')) return { url, icon: 'facebook', label: 'Facebook' };
  if (host.includes('instagram.')) return { url, icon: 'instagram', label: 'Instagram' };
  return { url, icon: 'arrow', label: host.replace(/^www\./, '') || 'Lien' };
});

export const nav = [
  { href: '/', label: 'Accueil' },
  { href: '/services', label: 'Services' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/conseils', label: 'Conseils' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Construit un lien WhatsApp avec message prérempli. Retourne '' si le numéro n'est pas configuré. */
export function whatsappLink(message: string): string {
  if (!site.whatsapp) return '';
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsappMessage =
  'Bonjour Géomètre Topo, je souhaite des informations sur une prestation topographique.';
