"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
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

      <div className="space-y-4 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-md sm:p-5">
        {groups.map((group) => (
          <div
            key={group.category}
            className="grid gap-3 border-b border-border/70 pb-4 last:border-0 last:pb-0 sm:grid-cols-[11rem_1fr] sm:items-start"
          >
            <h3 className="text-sm font-bold text-blue-800 sm:pt-1.5">
              {SKILL_CATEGORY_LABELS[group.category]}
            </h3>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {group.items.map((skill) => (
                <li key={skill.id}>
                  <Badge variant="outline" className="bg-background">
                    <Icon icon={skill.icon} width={16} height={16} />
                    {skill.label}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
