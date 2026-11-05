// Genera los 3 prototipos estáticos de la home a partir de _shared/data.mjs.
// Uso: node prototypes/_build.mjs
// Salida: prototypes/{pistas,vinilos,informe}/index.html (HTML puro; el CSS está en style.css de cada carpeta).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { person, credentials, shelves, timeline, summaries, menu, svg, esc, statusLabel } from './_shared/data.mjs';

const root = dirname(fileURLToPath(import.meta.url));

const TITLE = 'Diego Aranda Gómez · Ingeniero de seguridad ofensiva (OSCP)';
const DESC = 'Portfolio de Diego Aranda Gómez: ingeniero de seguridad ofensiva (OSCP/OSCP+), analista de arquitectura de seguridad en Deloitte y desarrollador de apps iOS con privacidad por diseño.';

const head = (dir) => `<!doctype html>
<html lang="es" data-dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
</head>`;

const top = () => `
<header class="top">
  <div class="who">
    <h1 class="name">${person.name}</h1>
    <p class="pos">${person.positioning}</p>
  </div>
  <a class="skip" href="#escaparate">Saltar al escaparate</a>
  <nav class="actions" aria-label="Principal">
    <a class="btn btn-main" href="${person.cv}" download>CV</a>
    <a class="btn" href="/contact">Contacto</a>
    <details class="menu"><summary>Menú</summary>
      <ul>${menu.map((m) => `<li><a href="${m.href}">${m.label}</a></li>`).join('')}</ul>
    </details>
    <a class="lang" href="/en/" hreflang="en" lang="en" aria-label="Switch to English">EN</a>
  </nav>
</header>`;

const art = (p, cls = 'motif') => p.image ? `<img class="${cls}-img" src="${p.image}" alt="${p.imageAlt}" width="350" height="700" loading="lazy" decoding="async">` : svg(p.motif, cls);
const sticker = (p) =>
  p.status === 'en-curso' ? '<span class="sticker" aria-hidden="true">EN CURSO</span>' : '';
const statusSr = (p) =>
  p.status === 'en-curso' ? ' <span class="sr">(en curso)</span>' : p.status === 'publicada' ? ' <span class="sr">(publicada en App Store)</span>' : '';

const timelineNav = (render) => `
  <nav class="timeline" aria-label="Trayectoria profesional">
    <ol>${timeline.map(render).join('')}</ol>
  </nav>`;

const verify = (c) =>
  `<a class="verify" href="${c.url}" target="_blank" rel="noopener">Verificar credencial<span class="sr"> ${c.name} en OffSec (se abre en otra pestaña)</span></a>`;

const summariesBlock = (certsHtml) => `
<section class="sum sum-about" id="sobre-mi" aria-labelledby="h-about">
  <h2 id="h-about">${summaries.about.title}</h2>
  <p>${summaries.about.text}</p>
  <a class="more" href="${summaries.about.cta.href}">${summaries.about.cta.label}</a>
</section>
<section class="sum sum-exp" id="experiencia" aria-labelledby="h-exp">
  <h2 id="h-exp">${summaries.experience.title}</h2>
  <ul class="exp">${summaries.experience.items
    .map((i) => `<li><h3>${i.role}</h3><p class="org">${i.org} · ${i.when}</p><p>${i.note}</p></li>`)
    .join('')}</ul>
  <a class="more" href="${summaries.experience.cta.href}">${summaries.experience.cta.label}</a>
</section>
${certsHtml}
<section class="sum sum-writeups" id="writeups" aria-labelledby="h-wu">
  <h2 id="h-wu">${summaries.writeups.title}</h2>
  <p>${summaries.writeups.text}</p>
  <a class="more" href="${summaries.writeups.cta.href}">${summaries.writeups.cta.label}</a>
</section>
<section class="sum sum-contact" id="contacto" aria-labelledby="h-ct">
  <h2 id="h-ct">${summaries.contact.title}</h2>
  <p>${summaries.contact.text}</p>
  <ul class="ct">
    <li><a href="mailto:${person.email}">${person.email}</a></li>
    <li><a href="${person.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
    <li><a href="${person.github}" target="_blank" rel="noopener">GitHub</a></li>
    <li><a href="${person.cv}" download>Descargar CV</a></li>
  </ul>
  <a class="more" href="${summaries.contact.cta.href}">${summaries.contact.cta.label}</a>
</section>`;

