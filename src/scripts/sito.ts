// Comportamenti comuni a tutte le pagine: tema, menu, app offline, statistiche anonime
import { SITO } from '../config/sito';

// ---- tema: automatico → chiaro → scuro ----
const root = document.documentElement;
const temaBtn = document.getElementById('tema-btn');
const NOMI: Record<string, string> = { auto: 'automatico', light: 'chiaro', dark: 'scuro' };
const aggiornaTema = () => {
  const t = root.dataset.theme || 'auto';
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

// ---- menu su telefono ----
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu-mob');
const chiudiMenu = () => { if (!menu || !menuBtn) return; menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Apri il menu'); };
menuBtn?.addEventListener('click', () => {
  if (!menu) return;
  const apri = menu.hidden;
  menu.hidden = !apri;
  menuBtn.setAttribute('aria-expanded', String(apri));
  menuBtn.setAttribute('aria-label', apri ? 'Chiudi il menu' : 'Apri il menu');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) { chiudiMenu(); menuBtn?.focus(); } });

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
