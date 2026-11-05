import { useContext } from 'react';
import { motion } from 'framer-motion';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../App.jsx';
import styles from './ThemeToggle.module.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation('common');

  return (
    <motion.button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={t('themeToggle')}
      initial={false}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className={styles.iconWrapper}
        animate={{ x: theme === 'dark' ? 0 : '2.4rem' }}
        transition={{ type: 'spring', stiffness: 240, damping: 16 }}
      >
        {theme === 'dark' ? <BsMoonStars size={16} /> : <BsSun size={16} />}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
