import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import About from './About.jsx';
import HomeProjects from '../components/HomeProjects.jsx';
import Contact from './Contact.jsx';
import styles from './Home.module.css';

const landingSections = [
  { id: 'about', Component: About, translateY: [-12, 12] },
  { id: 'projects', Component: HomeProjects, translateY: [-8, 16] },
  { id: 'contact', Component: Contact, translateY: [-4, 10] }
];

function Home() {
  const [displayedText, setDisplayedText] = useState('');
  const { t } = useTranslation('home');
  const heroTitle = t('hero.title');
  const heroEyebrows = t('hero.eyebrows', { returnObjects: true }) || [];
  const heroSubtitle = t('hero.subtitle');
  const heroCta = t('hero.cta', { returnObjects: true }) || {};
  const exploreLabel = t('hero.explore');
  const exploreAria = t('hero.exploreAria');

  useEffect(() => {
    if (!heroTitle) {
      setDisplayedText('');
      return undefined;
    }

    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      setDisplayedText(heroTitle);
      return undefined;
    }

    setDisplayedText('');
    let index = 1;
    const interval = setInterval(() => {
      setDisplayedText(heroTitle.slice(0, index));
      index += 1;
      if (index > heroTitle.length) {
        clearInterval(interval);
        setDisplayedText(heroTitle);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [heroTitle]);

  const handleExplore = useCallback(() => {
    const nextSection = document.getElementById(landingSections[0].id);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden="true">
          <motion.div
            className={`${styles.glow} ${styles.glowOne}`}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={`${styles.glow} ${styles.glowTwo}`}
            animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <p className={styles.promptLine}>init()</p>
          <div className={styles.heroEyebrowGroup}>
            {heroEyebrows.map((eyebrow) => (
              <span key={eyebrow} className={styles.eyebrow}>
                {eyebrow}
              </span>
            ))}
          </div>
          <motion.h1
            className={`${styles.title} ${styles.typewriterTitle}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={styles.typewriterText}>{displayedText}</span>
            <span className={styles.blinkingCursor}>|</span>
          </motion.h1>
          <div className={styles.titleDivider} aria-hidden="true" />
          <p className={styles.subtitle}>{heroSubtitle}</p>
          <div className={styles.actions}>
            <a
              href="https://www.linkedin.com/in/diego-aranda-gómez-a06052187"
              target="_blank"
              rel="noreferrer"
              className={styles.primaryButton}
              aria-label={heroCta.linkedinAria}
            >
              <FaLinkedin /> {heroCta.linkedin}
            </a>
            <a
              href="https://github.com/Diego740"
              target="_blank"
              rel="noreferrer"
              className={styles.secondaryButton}
              aria-label={heroCta.githubAria}
            >
              <FaGithub /> {heroCta.github}
            </a>
          </div>
          <button
            type="button"
            className={styles.exploreButton}
            onClick={handleExplore}
            aria-label={exploreAria}
          >
            <span>{exploreLabel}</span>
            <motion.span
              className={styles.arrow}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </button>
        </motion.div>
      </section>

      <div className={styles.sectionsWrapper}>
        {landingSections.map(({ id, Component }) => (
          <div key={id} className={styles.sectionParallax}>
            <div className="section-container">
              <Component sectionId={id} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
