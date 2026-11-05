# AUDITORÍA DEL PORTFOLIO ACTUAL — diego740.github.io

- Fecha del análisis: 2026-11-04
- Alcance: solo lectura (código, historial git y comprobaciones HTTP `GET/HEAD` contra `https://diego740.github.io`). No se ha modificado ningún archivo salvo este informe.
- Commit base: `3da4e4e` (rama `main`, árbol limpio). 56 commits en total.
- Convención: "no existe" = comprobado y no existe en el repo ni en el sitio publicado.

---

## 0. RESUMEN EJECUTIVO

**Qué es hoy.** Una SPA de React 18 + Vite 7 con React Router 7, desplegada en GitHub Pages por un workflow de Actions. Tiene tema oscuro/claro (morado `#8a2be2`), estética "terminal/hacker", i18n ES/EN en cliente y 6 rutas internas. Aloja además 3 páginas legales de apps iOS (GeoAlarm, MyBudget, GaragePad) como HTML estático independiente en `public/`.

**Qué transmite.** Perfil junior-senior de ciberseguridad ofensiva (OSCP, Active Directory, Red/Blue Team) con vertiente de desarrollo de apps iOS con privacidad por diseño. El contenido es sólido y coherente en ES/EN. La imagen es muy "tema hacker": preloader de terminal, cursor propio, burbujas animadas, 404 con glitch.

**Qué funciona.** Contenido bilingüe completo. CV descargable. Writeups en Markdown renderizados con resaltado de sintaxis y callouts de Obsidian. Las páginas legales son autónomas (CSS/JS inline) y tienen ES/EN y tema. Los enlaces externos principales responden.

**Qué no funciona o está mal.**
1. **SEO:** un único `<title>`/`description` para todo el sitio y sin Open Graph, sitemap ni robots. Todas las rutas SPA salvo `/` devuelven **HTTP 404** (verificado: `/about`, `/cybersecurity/updown`) y solo se ven por el fallback `404.html`.
2. **Rendimiento:** un preloader obliga a esperar ≥2,4 s y el contenido no se renderiza hasta que termina. Las imágenes pesan ~40 MB sin optimizar (PNG de 2–3 MB). El CSS de `flag-icons` pesa 470 KB (95 KB gzip) para usar 2 banderas.
3. **Accesibilidad:** `cursor: none` global, `<html lang="es">` fijo aunque se cambie a EN, falta `h1` en 4 de 6 páginas, contraste del morado sobre negro de 3,3:1 y colores de dificultad con 1,7–2,2:1 en tema claro.
4. **Datos:** `DiegoArandaGomez-CV-EN.pdf` y `-ES.pdf` son **el mismo archivo** (mismo hash). Faltan datos de la web: no hay formulario de contacto (solo `mailto:`), no hay sección de idiomas hablados y no hay imagen OG.
5. **Deuda técnica:** `vite.config.js` aliasa `react-scroll-parallax` a un archivo que ya no existe. El workflow se llama `jekyll-gh-pages.yml` pero no usa Jekyll. Hay una dependencia sin uso (`react-scroll-parallax`) y otra legacy (`gh-pages`).

### Restricciones duras para el rediseño (resumen)
- **Conservar exactamente 🔒:** `/geoalarm-privacy.html`, `/mybudget-privacy.html`, `/garagepad-privacy.html`. También sus variantes con carpeta (`/x/`), sin extensión (`/x`) y los alias `/mybudget/`, `/mybudget`, `/garagepad/`, `/garagepad`, `/garagepad.html`. Detalle en §2.2.
- Esas páginas **no dependen del CSS/JS del SPA**. Sí dependen de: `/favicon.svg`, del enlace `/` (logo y "volver"), de los CDN Google Fonts y jsDelivr, y de las claves `localStorage` `theme` y `lang` (mismo origen).
- No debe haber `CNAME`/dominio propio nuevo ni cambio de repo (`diego740.github.io` es el repo de usuario, la URL raíz es la del repo).
- Mantener las rutas públicas `/about`, `/projects`, `/education` (+ alias `/trayectoria`, `/trajectory`), `/cybersecurity`, `/cybersecurity/{updown,broker,builder}`, `/contact`, `/DiegoArandaGomez-CV-{EN,ES}.pdf` y `/writeups/*.md` (accesibles hoy públicamente).
- Mantener `/favicon.svg` (usado por las 3 páginas legales).
- **El enlace de App Store de GeoAlarm** (`https://apps.apple.com/app/id6768651486`) está en el sitio. Qué URL exacta está registrada en App Store Connect no se puede saber desde el repo (ver §2.2, "pendiente de confirmar con el propietario").

### Recomendación técnica (breve)
**Astro 5 en modo estático (`output: 'static'`) con `build.format: 'file'`**, desplegado con el mismo workflow de Pages.
- Genera HTML real por ruta (`/about.html` servido en `/about` con 200, igual que hoy GitHub Pages ya sirve `/garagepad` desde `garagepad.html`), lo que arregla el HTTP 404 de las rutas y el SEO (title/description/OG por página).
- `public/` se copia tal cual, así que las 3 páginas legales y sus alias salen **byte a byte iguales**; no las pasa por ninguna plantilla.
- Hace falta poco JS (solo islas para tema, idioma y galería), lo que baja el peso, y deja el diseño libre sin atarse a React.
- Mantiene `markdown` nativo para los writeups (Obsidian `![[img]]` se resuelve con un plugin remark pequeño o en el build) y sustituye el `cp dist/index.html dist/404.html` por una `404.astro` real.
- Alternativa si se quiere conservar React: Vite + prerender estático por ruta. Es más trabajo y deja más JS, por eso no se recomienda.

---

## 1. STACK Y DESPLIEGUE

### 1.1 Tecnología
**React SPA con Vite. No es HTML plano, ni Jekyll, ni Astro.** No existe `Gemfile`, ni `_config.yml`, ni `.nojekyll`, ni `CNAME`.

`package.json` (`name: portfolio`, `version: 1.0.0`, `private`, `"type": "module"`):

| Script | Comando |
|---|---|
| `dev` | `vite` |
| `build` | `vite build && cp dist/index.html dist/404.html` |
| `preview` | `vite preview` |
| `deploy` | `gh-pages -d dist` (legacy, no se usa: despliega el workflow) |

Dependencias (declarado → instalado, `npm ls`):

| Paquete | Declarado | Instalado | Uso |
|---|---|---|---|
| react / react-dom | ^18.2.0 | 18.3.1 | UI |
| react-router-dom | ^7.18.4 | 7.18.4 | Rutas (`BrowserRouter`) |
| framer-motion | ^10.16.4 | 10.18.0 | Animaciones |
| i18next / react-i18next | ^23.11.5 / ^13.5.0 | 23.16.8 / 13.5.0 | i18n ES/EN |
| react-icons | ^4.12.0 | 4.12.0 | Iconos (fa, fi, hi, md, bs) |
| flag-icons | ^7.5.0 | 7.5.0 | Banderas del selector de idioma |
| react-markdown / remark-gfm / rehype-highlight | ^10.1.0 / ^4.0.1 / ^7.0.2 | 10.1.0 | Render de writeups |
| highlight.js | ^11.11.1 | 11.11.1 | Tema `atom-one-dark.css` |
| **react-scroll-parallax** | ^3.5.0 | 3.5.0 | **Sin uso**: ningún `import` en `src/` |
| @vitejs/plugin-react (dev) | ^4.2.0 | 4.7.0 | |
| vite (dev) | ^7.2.7 | 7.3.7 | |
| **gh-pages** (dev) | ^6.1.1 | 6.3.0 | **Legacy**, el despliegue real es el workflow |

Node local: v22.13.1. No hay TypeScript, ni tests, ni linter, ni Tailwind.

`vite.config.js`: plugin React, `base: '/'`, y un alias `react-scroll-parallax → src/lib/react-scroll-parallax.jsx`. **Ese archivo se borró en `7da7701` (2026-03-28)**: el alias es código muerto y no rompe nada porque nadie importa el paquete.

