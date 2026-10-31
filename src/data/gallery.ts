/**
 * Photographies authentiques fournies par Géomètre Topo.
 *
 * Pour ajouter une photo :
 *  1. déposer le fichier (JPG) dans photos/originals/ avec un nom explicite ;
 *  2. lancer `npm run images` (génère les versions WebP et met à jour images.json) ;
 *  3. ajouter une entrée ci-dessous (slug = nom du fichier sans extension).
 * Ne publier ni coordonnées GNSS, ni nom de client, ni numéro de titre foncier :
 * flouter ou recadrer avant (voir docs/maintenance.md).
 */

export type GalleryCategory = 'mesures' | 'bornes' | 'chantier' | 'bureau' | 'portrait';

export const galleryCategories: Record<GalleryCategory, string> = {
  mesures: 'Relevés GNSS et station totale',
  bornes: 'Bornes et limites',
  chantier: 'Chantiers et implantation',
  bureau: 'Traitement et plans',
  portrait: 'Le géomètre',
};

export interface GalleryPhoto {
  slug: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** Services que la photo peut illustrer (slugs de src/data/services.ts). */
  services: string[];
  /**
   * Le géomètre est reconnaissable sur la photo. Son visage n'apparaît que deux fois sur le site
   * (présentation de l'accueil et page « À propos ») : ces photos ne sont pas réutilisées ailleurs.
   */
  showsFace?: boolean;
}

