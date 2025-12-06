import { useState } from "react";
import "./AppStore.css";
import {
  featuredApp,
  certificatesApps,
  categories,
  type AppItem,
} from "../../data/appStoreData";
import { useTranslation } from "react-i18next";
import {
  ContentIcon,
  ArcadeIcon,
  BriefcaseIcon,
  BrushIcon,
  StackIcon,
  SearchIcon,
} from "../../assets/icons/Icons";

const SidebarIcon = ({ icon }: { icon: string }) => {
  switch (icon) {
    case "rocket":
      return <ContentIcon size={18} />;
    case "star":
      return <StackIcon size={18} />;
    case "briefcase":
      return <BriefcaseIcon size={18} />;
    case "gamepad":
      return <ArcadeIcon size={18} />;
    case "brush":
      return <BrushIcon size={18} />;
    default:
      return <ContentIcon size={18} />;
  }
};

export const AppStore = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("discover");

  const handleAppClick = (app: AppItem) => {
    // If it has a download URL, open it (Resume/Certificate)
    if (app.downloadUrl) {
      window.open(app.downloadUrl, "_blank");
    }
  };

  const renderContent = () => {
    if (activeCategory === "discover") {
      return (
        <div className="app-store-content fade-in">
          {/* Hero Section - Resume */}
          <div className="hero-section">
            {/* Using hardcoded images/text here for specific layout match, but could be dynamic */}
            <button
              className="featured-card"
              onClick={() => handleAppClick(featuredApp)}
            >
              <div className="featured-content">
                <div className="featured-overlay"></div>
                <div className="featured-image">
                  <img src={featuredApp.icon} alt="Currículo Preview" />
                </div>
                <div className="featured-text">
                  <div className="featured-tag">{t("appStore.hero.badge")}</div>
                  <div className="featured-title">
                    {t("appStore.hero.title")}
                  </div>
                  <div className="featured-subtitle">
                    {t("appStore.hero.subtitle")}
                  </div>
                  <p
                    style={{
                      opacity: 0.9,
                      maxWidth: "70%",
                      fontSize: "14px",
                      marginTop: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {t("appStore.hero.description")}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Certificates Section (Preview) */}
          <div className="app-section">
            <div className="section-header">
              <div className="section-title">
                {t("appStore.sections.certificates")}
              </div>
              <button
                className="see-all"
                onClick={() => setActiveCategory("certificates")}
              >
                {t("appStore.sections.seeAll")}
              </button>
            </div>
            <div className="app-list">
              {certificatesApps.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="app-item-card"
                  onClick={() => handleAppClick(app)}
                >
                  <img
                    src={app.icon}
                    alt={app.title}
                    className="app-icon-large"
                  />
                  <div className="app-details">
                    <div className="app-title">{app.title}</div>
                    <div className="app-subtitle">{app.subtitle}</div>
                    <button className="get-button">
                      {t("appStore.sections.view")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeCategory === "certificates") {
      return (
        <div className="app-store-content fade-in">
          <div className="app-section">
            <div className="section-header">
              <div className="section-title">
                {t("appStore.sections.allCertificates")}
              </div>
            </div>
            <p
              style={{
                padding: "0 40px 0 0",
                color: "var(--text-secondary)",
                marginBottom: "20px",
              }}
            >
              {t("appStore.sections.certificatesDesc")}
            </p>
            <div
              className="app-list"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              }}
            >
              {certificatesApps.map((app) => (
                <div
                  key={app.id}
                  className="app-item-card"
                  onClick={() => handleAppClick(app)}
                >
                  <img
                    src={app.icon}
                    alt={app.title}
                    className="app-icon-large"
                  />
                  <div className="app-details">
                    <div className="app-title">{app.title}</div>
                    <div className="app-subtitle">{app.subtitle}</div>
                    <button className="get-button">
                      {t("appStore.sections.view")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Fallback for empty categories
    return (
      <div
        className="app-store-content fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "var(--text-secondary)",
          height: "100%",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>🚧</div>
        <h2>{t("appStore.sections.developing")}</h2>
        <p>{t("appStore.sections.developingDesc")}</p>
      </div>
    );
  };

  return (
    <div className="app-store">
      <div className="app-store-sidebar">
        {/* Search Bar */}
        <div style={{ padding: "0 12px 20px 12px" }}>
          <div className="app-store-search">
            <SearchIcon size={12} style={{opacity: 0.8 }} />
            <span>{t("appStore.sidebar.search")}</span>
          </div>
        </div>

        <div className="sidebar-group">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`sidebar-item ${
                activeCategory === cat.id ? "active" : ""
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="sidebar-icon-wrapper">
                <SidebarIcon icon={cat.icon} />
              </span>
              {t(`appStore.sidebar.${cat.id}`, cat.label)}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}

    </div>
  );
};
