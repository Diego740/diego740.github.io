# Plan de rediseño

Estado: **plan, sin migrar.** Rama `redesign`, sin commits. Base: `docs/AUDIT-portfolio-actual.md`, `PRODUCT.md`, `DESIGN.md`, `docs/DIRECCIONES-diseno.md`.

## 1. Mapa de rutas final

Todas deben devolver **HTTP 200 directo** (sin 301). Con `build.format: 'file'`, Astro genera `x.html` y GitHub Pages lo sirve en `/x`.

### 1.1 Intocables 🔒 (se quedan en `public/`, no pasan por layout)
`/geoalarm-privacy.html` · `/geoalarm-privacy/` · `/mybudget-privacy.html` · `/mybudget-privacy/` · `/mybudget/` · `/garagepad-privacy.html` · `/garagepad-privacy/` · `/garagepad.html` · `/garagepad/` (+ la forma sin extensión `/x` que Pages sirve sola). `/mybudget` sin barra sigue siendo un 301 a `/mybudget/` porque no existe `mybudget.html`; **no se crea** (instrucción expresa). El cambio de nombre a RootJar dentro de la página legal lo hace el propietario aparte.

### 1.2 Actuales que se conservan (ES, 200)
| Ruta | Archivo Astro | Nota |
|---|---|---|
| `/` | `src/pages/index.astro` | Escaparate nuevo |
| `/about` | `about.astro` | |
| `/projects` | `projects/index.astro` | Índice completo, por categorías |
| `/education` | `education.astro` | Experiencia, certificaciones, formación. Anclas nuevas: `#utad #capgemini #appian #oscp #deloitte #certificaciones` |
| `/trayectoria`, `/trajectory` | `trayectoria.astro`, `trajectory.astro` | **Alias con contenido** (misma página renderizada con `canonical` → `/education`). No son redirecciones JS. |
| `/cybersecurity` | `cybersecurity/index.astro` | OSCP+/OSCP, herramientas, lista de writeups (`#writeups`) |
| `/cybersecurity/updown`, `/broker`, `/builder` | `cybersecurity/[id].astro` (getStaticPaths) | Writeup renderizado **en build** desde `public/writeups/*.md`; ya no por `fetch` en cliente |
| `/contact` | `contact.astro` | |
| `/404.html` | `404.astro` | 404 real |
| `/favicon.svg`, `/DiegoArandaGomez-CV-{ES,EN}.pdf`, `/writeups/*.md` | `public/` | Sin cambios |

### 1.3 Nuevas (libres)
| Ruta | Descripción |
|---|---|
| `/projects/<slug>` | "Zona de control" de cada proyecto: `termostato`, `wargame`, `metadata-analyzer`, `volcado-procesos`, `ctfs`, `geoalarm`, `rootjar`, `garagepad` (y los académicos que se añadan). |
| `/en/` y `/en/<ruta>` | Espejo EN de todas las anteriores (`/en/about`, `/en/projects`, `/en/projects/<slug>`, `/en/education`, `/en/cybersecurity`, `/en/cybersecurity/<id>`, `/en/contact`). |
| `/sitemap.xml`, `/robots.txt`, `/og/*.png` | SEO |

**Decisión a confirmar:** las portadas de writeups apuntan a `/cybersecurity/<id>` (URL ya existente), no a `/projects/<slug>`. Así no hay dos URLs para el mismo writeup. Máquinas activas (Silentium, DevHub) no se publican; salen en la estantería solo cuando pasen a retiradas.

### 1.4 Estrategia i18n
- **ES en las rutas actuales, EN bajo `/en/…`** (tu preferencia). Es la opción correcta: conserva las URLs, permite `hreflang` y `<html lang>` correctos y el HTML ya sale traducido (sin esperar a JS).
- `<html lang="es|en">` fijo por página. `<link rel="alternate" hreflang="es|en|x-default">` en cada página; `canonical` por idioma.
- Selector `ES/EN` = enlace a la página equivalente. Al elegir idioma se guarda `localStorage.lang` (valores `'es'`/`'en'`, compatibles con las páginas legales). Si alguien entra en `/` con `lang=en` guardado, se muestra un aviso discreto con enlace a `/en/` (no redirección automática: evita redirecciones de bots y rompe menos enlaces).
- Las páginas legales siguen con su i18n inline y comparten `lang` y `theme`.
- Los writeups (`.md`) están solo en inglés: en `/en/…` se sirven igual; en ES se marca "Writeup en inglés". Traducirlos es opcional y posterior.

