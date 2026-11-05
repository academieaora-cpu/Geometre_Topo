import type { APIRoute } from 'astro';
import { site } from '../config/site.ts';
import { recordClick } from '../server/clicks.ts';
import { isLinkPreview } from '../server/link-preview.ts';

export const prerender = false;

/** Le visiteur n'attend jamais le comptage plus longtemps que ce délai. */
const COUNT_TIMEOUT_MS = 1500;

/**
 * Lien court à donner aux clients après une mission : geometre-topo.vercel.app/avis ouvre
 * directement le formulaire d'avis de la fiche Google. Chaque ouverture par une personne est
 * comptée (canal « Lien d'avis » de l'administration), sans aucune donnée personnelle.
 * Un échec de comptage n'empêche jamais la redirection.
 */
export const GET: APIRoute = async ({ request }) => {
  if (!isLinkPreview(request.headers.get('user-agent'))) {
    const count = recordClick({ channel: 'avis', location: 'lien_court', page: '/avis', source: 'lien-avis' })
      .catch((err) => console.error('[avis]', err instanceof Error ? err.message : err));
    await Promise.race([count, new Promise((resolve) => setTimeout(resolve, COUNT_TIMEOUT_MS))]);
  }
  return new Response(null, {
    status: 302,
    headers: { Location: site.googleReviewUrl, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
};
