/**
 * Actualités : nos interventions récentes, publiées avec l'accord du client.
 *
 * Pour en ajouter une : préparer les photos (npm run images, voir src/data/gallery.ts), puis ajouter une entrée
 * EN TÊTE de la liste. Jamais de nom de client, d'adresse précise, de numéro de titre foncier ni de coordonnées :
 * flouter les plans et les écrans avant publication.
 */

export interface Actualite {
  /** Identifiant de l'ancre dans la page (/actualites#slug). */
  slug: string;
  /** Date de l'intervention, au format AAAA-MM-JJ. */
  date: string;
  title: string;
  /** Une phrase, reprise sur l'accueil. */
  summary: string;
  paragraphs: string[];
  /** Photos de la galerie (slugs de src/data/gallery.ts), la première sert de couverture. */
  photos: string[];
  /** Photos montrées sur l'accueil pour la dernière actualité (4 au plus) ; par défaut les premières de `photos`. */
  homePhotos?: string[];
  video?: { src: string; poster: string; label: string };
  /** Service concerné (slug de src/data/services.ts). */
  service?: string;
}

export const actualites: Actualite[] = [
  {
    slug: 'leve-de-detail-architectes-yaounde',
    date: '2026-11-05',
    title: 'Levé de détail pour des architectes, à Yaoundé',
    summary: 'Relevé des constructions existantes, des clôtures, des caniveaux et du relief d’une parcelle, pour servir de base au projet des architectes.',
    paragraphs: [
      'Des architectes nous ont confié le levé de détail d’une parcelle à Yaoundé, avant de concevoir leur projet. Un levé de détail relève tout ce qui existe sur le terrain et autour : bâtiments, murs de clôture, caniveaux, accès et relief.',
      'Les points ont été mesurés au récepteur GNSS, la canne maintenue verticale par un bipied, puis reportés sur un plan avec les courbes de niveau. Les architectes travaillent ainsi sur des dimensions et des altitudes réelles, et non sur un croquis.',
      'Par respect pour le client, ni l’adresse ni les informations foncières de la parcelle ne sont publiées.',
    ],
    photos: [
      'leve-detail-gnss-angle-rue',
      'leve-detail-geometre-gnss',
      'leve-detail-gnss-mur-parpaings',
      'recepteur-gnss-bipied-quartier',
      'extrait-plan-parcelle-leve-detail',
    ],
    homePhotos: [
      'leve-detail-geometre-gnss',
      'leve-detail-gnss-angle-rue',
      'leve-detail-gnss-mur-parpaings',
      'extrait-plan-parcelle-leve-detail',
    ],
    video: {
      src: '/videos/leve-detail-architectes.mp4',
      poster: '/videos/leve-detail-architectes-poster.webp',
      label: 'Vidéo : tour de la parcelle et relevés au récepteur GNSS pendant le levé de détail',
    },
    service: 'leve-topographique',
  },
];

/** Actualités de la plus récente à la plus ancienne. */
export const actualitesRecentes: Actualite[] = [...actualites].sort((a, b) => b.date.localeCompare(a.date));

/** Date lisible en français (« 5 novembre 2026 »), sans dépendre du fuseau du serveur. */
export function dateLisible(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${d === 1 ? '1er' : d} ${mois[m - 1]} ${y}`;
}
