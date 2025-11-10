import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './ProjectsInProgress.module.css';

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
      delay: index * 0.1
    }
  })
};

function ProjectsInProgress({ projects = [] }) {
  const hasProjects = projects.length > 0;
  const { t } = useTranslation('projects');
  const copy = t('inProgress', { returnObjects: true }) || {};
  const meta = copy.meta || {};
  const objectivesLabel = copy.objectives || t('common:projects.objectives');

  return (
    <section className={styles.wrapper} aria-labelledby="in-progress-heading">
      <motion.div
        className={styles.heading}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        <span className={styles.eyebrow}>{copy.eyebrow}</span>
        <h3 id="in-progress-heading">{copy.title}</h3>
        <p>{copy.description}</p>
      </motion.div>

      {hasProjects ? (
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              className={styles.card}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={index}
            >
              <header className={styles.cardHeader}>
                <h4>{project.title}</h4>
                <span className={styles.status}>{project.status}</span>
              </header>

              <dl className={styles.meta}>
                <div>
                  <dt>{meta.start}</dt>
                  <dd>{project.startDate}</dd>
                </div>
                {project.scope && (
                  <div>
                    <dt>{meta.scope}</dt>
                    <dd>{project.scope}</dd>
                  </div>
                )}
              </dl>

              <details className={styles.objectives}>
                <summary>
                  {objectivesLabel}
                  <span aria-hidden="true" className={styles.chevron} />
                </summary>
                <ul>
                  {project.objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </details>

              <footer className={styles.footer}>
                {project.repository ? (
                  <a href={project.repository} target="_blank" rel="noreferrer" className={styles.link}>
                    {copy.viewRepo}
                  </a>
                ) : (
                  <span className={styles.privateRepo}>{copy.privateRepo}</span>
                )}
              </footer>
            </motion.article>
          ))}
        </div>
      ) : (
        <motion.div
          className={styles.emptyState}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          role="status"
          aria-live="polite"
        >
          <p>{copy.empty}</p>
        </motion.div>
      )}
    </section>
  );
}

export default ProjectsInProgress;
