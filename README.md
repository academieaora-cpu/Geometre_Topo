# Géomètre Topo — site internet professionnel

Site de **Géomètre Topo** (Olou’ou Alain Stéphane, géomètre topographe, Yaoundé) : présentation des prestations,
photos de terrain, conseils, et **système complet de gestion des prospects** (formulaires, base de données,
espace d’administration, notifications, export CSV).

## En bref

| Élément | Choix |
| --- | --- |
| Framework | [Astro 7](https://astro.build) — pages publiques **statiques** (rapides, bien indexées) |
| Partie serveur | Routes `/api/*` et `/admin/*` en fonctions serverless (adaptateur Vercel) |
| Base de données | PostgreSQL (Supabase recommandé, Neon ou tout PostgreSQL 14+ possible) |
| Notifications | E-mail via l’API Resend (facultatif) |
| Hébergement | Vercel (hypothèse pour « VSL » — voir [docs/deploiement.md](docs/deploiement.md)) |
| Surveillance | UptimeRobot sur `/api/health` |

## Démarrer en local

```bash
npm install
cp .env.example .env           # puis compléter
npm run admin:hash             # génère ADMIN_PASSWORD_HASH et un SESSION_SECRET
npm run db:migrate             # crée les tables (DATABASE_URL requis)
npm run dev                    # http://localhost:4321
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérifie la configuration puis compile le site |
| `npm run check` | Vérification des types (Astro + TypeScript) |
| `npm test` | Tests automatisés (validation, sécurité des sessions, hachage) |
| `npm run db:migrate` | Applique `db/schema.sql` (idempotent) |
| `npm run admin:hash` | Hache le mot de passe administrateur |
| `npm run images` | Régénère les images WebP depuis `photos/originals/` (Python 3 + Pillow) |

## Arborescence

```
src/
  config/site.ts        Coordonnées, WhatsApp, navigation (configuration centrale)
  data/services.ts      Les 10 prestations (textes, étapes, limites, FAQ)
  data/gallery.ts       Photos authentiques (textes alternatifs, légendes, catégories)
  data/projects.ts      Portfolio de réalisations (vide tant que non validé)
  data/about.ts         Formation, équipements, logiciels (à compléter)
  data/legal.ts         Mentions légales (à compléter, rien d’inventé)
  content/conseils/     Articles du blog (Markdown)
  pages/                Pages du site, API (/api) et administration (/admin)
  server/               Validation, base de données, authentification, notifications
db/schema.sql           Schéma de la base des prospects
photos/originals/       Photos sources (EXIF retiré)
docs/                   Documentation complète
tests/                  Tests automatisés
```

## Documentation

- [Audit, architecture et stratégie](docs/audit-architecture.md)
- [Configuration (variables d’environnement)](docs/configuration.md)
- [Mise en ligne, domaine, surveillance](docs/deploiement.md)
- [Maintenance : modifier services, photos, articles, coordonnées ; sauvegardes](docs/maintenance.md)
- [Rapport de validation et éléments restant à configurer](docs/rapport-validation.md)
