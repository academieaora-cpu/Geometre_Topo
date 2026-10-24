/**
 * Mesure d'audience respectueuse :
 * - aucun outil n'est chargé tant que le visiteur n'a pas accepté (et seulement si PUBLIC_GA_ID est défini) ;
 * - les événements ne contiennent JAMAIS de nom, téléphone, e-mail ou texte saisi.
 */

type Params = Record<string, string | number | undefined>;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = 'gt_consent_mesure';

function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value: 'oui' | 'non'): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* stockage indisponible : le choix vaut pour la page en cours */
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event, { ...params, page_path: location.pathname });
}

function loadGa(id: string): void {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function init(): void {
  const root = document.getElementById('gt-analytics');
  const gaId = root?.dataset.ga ?? '';

  // Suivi des clics de contact et d'appel à l'action (délégation globale).
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track!, { location: el.dataset.trackLocation });
  });

  if (!gaId || !root) return;
  const banner = root.querySelector<HTMLElement>('.consent');
  const consent = readConsent();
  if (consent === 'oui') loadGa(gaId);
  else if (consent === null && banner) banner.hidden = false;

  root.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-consent]');
    if (!btn) return;
    const value = btn.dataset.consent === 'oui' ? 'oui' : 'non';
    writeConsent(value);
    if (banner) banner.hidden = true;
    if (value === 'oui') loadGa(gaId);
  });

  // Lien « gérer mes préférences » (page de confidentialité).
  document.querySelectorAll('[data-consent-reset]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      try { localStorage.removeItem(CONSENT_KEY); } catch { /* ignore */ }
      if (banner) banner.hidden = false;
    }),
  );
}

init();