## 2. Modelo de contenido (content collections de Astro)

Carpeta `src/content/`. Esquemas con `zod`; un archivo por entrada y por idioma (`es/`, `en/`) o campos `{es,en}` en el frontmatter. Se elige `{es,en}` en el mismo archivo para no desincronizar.

```ts
// src/content.config.ts (resumen)
projects: {
  slug, shelf: 'seguridad'|'apps'|'writeups'|string,   // categoría abierta
  order, status: 'en-curso'|'publicada'|'terminado',
  title, short, tags[], blurb{es,en}, fact{es,en},
  motif: 'dial'|…,  heading, coverFact{es,en},           // portada: SOLO icono (nunca foto); título descriptivo + dato
  cover: { color, fg },                                  // identidad de portada
  detail: { whatIs{es,en}, whatIDid[]{es,en}, stack[], results[]{es,en},
            links: { repo?, demo?, appStore?, report? }, gallery: [{src, alt{es,en}}] },
  legalUrl?: '/geoalarm-privacy.html' | ...,            // siempre string literal, nunca generado
  pending?: ['report-link']                              // marca de placeholders
}
writeups: { id, title, platform:'HTB', os, difficulty:'easy|medium|hard|insane', date,
            file: '/writeups/UpDown.md', status:'retired'|'active', tags[] }
experience: { org, role, from, to?, location, current?, summary{es,en}, highlights[]{es,en}, anchor }
certifications: { id:'oscp-plus'|'oscp'|'appian', name, issuer, date, verifyUrl?, description{es,en}, anchor }
education: { institution, degree, from, to, gpa, highlights[] }
timeline: derivado con `milestone: true` (hoy: Esquí de alto rendimiento [`when: 'Antes'`, sin fecha hasta que la des], U-TAD, Capgemini, OSCP/OSCP+ [protagonista], Deloitte). **Appian no es hito.** `skiing` es una entrada propia de `experience` (`kind: 'sport'`).
```
- **Placeholders marcados:** `report` del termostato = `PENDIENTE` (se muestra "Informe: enlace pendiente" en la página de detalle, sin enlace roto). Cualquier entrada con `pending[]` falla el build en `--strict` y aparece en un informe de pendientes.
- **Datos confirmados ya cargados en el esquema:** RootJar (nombre) con `legalUrl: '/mybudget-privacy.html'`; Metadata Analyzer único en curso con repo `https://github.com/Diego740/Analizador-Metadatos`; `oscp-plus` → `https://credentials.offsec.com/159672f6-9730-4525-a631-628407d0144f#acc.tqr0eo9A`; `oscp` → `https://credentials.offsec.com/ad48ce5c-4ca2-4f5d-b9eb-41cc5db1cb09#acc.B8LsJ1rl`.
- **Los datos hoy en los JSON de i18n** (`src/i18n/locales/*/projects.json`, `education.json`, etc.) son la fuente de verdad; se migran sin reescribir. Las métricas solo las ya publicadas.
- Escalado: añadir un proyecto = un `.md`; añadir una categoría = un `shelf` nuevo (la home pinta los estantes que existan, ordenados por `order`).

## 3. Plan de migración por fases

Cada fase termina con `node scripts/verify-site.mjs` en verde y deploy de **vista previa** (artefacto de Actions o rama) antes de tocar producción.

