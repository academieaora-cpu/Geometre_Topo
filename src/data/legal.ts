/**
 * Informations légales. NE RIEN INVENTER : laisser vide ce qui n'est pas confirmé,
 * la page affiche alors « en cours de mise à jour ».
 */
export const legal = {
  privacyUpdatedAt: '24 octobre 2026',
  /** Statut juridique exact (ex. entreprise individuelle), à confirmer. */
  legalStatus: '',
  /** Numéro RCCM, à confirmer. */
  rccm: '',
  /** Numéro d'identifiant unique (NIU), à confirmer. */
  niu: '',
  /** Inscription à l'Ordre ou agrément professionnel, uniquement si vérifié. */
  professionalRegistration: '',
  /** Adresse postale publique, uniquement si validée. */
  postalAddress: '',
  host: {
    name: 'Vercel Inc.',
    address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
    url: 'https://vercel.com',
  },
  /** Sous-traitants techniques (à ajuster selon les services réellement activés). */
  processors: [
    { name: 'Vercel', role: 'hébergement du site', location: 'États-Unis / réseau mondial' },
    { name: 'Fournisseur de base de données PostgreSQL (ex. Supabase)', role: 'stockage des demandes', location: 'selon la région choisie lors de la création' },
    { name: 'Resend', role: 'envoi des notifications e-mail internes', location: 'États-Unis' },
  ],
};