const footer = () => `
<footer class="foot">
  <p>© 2026 ${person.name}</p>
  <ul>
    <li><a href="/geoalarm-privacy.html">Privacidad GeoAlarm</a></li>
    <li><a href="/mybudget-privacy.html">Privacidad RootJar</a></li>
    <li><a href="/garagepad-privacy.html">Privacidad GaragePad</a></li>
  </ul>
</footer>`;

const shelfWrap = (cover, shelfNote = {}) =>
  shelves
    .map(
      (s) => `
  <section class="shelf shelf-${s.id}" aria-labelledby="sh-${s.id}">
    <div class="shelf-head">
      <h2 id="sh-${s.id}">${s.title}</h2>
      ${shelfNote[s.id] ? `<p class="shelf-note">${shelfNote[s.id]}</p>` : ''}
    </div>
    <ul class="row" tabindex="0" aria-label="${s.title}: ${s.items.length} proyectos, desplazable">
      ${s.items.map((p, i) => `<li class="cover" style="--i:${i}" data-slug="${p.slug}" data-status="${p.status}"${p.diff ? ` data-diff="${p.diff}"` : ''}>${cover(p, s)}</li>`).join('')}
      <li class="cover more-tile" style="--i:${s.items.length}"><a href="${s.more.href}"><span>${s.more.label}</span></a></li>
    </ul>
  </section>`
    )
    .join('');

/* ───────────── A · PISTAS ───────────── */
const pistas = () => {
  const cover = (p) => `<a href="${p.href}">
      <span class="plaque">
        <span class="field">${art(p)}${p.status === 'publicada' ? '<span class="tag-live">App Store</span>' : ''}</span>
        <span class="label"><strong>${esc(p.short)}</strong><small>${esc(p.tags)}</small></span>
      </span>${sticker(p)}${statusSr(p)}
    </a>`;
  const tl = (t) => `<li${t.star ? ' class="star"' : ''}><a href="${t.href}"><span class="dot" aria-hidden="true"></span><span class="when">${t.when}</span><span class="what">${t.label}</span></a></li>`;
  const certs = `
<section class="sum sum-certs" id="certificaciones" aria-labelledby="h-ce">
  <h2 id="h-ce">${summaries.certs.title}</h2>
  <div class="oscp-board">
    <p class="oscp-date">OffSec · ${credentials[0].date}</p>
    <ul class="oscp-pair">${credentials
      .map((c) => `<li class="diamond"><span class="diamond-mark" aria-hidden="true"></span><div><h3>${c.name}</h3><p>${c.full}</p>${verify(c)}</div></li>`)
      .join('')}</ul>
  </div>
  <p class="other-cert">${summaries.certs.other.name} · ${summaries.certs.other.date}</p>
  <a class="more" href="${summaries.certs.cta.href}">${summaries.certs.cta.label}</a>
</section>`;
  return `${head('pistas')}
<body>${top()}
<main id="main">
<section id="escaparate" class="exhibit" aria-label="Escaparate de proyectos">
  <div class="wall">${shelfWrap(cover, { writeups: 'El color sigue la dificultad de HTB, como en las pistas: verde Easy, azul Medium.' })}</div>
  ${timelineNav(tl)}
</section>
${summariesBlock(certs)}
</main>${footer()}
</body></html>`;
};

