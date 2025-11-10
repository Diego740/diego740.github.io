import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEs from './locales/es/common.json';
import navbarEs from './locales/es/navbar.json';
import homeEs from './locales/es/home.json';
import aboutEs from './locales/es/about.json';
import projectsEs from './locales/es/projects.json';
import educationEs from './locales/es/education.json';
import contactEs from './locales/es/contact.json';
import footerEs from './locales/es/footer.json';
import cybersecurityEs from './locales/es/cybersecurity.json';

import notFoundEs from './locales/es/notFound.json';

import commonEn from './locales/en/common.json';
import navbarEn from './locales/en/navbar.json';
import homeEn from './locales/en/home.json';
import aboutEn from './locales/en/about.json';
import projectsEn from './locales/en/projects.json';
import educationEn from './locales/en/education.json';
import contactEn from './locales/en/contact.json';
import footerEn from './locales/en/footer.json';
import cybersecurityEn from './locales/en/cybersecurity.json';

import notFoundEn from './locales/en/notFound.json';

const resources = {
  es: {
    common: commonEs,
    navbar: navbarEs,
    home: homeEs,
    about: aboutEs,
    projects: projectsEs,
    education: educationEs,
    contact: contactEs,
    footer: footerEs,
    cybersecurity: cybersecurityEs,
    notFound: notFoundEs
  },
  en: {
    common: commonEn,
    navbar: navbarEn,
    home: homeEn,
    about: aboutEn,
    projects: projectsEn,
    education: educationEn,
    contact: contactEn,
    footer: footerEn,
    cybersecurity: cybersecurityEn,
    notFound: notFoundEn
  }
};

const storedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage || 'es',
    fallbackLng: 'es',
    ns: ['common', 'navbar', 'home', 'about', 'projects', 'education', 'contact', 'footer', 'cybersecurity', 'notFound'],
    defaultNS: 'home',
    interpolation: { escapeValue: false },
    returnEmptyString: false,
    react: { useSuspense: false }
  });

export default i18n;
