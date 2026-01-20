import { useState, useEffect } from 'react';
import TagFilter from '../../components/TagFilter';
import ProjectGrid from '../../components/ProjectGrid';
import ProjectModal from '../../components/ProjectModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Projects.module.css';
import withFeatureCheck from '../../hocs/withFeatureCheck';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  githubUrl?: string;
  demoUrl?: string;
  content?: any[];
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProjectsContent();
  }, []);

  const loadProjectsContent = async () => {
    try {
      const [projectsResponse, tagsResponse] = await Promise.all([
        fetch('/api/content/project'),
        fetch('/api/tags?type=project')
      ]);
      
      const projectsData = await projectsResponse.json();
      const tagsData = await tagsResponse.json();
      
      setProjects(projectsData);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedTag
    ? projects.filter(project => project.tags.includes(selectedTag))
    : projects;

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    // Update URL with project parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, project: project.id },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    // Remove project parameter from URL
    const { project, ...restQuery } = router.query;
    router.push(
      {
        pathname: router.pathname,
        query: restQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  // Check for project parameter in URL on mount
  useEffect(() => {
    if (router.query.project && projects.length > 0) {
      const project = projects.find(p => p.id === router.query.project);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [router.query.project, projects]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingMessage}>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Link href="/projects" className={styles.titleLink}>
          <h1 className={styles.pageTitle}>Projects</h1>
        </Link>
        <p className={styles.pageDescription}>
          Collection of featured projects and showcases
        </p>
      </div>

      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      )}

      <ProjectGrid 
        projects={filteredProjects} 
        onProjectClick={handleProjectClick} 
      />

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default withFeatureCheck(ProjectsPage, { featureName: 'projects' });