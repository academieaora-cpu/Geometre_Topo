/**
 * Prestations de Géomètre Topo.
 *
 * Chaque entrée génère une page /services/<slug>. Pour retirer une prestation
 * qui n'est pas (ou plus) proposée, mettre `active: false` : la page, les liens
 * et l'option du formulaire disparaissent au prochain déploiement.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  active: boolean;
  /** Titre court (menus, cartes, liste du formulaire). */
  name: string;
  /** Titre H1 de la page. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Une phrase pour les cartes de services. */
  summary: string;
  /** Icône (nom de symbole dans Icon.astro). */
  icon: string;
  /** Le problème du client, en langage simple. */
  problem: string;
  situations: string[];
  steps: { title: string; text: string }[];
  documents: string[];
  limits: string[];
  faq: Faq[];
  /** Message WhatsApp prérempli. */
  whatsapp: string;
}

export const services: Service[] = [
  {
    slug: 'leve-topographique',
    active: true,
    name: 'Levé topographique',
    title: 'Levé topographique à Yaoundé et environs',
    metaTitle: 'Levé topographique à Yaoundé | Géomètre Topo',
    metaDescription:
      'Levé topographique de terrain à Yaoundé : relevé des limites, des altitudes et des constructions existantes pour préparer un achat, un projet ou une construction.',
    summary: 'Mesurer le terrain tel qu’il est : limites, reliefs, constructions et éléments existants.',
    icon: 'survey',
    problem:
      'Avant de construire, d’acheter ou d’aménager, vous avez besoin de savoir précisément comment se présente votre terrain : sa forme, ses dimensions, ses pentes, les constructions, arbres, voies et réseaux visibles. Sans ces informations, l’architecte, l’entrepreneur ou vous-même travaillez sur des suppositions.',
    situations: [
      'Vous préparez un projet de construction et votre architecte demande un plan du terrain.',
      'Vous voulez connaître la superficie réelle et la forme exacte de votre parcelle.',
      'Votre terrain est en pente et vous devez anticiper les terrassements.',
      'Vous souhaitez un état des lieux précis avant un achat, une vente ou un partage.',
    ],
    steps: [
      { title: 'Échange sur votre besoin', text: 'Vous décrivez le terrain, son accès et l’usage prévu du plan. Nous définissons ensemble ce qui doit être relevé.' },
      { title: 'Descente sur le terrain', text: 'Mesure des points caractéristiques au récepteur GNSS et/ou à la station totale : limites visibles, bornes, constructions, talus, voies.' },
      { title: 'Traitement des mesures', text: 'Calcul des points et vérification de la cohérence des mesures au bureau.' },
      { title: 'Remise du plan', text: 'Vous recevez le plan du terrain avec les explications nécessaires pour l’utiliser.' },
    ],
    documents: [
      'Les documents fonciers ou plans existants, si vous en avez (copie simple suffit pour un premier échange).',
      'La localisation du terrain et les indications d’accès.',
      'L’usage prévu du plan (construction, achat, étude…).',
    ],
    limits: [
      'Un levé décrit l’état du terrain au moment des mesures : il ne fixe pas à lui seul les limites juridiques de la propriété.',
      'Le contenu exact du plan (échelle, détails, altitudes) dépend de l’usage prévu et doit être convenu avant l’intervention.',
    ],
    faq: [
      { q: 'Quelle est la différence entre un levé topographique et un bornage ?', a: 'Le levé mesure et représente le terrain tel qu’il existe. Le bornage concerne la matérialisation des limites de propriété et s’inscrit dans un cadre réglementaire précis, avec les parties concernées. Les deux peuvent être complémentaires.' },
      { q: 'Combien de temps faut-il pour un levé ?', a: 'Cela dépend de la superficie, de la végétation, de l’accès et du niveau de détail demandé. Une estimation vous est donnée après l’échange sur votre besoin.' },
      { q: 'Combien coûte un levé topographique à Yaoundé ?', a: 'Le prix dépend de la taille du terrain, de sa localisation, de son accessibilité et des livrables attendus. Décrivez votre projet dans le formulaire pour recevoir un devis adapté.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, je souhaite un devis pour un levé topographique.',
  },
  {
    slug: 'bornage-recherche-de-bornes',
    active: true,
    name: 'Bornage et recherche de bornes',
    title: 'Bornage et recherche de bornes de terrain à Yaoundé',
    metaTitle: 'Bornage et recherche de bornes de terrain à Yaoundé | Géomètre Topo',
    metaDescription:
      'Bornes de terrain introuvables ou limites incertaines à Yaoundé ? Recherche de bornes existantes, vérification des limites et accompagnement aux opérations de bornage.',
    summary: 'Retrouver les bornes existantes et clarifier les limites de votre terrain.',
    icon: 'marker',
    problem:
      'Les bornes de votre terrain ont disparu sous la végétation, ont été déplacées, ou vous ne savez tout simplement pas où passent vos limites. C’est une source fréquente d’inquiétude, surtout avant de construire une clôture ou d’acheter.',
    situations: [
      'Vous ne retrouvez plus les bornes de votre terrain.',
      'Vous avez un doute sur l’emplacement d’une clôture ou d’une construction voisine.',
      'Vous voulez vérifier que les bornes correspondent aux documents avant un achat.',
      'Vous souhaitez faire matérialiser les limites de votre parcelle.',
    ],
    steps: [
      { title: 'Analyse des documents', text: 'Étude des plans et documents disponibles pour connaître la position théorique des bornes.' },
      { title: 'Recherche sur le terrain', text: 'Calcul des positions et recherche des bornes existantes à l’aide du récepteur GNSS ou de la station totale.' },
      { title: 'Constat et explications', text: 'Nous vous indiquons les bornes retrouvées, celles qui manquent et les écarts éventuels constatés.' },
      { title: 'Suite adaptée', text: 'Selon la situation : rapport de constat, pose ou remise en place de bornes dans le cadre prévu, ou orientation vers la procédure appropriée.' },
    ],
    documents: [
      'Le plan ou les documents fonciers qui mentionnent les bornes, si vous les avez.',
      'Les coordonnées ou numéros de bornes figurant sur ces documents.',
      'Toute information sur l’historique du terrain (ventes, partages, travaux voisins).',
    ],
    limits: [
      'La recherche de bornes, le levé et le bornage sont des opérations différentes : la nature exacte de l’intervention dépend de la situation du terrain, des documents disponibles et du cadre réglementaire applicable.',
      'Certaines opérations de bornage nécessitent la présence ou l’accord des propriétaires voisins et l’intervention des services compétents.',
      'Un géomètre ne tranche pas un litige foncier : il fournit des mesures et des constats techniques qui peuvent éclairer les parties.',
    ],
    faq: [
      { q: 'Mes bornes sont introuvables, que faire ?', a: 'Rassemblez les documents en votre possession et décrivez la situation. Les positions théoriques peuvent souvent être calculées à partir des plans, puis recherchées sur place.' },
      { q: 'Puis-je déplacer ou reposer une borne moi-même ?', a: 'Non, c’est fortement déconseillé : une borne déplacée sans procédure peut créer un conflit et fragiliser votre dossier. Faites appel à un professionnel.' },
      { q: 'Les voisins doivent-ils être présents ?', a: 'Pour une simple recherche de bornes, pas toujours. Pour une opération de bornage, leur présence ou leur convocation est en général requise. Nous vous expliquons ce qui s’applique à votre cas.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, je cherche les bornes de mon terrain / je souhaite un bornage.',
  },
  {
    slug: 'morcellement-de-terrain',
    active: true,
    name: 'Morcellement de terrain',
    title: 'Morcellement de terrain à Yaoundé',
    metaTitle: 'Morcellement de terrain à Yaoundé : diviser votre parcelle | Géomètre Topo',
    metaDescription:
      'Accompagnement technique pour diviser un terrain en plusieurs parcelles à Yaoundé : levé, proposition de découpage, implantation des nouvelles limites.',
    summary: 'Diviser un terrain en plusieurs parcelles avec un découpage précis et réalisable.',
    icon: 'split',
    problem:
      'Vous souhaitez vendre une partie de votre terrain, partager une propriété familiale ou créer plusieurs lots. Un découpage mal préparé peut produire des parcelles inaccessibles, des superficies erronées ou des contestations.',
    situations: [
      'Vente d’une partie de votre terrain.',
      'Partage d’un terrain familial entre héritiers.',
      'Création de plusieurs parcelles pour un projet immobilier.',
    ],
    steps: [
      { title: 'Étude du projet', text: 'Nombre de parcelles, superficies souhaitées, accès, contraintes du terrain.' },
      { title: 'Levé du terrain', text: 'Mesure du terrain mère et de ses limites existantes.' },
      { title: 'Proposition de découpage', text: 'Plan de morcellement avec superficies et accès, ajusté avec vous.' },
      { title: 'Implantation', text: 'Matérialisation des nouvelles limites sur le terrain, une fois le découpage validé et les formalités engagées.' },
    ],
    documents: [
      'Les documents fonciers du terrain mère.',
      'Le nombre de parcelles et les superficies souhaitées.',
      'Les contraintes connues : accès, servitudes, constructions existantes.',
    ],
    limits: [
      'Le morcellement d’un terrain titré est soumis à des autorisations et formalités administratives ; le géomètre en assure la partie technique mais ne remplace pas les services compétents.',
      'Les règles d’urbanisme (accès, superficie minimale…) peuvent limiter le découpage envisagé.',
    ],
    faq: [
      { q: 'Combien de parcelles puis-je créer ?', a: 'Cela dépend de la superficie, de la forme du terrain, des accès et des règles applicables. Le levé et l’étude du projet permettent de proposer un découpage réaliste.' },
      { q: 'Le morcellement me donne-t-il automatiquement un titre pour chaque parcelle ?', a: 'Non. Les travaux topographiques sont une étape ; l’obtention de documents fonciers pour chaque parcelle relève de procédures administratives distinctes.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, j’ai un projet de morcellement de terrain.',
  },
  {
    slug: 'dossier-technique-immatriculation',
    active: true,
    name: 'Dossier technique et immatriculation',
    title: 'Dossier technique pour l’immatriculation de votre terrain à Yaoundé',
    metaTitle: 'Dossier technique et immatriculation de terrain à Yaoundé | Géomètre Topo',
    metaDescription:
      'Dossier technique pour l’immatriculation d’un terrain à Yaoundé : levé, plan, bornes et coordonnées établis par un géomètre topographe. Demandez votre devis.',
    summary: 'Le levé, le plan et les coordonnées des bornes qui composent le dossier technique d’une immatriculation.',
    icon: 'file',
    problem:
      'Vous voulez faire immatriculer votre terrain (obtenir un titre foncier) ou régulariser une parcelle, et l’on vous demande un dossier technique : plan du terrain, bornes, coordonnées, superficie. Il est difficile de savoir quoi préparer et dans quel ordre.',
    situations: [
      'Constitution du dossier technique d’une demande d’immatriculation (titre foncier).',
      'Besoin d’un plan de terrain avec bornes, coordonnées et superficie pour une procédure foncière.',
      'Morcellement ou mutation nécessitant des documents techniques à jour.',
      'Mise à jour de documents techniques anciens, incomplets ou contestés.',
    ],
    steps: [
      { title: 'Point sur votre procédure', text: 'Vous nous indiquez la démarche engagée (immatriculation, morcellement, mutation…) et les pièces demandées.' },
      { title: 'Levé et bornage du terrain', text: 'Mesure du périmètre au récepteur GNSS ou à la station totale, relevé ou pose des bornes.' },
      { title: 'Établissement du dossier technique', text: 'Plan à l’échelle, tableau des coordonnées des bornes, superficie et plan de situation, selon ce qui est attendu pour votre démarche.' },
      { title: 'Remise et explications', text: 'Nous vous remettons le dossier technique et vous expliquons la suite de la procédure côté technique.' },
    ],
    documents: [
      'Les pièces déjà en votre possession (attestations, plans, actes de vente).',
      'La liste des documents qui vous ont été demandés, si vous l’avez.',
      'Les coordonnées des propriétaires voisins, utiles lors du bornage.',
    ],
    limits: [
      'Les documents requis et les intervenants compétents dépendent de la procédure engagée.',
      'Le géomètre réalise les travaux techniques ; l’instruction du dossier et la délivrance du titre foncier relèvent de l’administration.',
      'Aucun délai d’obtention d’un titre foncier ne peut être garanti par le géomètre.',
    ],
    faq: [
      { q: 'Qu’est-ce que le dossier technique d’une immatriculation ?', a: 'C’est l’ensemble des pièces topographiques qui décrivent le terrain : plan à l’échelle, bornes et leurs coordonnées, superficie, plan de situation. Il accompagne la demande d’immatriculation déposée auprès de l’administration.' },
      { q: 'Pouvez-vous m’obtenir un titre foncier ?', a: 'Nous réalisons le dossier technique et les travaux topographiques qui contribuent à la procédure. La délivrance d’un titre foncier relève de l’administration ; nous ne maîtrisons ni l’issue ni les délais.' },
      { q: 'Quels documents dois-je préparer ?', a: 'Cela dépend de votre procédure. Envoyez-nous la liste des pièces demandées ; nous vous indiquons celles qui relèvent de travaux topographiques.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, j’ai besoin d’un dossier technique pour l’immatriculation de mon terrain.',
  },
  {
    slug: 'plan-topographique',
    active: true,
    name: 'Plan topographique et plan de terrain',
    title: 'Plan topographique et plan de terrain à Yaoundé',
    metaTitle: 'Plan topographique de terrain à Yaoundé | Géomètre Topo',
    metaDescription:
      'Plan topographique et plan de terrain à Yaoundé : superficie, limites, courbes de niveau et éléments existants, pour comprendre et préparer votre projet.',
    summary: 'Un plan lisible de votre terrain pour comprendre, décider et préparer vos travaux.',
    icon: 'map',
    problem:
      'Un plan fiable est la base de nombreuses décisions : placer une maison, vérifier une superficie, estimer des terrassements ou discuter avec un acquéreur. Un croquis approximatif ne suffit pas.',
    situations: [
      'Votre architecte ou votre bureau d’études a besoin d’un plan topographique.',
      'Vous voulez connaître la superficie et la forme exactes de votre terrain.',
      'Vous devez fournir un plan de situation ou de terrain pour une démarche.',
    ],
    steps: [
      { title: 'Définition du contenu', text: 'Échelle, niveau de détail, altitudes et courbes de niveau selon l’usage du plan.' },
      { title: 'Mesures sur le terrain', text: 'Levé des limites, bornes, constructions, voies et du relief.' },
      { title: 'Dessin du plan', text: 'Report des mesures, calcul des superficies, mise en page.' },
      { title: 'Livraison', text: 'Remise du plan dans le format convenu (papier et/ou numérique).' },
    ],
    documents: [
      'Les plans ou documents existants, si vous en avez.',
      'L’usage prévu du plan et, le cas échéant, les exigences de votre architecte.',
    ],
    limits: [
      'Un plan topographique représente l’état du terrain à la date du levé.',
      'Le plan ne vaut pas, à lui seul, reconnaissance juridique des limites de propriété.',
    ],
    faq: [
      { q: 'Dans quel format recevrai-je le plan ?', a: 'Le format est convenu à l’avance selon l’usage : document imprimé, PDF et/ou fichier exploitable par votre architecte.' },
      { q: 'Le plan indique-t-il les pentes ?', a: 'Oui si l’altimétrie est demandée : altitudes de points, courbes de niveau ou profils selon le besoin.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, j’ai besoin d’un plan topographique de mon terrain.',
  },
  {
    slug: 'implantation-batiment',
    active: true,
    name: 'Implantation de bâtiments',
    title: 'Implantation de bâtiments et d’ouvrages à Yaoundé',
    metaTitle: 'Implantation de bâtiment à Yaoundé : implanter votre maison | Géomètre Topo',
    metaDescription:
      'Implantation topographique de bâtiments et d’ouvrages à Yaoundé : report sur le terrain des axes, angles et niveaux de votre plan avant le démarrage du chantier.',
    summary: 'Placer votre construction exactement là où le plan le prévoit.',
    icon: 'building',
    problem:
      'Une maison implantée de travers, trop près d’une limite ou au mauvais niveau coûte cher à corriger. L’implantation consiste à reporter sur le terrain les axes et repères du plan, avant de creuser les fondations.',
    situations: [
      'Démarrage d’un chantier de maison, d’immeuble ou de clôture.',
      'Besoin de vérifier qu’une construction respecte les distances aux limites.',
      'Implantation d’ouvrages (murs, voiries, réseaux) selon des plans validés.',
    ],
    steps: [
      { title: 'Réception des plans', text: 'Étude des plans d’exécution validés et des repères à implanter.' },
      { title: 'Calculs', text: 'Préparation des coordonnées des axes, angles et points à reporter.' },
      { title: 'Implantation sur le terrain', text: 'Report des points à la station totale ou au GNSS, matérialisation par piquets ou repères.' },
      { title: 'Contrôle', text: 'Vérification des distances et des diagonales, en présence de l’entrepreneur si possible.' },
    ],
    documents: [
      'Le plan de masse et les plans d’implantation validés.',
      'Les repères ou bornes de référence du terrain.',
      'Les coordonnées de l’entrepreneur ou du chef de chantier.',
    ],
    limits: [
      'L’implantation se fait conformément aux plans et instructions validés par le maître d’ouvrage ou son architecte.',
      'Les piquets posés doivent être protégés pendant les travaux ; un repère déplacé doit être contrôlé à nouveau.',
    ],
    faq: [
      { q: 'À quel moment faire l’implantation ?', a: 'Après le nettoyage du terrain et avant le terrassement des fondations, une fois les plans validés.' },
      { q: 'Pouvez-vous contrôler une implantation déjà faite ?', a: 'Oui, un contrôle permet de vérifier la position des fondations ou des murs par rapport au plan et aux limites.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, je souhaite faire implanter un bâtiment.',
  },
  {
    slug: 'nivellement-altimetrie',
    active: true,
    name: 'Nivellement et altimétrie',
    title: 'Nivellement, pentes et altimétrie à Yaoundé',
    metaTitle: 'Nivellement de terrain et calcul de pente à Yaoundé | Géomètre Topo',
    metaDescription:
      'Nivellement et mesures altimétriques à Yaoundé : altitudes, profils, dénivelés et pentes de terrain pour vos travaux de construction et d’assainissement.',
    summary: 'Connaître les altitudes, pentes et dénivelés pour éviter les mauvaises surprises.',
    icon: 'level',
    problem:
      'À Yaoundé, beaucoup de terrains sont en pente. Mal évaluer un dénivelé peut entraîner des terrassements imprévus, des problèmes d’écoulement des eaux ou des fondations inadaptées.',
    situations: [
      'Calcul de la pente d’un terrain avant construction.',
      'Profils en long et en travers pour une voie, un caniveau ou un mur.',
      'Contrôle des niveaux de fondations ou de dalles.',
    ],
    steps: [
      { title: 'Définition des besoins', text: 'Points, profils ou contrôles à réaliser et précision attendue.' },
      { title: 'Mesures altimétriques', text: 'Relevé des altitudes par rapport à un repère défini.' },
      { title: 'Calculs', text: 'Dénivelés, pentes, profils et cubatures si nécessaire.' },
      { title: 'Restitution', text: 'Profils, tableaux de valeurs ou plan coté, avec explications.' },
    ],
    documents: [
      'Les plans du projet, si disponibles.',
      'Le repère altimétrique à utiliser, s’il est imposé.',
    ],
    limits: [
      'Les altitudes sont rattachées au repère convenu ; le choix du repère doit être précisé avant les mesures.',
    ],
    faq: [
      { q: 'Pourquoi mesurer la pente de mon terrain ?', a: 'Pour choisir l’emplacement de la maison, prévoir les terrassements, l’écoulement des eaux et le type de fondations.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, j’ai besoin d’un nivellement / calcul de pente.',
  },
  {
    slug: 'topographie-btp',
    active: true,
    name: 'Topographie pour le BTP',
    title: 'Travaux topographiques pour le BTP à Yaoundé',
    metaTitle: 'Topographie de chantier BTP à Yaoundé | Géomètre Topo',
    metaDescription:
      'Levés, implantations et contrôles topographiques pour les entreprises du BTP, architectes et maîtres d’ouvrage à Yaoundé et environs.',
    summary: 'Levés, implantations et contrôles pour les entreprises et maîtres d’ouvrage.',
    icon: 'crane',
    problem:
      'Sur un chantier, les erreurs de position ou de niveau se répercutent sur toute la suite des travaux. Les entreprises et maîtres d’ouvrage ont besoin de mesures fiables, au bon moment.',
    situations: [
      'Levé de l’état initial avant travaux.',
      'Implantation d’ouvrages et contrôle en cours de chantier.',
      'Relevé de l’ouvrage réalisé en fin de travaux.',
    ],
    steps: [
      { title: 'Cadrage', text: 'Périmètre de la mission, planning du chantier et livrables attendus.' },
      { title: 'Interventions', text: 'Levés, implantations ou contrôles selon le planning convenu.' },
      { title: 'Restitution', text: 'Plans, fichiers de points ou rapports de contrôle.' },
    ],
    documents: [
      'Les plans d’exécution et le planning du chantier.',
      'Le contact du conducteur de travaux.',
    ],
    limits: [
      'Les missions sont définies selon les moyens et compétences disponibles ; les besoins spécifiques sont étudiés au cas par cas.',
    ],
    faq: [
      { q: 'Intervenez-vous sur des chantiers de plusieurs semaines ?', a: 'Oui, sous réserve de planification. Décrivez le chantier et le rythme d’intervention attendu dans votre demande.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, je souhaite échanger sur une mission topographique de chantier.',
  },
  {
    slug: 'lotissement',
    active: true,
    name: 'Lotissement',
    title: 'Travaux topographiques pour lotissement à Yaoundé',
    metaTitle: 'Topographie pour projet de lotissement à Yaoundé | Géomètre Topo',
    metaDescription:
      'Accompagnement topographique des projets de lotissement à Yaoundé : levé, plan de découpage des lots et des voies, implantation sur le terrain.',
    summary: 'Levés, découpage des lots et implantation pour les projets de lotissement.',
    icon: 'grid',
    problem:
      'Un lotissement réussi repose sur un plan cohérent : lots de superficies justes, voies praticables, accès pour chaque parcelle. Les erreurs de départ se paient lors des ventes.',
    situations: [
      'Étude d’un terrain pour un futur lotissement.',
      'Plan de découpage des lots et des voies de desserte.',
      'Implantation des lots et des voies sur le terrain.',
    ],
    steps: [
      { title: 'Levé du terrain', text: 'État initial avec relief, limites et éléments existants.' },
      { title: 'Étude du découpage', text: 'Proposition de lots et de voies, en lien avec vous et les autres intervenants.' },
      { title: 'Implantation', text: 'Matérialisation des lots et des voies une fois le projet validé.' },
    ],
    documents: [
      'Les documents fonciers du terrain.',
      'Vos objectifs : nombre et taille des lots, type de voirie.',
    ],
    limits: [
      'Un lotissement est soumis à des autorisations administratives. Le géomètre réalise la partie technique et ne remplace ni les autorités compétentes ni les autres professionnels chargés des autorisations.',
    ],
    faq: [
      { q: 'Pouvez-vous m’aider à obtenir l’autorisation de lotir ?', a: 'Nous produisons les éléments topographiques nécessaires au dossier. L’autorisation elle-même est délivrée par l’administration compétente.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, j’ai un projet de lotissement.',
  },
  {
    slug: 'conseil-terrain',
    active: true,
    name: 'Conseil technique sur un terrain',
    title: 'Conseil technique avant d’acheter ou de construire à Yaoundé',
    metaTitle: 'Vérifier un terrain avant achat à Yaoundé | Géomètre Topo',
    metaDescription:
      'Vous hésitez avant d’acheter un terrain ou de lancer des travaux à Yaoundé ? Expliquez votre situation à un géomètre topographe et recevez une orientation claire.',
    summary: 'Expliquez votre situation : nous vous orientons vers les vérifications utiles.',
    icon: 'chat',
    problem:
      'Vous ne savez pas par où commencer : faut-il un levé, une recherche de bornes, un plan ? Le terrain que l’on vous propose correspond-il à ce qui est annoncé ? Un premier échange permet d’y voir clair.',
    situations: [
      'Vous envisagez d’acheter un terrain et voulez vérifier ses limites et sa superficie.',
      'Vous avez hérité d’un terrain et ne savez pas quelles démarches techniques engager.',
      'Vous avez un doute sur une situation de limites avec un voisin.',
    ],
    steps: [
      { title: 'Décrivez votre situation', text: 'Par le formulaire ou WhatsApp, avec les documents dont vous disposez.' },
      { title: 'Premier échange', text: 'Nous identifions les vérifications techniques pertinentes.' },
      { title: 'Proposition', text: 'Si une intervention est utile, vous recevez une proposition claire.' },
    ],
    documents: [
      'Une description du terrain et de votre projet.',
      'Les documents remis par le vendeur ou en votre possession (copies).',
    ],
    limits: [
      'Ce conseil est technique (topographie, limites, mesures). Pour les questions juridiques, un notaire ou un professionnel du droit doit être consulté.',
    ],
    faq: [
      { q: 'Faut-il vraiment faire vérifier un terrain avant de l’acheter ?', a: 'C’est vivement recommandé : vérifier la superficie, les limites et la correspondance avec les documents évite bien des déconvenues après l’achat.' },
    ],
    whatsapp: 'Bonjour Géomètre Topo, j’ai besoin d’un conseil sur un terrain.',
  },
];

export const activeServices = services.filter((s) => s.active);

export function getService(slug: string): Service | undefined {
  return activeServices.find((s) => s.slug === slug);
}

/** Options du champ « Service recherché » du formulaire. */
export const serviceOptions = [
  ...activeServices.map((s) => ({ value: s.slug, label: s.name })),
  { value: 'autre', label: 'Autre / je ne sais pas encore' },
];
