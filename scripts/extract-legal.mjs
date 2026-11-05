#!/usr/bin/env node
// Extracción ÚNICA del texto legal original (tests/fixtures/legal/*.html) a archivos de contenido en
// src/content/legal/. Las páginas se generan desde ahí. Se conserva para poder auditar la extracción.
// Uso: node scripts/extract-legal.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { parseHTML } from 'linkedom';

const read = (app) => readFileSync(new URL(`../tests/fixtures/legal/${app}-privacy.html`, import.meta.url), 'utf8');
const out = (name, s) => writeFileSync(new URL(`../src/content/legal/${name}`, import.meta.url), s);

// Lee el objeto literal de traducciones del <script> original (sin ejecutar nada más)
function dictFrom(html, varName) {
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
const clean = (frag) => frag.replace(/<!--[\s\S]*?-->/g, '').replace(/ data-i18n="[^"]*"/g, '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
const doc = (html) => parseHTML(html).document;

const APPS = {
  geoalarm: { dict: 'translations', titleEn: 'Privacy Policy — GeoAlarm' },
  mybudget: { dict: 'uiTranslations', titleEn: 'MyBudget — Legal & Support' },
  garagepad: { dict: 'uiTranslations', titleEn: 'GaragePad — Legal & Privacy Policy' },
};

const report = {};
for (const [app, cfg] of Object.entries(APPS)) {
  const html = read(app);
  const d = doc(html);
  const dict = dictFrom(html, cfg.dict);
  const main = d.querySelector('main');
  const meta = {
    es: { title: d.querySelector('title').textContent.trim(), description: d.querySelector('meta[name=description]').content },
    en: { title: cfg.titleEn },
  };
  meta.en.description = meta.es.description; // la descripción original solo existe en un idioma
  const navLinks = [...d.querySelectorAll('nav.doc-nav a')];
  let blocks;
  if (app === 'geoalarm') {
    // ES y EN salen del mismo marcado; los textos vienen del diccionario (como hacía el JS original)
    const kids = [...main.children].filter((e) => e.matches('section.doc-block, div.doc-separator'));
    const apply = (lang, suffix) => {
      const wrap = d.createElement('div');
      kids.forEach((k) => wrap.appendChild(k.cloneNode(true)));
      wrap.querySelectorAll('[data-i18n]').forEach((el) => {
        const v = dict[lang][el.getAttribute('data-i18n')];
        if (v !== undefined) el.textContent = v;
      });
      if (suffix) wrap.querySelectorAll('section[id]').forEach((s) => s.setAttribute('id', s.getAttribute('id') + suffix));
      return clean(wrap.innerHTML);
    };
    // diferencias entre el HTML estático y el diccionario ES (lo que se ve tras ejecutar el JS original)
    report.geoalarmStaticVsDictEs = [...main.querySelectorAll('[data-i18n]')].filter((el) => dict.es[el.getAttribute('data-i18n')] !== undefined && el.textContent.trim() !== dict.es[el.getAttribute('data-i18n')].trim()).map((el) => el.getAttribute('data-i18n'));
    blocks = { es: apply('es', ''), en: apply('en', '-en') };
  } else {
    blocks = {};
    for (const lang of ['es', 'en']) blocks[lang] = clean(d.querySelector(`.lang-content-block[data-lang-block="${lang}"]`).innerHTML);
  }
  const navEs = navLinks.map((a) => ({ href: a.getAttribute('href'), key: a.getAttribute('data-i18n') }));
  const ui = {};
  for (const lang of ['es', 'en']) {
    const t = dict[lang];
    ui[lang] = {
      back: t.backToPortfolio, title: t['page.title'], subtitle: t['page.subtitle'], badge: t['page.badge'] ?? null,
      nav: navEs.map((n) => ({ href: lang === 'en' ? n.href + '-en' : n.href, label: t[n.key] })),
      footer: t['footer.copy'] ?? d.querySelector('.site-footer p').textContent.trim(),
    };
  }
  writeFileSync(new URL(`../src/content/legal/${app}.json`, import.meta.url), JSON.stringify({ app, path: `/${app}-privacy`, meta, ui }, null, 2) + '\n');
  out(`${app}.es.html`, blocks.es);
  out(`${app}.en.html`, blocks.en);
}
console.log(JSON.stringify(report));
