/**
 * Portfolio de projets réalisés (page /realisations).
 *
 * N'ajouter que des réalisations AUTHENTIQUES, avec l'accord du client si nécessaire,
 * sans nom, coordonnées GNSS, numéro de titre foncier ni plan confidentiel.
 * Tant que la liste est vide, seule la galerie photo est affichée.
 *
 * Exemple d'entrée :
 * {
 *   title: 'Recherche de bornes avant achat',
 *   service: 'bornage-recherche-de-bornes',
 *   locality: 'Yaoundé (périphérie)',        // facultatif, seulement si divulgable
 *   photos: ['jalons-borne-existante'],
 *   need: 'Le client souhaitait vérifier les limites avant de signer.',
 *   work: 'Recherche des bornes à partir du plan fourni, relevé GNSS du périmètre.',
 *   result: 'Constat remis au client avant la signature.', // facultatif
 * },
 */
export interface Project {
  title: string;
  service: string;
  locality?: string;
  photos: string[];
  need: string;
  work: string;
  result?: string;
}

export const projects: Project[] = [];