### 1.2 Despliegue en GitHub Pages
- **Origen:** GitHub Actions (artefacto `./dist`), no "deploy from branch". No se ha podido leer la configuración de Pages (no hay `gh` CLI); se deduce del workflow.
- **Workflow:** `.github/workflows/jekyll-gh-pages.yml` (nombre interno "Deploy static content to Pages", **engañoso: no hay Jekyll**).
  - Disparador: `push` a `main` + `workflow_dispatch`.
  - Permisos: `contents: read`, `pages: write`, `id-token: write`. `concurrency: pages` con `cancel-in-progress`.
  - Pasos: `actions/checkout@v5` → `actions/setup-node@v6` (Node `lts/*`, caché npm) → `npm ci` → `npm run build` → `actions/configure-pages@v5` → `actions/upload-pages-artifact@v4` (path `./dist`) → `actions/deploy-pages@v4`.
- **Paso de build:** `vite build && cp dist/index.html dist/404.html`. El `404.html` es **copia exacta del `index.html` del SPA** (así el fallback de GitHub Pages carga el router). Consecuencia: **toda ruta SPA ≠ `/` se sirve con HTTP 404** (verificado con `curl`).
- `public/` se copia íntegro a `dist/` (así llegan las páginas legales, PDFs, writeups e imágenes).
- Rama de despliegue: `main`. Rama `gh-pages`: no existe (`git branch -a` solo muestra `main`, `origin/main`).
- `CNAME`: no existe (se sirve en `diego740.github.io`). `.nojekyll`: no existe (no hace falta: Pages publica el artefacto de Actions sin Jekyll). `404.html`: no está versionado; se genera en el build. `public/404.html` existió un día y se revirtió (ver §2.3).
- `sitemap.xml`: no existe (404). `robots.txt`: no existe (404).
- `dist/` está en `.gitignore`. En local hay un `dist/` obsoleto con duplicados de Finder (`index 2.html`, `garagepad 2.html`, `garagepad-privacy 3.html`, `mybudget-privacy 3.html`, `favicon 2.svg`, `Broker 3.md`…). **No se despliega** (el CI hace build limpio), pero conviene borrarlo.

### 1.3 Árbol de carpetas comentado
```
diego740.github.io/
├── index.html                     # Entrada Vite: <head>, tema inicial, preloader terminal inline, <div id="root">
├── package.json / package-lock.json
├── vite.config.js                 # Plugin React, base '/', alias muerto a src/lib/
├── README.md                      # Bilingüe ES/EN, menciona React+Vite
├── .gitignore                     # Ignora dist, node_modules, .claude, .superpowers, docs/superpowers
├── .github/workflows/
│   └── jekyll-gh-pages.yml        # Despliegue a Pages (npm ci → build → deploy-pages)
├── public/                        # Se copia tal cual a la raíz del sitio
│   ├── favicon.svg                # "D" morada sobre negro, 64×64
│   ├── DiegoArandaGomez-CV-EN.pdf # 128 KB (idéntico al ES)
│   ├── DiegoArandaGomez-CV-ES.pdf # 128 KB (idéntico al EN)
│   ├── geoalarm-privacy.html      # 🔒 28 KB legal GeoAlarm (inline CSS/JS)
│   ├── geoalarm-privacy/index.html# 🔒 stub redirect → /geoalarm-privacy.html
│   ├── mybudget-privacy.html      # 🔒 64 KB legal+soporte MyBudget
│   ├── mybudget-privacy/index.html# 🔒 stub redirect
│   ├── mybudget/index.html        # 🔒 stub redirect → /mybudget-privacy.html
│   ├── garagepad-privacy.html     # 🔒 44 KB legal GaragePad
│   ├── garagepad-privacy/index.html # 🔒 stub redirect
│   ├── garagepad.html             # 🔒 stub redirect → /garagepad-privacy.html
│   ├── garagepad/index.html       # 🔒 stub redirect
│   ├── projects/GeoAlarm/         # 12 capturas PNG (31 MB) para la galería del proyecto
│   └── writeups/                  # Markdown de writeups + images/ (8,7 MB)
├── src/
│   ├── main.jsx                   # Monta React, BrowserRouter, i18n, CSS global, flag-icons
│   ├── App.jsx                    # Rutas, tema (localStorage 'theme'), preloader, ExternalRedirect
│   ├── index.css                  # Tokens (variables CSS), reset, utilidades
│   ├── pages/                     # Home, About, Projects, Education, Cybersecurity, WriteupViewer, Contact, NotFound (+ .module.css)
│   ├── components/                # Navbar, Footer, ThemeToggle, LanguageSwitcher, AnimatedBackground, CustomCursor,
│   │                              # SectionHeader, SkillTag, ProjectCard, ProjectsInProgress, FeaturedProjects,
│   │                              # HomeProjects, WriteupCard, ImageGalleryModal, ObsidianCallout
│   ├── config/                    # socialLinks.js (GitHub/LinkedIn), writeups.js (índice de writeups)
│   ├── hooks/useCardGlow.js       # Brillo de tarjetas que sigue al cursor
│   ├── i18n/                      # index.js + locales/{es,en}/*.json (10 namespaces)
│   ├── styles/Education.css       # Único CSS global de página (no módulo)
│   ├── utils/markdownPreprocess.js# Convierte ![[img.png]] de Obsidian a rutas /writeups/images/
│   └── assets/README.md           # Carpeta vacía salvo README (sin assets importables)
├── dist/                          # (ignorada) build local obsoleto, 86 MB, con duplicados de Finder
├── docs/superpowers/              # (ignorada) specs/plans internos de rediseños anteriores
├── .claude/ .superpowers/ state/  # (ignoradas / vacía) herramientas de IA locales; `state/` vacía
└── node_modules/
```

---

## 2. MAPA COMPLETO DE URLs

### 2.1 Comportamiento de GitHub Pages que condiciona todo (verificado con `curl`)
- `/x.html` existente → se sirve en `/x.html` **y** en `/x` (200, sin redirección).
- `/x/index.html` existente → se sirve en `/x/` (200); `/x` sin barra redirige 301 a `/x/` **solo si no existe `x.html`**.
- Ruta inexistente → `404.html` con **HTTP 404**. Es lo que sirve hoy el SPA para `/about`, etc.

Resultados reales (`https://diego740.github.io…`):

| Ruta | HTTP | Resultado |
|---|---|---|
| `/` | 200 | SPA (`index.html`) |
| `/about` | **404** | SPA vía `404.html` |
| `/cybersecurity/updown` | **404** | SPA vía `404.html` |
| `/garagepad`, `/garagepad/`, `/garagepad.html` | 200 | Stub redirect → `/garagepad-privacy.html` |
| `/garagepad-privacy`, `/garagepad-privacy/`, `/garagepad-privacy.html` | 200 | `/garagepad-privacy` y `.html` = documento real; `/garagepad-privacy/` = stub redirect |
| `/mybudget` | **301 → `/mybudget/`** | luego stub redirect |
| `/mybudget-privacy`, `/mybudget-privacy.html` | 200 | Documento real |
| `/geoalarm`, `/geoalarm/` | **404** | SPA NotFound (no existe alias) |
| `/geoalarm-privacy`, `/geoalarm-privacy/`, `/geoalarm-privacy.html` | 200 | Real (`.html` y sin extensión) / stub (`/`) |
| `/404.html` | 200 | SPA |
| `/sitemap.xml`, `/robots.txt` | 404 | no existen |
| `/DiegoArandaGomez-CV-EN.pdf` | 200 | PDF |
| `/writeups/UpDown.md` | 200 | `text/markdown` (público, crudo) |

### 2.2 Tabla de URLs públicas

Leyenda: 🔒 = INTOCABLE. SPA = servida por `404.html` (HTTP 404 pero renderiza). Título = `document.title` / `<title>`.

#### 🔒 Páginas legales / soporte de apps (INTOCABLES)

