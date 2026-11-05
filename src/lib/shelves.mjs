import { getCollection } from 'astro:content';

const SHELVES = [
  { id: 'seguridad', title: { es: 'Seguridad', en: 'Security' }, more: { es: 'Ver todos', en: 'See all' }, href: '/projects#seguridad' },
  { id: 'apps', title: { es: 'Apps', en: 'Apps' }, more: { es: 'Ver apps', en: 'See apps' }, href: '/projects#apps' },
  { id: 'writeups', title: { es: 'Writeups', en: 'Writeups' }, more: { es: 'Todos los writeups', en: 'All writeups' }, href: '/cybersecurity#writeups' },
];

export const toItem = (lang) => ({ id, data: p }) => ({
  slug: id, heading: p.heading[lang], cover: p.cover[lang], blurb: p.blurb[lang], tags: p.tags, status: p.status, motif: p.motif,
  href: p.detail ? `${lang === 'en' ? '/en' : ''}/projects/${id}` : null, store: p.links.store, repo: p.links.repo, legal: p.links.legal,
});

// Estantes de la home a partir de las colecciones. Añadir una categoría = añadir un elemento a SHELVES.
export async function getShelves(lang = 'es') {
  const pre = lang === 'en' ? '/en' : '';
  const projects = (await getCollection('projects')).filter((p) => p.data.featured);
  const writeups = (await getCollection('writeups')).filter((w) => w.data.status === 'retired' && w.data.file);
  return SHELVES.map((s) => {
    const items = s.id === 'writeups'
      ? writeups.sort((a, b) => a.data.date.localeCompare(b.data.date)).map(({ id, data: w }) => ({
          slug: id, heading: w.heading[lang], cover: w.cover[lang], blurb: w.blurb[lang], tags: [w.platform, w.os, w.difficulty], status: 'terminado',
          motif: w.motif, href: `${pre}/cybersecurity/${id}`,
        }))
      : projects.filter((p) => p.data.shelf === s.id).sort((a, b) => a.data.order - b.data.order).map(toItem(lang));
    return { id: s.id, title: s.title[lang], more: { label: s.more[lang], href: pre + s.href }, items };
  });
}
