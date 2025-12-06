export interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  downloadUrl?: string; // For Resume/Certificates
  action?: () => void; // Generic action
  category:
    | "discover"
    | "arcade"
    | "create"
    | "work"
    | "play"
    | "develop"
    | "certificates";
  rating?: number;
  ageRating?: string;
  images?: string[]; // Screenshots for details view
}

export const featuredApp: AppItem = {
  id: "resume-highlight",
  title: "Meu Currículo",
  subtitle: "Experiência e Formação",
  icon: "/curriculo.png",
  description:
    "Confira minha trajetória profissional, competências técnicas e formação acadêmica detalhada neste documento interativo e completo.",
  downloadUrl: "/curriculo.pdf",
  category: "discover",
  rating: 5.0,
  ageRating: "L",
  images: ["/images/resume-preview-1.png", "/images/resume-preview-2.png"],
};

export const certificatesApps: AppItem[] = [
  {
    id: "cert-alura-backend",
    title: "Imersão Dev Back-end",
    subtitle: "Alura",
    icon: "/certificados/image/alura_imersão_dev_back-end-1.png",
    description:
      "Certificado de conclusão da Imersão Dev Back-end da Alura, focado em desenvolvimento de APIs e servidores.",
    downloadUrl: "/certificados/pdf/alura_imersão_dev_back-end.pdf",
    category: "certificates",
    rating: 5.0,
    ageRating: "L",
  },
  {
    id: "cert-alura-frontend",
    title: "Imersão Dev Front-end 2ª Edição",
    subtitle: "Alura",
    icon: "/certificados/image/alura_imersão_dev_front-end_2_edição-1.png",
    description:
      "Certificado de conclusão da Imersão Dev Front-end 2ª Edição, com foco em HTML, CSS e JavaScript moderno.",
    downloadUrl: "/certificados/pdf/alura_imersão_dev_front-end_2_edição.pdf",
    category: "certificates",
    rating: 5.0,
    ageRating: "L",
  },
  {
    id: "cert-alura-mobile",
    title: "Imersão Mobile",
    subtitle: "Alura",
    icon: "/certificados/image/alura_imersão_mobile-1.png",
    description:
      "Certificado de conclusão da Imersão Mobile da Alura, abordando desenvolvimento de aplicativos móveis.",
    downloadUrl: "/certificados/pdf/alura_imersão_mobile.pdf",
    category: "certificates",
    rating: 5.0,
    ageRating: "L",
  },
  {
    id: "cert-alura-ia",
    title: "Imersão IA 3ª Edição",
    subtitle: "Alura",
    icon: "/certificados/image/imersao_ia_3_edição-1.png",
    description:
      "Certificado de conclusão da Imersão IA 3ª Edição, explorando conceitos e aplicações de Inteligência Artificial.",
    downloadUrl: "/certificados/pdf/imersao_ia_3_edição.pdf",
    category: "certificates",
    rating: 5.0,
    ageRating: "L",
  },
  {
    id: "cert-alura-cloud",
    title: "Imersão Cloud & DevOps",
    subtitle: "Alura",
    icon: "/certificados/image/imersão_cloud_devops-1.png",
    description:
      "Certificado de conclusão da Imersão Cloud & DevOps, com práticas de infraestrutura e automação.",
    downloadUrl: "/certificados/pdf/imersão_cloud_devops.pdf",
    category: "certificates",
    rating: 5.0,
    ageRating: "L",
  },
  {
    id: "cert-nlw-react-native",
    title: "NLW React Native",
    subtitle: "Rocketseat",
    icon: "/certificados/image/nlw_react_native-1.png",
    description:
      "Certificado de conclusão do Next Level Week focado em React Native, desenvolvimento mobile avançado.",
    downloadUrl: "/certificados/pdf/nlw_react_native.pdf",
    category: "certificates",
    rating: 5.0,
    ageRating: "L",
  },
];

export const categories = [
  { id: "discover", label: "Descobrir", icon: "rocket" },
  { id: "certificates", label: "Certificados", icon: "star" },
  { id: "work", label: "Trabalho", icon: "briefcase" },
  { id: "play", label: "Lazer", icon: "gamepad" },
];
