import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../styles/Education.css';

export default function Education({ sectionId }) {
  const { t } = useTranslation('education');

  const pageTitle = t('pageTitle', { defaultValue: t('title', 'Trayectoria') });
  const pageEyebrow = t('pageEyebrow', { defaultValue: '// EXPERIENCIA & FORMACIÓN' });

  const expTitle = t('experienceTitle', { defaultValue: 'Experiencia Profesional' });
  const expItems = t('experience', { returnObjects: true }) || [];

  const certTitle = t('certificationsTitle', { defaultValue: 'Certificaciones' });
  const certItems = t('certifications', { returnObjects: true }) || [];

  const eduTitle = t('educationTitle', { defaultValue: 'Formación Académica' });
  const eduItems = t('education', { returnObjects: true }) || t('items', { returnObjects: true }) || [];

  const renderSection = (title, items, isFirst = false) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    return (
      <div className="education-section-block">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          style={isFirst ? {} : { marginTop: '2.5rem' }}
        >
          {title}
        </motion.h2>

        <div className="education-content">
          {items.map((item, index) => (
            <motion.div
              key={item.title || index}
              className="education-item"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <div className="education-item-header">
                <h3>{item.title}</h3>
                {item.badge && <span className="education-badge">{item.badge}</span>}
              </div>

              {item.details && item.details.length > 0 && (
                <div className="education-meta">
                  {item.details.map((detail, dIdx) => (
                    <span key={dIdx} className="education-meta-line">
                      {detail}
                    </span>
                  ))}
                </div>
              )}

              {item.description && (
                <p className="education-detail">{item.description}</p>
              )}

              {item.highlights && item.highlights.length > 0 && (
                <ul className="education-highlights">
                  {item.highlights.map((highlight, hIdx) => (
                    <li key={hIdx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id={sectionId || undefined} className="education">
      <motion.div
        className="education-page-header"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="education-page-eyebrow">{pageEyebrow}</span>
        <h1 className="education-main-title">{pageTitle}</h1>
      </motion.div>

      {renderSection(expTitle, expItems, true)}
      {renderSection(certTitle, certItems)}
      {renderSection(eduTitle, eduItems)}
    </section>
  );
}
