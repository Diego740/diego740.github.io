import es from '../i18n/es.json';
import en from '../i18n/en.json';

const SITE = 'https://diego740.github.io';
const ME = { '@type': 'Person', name: 'Diego Aranda Gómez', url: `${SITE}/` };

// Credenciales OffSec como entidades propias (nombre, emisor, fecha y enlace de verificación)
export const credentialLd = (c) => ({
  '@context': 'https://schema.org', '@type': 'EducationalOccupationalCredential',
  name: c.name === 'OSCP+' ? 'OSCP+ (OffSec Certified Professional+)' : 'OSCP (Offensive Security Certified Professional)',
  credentialCategory: 'certification', dateCreated: '2026-09',
  recognizedBy: { '@type': 'Organization', name: 'OffSec', url: 'https://www.offsec.com/' },
  url: c.verifyUrl, about: ME,
});

export const personLd = (lang, creds) => ({
  '@context': 'https://schema.org', '@type': 'Person', '@id': `${SITE}/#diego`, name: 'Diego Aranda Gómez', url: `${SITE}/`,
  jobTitle: 'Security Architecture Analyst',
  worksFor: { '@type': 'Organization', name: 'Deloitte' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'U-TAD' },
  sameAs: ['https://github.com/Diego740', 'https://www.linkedin.com/in/diego-aranda-gomez'],
  knowsAbout: (lang === 'es' ? es : en).about.technicalSkills,
  hasCredential: creds.map(credentialLd).map(({ '@context': _, about: __, ...c }) => c),
});

export const appLd = (id, p, lang) => ({
  '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: p.title, operatingSystem: 'iOS',
  description: p.blurb[lang], url: p.links.store ?? `${SITE}${lang === 'en' ? '/en' : ''}/projects/${id}`, author: ME, keywords: p.tags.join(', '),
});

export const workLd = (id, p, lang) => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.whatIs[lang],
  url: `${SITE}${lang === 'en' ? '/en' : ''}/projects/${id}`, author: ME, keywords: p.tags.join(', '), inLanguage: lang,
  ...(p.links.repo ? { sameAs: p.links.repo } : {}),
});

export const writeupLd = (id, w, tags, lang) => ({
  '@context': 'https://schema.org', '@type': 'TechArticle', headline: `${w.title} (${w.platform}, ${w.os})`,
  datePublished: w.date, author: ME, inLanguage: 'en', keywords: tags.join(', '),
  url: `${SITE}${lang === 'en' ? '/en' : ''}/cybersecurity/${id}`, about: `${w.platform} machine ${w.title}`,
});
