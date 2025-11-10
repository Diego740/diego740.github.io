import { motion } from 'framer-motion';
import styles from './SkillTag.module.css';

function SkillTag({ label }) {
  return (
    <motion.span
      className={styles.tag}
      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(138, 43, 226, 0.3)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
    >
      {label}
    </motion.span>
  );
}

export default SkillTag;
