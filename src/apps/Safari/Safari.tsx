import { useTranslation } from "react-i18next";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
  ShareIcon,
} from "../../assets/icons/Icons";
import "./Safari.css";

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
}

interface EducationItem {
  degree: string;
  institution: string;
}

interface ProfileTranslations {
  name: string;
  title: string;
  about_me: {
    title: string;
    description: string;
  };
  technologies: {
    title: string;
  };
  experience: {
    title: string;
    items: ExperienceItem[];
  };
  education: {
    title: string;
    items: EducationItem[];
  };
}

interface SafariTranslations {
  back: string;
  forward: string;
  share: string;
  profile: ProfileTranslations;
  link: string;
}

export const Safari = () => {
  const { t } = useTranslation();
  const safariT = t("safari", { returnObjects: true }) as SafariTranslations;
  const profile = safariT.profile;
  return (
    <div className="safari-app">
      <div className="safari-toolbar">
        <div className="safari-nav-buttons">
          <button className="safari-nav-btn" aria-label={safariT.back}>
            <ChevronLeftIcon size={16} />
          </button>
          <button className="safari-nav-btn" aria-label={safariT.forward}>
            <ChevronRightIcon size={16} />
          </button>
        </div>
        <div className="safari-url-bar">
          <LockIcon className="lock-icon" size={16} />
          <span>{safariT.link}</span>
        </div>
        <button className="safari-share-btn" aria-label={safariT.share}>
          <ShareIcon />
        </button>
      </div>

      <div className="safari-content">
        <div className="about-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src="/images/foto_minha.jpg" alt="Rafael Ildefonso" />
            </div>
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-title">{profile.title}</p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <h3>{profile.about_me.title}</h3>
              <p>{profile.about_me.description}</p>
            </div>

            <div className="about-card">
              <h3>{profile.technologies.title}</h3>
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
              <h3>{profile.experience.title}</h3>
              <ul className="experience-list">
                {profile.experience.items.map((item, index) => (
                  <li key={index}>
                    <strong>{item.role}</strong> - {item.company}
                    <span className="date"> {item.period}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-card">
              <h3>{profile.education.title}</h3>
              <ul className="education-list">
                {profile.education.items.map((item, index) => (
                  <li key={index}>
                    <strong>{item.degree}</strong>
                    <br />
                    <span>{item.institution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
