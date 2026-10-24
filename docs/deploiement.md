# Mise en ligne, domaine, disponibilité et surveillance

## 0. « VSL » : plateforme à confirmer

Le cahier des charges désigne l’hébergeur par « VSL ». Aucune plateforme connue ne porte exactement ce nom ;
l’hypothèse retenue est **Vercel** (un connecteur Vercel est disponible sur le compte du propriétaire). Le projet
utilise l’adaptateur officiel `@astrojs/vercel`. **Si « VSL » désigne autre chose** (Netlify, un VPS, un hébergeur
local…), seul l’adaptateur dans `astro.config.mjs` et ce document changent : le reste du code est identique.

### Points d’attention Vercel (à vérifier sur vercel.com/pricing au moment de la souscription)

- L’offre gratuite **Hobby est réservée à un usage personnel non commercial**. Un site d’entreprise doit en principe
  être hébergé sur l’offre **Pro** (payante, par membre et par mois).
- Les pages publiques sont des fichiers statiques servis par le CDN : **elles ne « s’endorment » jamais**.
- Les routes `/api` et `/admin` sont des fonctions serverless : elles démarrent à la demande (quelques centaines de
  millisecondes au premier appel), **sans suspension du service**. Aucun mécanisme de « réveil » n’est nécessaire.

## 1. Base de données

### Option A — Supabase (recommandée par le cahier des charges)

1. Créer un projet sur supabase.com (région la plus proche : Europe, ex. Francfort).
2. *Project Settings › Database › Connection string* : copier la chaîne **Transaction pooler** (port `6543`) → `DATABASE_URL`.
3. Appliquer le schéma depuis un poste disposant de Node.js :
   ```bash
   DATABASE_URL="postgres://…:6543/postgres" npm run db:migrate
   ```
   (ou copier le contenu de `db/schema.sql` dans *SQL Editor* et l’exécuter).
4. Le schéma active le RLS sans politique : les tables sont **inaccessibles via les clés publiques** Supabase.

> ⚠️ **Limite de l’offre gratuite Supabase** : un projet gratuit est **mis en pause après environ 7 jours sans
> activité** et doit alors être réactivé manuellement. Pour un site professionnel, prévoir l’offre **Pro** ou l’option B.
> Ne pas compter sur les requêtes de surveillance pour contourner cette règle.

### Option B — Neon (alternative à faible coût)

L’offre gratuite de Neon met la base en veille après quelques minutes d’inactivité mais **la réveille automatiquement**
à la connexion suivante (délai d’environ une seconde) : aucune intervention manuelle. Utiliser la chaîne « pooled ».

## 2. Déploiement sur Vercel

1. Vercel › *Add New › Project* › importer le dépôt GitHub `academieaora-cpu/Geometre_Topo`.
2. Framework : **Astro** (détecté). Commande : `npm run build`. Rien d’autre à régler.
3. Saisir les variables d’environnement ([configuration.md](configuration.md)) pour l’environnement *Production*
   (et *Preview* si besoin, idéalement avec une base de test séparée).
4. *Deploy*. Chaque `git push` sur la branche de production redéploie automatiquement.

## 3. Domaine personnalisé et HTTPS

1. Acheter le domaine (ex. `geometretopo.cm` ou `.com`) chez un registraire.
2. Vercel › *Settings › Domains* › ajouter `www.domaine` et `domaine`, puis créer chez le registraire les
   enregistrements DNS indiqués par Vercel. Rediriger la version sans `www` vers `www` (ou l’inverse).
3. Le certificat HTTPS est émis et renouvelé automatiquement par Vercel.
4. Mettre `SITE_URL` à jour avec le domaine définitif, puis redéployer (URL canoniques et sitemap).

## 4. Notifications e-mail (Resend)

