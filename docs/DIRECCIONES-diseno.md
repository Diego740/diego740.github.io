# Inventario y direcciones de diseño del expositor

Rama `redesign`. Prototipos estáticos (HTML+CSS, contenido real) en `prototypes/{pistas,vinilos,informe}/index.html`. Capturas a 1440, 768 y 390 en `prototypes/_captures/<dirección>/` (`desktop-fold.jpg`, `tablet-fold.jpg`, `mobile-fold.jpg` y las teselas `*-page-01.jpg` de la página completa). Para regenerarlos: `node prototypes/_build.mjs`.

## 1. Inventario: lo que es solo tuyo

(Paso de inventario de taste-skill. Es la lista de la que salen las ideas; ninguna la podría usar otro portfolio.)

1. **Dos credenciales OffSec distintas, OSCP+ y OSCP, ambas verificables, expedidas en septiembre de 2026.**
2. **Esquí alpino de alta competición** (aparece en tu bio como base de resiliencia). Es la única referencia deportiva de la web, y el vocabulario de las pistas (verde, azul, roja, negra) coincide con el de la dificultad de HTB (Easy, Medium, Hard, Insane).
3. **Un perfil doble:** rompes sistemas (Active Directory, Red/Blue Team, HTB) y publicas apps iOS con "cero rastreo".
4. **Nombres de proyecto con imagen propia:** *RootJar* (un frasco con raíz), *GaragePad* (una botonera de cuatro mandos), *GeoAlarm* (un geofence), *UpDown*, *Broker*, *Builder* (máquinas con nombre-mecanismo).
5. **Datos propios ya publicados:** 3+ vulnerabilidades críticas, ~80 % menos batería, ~70 % menos revisión manual, 5+ formatos, GPA 8.3, 9.7 en Redes (Matrícula de Honor).
6. **Una captura real de marketing de una app publicada** (GeoAlarm, App Store).
7. **Cinco hitos de una carrera corta y densa:** U-TAD 2022 → Capgemini 2025 → Appian 2026 → OSCP/OSCP+ 2026 → Deloitte 2026.
8. **Madrid, ES/EN**, y tres páginas legales que son lo que ven los usuarios de las apps.
9. **Restricción de privacidad como postura:** sin analítica, sin cuentas, sin servidores. Se puede extender a la web (fuentes y banderas autoalojadas).
10. **Escasez de imágenes de proceso:** las capturas de los writeups muestran claves y consolas; no son material de portada. Lo que sí hay son motivos dibujables (dial, red con DMZ, documento, memoria, bandera, geofence, frasco, botonera, flechas, nodos, bloques).

Lo que **no existe** y no se fabrica: foto de perfil, testimonios, capturas de RootJar y GaragePad, informe público del termostato.

## 2. Tres direcciones

Las tres comparten estructura y contenido (ver `DESIGN.md`). Cambian el mundo visual. El diseño de la OSCP/OSCP+ es un decisor clave: en las tres se muestran **juntas, con jerarquía (la OSCP+ más ancha, la OSCP más compacta) y la fecha una sola vez**, para que no parezca una repetición.

### A · Pistas (señalética de estación de esquí)

- **Idea:** el expositor es el cuadro de señales de una estación. Cada portada es una placa, el color es la dificultad. Tu historial deportivo y la dificultad de HTB usan el mismo código.
- **Tipografía:** Barlow Condensed 800/700 (títulos, mayúsculas) + Barlow 400–700 (texto). Referencia: señalética viaria y de pistas.
- **Paleta:** nieve `#eef2f5`, tinta marino `#0a1b2e`; pistas `#17743f` (verde), `#1f56c4` (azul), `#d2302b` (roja), `#101215` (negra); apoyos `#0f8f93`, `#1d6b45`, `#f0b323`, `#4a5663`; pegatina naranja de seguridad `#ff6a13`.
- **Portadas:** placa vertical con campo de color a sangre + motivo dibujado en blanco, etiqueta blanca inferior con nombre y tecnologías. Los writeups toman el color de la dificultad (verde Easy, azul Medium). GeoAlarm lleva su captura real. Pegatina rectangular naranja `EN CURSO` ladeada 4°.
- **OSCP / OSCP+:** línea temporal = perfil de una pista con estaciones; el hito OSCP/OSCP+ es un **rombo negro** (el símbolo de la pista negra) con el texto más grande. En Certificaciones: un panel negro con dos filas, OSCP+ grande y OSCP en segundo plano, una sola línea "OffSec · Sept 2026".
- **Móvil:** estantes con scroll horizontal y portada siguiente asomando; la línea temporal pasa a rejilla 3+2 sin sticky.
- **Riesgo honesto:** la metáfora de piste se cumple del todo solo en los writeups y en el rombo; las demás portadas son campos de color con pictograma (criticada como "familia de iconos" más que identidad por proyecto). Es la dirección más clara y legible; la menos arriesgada de las tres en tono.

