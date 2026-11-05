import { getCollection } from 'astro:content';

const SITE = 'https://diego740.github.io';
// Pares ES/EN de las páginas con versión en ambos idiomas.
const pairs = ['/', '/about', '/projects', '/education', '/cybersecurity', '/contact'].map((es) => [es, es === '/' ? '/en/' : `/en${es}`]);

export async function GET() {
  const projects = (await getCollection('projects')).filter((p) => p.data.detail).map((p) => [`/projects/${p.id}`, `/en/projects/${p.id}`]);
  const writeups = (await getCollection('writeups')).filter((w) => w.data.status === 'retired' && w.data.file).map((w) => [`/cybersecurity/${w.id}`, `/en/cybersecurity/${w.id}`]);
  const entry = (loc: string, es: string, en: string) =>
    `  <url><loc>${SITE}${loc}</loc><xhtml:link rel="alternate" hreflang="es" href="${SITE}${es}"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/></url>`;
  const body = [...pairs, ...projects, ...writeups].flatMap(([es, en]) => [entry(es, es, en), entry(en, es, en)]);
  // Páginas legales de las apps (estáticas en public/)
  const legal = ['/geoalarm-privacy.html', '/mybudget-privacy.html', '/garagepad-privacy.html'].map((l) => `  <url><loc>${SITE}${l}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[...body, ...legal].join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
