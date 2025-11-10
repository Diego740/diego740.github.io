import { HiOutlineArrowDown } from 'react-icons/hi';
import SectionHeader from '../components/SectionHeader.jsx';
import SkillTag from '../components/SkillTag.jsx';
import { useTranslation } from 'react-i18next';
import styles from './About.module.css';

const technicalSkills = ['C', 'C++', 'Java', 'Python', 'React', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'SQL', 'MongoDB'];

function About({ sectionId }) {
  const { t, i18n } = useTranslation('about');
  const header = t('header', { returnObjects: true }) || {};
  const softSkills = t('softSkills', { returnObjects: true }) || [];

  const language = (i18n.language || 'es').toLowerCase();
  const isEnglish = language.startsWith('en');
  const cvFile = isEnglish
    ? '/DiegoArandaGomez-CV-EN.pdf'
    : '/DiegoArandaGomez-CV-ES.pdf';
  const downloadFileName = cvFile.split('/').pop();

  return (
    <section id={sectionId || undefined} className={`section-container ${styles.about}`}>
      <SectionHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />
      <div className={styles.actions}>
        <a
          className={styles.downloadButton}
          href={cvFile}
          download={downloadFileName}
        >
          <span className={styles.buttonLabel}>{t('downloadCv')}</span>
          <HiOutlineArrowDown aria-hidden="true" className={styles.downloadIcon} />
        </a>
      </div>
      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>{t('technicalTitle')}</h3>
          <div className="tag-grid">
            {technicalSkills.map((skill) => (
              <SkillTag key={skill} label={skill} />
            ))}
          </div>
        </article>
        <article className={styles.card}>
          <h3>{t('softTitle')}</h3>
           <div className="tag-grid">
            {softSkills.map((skill) => (
              <SkillTag key={skill} label={skill} />
              
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default About;
