import SectionHeader from '../components/SectionHeader.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectsInProgress from '../components/ProjectsInProgress.jsx';
import FeaturedProjects from '../components/FeaturedProjects.jsx';
import { useTranslation } from 'react-i18next';
import styles from './Projects.module.css';

function Projects({ sectionId }) {
  const { t } = useTranslation('projects');
  const header = t('header', { returnObjects: true }) || {};
  const completed = t('completed', { returnObjects: true }) || {};
  const projectsInProgress = t('projectsInProgress', { returnObjects: true }) || [];
  const completedProjects = t('completedProjects', { returnObjects: true }) || [];

  return (
    <section id={sectionId || undefined} className={`section-container ${styles.projects}`}>
      <SectionHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />

      <ProjectsInProgress projects={projectsInProgress} />
      <FeaturedProjects />

      <div className={styles.completedSection}>
        <div className={styles.completedHeading}>
          <span>{completed.eyebrow}</span>
          <h3>{completed.title}</h3>
          <p>{completed.description}</p>
        </div>
        <div className={`${styles.grid} grid-responsive`}>
          {completedProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
