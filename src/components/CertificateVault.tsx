"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_LABELS,
  type BrowseShelf,
  type Certificate,
  browseShelf,
  downloadName,
  groupByInstitution,
  previewFor,
  primaryFile,
  SHELF_HINTS,
  SHELF_LABELS,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { InstitutionChart } from "./InstitutionChart";
import { PreviewModal } from "./PreviewModal";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const SHELVES: Array<BrowseShelf | "todos"> = [
  "todos",
  "academica",
  "tecnica",
  "curta",
];

const SHELF_ICONS: Record<BrowseShelf | "todos", string> = {
  todos: "mdi:folder-multiple-outline",
  academica: "mdi:school-outline",
  tecnica: "mdi:certificate-outline",
  curta: "mdi:lightning-bolt-outline",
};

export function CertificateVault({
  featured,
  items,
}: {
  featured: Certificate[];
  items: Certificate[];
}) {
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<BrowseShelf | "todos">("academica");
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [openOrgs, setOpenOrgs] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (shelf !== "todos" && browseShelf(item) !== shelf) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, query, shelf]);

  const groups = useMemo(() => groupByInstitution(filtered), [filtered]);

  const shelfCounts = useMemo(() => {
    const counts: Record<BrowseShelf | "todos", number> = {
      todos: items.length,
      academica: 0,
      tecnica: 0,
      curta: 0,
    };
    for (const item of items) counts[browseShelf(item)] += 1;
    return counts;
  }, [items]);

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
          <SectionHead eyebrow="Arquivo" title="Baixar por tipo de formação">
            Toque numa aba pra filtrar. Depois abra a instituição e baixe o
            PDF.
          </SectionHead>
        </Reveal>

        <Reveal delay={60}>
          <div className="sticky top-3 z-20 mb-4 flex flex-col gap-3 rounded-2xl border border-primary/25 bg-card/95 p-3.5 shadow-[0_12px_36px_rgba(37,99,235,0.12)] ring-1 ring-primary/15 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-primary">Navegue pelas abas</p>
              <Badge variant="secondary">
                {filtered.length} doc{filtered.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              role="tablist"
              aria-label="Tipo de formação"
            >
              {SHELVES.map((key) => {
                const active = shelf === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    title={
                      key === "todos" ? "Todos os documentos" : SHELF_HINTS[key]
                    }
                    className={cn(
                      "relative flex min-h-[5.25rem] flex-col items-start justify-between overflow-hidden rounded-xl border px-3 py-3 text-left transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
                    )}
                    onClick={() => setShelf(key)}
                  >
                    <Icon
                      icon={SHELF_ICONS[key]}
                      width={88}
                      height={88}
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-3 -bottom-3 rotate-[-8deg]",
                        active
                          ? "text-primary-foreground/25"
                          : "text-primary/20",
                      )}
                    />
                    <span
                      className={cn(
                        "relative z-10 text-sm font-bold tabular-nums",
                        active
                          ? "text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {shelfCounts[key]}
                    </span>
                    <span className="relative z-10 pr-8 text-sm leading-snug font-bold sm:text-[0.95rem]">
                      {SHELF_LABELS[key]}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground">
              {shelf === "todos"
                ? "Mostrando todos. Escolha uma aba pra achar mais rápido o que baixar."
                : SHELF_HINTS[shelf]}
            </p>

            <label htmlFor="cert-search" className="min-w-0">
              <span className="sr-only">Buscar certificados</span>
              <Input
                id="cert-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar título ou instituição…"
                type="search"
                className="h-11 rounded-md bg-card text-base"
              />
            </label>
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
                        <span
                          key={logo}
                          className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white"
                        >
                          <img
                            src={logo}
                            alt=""
                            width={40}
                            height={40}
                            className="size-10 object-contain"
                          />
                        </span>
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
                                <h4 className="line-clamp-2 text-base font-semibold text-foreground">
                                  {cert.title}
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelected(cert)}
                                  >
                                    Preview
                                  </Button>
                                  <a
                                    className={buttonVariants({
                                      variant: "outline",
                                      size: "sm",
                                    })}
                                    href={file.path}
                                    download={downloadName(file.path)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Baixar
                                  </a>
                                  {cert.verifyUrl ? (
                                    <a
                                      className={buttonVariants({
                                        variant: "secondary",
                                        size: "sm",
                                      })}
                                      href={cert.verifyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Verificar
                                    </a>
                                  ) : null}
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
