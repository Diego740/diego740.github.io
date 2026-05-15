import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../components/SectionHeader.jsx';
import WriteupCard from '../components/WriteupCard.jsx';
import { writeups } from '../config/writeups.js';
import styles from './Cybersecurity.module.css';

const tools = ['Burp Suite', 'Wireshark', 'Nmap', 'John the Ripper - Hashcat', 'Nessus', 'BloodHound', 'Metasploit'];

function Cybersecurity() {
  const { t } = useTranslation('cybersecurity');
  const header = t('header', { returnObjects: true }) || {};

  return (
    <section className={`section-container ${styles.section}`}>
      <SectionHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h3>{t('toolsTitle')}</h3>
        <ul>
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </motion.div>

      {writeups.length > 0 && (
        <div className={styles.writeupsSection}>
          <h3 className={styles.writeupsTitle}>{t('writeups.title')}</h3>
          <div>
            {writeups.map((writeup, i) => (
              <WriteupCard key={writeup.id} writeup={writeup} index={i} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Cybersecurity;
