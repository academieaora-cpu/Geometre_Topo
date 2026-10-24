# Audit initial, architecture et stratégie

Synthèse des cinq expertises (UX conversion, UX mobile, confiance/parcours client, SEO local, full-stack/DevOps).

## 1. Décisions techniques

| Besoin | Décision | Raison |
| --- | --- | --- |
| Pages publiques | **Astro, génération statique** | HTML pur servi par CDN : très rapide sur mobile et connexions lentes, idéal pour l’indexation, aucune mise en veille. |
| Formulaires, admin | Fonctions serverless (`prerender = false`) | Seules les opérations nécessitant secrets et base tournent côté serveur. |
| Base de prospects | PostgreSQL via le pilote `postgres` | Compatible Supabase, Neon, ou tout PostgreSQL ; requêtes paramétrées. |
| Authentification admin | Compte unique, mot de passe haché **scrypt**, cookie de session signé HMAC (`HttpOnly`, `Secure`, `SameSite=Strict`, 8 h) | Sobre, sans dépendance externe ; suffisant pour un professionnel indépendant. |
| Notifications | API Resend (facultative) | Simple, fiable ; l’échec d’envoi n’empêche jamais l’enregistrement. |
| Pièces jointes | **Non activées** dans cette version | Évite de stocker des documents fonciers sensibles dès le premier contact ; les documents s’échangent ensuite par WhatsApp/e-mail. Ajout possible (stockage privé Supabase) si nécessaire. |
| Mesure d’audience | GA4 **facultatif**, chargé uniquement après consentement | Pas de cookie sans accord ; aucun champ de formulaire transmis. |
| Polices | Polices système | Zéro téléchargement, affichage immédiat. |
| Images | WebP en 3 largeurs + `srcset`, chargement différé, EXIF retiré | Poids réduit, pas de fuite de géolocalisation. |

## 2. Arborescence et URL

```
/                                   Accueil
/services                           Toutes les prestations
/services/leve-topographique
/services/bornage-recherche-de-bornes
/services/morcellement-de-terrain
/services/travaux-preparatoires-dossier-foncier
/services/plan-topographique
/services/implantation-batiment
/services/nivellement-altimetrie
/services/topographie-btp
/services/lotissement
/services/conseil-terrain
/realisations                       Galerie filtrable (+ portfolio quand des projets sont validés)
/conseils                           Blog
/conseils/<article>                 5 articles
/a-propos                           Olou’ou Alain Stéphane
/devis                              Formulaire complet de qualification
/contact                            Coordonnées + formulaire court
/confidentialite                    Politique de confidentialité et cookies
/mentions-legales
/demande-envoyee, /demande-non-envoyee   Retours sans JavaScript (noindex)
/admin, /admin/connexion, /admin/prospects/<id>   Espace privé (noindex, bloqué dans robots.txt)
/api/leads  /api/health  /api/admin/*              API
/sitemap-index.xml  /robots.txt
```

## 3. Parcours du visiteur jusqu’au prospect

```
Google (« bornage terrain Yaoundé »)
   └─> Page de service : problème → situations → étapes → limites → photos → FAQ
          ├─> « Écrire sur WhatsApp » (message prérempli avec le service)   → clic mesuré, PAS compté comme prospect
          ├─> « Appeler »                                                     → clic mesuré
          └─> Formulaire en bas de page (service présélectionné)
                 1. validation immédiate dans le navigateur (messages clairs, focus sur l’erreur)
                 2. envoi → validation serveur, antispam (champ piège + délai minimal), limite 5 demandes/h/IP
                 3. enregistrement en base (transaction) + référence GT-AAMMJJ-XXXXX
                 4. notification e-mail (statut tracé)
                 5. confirmation affichée UNIQUEMENT si l’enregistrement a réussi
                 6. bouton « Continuer sur WhatsApp » (référence + service + localité, rien de sensible)
                 En cas d’échec : message explicite, saisie conservée, bouton de renvoi.
   └─> Admin : Nouveau prospect → À contacter → … → Prestation confirmée / Non converti / Archivé
```

Le bouton WhatsApp flottant est présent sur toutes les pages publiques (sauf `/devis` pour ne pas distraire).

## 4. Base de données (`db/schema.sql`)

- **leads** : identifiant UUID, référence lisible, nom, téléphone, e-mail, contact préféré, service, localité,
  quartier, superficie, situation, description, délai, documents, source, page d’origine (chemin sans paramètres),
  référent (domaine seul), UTM, statut (10 valeurs), consentements + date, empreinte IP salée, statut de notification,
  dates de création / mise à jour / anonymisation.