export const gallery: GalleryPhoto[] = [
  {
    slug: 'station-totale-mise-en-station',
    alt: 'Géomètre visant à travers une station totale montée sur trépied jaune, devant une villa en construction',
    caption: 'Mesures à la station totale devant un bâtiment en construction.',
    category: 'mesures',
    services: ['implantation-batiment', 'leve-topographique', 'topographie-btp', 'nivellement-altimetrie'],
  },
  {
    slug: 'geometre-releve-gnss-route',
    alt: 'Géomètre en chemise à pois tenant une canne GNSS et son contrôleur au bord d’une piste en terre',
    caption: 'Relevé au récepteur GNSS le long d’une piste.',
    category: 'mesures',
    services: ['leve-topographique', 'plan-topographique', 'bornage-recherche-de-bornes', 'lotissement'],
    showsFace: true,
  },
  {
    slug: 'geometre-gnss-piste',
    alt: 'Géomètre debout sur une piste rurale avec une canne GNSS jaune et un contrôleur de terrain',
    caption: 'Descente de terrain en zone rurale, récepteur GNSS en main.',
    category: 'mesures',
    services: ['leve-topographique', 'lotissement', 'morcellement-de-terrain'],
    showsFace: true,
  },
  {
    slug: 'releve-gnss-borne',
    alt: 'Contrôleur de terrain fixé sur la canne d’un récepteur GNSS, à côté d’une borne en béton fraîchement posée',
    caption: 'Relevé d’une borne au récepteur GNSS, contrôleur de terrain en main.',
    category: 'mesures',
    services: ['bornage-recherche-de-bornes', 'dossier-technique-immatriculation', 'plan-topographique'],
  },
  {
    slug: 'gnss-vegetation-dense',
    alt: 'Récepteur GNSS jaune sur sa canne au milieu d’une végétation dense, contrôleur au premier plan',
    caption: 'Mesures GNSS même en végétation dense.',
    category: 'mesures',
    services: ['leve-topographique', 'bornage-recherche-de-bornes', 'conseil-terrain'],
  },
  {
    slug: 'recepteur-gnss-trepied',
    alt: 'Récepteur GNSS monté sur une canne maintenue par un bipied, devant un mur de clôture en béton',
    caption: 'Récepteur GNSS stationné en milieu urbain, le long d’une clôture.',
    category: 'mesures',
    services: ['leve-topographique', 'topographie-btp', 'nivellement-altimetrie'],
  },
  {
    slug: 'recepteur-gnss-mallette',
    alt: 'Contrôleur de terrain tenu en main au-dessus de la mallette ouverte d’un récepteur GNSS',
    caption: 'Préparation du récepteur GNSS avant les mesures.',
    category: 'mesures',
    services: ['leve-topographique'],
  },
  {
    slug: 'materiel-gnss-terrain',
    alt: 'Matériel de terrain posé au sol : récepteur GNSS, contrôleur, antenne, batterie et housse de canne',
    caption: 'Le matériel de mesure GNSS prêt pour la descente de terrain.',
    category: 'mesures',
    services: ['leve-topographique', 'conseil-terrain'],
  },
  {
    slug: 'pose-borne-beton',
    alt: 'Borne en béton mise en place dans un trou creusé en terre rouge, entourée d’une pelle, d’une barre à mine et d’une machette',
    caption: 'Mise en place d’une borne en béton sur une limite de terrain.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'morcellement-de-terrain', 'lotissement'],
  },
  {
    slug: 'bornes-beton-parcelle',
    alt: 'Deux bornes en béton dressées dans la végétation d’une parcelle, palmiers en arrière-plan',
    caption: 'Bornes matérialisant les limites d’une parcelle.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'lotissement', 'morcellement-de-terrain'],
  },
  {
    slug: 'bornes-beton-avant-pose',
    alt: 'Bornes en béton déposées au sol en bordure d’un terrain débroussaillé',
    caption: 'Bornes en béton prêtes à être posées.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'morcellement-de-terrain'],
  },
  {
    slug: 'jalons-borne-existante',
    alt: 'Deux jalons rouges et blancs et une canne de mesure posés près d’une borne existante dans l’herbe',
    caption: 'Repérage d’une borne existante avec jalons et canne de mesure.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'conseil-terrain', 'dossier-technique-immatriculation'],
  },
  {
    slug: 'borne-peinte-limite',
    alt: 'Borne peinte en rouge au pied d’un mur de clôture, signalant une limite de propriété',
    caption: 'Borne de limite peinte en rouge pour être retrouvée facilement.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'conseil-terrain'],
  },
  {
    slug: 'borne-terrain-humide',
    alt: 'Borne en béton dégagée sur un terrain boueux, près d’une flaque d’eau après la pluie',
    caption: 'Borne retrouvée et dégagée sur un terrain détrempé.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes'],
  },
  {
    slug: 'descente-terrain-parcelle',
    alt: 'Deux personnes de dos parcourant une parcelle en pente fraîchement débroussaillée, sous les palmiers',
    caption: 'Reconnaissance d’une parcelle avant les mesures.',
    category: 'bornes',
    services: ['conseil-terrain', 'leve-topographique', 'bornage-recherche-de-bornes'],
  },
  {
    slug: 'implantation-prisme-mur',
    alt: 'Opérateur tenant une canne équipée d’un prisme de station totale au pied d’un mur en parpaings',
    caption: 'Mesures au prisme de station totale au pied d’un bâtiment en construction.',
    category: 'chantier',
    services: ['implantation-batiment', 'topographie-btp', 'nivellement-altimetrie'],
  },
  {
    slug: 'pose-canalisation-tranchee',
    alt: 'Canalisation en buses béton posée au fond d’une tranchée en terre rouge',
    caption: 'Chantier de canalisation : alignement et pente de pose.',
    category: 'chantier',
    services: ['topographie-btp', 'nivellement-altimetrie'],
  },
  {
    slug: 'tranchee-buses-beton',
    alt: 'Tranchée étroite creusée le long d’un mur de clôture, buses en béton posées sur le bord',
    caption: 'Tranchée d’assainissement avant la pose des buses.',
    category: 'chantier',
    services: ['topographie-btp', 'nivellement-altimetrie'],
  },
  {
    slug: 'tranchee-chantier-assainissement',
    alt: 'Fond d’une tranchée en terre rouge menant à un mur en parpaings, avec un repère au sol',
    caption: 'Contrôle du fond de tranchée sur un chantier d’assainissement.',
    category: 'chantier',
    services: ['topographie-btp', 'nivellement-altimetrie', 'implantation-batiment'],
  },
  {
    slug: 'recepteur-gnss-mur-enduit',
    alt: 'Récepteur GNSS sur sa canne maintenue par un bipied, devant un mur de clôture enduit en milieu urbain',
    caption: 'Mesure GNSS en milieu urbain, le long d’une clôture.',
    category: 'mesures',
    services: ['leve-topographique', 'plan-topographique', 'topographie-btp'],
  },
  {
    slug: 'recepteur-gnss-mur-parpaings',
    alt: 'Récepteur GNSS sur canne et bipied rouge et blanc, au pied d’un mur en parpaings sur un sol en terre rouge',
    caption: 'Récepteur GNSS en station au pied d’un mur en parpaings.',
    category: 'mesures',
    services: ['leve-topographique', 'bornage-recherche-de-bornes', 'plan-topographique'],
  },
  {
    slug: 'recepteur-gnss-cour-terre-rouge',
    alt: 'Récepteur GNSS sur canne et bipied dans l’angle d’une cour clôturée en terre rouge',
    caption: 'Relevé GNSS dans l’angle d’une cour clôturée.',
    category: 'mesures',
    services: ['leve-topographique', 'implantation-batiment', 'nivellement-altimetrie'],
  },
  {
    slug: 'canne-gnss-bipied-controleur',
    alt: 'Canne GNSS maintenue par un bipied rouge et blanc, contrôleur de terrain posé sur un bloc de pierre',
    caption: 'Canne GNSS sur bipied et contrôleur de terrain prêts pour la mesure.',
    category: 'mesures',
    services: ['leve-topographique', 'implantation-batiment'],
  },
  {
    slug: 'station-gnss-angle-parcelle',
    alt: 'Récepteur GNSS en station à l’angle d’une parcelle clôturée, contrôleur de terrain posé sur une pierre',
    caption: 'Mesure d’un angle de parcelle au récepteur GNSS.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'dossier-technique-immatriculation', 'morcellement-de-terrain'],
  },
  {
    slug: 'releve-gnss-regard-assainissement',
    alt: 'Récepteur GNSS installé près d’un regard d’assainissement en béton rempli d’eau, au pied d’un mur',
    caption: 'Relevé d’un regard d’assainissement au récepteur GNSS.',
    category: 'chantier',
    services: ['topographie-btp', 'nivellement-altimetrie', 'leve-topographique'],
  },
  {
    slug: 'jalons-bipied-chantier',
    alt: 'Bipied rouge et blanc et canne de mesure posés contre des parpaings sur un chantier',
    caption: 'Matériel de mesure sur un chantier en cours.',
    category: 'chantier',
    services: ['implantation-batiment', 'topographie-btp'],
  },
  {
    slug: 'extrait-plan-parcelle',
    alt: 'Extrait de plan de bornage montrant le contour d’une parcelle, ses bornes B1 à B6 et les distances entre elles',
    caption: 'Extrait de plan de bornage (informations du client masquées).',
    category: 'bureau',
    services: ['plan-topographique', 'dossier-technique-immatriculation', 'bornage-recherche-de-bornes', 'morcellement-de-terrain'],
  },
  {
    slug: 'traitement-plans-ordinateur',
    alt: 'Ordinateur portable affichant un plan de lotissement en cours de dessin (écran volontairement flouté)',
    caption: 'Traitement des mesures et dessin des plans au bureau (écran flouté).',
    category: 'bureau',
    services: ['plan-topographique', 'lotissement', 'morcellement-de-terrain'],
  },
  {
    slug: 'portrait-alain-stephane-olouou',
    alt: 'Portrait d’Olou’ou Alain Stéphane, géomètre topographe, en chemise, cravate et gilet de sécurité',
    caption: 'Olou’ou Alain Stéphane, géomètre topographe.',
    category: 'portrait',
    services: [],
    showsFace: true,
  },
];

