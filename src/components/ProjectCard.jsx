import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './ProjectCard.module.css';

const entryVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

function ProjectCard({ title, tech, description, link, index = 0 }) {
  const { t } = useTranslation('projects');
  const displayIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      className={styles.entry}
      variants={entryVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <span className={styles.index}>{displayIndex}</span>
      <div className={styles.body}>
        <div className={styles.header}>
          <h3>{title}</h3>
          {tech && <span className={styles.tech}>{Array.isArray(tech) ? tech.join(' · ') : tech}</span>}
        </div>
        <p className={styles.description}>{description}</p>
        {link && (
          <a href={link} className={styles.link} target="_blank" rel="noreferrer">
            {t('completed.viewProject')} →
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default ProjectCard;
