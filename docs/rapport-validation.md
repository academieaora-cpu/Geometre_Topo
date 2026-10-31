# Rapport de validation avant mise en production

Date : 24 octobre 2026 — version initiale du site.

## 1. Ce qui a été testé et fonctionne

Tests effectués en local avec une vraie base PostgreSQL 16, le serveur Astro et un navigateur Chromium
(profil mobile Pixel 5 et ordinateur 1366 px).

| Domaine | Vérification | Résultat |
| --- | --- | --- |
| Compilation | `npm run build`, `npm run check` (types) | ✅ 0 erreur, 0 avertissement |
| Tests automatisés | `npm test` : validation des champs, antispam, normalisation, export CSV, hachage du mot de passe, sessions signées, empreintes IP | ✅ 15/15 |
| Base de données | `npm run db:migrate` appliqué deux fois (idempotent) | ✅ |
| Formulaire (JS) | Envoi vide → 5 messages d’erreur ; envoi valide → référence + bouton « Continuer sur WhatsApp » ; service présélectionné via l’URL | ✅ |
| Formulaire (sans JS) | Envoi classique → redirection 303 vers `/demande-envoyee?ref=…` | ✅ |
| Validation serveur | Champs invalides → 422 détaillé ; service hors liste refusé | ✅ |
| Antispam | Champ piège rempli → refus sans enregistrement ; 6ᵉ demande en 1 h depuis la même IP → 429 | ✅ |
| CSRF | Requête depuis une autre origine → 403 (API publique et admin) | ✅ |
| Base indisponible | `/api/health` → 503 ; formulaire → 503 avec message explicite, **aucune fausse confirmation** | ✅ |
| Administration | Accès sans session → redirection / 401 ; connexion ; recherche ; filtre ; changement de statut ; note ; historique ; export CSV ; anonymisation ; déconnexion | ✅ |
| Force brute | 5 échecs → blocage 15 min, même avec le bon mot de passe | ✅ |
| Données personnelles | Chemin d’origine stocké sans paramètres d’URL ; IP jamais stockée en clair ; EXIF/GPS retirés des photos | ✅ |
| CSP | Politique stricte (empreintes des scripts) : aucun script bloqué, menu, filtres et formulaire fonctionnels | ✅ |
| Mobile | Aucun débordement horizontal sur 7 pages clés, mobile et ordinateur ; aucune erreur console | ✅ |
| SEO | Titres/descriptions uniques, canoniques, sitemap (24 URL, sans admin ni confirmations), robots.txt, JSON-LD | ✅ |
| Lighthouse mobile | Accueil 96 / 100 / 100 / 100 ; page service 100 / 100 / 100 / 100 ; devis 100 / 100 / 100 / 100 (perf / accessibilité / bonnes pratiques / SEO) | ✅ (serveur de test local, à refaire en production avec PageSpeed Insights) |

## 2. Éléments NON configurés (actions du propriétaire)

| Élément | État | Conséquence tant que non fait |
| --- | --- | --- |
| Téléphone / WhatsApp / e-mail | Non fournis | Boutons WhatsApp et Appeler **masqués** ; seul le formulaire est proposé |
| Plateforme « VSL » | Hypothèse Vercel, à confirmer | — |
| Déploiement en production | **Non effectué** | Site non accessible publiquement |
| Base de données de production | Créée : Supabase (offre gratuite, projet `geometre-topo`, us-east-1), reliée par `DATABASE_URL` | Offre gratuite : mise en veille après 7 jours sans requête, évitée par le bipeur qui interroge `/api/health` |
| Notifications e-mail (Resend) | Non configurées | Demandes visibles uniquement dans `/admin` |
| Compte administrateur | Non créé | `/admin` affiche « non configurée » |
| Domaine personnalisé + HTTPS | Non acheté | URL provisoire `*.vercel.app` |
| UptimeRobot | Non créé (procédure prête) | Pas d’alerte en cas de panne |
| Google Search Console / Business Profile | Propriété Search Console validée (balise HTML via `PUBLIC_GOOGLE_SITE_VERIFICATION`) ; fiche Business Profile créée par le client | Ne pas supprimer la variable de vérification |
| Google Analytics | Non activé (facultatif) | Aucune mesure d’audience (pas de bandeau cookies) |
| Formation, logiciels, RCCM, NIU, statut | Non fournis | Rubriques masquées / « en cours de mise à jour » |
| Portfolio de projets, témoignages | Aucun projet validé | Seule la galerie photo est affichée ; **aucun témoignage inventé** |
| Pièces jointes au formulaire | Non activées (choix volontaire) | Documents échangés ensuite par WhatsApp/e-mail |
| Liste des prestations | À valider | Les 10 services du cahier des charges sont publiés ; désactiver ceux non proposés |
| Textes juridiques | Rédigés de bonne foi, **à faire relire** | Notamment la conformité à la loi camerounaise sur les données personnelles |

## 3. Points de vigilance

- **Offres gratuites** : Vercel Hobby (usage non commercial) et Supabase Free (pause après inactivité) ne conviennent
  pas durablement à un site professionnel — voir [deploiement.md](deploiement.md).
- `npm audit` : vulnérabilités dans des dépendances de compilation de l’adaptateur Vercel, non exposées aux visiteurs.
- Le logo fourni écrit « Géometre » (accent manquant).
- Aucune promesse de positionnement Google, de délai d’obtention de titre foncier ou de disponibilité à 100 %.

## 4. Étapes suivantes recommandées

1. Fournir les coordonnées et valider la liste des services.
2. Créer la base (Supabase Pro ou Neon), le compte Resend, puis déployer sur Vercel ([deploiement.md](deploiement.md)).
3. Dérouler la recette de la section 7 de `deploiement.md`.
4. Configurer UptimeRobot et Search Console ; soumettre le sitemap.
5. Compléter À propos, mentions légales, et enrichir la galerie et les articles au fil des chantiers.