| # | URL servida (exacta) | Archivo fuente | Título | App / propósito | Depende de plantilla/CSS/JS compartido |
|---|---|---|---|---|---|
| 🔒1 | `/geoalarm-privacy.html` (≡ `/geoalarm-privacy`) | `public/geoalarm-privacy.html` | `Privacy Policy — GeoAlarm` | **GeoAlarm** (iOS, publicada en App Store `id6768651486`). Política de privacidad + términos (secciones `#privacy-policy`, `#terms-of-service`). Contacto por email. ES/EN. Última actualización: Mayo 2026 | CSS y JS **inline**. Externos: Google Fonts, `cdn.jsdelivr.net/npm/flag-icons@7.5.0`. Local: `/favicon.svg`, enlace `/` (logo y "volver"), `localStorage` `theme` y `lang` |
| 🔒2 | `/geoalarm-privacy/` | `public/geoalarm-privacy/index.html` | `Redirecting to GeoAlarm Legal...` | Stub: `meta refresh` + `location.replace('/geoalarm-privacy.html' + hash)` | Ninguna |
| 🔒3 | `/mybudget-privacy.html` (≡ `/mybudget-privacy`) | `public/mybudget-privacy.html` | `MyBudget — Textos legales y soporte` | **MyBudget** (iOS, en desarrollo, sin enlace de store aún). Política (14 secciones), condiciones (11), **soporte técnico con FAQ** (`#support`), cómo **eliminar datos** (sec. 12), enlace a AEPD. ES/EN. Citan el EULA estándar de Apple | Igual que 🔒1. Gestiona `#hash` para cambiar idioma |
| 🔒4 | `/mybudget-privacy/` | `public/mybudget-privacy/index.html` | `Redirecting to MyBudget Legal & Support...` | Stub → `/mybudget-privacy.html` | Ninguna |
| 🔒5 | `/mybudget/` (y `/mybudget` → 301 a esta) | `public/mybudget/index.html` | `Redirecting to MyBudget Legal & Support...` | **Página "raíz de la app"** → redirige a `/mybudget-privacy.html`. Candidata a ser la "URL de marketing/soporte" en App Store Connect | Ninguna |
| 🔒6 | `/garagepad-privacy.html` (≡ `/garagepad-privacy`) | `public/garagepad-privacy.html` | `GaragePad — Textos legales y soporte` | **GaragePad** (iOS/CarPlay, en desarrollo). Privacidad (8 secciones), términos (7), contacto. Anclas `#privacy-policy`, `#terms-of-use`, `#politica-de-privacidad`, `#terminos-de-uso`, `#about`, + versiones `-en`. ES/EN | Igual que 🔒1. Gestiona `#hash` con `decodeURIComponent` |
| 🔒7 | `/garagepad-privacy/` | `public/garagepad-privacy/index.html` | `Redirecting to GaragePad Legal & Support...` | Stub → `/garagepad-privacy.html` | Ninguna |
| 🔒8 | `/garagepad.html` (≡ `/garagepad`) | `public/garagepad.html` | idem | **Página "raíz de la app"** GaragePad → redirige a `/garagepad-privacy.html` | Ninguna |
| 🔒9 | `/garagepad/` | `public/garagepad/index.html` | idem | Stub → `/garagepad-privacy.html` | Ninguna |

Rutas de fallback del SPA para esas mismas URLs (`src/App.jsx`, componente `ExternalRedirect`): `/mybudget-privacy`, `/mybudget-privacy.html`, `/mybudget`, `/geoalarm-privacy`, `/geoalarm-privacy.html`, `/garagepad`, `/garagepad.html`, `/garagepad-privacy`, `/garagepad-privacy.html` → `window.location.replace(destino + hash)`. En producción **no se alcanzan**: los archivos estáticos existen y Pages los sirve antes. Son una red de seguridad si algún día se quita un archivo.

**Notas críticas de las 🔒**
1. **Qué URL está dada de alta en App Store Connect no consta en el repo.** Debe confirmarlo el propietario antes de tocar nada. Hasta entonces se tratan como INTOCABLES las 9 rutas de arriba y los sufijos `#…`. Solo GeoAlarm tiene enlace de store en la web; MyBudget y GaragePad figuran "en desarrollo".
2. Cada app tiene **tres URLs equivalentes** (`x.html`, `x` y `x/`), con comportamiento distinto: dos sirven el documento y una sirve un stub. Hay que conservar las tres.
3. `/geoalarm` no existe (404). Si alguna ficha de store usara `/geoalarm` como URL de soporte/marketing, ya está rota hoy.
4. Las páginas llevan `meta robots index, follow`, pero **no hay `canonical`**, así que Google puede indexar las 3 variantes como duplicados.
5. **Incoherencia legal para revisar:** GeoAlarm declara "Sin Terceros" y GaragePad/MyBudget "sin rastreo", pero las tres páginas cargan Google Fonts y un CDN (jsDelivr) desde el navegador del visitante (envía su IP a terceros). Conviene decidir en el rediseño si se autoalojan fuentes y banderas.
6. Los textos legales tienen **fecha de última actualización** (GeoAlarm: Mayo 2026): no deben cambiar de contenido sin revisión legal, solo de estilo si se decidiera tocarlas (no recomendado).

#### Páginas del SPA (HTTP 404 con render del router)

| URL | Fuente | Título | Propósito |
|---|---|---|---|
| `/` (200, real) | `index.html` + `pages/Home.jsx` | `Diego Aranda Gómez \| Cybersecurity & Software Engineer (OSCP)` | Hero + secciones apiladas **Sobre mí + Proyectos (en curso y destacados) + Contacto** |
| `/about` | `pages/About.jsx` | (igual que arriba) | Sobre mí, descarga de CV, skills técnicas y soft skills |
| `/projects` | `pages/Projects.jsx` | (igual) | Proyectos en curso, destacados y completados |
| `/education` | `pages/Education.jsx` | (igual) | Trayectoria: experiencia, certificaciones, formación |
| `/trayectoria`, `/trajectory` | `pages/Education.jsx` | (igual) | **Alias** no enlazados desde ningún sitio (posible herencia de URL antigua) |
| `/cybersecurity` | `pages/Cybersecurity.jsx` | (igual) | Banner OSCP, herramientas, lista de writeups |
| `/cybersecurity/updown` | `pages/WriteupViewer.jsx` | (igual) | Writeup UpDown (Markdown) |
| `/cybersecurity/broker` | `pages/WriteupViewer.jsx` | (igual) | Writeup Broker |
| `/cybersecurity/builder` | `pages/WriteupViewer.jsx` | (igual) | Writeup Builder |
| `/cybersecurity/silentium`, `/cybersecurity/devhub` | `pages/WriteupViewer.jsx` | — | Máquinas activas sin archivo: **redirigen (replace) a `/cybersecurity`** |
| `/contact` | `pages/Contact.jsx` | (igual) | Email, LinkedIn, GitHub (no hay formulario) |
| `cualquier otra` | `pages/NotFound.jsx` | (igual) | 404 estilo terminal "SEÑAL PERDIDA / SIGNAL LOST" |
| `/404.html`, `/index.html` | `dist/` (copia del SPA) | (igual) | Fallback de Pages |

Las variantes con barra final (`/about/`) caen en 404.html y el router las acepta.

El título es **estático para todas las rutas**: no hay `document.title`, ni Helmet, ni `canonical` por ruta.

#### Archivos estáticos públicos

| URL | Fuente | Notas |
|---|---|---|
| `/favicon.svg` | `public/favicon.svg` | Usado por SPA y por las 3 páginas legales 🔒 (**dependencia dura**) |
| `/DiegoArandaGomez-CV-ES.pdf` / `-EN.pdf` | `public/` | Enlace de descarga de About según idioma. **Mismo archivo** (sha256 igual) |
| `/writeups/{UpDown,Broker,Builder}.md` | `public/writeups/` | Markdown crudo accesible y cargado por `fetch` desde el visor |
| `/writeups/images/*.png` | `public/writeups/images/` | 20 PNG (+ `.gitkeep`) |
| `/projects/GeoAlarm/Frame {1..6}.png`, `Frame {1..6}-1.png` | `public/projects/GeoAlarm/` | Galería de GeoAlarm (EN usa `Frame n.png`, ES usa `Frame n-1.png`). Nombres con **espacios** (se sirven como `%20`) |
| `/assets/index-*.js`, `/assets/index-*.css`, `/assets/*.svg` | build Vite | Hash en el nombre; no son URLs estables |

