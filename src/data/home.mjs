// Contenido real de la home (fuente: docs/AUDIT-portfolio-actual.md + datos confirmados).
// Nada aquí es inventado. Los campos "PENDIENTE" están marcados.

export const person = {
  name: 'Diego Aranda Gómez',
  positioning:
    'Ingeniero de seguridad ofensiva (OSCP) y analista de arquitectura de seguridad en Deloitte. Publico apps iOS con privacidad por diseño.',
  cv: '/DiegoArandaGomez-CV-ES.pdf',
  email: 'diegoaranda.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/diego-aranda-gomez',
  github: 'https://github.com/Diego740',
};

export const credentials = [
  { id: 'oscp-plus', name: 'OSCP+', full: 'OffSec Certified Professional+', date: 'Sept 2026', url: 'https://credentials.offsec.com/159672f6-9730-4525-a631-628407d0144f#acc.tqr0eo9A' },
  { id: 'oscp', name: 'OSCP', full: 'Offensive Security Certified Professional', date: 'Sept 2026', url: 'https://credentials.offsec.com/ad48ce5c-4ca2-4f5d-b9eb-41cc5db1cb09#acc.B8LsJ1rl' },
];

// status: 'en-curso' | 'publicada' | 'terminado'
export const shelves = [
  {
    id: 'seguridad',
    title: 'Seguridad',
    more: { label: '2 proyectos más', href: '/projects#seguridad' },
    items: [
      { slug: 'termostato', title: 'Smart Thermostat Security Audit', short: 'Termostato IoT', tags: 'IoT · Pentesting · Firmware', blurb: 'Auditoría de hardware, app móvil y cloud de un ecosistema IoT real.', fact: '3+ vulnerabilidades críticas', status: 'terminado', motif: 'dial', href: '/projects/termostato' },
      { slug: 'wargame', title: 'University Wargame Environment', short: 'Wargame', tags: 'Red & Blue Team · Active Directory · Wazuh', blurb: 'Ataque y bastionado de hosts Windows y Linux en una red con DMZ.', fact: 'AD + Wazuh SIEM', status: 'terminado', motif: 'network', href: '/projects/wargame' },
      { slug: 'metadata-analyzer', title: 'Metadata Analyzer & Threat Correlator', short: 'Metadata Analyzer', tags: 'Python · Seguridad · IA', blurb: 'Extrae, sanitiza y analiza metadatos en 5+ formatos y correlaciona amenazas.', fact: '~70 % menos revisión manual', status: 'en-curso', motif: 'document', href: '/projects/metadata-analyzer' },
      { slug: 'volcado-procesos', title: 'Herramienta de Volcado de Procesos', short: 'Volcado de procesos', tags: 'WinAPI · C · Sockets', blurb: 'Volcado de procesos con WinAPI, incluidos los protegidos.', fact: 'Repositorio público', status: 'terminado', motif: 'memory', href: '/projects/volcado-procesos' },
      { slug: 'ctfs', title: 'CTFs de Ciberseguridad', short: 'CTFs', tags: 'Burp Suite · Wireshark · Nmap', blurb: 'Retos de forense, pentesting web y ofensiva/defensiva.', fact: 'Forense · Web', status: 'terminado', motif: 'flag', href: '/projects/ctfs' },
    ],
  },
  {
    id: 'apps',
    title: 'Apps',
    more: { label: 'Ver apps', href: '/projects#apps' },
    items: [
      { slug: 'geoalarm', title: 'GeoAlarm', short: 'GeoAlarm', tags: 'Swift · iOS · App Store', blurb: 'Alarma de ubicación iOS. Todo ocurre en el dispositivo, sin SDKs de rastreo.', fact: '~80 % menos batería', status: 'publicada', motif: 'geofence', href: '/projects/geoalarm' },
      { slug: 'rootjar', title: 'RootJar', short: 'RootJar', tags: 'Swift · iOS · CloudKit', blurb: 'Finanzas personales con procesamiento local y sincronización cifrada por iCloud.', fact: 'Cifrado de extremo a extremo', status: 'en-curso', motif: 'jar', href: '/projects/rootjar' },
      { slug: 'garagepad', title: 'GaragePad', short: 'GaragePad', tags: 'iOS · CarPlay · Widgets · Bluetooth', blurb: 'Hasta cuatro mandos o puertas de garaje en un solo widget de iPhone y CarPlay.', fact: 'Sin cuentas ni servidores', status: 'en-curso', motif: 'pad', href: '/projects/garagepad' },
    ],
  },
  {
    id: 'writeups',
    title: 'Writeups',
    more: { label: 'Todos los writeups', href: '/cybersecurity#writeups' },
    items: [
      { slug: 'updown', title: 'UpDown', short: 'UpDown', tags: 'HTB · Linux', blurb: 'LFI, abuso de Git y escalada con SUID.', fact: 'Medium', diff: 'medium', status: 'terminado', motif: 'updown', href: '/cybersecurity/updown' },
      { slug: 'broker', title: 'Broker', short: 'Broker', tags: 'HTB · Linux', blurb: 'ActiveMQ, RCE y escalada de privilegios.', fact: 'Easy', diff: 'easy', status: 'terminado', motif: 'broker', href: '/cybersecurity/broker' },
      { slug: 'builder', title: 'Builder', short: 'Builder', tags: 'HTB · Linux', blurb: 'Jenkins y CVE-2024-23897.', fact: 'Medium', diff: 'medium', status: 'terminado', motif: 'builder', href: '/cybersecurity/builder' },
    ],
  },
];

