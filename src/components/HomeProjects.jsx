import SectionHeader from './SectionHeader.jsx';
import ProjectsInProgress from './ProjectsInProgress.jsx';
import FeaturedProjects from './FeaturedProjects.jsx';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from '../../src/pages/Projects.module.css';

function HomeProjects({ sectionId }) {
  const { t } = useTranslation('projects');
  const header = t('header', { returnObjects: true }) || {};
  const projectsInProgress = t('projectsInProgress', { returnObjects: true }) || [];
  const allProjectsCta = t('allProjects', { returnObjects: true }) || {};
  const showAllProjectsLink = Boolean(allProjectsCta?.label);

  return (
    <section id={sectionId || undefined} className={`section-container ${styles.projects}`}>
      <SectionHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
      />
      <ProjectsInProgress projects={projectsInProgress} />
      <FeaturedProjects />
      {showAllProjectsLink && (
        <div className={styles.allProjectsCta}>
          <Link
            to="/projects"
            className={styles.allProjectsLink}
            aria-label={allProjectsCta.aria || allProjectsCta.label}
          >
            {allProjectsCta.label}
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}

export default HomeProjects;
