# Product

<!-- impeccable:product-schema 1 -->

> Estado: borrador inicial (rama `redesign`). Los hechos marcados **[confirmado]** vienen del propietario o de `docs/AUDIT-portfolio-actual.md`. Los marcados **[inferido]** son hipótesis a validar. No se ha hecho la entrevista interactiva de `init`: el propietario dio las decisiones en el encargo y pidió parar tras las direcciones de diseño.

## Platform

web

## Stack

Astro estático (`output: 'static'`, `build.format: 'file'`) desplegado a GitHub Pages con el workflow actual. **[confirmado]**

## Users

Tres públicos, por orden de prioridad **[inferido a partir del encargo; validar el orden]**:

1. **Reclutadores técnicos y responsables de contratación de seguridad.** Llegan desde LinkedIn o un CV con 2–3 minutos. Quieren confirmar tres cosas: certificaciones verificables (OSCP/OSCP+), experiencia real (Deloitte, Capgemini) y evidencia de trabajo (writeups, auditorías, apps publicadas).
2. **Managers de seguridad y colegas del sector.** Leen writeups y proyectos para juzgar metodología, rigor y comunicación técnica.
3. **Usuarios de las apps iOS (GeoAlarm, RootJar, GaragePad).** Llegan desde App Store o desde un enlace de soporte a una página legal. Necesitan la política de privacidad, las condiciones o el soporte, no el portfolio. Esas páginas no pasan por el rediseño (ver restricciones).

## Product Purpose

Un portfolio personal que demuestra a la vez dos cosas: ingeniería de seguridad ofensiva (OSCP/OSCP+, Active Directory, Red/Blue Team) con rol actual de Analista de Arquitectura de Seguridad en Deloitte, y capacidad de publicar software real (apps iOS con privacidad por diseño). Éxito = un visitante entiende en segundos quién es, ve la evidencia (proyectos, writeups, credenciales verificables) y contacta o descarga el CV. **[confirmado en lo esencial]**

## Positioning

Pocos perfiles de seguridad ofensiva publican además apps nativas en App Store con arquitectura 100 % en dispositivo y sin rastreo. La combinación (rompe sistemas, también construye productos que respetan al usuario) es lo que un portfolio genérico de pentester no puede copiar. **[inferido]**

## Operating Context

- Sitio bilingüe ES/EN. ES en las rutas actuales, EN bajo `/en/…`. **[confirmado como preferencia]**
- Hospedado en `diego740.github.io` (sin dominio propio, sin servidor, sin analítica). **[confirmado por auditoría]**
- Las páginas legales de apps (`/geoalarm-privacy.html`, `/mybudget-privacy.html`, `/garagepad-privacy.html`) están registradas en App Store Connect. **Regla vigente (cambio de restricción):** el diseño sí puede cambiar (usan el layout del portfolio); NO pueden cambiar las rutas (con y sin `.html`, 200), el texto legal ES/EN palabra por palabra, las anclas, el nombre de la app (MyBudget en esa página), las claves `localStorage` `theme`/`lang`, ni los 6 stubs de redirección (byte a byte). Lo verifica `scripts/verify-legal.mjs` en CI. **[confirmado]**
- Writeups de HTB en Markdown con sintaxis Obsidian (`![[img.png]]`).

## Capabilities and Constraints

- Hard constraints: ver `docs/AUDIT-portfolio-actual.md` §0 y §2.2; resumen:
  - 9 URLs 🔒 intactas, mismas claves `localStorage` `theme` ('dark'/'light') y `lang` ('es'/'en'), `/favicon.svg`, `/`, PDFs del CV y `/writeups/*.md`.
  - Rutas actuales con HTTP 200: `/about`, `/projects`, `/education`, `/trayectoria`, `/trajectory`, `/cybersecurity`, `/cybersecurity/{updown,broker,builder}`, `/contact`.
- Nombre de app: **MyBudget → RootJar** en todo el portfolio nuevo. La URL legal sigue siendo `/mybudget-privacy.html` y no se crea ningún alias. El cambio de nombre dentro de esa página lo hace el propietario aparte. **[confirmado]**
- Metadata Analyzer: **un solo proyecto, EN CURSO**, repo `https://github.com/Diego740/Analizador-Metadatos`. **[confirmado]**
- Dos credenciales OffSec, ambas con botón "Verificar credencial". **[confirmado]**
- Pendiente: enlace de Drive del informe del termostato (da 401). Va como placeholder marcado `PENDIENTE`. **[pendiente]**
- GeoAlarm es la única app con enlace de store. RootJar y GaragePad no tienen ficha pública todavía. No hay Google Play.

## Brand Commitments

- Se elimina la estética terminal/hacker anterior (preloader, cursor propio, burbujas, glows, `<Diego/>`). La estética nueva es libre. **[confirmado]**
- Referencia estructural: el expositor de `shopify.com/editions` (estanterías con portadas, pegatina tipo "NOW PLAYING", índice cronológico inferior). No se quieren los efectos de craft.wild.as. **[confirmado]**
- Tono: profesional, concreto, sin postureo de "hacker". Primera persona sobria, afirmaciones solo si están respaldadas por un dato del propio portfolio. **[inferido]**
- Se mantienen los nombres de proyecto y las descripciones actuales como fuente de verdad (no inventar métricas).

## Evidence on Hand

- Dos credenciales verificables en `credentials.offsec.com` (OSCP y OSCP+). **[confirmado]**
- App publicada en App Store: GeoAlarm (`https://apps.apple.com/app/id6768651486`), 6 capturas en `public/projects/GeoAlarm/`.
- 3 writeups de HTB en Markdown (UpDown, Broker, Builder), 13 capturas usadas.
- Repos públicos: Analizador-Metadatos, MemoryDumpTool-WinApi.
- Métricas ya publicadas en el sitio: GPA 8.3/10; ~80 % menos batería (GeoAlarm); ~70 % menos revisión manual y 5+ formatos (Metadata Analyzer); 3+ vulnerabilidades críticas (auditoría del termostato).
- **No existe:** testimonios, logos de clientes, foto de perfil, capturas de RootJar o GaragePad, imagen OG, idiomas hablados, informe público del termostato (enlace pendiente). No se fabrican.

## Product Principles

1. **La evidencia va delante de la autopromoción.** Cada afirmación enlaza a algo que se puede abrir: un writeup, un repo, una ficha de App Store, una credencial verificable.
2. **La página de inicio es un escaparate, no un resumen del sitio.** Muestra el trabajo; las subpáginas lo explican.
3. **Las rutas son un contrato.** Cualquier URL publicada o registrada en una tienda se conserva.
4. **Escala sin rediseñar.** Añadir un proyecto o una categoría es añadir un archivo de contenido.
5. **Privacidad por diseño también en la web:** sin analítica, sin terceros en carga (fuentes y banderas autoalojadas).

## Accessibility & Inclusion

WCAG 2.2 AA como mínimo: contraste 4.5:1 en texto, foco visible, un `h1` por página, jerarquía de headings correcta, `lang` dinámico por idioma, navegación completa por teclado (incluido el carrusel de cada estante), `prefers-reduced-motion` y `prefers-color-scheme` respetados. **[inferido, derivado de los problemas de la auditoría]**
