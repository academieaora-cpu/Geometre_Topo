import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FICHE_GOOGLE_SOURCE, sourceLabel } from '../src/data/tracking.ts';

test('les sources de visite ont un nom lisible', () => {
  assert.equal(sourceLabel(FICHE_GOOGLE_SOURCE), 'Fiche Google (bouton « Site Web »)');
  assert.equal(sourceLabel('google.com'), 'Recherche Google');
  assert.equal(sourceLabel('google.cm'), 'Recherche Google');
  assert.equal(sourceLabel('m.facebook.com'), 'Facebook');
  assert.equal(sourceLabel('l.facebook.com'), 'Facebook');
  assert.equal(sourceLabel('direct'), 'Accès direct (lien tapé, favori, message)');
  assert.equal(sourceLabel('google/cpc'), 'Annonce Google');
  assert.equal(sourceLabel('maligah.com'), 'maligah.com');
});