export const timeline = [
  { when: 'Prev.', label: 'Esquí de alto rendimiento', note: 'Esquí alpino de alta competición', href: '/about' },
  { when: '2022', label: 'U-TAD', note: 'Grado en Ingeniería del Software', href: '/education#utad' },
  { when: 'Oct 2025', label: 'Capgemini', note: 'Software Engineering Intern', href: '/education#capgemini' },
  { when: 'Sept 2026', label: 'OSCP / OSCP+', note: 'OffSec', href: '/education#oscp', star: true },
  { when: 'Sept 2026', label: 'Deloitte', note: 'Security Architecture Analyst', href: '/education#deloitte' },
];

export const summaries = {
  about: {
    title: 'Sobre mí',
    text: 'Graduado en Ingeniería del Software con especialización en Ciberseguridad (U-TAD, GPA 8.3/10). Me enfoco en operaciones ofensivas y defensivas, bastionado y automatización de la seguridad en Windows, Linux, Active Directory y Cloud. Antes fui deportista de esquí alpino de alta competición.',
    cta: { label: 'Leer más', href: '/about' },
  },
  experience: {
    title: 'Experiencia',
    items: [
      { role: 'Security Architecture Analyst', org: 'Deloitte', when: 'Sept 2026 – Actualidad', note: 'Evaluación de riesgos, bastionado, seguridad en la nube.' },
      { role: 'Software Engineering Intern', org: 'Capgemini', when: 'Oct 2025 – Abr 2026', note: 'Refactorización de un sistema empresarial en producción.' },
    ],
    cta: { label: 'Toda la trayectoria', href: '/education' },
  },
  certs: {
    title: 'Certificaciones',
    other: { name: 'Appian Certified Associate Developer', date: 'Marzo 2026' },
    cta: { label: 'Ver certificaciones', href: '/education#certificaciones' },
  },
  writeups: {
    title: 'Writeups',
    text: 'Máquinas de Hack The Box resueltas paso a paso: enumeración, explotación y escalada.',
    cta: { label: 'Leer los writeups', href: '/cybersecurity' },
  },
  contact: {
    title: 'Contacto',
    text: 'Si tienes un proyecto de ciberseguridad, desarrollo o IA, escríbeme.',
    cta: { label: 'Página de contacto', href: '/contact' },
  },
};

export const menu = [
  { label: 'Sobre mí', href: '/about' },
  { label: 'Proyectos', href: '/projects' },
  { label: 'Trayectoria', href: '/education' },
  { label: 'Ciberseguridad', href: '/cybersecurity' },
  { label: 'Contacto', href: '/contact' },
];

