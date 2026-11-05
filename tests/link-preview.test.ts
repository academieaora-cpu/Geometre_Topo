import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isLinkPreview } from '../src/server/link-preview.ts';

test('les aperçus de lien et les robots ne sont pas comptés', () => {
  for (const ua of [
    'WhatsApp/2.24.6.77 A',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'TelegramBot (like TwitterBot)',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    '',
    null,
    undefined,
  ]) {
    assert.equal(isLinkPreview(ua), true, `aperçu attendu pour ${ua}`);
  }
});

test('un téléphone ou un ordinateur est compté', () => {
  for (const ua of [
    'Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  ]) {
    assert.equal(isLinkPreview(ua), false, `personne attendue pour ${ua}`);
  }
});