1. Créer un compte resend.com, **vérifier le domaine** (enregistrements DNS SPF/DKIM).
2. Créer une clé API → `RESEND_API_KEY` ; régler `NOTIFY_EMAIL_TO` et `NOTIFY_EMAIL_FROM`.
3. Tester avec une vraie demande : l’historique du prospect dans `/admin` indique `Notification e-mail : sent`
   (ou `failed` / `disabled`). Une notification en échec **n’empêche jamais** l’enregistrement de la demande.

## 5. Surveillance de disponibilité (UptimeRobot)

Créer un compte gratuit sur https://uptimerobot.com, puis deux moniteurs :

| Moniteur | Type | URL | Intervalle | Ce qu’il vérifie |
| --- | --- | --- | --- | --- |
| Site public | HTTP(s) – *Keyword* « Géomètre Topo » | `https://www.domaine/` | 5 min | La page d’accueil est servie et complète |
| Prospects | HTTP(s) | `https://www.domaine/api/health` | 5 min | Fonctions serveur **et** base de données (200 = OK, 503 = base indisponible) |

- *Alert contacts* : e-mail (et SMS/app mobile si souhaité).
- `/api/health` ne renvoie que `{"status","database","time"}` : aucune donnée interne.
- La surveillance **détecte** les pannes ; elle ne garantit pas une disponibilité de 100 %.

### Bipeur intégré (GitHub Actions)

Le dépôt contient `.github/workflows/bipeur.yml` : toutes les 10 minutes, GitHub interroge la page d’accueil et
`/api/health`. Cela maintient les fonctions et la base sollicitées, et **en cas d’échec GitHub envoie un e-mail**.
Réglages : *Settings › Secrets and variables › Actions › Variables* → `SITE_URL` = URL du site ; vérifier dans
*Settings (profil) › Notifications › Actions* que les alertes d’échec sont activées. GitHub suspend les tâches
planifiées après 60 jours sans activité sur le dépôt : un simple commit les relance. UptimeRobot reste recommandé
en complément (surveillance indépendante de GitHub).

## 6. Google Search Console et référencement local

1. search.google.com/search-console › *Ajouter une propriété* › **Domaine** (vérification DNS, recommandée)
   ou *Préfixe d’URL* avec `PUBLIC_GOOGLE_SITE_VERIFICATION`.
2. *Sitemaps* › soumettre `sitemap-index.xml`.
3. *Inspection d’URL* › demander l’indexation de l’accueil et des pages de services.
4. Suivre chaque mois : pages indexées, requêtes, clics, impressions, erreurs.
5. **Google Business Profile** : si l’activité est éligible, créer la fiche avec exactement le même nom, téléphone et
   site. En l’absence d’adresse d’accueil du public, choisir l’option « zone desservie » (Yaoundé et environs) :
   ne jamais déclarer d’adresse fictive ni solliciter de faux avis.

## 7. Recette après mise en ligne (à cocher)

- [ ] Accueil et toutes les pages accessibles sur mobile (Android) et ordinateur
- [ ] Cadenas HTTPS valide sur `domaine` et `www.domaine`
- [ ] Bouton WhatsApp : ouvre la conversation avec le **bon numéro**
- [ ] Bouton Appeler : compose le bon numéro
- [ ] Envoi d’une demande test → référence affichée → visible dans `/admin` → e-mail reçu
- [ ] Demande test supprimée ensuite depuis `/admin`
- [ ] `/admin` inaccessible sans connexion ; 6 mauvais mots de passe → blocage temporaire
- [ ] `https://www.domaine/api/health` → `"status":"ok"`
- [ ] UptimeRobot : moniteurs verts, alerte de test reçue
- [ ] PageSpeed Insights (mobile) sur l’accueil et une page de service
- [ ] Sitemap soumis dans Search Console
- [ ] Comportement après 24 h sans visite : site et formulaire fonctionnent (vérifier la base si offre gratuite)
- [ ] Après un redéploiement : formulaire et admin fonctionnent