/* ───────────── B · VINILOS (dirección elegida) ───────────── */
const vinilos = (variant = 'ref') => {
  const back = (p) => `
    <h3>${esc(p.heading)}</h3>
    <p class="qv-status s-${p.status}">${statusLabel[p.status]}</p>
    <p class="qv-blurb">${esc(p.blurb)}</p>
    <p class="qv-fact">${esc(p.cover)}</p>
    <ul class="qv-tags">${p.tags.split(' · ').map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <div class="qv-actions">
      <a class="qv-main" href="${p.href}">Ver todos los detalles</a>
      ${p.store ? `<a class="qv-sec" href="${p.store}" target="_blank" rel="noopener">App Store<span class="sr"> (se abre en otra pestaña)</span></a>` : ''}
      ${p.repo ? `<a class="qv-sec" href="${p.repo}" target="_blank" rel="noopener">Repositorio<span class="sr"> (se abre en otra pestaña)</span></a>` : ''}
      ${p.legal ? `<a class="qv-sec" href="${p.legal}">Privacidad y términos</a>` : ''}
      <button type="button" class="qv-close" data-close>Cerrar</button>
    </div>`;
  const cover = (p) => `<a class="cv" href="${p.href}" data-title="${esc(p.heading)}">
      <span class="sleeve">
        <span class="s-title">${esc(p.heading)}</span>
        ${svg(p.motif)}
        <span class="s-fact">${esc(p.cover)}</span>
        <span class="s-hint" aria-hidden="true">Vista rápida</span>
      </span>${sticker(p)}${statusSr(p)}
    </a><template>${back(p)}</template>`;
  const tl = (t) => `<li${t.star ? ' class="star"' : ''}><a href="${t.href}"><span class="when">${t.when}</span><span class="what">${t.label}</span></a></li>`;
  const certs = `
<section class="sum sum-certs" id="certificaciones" aria-labelledby="h-ce">
  <h2 id="h-ce">${summaries.certs.title}</h2>
  <div class="gatefold">
    ${credentials
      .map((c) => `<article class="panel panel-${c.id}"><h3>${c.name}</h3><p>${c.full}</p>${verify(c)}</article>`)
      .join('')}
  </div>
  <p class="other-cert">OffSec, ${credentials[0].date}. Además: ${summaries.certs.other.name}, ${summaries.certs.other.date}.</p>
  <a class="more" href="${summaries.certs.cta.href}">${summaries.certs.cta.label}</a>
</section>`;
  const html = `${head('vinilos').replace('</head>', `<script src="${variant === 'taste' ? '../vinilos/' : ''}app.js" defer></script>\n</head>`).replace('<html lang="es"', `<html lang="es"${variant === 'taste' ? ' data-tilt="off"' : ''}`)}
<body>${top()}
<main id="main">
<section id="escaparate" class="exhibit" aria-label="Escaparate de proyectos">
  <div class="wall">${shelfWrap(cover)}</div>
  ${timelineNav(tl)}
</section>
${summariesBlock(certs)}
</main>${footer()}
</body></html>`;
  return html;
};

/* ───────────── C · INFORME ───────────── */
const informe = () => {
  const cover = (p, s) => `<a href="${p.href}">
      <span class="sheet">
        <span class="s-cat">${esc(p.tags.split(' · ')[0])}</span>
        <span class="s-art">${art(p)}</span>
        <span class="s-title">${esc(p.short)}</span>
        <span class="s-fact">${esc(p.fact)}</span>
      </span>${sticker(p)}${statusSr(p)}
    </a>`;
  const tl = (t) => `<li${t.star ? ' class="star"' : ''}><a href="${t.href}"><span class="what">${t.label}</span><span class="when">${t.when}</span></a></li>`;
  const certs = `
<section class="sum sum-certs" id="certificaciones" aria-labelledby="h-ce">
  <h2 id="h-ce">${summaries.certs.title}</h2>
  <div class="pair">
    ${credentials
      .map((c, i) => `<article class="cert cert-${i}"><h3>${c.name}</h3><p>${c.full}</p><p class="date">OffSec · ${c.date}</p>${verify(c)}</article>`)
      .join('')}
  </div>
  <p class="other-cert">${summaries.certs.other.name} · ${summaries.certs.other.date}</p>
  <a class="more" href="${summaries.certs.cta.href}">${summaries.certs.cta.label}</a>
</section>`;
  return `${head('informe')}
<body>${top()}
<main id="main">
<section id="escaparate" class="exhibit" aria-label="Escaparate de proyectos">
  <div class="shelves">${shelfWrap(cover)}</div>
  ${timelineNav(tl)}
</section>
${summariesBlock(certs)}
</main>${footer()}
</body></html>`;
};

writeFileSync(join(root, 'pistas/index.html'), pistas());
writeFileSync(join(root, 'vinilos/index.html'), vinilos());
import { mkdirSync } from 'node:fs';
mkdirSync(join(root, 'vinilos-taste'), { recursive: true });
writeFileSync(join(root, 'vinilos-taste/index.html'), vinilos('taste'));
writeFileSync(join(root, 'informe/index.html'), informe());
console.log('prototipos generados');
