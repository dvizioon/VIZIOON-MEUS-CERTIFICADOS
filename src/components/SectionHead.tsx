import type { ReactNode } from "react";

export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 w-full rounded-2xl border border-white/45 bg-white/25 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-inset ring-white/35 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/18">
      <p className="mb-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-blue-950 md:text-3xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">
          {children}
        </p>
      ) : null}
    </div>
  );
}
