import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import './Numbers.css';

interface NumbersTranslations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  viewModes: {
    grid: string;
    list: string;
  };
  stats: {
    categories: string;
    skills: string;
    skill: string;
    skills_plural: string;
  };
  tableHeaders: {
    technology: string;
    proficiency: string;
    experience: string;
    projects: string;
  };
  proficiencyLevels: {
    expert: string;
    advanced: string;
    intermediate: string;
    beginner: string;
  };
  time: {
    year: string;
    year_plural: string;
    month: string;
    month_plural: string;
    and: string;
  };
  softSkills: {
    communication: string;
    teamwork: string;
    problemSolving: string;
    timeManagement: string;
  };
  skillCategories: {
    frontend: string;
    backend: string;
    devops: string;
    design: string;
    softSkills: string;
  };
  skillDetails: {
    proficiency: string;
    experience: string;
    projects: string;
    description: string;
  };
  noResults: string;
  close: string;
}

interface Skill {
  name: string;
  proficiency: number;
  startDate?: string; // Format: 'YYYY-MM-DD'
  projects?: number;
  icon: string;
  color: string;
  description?: string;
}

// Helper function to calculate years and months since a date
const calculateTimeSince = (startDate?: string): { years: number; months: number } => {
  if (!startDate) return { years: 0, months: 0 };
  
  const start = new Date(startDate);
  const now = new Date();
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  
  if (months < 0 || (months === 0 && now.getDate() < start.getDate())) {
    years--;
    months += 12;
  }
  
  return { years, months };
};

const getProficiencyText = (percentage: number, t: any) => {
  const { proficiencyLevels } = t('numbers', { returnObjects: true }) as NumbersTranslations;
  if (percentage >= 90) return proficiencyLevels.expert;
  if (percentage >= 75) return proficiencyLevels.advanced;
  if (percentage >= 50) return proficiencyLevels.intermediate;
  return proficiencyLevels.beginner;
};

const formatTimeSince = (startDate: string | undefined, t: any) => {
  if (!startDate) return '';
  
  const { years, months } = calculateTimeSince(startDate);
  const { time } = t('numbers', { returnObjects: true }) as NumbersTranslations;
  
  const yearsText = years > 0 
    ? t('numbers.time.year', { count: years })
    : '';
    
  const monthsText = months > 0 
    ? t('numbers.time.month', { count: months })
    : '';
    
  if (years > 0 && months > 0) {
    return `${yearsText} ${time.and} ${monthsText}`;
  }
  
  return yearsText || monthsText;
};

