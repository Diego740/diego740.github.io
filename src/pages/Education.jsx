import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../styles/Education.css';

export default function Education({ sectionId }) {
  const { t } = useTranslation('education');
  const title = t('title');
  const educationItems = t('items', { returnObjects: true }) || [];

  return (
    <section id={sectionId || undefined} className="education">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {title}
      </motion.h2>

      <div className="education-content">
        {educationItems.map((item, index) => (
          <motion.div
            key={item.title}
            className="education-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.4 }}
          >
            <h3>{item.title}</h3>
            <p>
              {item.details?.map((detail, detailIndex) => (
                <span key={detail}>
                  {detail}
                  {detailIndex < item.details.length - 1 && <br />}
                </span>
              ))}
            </p>
            <p className="education-detail">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
