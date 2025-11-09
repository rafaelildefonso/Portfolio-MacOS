import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Numbers.css';

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

const getProficiencyText = (percentage: number) => {
  if (percentage >= 90) return 'Especialista';
  if (percentage >= 75) return 'Avançado';
  if (percentage >= 50) return 'Intermediário';
  return 'Iniciante';
};

export const Numbers = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const skills: Record<string, Skill[]> = {
    'Frontend': [
      { name: 'React', proficiency: 80, startDate: '2025-09-25', projects: 2, icon: '⚛️', color: '#61dafb' },
      { name: 'TypeScript', proficiency: 80, startDate: '2025-04-13', projects: 4, icon: '📘', color: '#3178c6' },
      { name: 'React Native', proficiency: 70, startDate: '2025-04-13', projects: 2, icon: '⚛️', color: '#61dafb' },
      { name: 'HTML', proficiency: 90, startDate: '2024-01-20', projects: 8, icon: '🎨', color: '#1572B6' },
      { name: 'CSS', proficiency: 90, startDate: '2024-01-20', projects: 8, icon: '🎨', color: '#1572B6' },
      { name: 'JavaScript', proficiency: 95, startDate: '2024-01-20', projects: 9, icon: '🎨', color: '#1572B6' },
      { name: 'Next.js', proficiency: 75, startDate: '2025-04-13', projects: 2, icon: '▲', color: '#000000' },
      { name: 'TailwindCSS', proficiency: 50, startDate: '2021-11-15', projects: 2, icon: '🌊', color: '#06B6D4' },
    ],
    'Backend': [
      { name: 'Node.js', proficiency: 75, startDate: '2025-04-13', projects: 1, icon: '🟢', color: '#339933' },
      { name: 'Python', proficiency: 70, startDate: '2024-01-15', projects: 2, icon: '🐍', color: '#3776AB' },
      { name: 'MongoDB', proficiency: 50, startDate: '2025-04-13', projects: 1, icon: '🍃', color: '#47A248' },
      { name: 'PostgreSQL', proficiency: 70, startDate: '2025-04-15', projects: 2, icon: '🐘', color: '#4169E1' },
      { name: 'REST APIs', proficiency: 90, startDate: '2025-04-13', projects: 4, icon: '🔌', color: '#FF6C37' },
    ],
    'DevOps': [
      { name: 'Git', proficiency: 90, startDate: '2025-01-10', icon: '📦', color: '#F05032' },
      { name: 'Docker', proficiency: 60, startDate: '2025-07-03', icon: '🐳', color: '#2496ED' },
    ],
    'Design': [
      { name: 'Figma', proficiency: 80, startDate: '2024-06-6', projects: 12, icon: '🎨', color: '#F24E1E' },
      { name: 'UI/UX', proficiency: 85, startDate: '2024-01-20', projects: 15, icon: '✨', color: '#FF3366' },
    ],
    'Soft Skills': [
      { name: 'Comunicação', proficiency: 75, icon: '💬', color: '#4CAF50' },
      { name: 'Trabalho em Equipe', proficiency: 90, icon: '👥', color: '#2196F3' },
      { name: 'Resolução de Problemas', proficiency: 95, icon: '🧩', color: '#9C27B0' },
      { name: 'Gestão de Tempo', proficiency: 85, icon: '⏰', color: '#FF9800' },
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

  return (
    <div className="numbers-app">
      <div className="numbers-toolbar">
        <div className="toolbar-section">
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Visualização em grade"
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
              title="Visualização em lista"
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
              placeholder="Pesquisar habilidades..."
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
          <h2>Habilidades Técnicas</h2>
          <p className="toolbar-subtitle">Minhas competências e experiência</p>
        </div>
        <div className="toolbar-section">
          <div className="stats-badge">
            <span className="stat">{totalCategories} Categorias</span>
            <span className="divider">|</span>
            <span className="stat">{totalSkills} Habilidades</span>
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
                  <span className="category-count">{items.length} {items.length === 1 ? 'habilidade' : 'habilidades'}</span>
                </div>
                
                {viewMode === 'list' ? (
                  <div className="skills-table">
                    <div className={`table-header ${
                      category === 'Soft Skills' ? 'soft-skills-header' : 
                      category === 'DevOps' ? 'devops-header' :
                      category === 'Design' ? 'design-header' : ''
                    }`}>
                      <div className="col-tech">Tecnologia</div>
                      <div className="col-progress">Proficiência</div>
                      {(category === 'Frontend' || category === 'Backend' || category === 'Design' || category === 'DevOps') && (
                        <div className="col-years">Experiência</div>
                      )}
                      {(category === 'Frontend' || category === 'Backend') && (
                        <div className="col-projects">Projetos</div>
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
                            <span className="skill-level">{getProficiencyText(skill.proficiency)}</span>
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
                              <span className="years-badge">
                                {skill.startDate ? (() => {
                                  const { years, months } = calculateTimeSince(skill.startDate);
                                  let timeStr = '';
                                  if (years > 0) {
                                    timeStr += `${years} ${years === 1 ? 'ano' : 'anos'}`;
                                  }
                                  if (months > 0) {
                                    if (timeStr) timeStr += ' ';
                                    timeStr += `${months} ${months === 1 ? 'mês' : 'meses'}`;
                                  }
                                  return timeStr || 'Menos de um mês';
                                })() : '-'}
                              </span>
                            </div>
                            {(category === 'Frontend' || category === 'Backend') && (
                              <div className="col-projects">
                                <span className="projects-badge">
                                  {skill.projects !== undefined ? `${skill.projects} ${skill.projects === 1 ? 'projeto' : 'projetos'}` : '-'}
                                </span>
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
                            {/* <span className="skill-level">{getProficiencyText(skill.proficiency)}</span> */}
                            <span className="skill-percent">{skill.proficiency}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ 
                                width: `${skill.proficiency}%`,
                                backgroundColor: skill.color
                              }}
                            />
                          </div>
                        </div>
                        <div className="skill-stats">
                          {skill.startDate && (
                            <div className="stat">
                              <span className="stat-label">Experiência</span>
                              <span className="stat-value">
                                {(() => {
                                  const { years, months } = calculateTimeSince(skill.startDate);
                                  let timeStr = '';
                                  if (years > 0) {
                                    timeStr += `${years} ${years === 1 ? 'ano' : 'anos'}`;
                                  }
                                  if (months > 0) {
                                    if (timeStr) timeStr += ' ';
                                    timeStr += `${months} ${months === 1 ? 'mês' : 'meses'}`;
                                  }
                                  return timeStr || 'Menos de um mês';
                                })()}
                              </span>
                            </div>
                          )}
                          {skill.projects !== undefined && (
                            <div className="stat">
                              <span className="stat-label">Projetos</span>
                              <span className="stat-value">{skill.projects}</span>
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
              <h3>Nenhuma habilidade encontrada</h3>
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
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                      {getProficiencyText(selectedSkill.proficiency)}
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
                            {(() => {
                              const { years, months } = calculateTimeSince(selectedSkill.startDate);
                              let timeStr = '';
                              if (years > 0) {
                                timeStr += `${years} ${years === 1 ? 'ano' : 'anos'}`;
                              }
                              if (months > 0) {
                                if (timeStr) timeStr += ' ';
                                timeStr += `${months} ${months === 1 ? 'mês' : 'meses'}`;
                              }
                              return timeStr || 'Menos de um mês';
                            })()}
                          </span>
                        </div>
                      )}
                      {selectedSkill.projects !== undefined && (
                        <div className="stat">
                          <span className="stat-label">Projetos</span>
                          <span className="stat-value">{selectedSkill.projects}</span>
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
