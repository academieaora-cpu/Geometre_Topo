# Maintenance du site

Toutes les modifications se font dans le dépôt Git ; chaque `git push` sur la branche de production redéploie le site.

## Modifier les coordonnées

Téléphone, WhatsApp, e-mail, horaires : variables `PUBLIC_*` dans Vercel ([configuration.md](configuration.md)),
puis **Redeploy**. Aucun numéro n’est écrit en dur dans le code (`src/config/site.ts` les lit).

## Modifier un service

Fichier `src/data/services.ts` : chaque service contient son titre, sa méta-description SEO, le problème client, les
situations, les étapes, les documents à préparer, les limites, la FAQ et le message WhatsApp prérempli.

- **Retirer** un service non proposé : `active: false` (page, liens, sitemap et option du formulaire disparaissent).
- **Ajouter** un service : copier un bloc, choisir un `slug` unique (il devient l’URL `/services/slug`).
- Ne **jamais changer le slug** d’un service déjà indexé sans ajouter une redirection 301 dans `vercel.json` :
  ```json
  "redirects": [{ "source": "/services/ancien-slug", "destination": "/services/nouveau-slug", "permanent": true }]
  ```

## Ajouter des photos

1. Déposer la photo (JPG) dans `photos/originals/`, nom explicite en minuscules avec tirets
   (ex. `implantation-villa-2026.jpg`). Vérifier qu’elle ne montre ni personne non consentante, ni plan confidentiel,
   ni coordonnées, ni plaque d’immatriculation.
2. `npm run images` (Python 3 + Pillow) : génère les versions WebP et met à jour `src/data/images.json`.
   Les métadonnées EXIF (y compris la position GPS du téléphone) sont supprimées.
3. Ajouter l’entrée dans `src/data/gallery.ts` : `slug`, `alt` (description précise de l’image), `caption`,
   `category`, `services` liés.

## Ajouter une réalisation (portfolio)

`src/data/projects.ts` : un exemple commenté indique les champs. N’ajouter que des projets réels, anonymisés, avec
l’accord du client si nécessaire.

## Compléter « À propos » et les mentions légales

- `src/data/about.ts` : formation, logiciels (listes vides = rubriques masquées).
- `src/data/legal.ts` : statut juridique, RCCM, NIU, inscription professionnelle, adresse (vide = « en cours de mise à jour »).

## Publier un article de conseil

Créer `src/content/conseils/mon-article.md` :

```markdown
---
title: "Titre de l’article (question réelle des clients)"
metaTitle: "Titre court pour Google (≈ 60 caractères)"
description: "Résumé de 50 à 170 caractères, affiché dans Google."
publishedAt: 2026-11-15
image: releve-gnss-borne          # slug d’une photo de la galerie
services: ["leve-topographique"]  # l’article est proposé sur ces pages
ctaService: leve-topographique    # service présélectionné dans le formulaire
draft: false                      # true = non publié
---

Texte en Markdown (## pour les intertitres, - pour les listes).
```

Sujets prévus non encore rédigés (à écrire avec le géomètre, à partir de vraies questions de clients) :
pourquoi faire réaliser un plan topographique ; précautions avant d’acheter un terrain à Yaoundé ; comprendre les
altitudes et les pentes ; précautions avant un morcellement ; préparer une descente de terrain.

## Gérer les prospects

`https://votre-domaine/admin` : tableau de bord, recherche (nom, téléphone, e-mail, localité, référence), filtres
(statut, service, période), fiche détaillée avec boutons Appeler / WhatsApp / E-mail, changement de statut, notes
internes horodatées, export CSV (respecte les filtres), anonymisation et suppression.

**Politique de conservation** (annoncée dans la politique de confidentialité) : anonymiser ou supprimer les demandes
non abouties **3 ans** après le dernier échange. Utiliser le filtre de période puis « Anonymiser » sur chaque fiche.

## Sauvegardes et restauration

- **Supabase Pro / Neon** : sauvegardes automatiques quotidiennes et restauration à un instant donné depuis le tableau
  de bord du fournisseur (vérifier la durée de rétention de l’offre souscrite).
- **Sauvegarde manuelle mensuelle** recommandée (à conserver chiffrée, hors du dépôt Git) :
  ```bash
  pg_dump "$DATABASE_URL" --no-owner --format=custom -f sauvegarde-$(date +%F).dump
  ```
- **Restauration** dans une base vide :
  ```bash
  pg_restore --no-owner --dbname "$DATABASE_URL_NOUVELLE_BASE" sauvegarde-AAAA-MM-JJ.dump
  ```
  puis mettre à jour `DATABASE_URL` dans Vercel et redéployer.
- **Le code** est sauvegardé par Git/GitHub. Un déploiement défectueux se annule en un clic :
  Vercel › *Deployments* › déploiement précédent › *Promote to Production*.

## Mises à jour de sécurité

Tous les mois :
```bash
npm outdated
npm audit
npm update && npm run check && npm test && npm run build
```
Au 24/10/2026, `npm audit` signale des vulnérabilités dans des dépendances **de compilation** de l’adaptateur Vercel
(`path-to-regexp`, `zod` via `@vercel/routing-utils` / `@vercel/functions`), sans correctif non cassant disponible.
Elles ne sont pas exposées aux visiteurs ; surveiller les nouvelles versions de `@astrojs/vercel`.

## Procédures d’incident

| Symptôme | Action |
| --- | --- |
| Alerte UptimeRobot sur `/api/health` (503) | Base indisponible : vérifier le tableau de bord Supabase/Neon (projet en pause ? quota ?). Les visiteurs voient un message d’erreur et les liens WhatsApp/téléphone restent disponibles. |
| Alerte sur la page d’accueil | Vérifier vercel.com/status et le dernier déploiement ; revenir au déploiement précédent si besoin. |
| Plus de notifications e-mail | Fiche prospect › historique « Notification e-mail : failed » → vérifier la clé et le domaine Resend. Les demandes restent dans `/admin`. |
| Mot de passe admin perdu | `npm run admin:hash`, remplacer `ADMIN_PASSWORD_HASH`, redéployer. |
| Suspicion de fuite de session | Changer `SESSION_SECRET` et redéployer (toutes les sessions sont invalidées). |
