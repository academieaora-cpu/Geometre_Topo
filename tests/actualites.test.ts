import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { actualites, actualitesRecentes, dateLisible } from '../src/data/actualites.ts';
import { gallery } from '../src/data/gallery.ts';

const images = JSON.parse(readFileSync(new URL('../src/data/images.json', import.meta.url), 'utf8')) as Record<string, unknown>;

test('chaque actualité est complète et ses photos existent', () => {
  const slugs = new Set<string>();
  for (const a of actualites) {
    assert.match(a.date, /^\d{4}-\d{2}-\d{2}$/, a.slug);
    assert.ok(!slugs.has(a.slug), `slug en double : ${a.slug}`);
    slugs.add(a.slug);
    assert.ok(a.photos.length > 0, a.slug);
    assert.ok((a.homePhotos ?? []).length <= 4, `4 photos au plus sur l’accueil : ${a.slug}`);
    for (const p of [...a.photos, ...(a.homePhotos ?? [])]) {
      assert.ok(gallery.some((g) => g.slug === p), `photo absente de la galerie : ${p}`);
      assert.ok(images[p], `photo non générée (npm run images) : ${p}`);
    }
  }
});

test('la couverture d’une actualité ne montre pas le visage du géomètre', () => {
  for (const a of actualites) {
    assert.ok(!gallery.find((g) => g.slug === a.photos[0])?.showsFace, a.slug);
  }
});

test('les actualités sont triées de la plus récente à la plus ancienne', () => {
  const dates = actualitesRecentes.map((a) => a.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test('dates en français', () => {
  assert.equal(dateLisible('2026-11-05'), '5 novembre 2026');
  assert.equal(dateLisible('2026-12-01'), '1er décembre 2026');
});