### 2.3 Historial de git: URLs borradas o renombradas
Revisado `git log --all --name-status` (56 commits):
- **Rutas del SPA:** nunca se ha quitado ninguna. Los `-` en `App.jsx` son reescrituras de las mismas rutas. Solo se **añadieron** `/cybersecurity/:id`, `/trayectoria`, `/trajectory` y las de redirect.
- `public/404.html`: añadido en `f4daedb` (2026-03-28) y revertido en `d015147` el mismo día. Probablemente nunca fue relevante.
- `public/projects/GeoAlarm/GeoAlarm1.jpg … GeoAlarm6.jpg`: añadidos en `5b32dfc` (2026-04-25) y **borrados** en `1f42f7e` (2026-05-08), sustituidos por `Frame n.png`. Era una galería interna; es improbable que haya enlaces externos.
- `src/config/publicKeys.js` (borrado en `2520328`): contenía IDs/claves públicas de **EmailJS** (formulario de contacto retirado en `c4270ff`, "Remove emailjs-com dependency"). Siguen en el historial. Son claves públicas por diseño de EmailJS, pero conviene revocar/rotar la clave si ya no se usa.
- `public/geoalarm-privacy.html` se creó en `1f42f7e` (2026-05-08) y las carpetas `/geoalarm-privacy/`, `/mybudget*/` el 2026-10-09 (`3b8273d`); `/garagepad*` el 2026-10-27 (`3da4e4e`). No se ha renombrado ni borrado ninguna URL legal.
- No hay `sitemap.xml`, `robots.txt` ni `CNAME` en ningún commit.

### 2.4 Enlaces internos rotos
- **No hay enlaces internos rotos** entre los definidos en componentes y locales: todos (`/cybersecurity`, `/projects`, `/geoalarm-privacy.html`, `/mybudget-privacy.html`, `/garagepad-privacy.html`, PDFs, imágenes) existen.
- **Problemas reales de enrutado:**
  - Todas las rutas SPA responden **HTTP 404** (ver 2.1) aunque rendericen.
  - `/geoalarm` (sin `-privacy`) → NotFound. No hay equivalente a `/mybudget` y `/garagepad`.
  - `/cybersecurity/silentium` y `/cybersecurity/devhub` no tienen página: redirigen a la lista.
  - El enlace del proyecto "CTF Writeups" apunta a `/cybersecurity` con `<a href>` (recarga completa, no `Link`), y el de `privacyUrl` también (recarga completa; correcto para `.html` estático).
  - Nombres de imagen con espacios (`Frame 1-1.png`) requieren codificación `%20`; funcionan, pero son frágiles.

### 2.5 Enlaces externos
| Destino | Dónde | Estado (2026-11-04) |
|---|---|---|
| `https://github.com/Diego740` | Hero, Contacto, Footer | 200 |
| `https://www.linkedin.com/in/diego-aranda-gomez` | Hero, Contacto, Footer | 999 (bloqueo anti-bot de LinkedIn; no verificable por script) |
| `mailto:diegoaranda.dev@gmail.com` | Contacto, README, 3 páginas legales 🔒 | — |
| `https://apps.apple.com/app/id6768651486` | Proyecto GeoAlarm | 200 |
| `https://github.com/Diego740/Analizador-Metadatos.git` | Proyecto destacado y en curso | 200 (la URL lleva `.git`) |
| `https://github.com/Diego740/MemoryDumpTool-WinApi` | Proyecto completado | 200 |
| `https://drive.google.com/file/d/16mxXQpSL3WSaXcJAnss93JoElSvgP0E-/view?usp=sharing` | Smart Thermostat Security Audit (informe PDF) | **401** al consultarlo sin sesión; **verificar a mano** que sigue compartido públicamente |
| `https://fonts.googleapis.com`, `fonts.gstatic.com` | `index.html` y legales 🔒 | CDN, carga de Inter y Roboto Mono |
| `https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/…` | legales 🔒 | CDN |
| `https://www.aepd.es`, `https://diego740.github.io` | MyBudget / GaragePad legales 🔒 | — |

---

## 3. CONTENIDO: QUÉ DICE EL PORTFOLIO SOBRE MÍ

Todo el texto vive en `src/i18n/locales/{es,en}/*.json`. Salvo lo indicado como "hardcodeado". Idioma por defecto: ES.

### 3.1 Hero (Home `/`)
**ES** (`home.json`)
- Etiquetas: `Ingeniería del Software` · `Ciberseguridad` · `OSCP`
- Prompt decorativo: `init()`
- Título (efecto máquina de escribir): `Diego Aranda Gómez`
- Subtítulo: "Ingeniero de software especializado en ciberseguridad (OSCP) y analista de arquitectura de seguridad en Deloitte. Experiencia práctica en operaciones ofensivas y defensivas, bastionado de infraestructuras y automatización en Linux, Windows, Active Directory y Cloud."
- CTAs: `Conectar en LinkedIn` · `Ver GitHub` · `Explorar` (baja a la siguiente sección)
- aria: "Abrir perfil de LinkedIn en una nueva pestaña" / "Abrir perfil de GitHub en una nueva pestaña" / "Desplazarse a la siguiente sección"

**EN**
- Etiquetas: `Software Engineering` · `Cybersecurity` · `OSCP`
- Título: `Diego Aranda Gómez`
- Subtítulo: "Security-focused software engineer (OSCP certified) and Security Architecture Analyst at Deloitte. Hands-on experience in offensive and defensive operations, infrastructure hardening, and security automation across Linux, Windows, Active Directory, and Cloud."
- CTAs: `Connect on LinkedIn` · `View GitHub` · `Explore`

**Preloader** (hardcodeado en `index.html`, solo EN): `> INITIALIZING SYSTEM...` / `> DOWNLOADING DATA...` / `> PREPARING REPO...` / `> STARTING...`

### 3.2 Sobre mí (`/about` y sección de Home)
**ES**
- Eyebrow/Título: `Sobre mí`
- Texto: "Graduado en Ingeniería del Software con especialización en Ciberseguridad (U-TAD, GPA 8.3/10) y certificado OSCP (Offensive Security Certified Professional). Actualmente Analista de Arquitectura de Seguridad en Deloitte. Me enfoco en operaciones ofensivas y defensivas, bastionado de sistemas y automatización de la seguridad en entornos Windows, Linux, Active Directory y Cloud. Además, fui deportista de esquí alpino de alta competición, una disciplina que me aportó constancia, resiliencia y templanza bajo presión."
- Botón: `Descargar CV`
- Hard skills & Tecnologías: Pentesting, Red & Blue Team, Bastionado / Hardening, Active Directory, Wazuh SIEM, Análisis Forense, Ingeniería Inversa, MITRE ATT&CK, OWASP, Linux, Windows, AWS, Docker, Kubernetes, Netskope, Zscaler, Python, Bash, PowerShell, Swift, C, C++, Java, JavaScript, React, Node.js, SQL, MongoDB, Appian, WinAPI
- Competencias & Valores: "Esquí alpino de alta competición (resiliencia y disciplina)", "Capacidad para trabajar bajo presión", "Resolución analítica de problemas", "Gran autonomía e iniciativa", "Trabajo en equipo y colaboración ágil", "Organización y planificación estratégica"

**EN**
- `About Me` — "Software Engineering graduate specialized in Cybersecurity (U-TAD, GPA 8.3/10) and OSCP certified (Offensive Security Certified Professional). Currently working as a Security Architecture Analyst at Deloitte. Focused on offensive and defensive operations, infrastructure hardening, and security automation across Windows, Linux, Active Directory, and Cloud. Additionally, I was a high-performance alpine skier—a background that instilled discipline, resilience, and composure under sustained pressure."
- `Download CV` · `Hard Skills & Tech Stack` (misma lista, "Hardening", "Forensic Analysis", "Reverse Engineering") · `Core Strengths & Values`: "High-performance alpine skiing (resilience & discipline)", "Ability to thrive under sustained pressure", "Analytical problem-solving", "High autonomy and proactive mindset", "Agile teamwork and cross-collaboration", "Organization and strategic planning"

### 3.3 Proyectos
Cabecera ES: eyebrow `Proyectos`, título "Ingeniería, seguridad y soluciones con impacto", descripción "Una selección de proyectos que abarcan auditorías de seguridad, aplicaciones nativas con privacidad por diseño, automatización con IA y operaciones Red & Blue Team." EN: `Projects` / "Engineering, security, and high-impact solutions" / "A curated selection of projects spanning security assessments, privacy-first native applications, AI-driven automation, and Red & Blue Team operations."

