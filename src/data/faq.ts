import type { Faq } from './services.ts';
import { communesVoisines, yaoundeQuartiers } from '../config/site.ts';

export const homeFaq: Faq[] = [
  {
    q: 'Combien coûte l’intervention d’un géomètre topographe à Yaoundé ?',
    a: 'Le prix dépend de la prestation, de la superficie, de la localisation et de l’accessibilité du terrain, ainsi que des documents à produire. Décrivez votre besoin dans le formulaire : vous recevrez un devis adapté avant toute intervention.',
  },
  {
    q: 'Quelle est la différence entre un levé topographique et un bornage ?',
    a: 'Le levé mesure et représente le terrain tel qu’il est (limites visibles, relief, constructions). Le bornage concerne la matérialisation des limites de propriété et suit un cadre réglementaire, avec les parties concernées.',
  },
  {
    q: 'Dois-je faire vérifier un terrain avant de l’acheter ?',
    a: 'C’est fortement recommandé. Une vérification des limites, de la superficie et de la correspondance avec les documents fournis par le vendeur évite de nombreuses mauvaises surprises après l’achat.',
  },
  {
    q: 'Quels documents dois-je préparer ?',
    a: 'Pour un premier échange, une description du terrain et de votre projet suffit. Si vous avez des plans ou documents fonciers, mentionnez-le : nous vous dirons lesquels sont utiles pour l’intervention.',
  },
  {
    q: 'Pouvez-vous m’obtenir un titre foncier ?',
    a: 'Nous réalisons les travaux topographiques qui contribuent à un dossier foncier. La délivrance d’un titre foncier relève de l’administration ; aucun géomètre ne peut en garantir l’issue ni le délai.',
  },
  {
    q: 'Dans quels quartiers de Yaoundé intervenez-vous ?',
    a: `Dans tous les arrondissements de Yaoundé (Yaoundé I à VII) : ${yaoundeQuartiers.join(', ')} et les autres quartiers de la ville.`,
  },
  {
    q: 'Intervenez-vous en dehors de Yaoundé ?',
    a: `Notre zone principale est Yaoundé et ses environs. Dans les communes voisines (${communesVoisines.join(', ')}…) ou pour un terrain plus éloigné, indiquez sa localité : nous vous confirmons la possibilité d’intervention avant tout déplacement.`,
  },
];
