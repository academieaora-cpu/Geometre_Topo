// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// URL publique définitive du site (domaine personnalisé). Sert aux URL canoniques,
// au sitemap et aux balises Open Graph. À modifier via la variable SITE_URL.
const SITE_URL = process.env.SITE_URL || 'https://geometre-topo.vercel.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  // Pages publiques générées en statique ; seules les routes /api et /admin
  // (export const prerender = false) s'exécutent côté serveur.
  output: 'static',
  adapter: vercel({ maxDuration: 15 }),
  security: {
    checkOrigin: true,
    // Politique de sécurité du contenu : Astro calcule les empreintes des scripts et styles du site.
    // Seuls Google Tag Manager (après consentement) et Google Identity Services (abonnement) sont autorisés en plus.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
        "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://accounts.google.com/gsi/",
        // Bouton « S'abonner avec Google » (Google Identity Services)
        "frame-src https://accounts.google.com/gsi/",
        "media-src 'self'",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'", 'https://www.googletagmanager.com', 'https://accounts.google.com/gsi/client'] },
      styleDirective: { resources: ["'self'", 'https://accounts.google.com/gsi/style'] },
    },
  },
  markdown: { syntaxHighlight: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(admin|api|404|demande-envoyee|demande-non-envoyee|desabonnement)(\/|$)/.test(new URL(page).pathname),
    }),
  ],
  env: {
    schema: {
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      POSTGRES_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SESSION_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      ADMIN_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      ADMIN_PASSWORD_HASH: envField.string({ context: 'server', access: 'secret', optional: true }),
      IP_HASH_SALT: envField.string({ context: 'server', access: 'secret', optional: true }),
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      NOTIFY_EMAIL_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      NOTIFY_EMAIL_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