### B · Vinilos (cubeta de discos)

- **Idea:** el expositor es una cubeta de tienda de discos: portadas cuadradas, separadores con pestaña por categoría y una pegatina de "ahora suena". La OSCP+/OSCP es un doble LP (gatefold).
- **Tipografía:** Archivo variable (eje de anchura): 900 expandida para el nombre y los títulos de funda, 400–700 para el texto. Una sola familia.
- **Paleta:** noche `#0e0f12` y cubeta `#17191e`; fundas rojo `#ff4b2b`, azul `#2746ff`, amarillo `#f4e04d`, menta `#3ee0b0`, hueso `#ecece8`; texto `#f1f1ee`.
- **Portadas:** funda cuadrada de color plano; título en negrita expandida arriba, motivo gigante recortado abajo a la derecha, una etiqueta de tecnología abajo a la izquierda. GeoAlarm lleva el móvil real. Pegatina circular amarilla `EN CURSO`.
- **OSCP / OSCP+:** línea temporal = lista de pistas del disco; el hito OSCP/OSCP+ es el bloque amarillo más ancho. En Certificaciones: **gatefold** de dos paneles de color (azul 3/5 para OSCP+, rojo 2/5 para OSCP), con letra gigante y un botón "Verificar credencial" por panel.
- **Móvil:** fundas de ~170 px con scroll horizontal; el gatefold se apila.
- **Riesgo honesto:** es la más memorable y la que más se aleja del tono "ingeniero de seguridad serio". La paleta plana y la tipografía ancha son cercanas al neobrutalismo y podrían reutilizarse en cualquier producto; lo propio es el contenido.

### C · Informe (carátulas de informe de auditoría)

- **Idea:** el expositor es una estantería de informes encuadernados: portadas blancas con lomo, sellos de "EN CURSO" como el de un borrador. La confianza viene del medio (el entregable de un pentest y de una consultora).
- **Tipografía:** Public Sans variable (800 títulos, 400–600 texto). Referencia: documentos oficiales.
- **Paleta:** cobalto `#1d3df0` de fondo, cobalto oscuro `#1129b8`, papel `#fbfbfd` y `#eceffb`, tinta `#0b1020`, sello rojo `#d4141c`.
- **Portadas:** hoja A4 vertical con lomo oscuro (ink en Seguridad, cobalto en Apps, azul claro en Writeups), etiqueta de tecnología, motivo en cobalto, título en negrita y dato clave. GeoAlarm lleva su captura. Sello rojo ladeado `EN CURSO`.
- **OSCP / OSCP+:** línea temporal con el hito OSCP/OSCP+ como bloque blanco sobre la barra cobalto oscuro. En Certificaciones: dos hojas de credencial (OSCP+ más ancha y alta, OSCP más pequeña) con borde superior de color.
- **Móvil:** hojas de ~190 px con scroll horizontal.
- **Riesgo honesto:** es la más sobria y "Deloitte-compatible", pero también la más genérica (los críticos independientes la puntuaron como "media" en especificidad: pictogramas de línea que cualquiera usaría). Gana credibilidad, pierde carácter.

## 3. Comprobaciones hechas

- **`inspect` de taste-skill (1440/768/390):** 0 desbordes horizontales de página, 0 texto cubierto, 0 texto <13 px, 0 problemas de contraste, `h1` único, margen lateral coherente. Quedan 2–3 `FAIL` por regla del inspector que **he decidido defender**, no corregir:
  - *few-pictures / focal-point:* el contenido real del portfolio es de seguridad (sin fotografías de proceso utilizables) y la pieza protagonista es el expositor, no un titular a 9–14 vw, que es lo que el encargo pedía (nombre pequeño arriba a la izquierda).
  - *eyebrow en pistas a 390 px:* falso positivo (el botón "Verificar credencial" aparece por encima del texto en el flujo apilado).
  - Avisos asumidos: scroll horizontal por estante (es el diseño), varios tamaños de fuente (13–24 px + display), sin vídeo.
