#!/usr/bin/env node
// Test de CI de las 3 páginas legales: el texto visible, por idioma, debe ser IDÉNTICO al original guardado en
// tests/fixtures/legal/ (normalizando espacios). También: anclas originales, enlaces del contenido y 200 de las URLs.
// Uso: node scripts/verify-legal.mjs [dist]   |  importable: verifyLegal(dist)
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { APPS, norm, original } from './lib/legal-original.mjs';

const ORDER = ['back', 'badge', 'title', 'subtitle', 'nav', 'content', 'footer'];

function current(dist, app, lang) {
  const { document } = parseHTML(readFileSync(join(dist, `${app}-privacy.html`), 'utf8'));
  const regions = Object.fromEntries(ORDER.map((r) => [r, '']));
  document.querySelectorAll('[data-legal]').forEach((el) => {
    if (el.dataset.lang && el.dataset.lang !== lang) return;   // el otro idioma no es "visible"
    const c = el.cloneNode(true);
    c.querySelectorAll('.back-arrow').forEach((n) => n.remove()); // flecha decorativa, no es texto legal
    // la navegación son enlaces independientes (flex): se compara enlace a enlace
    const text = el.dataset.legal === 'nav' ? [...c.querySelectorAll('a')].map((a) => a.textContent).join(' ') : c.textContent;
    regions[el.dataset.legal] = norm(regions[el.dataset.legal] + ' ' + text);
  });
  const block = document.querySelector(`.lang-content-block[data-lang-block="${lang}"]`);
  const hrefs = [...block.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const ids = new Set([...document.querySelectorAll('[id]')].map((e) => e.id));
  const hidden = { es: !!document.querySelector('.lang-content-block[data-lang-block="es"][hidden]'), en: !!document.querySelector('.lang-content-block[data-lang-block="en"]:not([hidden])') };
  const meta = { robots: document.querySelector('meta[name=robots]')?.content, canonical: document.querySelector('link[rel=canonical]')?.href, title: document.querySelector('title')?.textContent, description: document.querySelector('meta[name=description]')?.content };
  const third = [...document.querySelectorAll('link[href^="http"],script[src^="http"],img[src^="http"]')].filter((e) => !/diego740\.github\.io/.test(e.getAttribute('href') || e.getAttribute('src'))).map((e) => e.getAttribute('href') || e.getAttribute('src'));
  return { regions, hrefs, ids, hidden, meta, third };
}

const firstDiff = (a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; return `en pos. ${i}: original «${a.slice(Math.max(0, i - 25), i + 40)}» ≠ nuevo «${b.slice(Math.max(0, i - 25), i + 40)}»`; };

export function verifyLegal(dist = 'dist') {
  const lines = []; let fail = 0;
  const bad = (m) => { fail++; lines.push('✗ ' + m); };
  const ok = (m) => lines.push('✓ ' + m);
  for (const app of APPS) {
    const file = join(dist, `${app}-privacy.html`);
    if (!existsSync(file)) { bad(`falta ${file}`); continue; }
    let origIds = null;
    for (const lang of ['es', 'en']) {
      const o = original(app, lang), n = current(dist, app, lang);
      origIds = o.ids;
      for (const r of ORDER) o.regions[r] === n.regions[r] ? null : bad(`${app} [${lang}] texto «${r}» distinto ${firstDiff(o.regions[r], n.regions[r])}`);
      if (ORDER.every((r) => o.regions[r] === n.regions[r])) ok(`${app} [${lang}] texto idéntico (${ORDER.map((r) => o.regions[r].length).reduce((a, b) => a + b, 0)} caracteres)`);
      JSON.stringify(o.hrefs) === JSON.stringify(n.hrefs) ? ok(`${app} [${lang}] ${o.hrefs.length} enlaces del contenido idénticos`) : bad(`${app} [${lang}] enlaces distintos: original ${JSON.stringify(o.hrefs)} ≠ nuevo ${JSON.stringify(n.hrefs)}`);
    }
    const n = current(dist, app, 'es');
    // Anclas: las del original más (en geoalarm) las equivalentes -en
    const missing = origIds.filter((id) => !n.ids.has(id) && !['theme-toggle', 'theme-pill-icon', 'icon-moon', 'icon-sun'].includes(id));
    missing.length ? bad(`${app} faltan anclas: ${missing.join(', ')}`) : ok(`${app} anclas originales presentes (${origIds.length})`);
    n.hidden.es === false && n.hidden.en === false ? ok(`${app} ES visible por defecto, EN oculto`) : bad(`${app} el idioma por defecto no es ES`);
    n.meta.robots === 'index, follow' ? ok(`${app} meta robots index, follow`) : bad(`${app} meta robots = ${n.meta.robots}`);
    n.meta.canonical === `https://diego740.github.io/${app}-privacy.html` ? ok(`${app} canonical a la URL .html`) : bad(`${app} canonical = ${n.meta.canonical}`);
    n.meta.title && n.meta.description ? ok(`${app} title y description propios`) : bad(`${app} sin title/description`);
    n.third.length === 0 ? ok(`${app} sin recursos de terceros`) : bad(`${app} carga terceros: ${n.third.join(', ')}`);
    // Sin JavaScript el contenido ES ya está en el HTML (no se inyecta): lo garantiza que el texto se leyó del HTML estático
  }
  return { fail, lines };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { fail, lines } = verifyLegal(process.argv[2] ?? 'dist');
  console.log(lines.join('\n'));
  console.log(fail ? `\n${fail} fallo(s) en las páginas legales` : '\nPáginas legales: texto, anclas y enlaces idénticos al original');
  process.exit(fail ? 1 : 0);
}
