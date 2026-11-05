import { motion } from 'framer-motion';
import styles from './SkillTag.module.css';

function SkillTag({ label }) {
  return (
    <motion.span
      className={styles.tag}
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {label}
    </motion.span>
  );
}

export default SkillTag;
