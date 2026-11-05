import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import styles from './NotFound.module.css';

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const pulseVariants = {
  animate: {
    opacity: [0.3, 1, 0.3],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
  }
};

const lineVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + index * 0.15, duration: 0.4, ease: 'easeOut' }
  })
};

function NotFound() {
  const location = useLocation();
  const { t } = useTranslation('notFound');
  const log = t('log', { returnObjects: true }) || {};

  return (
    <motion.section
      className={styles.wrapper}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.scanlines} aria-hidden="true" />
      <motion.div
        className={styles.terminal}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className={styles.status} variants={pulseVariants} animate="animate">
          {t('status')}
        </motion.span>
        <motion.h1 className={styles.glitch} data-text="404" custom={0} variants={lineVariants}>
          404
        </motion.h1>
        <motion.p className={styles.subtitle} custom={1} variants={lineVariants}>
          <Trans i18nKey="subtitle" t={t} values={{ path: location.pathname }} components={{ 0: <span className={styles.highlight} /> }} />
        </motion.p>
        <motion.p className={styles.description} custom={2} variants={lineVariants}>
          {t('description')}
          <span className={styles.caret} aria-hidden="true">
            _
          </span>
        </motion.p>

        <motion.div className={styles.actions} custom={3} variants={lineVariants}>
          <Link to="/" className={styles.homeButton}>
            {t('backHome')}
          </Link>

        </motion.div>
        <motion.div className={styles.log} custom={4} variants={lineVariants}>
          <p>
            <Trans i18nKey="log.status" t={t} components={{ 0: <span className={styles.accent} /> }} />
          </p>
          <p>{log.suggestion}</p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default NotFound;