- **`detect` de impeccable:** solo avisos de padding "cramped" y jerarquía tipográfica plana (falsos positivos en listas y secciones; el `h1` mide 64 px).
- **`critique` de impeccable, Assessment A (3 revisores independientes, uno por dirección):** especificidad "media-alta" en Pistas y Vinilos, "media" en Informe. Problemas comunes que **ya he corregido**: estante Writeups tapado por la barra (reducida de 117 a ~64 px y portadas más bajas), texto <13 px, desbordes, pegatinas sobre títulos, pareja OSCP/OSCP+ idéntica (ahora jerarquizada), sección Writeups duplicada (ahora solo prosa). **Pendientes** (se recogen en el plan): indicar que la fila se desplaza (flechas prev/next con JS y máscara de borde), cabecera móvil con menos botones, identidad más propia por portada (ilustración encargada o diseñada a mano por proyecto, ver plan), y revisar fecha duplicada "Sept 2026" (OSCP/OSCP+ y Deloitte).

## 4. Limitaciones del prototipo

- Los prototipos no cargan los iconos de `public/` ni enlazan a rutas reales: los `href` apuntan a las rutas finales (`/projects/<slug>`…), que aún no existen.
- Solo ES. El prototipo no tiene JS: flechas del estante, selector de tema y menú con `<details>` se implementan en la migración.
- Con 900 px de alto caben 2 estantes completos y el tercero asoma. Con ≥1000 px caben los tres.
- Las capturas de los writeups no se usan como portada porque muestran claves privadas de máquinas HTB en pantalla.

## 5. Decisión: Vinilos, con estos cambios (prototipo v2)

Elegida la dirección **B · Vinilos**. Cambios pedidos y ya aplicados en `prototypes/vinilos/` (capturas en `prototypes/_captures/vinilos-v2/`: `desktop-wall.jpg`, `desktop-flip-mid.jpg`, `desktop-quick.jpg`, `mobile-wall.jpg`, `mobile-quick.jpg`):

- **Solo iconos en las miniaturas.** Las fotos y capturas viven dentro de cada proyecto (galería de `/projects/<slug>`). Se retira la captura de GeoAlarm de la portada.
- **Pared clara con estantes blancos** (referencia: la plantilla de Shopify Editions que enviaste): fundas apoyadas en la pared con ligera inclinación hacia atrás, sombra suave sobre la pared, tablón con sombra. Al pasar el ratón la funda se eleva, se inclina hacia el puntero (hasta ±11° en Y y ±8° en X) y aparece la etiqueta "Vista rápida". Solo con ratón y sin `prefers-reduced-motion`.
- **Títulos descriptivos y un dato en la portada**, p. ej. "Auditoría termostato IoT · 3+ vulnerabilidades críticas".
- **Vista rápida al hacer clic:** la funda vuela al centro, gira 180° y muestra el reverso (estado, descripción, dato clave, tecnologías) sobre un fondo desenfocado. Desde ahí: "Ver todos los detalles" (página `/projects/<slug>` o `/cybersecurity/<id>`), App Store, repositorio, "Privacidad y términos" (en las apps) y "Cerrar". Se cierra con Esc, clic fuera o "Cerrar", y el foco vuelve a la funda. **Sin JavaScript, la portada sigue siendo un enlace a la página de detalle.** Probado en Chrome real a 1440 y 390 px: abre, enfoca "Ver todos los detalles", bloquea el scroll y cierra.
- **Línea temporal:** se quita Appian (sigue en Certificaciones). Se añade al principio **"Esquí de alto rendimiento"**, con la marca "Antes" porque no tengo años: dímelos si quieres una fecha. Queda: Esquí de alto rendimiento → U-TAD 2022 → Capgemini Oct 2025 → **OSCP / OSCP+ Sept 2026** → Deloitte Sept 2026.

Limitaciones conocidas: con 900 px de alto el tercer estante (Writeups) asoma bajo la barra; en táctil no hay inclinación (solo vista rápida); el reverso tiene espacio libre que se llenará con "Qué hice" y "Resultados" cuando existan en el contenido.
