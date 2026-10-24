import type { APIContext } from 'astro';
import { IP_HASH_SALT, SESSION_SECRET } from 'astro:env/server';
import { hashIp } from './crypto.ts';

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

export function clientIp(ctx: APIContext): string {
  const forwarded = ctx.request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  try {
    return ctx.clientAddress;
  } catch {
    return 'inconnue';
  }
}

export function ipHash(ctx: APIContext): string {
  return hashIp(clientIp(ctx), IP_HASH_SALT || SESSION_SECRET || 'geometre-topo');
}

/** Vérifie que la requête provient bien du site lui-même (protection CSRF complémentaire). */
export function sameOrigin(ctx: APIContext): boolean {
  const origin = ctx.request.headers.get('origin');
  if (!origin) return ctx.request.headers.get('sec-fetch-site') !== 'cross-site';
  return origin === ctx.url.origin;
}

export function isSecure(ctx: APIContext): boolean {
  return ctx.url.protocol === 'https:';
}