// Motivos dibujados: viewBox 100x100, trazo currentColor. Uno por proyecto.
export const motifs = {
  dial: '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="6" fill="currentColor"/><path d="M50 50 L68 32"/><path d="M50 12v8M50 80v8M12 50h8M80 50h8M23 23l6 6M71 71l6 6M77 23l-6 6M29 71l-6 6"/>',
  network: '<rect x="8" y="38" width="24" height="24"/><rect x="38" y="12" width="24" height="24"/><rect x="38" y="64" width="24" height="24"/><rect x="68" y="38" width="24" height="24"/><path d="M32 46L38 28M32 54L38 72M62 28L68 46M62 72L68 54"/>',
  document: '<path d="M24 8h36l16 16v68H24z"/><path d="M60 8v16h16"/><path d="M34 44h32M34 56h32M34 68h20"/><circle cx="72" cy="76" r="12" fill="var(--motif-fill, transparent)"/><path d="M80 84l10 10"/>',
  memory: '<rect x="10" y="10" width="16" height="16"/><rect x="34" y="10" width="16" height="16"/><rect x="58" y="10" width="16" height="16" fill="currentColor"/><rect x="10" y="34" width="16" height="16" fill="currentColor"/><rect x="34" y="34" width="16" height="16"/><rect x="58" y="34" width="16" height="16"/><rect x="82" y="34" width="8" height="16"/><rect x="10" y="58" width="16" height="16"/><rect x="34" y="58" width="16" height="16" fill="currentColor"/><rect x="58" y="58" width="16" height="16"/><rect x="10" y="82" width="16" height="8"/><rect x="34" y="82" width="16" height="8"/>',
  flag: '<path d="M22 90V12"/><path d="M22 14h56L66 34l12 20H22"/>',
  geofence: '<circle cx="50" cy="50" r="40" stroke-dasharray="6 6"/><circle cx="50" cy="50" r="24"/><path d="M50 30c-9 0-15 7-15 15 0 11 15 25 15 25s15-14 15-25c0-8-6-15-15-15z" fill="var(--motif-fill, transparent)"/><circle cx="50" cy="45" r="5" fill="currentColor"/>',
  jar: '<path d="M30 20h40v10H30z"/><path d="M26 30h48v50c0 6-4 10-10 10H36c-6 0-10-4-10-10z"/><path d="M50 74V54"/><path d="M50 58c-10 0-14-6-14-14 10 0 14 6 14 14zM50 54c0-9 5-14 14-14 0 9-5 14-14 14z" fill="var(--motif-fill, transparent)"/>',
  pad: '<rect x="12" y="12" width="34" height="34" rx="3"/><rect x="54" y="12" width="34" height="34" rx="3" fill="currentColor"/><rect x="12" y="54" width="34" height="34" rx="3"/><rect x="54" y="54" width="34" height="34" rx="3"/><path d="M20 24h18M20 32h18M62 63h18M62 71h18M20 66h18M20 74h18"/>',
  desk: '<rect x="12" y="20" width="76" height="66"/><path d="M12 40h76M32 12v16M68 12v16"/><rect x="24" y="52" width="14" height="12"/><rect x="46" y="52" width="14" height="12" fill="currentColor"/><rect x="68" y="52" width="12" height="12"/><rect x="24" y="70" width="14" height="10"/>',
  film: '<rect x="12" y="40" width="76" height="46"/><path d="M12 40l8-24h16l-8 24M32 40l8-24h16l-8 24M52 40l8-24h16l-8 24M72 40l8-24"/><circle cx="50" cy="64" r="10"/>',
  layers: '<rect x="14" y="18" width="72" height="18"/><rect x="14" y="41" width="72" height="18" fill="currentColor"/><rect x="14" y="64" width="72" height="18"/><path d="M26 27h14M26 73h28"/>',
  neural: '<circle cx="16" cy="28" r="7"/><circle cx="16" cy="72" r="7"/><circle cx="50" cy="18" r="7"/><circle cx="50" cy="50" r="7" fill="currentColor"/><circle cx="50" cy="82" r="7"/><circle cx="84" cy="50" r="7"/><path d="M22 28l22-8M22 30l22 20M22 70l22-20M22 72l22 10M57 20l20 28M57 50h20M57 80l20-28"/>',
  updown: '<path d="M30 50V14M16 28l14-14 14 14"/><path d="M70 50v36M56 72l14 14 14-14"/>',
  broker: '<circle cx="50" cy="50" r="12" fill="var(--motif-fill, transparent)"/><circle cx="14" cy="22" r="7"/><circle cx="86" cy="22" r="7"/><circle cx="14" cy="78" r="7"/><circle cx="86" cy="78" r="7"/><path d="M20 27l20 15M80 27L60 42M20 73l20-15M80 73L60 58"/>',
  builder: '<rect x="10" y="62" width="38" height="26"/><rect x="52" y="62" width="38" height="26"/><rect x="31" y="34" width="38" height="26"/><path d="M50 8v22M40 20l10 10 10-10"/>',
};

export const svg = (motif, cls = 'motif') =>
  `<svg class="${cls}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${motifs[motif]}</svg>`;


// Títulos descriptivos, dato clave de portada, estado y enlaces de la vista rápida.
const extra = {
  termostato: { heading: 'Auditoría termostato IoT', cover: '3+ vulnerabilidades críticas', legal: null },
  wargame: { heading: 'Wargame: ataque y defensa con DMZ', cover: 'Active Directory y Wazuh SIEM' },
  'metadata-analyzer': { heading: 'Analizador de metadatos y amenazas', cover: '5+ formatos · ~70 % menos revisión', repo: 'https://github.com/Diego740/Analizador-Metadatos' },
  'volcado-procesos': { heading: 'Volcado de procesos con WinAPI', cover: 'Incluye procesos protegidos', repo: 'https://github.com/Diego740/MemoryDumpTool-WinApi' },
  ctfs: { heading: 'CTFs: forense y pentesting web', cover: 'Burp Suite · Wireshark · Nmap' },
  geoalarm: { heading: 'GeoAlarm: alarma de ubicación para iOS', cover: 'En App Store · ~80 % menos batería', legal: '/geoalarm-privacy.html', store: 'https://apps.apple.com/app/id6768651486' },
  rootjar: { heading: 'RootJar: finanzas personales para iOS', cover: 'Cifrado de extremo a extremo', legal: '/mybudget-privacy.html' },
  garagepad: { heading: 'GaragePad: mandos de garaje en CarPlay', cover: 'Sin cuentas ni servidores', legal: '/garagepad-privacy.html' },
  updown: { heading: 'UpDown: máquina de Hack The Box', cover: 'Linux · Medium · LFI y SUID' },
  broker: { heading: 'Broker: máquina de Hack The Box', cover: 'Linux · Easy · ActiveMQ' },
  builder: { heading: 'Builder: máquina de Hack The Box', cover: 'Linux · Medium · Jenkins' },
};
export const statusLabel = { 'en-curso': 'En curso', publicada: 'Publicada en App Store', terminado: 'Terminado' };
for (const sh of shelves) for (const p of sh.items) Object.assign(p, extra[p.slug]);