Secciones: **En desarrollo** ("Proyectos en curso"), **Proyectos destacados**, **Finalizados** ("Proyectos completados"). Home muestra en curso + destacados + botón "Ver todos los proyectos" (`/projects`).

#### En curso
| Proyecto | Estado / inicio | Enfoque | Objetivos (ES) | Repo | Enlaces |
|---|---|---|---|---|---|
| **MyBudget - Finanzas Personales en iOS** (EN: *MyBudget - iOS Personal Finance App*) | "Desarrollo de apps" / Octubre 2026 | Aplicación móvil · iOS · Swift · CloudKit · Privacidad | "Gestión integral de finanzas personales, presupuestos y metas de ahorro con procesamiento 100% local en dispositivo." / "Sincronización segura mediante iCloud (CloudKit) con cifrado de extremo a extremo en campos de contenido personal." / "Integración nativa con iOS: Widgets con modo de privacidad, Siri, Atajos, autenticación Face ID / Touch ID y exportación en CSV." | Privado / en preparación | 🔒 `/mybudget-privacy.html`. Sin store |
| **GaragePad - Mandos de Garaje en iPhone y CarPlay** (EN: *GaragePad - Garage Remotes for iPhone & CarPlay*) | "Desarrollo de apps" / Octubre 2026 | Aplicación móvil · iOS · CarPlay · Widgets · Bluetooth · Privacidad | "Unifica hasta cuatro mandos o puertas en un solo widget para la pantalla de inicio del iPhone y CarPlay." / "Emisión directa por Bluetooth a dispositivos compatibles como Flipper Zero para reproducción de señales de radio." / "Arquitectura 100% local: sin cuentas, sin servidores, sin analíticas y sin rastreo de ningún tipo." | Privado / en preparación | 🔒 `/garagepad-privacy.html`. Sin store |
| **Analizador y Modificador de Metadatos** (EN: *Metadata Analyzer and Editor*) | "Desarrollo aplicado" / Octubre 2025 | Ciberseguridad · Programación · Scripting · Python · IA | "Diseñar proceso para extraer metadatos de archivos." / "Correlacionar patrones sospechosos con posibles amenazas." / "Permitir mantener la privacidad de los diferentes usuarios." | `https://github.com/Diego740/Analizador-Metadatos.git` | — |

#### Destacados (ES literal; EN equivalente en `en/projects.json`)
1. **Smart Thermostat Security Audit** — tech: "IoT · Pentesting · Ingeniería Inversa · Firmware". "Evaluación integral de seguridad en hardware, flujos de la app móvil y componentes cloud de un ecosistema IoT real. Descubrimiento de 3+ vulnerabilidades críticas (RCE en backend, credenciales en texto plano y claves API hardcodeadas) y generación de informe priorizado de remediación con PoCs de reproducción." Enlace: informe en Google Drive (ver §2.5). Terminado. Sin imágenes.
2. **GeoAlarm - iOS Location Alarm App** — tech: "Swift · Privacy-by-Design · iOS · App Store". "App nativa de iOS publicada en la App Store con computación 100% en dispositivo y cero dependencias en la nube (privacidad por diseño, sin SDKs de rastreo). Reducción del consumo de batería en un ~80% mediante geofencing con CoreLocation e implementación de override de AVAudioSession para garantizar el aviso sonoro." Enlace: App Store `id6768651486`. 🔒 `/geoalarm-privacy.html`. Galería: 6 capturas (`Frame n-1.png` en ES, `Frame n.png` en EN). **Publicado.**
   - EN: "Shipped a native iOS app to the App Store with 100% on-device computation and zero cloud dependencies — privacy-by-design, no tracking SDKs. Reduced battery consumption ~80% via CoreLocation geofencing; implemented AVAudioSession override to guarantee delivery regardless of hardware silent switch state."
3. **Metadata Analyzer & Threat Correlator** — "Python · Automatización de Seguridad · IA". "Herramienta en Python para extraer, sanitizar y analizar metadatos en más de 5 formatos, reduciendo el tiempo de revisión manual en un ~70%. Diseñada con lógica de correlación automatizada para detectar y alertar ante patrones anómalos vinculados a manipulación documental, fugas o procedencia de riesgo." Repo: `Diego740/Analizador-Metadatos`. **Duplicado conceptual** del proyecto "Analizador y Modificador de Metadatos" que aparece también en "en curso" (mismo repo, estado inconsistente: aquí figura como terminado y allí como en curso).
4. **University Wargame Environment** — "Red & Blue Team · Active Directory · Wazuh SIEM · DMZ". "Operaciones ofensivas y defensivas en máquinas reales sobre segmentos de red aislados con arquitectura DMZ, atacando y bastionado hosts Windows y Linux. Ejecución de cadenas de ataque en Active Directory (enumeración, movimiento lateral y escalada de privilegios) y despliegue/operación de Wazuh SIEM para correlación de logs y detección de amenazas." Sin enlace.
5. **CTF Writeups** — "Ciberseguridad · CTF · Forense · Web · Reversing". "Colección de writeups de competiciones CTF e investigación en seguridad. Cubre explotación web, análisis forense, ingeniería inversa y retos binarios con soluciones detalladas paso a paso." Enlace: `/cybersecurity`.

#### Completados (ES; todos terminados, sin imágenes)
| Título | Tecnologías | Descripción literal ES | Enlace |
|---|---|---|---|
| Gestor de Espacios y Proyectos Colaborativos | React · Node.js · MongoDB | "Aplicación web para organizar la reserva de mesas y la gestión de proyectos en un espacio de trabajo universitario. Desarrollada con un cliente real, aplicando metodologías ágiles y despliegue continuo." | ninguno |
| Herramienta de Volcado de Procesos | WinAPI · C · Sockets | "Herramienta para volcar procesos mediante WinAPI, incluidos procesos protegidos." | `github.com/Diego740/MemoryDumpTool-WinApi` |
| CTFs de Ciberseguridad | Burp Suite · Wireshark · Nmap · Otras | "Participación en desafíos CTF con foco en análisis forense, pentesting web y resolución de retos ofensivos y defensivos." | ninguno |
| Web de Películas (API) | React · API Externa | "Plataforma interactiva para explorar películas y obtener detalles dinámicos mediante el consumo de APIs públicas." | ninguno |
| Simulador de Memoria Caché | C | "Proyecto académico que reproduce la gestión de memoria caché utilizando estructuras dinámicas para visualizar asignaciones y liberaciones." | ninguno |
| Modelos de Inteligencia Artificial | Python · LLMs · CNNs | "Generador de texto: Modelo entrenado para crear texto coherente a partir de datasets lingüísticos. Clasificador de imágenes pulmonares: CNN que diferencia pulmones sanos de enfermos para apoyar diagnósticos tempranos." | ninguno |

(EN: *Collaborative Space and Project Manager*, *Process Dump Tool*, *Cybersecurity CTFs*, *Movie Web (API)*, *Cache Memory Simulator*, *Artificial Intelligence Models*.)

**Observación:** el "Smart Thermostat Security Audit" y el "University Wargame" no tienen repositorio ni demo público; el único enlace del primero es un PDF en Drive (401 sin sesión).

### 3.4 Writeups de ciberseguridad
Índice: `src/config/writeups.js` (lista manual en código). Visor: `pages/WriteupViewer.jsx`.

| ID | Título | Plataforma | OS | Dificultad | Estado | Fecha | Formato | Ruta |
|---|---|---|---|---|---|---|---|---|
| silentium | Silentium | **no indicada en el repo** | Linux | Easy | `active` (bloqueado, sin archivo) | 2026-04-15 | — | sin página |
| updown | Updown | HTB (etiqueta `#htb`) | Linux | Medium | `retired` | 2026-05-07 | Markdown (Obsidian) | `/writeups/UpDown.md` → `/cybersecurity/updown` |
| broker | Broker | HTB (`#htb`) | Linux | Easy | `retired` | 2026-05-15 | Markdown | `/writeups/Broker.md` → `/cybersecurity/broker` |
| builder | Builder | HTB (`#htb`) | Linux | Medium | `retired` | 2026-05-15 | Markdown | `/writeups/Builder.md` → `/cybersecurity/builder` |
| devhub | DevHub | **no indicada** | Linux | Medium | `active` (bloqueado) | 2026-06-05 | — | sin página |

