import { motion } from 'framer-motion';
import styles from './SectionHeader.module.css';

function SectionHeader({ eyebrow, title, description }) {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </motion.header>
  );
}

export default SectionHeader;
