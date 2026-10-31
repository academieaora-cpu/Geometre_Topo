import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  csvCell, makeReference, MIN_FILL_MS, normalizePhone, safePath, safeReferrer, validateLead,
} from '../src/server/validation.ts';

const services = ['leve-topographique', 'bornage-recherche-de-bornes'];
const NOW = 1_800_000_000_000;
const valid = {
  fullName: '  Alain   Test ',
  phone: '+237 6 99 11 22 33',
  email: 'Alain@Exemple.CM',
  preferredContact: 'whatsapp',
  service: 'leve-topographique',
  locality: 'Yaoundé',
  consentProcessing: 'true',
  startedAt: String(NOW - 60_000),
};

test('accepte une demande valide et normalise les champs', () => {
  const r = validateLead(valid, { services, now: NOW });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.data.fullName, 'Alain Test');
  assert.equal(r.data.phone, '+237699112233');
  assert.equal(r.data.email, 'alain@exemple.cm');
  assert.equal(r.data.consentMarketing, false);
  assert.equal(r.data.source, 'formulaire_devis');
});

test('signale chaque champ obligatoire manquant', () => {
  const r = validateLead({}, { services, now: NOW });
  assert.equal(r.ok, false);
  if (r.ok) return;
  for (const k of ['fullName', 'phone', 'preferredContact', 'locality', 'consentProcessing']) {
    assert.ok(r.errors[k], `erreur attendue pour ${k}`);
  }
});

test('e-mail facultatif, sauf pour être recontacté par e-mail', () => {
  const sansEmail = validateLead({ ...valid, email: '' }, { services, now: NOW });
  assert.equal(sansEmail.ok && sansEmail.data.email, '');
  const r = validateLead({ ...valid, email: '', preferredContact: 'email' }, { services, now: NOW });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.ok(r.errors.email);
});

test('refuse un service inconnu mais accepte « autre » et l’absence de service', () => {
  assert.equal(validateLead({ ...valid, service: 'pirate' }, { services, now: NOW }).ok, false);
  assert.equal(validateLead({ ...valid, service: 'autre' }, { services, now: NOW }).ok, true);
  const r = validateLead({ ...valid, service: '' }, { services, now: NOW });
  assert.equal(r.ok && r.data.service, 'autre');
});

test('refuse les valeurs hors liste pour les champs à choix', () => {
  const r = validateLead({ ...valid, situation: 'hack', timeline: 'demain', hasDocuments: 'peut-etre' }, { services, now: NOW });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.ok(r.errors.situation && r.errors.timeline && r.errors.hasDocuments);
});

test('exige le consentement au traitement', () => {
  const r = validateLead({ ...valid, consentProcessing: undefined }, { services, now: NOW });
  assert.equal(r.ok, false);
});

test('détecte le champ piège et les envois trop rapides', () => {
  const hp = validateLead({ ...valid, website: 'http://spam' }, { services, now: NOW });
  assert.equal(!hp.ok && hp.spam, true);
  const fast = validateLead({ ...valid, startedAt: String(NOW - MIN_FILL_MS + 500) }, { services, now: NOW });
  assert.equal(!fast.ok && fast.spam, true);
});

test('valide les formats de téléphone et d’e-mail', () => {
  assert.equal(validateLead({ ...valid, phone: '1234' }, { services, now: NOW }).ok, false);
  assert.equal(validateLead({ ...valid, email: 'nom@domaine' }, { services, now: NOW }).ok, false);
  assert.equal(normalizePhone('00237 699-11-22-33'), '+237699112233');
});

test('tronque les textes trop longs et retire les caractères de contrôle', () => {
  const r = validateLead({ ...valid, description: 'a\u0000b'.repeat(2000), fullName: 'Nom\u0007 Prénom' }, { services, now: NOW });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.data.description!.length, 3000);
  assert.ok(!r.data.description!.includes('\u0000'));
  assert.equal(r.data.fullName, 'Nom Prénom');
});

test('ne conserve ni paramètres d’URL ni chemin du référent', () => {
  assert.equal(safePath('/devis?email=x@y.z#form'), '/devis');
  assert.equal(safePath('https://evil.com/x'), null);
  assert.equal(safePath('//evil.com'), null);
  assert.equal(safeReferrer('https://www.google.com/search?q=geometre'), 'www.google.com');
  assert.equal(safeReferrer('pas une url'), null);
});

test('génère des références au bon format', () => {
  const ref = makeReference(new Date('2026-10-24T10:00:00Z'), () => 0);
  assert.equal(ref, 'GT-261024-AAAAA');
  assert.match(makeReference(), /^GT-\d{6}-[A-Z2-9]{5}$/);
});

test('neutralise l’injection de formules dans l’export CSV', () => {
  assert.equal(csvCell('=HYPERLINK("x")'), `"'=HYPERLINK(""x"")"`);
  assert.equal(csvCell('+237699112233'), '"+237699112233"');
  assert.equal(csvCell(null), '""');
});
