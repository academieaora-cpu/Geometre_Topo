import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { hashIp, signSession, verifyPassword, verifySession } from '../src/server/crypto.ts';

test('le hachage produit par scripts/hash-password.mjs est vérifiable', () => {
  const out = execFileSync('node', ['scripts/hash-password.mjs', 'UnMotDePasseSolide!'], { encoding: 'utf8' });
  const hash = out.match(/ADMIN_PASSWORD_HASH=(\S+)/)![1];
  assert.equal(verifyPassword('UnMotDePasseSolide!', hash), true);
  assert.equal(verifyPassword('mauvais', hash), false);
  assert.equal(verifyPassword('x', 'format-invalide'), false);
});

test('refuse les mots de passe trop courts', () => {
  assert.throws(() => execFileSync('node', ['scripts/hash-password.mjs', 'court'], { stdio: 'pipe' }));
});

test('session signée : valide, falsifiée, expirée', () => {
  const secret = 's'.repeat(40);
  const token = signSession({ sub: 'admin@x.cm', exp: Date.now() + 60_000 }, secret);
  assert.equal(verifySession(token, secret)?.sub, 'admin@x.cm');
  assert.equal(verifySession(token, 'autre-secret'.repeat(4)), null);
  const [body] = token.split('.');
  const forged = Buffer.from(JSON.stringify({ sub: 'pirate', exp: Date.now() + 1e9 })).toString('base64url');
  assert.equal(verifySession(`${forged}.${token.split('.')[1]}`, secret), null);
  assert.equal(verifySession(body, secret), null);
  const expired = signSession({ sub: 'a', exp: Date.now() - 1 }, secret);
  assert.equal(verifySession(expired, secret), null);
  assert.equal(verifySession(undefined, secret), null);
});

test('empreinte IP stable, salée et non réversible', () => {
  assert.equal(hashIp('1.2.3.4', 'sel'), hashIp('1.2.3.4', 'sel'));
  assert.notEqual(hashIp('1.2.3.4', 'sel'), hashIp('1.2.3.4', 'autre'));
  assert.ok(!hashIp('1.2.3.4', 'sel').includes('1.2.3.4'));
});
