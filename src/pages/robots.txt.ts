import type { APIRoute } from 'astro';

/**
 * robots.txt, écrit en clair pour être lisible directement dans le code.
 * Un robot qui trouve un groupe à son nom ne lit que celui-ci : les pages privées y sont donc répétées.
 */
export function robotsTxt(site: URL): string {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  return [
    // Robot de la recherche de ChatGPT : site public autorisé, pages privées fermées.
    'User-agent: OAI-SearchBot',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    'Disallow: /demande-envoyee',
    'Disallow: /demande-non-envoyee',
    'Disallow: /desabonnement',
    '',
    // Tous les autres robots (Google, Bing…).
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    'Disallow: /demande-envoyee',
    'Disallow: /demande-non-envoyee',
    'Disallow: /desabonnement',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');
}

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
