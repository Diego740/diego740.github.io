// Páginas legales: ES por defecto; EN ya está en el HTML (oculto). Claves de localStorage: 'lang' ('es'|'en') y 'theme'.
const root = document.documentElement;
const titles = JSON.parse(document.getElementById('legal-titles').textContent);
let current = 'es';
try { current = localStorage.getItem('lang') === 'en' ? 'en' : 'es'; } catch {}

function setLang(lang, save = true) {
  current = lang;
  if (save) { try { localStorage.setItem('lang', lang); } catch {} }
  root.lang = lang;
  document.title = titles[lang];
  document.querySelectorAll('[data-lang]').forEach((el) => { el.hidden = el.dataset.lang !== lang; });
  document.querySelectorAll('[data-lang-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
}

document.querySelectorAll('[data-lang-btn]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.langBtn)));
setLang(current);

// #hash: cambia de idioma si el ancla es de un idioma concreto y hace scroll a la sección
window.addEventListener('load', () => {
  if (!location.hash) return;
  let hash = decodeURIComponent(location.hash);
  if (['#politica-de-privacidad', '#política-de-privacidad', '#terminos-de-uso', '#términos-de-uso'].includes(hash)) setLang('es');
  else if (hash.endsWith('-en')) setLang('en');
  else if (current === 'en' && document.querySelector(hash + '-en')) hash += '-en';
  const target = document.querySelector(hash);
  if (target) setTimeout(() => target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }), 120);
});
