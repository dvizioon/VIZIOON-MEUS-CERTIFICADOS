export type Institution = {
  id: string;
  name: string;
  /** Valores exatos de certificate.institution */
  match: string[];
  logos: string[];
  order: number;
};

export const INSTITUTIONS: Institution[] = [
  {
    id: "titulacao",
    name: "Titulação acadêmica",
    match: ["Graduação", "Instituição de Ensino"],
    logos: ["/logos/graduacao.svg"],
    order: 1,
  },
  {
    id: "utfpr",
    name: "UTFPR",
    match: ["UTFPR"],
    logos: ["/logos/utfpr.svg"],
    order: 0,
  },
  {
    id: "senac",
    name: "Senac",
    match: ["Senac"],
    logos: ["/logos/senac.svg"],
    order: 1.5,
  },
  {
    id: "datacontrol",
    name: "Datacontrol",
    match: ["Datacontrol"],
    logos: ["/logos/datacontrol.svg"],
    order: 1.7,
  },
  {
    id: "alura-oracle",
    name: "Alura + Oracle",
    match: ["Alura + Oracle"],
    logos: ["/logos/alura.svg", "/logos/oracle.svg"],
    order: 2,
  },
  {
    id: "rocketseat",
    name: "Rocketseat",
    match: ["Rocketseat"],
    logos: ["/logos/rocketseat.svg"],
    order: 3,
  },
  {
    id: "pm3",
    name: "PM3",
    match: ["PM3"],
    logos: ["/logos/pm3.svg"],
    order: 4,
  },
  {
    id: "bradesco",
    name: "Fundação Bradesco",
    match: ["Fundação Bradesco", "Bradesco"],
    logos: ["/logos/bradesco.svg"],
    order: 5,
  },
  {
    id: "anhanguera",
    name: "Anhanguera",
    match: ["Anhanguera"],
    logos: ["/logos/anhanguera.svg"],
    order: 6,
  },
  {
    id: "snct",
    name: "SNCT",
    match: ["SNCT"],
    logos: ["/logos/snct.svg"],
    order: 7,
  },
  {
    id: "naf",
    name: "NAF COMEX",
    match: ["NAF COMEX"],
    logos: ["/logos/naf.svg"],
    order: 8,
  },
  {
    id: "outros",
    name: "Outros cursos",
    match: ["Curso"],
    logos: ["/logos/outros.svg"],
    order: 99,
  },
];

export const FALLBACK_INSTITUTION: Institution = {
  id: "geral",
  name: "Outros",
  match: [],
  logos: ["/logos/outros.svg"],
  order: 100,
};

export function institutionFor(name: string): Institution {
  return (
    INSTITUTIONS.find((org) => org.match.includes(name)) ?? {
      ...FALLBACK_INSTITUTION,
      name,
    }
  );
}
