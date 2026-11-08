"use client";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#skills", label: "Skills" },
  { href: "#titulacao", label: "Destaques" },
  { href: "#certificados", label: "Baixar" },
  { href: "#perfil", label: "Perfil" },
] as const;

export function SiteNav({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "relative z-20 flex max-w-full flex-wrap justify-end gap-1",
        className,
      )}
      aria-label="Seções"
    >
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-full border border-blue-900/10 bg-white/50 px-2.5 py-1 text-[0.72rem] font-semibold text-blue-950 transition hover:bg-white/80"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