| Fase | Contenido | Criterio de salida |
|---|---|---|
| **0. Red de seguridad** | Añadir `scripts/verify-site.mjs` + `scripts/legal-hashes.json` (ya creados) al workflow, **sobre el sitio actual**. Renombrar el workflow. Quitar `dist/` local, `react-scroll-parallax`, alias de Vite y script `deploy`. | CI verde sobre el sitio actual |
| **1. Scaffold Astro** | `astro.config.mjs` (`output:'static'`, `build.format:'file'`, `site`, `i18n`), layout base, tokens de la dirección elegida, fuentes autoalojadas, `public/` intacto, `404.astro`. Workflow: `npm ci && astro build` (sin `cp 404`). | Build genera todas las páginas legales sin cambios (hash) y `/`, `/404.html` |
| **2. Contenido** | Content collections + migración de los JSON. Páginas `about`, `education` (+ alias), `cybersecurity`, `contact`. Sustituye las páginas "solo para esta ruta". | Rutas §1.2 en 200 con contenido ES y EN |
| **3. Writeups** | `[id].astro` renderiza el `.md` en build (remark-gfm, `rehype`/shiki, callouts Obsidian, `![[img]]` → `/writeups/images/…` con `srcset`). | 3 writeups idénticos en contenido, 200 y sin `fetch` |
| **4. Home + proyectos** | Escaparate Vinilos v2 (pared clara, estantes, pegatinas, inclinación 3D, **vista rápida con giro**, línea temporal, resúmenes), `/projects`, `/projects/<slug>` (8 páginas con galería: aquí viven las fotos). Flechas prev/next. JS de la home ≈ 3 KB (inclinación + vista rápida: `prototypes/vinilos/app.js` es el punto de partida). | Presupuesto §4 cumplido, accesibilidad §5 en verde |
| **5. i18n EN** | `/en/…`, `hreflang`, selector, aviso de idioma. | `verify-site` en 200 para `NEW` |
| **6. SEO y cierre** | `title`/`description`/OG por página, `sitemap.xml`, `robots.txt`, JSON-LD `Person` + `SoftwareApplication` (GeoAlarm), imagen OG. Retirada de tema "terminal". | Lighthouse ≥95 en todas; `verify-site --live` verde tras el deploy |
| **7. Revisión** | `impeccable detect` + finish review, `inspect` de taste-skill, DESIGN.md regenerado del sitio construido. | Hallazgos resueltos o justificados |

Ramas y despliegue: se trabaja en `redesign`; se despliega a producción solo cuando el propietario lo pida (no hay commits ni push hasta entonces). Si algo falla, `main` sigue sirviendo el sitio actual.

## 4. CI: script de test

`scripts/verify-site.mjs` (+ `scripts/legal-hashes.json`, ambos ya en el repo):
- **Hash:** compara el SHA-256 de las 9 páginas 🔒 en `dist/` con `legal-hashes.json` (generado del commit `3da4e4e`). Cualquier diferencia falla el build.
- **200:** emula las reglas de GitHub Pages (archivo exacto → `x.html` → `x/index.html`) sobre `dist/`, o con `--live <url>` hace `fetch` real sin seguir redirecciones. Comprueba las rutas `KEEP` (actuales) y `NEW` (nuevas).
- Uso en el workflow, después del build y antes de `upload-pages-artifact`:
  ```yaml
  - name: Verify routes and legal pages
    run: node scripts/verify-site.mjs --dist dist
  ```
  Y tras el despliegue (opcional): `node scripts/verify-site.mjs --live https://diego740.github.io`.
- Probado hoy contra el árbol actual: los 9 hashes coinciden con `public/`. La parte de rutas se activa en la fase 1 (hoy fallaría en las rutas SPA: es el comportamiento esperado, hoy dan 404).
- `/mybudget` sin barra no se testea (es un 301 de GitHub Pages a `/mybudget/`, con el mismo resultado que hoy).

## 5. Presupuesto de rendimiento

