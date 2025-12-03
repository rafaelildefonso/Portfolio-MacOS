import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./Finder.css";
import {
  FolderIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  StarFillIcon,
  StarIcon,
} from "../../assets/icons/Icons";

type FilterType = "all" | "favorites" | "react" | "typescript" | "node";

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
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    // Load favorites from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favoriteProjects");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Save favorites to localStorage when they change
  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];

      if (typeof window !== "undefined") {
        localStorage.setItem("favoriteProjects", JSON.stringify(newFavorites));
      }

      return newFavorites;
    });
  };

  const projects: Project[] = [
    {
      id: 1,
      name: "ShelfAI",
      description: t("projects.shelfai.description"),
      tech: ["React", "NodeJs", "Prisma", "Docker"],
      image: "/images/projects/shelfai.png",
      github: "",
      demo: "https://shelf-ai.vercel.app",
    },
    {
      id: 2,
      name: "Pertinho",
      description: t("projects.pertinho.description"),
      tech: ["React Native", "Prisma"],
      image: "/images/projects/pertinho.png",
      github: "https://github.com/rafaelildefonso/Pertinho",
      demo: "",
    },
    {
      id: 3,
      name: "Herculion",
      description: t("projects.herculion.description"),
      tech: ["HTML", "CSS", "Javascript"],
      image: "/images/projects/herculion.png",
      github: "https://github.com/rafaelildefonso/Herculion",
      demo: "https://rafaelildefonso.github.io/Herculion",
    },
    {
      id: 4,
      name: "Linked",
      description: t("projects.linked.description"),
      tech: ["React Native"],
      image: "/images/projects/linked.png",
      github: "https://github.com/rafaelildefonso/Linked",
      demo: "",
    },
    {
      id: 5,
      name: "Mapa",
      description: t("projects.mapa.description"),
      tech: ["React Native"],
      image: "/images/projects/mapas.png",
      github: "https://github.com/rafaelildefonso/app_rotas",
      demo: "",
    },
    {
      id: 6,
      name: "ViperGray",
      description: t("projects.vipergray.description"),
      tech: ["HTML", "CSS", "Javascript"],
      image: "/images/projects/vipergray.png",
      github: "https://github.com/rafaelildefonso/ViperGray",
      demo: "https://rafaelildefonso.github.io/ViperGray",
    },
  ];

  // Filter projects based on active filter and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Apply search filter
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      // Apply filter type
      switch (activeFilter) {
        case "favorites":
          return favorites.includes(project.id);
        case "all":
          return true;
        default:
          return project.tech.some(
            (tech) => tech.toLowerCase() === activeFilter
          );
      }
    });
  }, [projects, activeFilter, searchQuery, favorites]);

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tech.forEach((tag) => {
        tags.add(tag.toLowerCase());
      });
    });
    return Array.from(tags);
  }, [projects]);

  return (
    <div className="finder-app">
      <div className="finder-sidebar">
        <div className="finder-section">
          <h4>{t("finder.filters")}</h4>
          <ul>
            <li
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => setActiveFilter("all")}
            >
              <span className="finder-icon">
                <FolderIcon />
              </span>
              {t("finder.allProjects")}
            </li>
            <li
              className={activeFilter === "favorites" ? "active" : ""}
              onClick={() => setActiveFilter("favorites")}
            >
              <span className="finder-icon">
                <StarIcon />
              </span>
              {t("finder.favorites")}
              <span className="favorite-count">{favorites.length}</span>
            </li>
          </ul>
        </div>
        <div className="finder-section">
          <h4>{t("finder.technologies")}</h4>
          <ul>
            {allTags.map((tag) => (
              <li
                key={tag}
                className={activeFilter === tag.toLowerCase() ? "active" : ""}
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
              <GridIcon size={16} />
            </button>
            <button className="view-btn">
              <ListIcon size={16} />
            </button>
          </div>
          <div className="finder-path">{t("finder.projects")}</div>
          <div className="finder-search">
            <SearchIcon size={14} className="search-icon" />
            <input
              type="text"
              placeholder={t("finder.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label={t("finder.clearSearch")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="finder-projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="no-projects">
              <p>{t("finder.noProjects")}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
              >
                {t("finder.clearFilters")}
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`project-card ${
                  selectedProject?.id === project.id ? "selected" : ""
                } ${favorites.includes(project.id) ? "favorite" : ""}`}
                onClick={() => setSelectedProject(project)}
              >
                <button
                  className={`favorite-btn ${
                    favorites.includes(project.id) ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(project.id);
                  }}
                  aria-label={
                    favorites.includes(project.id)
                      ? t("finder.removeFromFavorites")
                      : t("finder.addToFavorites")
                  }
                >
                  {favorites.includes(project.id) ? (
                    <StarFillIcon />
                  ) : (
                    <StarIcon />
                  )}
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
                        className={
                          activeFilter === tech.toLowerCase() ? "active" : ""
                        }
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
                      <a
                        href={project.github}
                        target="_blank"
                        className="project-btn"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        {t("finder.github")}
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        className="project-btn primary"
                      >
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="22.041"
                          height="21.6699"
                        >
                          <g>
                            <rect x="0" y="0" />
                            <path
                              d="M10.8398 0.996094C11.123 0.996094 11.3379 0.78125 11.3379 0.498047C11.3379 0.214844 11.123 0 10.8398 0C10.5566 0 10.3418 0.214844 10.3418 0.498047C10.3418 0.78125 10.5566 0.996094 10.8398 0.996094ZM12.6367 1.16211C12.9199 1.16211 13.1445 0.9375 13.1445 0.664062C13.1445 0.380859 12.9199 0.15625 12.6367 0.15625C12.3633 0.15625 12.1387 0.380859 12.1387 0.664062C12.1387 0.9375 12.3633 1.16211 12.6367 1.16211ZM14.375 1.62109C14.6582 1.62109 14.873 1.40625 14.873 1.12305C14.873 0.839844 14.6582 0.625 14.375 0.625C14.0918 0.625 13.877 0.839844 13.877 1.12305C13.877 1.40625 14.0918 1.62109 14.375 1.62109ZM16.0156 2.40234C16.2891 2.40234 16.5137 2.17773 16.5137 1.9043C16.5137 1.62109 16.2891 1.39648 16.0156 1.39648C15.7324 1.39648 15.5078 1.62109 15.5078 1.9043C15.5078 2.17773 15.7324 2.40234 16.0156 2.40234ZM17.4902 3.42773C17.7734 3.42773 17.9883 3.21289 17.9883 2.92969C17.9883 2.64648 17.7734 2.43164 17.4902 2.43164C17.207 2.43164 16.9922 2.64648 16.9922 2.92969C16.9922 3.21289 17.207 3.42773 17.4902 3.42773ZM18.7695 4.70703C19.043 4.70703 19.2676 4.48242 19.2676 4.20898C19.2676 3.92578 19.043 3.70117 18.7695 3.70117C18.4863 3.70117 18.2617 3.92578 18.2617 4.20898C18.2617 4.48242 18.4863 4.70703 18.7695 4.70703ZM19.8047 6.19141C20.0879 6.19141 20.3027 5.9668 20.3027 5.69336C20.3027 5.41016 20.0879 5.18555 19.8047 5.18555C19.5215 5.18555 19.3066 5.41016 19.3066 5.69336C19.3066 5.9668 19.5215 6.19141 19.8047 6.19141ZM20.5566 7.82227C20.8398 7.82227 21.0645 7.59766 21.0645 7.31445C21.0645 7.04102 20.8398 6.81641 20.5566 6.81641C20.2832 6.81641 20.0586 7.04102 20.0586 7.31445C20.0586 7.59766 20.2832 7.82227 20.5566 7.82227ZM21.0254 9.55078C21.2988 9.55078 21.5234 9.33594 21.5234 9.05273C21.5234 8.76953 21.2988 8.55469 21.0254 8.55469C20.7422 8.55469 20.5176 8.76953 20.5176 9.05273C20.5176 9.33594 20.7422 9.55078 21.0254 9.55078ZM21.1816 11.3281C21.4551 11.3281 21.6797 11.1133 21.6797 10.8301C21.6797 10.5469 21.4551 10.332 21.1816 10.332C20.8984 10.332 20.6738 10.5469 20.6738 10.8301C20.6738 11.1133 20.8984 11.3281 21.1816 11.3281ZM21.0254 13.1055C21.2988 13.1055 21.5234 12.8906 21.5234 12.6074C21.5234 12.3242 21.2988 12.1094 21.0254 12.1094C20.7422 12.1094 20.5176 12.3242 20.5176 12.6074C20.5176 12.8906 20.7422 13.1055 21.0254 13.1055ZM20.5566 14.8438C20.8398 14.8438 21.0645 14.6191 21.0645 14.3359C21.0645 14.0625 20.8398 13.8379 20.5566 13.8379C20.2832 13.8379 20.0586 14.0625 20.0586 14.3359C20.0586 14.6191 20.2832 14.8438 20.5566 14.8438ZM19.8047 16.4648C20.0879 16.4648 20.3027 16.25 20.3027 15.9668C20.3027 15.6836 20.0879 15.4688 19.8047 15.4688C19.5215 15.4688 19.3066 15.6836 19.3066 15.9668C19.3066 16.25 19.5215 16.4648 19.8047 16.4648ZM18.7695 17.9492C19.043 17.9492 19.2676 17.7344 19.2676 17.4512C19.2676 17.168 19.043 16.9531 18.7695 16.9531C18.4863 16.9531 18.2617 17.168 18.2617 17.4512C18.2617 17.7344 18.4863 17.9492 18.7695 17.9492ZM17.4902 19.2285C17.7734 19.2285 17.9883 19.0039 17.9883 18.7305C17.9883 18.4473 17.7734 18.2227 17.4902 18.2227C17.207 18.2227 16.9922 18.4473 16.9922 18.7305C16.9922 19.0039 17.207 19.2285 17.4902 19.2285ZM16.0156 20.2539C16.2891 20.2539 16.5137 20.0391 16.5137 19.7559C16.5137 19.4727 16.2891 19.2578 16.0156 19.2578C15.7324 19.2578 15.5078 19.4727 15.5078 19.7559C15.5078 20.0391 15.7324 20.2539 16.0156 20.2539ZM14.375 21.0352C14.6582 21.0352 14.873 20.8105 14.873 20.5371C14.873 20.2539 14.6582 20.0293 14.375 20.0293C14.0918 20.0293 13.877 20.2539 13.877 20.5371C13.877 20.8105 14.0918 21.0352 14.375 21.0352ZM12.6367 21.4941C12.9199 21.4941 13.1445 21.2793 13.1445 20.9961C13.1445 20.7129 12.9199 20.498 12.6367 20.498C12.3633 20.498 12.1387 20.7129 12.1387 20.9961C12.1387 21.2793 12.3633 21.4941 12.6367 21.4941ZM10.8398 21.6602C11.123 21.6602 11.3379 21.4355 11.3379 21.1621C11.3379 20.8789 11.123 20.6543 10.8398 20.6543C10.5566 20.6543 10.3418 20.8789 10.3418 21.1621C10.3418 21.4355 10.5566 21.6602 10.8398 21.6602ZM9.04297 21.4941C9.31641 21.4941 9.54102 21.2793 9.54102 20.9961C9.54102 20.7129 9.31641 20.498 9.04297 20.498C8.75977 20.498 8.53516 20.7129 8.53516 20.9961C8.53516 21.2793 8.75977 21.4941 9.04297 21.4941ZM7.30469 21.0352C7.58789 21.0352 7.80273 20.8105 7.80273 20.5371C7.80273 20.2539 7.58789 20.0293 7.30469 20.0293C7.02148 20.0293 6.80664 20.2539 6.80664 20.5371C6.80664 20.8105 7.02148 21.0352 7.30469 21.0352ZM5.66406 20.2539C5.94727 20.2539 6.17188 20.0391 6.17188 19.7559C6.17188 19.4727 5.94727 19.2578 5.66406 19.2578C5.39062 19.2578 5.16602 19.4727 5.16602 19.7559C5.16602 20.0391 5.39062 20.2539 5.66406 20.2539ZM4.18945 19.2285C4.47266 19.2285 4.6875 19.0039 4.6875 18.7305C4.6875 18.4473 4.47266 18.2227 4.18945 18.2227C3.90625 18.2227 3.69141 18.4473 3.69141 18.7305C3.69141 19.0039 3.90625 19.2285 4.18945 19.2285ZM2.91016 17.9492C3.19336 17.9492 3.41797 17.7344 3.41797 17.4512C3.41797 17.168 3.19336 16.9531 2.91016 16.9531C2.63672 16.9531 2.41211 17.168 2.41211 17.4512C2.41211 17.7344 2.63672 17.9492 2.91016 17.9492ZM1.875 16.4648C2.1582 16.4648 2.37305 16.25 2.37305 15.9668C2.37305 15.6836 2.1582 15.4688 1.875 15.4688C1.5918 15.4688 1.37695 15.6836 1.37695 15.9668C1.37695 16.25 1.5918 16.4648 1.875 16.4648ZM1.12305 14.8438C1.39648 14.8438 1.62109 14.6191 1.62109 14.3359C1.62109 14.0625 1.39648 13.8379 1.12305 13.8379C0.839844 13.8379 0.615234 14.0625 0.615234 14.3359C0.615234 14.6191 0.839844 14.8438 1.12305 14.8438ZM0.654297 13.1055C0.9375 13.1055 1.16211 12.8906 1.16211 12.6074C1.16211 12.3242 0.9375 12.1094 0.654297 12.1094C0.380859 12.1094 0.15625 12.3242 0.15625 12.6074C0.15625 12.8906 0.380859 13.1055 0.654297 13.1055ZM0.498047 11.3281C0.78125 11.3281 1.00586 11.1133 1.00586 10.8301C1.00586 10.5469 0.78125 10.332 0.498047 10.332C0.224609 10.332 0 10.5469 0 10.8301C0 11.1133 0.224609 11.3281 0.498047 11.3281ZM0.654297 9.55078C0.9375 9.55078 1.16211 9.33594 1.16211 9.05273C1.16211 8.76953 0.9375 8.55469 0.654297 8.55469C0.380859 8.55469 0.15625 8.76953 0.15625 9.05273C0.15625 9.33594 0.380859 9.55078 0.654297 9.55078ZM1.12305 7.82227C1.39648 7.82227 1.62109 7.59766 1.62109 7.31445C1.62109 7.04102 1.39648 6.81641 1.12305 6.81641C0.839844 6.81641 0.615234 7.04102 0.615234 7.31445C0.615234 7.59766 0.839844 7.82227 1.12305 7.82227ZM1.875 6.19141C2.1582 6.19141 2.37305 5.9668 2.37305 5.69336C2.37305 5.41016 2.1582 5.18555 1.875 5.18555C1.5918 5.18555 1.37695 5.41016 1.37695 5.69336C1.37695 5.9668 1.5918 6.19141 1.875 6.19141ZM2.91016 4.70703C3.19336 4.70703 3.41797 4.48242 3.41797 4.20898C3.41797 3.92578 3.19336 3.70117 2.91016 3.70117C2.63672 3.70117 2.41211 3.92578 2.41211 4.20898C2.41211 4.48242 2.63672 4.70703 2.91016 4.70703ZM4.18945 3.42773C4.47266 3.42773 4.6875 3.21289 4.6875 2.92969C4.6875 2.64648 4.47266 2.43164 4.18945 2.43164C3.90625 2.43164 3.69141 2.64648 3.69141 2.92969C3.69141 3.21289 3.90625 3.42773 4.18945 3.42773ZM5.66406 2.40234C5.94727 2.40234 6.17188 2.17773 6.17188 1.9043C6.17188 1.62109 5.94727 1.39648 5.66406 1.39648C5.39062 1.39648 5.16602 1.62109 5.16602 1.9043C5.16602 2.17773 5.39062 2.40234 5.66406 2.40234ZM7.30469 1.62109C7.58789 1.62109 7.80273 1.40625 7.80273 1.12305C7.80273 0.839844 7.58789 0.625 7.30469 0.625C7.02148 0.625 6.80664 0.839844 6.80664 1.12305C6.80664 1.40625 7.02148 1.62109 7.30469 1.62109ZM9.04297 1.16211C9.31641 1.16211 9.54102 0.9375 9.54102 0.664062C9.54102 0.380859 9.31641 0.15625 9.04297 0.15625C8.75977 0.15625 8.53516 0.380859 8.53516 0.664062C8.53516 0.9375 8.75977 1.16211 9.04297 1.16211Z"
                              fill="currentColor"
                              fill-opacity="0.85"
                            />
                            <path
                              d="M10.8398 18.7109C15.1953 18.7109 18.7305 15.1953 18.7305 10.8301C18.7305 6.49414 15.1758 2.93945 10.8398 2.93945C6.46484 2.93945 2.94922 6.46484 2.94922 10.8301C2.94922 15.2148 6.45508 18.7109 10.8398 18.7109ZM10.8398 17.7637C6.97266 17.7637 3.90625 14.6973 3.90625 10.8301C3.90625 6.99219 7.00195 3.89648 10.8398 3.89648C14.668 3.89648 17.7734 7.00195 17.7734 10.8301C17.7734 14.668 14.6777 17.7637 10.8398 17.7637Z"
                              fill="currentColor"
                              fill-opacity="0.85"
                            />
                            <path
                              d="M8.51562 13.4277C8.51562 14.0039 8.87695 14.1895 9.43359 13.8672L13.8574 11.3379C14.3457 11.0547 14.3457 10.625 13.8574 10.3516L9.43359 7.80273C8.88672 7.49023 8.51562 7.66602 8.51562 8.24219Z"
                              fill="currentColor"
                              fill-opacity="0.85"
                            />
                          </g>
                        </svg>
                        {t("finder.demo")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
