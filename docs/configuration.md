# Configuration — variables d’environnement

Toutes les valeurs se règlent **sans modifier le code** :

- en local : fichier `.env` (copie de `.env.example`, jamais commité) ;
- en production : Vercel › Project › Settings › **Environment Variables**, puis **Redeploy**.

> Les variables `PUBLIC_*` sont intégrées dans les pages au moment de la compilation : après les avoir modifiées,
> il faut redéployer. Les autres sont des **secrets serveur** : elles ne sont jamais envoyées au navigateur.

## Variables publiques

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `SITE_URL` | Oui (prod) | URL définitive avec `https://`, sans `/` final. Sert aux URL canoniques, au sitemap, à Open Graph. |
| `PUBLIC_PHONE` | Recommandé | Numéro affiché, ex. `+237 6XX XX XX XX`. Vide = bouton « Appeler » masqué. |
| `PUBLIC_WHATSAPP_NUMBER` | Recommandé | Format international, chiffres seuls : `2376XXXXXXXX`. Vide = déduit de `PUBLIC_PHONE`. Si aucun numéro : tous les boutons WhatsApp sont masqués. |
| `PUBLIC_EMAIL` | Recommandé | Adresse professionnelle affichée. |
| `PUBLIC_HOURS` | Non | Horaires, texte libre (« Lun–Sam, 8h–18h »). Vide = non affichés. |
| `PUBLIC_SOCIAL_LINKS` | Non | URL des profils publics séparées par des virgules (ajoutées aux données structurées `sameAs`). |
| `PUBLIC_GA_ID` | Non | Identifiant Google Analytics 4 (`G-XXXX`). Vide = aucun outil de mesure, aucun bandeau cookies. |
| `PUBLIC_GOOGLE_CLIENT_ID` | Non | Identifiant client OAuth Google pour le bouton « S’abonner avec Google » (voir ci-dessous). Vide = abonnement par e-mail uniquement. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Non | Jeton « balise HTML » de Google Search Console (si la vérification DNS n’est pas utilisée). |

## Secrets serveur

| Variable | Obligatoire | Description |
| --- | --- | --- |
| `DATABASE_URL` | **Oui** | Chaîne de connexion PostgreSQL. Supabase : *Transaction pooler*, port **6543**. Sans elle, le formulaire répond « problème technique » (aucune fausse confirmation). |
| `SESSION_SECRET` | Oui (admin) | ≥ 32 caractères aléatoires. Le changer déconnecte toutes les sessions. |
| `ADMIN_EMAIL` | Oui (admin) | Identifiant de connexion à `/admin`. |
| `ADMIN_PASSWORD_HASH` | Oui (admin) | Généré par `npm run admin:hash` (format `scrypt:…`). Le mot de passe en clair n’est stocké nulle part. |
| `IP_HASH_SALT` | Recommandé | Chaîne aléatoire servant à rendre les empreintes IP non réversibles. |
| `RESEND_API_KEY` | Recommandé | Clé API [Resend](https://resend.com) pour les notifications des nouvelles demandes. |
| `NOTIFY_EMAIL_TO` | Avec Resend | Destinataire(s), séparés par des virgules. |
| `NOTIFY_EMAIL_FROM` | Avec Resend | Expéditeur sur un **domaine vérifié** chez Resend, ex. `Geometre Topo <notifications@votre-domaine.cm>`. |

## Changer le mot de passe administrateur

```bash
npm run admin:hash
```
Copier la ligne `ADMIN_PASSWORD_HASH=…` dans Vercel, puis redéployer.

## Vérification

`npm run build` affiche la liste des variables manquantes avant chaque compilation.

## Activer « S’abonner avec Google »

1. https://console.cloud.google.com › créer un projet (ex. « Geometre Topo »).
2. *API et services › Écran de consentement OAuth* : type **Externe**, nom « Géomètre Topo », e-mail d’assistance,
   lien vers `https://geometre-topo.vercel.app/confidentialite`. Publier l’application.
3. *API et services › Identifiants › Créer des identifiants › ID client OAuth* : type **Application Web**,
   origines JavaScript autorisées : `https://geometre-topo.vercel.app` (et le futur domaine personnalisé).
4. Copier l’**ID client** (se termine par `.apps.googleusercontent.com`) dans `PUBLIC_GOOGLE_CLIENT_ID`, puis redéployer.

Le serveur vérifie chaque connexion auprès de Google avant d’enregistrer l’abonné. Les abonnés sont consultables
dans l’administration (`/admin/abonnes`) et exportables avec leur lien de désabonnement personnel.