- No hay writeups en HTML ni PDF. En el repo no consta THM, VulnHub ni CTFs de competición; el texto del proyecto "CTF Writeups" habla de CTFs en general.
- Etiquetas internas: UpDown `#htb #ctf #medium #cve #LFI #Git #SUID #Python #Abuse`; Broker `#linux #htb #ctf #activemq #rce #nginx #privesc`; Builder `#linux #htb #ctf #jenkins #CVE-2024-23897`.
- Tamaños: UpDown 208 líneas/6 KB; Broker 178/4 KB; Builder 170/7 KB.
- **Render:** `fetch(writeup.file)` en cliente → comprueba que no sea HTML/404 → `preprocessObsidianMarkdown` (`![[img.png]]` → `![](/writeups/images/img.png)`; `[[wikilink]]` → texto) → `react-markdown` + `remark-gfm` + `rehype-highlight` (tema `atom-one-dark`) con `ObsidianCallout` para `blockquote` y botón "Copy" para `pre`. Los metadatos de cabecera (fecha, OS, dificultad) vienen del `writeups.js`, no del Markdown (el Markdown repite `**Date:**`, `**Difficulty:**`, `**Tags:**` en el cuerpo). No hay generación en build: el contenido no es indexable.
- Imágenes de writeups: 20 PNG; 13 referenciadas con `![[ ]]` (UpDown 9, Broker 2, Builder 2). **Sin referenciar** en el Markdown (7): `Builder3`, `UpDown7`, `UpDown9`, `UpDown10`, `UpDown13`, `UpDown14`, `UpDown15`.
- Cybersecurity page — herramientas (hardcodeadas en inglés en el JSX, **no traducidas**): "OSCP Methodologies (OffSec Certified)", "Active Directory (BloodHound · Mimikatz)", "Wazuh SIEM (Detection & Log Correlation)", "Burp Suite Pro (Web Exploitation)", "Nmap & Network Reconnaissance", "Wireshark & Network Forensics", "Metasploit Framework", "Hashcat & John the Ripper", "Reverse Engineering (Ghidra · WinAPI)", "Linux & Windows Hardening", "Enterprise Infrastructure (Netskope · Zscaler · AWS)".
- Cabecera ES: `Ciberseguridad` / "Estrategias defensivas y ofensivas" / "Ingeniero de software enfocado en seguridad y certificado OSCP (Offensive Security Certified Professional), actualmente Analista de Arquitectura de Seguridad en Deloitte. Experiencia contrastada en operaciones Red & Blue Team, bastionado de sistemas e infraestructuras críticas, y análisis de vulnerabilidades. Especializado en cadenas de ataque en Active Directory, entornos Linux y Windows, automatización de la seguridad y detección de amenazas con SIEM (Wazuh)." EN: `Cybersecurity` / "Defensive and offensive strategies".
- Banner OSCP: insignia `OSCP`, título hardcodeado "Offensive Security Certified Professional", subtítulo ES "OffSec Certified · Expedida en Septiembre 2026", descripción ES "Acredita capacidades avanzadas en reconocimiento, explotación de aplicaciones y servicios, escalada de privilegios en Linux/Windows y cadenas de ataque en dominios Active Directory." (EN equivalentes en `en/cybersecurity.json`.)
- Textos UI ES: `Writeups`, `Leer writeup`, `Máquina activa`, `Volver`, "No se pudo cargar el writeup", "La respuesta recibida no parece ser un Markdown válido. Prueba a recargar la página en unos segundos.", estados `Activa`/`Retirada`.

### 3.5 Apps (página, política y store)
| App | Página propia | Política / términos / soporte | Store | Estado |
|---|---|---|---|---|
| GeoAlarm | **No existe** (no hay `/geoalarm`). Solo tarjeta en Proyectos con galería | 🔒 `/geoalarm-privacy.html` (privacidad + términos; contacto por email) | App Store `https://apps.apple.com/app/id6768651486` | Publicada |
| MyBudget | **No existe**; `/mybudget/` redirige a la legal | 🔒 `/mybudget-privacy.html` (privacidad, términos, soporte/FAQ, eliminar datos) | Ninguno | En desarrollo (desde oct 2026) |
| GaragePad | **No existe**; `/garagepad`, `/garagepad.html` redirigen a la legal | 🔒 `/garagepad-privacy.html` (privacidad, términos, contacto) | Ninguno | En desarrollo (desde oct 2026) |

No hay Google Play ni ficha Android en ningún sitio. No hay capturas de MyBudget ni de GaragePad.

### 3.6 Experiencia, formación, certificaciones, skills, idiomas, contacto
**Experiencia** (`/education`, `education.json`): se muestra completa.
- **Security Architecture Analyst — Deloitte**, Madrid, "Sept 2026 – Actualidad" (insignia "Puesto actual"): "Análisis y diseño de arquitectura de seguridad para infraestructuras corporativas, enfocado en evaluación de riesgos, bastionado de sistemas, seguridad en la nube y alineación estratégica con marcos de referencia de la industria."
- **Software Engineering Intern — Capgemini**, Madrid, "Oct 2025 – Abr 2026": "Desarrollo de software y consultoría técnica en sistemas empresariales de producción bajo metodologías ágiles (Agile)." Logros: "Lideré de principio a fin la refactorización de un sistema empresarial en producción, desplegando nuevas funcionalidades de forma iterativa." / "Aceleré las entregas mediante la integración de herramientas de IA en el flujo de diseño, testing y documentación técnica." / "Obtuve la certificación Appian Certified Associate Developer en 3 meses, demostrando una rápida adaptación a una plataforma tecnológica nueva."

**Certificaciones** — se muestran en `/education` y destacadas en `/cybersecurity`:
- **OSCP — Offensive Security Certified Professional**, OffSec, expedida **Septiembre 2026**. Aparece en: etiqueta del hero, `<title>`, meta description, About, banner de Cybersecurity, Education y README. Descripción ES: "Certificación de referencia en seguridad ofensiva y pruebas de penetración (pentesting). Acredita destreza práctica en auditorías avanzadas, reconocimiento, explotación de aplicaciones web, elevación de privilegios en Linux y Windows, evasión de defensas y ejecución de cadenas de ataque en entornos complejos de Active Directory." **Falta** ID de credencial, enlace de verificación (Credly/OffSec) y logo.
- **Appian Certified Associate Developer**, Appian, **Marzo 2026**: "Certificación oficial que acredita competencias en desarrollo de aplicaciones empresariales, automatización de procesos de negocio, modelado de arquitecturas y buenas prácticas de ingeniería de software en entornos ágiles." Sin ID ni enlace.

**Formación:** Grado en Ingeniería del Software (Mención Ciberseguridad), U-TAD, Madrid, "Septiembre 2022 – Junio 2026", insignia "Graduado · GPA: 8.3/10". Destacados: "Redes de Computadores: 9.7 (Matrícula de Honor)", "Algoritmos: 9.6". Descripción ES: "Graduado con especialización en Ciberseguridad. Formación técnica rigurosa en desarrollo seguro, arquitecturas distribuidas, análisis forense digital, redes de computadores y sistemas operativos." (EN dice además "Graduated with honors in technical subjects", frase que no está en ES: inconsistencia.)

**Skills:** ver 3.2 (30 hard skills + 6 soft skills como `SkillTag`, sin niveles).

**Idiomas hablados (inglés, español, etc.):** **no existe** sección ni mención.

**Contacto y redes** (`/contact`, ES): eyebrow `Contacto`, título "Construyamos algo juntos", "¿Tienes un proyecto, una idea o simplemente quieres saludar? Escríbeme y hablemos." Bloque "Información directa": `diegoaranda.dev@gmail.com`, `LinkedIn`, `GitHub`. Nota: "Trato de responder con la mayor brevedad posible. Cuéntame tu idea de ciberseguridad, desarrollo web, inteligencia artificial o similares y podemos trabajar juntos." (EN: "Let's build something together" / "Direct information"). **No hay formulario** (EmailJS retirado), ni teléfono, ni X/Twitter, ni HackTheBox/TryHackMe, ni Credly, ni Medium. Solo GitHub y LinkedIn en `socialLinks.js`.

