// Textos de la home por idioma (el resto del contenido sale de las colecciones).
export const homeText = {
  es: {
    title: 'Diego Aranda Gómez · Ingeniero de seguridad ofensiva (OSCP)',
    description: 'Portfolio de Diego Aranda Gómez: ingeniero de seguridad ofensiva (OSCP/OSCP+), analista de arquitectura de seguridad en Deloitte y desarrollador de apps iOS con privacidad por diseño.',
    positioning: 'Ingeniero de seguridad ofensiva (OSCP) y analista de arquitectura de seguridad en Deloitte. Publico apps iOS con privacidad por diseño.',
    skip: 'Saltar al escaparate', showcase: 'Escaparate de proyectos', menu: 'Menú', timelineLabel: 'Trayectoria profesional',
    timeline: [
      { when: 'Prev.', label: 'Esquí de alto rendimiento', href: '/about' },
      { when: '2022', label: 'U-TAD', href: '/education#utad' },
      { when: 'Oct 2025', label: 'Capgemini', href: '/education#capgemini' },
      { when: 'Sept 2026', label: 'OSCP / OSCP+', href: '/education#oscp', star: true },
      { when: 'Sept 2026', label: 'Deloitte', href: '/education#deloitte' },
    ],
    about: { title: 'Sobre mí', text: 'Graduado en Ingeniería del Software con especialización en Ciberseguridad (U-TAD, GPA 8.3/10). Me enfoco en operaciones ofensivas y defensivas, bastionado y automatización de la seguridad en Windows, Linux, Active Directory y Cloud. Antes fui deportista de esquí alpino de alta competición.', cta: ['Leer más', '/about'] },
    experience: { title: 'Experiencia', notes: { deloitte: 'Evaluación de riesgos, bastionado, seguridad en la nube.', capgemini: 'Refactorización de un sistema empresarial en producción.' }, cta: ['Toda la trayectoria', '/education'] },
    certs: { title: 'Certificaciones', also: 'Además', cta: ['Ver certificaciones', '/education#certificaciones'] },
    writeups: { title: 'Writeups', text: 'Máquinas de Hack The Box resueltas paso a paso: enumeración, explotación y escalada.', cta: ['Leer los writeups', '/cybersecurity'] },
    contact: { title: 'Contacto', text: 'Si tienes un proyecto de ciberseguridad, desarrollo o IA, escríbeme.', cta: ['Página de contacto', '/contact'], cv: 'Descargar CV' },
  },
  en: {
    title: 'Diego Aranda Gómez · Offensive security engineer (OSCP)',
    description: 'Portfolio of Diego Aranda Gómez: offensive security engineer (OSCP/OSCP+), security architecture analyst at Deloitte and iOS app developer with privacy by design.',
    positioning: 'Offensive security engineer (OSCP) and security architecture analyst at Deloitte. I ship iOS apps with privacy by design.',
    skip: 'Skip to showcase', showcase: 'Project showcase', menu: 'Menu', timelineLabel: 'Career timeline',
    timeline: [
      { when: 'Prev.', label: 'Elite alpine skiing', href: '/en/about' },
      { when: '2022', label: 'U-TAD', href: '/en/education#utad' },
      { when: 'Oct 2025', label: 'Capgemini', href: '/en/education#capgemini' },
      { when: 'Sept 2026', label: 'OSCP / OSCP+', href: '/en/education#oscp', star: true },
      { when: 'Sept 2026', label: 'Deloitte', href: '/en/education#deloitte' },
    ],
    about: { title: 'About me', text: 'Software Engineering graduate specialized in Cybersecurity (U-TAD, GPA 8.3/10). I focus on offensive and defensive operations, hardening and security automation across Windows, Linux, Active Directory and Cloud. Before that, I was a high-performance alpine skier.', cta: ['Read more', '/en/about'] },
    experience: { title: 'Experience', notes: { deloitte: 'Risk assessment, hardening and cloud security.', capgemini: 'Refactoring of a production enterprise system.' }, cta: ['Full trajectory', '/en/education'] },
    certs: { title: 'Certifications', also: 'Also', cta: ['See certifications', '/en/education#certificaciones'] },
    writeups: { title: 'Writeups', text: 'Hack The Box machines solved step by step: enumeration, exploitation and privilege escalation.', cta: ['Read the writeups', '/en/cybersecurity'] },
    contact: { title: 'Contact', text: 'If you have a cybersecurity, development or AI project, get in touch.', cta: ['Contact page', '/en/contact'], cv: 'Download CV' },
  },
};
