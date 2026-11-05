import { defineConfig } from 'astro/config';

// Salida estática con rutas "x.html" (GitHub Pages las sirve en /x con 200, sin redirecciones).
// public/ se copia tal cual: ahí viven las 9 URLs 🔒, el CV y los writeups .md.
export default defineConfig({
  site: 'https://diego740.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  compressHTML: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
