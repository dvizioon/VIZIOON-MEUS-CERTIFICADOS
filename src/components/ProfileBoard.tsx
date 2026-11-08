"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  ONGOING_LABELS,
  type Ongoing,
  type OngoingKind,
  type Profile,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const KIND_ICON: Record<OngoingKind, string> = {
  pos: "mdi:school-outline",
  ingles: "mdi:translate",
  curso: "mdi:book-open-page-variant-outline",
  outro: "mdi:progress-clock",
};

function OngoingCard({ item }: { item: Ongoing }) {
  const facts = [
    item.institution ? { label: "Instituição", value: item.institution } : null,
    item.duration ? { label: "Duração", value: item.duration } : null,
    item.level ? { label: "Nível", value: item.level } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        {item.logo ? (
          <span className="relative size-12 shrink-0 overflow-visible">
            <img
              src={item.logo}
              alt=""
              width={72}
              height={72}
              className="absolute top-1/2 left-1/2 size-[4.5rem] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
            />
          </span>
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon icon={KIND_ICON[item.kind]} width={22} height={22} />
          </span>
        )}
        <Badge variant="secondary">{item.status}</Badge>
      </div>
      <p className="text-sm font-semibold text-primary">
        {ONGOING_LABELS[item.kind]}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-foreground">
        {item.title}
      </h3>
      {facts.length > 0 ? (
        <dl className="mt-3 grid gap-2 text-base">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-sm text-muted-foreground">{fact.label}</dt>
              <dd className="font-medium text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {item.note ? (
        <p className="mt-3 text-base text-muted-foreground">{item.note}</p>
      ) : null}
      {item.url ? (
        <a
          className={cn(buttonVariants({ variant: "outline" }), "mt-3")}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir
        </a>
      ) : null}
    </article>
  );
}

export function ProfileBoard({ profile }: { profile: Profile }) {
  const liveSocial = profile.social.filter((item) => item.url);

  return (
    <section id="perfil" className="pt-14 pb-6">
      <Reveal>
        <SectionHead eyebrow="Em andamento" title="Formação atual">
          Pós e inglês que ainda estão em curso.
        </SectionHead>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid gap-4 md:grid-cols-2">
          {profile.ongoing.map((item) => (
            <OngoingCard key={item.id} item={item} />
          ))}
        </div>
      </Reveal>

      {liveSocial.length > 0 ? (
        <Reveal delay={100}>
          <div className="mt-6 flex flex-wrap gap-2">
            {liveSocial.map((item) => (
              <a
                key={item.id}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-base font-medium text-foreground transition hover:border-primary/30 hover:bg-primary/5"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon={item.icon} width={20} height={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}
