/**
 * Informations de la page « À propos ».
 * N'ajouter QUE des éléments vérifiés par le propriétaire (diplômes, établissements, années…).
 * Une liste vide masque automatiquement la rubrique correspondante.
 */
export const about = {
  /** Ex. « Diplôme de … – Établissement, année ». À compléter après validation. */
  education: [] as string[],
  /** Équipements visibles sur les photos de chantier fournies. */
  equipment: [
    'Récepteurs GNSS avec contrôleur de terrain, pour les relevés et implantations de précision',
    'Station totale sur trépied et prisme, pour les mesures d’angles, de distances et de niveaux',
    'Jalons, cannes, bipied et accessoires de mesure',
  ],
  /** Logiciels réellement utilisés (à compléter après validation). */
  software: ['AutoCAD avec Covadis (calculs topographiques et dessin des plans)'] as string[],
};
