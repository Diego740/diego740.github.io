# Cuestionario de proyectos

Rellena solo lo que quieras publicar. Si algo no aplica, escribe "no". Lo que dejes vacío no se muestra. No inventaré nada: cada dato que no me des queda marcado en la página como "Pendiente de completar" (visible en el recuadro punteado al final de cada proyecto).

**Cómo responder:** copia este archivo, o contesta en el chat citando el número (por ejemplo "T3: …"). Puedes responder en español o en inglés; yo traduzco a ambos idiomas. Frases cortas, en primera persona.

---

## Preguntas generales (para todo el portfolio)

- **G1.** Esquí de alto rendimiento: ¿rango de años (por ejemplo 2010–2021)? ¿Categoría o nivel que quieras mencionar (selección, campeonatos, resultados)? Hoy la línea temporal dice solo "Prev.". RESPUESTA: competir competí hasta 2021, ns la fecha exacta de cuando empece, pero mejor no poner fechas
- **G2.** OSCP/OSCP+ y Deloitte comparten "Sept 2026". ¿Qué mes y día exactos de cada credencial y de tu incorporación a Deloitte, para ordenar la línea temporal? RESPUESTA: no hace falta
- **G3.** ¿Quieres un correo/enlace de contacto distinto del actual (`diegoaranda.dev@gmail.com`)? RESPUESTA: no
- **G4.** Foto de perfil: ¿la quieres en Sobre mí? (si sí, envíala). RESPUESTA: no
- **G5.** Idiomas que hablas y nivel (no figuran hoy en el sitio). RESPUESTA: Castellano e Ingles, ingles nivel profewsional
- **G6.** ¿Los proyectos "Otros" (Gestor de Espacios, Web de Películas, Simulador de Caché, Modelos de IA) merecen página propia o basta con la tarjeta actual? RESPUESTA: Suficiente como hassta ahiiroa

---

## 1. Auditoría termostato IoT (`/projects/termostato`)

- **T1.** Enlace público del informe. El de Drive devuelve 401 (privado o caducado): ¿lo compartes públicamente, lo subes al repo como PDF o lo dejamos sin enlace? RESPUESTA: El enlace esta bien, pero de momento es privado el doc, porque estoy esperando aprovacion de la emperwsa 
- **T2.** ¿Qué hiciste tú exactamente (hardware, app móvil, cloud)? 3–5 viñetas, por ejemplo "extraje el firmware por UART", "interceptué el tráfico de la app con Burp". RESPUESTA: Audite toda infraestructura relacionada con el termostato. Tanto la aplicación móvil como el propio termostato, configuraciones, como decía, la conexión con internet o con el móvil, tiene conexión. funcionamiento, etcétera, intentar interceptar mensajes. También hice algo de generar reversos sobre la aplicación. Y paso a paso acabé descubriendo unos servidores con los que se conectaba. Que parecían ser propietarios de la propia empresa que tenía vulnerabilidades críticas. Entre las cuales se permitía RCE.
- **T3.** Contexto: ¿fue una asignatura, un trabajo para un cliente, una investigación propia? ¿Cuándo (mes/año) y cuánto duró? RESPUESTA: Fue una asignatura de la universidad, no pongas fechas pero sobre 2025-2026, abarco bastante 
- **T4.** ¿Puedo nombrar la marca o el modelo? ¿O lo dejamos como "un termostato IoT comercial"? RESPUESTA: OMITE EL MODELO
- **T5.** De las 3+ vulnerabilidades críticas (RCE en backend, credenciales en texto plano, claves API hardcodeadas): ¿hubo divulgación responsable al fabricante? ¿Hay CVE asignados? RESPUESTA: esta en proceso en tramites con el para poder publicar el informe
- **T6.** ¿Alguna captura o diagrama que se pueda publicar sin datos sensibles? RESPUESTA: No tengo capturas de nada que wse pueda mostrar

## 2. Wargame: ataque y defensa con DMZ (`/projects/wargame`)

