import type { AstroCookies } from 'astro';
import { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, SESSION_SECRET } from 'astro:env/server';
import { safeEqual, signSession, verifyPassword, verifySession } from './crypto.ts';

export const SESSION_COOKIE = 'gt_admin';
const SESSION_HOURS = 8;

export function adminConfigured(): boolean {
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD_HASH && SESSION_SECRET && SESSION_SECRET.length >= 32);
}

export function checkCredentials(email: string, password: string): boolean {
  if (!adminConfigured()) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), ADMIN_EMAIL!.trim().toLowerCase());
  // Le mot de passe est toujours vérifié (temps de réponse identique que l'e-mail soit bon ou non).
  const passwordOk = verifyPassword(password, ADMIN_PASSWORD_HASH!);
  return emailOk && passwordOk;
}

export function createSession(cookies: AstroCookies, email: string, secure: boolean): void {
  const token = signSession({ sub: email, exp: Date.now() + SESSION_HOURS * 3600_000 }, SESSION_SECRET!);
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_HOURS * 3600,
  });
}

export function destroySession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function currentAdmin(cookies: AstroCookies): string | null {
  if (!adminConfigured()) return null;
  return verifySession(cookies.get(SESSION_COOKIE)?.value, SESSION_SECRET!)?.sub ?? null;
}
