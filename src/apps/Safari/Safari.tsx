import { ShareIcon } from '../../assets/icons/Icons';
import './Safari.css';

export const Safari = () => {
  return (
    <div className="safari-app">
      <div className="safari-toolbar">
        <div className="safari-nav-buttons">
          <button className="safari-nav-btn" aria-label="Voltar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="safari-nav-btn" aria-label="Avançar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="safari-url-bar">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="lock-icon">
            <path d="M4 6V4.5C4 2.567 5.567 1 7 1C8.433 1 10 2.567 10 4.5V6M3 6H11C11.552 6 12 6.448 12 7V12C12 12.552 11.552 13 11 13H3C2.448 13 2 12.552 2 12V7C2 6.448 2.448 6 3 6Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <span>sobre-mim.rafael.dev</span>
        </div>
        <button className="safari-share-btn" aria-label="Compartilhar">
          <ShareIcon/>
        </button>
      </div>
      
      <div className="safari-content">
        <div className="about-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src="/images/foto_minha.jpg" alt="Rafael Ildefonso" />
            </div>
            <h1 className="profile-name">Rafael Ildefonso</h1>
            <p className="profile-title">Full Stack Developer & UI/UX</p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <h3>🎯 Sobre Mim</h3>
              <p>
                Desenvolvedor apaixonado por criar experiências únicas. 
                Especializado em React, Flutter e JavaScript.
              </p>
            </div>

            <div className="about-card">
              <h3>💻 Tecnologias</h3>
              <div className="tech-tags">
                <span>React</span>
                <span>TypeScript</span>
                <span>Node.js</span>
                <span>React Native</span>
                <span>Flutter</span>
                <span>JavaScript</span>
                <span>Firebase</span>
                <span>Dart</span>
                <span>SQL</span>
                <span>TailwindCSS</span>
                <span>Python</span>
                <span>HTML</span>
                <span>CSS</span>
              </div>
            </div>

            <div className="about-card">
              <h3>🚀 Experiência</h3>
              <ul className="experience-list">
                <li>
                  <strong>Full Stack Developer</strong> - Agência Propagare
                  <span className="date">2025 - Presente</span>
                </li>
              </ul>
            </div>

            <div className="about-card">
              <h3>📚 Educação</h3>
              <ul className="education-list">
                <li>
                  <strong>Técnico de Informática</strong><br />
                  <span>Colégio Cotemig</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