- **lead_events** : historique (création, changements de statut, notes, notifications, anonymisation), auteur, date.
- **login_attempts** : tentatives de connexion (blocage : 5 échecs/15 min par IP, 30 au total), purgées après 7 jours.
- RLS activé sans politique (aucun accès via les clés publiques Supabase).

## 5. Stratégie SEO initiale

**Technique (en place)** : titre et méta-description uniques par page, un seul H1, hiérarchie H2/H3, URL courtes et
stables sans `/` final, canonique sur chaque page indexable, `noindex` sur admin/confirmations, sitemap XML filtré,
robots.txt, 404 utile, Open Graph + image 1200×630, JSON-LD `ProfessionalService` (+ `Person` fondateur),
`Service` par prestation, `Article` pour les conseils, `BreadcrumbList`. Aucun avis, note, prix ni adresse déclarés.

**Mots-clés → pages cibles**

| Intention | Page cible |
| --- | --- |
| géomètre topographe Yaoundé, géomètre à Yaoundé, service topographique Yaoundé | Accueil |
| levé topographique Yaoundé, levé topographique pour construction | /services/leve-topographique |
| bornage de terrain Yaoundé, recherche de bornes, terrain sans bornes, vérification des limites | /services/bornage-recherche-de-bornes + article « bornes introuvables » |
| plan topographique terrain, plan de terrain | /services/plan-topographique |
| morcellement de terrain Yaoundé | /services/morcellement-de-terrain |
| lotissement terrain | /services/lotissement |
| plan de terrain pour dossier foncier, préparer un dossier foncier | /services/travaux-preparatoires-dossier-foncier |
| implantation bâtiment Yaoundé, implantation topographique | /services/implantation-batiment |
| nivellement terrain, calcul de pente, contrôle altimétrique | /services/nivellement-altimetrie |
| topographie chantier BTP, plan topographique projet immobilier | /services/topographie-btp |
| prix levé topographique Yaoundé, devis géomètre topographe | /devis + FAQ prix + article « préparer sa demande » |
| comment vérifier les limites d’un terrain, géomètre pour terrain à vendre | article « vérifier avant achat » + /services/conseil-terrain |
| quel professionnel consulter avant de construire | article « rôle du géomètre dans la construction » |

Ce sont des hypothèses : les prioriser ensuite avec les **requêtes réelles** de Search Console. « Cabinet de
géomètre » n’est **pas** utilisé tant que le statut réel de l’activité n’est pas confirmé. Aucune page géographique
artificielle n’a été créée ; en créer seulement pour des localités réellement desservies, avec du contenu propre.

## 6. Hébergement et disponibilité

Voir [deploiement.md](deploiement.md) : pages statiques sur CDN (pas de veille), fonctions à la demande, base managée
(attention aux pauses de l’offre gratuite Supabase), UptimeRobot sur l’accueil et `/api/health`, alertes e-mail.

## 7. Informations et ressources à fournir par le propriétaire

**Indispensables avant la mise en production**
1. Numéro de téléphone professionnel et numéro WhatsApp (confirmer qu’ils sont identiques ou non).
2. Adresse e-mail professionnelle.
3. Confirmation de la plateforme « VSL » (Vercel ?) et de l’offre souscrite.
4. Nom de domaine (à acheter ou existant).
5. Compte Supabase (ou Neon) et compte Resend.
6. Identifiant et mot de passe administrateur souhaités.
7. **Validation de la liste des prestations** réellement proposées (notamment bornage, lotissement, dossiers fonciers :
   le cadre d’intervention exact dépend du statut/agrément du professionnel).

**Pour renforcer la confiance**
8. Formation, diplômes, établissements, années (uniquement vérifiables).
9. Statut juridique, RCCM, NIU, inscription éventuelle à l’Ordre des géomètres.
10. Logiciels utilisés (ex. AutoCAD/Covadis, QGIS…), marques et modèles d’instruments si souhaité.
11. Horaires de disponibilité.
12. Davantage de photos : station totale en station, nivellement, échanges avec clients (avec accord), plans anonymisés.
13. Projets réalisés publiables (besoin, travail, résultat, localité divulgable) et témoignages réels écrits par les clients.
14. Profils publics (Facebook, LinkedIn…) pour la cohérence des informations.

**Remarque sur le logo** : le visuel fourni écrit « Géometre » (accent grave manquant sur le « e » de « mètre »).
Le site écrit « Géomètre » dans tous les textes ; prévoir une correction du fichier logo.
