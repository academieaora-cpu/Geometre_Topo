import type { APIRoute } from 'astro';

/** Pages privées ou techniques, fermées à tous les robots. */
export const PRIVATE_PATHS = ['/admin', '/api/', '/demande-envoyee', '/demande-non-envoyee', '/desabonnement'];

/**
 * Robots de recherche nommés explicitement (autorisés comme tous les autres).
 * Un robot qui trouve un groupe à son nom ne lit que ce groupe : les pages fermées y sont donc répétées.
 * - OAI-SearchBot : robot de la recherche de ChatGPT.
 */
export const NAMED_BOTS = ['OAI-SearchBot'];

function group(agent: string): string[] {
  return [`User-agent: ${agent}`, 'Allow: /', ...PRIVATE_PATHS.map((p) => `Disallow: ${p}`), ''];
}

export function robotsTxt(site: URL): string {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  return [...NAMED_BOTS.flatMap(group), ...group('*'), `Sitemap: ${sitemap}`, ''].join('\n');
}

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site!), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
