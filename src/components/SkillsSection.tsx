"use client";

import { Icon } from "@iconify/react";
import {
  SKILL_CATEGORY_LABELS,
  type Skill,
  type SkillCategory,
} from "@/lib/portfolio";
import { SectionHead } from "./SectionHead";

const CATEGORY_ORDER: SkillCategory[] = [
  "frameworks",
  "build",
  "backend",
  "linguagens",
  "formatos",
  "dados",
  "sistemas",
  "servidores",
  "devops",
  "cicd",
  "ia",
];

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section id="skills" className="pt-14">
      <SectionHead eyebrow="Stack" title="Skills">
        Stack do dia a dia.
      </SectionHead>

      <div className="space-y-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-md">
        {groups.map((group) => (
          <div
            key={group.category}
            className="grid gap-2 border-b border-border/70 pb-3 last:border-0 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:items-start"
          >
            <h3 className="pt-1 text-xs font-bold tracking-wide text-blue-800 uppercase">
              {SKILL_CATEGORY_LABELS[group.category]}
            </h3>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {group.items.map((skill) => (
                <li
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground"
                >
                  <Icon icon={skill.icon} width={14} height={14} />
                  {skill.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
