import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './Footer.module.css';

function Footer() {
  const { t } = useTranslation('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>{t('copyright')}</p>
        <div className={styles.socials}>
          <a
            href="https://github.com/Diego740"
            target="_blank"
            rel="noreferrer"
            aria-label={t('social.githubAria')}
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/diego-aranda-gómez-a06052187"
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
