import { defineMiddleware } from 'astro:middleware';
import { currentAdmin } from './server/auth.ts';

const PUBLIC_ADMIN_PATHS = new Set(['/admin/connexion', '/api/admin/login', '/api/admin/logout']);

/**
 * Protège l'espace d'administration et ses API : toute requête sans session valide
 * est refusée (API) ou redirigée vers la page de connexion (pages).
 */
export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.isPrerendered) return next();

  const path = ctx.url.pathname.replace(/\/$/, '');
  const isAdminPage = path === '/admin' || path.startsWith('/admin/');
  const isAdminApi = path.startsWith('/api/admin/');

  if ((isAdminPage || isAdminApi) && !PUBLIC_ADMIN_PATHS.has(path)) {
    const admin = currentAdmin(ctx.cookies);
    if (!admin) {
      if (isAdminApi) return new Response('Non autorisé', { status: 401, headers: { 'Cache-Control': 'no-store' } });
      return ctx.redirect('/admin/connexion', 303);
    }
    ctx.locals.admin = admin;
  }

  const response = await next();
  if (isAdminPage || isAdminApi || path.startsWith('/api/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store');
  }
  return response;
});
