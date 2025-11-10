import { useEffect, useMemo, useState, createContext } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Cybersecurity from './pages/Cybersecurity.jsx';

import Contact from './pages/Contact.jsx';
import Education from './pages/Education.jsx';
import NotFound from './pages/NotFound.jsx';

export const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35, ease: 'easeIn' } }
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
  }
  return 'dark';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>
        <AnimatedBackground />
        <Navbar />
        <ThemeToggle />
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
              <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
              <Route path="/projects" element={<AnimatedPage><Projects /></AnimatedPage>} />
              <Route path="/cybersecurity" element={<AnimatedPage><Cybersecurity /></AnimatedPage>} />
              <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
              <Route path="/education" element={<AnimatedPage><Education /></AnimatedPage>} />
              <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
