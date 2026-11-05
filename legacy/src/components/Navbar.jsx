import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher.jsx';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('navbar');

  const navItems = useMemo(
    () => [
      { path: '/', label: t('home') },
      { path: '/about', label: t('about') },
      { path: '/projects', label: t('projects') },
      { path: '/education', label: t('education') },
      { path: '/cybersecurity', label: t('cybersecurity') },
      { path: '/contact', label: t('contact') }
    ],
    [t]
  );

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <span className={styles.logoAccent}>{'<'}</span>
          Diego
          <span className={styles.logoAccent}>/&gt;</span>
        </NavLink>
        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          <LanguageSwitcher compact />
        </nav>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <LanguageSwitcher />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
