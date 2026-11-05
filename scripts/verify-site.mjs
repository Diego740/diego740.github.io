#!/usr/bin/env node
// Test de CI: (1) las 9 URLs 🔒 salen byte a byte iguales; (2) todas las rutas públicas devuelven 200.
// Uso: node scripts/verify-site.mjs [--dist dist] [--live https://diego740.github.io]
// Sin --live emula las reglas de GitHub Pages sobre la carpeta dist (archivo exacto → x.html → x/index.html).
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { verifyLegal } from './verify-legal.mjs';

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : d; };
const dist = arg('dist', 'dist');
const live = arg('live', '');
const legalOnly = process.argv.includes('--legal-only'); // fase 0: sitio actual (SPA) solo comprueba las páginas 🔒
const { files } = JSON.parse(readFileSync(new URL('./legal-hashes.json', import.meta.url)));
let fail = 0;
const bad = (m) => { fail++; console.error('✗ ' + m); };
const ok = (m) => console.log('✓ ' + m);

// 1) Hash de los 6 stubs de redirección (public/ → dist/) y texto/anclas de las 3 páginas legales
for (const [src, expected] of Object.entries(files)) {
  const p = join(dist, src.replace(/^public\//, ''));
  if (!existsSync(p)) { bad(`falta ${p}`); continue; }
  const got = createHash('sha256').update(readFileSync(p)).digest('hex');
  got === expected ? ok(`hash ${p}`) : bad(`HASH DISTINTO ${p}`);
}

{
  const r = verifyLegal(dist);
  console.log(r.lines.join('\n'));
  fail += r.fail;
}
if (legalOnly) { console.log(fail ? `\n${fail} fallo(s)` : '\nPáginas legales intactas'); process.exit(fail ? 1 : 0); }

// 2) Rutas públicas obligatorias → 200 (y las nuevas, añadir a NEW)
const KEEP = [
  '/', '/about', '/projects', '/education', '/trayectoria', '/trajectory', '/cybersecurity',
  '/projects/', '/cybersecurity/', '/en/projects/', '/cybersecurity/updown', '/cybersecurity/broker', '/cybersecurity/builder', '/contact',
  '/geoalarm-privacy.html', '/geoalarm-privacy', '/geoalarm-privacy/',
  '/mybudget-privacy.html', '/mybudget-privacy', '/mybudget-privacy/', '/mybudget/',
  '/garagepad-privacy.html', '/garagepad-privacy', '/garagepad-privacy/', '/garagepad.html', '/garagepad', '/garagepad/',
  '/favicon.svg', '/DiegoArandaGomez-CV-ES.pdf', '/DiegoArandaGomez-CV-EN.pdf',
  '/writeups/UpDown.md', '/writeups/Broker.md', '/writeups/Builder.md', '/404.html',
];
const NEW = [ // rutas nuevas del rediseño (ver docs/PLAN-rediseño.md §1)
  '/en/', '/en/about', '/en/projects', '/en/education', '/en/cybersecurity', '/en/contact',
  '/projects/geoalarm', '/projects/rootjar', '/projects/garagepad', '/projects/metadata-analyzer',
  '/projects/termostato', '/projects/wargame', '/projects/volcado-procesos', '/projects/ctfs',
];

const emulate = (url) => {
  const rel = decodeURIComponent(url.split('#')[0].split('?')[0]).replace(/^\//, '');
  const tries = rel === '' ? ['index.html'] : rel.endsWith('/') ? [rel + 'index.html'] : [rel, rel + '.html', rel + '/index.html'];
  for (const t of tries) { const p = join(dist, t); if (existsSync(p) && statSync(p).isFile()) return 200; }
  return 404;
};
for (const r of [...KEEP, ...NEW]) {
  const status = live ? (await fetch(live + r, { redirect: 'manual' })).status : emulate(r);
  // '/x' sin barra que Pages redirige a '/x/' cuenta como fallo: queremos 200 directo.
  status === 200 ? ok(`200 ${r}`) : bad(`${status} ${r}`);
}
console.log(fail ? `\n${fail} fallo(s)` : '\nTodo correcto');
process.exit(fail ? 1 : 0);
