import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../components/SectionHeader.jsx';
import styles from './Contact.module.css';
import { SOCIAL_LINKS } from '../config/socialLinks.js';

function Contact({ sectionId }) {
  const { t } = useTranslation('contact');
  const header = t('header', { returnObjects: true }) || {};
  const sidebar = t('sidebar', { returnObjects: true }) || {};

  return (
    <section id={sectionId || undefined} className={`section-container ${styles.section}`}>
      <SectionHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />
      <motion.div
        className={styles.contactBlock}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.contactInfo}>
          <h3>{sidebar.title}</h3>
          <ul>
            <li>
              <a href="mailto:diegoaranda.dev@gmail.com">diegoaranda.dev@gmail.com</a>
            </li>
            <li>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer">
                {sidebar.linkedin}
              </a>
            </li>
            <li>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
                {sidebar.github}
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.note}>
          <p>{sidebar.note}</p>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
