// Lee los HTML ORIGINALES guardados en tests/fixtures/legal/ y devuelve el texto visible por idioma.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

export const APPS = ['geoalarm', 'mybudget', 'garagepad'];
export const norm = (s) => s.replace(/\s+/g, ' ').trim();

export function dictFrom(html, varName) {
  const i = html.indexOf(`var ${varName} =`);
  const start = html.indexOf('{', i);
  let depth = 0, q = null;
  for (let k = start; k < html.length; k++) {
    const ch = html[k];
    if (q) { if (ch === '\\') k++; else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return vm.runInNewContext('(' + html.slice(start, k + 1) + ')');
  }
  throw new Error('diccionario no encontrado');
}

export function original(app, lang) {
  const html = readFileSync(new URL(`../../tests/fixtures/legal/${app}-privacy.html`, import.meta.url), 'utf8');
  const { document } = parseHTML(html);
  const dict = dictFrom(html, app === 'geoalarm' ? 'translations' : 'uiTranslations')[lang];
  const main = document.querySelector('main');
  const navKeys = [...document.querySelectorAll('nav.doc-nav a')].map((a) => a.getAttribute('data-i18n'));
  let contentEl, hrefs, ids;
  if (app === 'geoalarm') {
    contentEl = document.createElement('div');
    [...main.children].filter((e) => e.matches('section.doc-block, div.doc-separator')).forEach((k) => contentEl.appendChild(k.cloneNode(true)));
    contentEl.querySelectorAll('[data-i18n]').forEach((el) => { const v = dict[el.getAttribute('data-i18n')]; if (v !== undefined) el.textContent = v; });
  } else contentEl = document.querySelector(`.lang-content-block[data-lang-block="${lang}"]`);
  hrefs = [...contentEl.querySelectorAll('a[href]')].map((a) => a.getAttribute('href').replace(/^#(.*)$/, (_, h) => '#' + h));
  // Anclas: todos los ids de contenido del original (sin los controles de interfaz)
  ids = [...main.querySelectorAll('[id]')].map((e) => e.id);
  const regions = {
    back: dict.backToPortfolio,
    badge: dict['page.badge'] ?? '',   // el emoji decorativo del badge no cuenta como texto
    title: dict['page.title'],
    subtitle: dict['page.subtitle'],
    nav: navKeys.map((k) => dict[k]).join(' '),
    content: contentEl.textContent,
    footer: dict['footer.copy'] ?? document.querySelector('.site-footer p').textContent,
  };
  for (const k of Object.keys(regions)) regions[k] = norm(regions[k]);
  return { regions, hrefs, ids };
}
