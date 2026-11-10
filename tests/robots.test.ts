import { test } from 'node:test';
import assert from 'node:assert/strict';
import { robotsTxt } from '../src/pages/robots.txt.ts';

const PRIVATE_PATHS = ['/admin', '/api/', '/demande-envoyee', '/demande-non-envoyee', '/desabonnement'];
const txt = robotsTxt(new URL('https://geometre-topo.vercel.app'));
const groups = txt.split('\n\n').map((g) => g.split('\n'));

test('le robot de ChatGPT et la règle générale ouvrent le site et ferment les pages privées', () => {
  for (const agent of ['OAI-SearchBot', '*']) {
    const g = groups.find((lines) => lines[0] === `User-agent: ${agent}`);
    assert.ok(g, `groupe absent : ${agent}`);
    assert.ok(g.includes('Allow: /'), agent);
    for (const p of PRIVATE_PATHS) assert.ok(g.includes(`Disallow: ${p}`), `${agent} : ${p}`);
  }
});

test('le sitemap est annoncé', () => {
  assert.ok(txt.includes('Sitemap: https://geometre-topo.vercel.app/sitemap-index.xml'));
});
