"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_LABELS,
  type CertCategory,
  type Certificate,
  downloadName,
  groupByInstitution,
  previewFor,
  primaryFile,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { InstitutionChart } from "./InstitutionChart";
import { PreviewModal } from "./PreviewModal";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const FILTERS: Array<CertCategory | "todos"> = [
  "todos",
  "titulacao",
  "declaracao",
  "formacao",
  "curso",
  "evento",
];

export function CertificateVault({
  featured,
  items,
}: {
  featured: Certificate[];
  items: Certificate[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CertCategory | "todos">("todos");
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [openOrgs, setOpenOrgs] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "todos" && item.category !== filter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, query, filter]);

  const groups = useMemo(() => groupByInstitution(filtered), [filtered]);
  const isOpen = (id: string) => openOrgs[id] ?? true;
  const toggleOrg = (id: string) => {
    setOpenOrgs((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  return (
    <>
      <section id="titulacao" className="pt-14">
        <Reveal>
          <SectionHead
            eyebrow="Para instituições"
            title="Comprovante de escolaridade"
          >
            Preview real dos documentos. Clique para ampliar, baixar ou abrir o
            PDF.
          </SectionHead>
        </Reveal>
        <Reveal delay={80}>
          <FeaturedCarousel items={featured} onPreview={setSelected} />
        </Reveal>
      </section>

      <section id="certificados" className="pt-14">
        <Reveal>
          <SectionHead eyebrow="Arquivo" title="Certificados por instituição">
            Clique na instituição para recolher ou expandir.
          </SectionHead>
        </Reveal>

        <Reveal delay={60}>
          <div className="sticky top-3 z-20 mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-md backdrop-blur-md md:flex-row md:items-center">
            <label htmlFor="cert-search" className="min-w-0 flex-1">
              <span className="sr-only">Buscar certificados</span>
              <Input
                id="cert-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar título ou instituição…"
                type="search"
                className="h-10 rounded-full bg-card"
              />
            </label>
            <div
              className="flex flex-wrap gap-1.5"
              role="tablist"
              aria-label="Categorias"
            >
              {FILTERS.map((key) => {
                const active = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary",
                    )}
                    onClick={() => setFilter(key)}
                  >
                    {CATEGORY_LABELS[key]}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <InstitutionChart groups={groups} docsCount={filtered.length} />
        </Reveal>

        <div className="space-y-4">
          {groups.map((group) => {
            const open = isOpen(group.institution.id);
            return (
              <Reveal key={group.institution.id}>
                <section
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                  id={`org-${group.institution.id}`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 border-0 bg-transparent p-3.5 text-left transition hover:bg-muted/40"
                    aria-expanded={open}
                    onClick={() => toggleOrg(group.institution.id)}
                  >
                    <div className="flex shrink-0 gap-1.5">
                      {group.institution.logos.map((logo) => (
                        // SVG local: <img> evita config extra do next/image
                        // biome-ignore lint/performance/noImgElement: logos SVG locais
                        <img
                          key={logo}
                          src={logo}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 rounded-xl border border-border bg-white object-contain p-1"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {group.institution.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {group.items.length} certificado
                        {group.items.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-muted-foreground transition-transform",
                        open && "rotate-180",
                      )}
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 20 20"
                        width="16"
                        height="16"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M5 7.5 L10 12.5 L15 7.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2 lg:grid-cols-3">
                        {group.items.map((cert) => {
                          const file = primaryFile(cert);
                          if (!file) return null;
                          return (
                            <article
                              key={cert.id}
                              className="group overflow-hidden rounded-xl border border-border bg-background"
                            >
                              <button
                                type="button"
                                className="relative block w-full border-0 bg-muted/40 p-0"
                                onClick={() => setSelected(cert)}
                                aria-label={`Abrir preview de ${cert.title}`}
                              >
                                <Image
                                  src={previewFor(file.path)}
                                  alt=""
                                  width={640}
                                  height={452}
                                  className="aspect-[4/3] h-auto w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                                />
                                <span className="absolute inset-0 flex items-center justify-center bg-primary/55 text-sm font-semibold text-primary-foreground opacity-0 transition group-hover:opacity-100">
                                  Ver preview
                                </span>
                              </button>
                              <div className="space-y-2 p-3">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <Badge variant="secondary">
                                    {CATEGORY_LABELS[cert.category]}
                                  </Badge>
                                  {cert.hours != null ? (
                                    <Badge variant="outline">
                                      {cert.hours}h
                                    </Badge>
                                  ) : null}
                                </div>
                                <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
                                  {cert.title}
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => setSelected(cert)}
                                  >
                                    Preview
                                  </Button>
                                  <a
                                    className={cn(
                                      buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                      }),
                                      "rounded-full",
                                    )}
                                    href={file.path}
                                    download={downloadName(file.path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Baixar
                                  </a>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-muted-foreground">
            Nenhum certificado encontrado para essa busca.
          </p>
        ) : null}
      </section>

      <PreviewModal cert={selected} onClose={() => setSelected(null)} />
    </>
  );
}