export const Numbers = () => {
  const { t } = useTranslation();
  const numbersT = t('numbers', { returnObjects: true }) as NumbersTranslations;
  
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const skills: Record<string, Skill[]> = {
    [numbersT.skillCategories.frontend]: [
      { name: 'React', proficiency: 80, startDate: '2025-09-25', projects: 2, icon: '⚛️', color: '#61dafb' },
      { name: 'TypeScript', proficiency: 80, startDate: '2025-04-13', projects: 4, icon: '📘', color: '#3178c6' },
      { name: 'React Native', proficiency: 70, startDate: '2025-04-13', projects: 2, icon: '⚛️', color: '#61dafb' },
      { name: 'HTML', proficiency: 90, startDate: '2024-01-20', projects: 8, icon: '🎨', color: '#e34f26' },
      { name: 'CSS', proficiency: 90, startDate: '2024-01-20', projects: 8, icon: '🎨', color: '#264de4' },
      { name: 'JavaScript', proficiency: 95, startDate: '2024-01-20', projects: 9, icon: '🎨', color: '#f0db4f' },
      { name: 'Next.js', proficiency: 75, startDate: '2025-04-13', projects: 2, icon: '▲', color: '#000000' },
      { name: 'TailwindCSS', proficiency: 50, startDate: '2025-09-25', projects: 2, icon: '🌊', color: '#06B6D4' },
    ],
    [numbersT.skillCategories.backend]: [
      { name: 'Node.js', proficiency: 75, startDate: '2025-04-13', projects: 1, icon: '🟢', color: '#339933' },
      { name: 'Python', proficiency: 70, startDate: '2024-01-15', projects: 2, icon: '🐍', color: '#3776AB' },
      { name: 'MongoDB', proficiency: 50, startDate: '2025-04-13', projects: 1, icon: '🍃', color: '#47A248' },
      { name: 'PostgreSQL', proficiency: 70, startDate: '2025-04-15', projects: 2, icon: '🐘', color: '#4169E1' },
      { name: 'REST APIs', proficiency: 90, startDate: '2025-04-13', projects: 4, icon: '🔌', color: '#FF6C37' },
    ],
    [numbersT.skillCategories.devops]: [
      { name: 'Git', proficiency: 90, startDate: '2025-01-10', icon: '📦', color: '#F05032' },
      { name: 'Docker', proficiency: 60, startDate: '2025-07-03', icon: '🐳', color: '#2496ED' },
    ],
    [numbersT.skillCategories.design]: [
      { name: 'Figma', proficiency: 80, startDate: '2024-06-6', projects: 12, icon: '🎨', color: '#F24E1E' },
      { name: 'UI/UX', proficiency: 85, startDate: '2024-01-20', projects: 15, icon: '✨', color: '#FF3366' },
    ],
    [numbersT.skillCategories.softSkills]: [
      { name: numbersT.softSkills.communication, proficiency: 75, icon: '💬', color: '#4CAF50' },
      { name: numbersT.softSkills.teamwork, proficiency: 90, icon: '👥', color: '#2196F3' },
      { name: numbersT.softSkills.problemSolving, proficiency: 95, icon: '🧩', color: '#9C27B0' },
      { name: numbersT.softSkills.timeManagement, proficiency: 85, icon: '⏰', color: '#FF9800' },
    ]
  };

  const filteredSkills = Object.fromEntries(
    Object.entries(skills).map(([category, items]) => [
      category,
      items.filter((skill: Skill) => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ]).filter(([_, items]) => (items as Skill[]).length > 0)
  ) as Record<string, Skill[]>;

  const totalSkills = Object.values(filteredSkills).flat().length;
  const totalCategories = Object.keys(filteredSkills).length;
  
  const getSkillCountText = (count: number) => {
    return count === 1 
      ? t('numbers.stats.skill', { count })
      : t('numbers.stats.skills', { count });
  };

  return (
    <div className="numbers-app">
      <div className="numbers-toolbar">
        <div className="toolbar-section">
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title={numbersT.viewModes.grid}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title={numbersT.viewModes.list}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4H13M3 8H13M3 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="search-bar">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="1.5"/>
              <path d="M21 21L16.65 16.65" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              id='pesquisar'
              placeholder={numbersT.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="toolbar-title">
          <h2>{numbersT.title}</h2>
          <p className="toolbar-subtitle">{numbersT.subtitle}</p>
        </div>
        <div className="toolbar-section">
          <div className="stats-badge">
            <span className="stat">{t('numbers.stats.categories', { count: totalCategories })}</span>
            <span className="divider">|</span>
            <span className="stat">{getSkillCountText(totalSkills)}</span>
          </div>
        </div>
      </div>

      <div className="numbers-content">
        <AnimatePresence>
          {Object.entries(filteredSkills).length > 0 ? (
            Object.entries(filteredSkills).map(([category, items]) => (
              <motion.div 
                key={category} 
                className="skill-category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="category-header">
                  <h2 className="category-title">{category}</h2>
                  <span className="category-count">
                    {t('numbers.stats.skills', { count: items.length })}
                  </span>
                </div>
                
                {viewMode === 'list' ? (
                  <div className="skills-table">
                    <div className={`table-header ${
                      category === 'Soft Skills' ? 'soft-skills-header' : 
                      category === 'DevOps' ? 'devops-header' :
                      category === 'Design' ? 'design-header' : ''
                    }`}>
                      <div className="col-tech">{numbersT.tableHeaders.technology}</div>
                      <div className="col-progress">{numbersT.tableHeaders.proficiency}</div>
                      {(category === numbersT.skillCategories.frontend || 
                        category === numbersT.skillCategories.backend || 
                        category === numbersT.skillCategories.design || 
                        category === numbersT.skillCategories.devops) && (
                        <div className="col-years">{numbersT.tableHeaders.experience}</div>
                      )}
                      {(category === numbersT.skillCategories.frontend || 
                        category === numbersT.skillCategories.backend) && (
                        <div className="col-projects">{numbersT.tableHeaders.projects}</div>
                      )}
                    </div>
                    {items.map((skill) => (
                      <motion.div 
                        key={skill.name} 
                        className={`table-row ${
                          category === 'Soft Skills' ? 'soft-skills-row' : 
                          category === 'DevOps' ? 'devops-row' :
                          category === 'Design' ? 'design-row' : ''
                        }`}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <div className="col-tech">
                          <span 
                            className="skill-icon"
                            style={{ backgroundColor: `${skill.color}15` }}
                          >
                            {skill.icon}
                          </span>
                          <span className="skill-name">{skill.name}</span>
                        </div>
                        <div className="col-progress">
                          <div className="skill-meta">
                            <span className="skill-level">{getProficiencyText(skill.proficiency, t)}</span>
                            <span className="skill-percent">{skill.proficiency}%</span>
                          </div>
                          <div className="progress-bar">
                            <motion.div 
                              className="progress-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              style={{ backgroundColor: skill.color }}
                            />
                          </div>
                        </div>
                        {(category === 'Frontend' || category === 'Backend' || category === 'Design' || category === 'DevOps') && (
                          <>
                            <div className="col-years">
                              <div className="experience-cell">
                                {formatTimeSince(skill.startDate, t)}
                              </div>
                            </div>
                            {(category === 'Frontend' || category === 'Backend') && (
                              <div className="col-projects">
                                <div className="projects-cell">
                                  {skill.projects === 1 
                                    ? t('numbers.stats.projects', { count: skill.projects })
                                    : t('numbers.stats.projects_plural', { count: skill.projects })}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="skills-grid">
                    {items.map((skill) => (
                      <motion.div 
                        key={skill.name} 
                        className="skill-card"
                        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <div className="skill-card-header">
                          <div 
                            className="skill-icon"
                            style={{ backgroundColor: `${skill.color}15`, color: skill.color }}
                          >
                            {skill.icon}
                          </div>
                          <div className="skill-info">
                            <h3 className="skill-name">{skill.name}</h3>
                            <span className="skill-category">{category}</span>
                          </div>
                        </div>
                        <div className="skill-progress">
                          <div className="skill-meta">
                            <span className="skill-percent">{skill.proficiency}%</span>
                          </div>
                          <div className="progress-bar">
                            <motion.div 
                              className="progress-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.proficiency}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              style={{ backgroundColor: skill.color }}
                            />
                            <span className="progress-text">
                              {skill.proficiency}% {getProficiencyText(skill.proficiency, t)}
                            </span>
                          </div>
                        </div>
                        <div className="skill-stats">
                          {skill.startDate && (
                            <div className="stat">
                              <span className="stat-label">Experiência</span>
                              <span className="stat-value">
                                {formatTimeSince(skill.startDate, t)}
                              </span>
                            </div>
                          )}
                          {skill.projects !== undefined && (
                            <div className="stat">
                              <span className="stat-label">{numbersT.tableHeaders.projects}</span>
                              <span className="stat-value">
                                {skill.projects === 1 
                                  ? t('numbers.stats.projects', { count: skill.projects })
                                  : t('numbers.stats.projects_plural', { count: skill.projects })}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
                <path d="M10 7V10M10 10V13M10 10H13M10 10H7" strokeLinecap="round" />
              </svg>
              <p>{numbersT.noResults}</p>
              <p>Tente usar termos diferentes na sua busca.</p>
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchTerm('')}
              >
                Limpar busca
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div 
              className="skill-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div 
                className="skill-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <button 
                  className="close-modal"
                  onClick={() => setSelectedSkill(null)}
                  aria-label={numbersT.close}
                >
                  ×
                </button>
                
                <div className="skill-modal-header">
                  <div 
                    className="skill-icon"
                    style={{ backgroundColor: `${selectedSkill.color}15`, color: selectedSkill.color }}
                  >
                    {selectedSkill.icon}
                  </div>
                  <div className="skill-title">
                    <h2>{selectedSkill.name}</h2>
                    <div className="skill-level-badge" style={{ backgroundColor: `${selectedSkill.color}15`, color: selectedSkill.color }}>
                      {getProficiencyText(selectedSkill.proficiency, t)}
                    </div>
                  </div>
                </div>

                <div className="skill-modal-content">
                  <div className="skill-stats">
                    <div className="stat">
                      <span className="stat-label">Nível</span>
                      <div className="progress-container">
                        <div 
                          className="progress-bar"
                          style={{ '--progress': `${selectedSkill.proficiency}%`, '--color': selectedSkill.color } as React.CSSProperties}
                        >
                          <div className="progress-fill" />
                        </div>
                        <span className="progress-value">{selectedSkill.proficiency}%</span>
                      </div>
                    </div>
                    
                    <div className="stat-row">
                      {selectedSkill.startDate && (
                        <div className="stat">
                          <span className="stat-label">Experiência</span>
                          <span className="stat-value">
                            {formatTimeSince(selectedSkill.startDate, t)}
                          </span>
                        </div>
                      )}
                      {selectedSkill.projects !== undefined && (
                        <div className="stat">
                          <span className="stat-label">Projetos</span>
                          <span className="stat-value">{t('numbers.stats.projects', { count: selectedSkill.projects })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="skill-description">
                    <h3>Sobre</h3>
                    <p>
                      {selectedSkill.description || 
                        (() => {
                          if (!selectedSkill.startDate) {
                            return `Habilidade em ${selectedSkill.name}${selectedSkill.projects !== undefined ? `, utilizada em ${selectedSkill.projects} ${selectedSkill.projects === 1 ? 'projeto' : 'projetos'}` : ''}.`;
                          }
                          const { years, months } = calculateTimeSince(selectedSkill.startDate);
                          let timeStr = '';
                          if (years > 0) {
                            timeStr += `${years} ${years === 1 ? 'ano' : 'anos'}`;
                          }
                          if (months > 0) {
                            if (timeStr) timeStr += ' e ';
                            timeStr += `${months} ${months === 1 ? 'mês' : 'meses'}`;
                          }
                          const projectsText = selectedSkill.projects !== undefined 
                            ? ` em ${selectedSkill.projects} ${selectedSkill.projects === 1 ? 'projeto' : 'projetos'}` 
                            : '';
                          return `Experiência de ${timeStr || 'menos de um mês'} com ${selectedSkill.name}${projectsText}.`;
                        })()}
                    </p>
                  </div>

                  <div className="skill-actions">
                    <button className="btn-outline" onClick={() => setSelectedSkill(null)}>
                      Fechar
                    </button>
                    <button 
                      className="btn-primary"
                      style={{ backgroundColor: selectedSkill.color }}
                      onClick={() => {
                        // Action to view projects with this skill
                        console.log(`View projects with ${selectedSkill.name}`);
                      }}
                    >
                      Ver projetos
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
