"use client";

import { Badge } from "@/components/ui/badge";
import type { InstitutionGroup } from "@/lib/portfolio";

export function InstitutionChart({
  groups,
  docsCount,
}: {
  groups: InstitutionGroup[];
  docsCount: number;
}) {
  const max = Math.max(1, ...groups.map((g) => g.items.length));

  return (
    <div className="mb-5 rounded-2xl border border-blue-200/70 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.1)] ring-1 ring-inset ring-white/70 backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-blue-700">
            Documentos por instituição
          </p>
          <p className="mt-1 text-sm font-medium text-blue-950/70">
            Clique na barra para ir até o grupo
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>{docsCount} docs</Badge>
          <Badge variant="outline">{groups.length} instituições</Badge>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="py-6 text-base text-blue-900/60">
          Nenhum documento para mostrar nesta busca.
        </p>
      ) : (
        <ul className="m-0 space-y-3 p-0">
          {groups.map((group) => {
            const count = group.items.length;
            const pct = Math.max(10, (count / max) * 100);
            return (
              <li key={group.institution.id} className="list-none">
                <button
                  type="button"
                  className="w-full border-0 bg-transparent p-0 text-left"
                  onClick={() => {
                    document
                      .getElementById(`org-${group.institution.id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <div className="mb-1.5 flex items-baseline justify-between gap-2">
                    <span className="truncate text-base font-semibold text-blue-950">
                      {group.institution.name}
                    </span>
                    <span className="shrink-0 text-sm font-bold text-blue-800">
                      {count} {count === 1 ? "doc" : "docs"}
                    </span>
                  </div>
                  <span className="block h-3 overflow-hidden rounded-md bg-blue-100">
                    <span
                      className="block h-full rounded-md bg-gradient-to-r from-blue-500 to-blue-800 transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
