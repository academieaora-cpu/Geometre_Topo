/**
 * Validation des demandes (prospects). Module sans dépendance : il est utilisé
 * côté serveur (API) et par les tests automatisés. Le navigateur fait une
 * pré-validation pour le confort de l'utilisateur, mais seule cette validation
 * serveur fait foi.
 */

export const PREFERRED_CONTACTS = {
  whatsapp: 'WhatsApp',
  telephone: 'Téléphone',
  email: 'E-mail',
} as const;

export const SITUATIONS = {
  achat_envisage: 'Achat envisagé',
  terrain_acquis: 'Terrain déjà acquis',
  limites_incertaines: 'Limites incertaines',
  projet_construction: 'Projet de construction',
  morcellement: 'Morcellement',
  dossier_foncier: 'Dossier foncier',
  autre: 'Autre',
} as const;

export const TIMELINES = {
  urgent: 'Dès que possible',
  un_mois: 'Dans le mois',
  trois_mois: 'Dans les 3 mois',
  pas_presse: 'Pas pressé / à définir',
} as const;

export const DOCUMENTS = {
  oui: 'Oui',
  non: 'Non',
  a_confirmer: 'À confirmer',
} as const;

export const LEAD_SOURCES = {
  formulaire_devis: 'Formulaire de devis',
  formulaire_contact: 'Formulaire de contact',
  formulaire_service: 'Formulaire page service',
} as const;

export const LEAD_STATUSES = {
  nouveau: 'Nouveau prospect',
  a_contacter: 'À contacter',
  contact_etabli: 'Contact établi',
  besoin_a_preciser: 'Besoin à préciser',
  devis_a_preparer: 'Devis à préparer',
  devis_transmis: 'Devis transmis',
  en_attente: 'En attente de réponse',
  confirme: 'Prestation confirmée',
  non_converti: 'Prospect non converti',
  archive: 'Archivé',
} as const;

export type LeadStatus = keyof typeof LEAD_STATUSES;

export interface LeadInput {
  fullName: string;
  phone: string;
  email: string;
  preferredContact: keyof typeof PREFERRED_CONTACTS;
  service: string;
  locality: string;
  neighborhood: string | null;
  area: string | null;
  situation: keyof typeof SITUATIONS | null;
  description: string | null;
  timeline: keyof typeof TIMELINES | null;
  hasDocuments: keyof typeof DOCUMENTS | null;
  consentProcessing: true;
  consentMarketing: boolean;
  source: keyof typeof LEAD_SOURCES;
  sourcePage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

export type ValidationResult =
  | { ok: true; data: LeadInput }
  | { ok: false; errors: Record<string, string>; spam?: boolean };

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
/** Délai minimal (ms) entre l'affichage du formulaire et l'envoi : en dessous, il s'agit presque toujours d'un robot. */
export const MIN_FILL_MS = 3000;

/** Supprime les caractères de contrôle et normalise les espaces. */
export function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max);
}

function optional(value: unknown, max: number): string | null {
  const v = clean(value, max);
  return v === '' ? null : v;
}

function oneOf<T extends Record<string, string>>(value: unknown, options: T): keyof T | null {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(options, value)
    ? (value as keyof T)
    : null;
}

