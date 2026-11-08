"use client";

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
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            Documentos por instituição
          </p>
          <p className="mt-1 text-sm font-medium text-blue-950/70">
            Clique na barra para ir até o grupo
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
            {docsCount} docs
          </span>
          <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-900">
            {groups.length} instituições
          </span>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="py-6 text-sm text-blue-900/60">
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
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-blue-950">
                      {group.institution.name}
                    </span>
                    <span className="shrink-0 text-xs font-bold text-blue-800">
                      {count} {count === 1 ? "doc" : "docs"}
                    </span>
                  </div>
                  <span className="block h-3 overflow-hidden rounded-full bg-blue-100">
                    <span
                      className="block h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-800 transition-[width] duration-500"
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