| Métrica | Presupuesto |
|---|---|
| JS por página (gzip) | **≤ 15 KB** en home; 0 KB en páginas de texto. Sin framework en cliente. Hoy: 244 KB |
| CSS por página (gzip) | ≤ 20 KB. Hoy: 95 KB (flag-icons) |
| Imágenes | AVIF + WebP con `srcset`/`sizes`, `loading="lazy"` salvo LCP, `width`/`height` siempre. Capturas de GeoAlarm: 12 PNG de 31 MB → 6 WebP/AVIF de ≤ 60 KB (≈ 360 px de ancho en portada, ≤ 800 px en galería). Writeups: `<picture>` generado en build, ≤ 150 KB por captura |
| Fuentes | Autoalojadas, WOFF2 subset latino, preload de la principal, `font-display: swap`, ≤ 90 KB en total. Ya probado: Barlow (4 pesos + 2 condensados) 260 KB sin subset fino; Archivo variable y Public Sans variable ≈ 60–90 KB |
| Banderas | Eliminar `flag-icons`: el selector es texto `ES / EN` (sin dependencia) |
| Terceros | **0** (sin Google Fonts, sin jsDelivr, sin analítica) |
| Peso home transferida | ≤ 350 KB con imágenes visibles |
| Core Web Vitals | LCP < 1,8 s, CLS < 0,02, INP < 100 ms (móvil, 4G simulada) |
| Preloader | Eliminado. Contenido visible sin JS |

Herramientas: `sharp` vía `astro:assets`, o `cwebp`/`avifenc` en un script `npm run images` para `public/projects/`.

## 6. Mejoras de accesibilidad (del informe) y estado en los prototipos

| Problema del informe | Solución | Prototipo |
|---|---|---|
| `cursor: none` global | Eliminado; sin cursor propio | ✔ |
| `<html lang="es">` fijo | `lang` por página (`es`/`en`) + `hreflang` | Plan fase 5 |
| Falta `h1` en 4 de 6 páginas | `h1` único por página; `h2`/`h3` jerárquicos | ✔ (home) |
| Morado 3,3:1 sobre negro | Paletas nuevas con contraste ≥4,5:1 (tokens verificados) | ✔ |
| Dificultad 1,7–2,2:1 en tema claro | Etiquetas con fondo sólido y texto de alto contraste | ✔ |
| `:focus-visible` solo en 2 hojas | Anillo de 3 px en todo control; en filas con `tabindex=0` | ✔ |
| Sin skip-link | `Saltar al escaparate` | ✔ |
| Foco no se mueve al cambiar de ruta | Navegación nativa (páginas reales), sin SPA | Estructural |
| Alt genérico "Screenshot N" | Alt descriptivo por imagen (frontmatter `gallery.alt`) | ✔ (GeoAlarm) |
| Galería sin `role="dialog"` ni trampa de foco | `<dialog>` nativo con cierre por Esc y retorno de foco | Fase 4 |
| Animaciones sin `prefers-reduced-motion` | Media query global + sin animación infinita | ✔ |
| Tema sin `prefers-color-scheme` | Valor inicial por esquema del sistema; `localStorage.theme` si existe | Fase 1 |
| Targets táctiles | ≥44 px en acciones | ✔ |
| Preloader bloquea contenido y bots | Eliminado | ✔ |
| Enlaces externos sin aviso | `rel="noopener"` y texto `sr-only` "(se abre en otra pestaña)" | ✔ |

Pendientes surgidos de la crítica: flechas prev/next accesibles en cada estante (`button` con `aria-controls`), reducir los cuatro botones iguales de la cabecera móvil (CV como único relleno; Menú y EN agrupados), indicador de "N proyectos" por estante y revisión de la barra temporal para móvil (mantenerla sticky en una sola fila con scroll horizontal controlado frente a la rejilla 3+2 actual).

## 7. Riesgos y decisiones abiertas

