import { getOrdered } from './collections.mjs';
import { getCollection } from 'astro:content';
const SITE = 'https://diego740.github.io';

// /llms.txt se genera en build desde las colecciones: lo que lee un bot es lo mismo que ve una persona.
export async function buildLlms(lang) {
  const pre = lang === 'en' ? '/en' : '';
  const u = (p) => `${SITE}${pre}${p}`;
  const certs = (await getOrdered('certifications')).filter((c) => c.data.featured);
  const exp = await getOrdered('experience');
  const projects = (await getCollection('projects')).filter((p) => p.data.detail).sort((a, b) => ['seguridad', 'apps', 'otros'].indexOf(a.data.shelf) - ['seguridad', 'apps', 'otros'].indexOf(b.data.shelf) || a.data.order - b.data.order);
  const writeups = (await getCollection('writeups')).filter((w) => w.data.status === 'retired' && w.data.file).sort((a, b) => a.data.date.localeCompare(b.data.date));
  const T = lang === 'es'
    ? { intro: 'Ingeniero de seguridad ofensiva (OSCP y OSCP+) y analista de arquitectura de seguridad en Deloitte (Madrid). Graduado en Ingeniería del Software con especialización en Ciberseguridad (U-TAD). Publica apps iOS con privacidad por diseño.', about: 'Sobre mí', aboutD: 'Perfil, hard skills y competencias', exp: 'Experiencia', expD: 'Experiencia profesional y formación', certs: 'Certificaciones', projects: 'Proyectos', writeups: 'Writeups', writeupsD: 'Writeups de máquinas de Hack The Box (en inglés)', contact: 'Contacto', contactD: 'Correo, LinkedIn y GitHub', verify: 'verificar', other: 'Versión en inglés', langPath: '/en/llms.txt' }
    : { intro: 'Offensive security engineer (OSCP and OSCP+) and security architecture analyst at Deloitte (Madrid). Software Engineering graduate with a Cybersecurity specialization (U-TAD). Ships iOS apps with privacy by design.', about: 'About', aboutD: 'Profile, hard skills and strengths', exp: 'Experience', expD: 'Professional experience and education', certs: 'Certifications', projects: 'Projects', writeups: 'Writeups', writeupsD: 'Hack The Box machine writeups (in English)', contact: 'Contact', contactD: 'Email, LinkedIn and GitHub', verify: 'verify', other: 'Spanish version', langPath: '/llms.txt' };
  const lines = [
    '# Diego Aranda Gómez', '', `> ${T.intro}`, '',
    `## ${T.about}`, `- [${T.about}](${u('/about')}): ${T.aboutD}`, '',
    `## ${T.exp}`, ...exp.map(({ data: e }) => `- [${e.role}, ${e.org}](${u('/education#' + e.anchor)}): ${e.period[lang]}`), `- [${T.expD}](${u('/education')})`, '',
    `## ${T.certs}`, ...certs.map(({ data: c }) => `- [${c.fullName} (${c.name})](${u('/education#' + c.anchor)}): ${c.issuer}, ${c.date[lang]}. [${T.verify}](${c.verifyUrl})`), '',
    `## ${T.projects}`, ...projects.map(({ id, data: p }) => `- [${p.heading[lang]}](${u('/projects/' + id)}): ${p.blurb[lang]}`), '',
    `## ${T.writeups}`, ...writeups.map(({ id, data: w }) => `- [${w.title}](${u('/cybersecurity/' + id)}): ${w.platform}, ${w.os}, ${w.difficulty}, ${w.date}`), `- [${T.writeupsD}](${u('/cybersecurity#writeups')})`, '',
    `## ${T.contact}`, `- [${T.contact}](${u('/contact')}): ${T.contactD}`, '',
    `## Optional`, `- [${T.other}](${SITE}${T.langPath})`, `- [Sitemap](${SITE}/sitemap.xml)`, '',
  ];
  return lines.join('\n');
}
