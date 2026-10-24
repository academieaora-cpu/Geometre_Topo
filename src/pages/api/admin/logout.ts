import type { APIRoute } from 'astro';
import { destroySession } from '../../../server/auth.ts';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  destroySession(ctx.cookies);
  return ctx.redirect('/admin/connexion', 303);
};