1. **Elegir dirección** (A/B/C). Cambia tokens y portadas, no la estructura.
2. **Identidad por portada.** Las tres críticas independientes coinciden en que pictogramas de línea sobre color plano se leen como plantilla. Opciones: (a) ilustración a medida de 8–10 portadas (la mejor), (b) tipografía grande con sigla por proyecto, (c) capturas reales recortadas donde existan. Hay que decidirlo antes de la fase 4.
3. **Fechas:** OSCP/OSCP+ y Deloitte comparten "Sept 2026". Confirmar mes/orden exacto para la línea temporal.
4. **Informe del termostato:** enlace de Drive pendiente (`PENDIENTE` en la página de detalle).
5. **RootJar:** el texto "MyBudget" sigue en `public/mybudget-privacy.html` (lo tocas tú aparte) y en el título `<title>` de esa página.
6. **Writeups en inglés** únicamente.
7. **GeoAlarm sin ficha propia en el sitio hasta fase 4:** `/projects/geoalarm` será la nueva "página de soporte/marketing" posible; el alias `/geoalarm` (404 hoy) no se crea salvo que lo pidas.

## 8. Decisiones tomadas tras revisar los prototipos
- **Dirección: Vinilos** (con pared clara). Ver `docs/DIRECCIONES-diseno.md` §5.
- **Miniaturas = iconos.** Las fotos y capturas solo en la página del proyecto. Cierra el riesgo "identidad por portada" parcialmente: seguimos necesitando un icono distinto y reconocible por proyecto (hoy hay 11 motivos dibujados a mano; revisar su calidad en la fase 4).
- **Vista rápida:** sustituye al clic directo a la página. Sin JS degrada a enlace. El `<dialog>` nativo se evalúa en la fase 4 (hoy es un `div` con `role="dialog"`, `aria-modal`, trampa de foco y retorno de foco).
- **Línea temporal sin Appian y con esquí**; falta confirmar si el esquí lleva años.

## 9. Estado de la fase 0 (hecha en la rama `redesign`, sin commit)
- Workflow renombrado a `.github/workflows/deploy-pages.yml` ("Deploy to GitHub Pages") con el paso `node scripts/verify-site.mjs --dist dist --legal-only` tras el build.
- `scripts/verify-site.mjs` admite `--legal-only` (sitio actual: solo hashes de las 9 URLs 🔒). Sin ese flag también comprueba el 200 de las rutas.
- Eliminados `react-scroll-parallax` y `gh-pages`, el script `deploy` y el alias muerto de `vite.config.js`. `dist/` local obsoleto borrado y regenerado.
- Comprobado: `npm run build` correcto y los 9 hashes de las páginas legales coinciden en `dist/`.

## 10. Estado de la fase 1 (hecha en la rama `redesign`, sin commit)
- **Dirección confirmada: Vinilos con sombras** (versión de referencia, no la variante estricta de taste-skill).
- Astro 5.18 estático con `build.format: 'file'`, `i18n` declarado (ES por defecto, `/en/` preparado). El SPA de React queda en `legacy/` (código y JSON de i18n, fuente de contenido para la fase 2); las dependencias de React/Vite se han quitado de `package.json`.
- Nuevo: `src/layouts/Base.astro`, `src/pages/index.astro` (home Vinilos completa con vista rápida), `src/pages/404.astro` (404 real), `src/styles/global.css`, `src/scripts/home.js`, `src/data/home.mjs` (temporal; pasa a content collections en la fase 2), Archivo autoalojada en `public/fonts/`.
- Medido: CSS 13 KB (3,9 KB gzip), JS inline ≈ 2 KB, HTML de la home 6,2 KB gzip, sin terceros.
- `npm run build` genera `/`, `/404.html` y copia `public/` intacto: los 9 hashes 🔒 coinciden. `npm run check:site` (comprobación completa de rutas) falla a propósito en las rutas de la fase 2 (`/about`, `/projects`, …) hasta que existan.
- Pendiente de la fase 1: tema claro/oscuro y clave `localStorage.theme` (la home actual solo tiene la pared clara).

