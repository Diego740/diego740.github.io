import { useState } from 'react';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../components/SectionHeader.jsx';
import styles from './Contact.module.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function Contact({ sectionId }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('contact');
  const header = t('header', { returnObjects: true }) || {};
  const formCopy = t('form', { returnObjects: true }) || {};
  const statusCopy = t('status', { returnObjects: true }) || {};
  const sidebar = t('sidebar', { returnObjects: true }) || {};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setTimeout(() => {
        setLoading(false);
        setStatus({
          type: 'warning',
          message: statusCopy.warning
        });
      }, 800);
      return;
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);
      setStatus({ type: 'success', message: statusCopy.success });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: statusCopy.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id={sectionId || undefined} className={`section-container ${styles.section}`}>
      <SectionHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />
      <div className={styles.grid}>
        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <label>
            {formCopy.name}
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            {formCopy.email}
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            {formCopy.message}
            <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? formCopy.sending : formCopy.submit}
          </button>
          {status.message && <p className={`${styles.status} ${status.type ? styles[status.type] : ''}`}>{status.message}</p>}
        </motion.form>
        <motion.aside
          className={styles.sidebar}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        >
          <div className={styles.contactInfo}>
            <h3>{sidebar.title}</h3>
            <ul>
              <span></span>
              <li>{sidebar.email}</li>
              <li>
                <a href="https://www.linkedin.com/in/diego-aranda-gómez-a06052187" target="_blank" rel="noreferrer">
                  {sidebar.linkedin}
                </a>
              </li>
              <li>
                <a href="https://github.com/Diego740" target="_blank" rel="noreferrer">
                  {sidebar.github}
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.note}>
            <p>{sidebar.note}</p>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

export default Contact;