function truthy(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

/** Normalise un numéro : garde chiffres et « + » initial. */
export function normalizePhone(value: unknown): string {
  const raw = clean(value, 40);
  const plus = raw.startsWith('+') || raw.startsWith('00');
  const digits = raw.replace(/\D/g, '').replace(/^00/, '');
  return (plus ? '+' : '') + digits;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_RE.test(email);
}

/** Ne conserve que le chemin d'une URL interne (jamais de paramètres pouvant contenir des données personnelles). */
export function safePath(value: unknown): string | null {
  const v = clean(value, 300);
  if (!v.startsWith('/') || v.startsWith('//')) return null;
  return v.split(/[?#]/)[0] || null;
}

/** Ne conserve que le nom de domaine du référent. */
export function safeReferrer(value: unknown): string | null {
  const v = clean(value, 500);
  if (!v) return null;
  try {
    return new URL(v).hostname.slice(0, 120) || null;
  } catch {
    return null;
  }
}

export function validateLead(
  input: Record<string, unknown>,
  opts: { services: string[]; now?: number },
): ValidationResult {
  const errors: Record<string, string> = {};

  // Pièges antispam : champ caché rempli ou envoi trop rapide.
  const honeypot = clean(input.website, 200);
  const startedAt = Number(input.startedAt);
  const now = opts.now ?? Date.now();
  if (honeypot !== '' || (Number.isFinite(startedAt) && startedAt > 0 && now - startedAt < MIN_FILL_MS)) {
    return { ok: false, spam: true, errors: { form: 'Envoi refusé.' } };
  }

  const fullName = clean(input.fullName, 120);
  if (fullName.length < 2) errors.fullName = 'Indiquez votre nom et prénom.';

  const phone = normalizePhone(input.phone);
  if (!isValidPhone(phone)) errors.phone = 'Indiquez un numéro de téléphone valide (8 à 15 chiffres).';

  const preferredContact = oneOf(input.preferredContact, PREFERRED_CONTACTS);
  if (!preferredContact) errors.preferredContact = 'Choisissez un moyen de contact.';

  // L'e-mail est facultatif (la plupart des clients échangent par WhatsApp ou téléphone),
  // sauf si le visiteur demande à être recontacté par e-mail.
  const email = clean(input.email, 254).toLowerCase();
  if (email && !isValidEmail(email)) errors.email = 'Indiquez une adresse e-mail valide (ex. nom@exemple.com).';
  else if (!email && preferredContact === 'email') errors.email = 'Indiquez votre adresse e-mail pour être recontacté par e-mail.';

  const serviceRaw = clean(input.service, 80) || 'autre';
  const service = serviceRaw === 'autre' || opts.services.includes(serviceRaw) ? serviceRaw : null;
  if (!service) errors.service = 'Choisissez un service dans la liste.';

  const locality = clean(input.locality, 120);
  if (locality.length < 2) errors.locality = 'Indiquez la localité du terrain.';

  const situationRaw = clean(input.situation, 40);
  const situation = situationRaw ? oneOf(situationRaw, SITUATIONS) : null;
  if (situationRaw && !situation) errors.situation = 'Situation non reconnue.';

  const timelineRaw = clean(input.timeline, 40);
  const timeline = timelineRaw ? oneOf(timelineRaw, TIMELINES) : null;
  if (timelineRaw && !timeline) errors.timeline = 'Délai non reconnu.';

  const documentsRaw = clean(input.hasDocuments, 40);
  const hasDocuments = documentsRaw ? oneOf(documentsRaw, DOCUMENTS) : null;
  if (documentsRaw && !hasDocuments) errors.hasDocuments = 'Valeur non reconnue.';

  const description = typeof input.description === 'string'
    ? input.description.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, 3000) || null
    : null;

  if (!truthy(input.consentProcessing)) {
    errors.consentProcessing = 'Votre accord est nécessaire pour que nous puissions traiter votre demande.';
  }

  const source = oneOf(input.source, LEAD_SOURCES) ?? 'formulaire_devis';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      fullName,
      phone,
      email,
      preferredContact: preferredContact!,
      service: service!,
      locality,
      neighborhood: optional(input.neighborhood, 120),
      area: optional(input.area, 60),
      situation,
      description,
      timeline,
      hasDocuments,
      consentProcessing: true,
      consentMarketing: truthy(input.consentMarketing),
      source,
      sourcePage: safePath(input.sourcePage),
      referrer: safeReferrer(input.referrer),
      utmSource: optional(input.utmSource, 80),
      utmMedium: optional(input.utmMedium, 80),
      utmCampaign: optional(input.utmCampaign, 120),
    },
  };
}

/** Référence lisible d'une demande, ex. GT-261024-K7QF. */
export function makeReference(date = new Date(), random: () => number = Math.random): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, '');
  let suffix = '';
  for (let i = 0; i < 5; i++) suffix += alphabet[Math.floor(random() * alphabet.length)];
  return `GT-${ymd}-${suffix}`;
}

/** Échappe une valeur pour un export CSV (et neutralise l'injection de formules tableur). */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  // Un numéro de téléphone « +237… » n'est pas une formule : on le laisse intact.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+[\d ]+$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
