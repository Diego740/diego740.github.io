import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './ProjectsInProgress.module.css';

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut', delay: index * 0.1 }
  })
};

function InProgressCard({ project, index, copy, meta, objectivesLabel }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      className={styles.timelineItem}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
    >
      {/* Header */}
      <header className={styles.cardHeader}>
        <h4>{project.title}</h4>
        {project.status && (
          <span className={styles.status}>{project.status}</span>
        )}
      </header>

      {/* Metadata */}
      <dl className={styles.meta}>
        {project.startDate && (
          <div>
            <dt>{meta.start}</dt>
            <dd>{project.startDate}</dd>
          </div>
        )}
        {project.scope && (
          <div>
            <dt>{meta.scope}</dt>
            <dd>{project.scope}</dd>
          </div>
        )}
      </dl>

      {/* Objectives accordion */}
      {project.objectives?.length > 0 && (
        <div className={styles.objectivesWrapper}>
          <button
            type="button"
            className={styles.objectivesToggle}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <span className={styles.togglePrefix}>
              {open ? '−' : '+'}
            </span>
            <span>{objectivesLabel}</span>
            <motion.span
              className={styles.chevronIcon}
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                className={styles.objectivesList}
                key="objectives"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                {project.objectives.map((obj) => (
                  <motion.li
                    key={obj}
                    initial={{ x: -8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {obj}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        {project.repository ? (
          <a
            href={project.repository}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {copy.viewRepo} →
          </a>
        ) : (
          <span className={styles.privateRepo}>{copy.privateRepo}</span>
        )}
      </footer>
    </motion.article>
  );
}

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
        {copy.description && <p>{copy.description}</p>}
      </motion.div>

      {hasProjects ? (
        <div className={styles.timeline}>
          {projects.map((project, index) => (
            <InProgressCard
              key={project.title}
              project={project}
              index={index}
              copy={copy}
              meta={meta}
              objectivesLabel={objectivesLabel}
            />
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