## 11. Estado de las fases 2 y 3 (hechas en la rama `redesign`, sin commit)
- **Content collections** (`src/content.config.ts`, datos en `src/content/*.json`, textos bilingües `{es,en}`): `experience`, `certifications` (OSCP+, OSCP y Appian, con los enlaces de verificación), `education` y `writeups`. Contenido migrado literalmente de `legacy/src/i18n`.
- **Páginas ES y EN**: `/about`, `/education` (+ alias `/trayectoria` y `/trajectory` con contenido real y `canonical` → `/education`), `/cybersecurity`, `/contact`, y `/en/about`, `/en/education`, `/en/cybersecurity`, `/en/contact`. `hreflang`, `canonical` y `<html lang>` correctos en cada una.
- **Writeups** `/cybersecurity/{updown,broker,builder}` y `/en/cybersecurity/…`: Markdown renderizado en build (Shiki, GFM, imágenes `![[…]]` → `/writeups/images/…` con `loading="lazy"`), cabecera con plataforma, SO, dificultad y etiquetas, botón "Copiar" en bloques de código. Silentium y DevHub (activas) salen bloqueadas y sin página.
- **Pendiente para que `npm run check:site` quede en verde:** `/projects`, `/projects/<slug>` (fase 4) y `/en/`, `/en/projects` (fase 5). Los 9 hashes 🔒 siguen coincidiendo.
- Observaciones: los writeups actuales no usan callouts de Obsidian (`> [!note]`), así que no se ha portado `ObsidianCallout`; si aparecen en futuros writeups habrá que añadir un plugin remark. El ES de `/cybersecurity/<id>` muestra "Writeup en inglés".

## 12. Estado tras la fase 4 (borrador de contenido y páginas de proyecto)
- **Callouts de Obsidian** (`> [!note] Título`) soportados en los writeups (plugin remark propio en `src/lib/writeup.mjs`, estilos en `global.css`); tipos note/info, tip/success, warning/caution, danger/bug/important, quote.
- **Colección `projects`** (`src/content/projects.json`, ES/EN): 8 proyectos con detalle + 4 "otros" sin página. GaragePad completo con tu texto (problema, funcionamiento, límites, notas) traducido al ES y el vídeo de CarPlay. El resto, redactado solo con lo ya publicado en el sitio; lo que falta aparece en un recuadro "Pendiente de completar" y se recoge en `docs/CUESTIONARIO-proyectos.md`.
- **Páginas:** `/projects` y `/projects/<slug>` (ES) y `/en/projects` y `/en/projects/<slug>`. La home y el índice leen de la colección (`src/lib/shelves.mjs`): añadir un proyecto = una entrada en JSON.
- **Medios:** `public/media/` (no se usan carpetas con el nombre de una página, para no chocar con `/projects/<slug>` en GitHub Pages). GeoAlarm: 12 PNG de ~2,6 MB → 12 WebP de 25–36 KB. GaragePad: vídeo provisional 320×568 (718 KB) con póster.
- **Pendiente:** `/en/` (home EN, fase 5), `<dialog>` para ampliar las fotos de la galería, tema claro/oscuro, SEO (OG, sitemap, JSON-LD).

## 13. Ajustes tras revisión de contenido
- Portadas de apps por lo que hacen ("Mandos del Flipper desde el coche", "Control de gastos", "Alarma GPS"); la privacidad queda en el cuerpo y en el enlace legal.
- GaragePad: vídeo arriba, `how` recortado a 3 viñetas (arquitectura, la historia de la pantalla manual, CarPlay), resto en el bloque plegable "Detalles técnicos" y consejos de uso en "Detalles de uso".
- **Opción A para los proyectos sin página:** estante "Desarrollo" en `/projects` con portadas de vinilo (Gestor de Espacios, Web de Películas, Simulador de Caché, Modelos de IA) que abren la vista rápida (sin enlace a detalle). No aparecen en la home. Componente común `src/components/Cover.astro`.