- **W1.** ¿En qué asignatura o curso fue? ¿Cuánto duró y cuándo?  RESPUESTA: 2026, para una asignatura de protectos de ciberseguridasd varios meses 
- **W2.** Tamaño del entorno: ¿cuántas máquinas, qué sistemas (versiones de Windows y Linux)? ¿Quién lo montó? RESPUESTA: planteamos Varios días de Wargames, Separados durante varios meses. Eres una asignatura en la que nosotros configurábamos la máquina. Y las defensas y en clase las atacábamos entre los diferentes equipos. Nosotros desplegábamos nuestra máquina y atacábamos las otras. Con opción a partir de cierto tiempo a defender la nuestra también. En tiempo real mientras atacamos las demás. Fueron primero una máquina de Linux sola, luego una de Windows, Y luego un entorno de Active Directory. Con una DMZ que puede ser Windows o Linux.
- **W3.** Tu rol: ¿equipo rojo, azul o ambos? ¿Trabajaste solo o en equipo (cuántos)? RESPUESTA: Éramos equipos de cuatro. Porque al final tocamos un poco todos todo. Pero sobre todo me especialicé en lo que era la configuración de la máquina. Y los vectores de ataque. Y en el ataque a otras máquinas.
- **W4.** Un resultado concreto: ¿cuántos hosts comprometiste, qué detecciones montaste en Wazuh, qué reglas, qué tiempo de detección? RESPUESTA: No te sabría dar un número. Así que lo metido. Pero si te expones algo, pues poned de 75% de las máquinas comprometidas. Ya que al final, pues cuestiones de tiempo tampoco nos da tiempo a pagar todos.
- **W5.** ¿Diagrama de red (puede ser dibujado a mano) para la página? RESPUESTA: No lo tengo 

## 3. Analizador de metadatos y amenazas (`/projects/metadata-analyzer`) · en curso

- **M1.** Lista exacta de formatos soportados (más de 5: ¿cuáles?). 

# AnalizadorMetadatos

Herramienta diseñada para el análisis, extracción, limpieza y modificación de metadatos en diversos tipos de archivos.

## Características

La herramienta permite realizar varias operaciones sobre los metadatos de los archivos soportados:

*   **Análisis de Metadatos:** Extrae y muestra información detallada de los metadatos del archivo.
*   **Verificación de Extensión:** Comprueba si la extensión del archivo coincide con su tipo MIME real y sugiere la extensión correcta en caso de discrepancia.
*   **Limpieza de Metadatos (Wipe):** Elimina los metadatos existentes para limpiar el archivo (útil para privacidad).
*   **Aplicación de Metadatos por Defecto:** Aplica un conjunto predefinido de metadatos.
*   **Metadatos Personalizados:** Permite al usuario definir y aplicar campos de metadatos específicos (clave=valor).

### Formatos Soportados
*   **PDF** (`.pdf`)
*   **Microsoft Word** (`.docx`)
*   **Imágenes** (Formatos soportados por Pillow, ej, `.jpg`, `.png`, `.heic`)

## Requisitos

*   Python 3.x
*   Las dependencias listadas en `requirements.txt`:
    *   `puremagic`
    *   `pillow` (y `pillow-heif`)
    *   `piexif`
    *   `PyPDF2`
    *   `python-docx`

## Instalación

1.  Clona este repositorio o descarga el código fuente.
2.  Instala las dependencias necesarias ejecutando:

```bash
pip install -r requirements.txt
```

## Uso

La herramienta se puede ejecutar en dos modos: Interfaz de Línea de Comandos (CLI) y Interfaz Gráfica de Usuario (GUI).

### Ejecución Básica (CLI)

Ejecuta el script principal sin argumentos para iniciar el menú interactivo en la consola:

```bash
python3 analizadorMetadatos.py
```

Sigue las instrucciones en pantalla para seleccionar la operación deseada e introducir la ruta del archivo.

**Menú Principal:**
1.  Analyze file metadata (Analizar metadatos)
2.  Verify file extension consistency (Verificar extensión)
3.  Wipe all metadata (Eliminar metadatos)
4.  Apply default metadata templates (Aplicar plantilla por defecto)
5.  Set custom metadata fields (Establecer metadatos personalizados)
6.  Exit (Salir)

### Ejecución con Interfaz Gráfica (GUI)

Para lanzar la versión con interfaz gráfica, utiliza el flag `-g` o `--gui`:

```bash
python3 analizadorMetadatos.py --gui
```

## Estructura del Proyecto

*   `analizadorMetadatos.py`: Punto de entrada de la aplicación.
*   `requirements.txt`: Lista de librerías necesarias.
*   `src/`: Código fuente principal.
    *   `main.py`: Lógica principal y flujo de la aplicación.
    *   `core/`: Módulos para operaciones de metadatos (análisis, modificación, detección).
    *   `gui/`: Implementación de la interfaz gráfica.
    *   `security/`: Módulos de análisis de seguridad.
    *   `utils/`: Utilidades generales.

## Notas
*   Al limpiar o modificar metadatos, la herramienta suele generar un nuevo archivo con el sufijo `_clean` o similar para preservar el archivo original.

