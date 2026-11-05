# Design

> **Estado: inicial, pendiente de elegir dirección.** Define lo que es común a las tres direcciones propuestas (`docs/DIRECCIONES-diseno.md`). Los tokens de color y tipografía se fijarán cuando el propietario elija. Según el proceso de impeccable, el DESIGN.md definitivo se regenera desde el sitio construido.

## Principios compartidos

- **La home es un escaparate, no un resumen del sitio.** Primer pantallazo: nombre y posicionamiento arriba a la izquierda; CV y contacto arriba a la derecha; el expositor empieza en ese mismo pantallazo.
- **Un mundo visual comprometido.** Superficies de color plano, sin degradados, sin glows, sin cristal, sin sombras en reposo, sin transición global en `*`.
- **Cada portada tiene identidad propia**: color de campo + motivo dibujado específico del proyecto (o captura real cuando existe). Nunca una plantilla de tarjeta con icono genérico.
- **La OSCP es el hito protagonista** en la línea temporal y en el resumen de certificaciones. Las dos credenciales (OSCP+ y OSCP) se muestran juntas, cada una con "Verificar credencial".
- **Sin eyebrows, sin numeración de índice, sin monoespaciada decorativa.**

## Estructura (común)

| Zona | Comportamiento |
|---|---|
| Cabecera | Nombre (`h1`) + una línea de posicionamiento ≥18 px a la izquierda. Acciones a la derecha: `CV` (descarga), `Contacto`, `Menú` (`<details>`), selector `ES/EN`. |
| Expositor | Una `section` por estante, con `h2`. Fila horizontal con `scroll-snap`, foco por teclado en la fila, última "portada" = enlace "N más". |
| Pegatina | `EN CURSO` sobre proyectos activos (con equivalente `sr-only`). Aparece una vez al cargar; sin animación infinita. |
| Línea temporal | Barra inferior `sticky` en escritorio; en móvil deja de ser sticky y se reparte en filas. Cada hito es un enlace a su sección. |
| Resúmenes | Sobre mí · Experiencia · Certificaciones · Writeups · Contacto. Un párrafo corto o una lista corta + un enlace "ver más". |
| Pie | Copyright y enlaces a las tres páginas legales 🔒. |

## Rejilla y espaciado

- Margen lateral `--gut: clamp(20px, 3.2vw, 48px)`, igual en todas las zonas.
- Alto de portada `--h: clamp(144px, 18svh, 250px)`: con 900 px de viewport caben dos estantes completos y el tercero asoma como invitación a hacer scroll.
- Resúmenes: rejilla de 12 columnas, título en 1–4, contenido en 5–12. Una columna en ≤900 px.
- Breakpoints únicos: **640 px** (móvil) y **900 px** (tablet). No más.

## Tipografía (reglas)

- Autoalojada (WOFF2, subset latino), `font-display: swap`. Una familia o dos como máximo.
- Mínimo 13 px para cualquier texto leído. Línea de posicionamiento ≥18 px.
- Escala: 13 / 16–17 / 18–22 (lead) / título de sección / display. Sin tamaños sueltos.

## Movimiento (criterios de Emil Kowalski aplicados)

- Solo `transform` y `opacity`. Curva `cubic-bezier(.2,.8,.2,1)`, 180–450 ms.
- **Un** momento autorado: las portadas se colocan en el estante al cargar (escalonado 45 ms). El resto es feedback de control: elevación de 2–6 px al hover/focus, sin retardo.
- Sin movimiento en la navegación repetida (menú, selector de idioma) ni en elementos que se usan a menudo.
- `prefers-reduced-motion`: sin traslación, el contenido siempre visible.
- Nada de preloader, cursor propio, partículas ni transiciones globales.

## Accesibilidad (suelo)

- Contraste ≥4,5:1 (texto) y ≥3:1 (grande/UI) en ambos temas. Comprobar en cada token.
- Un `h1` por página. Las portadas son enlaces con nombre accesible completo; el estado "en curso" también se lee.
- `lang` dinámico, `hreflang`, foco visible de 3 px, tamaños de objetivo ≥44 px en acciones.
- Tema `dark`/`light` con las claves `localStorage` existentes (`theme`) y `prefers-color-scheme` como valor inicial.

## Dirección elegida: Vinilos

- **Mundo:** pared gris claro `#e7e8ea`, estantes blancos con sombra suave, fundas cuadradas de color plano apoyadas con ligera inclinación. Secciones inferiores en negro `#0e0f12`, amarillo `#f4e04d` para el contacto.
- **Color de fundas:** rojo `#ff4b2b`, azul `#2746ff`, amarillo `#f4e04d`, menta `#3ee0b0`, hueso `#ecece8`; tinta `#121317`.
- **Tipografía:** Archivo variable (eje de anchura 100–125 %, peso 900 en títulos, 400–700 en texto).
- **Miniaturas:** solo icono dibujado + título descriptivo + dato clave. Las fotos van dentro de la página del proyecto.
- **Movimiento:** inclinación 3D hacia el puntero (solo ratón), elevación al hover, vista rápida con giro 180° sobre fondo desenfocado (WAAPI, `transform`/`opacity`, 520–700 ms), colocación escalonada al cargar. Todo con alternativa para `prefers-reduced-motion`.
- **OSCP/OSCP+:** hito amarillo ancho en la barra; gatefold azul (OSCP+, 3/5) y rojo (OSCP, 2/5) en Certificaciones.
- Excepciones deliberadas a las reglas de taste-skill por encargo del propietario: sombras en reposo, desenfoque del fondo y rotación 3D.
