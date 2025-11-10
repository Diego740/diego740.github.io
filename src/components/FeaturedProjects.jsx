import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './FeaturedProjects.module.css';
import ProjectCard from './ProjectCard';

const headingVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      delay: index * 0.08
    }
  })
};

export default function FeaturedProjects() {
  const { t } = useTranslation('projects');
  const projects = t('featuredProjects', { returnObjects: true }) || [];
  const hasProjects = projects.length > 0;

  if (!hasProjects) {
    return null;
  }

  return (
    <section id="featured-projects" className={styles.featuredProjects}>
      <motion.h2
        className={styles.sectionTitle}
        variants={headingVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {t('featuredTitle')}
      </motion.h2>

      <div className={styles.projectsGrid}>
        {projects.map((project, index) => {
          const tech = Array.isArray(project.tech) ? project.tech.join(', ') : project.tech;

          return (
             <ProjectCard key={project.title}{...project}/>
                      
          );
        })}
      </div>
    </section>
  );
}