- **M2.** El "~70 % menos de revisión manual": ¿comparado con qué proceso y cómo lo mediste? RESPUESTA: No lo llega a comprobar objetivamente, pero es una estimación que hice Dejaolo sin dar muchas explicaciones
- **M3.** ¿Qué hace la parte de IA, con qué modelo o técnica, y qué datos se envían (si alguno)? (importante por tu mensaje de privacidad).:: RESPUESTA: Use un isolation forest para detectar anomalias
- **M4.** Estado actual (¿qué funciona hoy?) y siguiente hito. ¿Hay fecha estimada de versión 1?: Siguedesarrollando para tareas bulk y mejora de formatos.
- **M5.** ¿Una captura, GIF o ejemplo de salida para la galería?: mas tarde las adjuntare
- **M6.** ¿Licencia del repositorio?: Fue mi TFG https://github.com/Diego740/AnalizadorMetadatos

## 4. Volcado de procesos con WinAPI (`/projects/volcado-procesos`)

- **V1.** ¿Para qué sirve y en qué contexto lo hiciste (docencia, investigación, laboratorio propio)? Proyecto ns si de clase o propio no lo menciones 
- **V2.** Explicado a alto nivel, ¿cómo consigue volcar procesos protegidos? (sin detalles que faciliten el abuso).
- **V3.** ¿Qué papel tienen los sockets (envío remoto del volcado)?
- **V4.** Uso responsable: ¿añado una nota de "solo en sistemas propios o con autorización"?



# Herramienta de Volcado de Procesos (WinAPI)

Herramienta de línea de comandos para Windows que realiza volcados de memoria de procesos usando la WinAPI.

## Funcionalidades

| Modo               | Flag                            | Descripción                                                   |
| ------------------ | ------------------------------- | ------------------------------------------------------------- |
| Volcado por PID    | `-pid <PID>`                    | Volcado directo dado un PID                                   |
| Volcado por nombre | `-name <nombre>`                | Busca el PID por nombre y realiza el volcado                  |
| Snapshot + volcado | `-snapshot -pid/-name`          | Captura una snapshot (PssCaptureSnapshot) y vuelca desde ella |
| Volcado por red    | `-net <IP> <PUERTO> -pid/-name` | Envía el dump por red sin escribir en disco                   |

## Compilación

### Desde Visual Studio

1. Crear proyecto de consola vacío (C/C++)
2. Agregar todos los `.c` de la carpeta `src/` y los `.h` de `include/`
3. Compilar
4. Ejecutar

## Uso

```bash
# Volcado por PID
practica1.exe -pid 1234

# Volcado por nombre
practica1.exe -name powershell.exe

# Snapshot + volcado por PID
practica1.exe -snapshot -pid 1234

# Snapshot + volcado por nombre
practica1.exe -snapshot -name powershell.exe

# Volcado por red (sin escribir en disco)
# En la máquina receptora:
nc -nvlp <PUERTO> > dump.dmp
# En la máquina emisora:
practica1.exe -net <IP> <PUERTO> -name powershell.exe
```

> **Nota:** Ejecutar como **Administrador** para poder habilitar `SeDebugPrivilege` y acceder a procesos SYSTEM.

## Estructura del proyecto

| Archivo          | Descripción                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `src/main.c`     | Punto de entrada, parseo de argumentos y flujo principal                         |
| `src/utils.c`    | argParser, mostrarUso, habilitarSeDebugPrivilege                                 |
| `src/process.c`  | obtenerPIDporNombre (EnumProcesses + PSAPI), realizarVolcado (MiniDumpWriteDump) |
| `src/snapshot.c` | realizarVolcadoSnapshot (PssCaptureSnapshot + MiniDumpWriteDump)                 |
| `src/net.c`      | realizarVolcadoRed (MiniDumpWriteDump con callback + sockets)                    |
| `include/*.h`    | Archivos de cabecera que definen las estructuras y funciones                     |

## APIs de Windows utilizadas

- **Enumeración de procesos:** `EnumProcesses`, `OpenProcess`, `EnumProcessModules`, `GetModuleBaseNameA`
- **Volcado de memoria:** `MiniDumpWriteDump` (dbghelp)
- **Snapshot de procesos:** `PssCaptureSnapshot`, `PssQuerySnapshot`, `PssFreeSnapshot`
- **Privilegios:** `OpenProcessToken`, `LookupPrivilegeValue`, `AdjustTokenPrivileges`
- **Sockets:** `WSAStartup`, `socket`, `connect`, `send` (winsock2)
- **Ficheros:** `CreateFileA`

---

# Process Memory Dump Tool (WinAPI)

Command-line tool for Windows that performs process memory dumps using the WinAPI.