## 14. Estado de la fase 5 (hecha en la rama `redesign`, sin commit)
- **Home en inglés** `/en/` (`HomePage.astro` con prop `lang`; textos en `src/data/homeText.mjs`), con `hreflang`, `canonical` y `<html lang="en">`. Selector ES/EN guarda `localStorage.lang`.
- **Modo oscuro** con `localStorage.theme` (`'dark'`/`'light'`, misma clave que las páginas legales). El valor inicial sale de `prefers-color-scheme`; un script inline en `<head>` lo aplica antes de pintar (sin parpadeo). Botón en todas las cabeceras. Tokens de página (`--wall`, `--shelf`, `--text`, `--btn`…) separados de los colores de portada, que no cambian.
- **Carruseles a sangre con flechas** (`.scroller`): las filas llegan hasta el borde de la pantalla, de modo que la siguiente portada asoma cortada; las flechas anterior/siguiente aparecen solo si queda contenido en esa dirección. También en la galería de cada proyecto.
- **Build:** `scripts/postbuild.mjs` añade `X/index.html` cuando existe `X.html`, para que `/en/`, `/projects/` y `/cybersecurity/` (con barra) devuelvan 200 igual que sin barra. `npm run check:site` pasa completo; los 9 hashes legales intactos.
- Pegatina EN: `IN DEV` (cabe en el círculo).
- **Pendiente:** SEO (Open Graph, sitemap, robots, JSON-LD), `<dialog>` para ampliar fotos, aviso de idioma, y quitar los recuadros "Pendiente de completar".

## 15. Estado de la fase 6 (SEO y visor de fotos; rama `redesign`, sin commit ni push)
- **Metaetiquetas:** Open Graph y Twitter Card en todas las páginas (`og:title/description/url/locale/image`, `summary_large_image`), imagen social `public/og/default.png` (1200×630, hecha con la identidad del sitio), `canonical` y `hreflang` ya existentes.
- **Datos estructurados (JSON-LD):** `Person` en las dos homes (cargo en Deloitte, U-TAD, perfiles de LinkedIn/GitHub y las dos credenciales OffSec con su enlace de verificación) y `MobileApplication` en las páginas de apps con enlace de App Store (hoy, GeoAlarm). No se declara ningún dato que no esté ya publicado en el sitio.
- **`/sitemap.xml`** generado en el build (37 URLs: páginas ES/EN con `hreflang`, proyectos, writeups y las 3 páginas legales) y **`/robots.txt`** con la referencia al sitemap.
- **Visor de fotos** con `<dialog>` nativo: Esc y clic fuera cierran, el foco vuelve a la miniatura, alt descriptivo y botón de cerrar de 44 px.
- **Pendiente antes de publicar:** quitar los recuadros "Pendiente de completar" (cuestionario), textos alternativos reales de las capturas, OG específica por proyecto si se quiere, aviso de idioma (opcional) y revisión final con `impeccable detect` + `inspect`. Después: decidir commit, PR y fecha de publicación. **No se ha hecho ningún commit ni push:** `main` sigue intacto y GitHub Pages sirve el sitio actual.

## 16. Legibilidad para buscadores e IA (hecha; sin cambios visuales)
- **JSON-LD** (`src/lib/jsonld.mjs`): `Person` en las homes ES/EN y en `/about` y `/en/about` (jobTitle "Security Architecture Analyst", Deloitte, U-TAD, `sameAs` GitHub/LinkedIn, `knowsAbout` = tus hard skills publicadas, `hasCredential`); `EducationalOccupationalCredential` para OSCP+ y OSCP (emisor OffSec, `dateCreated` 2026-09, `url` de verificación) en Trayectoria y Ciberseguridad; `SoftwareApplication` en las apps (GeoAlarm con su enlace de App Store) y `CreativeWork` en el resto; `TechArticle` con `datePublished` en cada writeup.
- **`/robots.txt`** permite todo y nombra GPTBot, ClaudeBot, PerplexityBot y Google-Extended, con enlace al sitemap. **`/sitemap.xml`** con `hreflang` e incluye las 3 páginas legales tal cual.
- **`/llms.txt` y `/en/llms.txt`**: generados en build desde las colecciones (quién eres en 3 líneas, About, Experiencia, Certificaciones con enlace de verificación, Proyectos, Writeups y Contacto), así que no se quedan desactualizados.
- **Comprobado:** el `<body>` de las páginas muestreadas es idéntico antes y después (solo cambia el `<head>`); todo el JSON-LD es JSON válido; ningún texto se muestra solo a bots. El texto "visually hidden" que existe (p. ej. "(se abre en otra pestaña)") es para lectores de pantalla y lo lee igual una persona con tecnología de apoyo. Páginas legales 🔒 sin tocar.

