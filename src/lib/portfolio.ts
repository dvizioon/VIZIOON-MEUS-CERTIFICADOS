import { type Institution, institutionFor } from "@/data/institutions";
import portfolio from "@/data/portfolio.json";

export type CertCategory =
  | "titulacao"
  | "formacao"
  | "curso"
  | "evento"
  | "declaracao";

export type CertFile = {
  label: string;
  path: string;
};

export type Certificate = {
  id: string;
  title: string;
  institution: string;
  hours: number | null;
  category: CertCategory;
  featured: boolean;
  priority: number;
  description?: string;
  verifyUrl?: string;
  files: CertFile[];
};

export type OngoingKind = "pos" | "ingles" | "curso" | "outro";

export type Ongoing = {
  id: string;
  kind: OngoingKind;
  title: string;
  status: string;
  institution?: string;
  logo?: string;
  duration?: string;
  level?: string;
  note?: string;
  url?: string;
};

export type SkillCategory =
  | "frameworks"
  | "backend"
  | "linguagens"
  | "sistemas"
  | "servidores"
  | "devops"
  | "cicd"
  | "ia";

export type Skill = {
  id: string;
  label: string;
  icon: string;
  category: SkillCategory;
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frameworks: "Frameworks",
  backend: "Backend",
  linguagens: "Linguagens",
  sistemas: "Sistemas operacionais",
  servidores: "Servidores",
  devops: "DevOps",
  cicd: "CI/CD",
  ia: "IA",
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

export type Profile = {
  name: string;
  fullName: string;
  role: string;
  headline: string;
  summary: string;
  location: string;
  avatar: string;
  links: {
    lattes: string;
    linkedin: string;
    github: string;
    website?: string;
  };
  social: SocialLink[];
  skills: Skill[];
  ongoing: Ongoing[];
};

export const CATEGORY_LABELS: Record<CertCategory | "todos", string> = {
  todos: "Todos",
  titulacao: "Titulação",
  formacao: "Formações",
  curso: "Cursos",
  evento: "Eventos",
  declaracao: "Declarações",
};

/** Abas de navegação pra RH / visitante baixar com clareza. */
export type BrowseShelf = "academica" | "tecnica" | "curta";

export const SHELF_LABELS: Record<BrowseShelf | "todos", string> = {
  todos: "Todos",
  academica: "Formação & especializações",
  tecnica: "Técnicas & avançadas",
  curta: "Workshops & curtos",
};

export const SHELF_HINTS: Record<BrowseShelf, string> = {
  academica: "Graduação, pós, diploma, histórico e declarações oficiais.",
  tecnica: "Formações densas e cursos com carga maior (40h+).",
  curta: "Cursos curtos, workshops, maratonas e eventos.",
};

/** shortcut: 40h separa técnico de curto; subir se aparecerem cursos de 600h+ na aba técnica */
const DENSE_HOURS = 40;

export function browseShelf(cert: Certificate): BrowseShelf {
  if (cert.category === "titulacao" || cert.category === "declaracao") {
    return "academica";
  }
  if (cert.category === "formacao") return "tecnica";
  if (
    cert.category === "curso" &&
    cert.hours != null &&
    cert.hours >= DENSE_HOURS
  ) {
    return "tecnica";
  }
  return "curta";
}

export const ONGOING_LABELS: Record<OngoingKind, string> = {
  pos: "Pós-graduação",
  ingles: "Inglês",
  curso: "Curso",
  outro: "Outro",
};

export const data = portfolio as {
  profile: Profile;
  certificates: Certificate[];
};

export function featuredCertificates() {
  return data.certificates
    .filter((c) => c.featured)
    .sort((a, b) => a.priority - b.priority);
}

export function sortedCertificates() {
  return [...data.certificates].sort((a, b) => a.priority - b.priority);
}

/** PDF/PNG em /certificates/x.ext → miniatura em /certificates/previews/x.png */
export function previewFor(filePath: string) {
  const name = filePath.split("/").pop() ?? "file";
  const base = name.replace(/\.(pdf|png|jpe?g|webp)$/i, "");
  return `/certificates/previews/${base}.png`;
}

export function primaryFile(cert: Certificate) {
  return cert.files[0];
}

export function downloadName(path: string) {
  return path.split("/").pop() || "certificado.pdf";
}

export type InstitutionGroup = {
  institution: Institution;
  items: Certificate[];
};

export function groupByInstitution(items: Certificate[]): InstitutionGroup[] {
  const map = new Map<string, InstitutionGroup>();
  for (const cert of items) {
    const org = institutionFor(cert.institution);
    const existing = map.get(org.id);
    if (existing) existing.items.push(cert);
    else map.set(org.id, { institution: org, items: [cert] });
  }
  return [...map.values()].sort(
    (a, b) => a.institution.order - b.institution.order,
  );
}