## Features

| Mode            | Flag                          | Description                                                |
| --------------- | ----------------------------- | ---------------------------------------------------------- |
| Dump by PID     | `-pid <PID>`                  | Direct dump given a PID                                    |
| Dump by name    | `-name <name>`                | Finds the PID by name and performs the dump                |
| Snapshot + dump | `-snapshot -pid/-name`        | Captures a snapshot (PssCaptureSnapshot) and dumps from it |
| Network dump    | `-net <IP> <PORT> -pid/-name` | Sends the dump over the network without writing to disk    |

## Compilation

### From Visual Studio

1. Create an empty console project (C/C++)
2. Add all `.c` from `src/` and `.h` from `include/`
3. Build
4. Run

## Usage

```bash
# Dump by PID
practica1.exe -pid 1234

# Dump by name
practica1.exe -name powershell.exe

# Snapshot + dump by PID
practica1.exe -snapshot -pid 1234

# Snapshot + dump by name
practica1.exe -snapshot -name powershell.exe

# Network dump (without writing to disk)
# On the receiving machine:
nc -nvlp <PORT> > dump.dmp
# On the sending machine:
practica1.exe -net <IP> <PORT> -name powershell.exe
```

> **Note:** Run as **Administrator** to enable `SeDebugPrivilege` and access SYSTEM processes.

## Project structure

| File             | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `src/main.c`     | Entry point, argument parsing and main flow                                      |
| `src/utils.c`    | argParser, mostrarUso, habilitarSeDebugPrivilege                                 |
| `src/process.c`  | obtenerPIDporNombre (EnumProcesses + PSAPI), realizarVolcado (MiniDumpWriteDump) |
| `src/snapshot.c` | realizarVolcadoSnapshot (PssCaptureSnapshot + MiniDumpWriteDump)                 |
| `src/net.c`      | realizarVolcadoRed (MiniDumpWriteDump with callback + sockets)                   |
| `include/*.h`    | Header files outlining the tool API                                              |

## Windows APIs used

- **Process enumeration:** `EnumProcesses`, `OpenProcess`, `EnumProcessModules`, `GetModuleBaseNameA`
- **Memory dump:** `MiniDumpWriteDump` (dbghelp)
- **Process snapshot:** `PssCaptureSnapshot`, `PssQuerySnapshot`, `PssFreeSnapshot`
- **Privileges:** `OpenProcessToken`, `LookupPrivilegeValue`, `AdjustTokenPrivileges`
- **Sockets:** `WSAStartup`, `socket`, `connect`, `send` (winsock2)
- **Files:** `CreateFileA`


https://github.com/Diego740/MemoryDumpTool-WinApi
licecnia mit

## 5. CTFs: forense y pentesting web (`/projects/ctfs`)

- **C1.** ¿En qué CTFs participaste (nombre y año) y con qué resultado?
- **C2.** ¿Equipo o individual?
- **C3.** ¿Hay writeups de CTFs (no HTB) que quieras publicar?

Me refiero más a que participo y hago CTFs tanto en HTB, proving grounds etc y subo a veces writups

## 6. GeoAlarm (`/projects/geoalarm`) · publicada

- **GA1.** Flujo de uso en 3–4 pasos (por ejemplo "eliges el destino, fijas el radio, la alarma suena al llegar"). Elijes destino, pones radio al que te avisa, inicias, haces tus cosas y te avias al llegar
- **GA2.** El "~80 % menos de batería": ¿frente a qué enfoque (por ejemplo seguimiento GPS continuo) y cómo lo mediste? seguimiento GPS continuo, pruebas y estyimacion
- **GA3.** Fecha de publicación y versión actual en la App Store. ¿Número de descargas, si quieres mostrarlo? Ns
- **GA4.** ¿Descripción corta de cada una de las 6 capturas para el texto alternativo? Hoy ponen "Pantalla n de GeoAlarm".
- **GA5.** ¿Idiomas de la app? Español e ingles
- **GA6.** ¿Precio o modelo (gratis, de pago)? gratis 

## 7. RootJar (`/projects/rootjar`) · en curso (antes MyBudget)

- **R1.** ¿Por qué RootJar? ¿Qué significa el nombre y qué problema resuelve frente a otras apps de finanzas? RESPUESTA: RESPUESTA:

El nombre junta dos ideas que explican la app:

Jar (tarro) viene del método de toda la vida de repartir el dinero en tarros o sobres: una parte para el mes, otra para un viaje, otra para imprevistos. En la app, el tarro es el presupuesto del mes. Se vacía poco a poco según gastas, y basta un vistazo para saber cuánto te queda sin leer ninguna cifra. Las huchas son tarros más pequeños para ahorrar con un objetivo.
Root (raíz) es la base. Unas finanzas sanas no consisten en apuntar gastos: consisten en echar raíces, es decir, en hábitos estables y un ahorro que crece despacio pero firme. Por eso el tarro está plantado en la tierra.

El problema que resuelve: casi todas las apps de finanzas te obligan a elegir entre comodidad y privacidad.

Las apps automáticas se conectan a tu banco, normalmente a través de un intermediario que guarda tus credenciales o tus movimientos en sus servidores. Muchas además viven de analizar o rentabilizar esos datos.
Las apps privadas te obligan a apuntarlo todo a mano, y la mayoría de la gente lo deja a las dos semanas.

RootJar busca las dos cosas a la vez:

Privada por diseño.
No hay servidores propios ni cuentas que crear, y no se pide acceso al banco.
Los datos viven en tu dispositivo y en tu iCloud privado, con los campos sensibles cifrados.
No hay publicidad ni rastreo, y nosotros no podemos ver tu dinero.
Automática sin tocar el banco.
Cuando pagas con Apple Pay, una automatización de Atajos registra el pago en la app.
Si un pago está incompleto o no está claro, queda pendiente y no cuenta hasta que lo apruebas.
Un presupuesto que se entiende de un vistazo. El tarro muestra lo que te queda del mes. Las huchas pueden contar o no en el presupuesto, y se ven el patrimonio total y el dinero que aún no has asignado.
Hecha como una app de Apple. Componentes nativos, iPhone y iPad, widgets y modo oscuro, sin interfaces recargadas.

En una frase: RootJar es el tarro del presupuesto de toda la vida, automático con Apple Pay y sin entregar tus datos bancarios a nadie.

Dos notas para usarla:

Si es para la ficha del App Store o para el revisor de Apple, que de esta respuesta salga la ficha. Los puntos 1 y 2 son justo lo que te distingue frente al rechazo 4.3(a), así que conviene ponerlos en primer plano, también en las capturas.
Revisa dos frases antes de publicarla:
Ponemos «sin servidores propios» y «no podemos ver tu dinero». Encaja con la arquitectura (CloudKit en la base de datos privada del usuario y campos cifrados), pero tienes que poder sostenerlo exactamente así.
No he puesto «sin conexión a internet», porque iCloud sí la usa.
- **R2.** Capturas de pantalla (o maqueta) para la galería. RESPEUTA: mas tarde
- **R3.** Estado y fecha prevista de publicación en la App Store. REPSUESTA: PRONTO
- **R4.** ¿Se mantiene "gratuita y sin anuncios"? (la página legal lo dice). RESPUESTA: si
- **R5.** ¿Quieres que la página legal `/mybudget-privacy.html` se actualice tú a RootJar antes o después del lanzamiento del nuevo sitio? (recordatorio: yo no la toco). RESPUESTA: NO

## 8. GaragePad (`/projects/garagepad`) · en curso

Ya incluí tu texto completo (problema, funcionamiento, límites, notas) y el vídeo de CarPlay.

- **GP1.** Fotos: widget en iPhone (pantalla de inicio), pantalla de selección de archivos, ajustes (tiempo de pulsación), widget en CarPlay a distintos tamaños (1, 2, 3 y 4 botones).
- **GP2.** Vídeo final: el actual dura 9 s y lo comprimí a 320×568 px (718 KB) como provisional. ¿Quieres otro formato (horizontal, con la pantalla del iPhone, con pulgar pulsando)? Si me pasas el original sin comprimir lo recomprimo a 720p.
- **GP3.** ¿Fecha prevista de publicación en la App Store? ¿Versión mínima de iOS (indicas iOS 26 para CarPlay) y modelos de Flipper probados (Zero, firmware oficial, Momentum…)?
- **GP4.** ¿Quieres un enlace al repositorio o a TestFlight? no
- **GP5.** El texto original estaba en inglés y lo he traducido al español. ¿Prefieres que la versión ES sea literal o más breve? que sea parecida pero con tono español

---

## Medios que me pedirás/enviarás

| Medio | Para | Formato recomendado |
|---|---|---|
| Fotos y capturas | Galería de cada proyecto | PNG o JPG original; yo genero WebP/AVIF |
| Vídeo final de GaragePad | `/projects/garagepad` | El original del móvil (.mov/.mp4); yo lo recomprimo |
| Informe del termostato | `/projects/termostato` | PDF, si lo vas a publicar |
| Foto de perfil | Sobre mí | Cuadrada, mínimo 800 px |
