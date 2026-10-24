/**
 * Photographies authentiques fournies par Géomètre Topo.
 *
 * Pour ajouter une photo :
 *  1. déposer le fichier (JPG) dans photos/originals/ avec un nom explicite ;
 *  2. lancer `npm run images` (génère les versions WebP et met à jour images.json) ;
 *  3. ajouter une entrée ci-dessous (slug = nom du fichier sans extension).
 * Ne publier ni coordonnées GNSS, ni nom de client, ni numéro de titre foncier.
 */

export type GalleryCategory = 'bornes' | 'gnss' | 'implantation' | 'portrait';

export const galleryCategories: Record<GalleryCategory, string> = {
  bornes: 'Bornes et limites',
  gnss: 'Relevés GNSS',
  implantation: 'Implantation et chantier',
  portrait: 'Le géomètre',
};

export interface GalleryPhoto {
  slug: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** Services auxquels la photo peut illustrer (slugs de src/data/services.ts). */
  services: string[];
}

export const gallery: GalleryPhoto[] = [
  {
    slug: 'releve-gnss-borne',
    alt: 'Contrôleur de terrain fixé sur la canne d’un récepteur GNSS, à côté d’une borne en béton fraîchement posée',
    caption: 'Relevé d’une borne au récepteur GNSS, contrôleur de terrain en main.',
    category: 'gnss',
    services: ['leve-topographique', 'bornage-recherche-de-bornes', 'plan-topographique', 'travaux-preparatoires-dossier-foncier'],
  },
  {
    slug: 'pose-borne-beton',
    alt: 'Borne en béton mise en place dans un trou creusé en terre rouge, entourée d’une pelle, d’une barre à mine et d’une machette',
    caption: 'Mise en place d’une borne en béton sur une limite de terrain.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'morcellement-de-terrain', 'lotissement'],
  },
  {
    slug: 'jalons-borne-existante',
    alt: 'Deux jalons rouges et blancs et une canne de mesure posés près d’une borne existante dans l’herbe',
    caption: 'Repérage d’une borne existante avec jalons et canne de mesure.',
    category: 'bornes',
    services: ['bornage-recherche-de-bornes', 'conseil-terrain', 'travaux-preparatoires-dossier-foncier'],
  },
  {
    slug: 'recepteur-gnss-trepied',
    alt: 'Récepteur GNSS monté sur une canne maintenue par un bipied, devant un mur de clôture en béton',
    caption: 'Récepteur GNSS stationné en milieu urbain, le long d’une clôture.',
    category: 'gnss',
    services: ['leve-topographique', 'plan-topographique', 'topographie-btp', 'nivellement-altimetrie'],
  },
  {
    slug: 'implantation-prisme-mur',
    alt: 'Opérateur tenant une canne équipée d’un prisme de station totale au pied d’un mur en parpaings',
    caption: 'Mesures au prisme de station totale au pied d’un bâtiment en construction.',
    category: 'implantation',
    services: ['implantation-batiment', 'topographie-btp', 'nivellement-altimetrie'],
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
    services: ['bornage-recherche-de-bornes', 'morcellement-de-terrain'],
  },
  {
    slug: 'portrait-alain-stephane-olouou',
    alt: 'Portrait d’Olou’ou Alain Stéphane, géomètre topographe, en chemise, cravate et gilet de sécurité',
    caption: 'Olou’ou Alain Stéphane, géomètre topographe.',
    category: 'portrait',
    services: [],
  },
];

export function photosForService(serviceSlug: string, max = 3): GalleryPhoto[] {
  return gallery.filter((p) => p.services.includes(serviceSlug)).slice(0, max);
}

export function photo(slug: string): GalleryPhoto {
  const p = gallery.find((g) => g.slug === slug);
  if (!p) throw new Error(`Photo inconnue : ${slug}`);
  return p;
}
