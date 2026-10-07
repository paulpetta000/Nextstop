// Comportamenti comuni a tutte le pagine: tema, menu (rimedio per i browser vecchi), app offline, statistiche anonime
import { SITO } from '../config/sito';

// ---- tema: automatico → chiaro → scuro (il pulsante è in fondo al menu) ----
const root = document.documentElement;
const temaBtn = document.getElementById('tema-btn');
const temaNome = document.getElementById('tema-nome');
const NOMI: Record<string, string> = { auto: 'automatico', light: 'chiaro', dark: 'scuro' };
const aggiornaTema = () => {
  const t = root.dataset.theme || 'auto';
  if (temaNome) temaNome.textContent = `Tema: ${NOMI[t]}`;
  temaBtn?.setAttribute('aria-label', `Tema: ${NOMI[t]}. Cambia tema`);
};
temaBtn?.addEventListener('click', () => {
  const ora = root.dataset.theme || 'auto';
  const dopo = ora === 'auto' ? 'light' : ora === 'light' ? 'dark' : 'auto';
  if (dopo === 'auto') delete root.dataset.theme; else root.dataset.theme = dopo;
  try { dopo === 'auto' ? localStorage.removeItem('tema') : localStorage.setItem('tema', dopo); } catch {}
  aggiornaTema();
});
aggiornaTema();

// ---- menu nei browser senza popover (Safari prima della 17, Firefox prima della 125) ----
// Con il popover il browser fa tutto da solo: apre, chiude con Esc e con un tocco fuori, segna il pulsante come aperto.
const menu = document.getElementById('menu');
if (menu && !('popover' in HTMLElement.prototype)) {
  const apriBtn = document.querySelector<HTMLElement>('[popovertarget="menu"]:not([popovertargetaction="hide"])');
  const segna = (aperto: boolean) => { menu.classList.toggle('aperto', aperto); apriBtn?.setAttribute('aria-expanded', String(aperto)); };
  apriBtn?.setAttribute('aria-expanded', 'false');
  document.addEventListener('click', e => {
    const b = (e.target as Element).closest('[popovertarget="menu"]');
    if (b) segna(b.getAttribute('popovertargetaction') !== 'hide' && !menu.classList.contains('aperto'));
    else if (menu.classList.contains('aperto') && !menu.contains(e.target as Node)) segna(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('aperto')) { segna(false); apriBtn?.focus(); } });
}

// ---- app installabile e offline ----
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}

// ---- statistiche anonime, solo sul sito pubblico ----
// Niente cookie e niente identificativi. Chi chiede di non essere tracciato (Global Privacy Control o
// «Do Not Track» nel browser) non viene contato.
const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
if (location.hostname === new URL(SITO.url).hostname && !nav.globalPrivacyControl && nav.doNotTrack !== '1') {
  // Vercel Web Analytics: quante persone, quali pagine, da dove arrivano
  const va = document.createElement('script');
  va.defer = true;
  va.src = '/_vercel/insights/script.js';
  document.head.appendChild(va);
}