## 17. Actualización a Astro 7.3.8 (seguridad)
- `npm audit`: de 5 vulnerabilidades (1 crítica, 3 altas, 1 baja, todas heredadas de Astro 5.18.2) a **0**. Requiere Node ≥ 22.12 (el CI usa `lts/*`).
- Cambios necesarios: `@astrojs/markdown-remark` pasa a dependencia directa; los writeups se leen con `process.cwd()` (el bundler ya no conserva rutas relativas a `import.meta.url`); las colecciones se ordenan siempre por un campo `order` (Astro 7 no garantiza el orden de `getCollection`).
- Verificado frente al build de Astro 5: 43 páginas con `<head>` y JSON-LD idénticos, `llms.txt`, `en/llms.txt` y `robots.txt` idénticos, mismas 37 URLs en el sitemap, 9 hashes legales intactos, `check:site` completo en verde y las interacciones (tema, vista rápida, flechas, visor de fotos) funcionando. Único cambio en el HTML: el script inline sale minificado de otra forma.

## 18. Páginas legales 🔒: nueva regla (diseño nuevo, contenido intacto)
**Regla vigente:** se puede cambiar el diseño; no se pueden cambiar rutas, texto, anclas, nombre de la app, claves `theme`/`lang` ni los 6 stubs.
- **Extracción:** `scripts/extract-legal.mjs` (una vez, se conserva) leyó los HTML originales y generó `src/content/legal/<app>.json` (title, description, textos de interfaz ES/EN, navegación) y `<app>.es.html` / `<app>.en.html` (fragmentos con el texto legal, marcado y anclas originales). Los HTML originales quedan en `tests/fixtures/legal/` (idénticos a `HEAD`).
- **Páginas:** `src/pages/{geoalarm,mybudget,garagepad}-privacy.astro` + `LegalPage.astro`; con `build.format: 'file'` salen como `/<app>-privacy.html` (también sin extensión). Los 3 `.html` originales se retiraron de `public/`; los stubs siguen en `public/` y sin tocar.
- **ES por defecto sin JavaScript** (el EN está en el HTML con `hidden`); `legal.js` cambia de idioma, guarda `lang`, cambia `document.title` y gestiona el `#hash` (ES: `#politica-de-privacidad`, `#terminos-de-uso`; EN: `#…-en`; en EN, `#privacy-policy` → `#privacy-policy-en`, etc.). GeoAlarm tenía ES y EN en un diccionario JS: ahora ambos están en el HTML (ids EN con sufijo `-en`; los ids originales son los de ES).
- **Sin terceros:** fuentes autoalojadas; fuera Google Fonts, jsDelivr y `flag-icons`. Añadido `meta robots index, follow` y `canonical` a la URL `.html`; title y description propios.
- **CI** (`scripts/verify-legal.mjs`, integrado en `verify-site.mjs` y en el workflow): texto visible por idioma idéntico al original (por regiones: volver, badge, título, subtítulo, navegación, contenido, pie), mismas anclas, mismos enlaces del contenido (emails, AEPD, EULA…), ES visible por defecto, robots/canonical/title/description, sin recursos de terceros, y 6 stubs por hash. Se comprobó que el test falla si cambia una palabra o falta un ancla.
- **Decoración excluida de la comparación:** la flecha "←" del enlace de volver y el emoji ⚡ del badge de GaragePad (eran adorno, no texto legal).
- **Mejora menor en el #hash:** un ancla `…-en` ahora también cambia a EN (antes el destino quedaba oculto).
- **Hallazgo y corrección:** el minificador de CSS de Astro 7 fusionaba `font` + `font-stretch: NN%` en una declaración inválida y el navegador la descartaba (títulos sin la anchura de Archivo en todo el sitio). Se sustituyó por `font-variation-settings: "wdth" NN`.
