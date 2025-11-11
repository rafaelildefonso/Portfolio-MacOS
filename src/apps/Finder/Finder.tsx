import { useState, useMemo } from 'react';
import './Finder.css';

type FilterType = 'all' | 'favorites' | 'react' | 'typescript' | 'node';

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  image: string;
  github?: string;
  demo?: string;
}

export const Finder = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    // Load favorites from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favoriteProjects');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Save favorites to localStorage when they change
  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  };

  const projects: Project[] = [
    {
      id: 1,
      name: 'ShelfAI',
      description: 'ShelfAI é a plataforma que ajuda pequenas e médias lojas a organizar produtos para cadastro em e-commerces.',
      tech: ['React', 'NodeJs', 'Prisma', 'Docker'],
      image: '/images/projects/shelfai.png',
      github: '',
      demo: 'https://shelf-ai.vercel.app'
    },
    {
      id: 2,
      name: 'Pertinho',
      description: 'Aplicativo de encontrar locais perto de você',
      tech: ['React Native', 'Prisma'],
      image: '/images/projects/pertinho.png',
      github: 'https://github.com/rafaelildefonso/Pertinho',
      demo: ''
    },
    {
      id: 3,
      name: 'Herculion',
      description: 'Projeto escolar de marca de loja de carros',
      tech: ['HTML', 'CSS', 'Javascript'],
      image: '/images/projects/herculion.png',
      github: 'https://github.com/rafaelildefonso/Herculion',
      demo: 'https://rafaelildefonso.github.io/Herculion'
    },
    {
      id: 4,
      name: 'Linked',
      description: 'Aplicativo de organização de links',
      tech: ['React Native'],
      image: '/images/projects/linked.png',
      github: 'https://github.com/rafaelildefonso/Linked',
      demo: ''
    },
    {
      id: 5,
      name: 'Mapa',
      description: 'Aplicativo de mapas e rotas',
      tech: ['React Native'],
      image: '/images/projects/mapas.png',
      github: 'https://github.com/rafaelildefonso/app_rotas',
      demo: ''
    },
    {
      id: 6,
      name: 'ViperGray',
      description: 'Projeto escolar de marca de mouses sem fios',
      tech: ['HTML', 'CSS', 'Javascript'],
      image: '/images/projects/vipergray.png',
      github: 'https://github.com/rafaelildefonso/ViperGray',
      demo: 'https://rafaelildefonso.github.io/ViperGray'
    },
  ];

  // Filter projects based on active filter and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Apply search filter
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tech.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;

      // Apply filter type
      switch (activeFilter) {
        case 'favorites':
          return favorites.includes(project.id);
        case 'all':
        default:
          return true;
      }
    });
  }, [projects, activeFilter, searchQuery, favorites]);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tech.forEach(tag => {
        tags.add(tag.toLowerCase());
      });
    });
    return Array.from(tags);
  }, [projects]);

  return (
    <div className="finder-app">
      <div className="finder-sidebar">
        <div className="finder-section">
          <h4>Filtros</h4>
          <ul>
            <li 
              className={activeFilter === 'all' ? 'active' : ''}
              onClick={() => setActiveFilter('all')}
            >
              <span className="finder-icon">📁</span>
              Todos os Projetos
            </li>
            <li 
              className={activeFilter === 'favorites' ? 'active' : ''}
              onClick={() => setActiveFilter('favorites')}
            >
              <span className="finder-icon">⭐</span>
              Favoritos
              <span className="favorite-count">{favorites.length}</span>
            </li>
          </ul>
        </div>
        <div className="finder-section">
          <h4>Tecnologias</h4>
          <ul>
            {allTags.map(tag => (
              <li 
                key={tag}
                className={activeFilter === tag.toLowerCase() ? 'active' : ''}
                onClick={() => setActiveFilter(tag.toLowerCase() as FilterType)}
              >
                <span className={`tag-dot ${tag.toLowerCase()}`}></span>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="finder-content">
        <div className="finder-toolbar">
          <div className="finder-view-controls">
            <button className="view-btn active">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/>
                <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/>
                <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/>
                <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <button className="view-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
          <div className="finder-path">Projetos</div>
          <div className="finder-search">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Pesquisar projetos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search" 
                onClick={() => setSearchQuery('')}
                aria-label="Limpar pesquisa"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="finder-projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-projects">
              <p>Nenhum projeto encontrado.</p>
              <button onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''} ${
                favorites.includes(project.id) ? 'favorite' : ''
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <button 
                className={`favorite-btn ${favorites.includes(project.id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(project.id);
                }}
                aria-label={favorites.includes(project.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                {favorites.includes(project.id) ? '★' : '☆'}
              </button>
              <div className="project-preview">
                <img src={project.image} alt={project.name} />
              </div>
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i}
                      className={activeFilter === tech.toLowerCase() ? 'active' : ''}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilter(tech.toLowerCase() as FilterType);
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-actions">
                  {project.github && (
                    <a href={project.github} className="project-btn" >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} className="project-btn primary" >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M6 5L11 8L6 11V5Z" fill="currentColor"/>
                      </svg>
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          )))
          }
        </div>
      </div>
    </div>
  );
};
