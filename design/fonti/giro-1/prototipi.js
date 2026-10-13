// Solo strumenti del bozzetto. Il blocco fonti è HTML nativo e non dipende da questo file.
const themeButton = document.querySelector('[data-theme-button]');
if (themeButton) {
  themeButton.disabled = false;
  const label = themeButton.querySelector('span');
  const dark = () => document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const sync = () => { label.textContent = dark() ? 'Usa tema chiaro' : 'Usa tema scuro'; };
  themeButton.addEventListener('click', () => {
    document.documentElement.dataset.theme = dark() ? 'light' : 'dark';
    sync();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
  sync();
}