**Footer:** ES "© 2026 Diego Aranda Gómez — Desarrollado con React" / EN "© 2026 Diego Aranda Gómez — Built with React". Iconos GitHub y LinkedIn. No hay enlaces a políticas de privacidad desde el footer.

**404:** ES "> SEÑAL PERDIDA" / "La ruta {{path}} no fue encontrada." / "Puede que el archivo haya sido movido, renombrado o que la dirección contenga un error" / "Volver al inicio" / "> Estado: escuchando..." / "> Sugerencia: comprobar la URL o regresar al hub principal." (EN: "> SIGNAL LOST", "The path … was not found.", "Return home".)

**Navbar:** Inicio · Sobre mí · Proyectos · Trayectoria · Ciberseguridad · Contacto (+ clave `ai`/"IA" sin uso). EN: Home · About · Projects · Trajectory · Cybersecurity · Contact.

### 3.7 Idiomas del sitio (ES/EN) — implementación
- `i18next` + `react-i18next`, recursos **empaquetados** en el bundle (10 namespaces × 2 idiomas), `useSuspense: false`, `defaultNS: 'home'`.
- Idioma inicial: `localStorage.lang` o `'es'` (**no** usa `navigator.language`). `fallbackLng: 'es'`.
- Selector: banderas `fi-es` / `fi-gb` (librería `flag-icons`), guarda en `localStorage.lang`.
- **Misma URL para ambos idiomas** (no hay `/en/`). Consecuencias: un solo `<title>`/description (ES) para todo, `hreflang` imposible, indexación solo en ES. `<html lang>` fijo en `es` aunque la UI esté en inglés (no se actualiza).
- Los writeups (`.md`) están **solo en inglés**. Textos hardcodeados fuera de i18n: lista de herramientas de Cybersecurity, "Offensive Security Certified Professional", "Copy/Copied" del visor, preloader (inglés), alt de la galería ("Screenshot N"), `defaultValue` en ES de `certSubtitle`/`certDesc`.
- Las páginas legales 🔒 tienen **su propio i18n inline** (diccionario JS + `data-i18n`) y comparten `localStorage.lang`/`theme` con el SPA.

---

## 4. ASSETS

| Asset | Ruta | Peso | Dónde se usa | Notas |
|---|---|---|---|---|
| Favicon | `public/favicon.svg` | 729 B | `index.html`, 3 legales 🔒 | SVG con fuente `Helvetica` (depende de fuente del sistema). No hay `.ico`, `apple-touch-icon`, ni manifest |
| CV ES / EN | `public/DiegoArandaGomez-CV-{ES,EN}.pdf` | 128 KB cada uno | About (`download`) según idioma | **Idénticos** (mismo sha256): el CV en inglés probablemente es el español. Fechados 2026-05-06 |
| GeoAlarm capturas | `public/projects/GeoAlarm/Frame {1-6}.png` (EN) y `Frame {1-6}-1.png` (ES) | 2,2–3,1 MB c/u, **31 MB** total, 1320×2668 RGBA | `ImageGalleryModal` desde `projects.json` | Todas usadas. Sin WebP/AVIF, sin `srcset`, sin `loading=lazy`. Dos juegos casi idénticos por idioma |
| Imágenes de writeups | `public/writeups/images/*.png` | 8,7 MB, 20 archivos | `![[..]]` en los `.md` | Broker1, Builder1-3: 1,6–2,2 MB (3600×2336). **Sin usar (7):** Builder3, UpDown7, 9, 10, 13, 14, 15. `.gitkeep` sin función |
| Banderas | `flag-icons` (CSS+SVG) | CSS 470 KB (95 KB gzip); `dist/assets/` = 6,5 MB con ~270 SVG | Selector de idioma (solo `es` y `gb`) | Se carga la hoja completa en SPA y vía CDN en legales |
| Fuentes | Google Fonts: Inter 300–700, Roboto Mono 400/500/700 | remoto | `index.html` y legales | Sin autoalojar; sin `font-display` controlado |
| Iconos | `react-icons` (fa, fi, hi, md, bs) | en el JS | Navbar, botones, tarjetas | Tree-shaken |
| Logos / ilustraciones / fotos de perfil / OG image | — | — | — | **no existe** (el logo es texto `<Diego/>`; no hay foto) |
| Vídeos | — | — | — | **no existe** |
| `src/assets/` | solo `README.md` | — | — | Vacía (sin imports de assets) |

Bundles del build local (`dist/`, 2026-10-27): `index-*.js` 767 KB (244 KB gzip), `index-*.css` 470 KB (95 KB gzip), en un único chunk (sin code splitting por ruta).

---

## 5. DISEÑO ACTUAL

### 5.1 Sistema visual
- **Estética:** "terminal/hacker" oscuro con acentos morados: prompt `init()`, máquina de escribir, cursor parpadeante, 404 con scanlines y glitch, nombre de la marca `<Diego/>`.
- **Paleta** (tokens en `src/index.css`, duplicada en los `<style>` de las legales):

| Token | Oscuro | Claro |
|---|---|---|
| `--bg-color` | `#0a0a0a` | `#fafafa` |
| `--background-canvas` | `#050505` | `#f4f4ff` |
| `--card-bg` | `#121212` | `#ffffff` |
| `--text-color` | `#ffffff` | `#0a0a0a` |
| `--secondary-text` | `#cfcfcf` | `#333333` |
| `--accent-color` | `#8a2be2` | `#8a2be2` |
| `--accent-warm` | `#a855f7` | — |
| bordes | `rgba(255,255,255,.1)` | `rgba(0,0,0,.1)` |
| gradiente botón | `rgba(138,43,226,.88)→rgba(98,0,238,.72)` | mezcla con blanco |

  Otros valores sueltos: dificultad `#4ade80` (Easy), `#fb923c` (Medium), `#f87171` (Hard), `var(--accent-color)` (Insane); código `#282c34`/`#abb2bf` (atom-one-dark); `#1e2030`. No hay segundo color de marca: todo es **un solo tono morado + neutros**.
- **Tipografías:** Inter (cuerpo) y Roboto Mono (todos los `h1–h4`, etiquetas, botones tipo terminal). Tamaños en `rem` sueltos (0.72–1.2 rem muy repetidos; escala no definida). Hero con `clamp`.
- **Espaciado:** contenedor `.section-container` = `min(1100px, 90vw)`, padding `6rem 0 4rem`; gaps 0.75–2 rem sin escala formal.
- **Breakpoints (en uso):** `max-width` 480, 560, 600 (×5), 720, 768 (×4); `min-width` 768, 900, 1024. **Sin sistema único**: 9 valores distintos.
- **Componentes repetidos:** `SectionHeader` (eyebrow + h2 + p), `SkillTag`, `ProjectCard` (lista numerada `01`, `02`…), `InProgressCard` (timeline con acordeón de objetivos), `WriteupCard`, tarjetas con `useCardGlow` (brillo que sigue al ratón), botón primario/secundario "terminal outline", `gradient-border`, `ImageGalleryModal`, insignias (`education-badge`, `certBadge`).
- **Animaciones:** `framer-motion` en casi todo (entrada de páginas con `AnimatePresence`, `whileInView` en cada bloque, hero con 2 "glows" flotantes, flecha "Explorar" infinita, acordeón, toggle de tema con spring); `AnimatedBackground` (gradiente móvil + **10 burbujas aleatorias** con animación infinita en cada ruta); `CustomCursor` (punto + anillo con muelle); keyframes CSS: `blink`, `blinkFade`, `flicker`, `glitchShift`, `morphGradient`, `morphParticle`, `pulse`. `prefers-reduced-motion` solo se respeta en 3 hojas CSS y en el typewriter del hero; **no** en framer-motion, el fondo ni el cursor.
- **Librerías UI:** ninguna de componentes (no MUI/Chakra/Tailwind/shadcn). Todo CSS Modules (`*.module.css`, ~2.900 líneas) más `Education.css` global. Sin CSS reset externo.
- **Tema:** claro/oscuro con `data-theme` y `localStorage.theme` (por defecto **oscuro**, no respeta `prefers-color-scheme`); script en `<head>` evita el parpadeo.