/** Photos de terrain publiables partout (sans le visage du géomètre). */
export const workPhotos: GalleryPhoto[] = gallery.filter((p) => !p.showsFace);

/** Photo principale de chaque service (cartes et pages), choisie pour éviter les répétitions. */
export const serviceCovers: Record<string, string> = {
  'leve-topographique': 'station-totale-mise-en-station',
  'bornage-recherche-de-bornes': 'bornes-beton-parcelle',
  'morcellement-de-terrain': 'pose-borne-beton',
  'dossier-technique-immatriculation': 'extrait-plan-parcelle',
  'plan-topographique': 'traitement-plans-ordinateur',
  'implantation-batiment': 'implantation-prisme-mur',
  'nivellement-altimetrie': 'recepteur-gnss-trepied',
  'topographie-btp': 'pose-canalisation-tranchee',
  lotissement: 'gnss-vegetation-dense',
  'conseil-terrain': 'descente-terrain-parcelle',
};

/** Photos d'un service : la photo principale d'abord, puis les autres photos liées. */
export function photosForService(serviceSlug: string, max = 3): GalleryPhoto[] {
  const cover = workPhotos.find((p) => p.slug === serviceCovers[serviceSlug]);
  const others = workPhotos.filter((p) => p.services.includes(serviceSlug) && p !== cover);
  return (cover ? [cover, ...others] : others).slice(0, max);
}

export function photo(slug: string): GalleryPhoto {
  const p = gallery.find((g) => g.slug === slug);
  if (!p) throw new Error(`Photo inconnue : ${slug}`);
  return p;
}
