import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaLock, FaLinux, FaWindows } from 'react-icons/fa';
import styles from './WriteupCard.module.css';

const DIFFICULTY_COLORS = {
  Easy:   '#4ade80',
  Medium: '#fb923c',
  Hard:   '#f87171',
  Insane: 'var(--accent-color)',
};

function OsIcon({ os }) {
  if (os === 'Linux')   return <FaLinux size={12} />;
  if (os === 'Windows') return <FaWindows size={12} />;
  return null;
}

const entryVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function WriteupCard({ writeup, index }) {
  const { t } = useTranslation('cybersecurity');
  const { id, title, os, difficulty, status, date, file } = writeup;
  const isLocked = status === 'active' || !file;
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
          <span className={styles.meta}>
            <OsIcon os={os} />
            {os}
            <span className={styles.dot}>·</span>
            <span style={{ color: DIFFICULTY_COLORS[difficulty] }}>{difficulty}</span>
          </span>
        </div>
        <div className={styles.sub}>
          <span className={styles.status} data-status={status}>
            [{t(`writeups.status.${status}`)}]
          </span>
          <span className={styles.date}>{date}</span>
        </div>
        <div className={styles.actions}>
          {isLocked ? (
            <span className={styles.locked}>
              <FaLock size={11} />
              {t('writeups.machineActive')}
            </span>
          ) : (
            <Link to={`/cybersecurity/${id}`} className={styles.link}>
              {t('writeups.readWriteup')} →
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default WriteupCard;