### 5.2 Navegación
- **Menú:** barra superior fija con logo `<Diego/>` + 6 enlaces + selector de idioma; en móvil, botón hamburguesa con panel animado. Toggle de tema **flotante** independiente (`ThemeToggle`), no está en la barra.
- **Profundidad:** `/` (hero + 3 secciones apiladas) → 1 clic a cualquier sección (`/about`, `/projects`, `/education`, `/cybersecurity`, `/contact`) → 2 clics a un writeup (`/cybersecurity/:id`). Contenido de About, Projects (parcial) y Contact está **duplicado**: aparece en Home y en su ruta propia.
- La página 'Trayectoria' no se puede alcanzar desde la Home (solo por el menú). Los writeups solo desde `/cybersecurity`. Las páginas legales de las apps solo desde el enlace "Privacidad & Términos" de cada proyecto (no hay enlace en el footer).
- Scroll: `scrollTo top smooth` en cada cambio de ruta; sin gestión de foco al navegar (accesibilidad).

### 5.3 Problemas detectados
**Rendimiento**
- Preloader con **retardo artificial mínimo de 2,4 s** (más hasta `load`) y el `<Routes>` no se monta hasta que termina (`isSiteLoaded`): un visitante o bot sin JS ve solo el loader; con JS, espera siempre ≥2,4 s.
- JS 767 KB (244 KB gzip) en un único chunk. CSS 470 KB (95 KB gzip), la mayor parte de `flag-icons`.
- Imágenes ~40 MB en total sin optimizar: capturas de GeoAlarm de 2–3 MB ×12; writeups de hasta 2,2 MB. Sin `loading="lazy"`, sin formatos modernos.
- Cargas de terceros bloqueantes: Google Fonts (CSS render-blocking) en SPA y legales.
- 10 burbujas + 2 glows + gradiente animados continuamente y `transition` global en `*` (`* { transition: background-color .3s, color .3s, border-color .3s }`), que causa trabajo de repintado innecesario ("safari lag fix" en el historial, `40182d9`, apunta a que ya hubo problemas).
- Todas las rutas con HTTP 404 → peor rastreo/indexación, posible penalización y métricas rotas en herramientas.

**Accesibilidad**
- `cursor: none` global en `html, body` + cursor propio solo en dispositivos con puntero fino: si JS falla, **no hay cursor**; incomoda a usuarios con baja visión.
- `<html lang="es">` fijo: lectores de pantalla leen el contenido inglés con voz española.
- **Jerarquía de headings:** `/about`, `/projects`, `/contact`, `/cybersecurity` empiezan por `h2` (sin `h1`); Home tiene `h1` (nombre) + `h2`; Education sí `h1→h2→h3`; WriteupViewer `h1`.
- **Contraste (calculado WCAG):** `#8a2be2` sobre `#0a0a0a` = **3,32:1** y sobre `#121212` = 3,14:1 (falla AA para texto normal; el color se usa como texto en ~34 reglas); `#4ade80` sobre `#fafafa` = **1,67:1** y `#fb923c` = **2,17:1** (dificultad de writeups en tema claro, ilegible). Bien: texto blanco sobre morado 5,96:1, `#cfcfcf` sobre negro 12,7:1, morado sobre claro 5,71:1.
- **Foco:** solo hay `:focus-visible` explícito en 2 hojas (`About`, `NotFound`); no hay skip-link; no se mueve el foco al cambiar de ruta; no hay `aria-current`/landmarks claros (hay `<header>`, `<nav>`, `<main>`, `<footer>`).
- `alt` de la galería genérico ("Screenshot 1…"); la galería tiene cierre con `Escape` pero no `role="dialog"`/trampa de foco comprobados.
- Botones de idioma solo con bandera (con `aria-label`, OK) y bandera `gb` para inglés.
- Animaciones no respetan `prefers-reduced-motion` salvo en parte.

**Responsive**
- Hay media queries (480–1024) y menú hamburguesa. No se ha podido probar en dispositivos desde este análisis (lectura estática). Riesgos visibles en código: breakpoints inconsistentes (9 valores); `position: fixed` del toggle de tema que puede solaparse con contenido; tarjetas con brillo dependen del ratón (sin efecto en táctil).

**Inconsistencias visuales / de contenido**
- Home muestra cabecera "Sobre mí" con `eyebrow` y `title` idénticos ("Sobre mí" dos veces).
- Education y el resto no comparten cabecera (`education-page-header` vs `SectionHeader`); estilos con CSS global frente a módulos.
- Variables "legacy" duplicadas (`--color-*` ↔ `--*-color`) y tokens repetidos en el `<style>` de cada página legal (3 copias).
- Mezcla de enlaces `<a href>` y `<Link>`; `HomeProjects` importa CSS con ruta rara (`'../../src/pages/Projects.module.css'`).
- README dice "Trayectoria (Experiencia, Certificaciones y Formación)" y "OSCP & Writeups" (correcto), pero no menciona legales ni apps iOS.
- Proyecto duplicado (Metadata Analyzer en destacados y en curso con estados contradictorios).
- Footer y README: "Desarrollado con React" (se revelaría al rediseñar).

---

## 6. SEO Y METADATOS

| Elemento | Estado actual |
|---|---|
| `<title>` SPA | **Único para todo el sitio**: `Diego Aranda Gómez \| Cybersecurity & Software Engineer (OSCP)` |
| `meta description` SPA | "Diego Aranda Gómez — Ingeniero de Software especializado en Ciberseguridad (OSCP) y Analista de Arquitectura de Seguridad en Deloitte." (único, solo ES) |
| Título/description por ruta | **no existe** (sin Helmet/`document.title`) |
| `<html lang>` | `es` fijo |
| Open Graph / Twitter Cards | **no existe** (SPA y legales) |
| `canonical` | **no existe** |
| `hreflang` | **no existe** |
| `sitemap.xml` | **no existe** (404) |
| `robots.txt` | **no existe** (404). Las 3 legales llevan `meta robots index, follow` |
| Datos estructurados (JSON-LD) | **no existe** (ni `Person`, ni `WebSite`, ni `SoftwareApplication`) |
| Imagen OG / favicon PNG / manifest | **no existe** |
| Legales 🔒 | Cada una con `<title>` y `description` propios (GeoAlarm: `Privacy Policy — GeoAlarm`; MyBudget: `MyBudget — Textos legales y soporte`; GaragePad: `GaragePad — Textos legales y soporte`) |
| Analytics / trackers | **no existe** ningún (ni GA, ni Plausible, ni Umami, ni píxeles). Verificado por búsqueda en `index.html`, `src/` y legales. Los únicos terceros son Google Fonts y jsDelivr |
| Contenido indexable | Casi todo se renderiza en cliente: el HTML servido solo trae el preloader y `<div id="root">`. Los writeups se cargan por `fetch` tras el render. HTTP 404 en todas las rutas ≠ `/` |

---

## 7. NOTAS PARA PLANIFICAR EL REDISEÑO

1. **Primero**: confirmar con el propietario qué URL de GeoAlarm/MyBudget/GaragePad (política, soporte, marketing) están dadas de alta en App Store Connect. Puede haber otras (`/mybudget`, `/garagepad`, `/geoalarm`).
2. **Bloquear con test** (script CI) que, tras el build, las 9 rutas 🔒 devuelven el mismo HTML que hoy (hash por archivo) y que existen `/favicon.svg` y `/`.
3. **No pasar `public/*.html` legales por el nuevo layout.** Si se quiere unificar estilo, hacerlo en una segunda fase y con revisión legal; mantener las anclas (`#privacy-policy`, `#terms-of-use`, `#terms-of-service`, `#support`…).
4. Decidir si se añade `/geoalarm` (alias que redirija a `/geoalarm-privacy.html`), por coherencia con las otras dos apps.
5. Revisar el CV EN, añadir foto/OG, idiomas hablados, enlace de verificación del OSCP y logo; y decidir qué se hace con la duplicidad de "Metadata Analyzer".
6. Limpieza previa sin riesgo: borrar el `dist/` local con duplicados, la dependencia `react-scroll-parallax`, el alias de `vite.config.js`, el script `deploy` y renombrar el workflow.
7. Revisar el enlace de Google Drive del informe del termostato (401 sin sesión).
