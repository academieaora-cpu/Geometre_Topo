import type { APIRoute } from 'astro';
import { adminConfigured, checkCredentials, createSession } from '../../../server/auth.ts';
import { ipHash, isSecure, sameOrigin } from '../../../server/http.ts';
import { loginLocked, recordLoginAttempt } from '../../../server/leads.ts';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const back = (code: string) => ctx.redirect(`/admin/connexion?erreur=${code}`, 303);
  if (!sameOrigin(ctx)) return back('origine');
  if (!adminConfigured()) return back('configuration');

  const form = await ctx.request.formData().catch(() => null);
  const email = String(form?.get('email') ?? '').slice(0, 254);
  const password = String(form?.get('password') ?? '').slice(0, 200);
  const ip = ipHash(ctx);

  try {
    if (await loginLocked(ip)) return back('bloque');
    const ok = checkCredentials(email, password);
    await recordLoginAttempt(ip, ok);
    if (!ok) return back('identifiants');
  } catch (err) {
    console.error('[admin] connexion impossible', err instanceof Error ? err.message : err);
    return back('technique');
  }

  createSession(ctx.cookies, email.trim().toLowerCase(), isSecure(ctx));
  return ctx.redirect('/admin', 303);
};
