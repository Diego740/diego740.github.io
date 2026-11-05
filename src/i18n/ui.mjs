// Textos de interfaz compartidos. El contenido largo vive en src/content/*.json y src/i18n/{es,en}.json.
export const ui = {
  es: {
    nav: [['/about', 'Sobre mí'], ['/projects', 'Proyectos'], ['/education', 'Trayectoria'], ['/cybersecurity', 'Ciberseguridad'], ['/contact', 'Contacto']],
    shelfNav: { prev: 'Anteriores', next: 'Siguientes' }, home: '/', langLabel: 'EN', langName: 'Switch to English', cv: 'CV', cvFile: '/DiegoArandaGomez-CV-ES.pdf', cvDownload: 'Descargar CV',
    skip: 'Saltar al contenido', verify: 'Verificar credencial', opensNew: '(se abre en otra pestaña)',
    current: 'Puesto actual', privacy: ['Privacidad GeoAlarm', 'Privacidad RootJar', 'Privacidad GaragePad'],
    edu: { title: 'Trayectoria', exp: 'Experiencia profesional', certs: 'Certificaciones', study: 'Formación académica' },
    cyber: { oscpTitle: 'Credenciales OffSec', tools: 'Ecosistema, herramientas y capacidades clave', writeups: 'Writeups', read: 'Leer writeup', active: 'Máquina activa · sin publicar', retired: 'Retirada', onlyEnglish: 'Writeup en inglés' },
    contactLabels: { email: 'Correo', linkedin: 'LinkedIn', github: 'GitHub' }, back: 'Volver',
    proj: { title: 'Proyectos', lead: 'Seguridad ofensiva y defensiva, apps iOS con privacidad por diseño y otros trabajos. Toca una portada para ver el detalle.', shelves: { seguridad: 'Seguridad', apps: 'Apps', otros: 'Desarrollo' }, tech: 'Detalles técnicos', details: 'Ver todos los detalles', close: 'Cerrar', zoom: 'ampliar', quickHint: 'Vista rápida', sticker: 'EN CURSO', writeupsLink: 'Los writeups de Hack The Box están en Ciberseguridad.', writeupsCta: 'Ver writeups', all: 'Todos los proyectos', status: { 'en-curso': 'En curso', publicada: 'Publicada en App Store', terminado: 'Terminado' }, problem: 'El problema', how: 'Qué hice y cómo funciona', results: 'Resultados', stack: 'Tecnologías', limits: 'Límites y uso responsable', notes: 'Detalles de uso', links: 'Enlaces', video: 'Vídeo', gallery: 'Galería', repo: 'Repositorio', store: 'Ver en la App Store', legal: 'Privacidad y términos', report: 'Informe de la auditoría' },
  },
  en: {
    nav: [['/en/about', 'About'], ['/en/projects', 'Projects'], ['/en/education', 'Trajectory'], ['/en/cybersecurity', 'Cybersecurity'], ['/en/contact', 'Contact']],
    shelfNav: { prev: 'Previous', next: 'Next' }, home: '/en/', langLabel: 'ES', langName: 'Cambiar a español', cv: 'CV', cvFile: '/DiegoArandaGomez-CV-EN.pdf', cvDownload: 'Download CV',
    skip: 'Skip to content', verify: 'Verify credential', opensNew: '(opens in a new tab)',
    current: 'Current role', privacy: ['GeoAlarm privacy', 'RootJar privacy', 'GaragePad privacy'],
    edu: { title: 'Trajectory', exp: 'Professional experience', certs: 'Certifications', study: 'Academic background' },
    cyber: { oscpTitle: 'OffSec credentials', tools: 'Ecosystem, key tools & capabilities', writeups: 'Writeups', read: 'Read writeup', active: 'Active machine · unpublished', retired: 'Retired', onlyEnglish: 'Writeup in English' },
    contactLabels: { email: 'Email', linkedin: 'LinkedIn', github: 'GitHub' }, back: 'Back',
    proj: { title: 'Projects', lead: 'Offensive and defensive security, iOS apps with privacy by design, and other work. Tap a cover to see the details.', shelves: { seguridad: 'Security', apps: 'Apps', otros: 'Development' }, tech: 'Technical details', details: 'See all details', close: 'Close', zoom: 'enlarge', quickHint: 'Quick view', sticker: 'IN DEV', writeupsLink: 'Hack The Box writeups live under Cybersecurity.', writeupsCta: 'See writeups', all: 'All projects', status: { 'en-curso': 'In progress', publicada: 'Published on the App Store', terminado: 'Finished' }, problem: 'The problem', how: 'What I did and how it works', results: 'Results', stack: 'Tech stack', limits: 'Limits and responsible use', notes: 'Usage details', links: 'Links', video: 'Video', gallery: 'Gallery', repo: 'Repository', store: 'View on the App Store', legal: 'Privacy and terms', report: 'Audit report' },
  },
};
export const social = { linkedin: 'https://www.linkedin.com/in/diego-aranda-gomez', github: 'https://github.com/Diego740', email: 'diegoaranda.dev@gmail.com' };
export const CYBER_TOOLS = [
  'OSCP Methodologies (OffSec Certified)', 'Active Directory (BloodHound · Mimikatz)', 'Wazuh SIEM (Detection & Log Correlation)',
  'Burp Suite Pro (Web Exploitation)', 'Nmap & Network Reconnaissance', 'Wireshark & Network Forensics', 'Metasploit Framework',
  'Hashcat & John the Ripper', 'Reverse Engineering (Ghidra · WinAPI)', 'Linux & Windows Hardening', 'Enterprise Infrastructure (Netskope · Zscaler · AWS)',
];
