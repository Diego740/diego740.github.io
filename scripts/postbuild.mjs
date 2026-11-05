#!/usr/bin/env node
// Con build.format "file", Astro genera /en.html, /projects.html… y GitHub Pages sirve /en y /projects con 200,
// pero /en/ y /projects/ (con barra) darían 404 porque la carpeta no tiene index.html.
// Este paso copia X.html → X/index.html cuando existe la carpeta X, de modo que ambas formas devuelven 200.
// Nunca toca carpetas de public/ que ya traen su propio index.html (p. ej. las páginas legales 🔒).
import { readdirSync, statSync, existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
let n = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory() || name === '_astro') continue;
    const html = p + '.html';
    if (existsSync(html) && !existsSync(join(p, 'index.html'))) {
      copyFileSync(html, join(p, 'index.html'));
      n++;
    }
    walk(p);
  }
};
walk(dist);
console.log(`postbuild: ${n} index.html añadidos`);
