import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './ProjectCard.module.css';
import { useCardGlow } from '../hooks/useCardGlow';

const cardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

function ProjectCard({ title, tech, description, link }) {
  const { t } = useTranslation('projects');
  const { ref, handleMouseMove, handleMouseLeave } = useCardGlow();

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(138, 43, 226, 0.25)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.header}>
        <h3>{title}</h3>
        <span className={styles.tech}>{tech}</span>
      </div>
      <p className={styles.description}>{description}</p>
      {link && (
        <a href={link} className={styles.link} target="_blank" rel="noreferrer">
          {t('completed.viewProject')}
          <FaArrowRight />
        </a>
      )}
    </motion.article>
  );
}

export default ProjectCard;
