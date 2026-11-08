"use client";

import dynamic from "next/dynamic";
import { type ComponentType, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  type Certificate,
  downloadName,
  previewFor,
  primaryFile,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const CircularCarousel = dynamic(
  () => import("@/components/CircularCarousel"),
  { ssr: false },
) as ComponentType<Record<string, unknown>>;

export function FeaturedCarousel({
  items,
  onPreview,
}: {
  items: Certificate[];
  onPreview: (cert: Certificate) => void;
}) {
  const [index, setIndex] = useState(0);

  const slides = useMemo(
    () =>
      items
        .map((cert) => {
          const file = primaryFile(cert);
          if (!file) return null;
          return {
            cert,
            src: previewFor(file.path),
            alt: cert.title,
            title: cert.title,
            subtitle: cert.institution,
          };
        })
        .filter(Boolean) as Array<{
        cert: Certificate;
        src: string;
        alt: string;
        title: string;
        subtitle: string;
      }>,
    [items],
  );

  const current = slides[index]?.cert ?? items[0];
  const file = current ? primaryFile(current) : null;

  if (!current || !file || slides.length === 0) return null;

  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="h-[min(560px,72vw)] min-h-[380px] w-full overflow-hidden rounded-2xl border border-white/40 bg-white/15 shadow-[0_16px_50px_rgba(15,23,42,0.12)] ring-1 ring-inset ring-white/30 backdrop-blur-xl">
        <CircularCarousel
          items={slides}
          preset="cylinder"
          intro="rise"
          cardWidth={320}
          aspectRatio={1.32}
          gap={22}
          autoplay="drift"
          speed={11}
          direction="left"
          draggable
          momentum={0.55}
          snap
          pauseOnHover
          focusOnClick
          parallax={0.2}
          stretch={0.35}
          depthFade={0.4}
          fadeColor="#dbeafe"
          innerShade={0.3}
          cornerRadius={16}
          captions
          onChange={(i: number) => setIndex(i)}
          onItemClick={(_item: unknown, i: number) => {
            const slide = slides[i];
            if (slide) onPreview(slide.cert);
          }}
        />
      </div>

      <aside className="flex h-full min-h-[380px] flex-col justify-between gap-5 rounded-2xl border border-white/45 bg-white/25 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-inset ring-white/35 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/18 lg:min-h-[560px]">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Destaque {index + 1} de {slides.length}
            </Badge>
            <Badge variant="outline">{CATEGORY_LABELS[current.category]}</Badge>
            <Badge variant="outline">{current.institution}</Badge>
            {current.hours != null ? (
              <Badge variant="outline">{current.hours}h</Badge>
            ) : null}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-blue-950 md:text-[1.7rem]">
              {current.title}
            </h2>
            <p className="text-sm font-medium text-blue-800/70">
              {[
                current.institution,
                current.hours != null ? `${current.hours} horas` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>

          {current.description ? (
            <p className="text-[0.98rem] leading-relaxed text-slate-600">
              {current.description}
            </p>
          ) : null}

          {current.files.length > 1 ? (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Arquivos
              </p>
              <ul className="space-y-1 text-sm text-slate-700">
                {current.files.map((f) => (
                  <li key={f.path}>
                    <a
                      className="underline-offset-2 hover:underline"
                      href={f.path}
                      download={downloadName(f.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {f.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="rounded-full" onClick={() => onPreview(current)}>
            Ver preview
          </Button>
          <a
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full",
            )}
            href={file.path}
            download={downloadName(file.path)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Baixar PDF
          </a>
        </div>
      </aside>
    </div>
  );
}
