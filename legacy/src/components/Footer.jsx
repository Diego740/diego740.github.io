import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';
import { SOCIAL_LINKS } from '../config/socialLinks.js';

function Footer() {
  const { t } = useTranslation('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>{t('copyright')}</p>
        <div className={styles.socials}>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label={t('social.githubAria')}
          >
            <FaGithub />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={t('social.linkedinAria')}
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
