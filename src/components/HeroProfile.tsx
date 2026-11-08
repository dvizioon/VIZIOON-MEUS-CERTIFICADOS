"use client";

import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import { SiteNav } from "@/components/SiteNav";
import SplitText from "@/components/SplitText";
import type { Profile } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

export function HeroProfile({ profile }: { profile: Profile }) {
  return (
    <section className="mx-auto w-[min(1180px,calc(100%-2rem))] pt-6 pb-2 max-[980px]:w-[min(1180px,calc(100%-1.25rem))] max-[980px]:pt-4">
      <div
        className={cn(
          "relative isolate overflow-visible rounded-[28px] text-blue-950",
          "border border-white/50 bg-white/25 shadow-[0_24px_70px_rgba(15,23,42,0.22)]",
          "ring-1 ring-inset ring-white/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/20",
          "px-[clamp(1.5rem,4vw,3.2rem)] py-[clamp(1.8rem,4vw,3rem)]",
          "max-[980px]:rounded-[22px] max-[980px]:px-5 max-[980px]:py-[1.35rem]",
        )}
      >
        <SiteNav className="absolute top-4 right-4 max-[980px]:top-3 max-[980px]:right-3" />
        <div className="relative z-[1] flex w-full items-center justify-between gap-6 max-[980px]:flex-col-reverse max-[980px]:items-start max-[980px]:gap-5">
          <div className="min-w-0 max-w-[38rem] flex-1 text-left">
            <SplitText
              text={profile.name}
              tag="p"
              trigger="load"
              effect="rise"
              splitType="chars"
              delay={40}
              duration={0.7}
              textAlign="left"
              className="!m-0 !block w-full font-sans text-[clamp(2.2rem,5.5vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-blue-950 max-[680px]:text-[clamp(1.6rem,8vw,2.1rem)]"
            />
            <SplitText
              text={profile.role}
              tag="p"
              trigger="load"
              effect="fade"
              splitType="words"
              delay={60}
              duration={0.55}
              textAlign="left"
              className="!mt-3 !mb-4 !block w-full text-[clamp(1rem,1.6vw,1.15rem)] font-semibold text-blue-800"
            />
            <SplitText
              text={profile.headline}
              tag="h1"
              trigger="load"
              effect="rise"
              splitType="words"
              delay={50}
              duration={0.65}
              textAlign="left"
              className="!mb-3.5 !block w-full max-w-[28ch] text-[clamp(1.25rem,2.4vw,1.65rem)] font-semibold leading-[1.35] text-blue-900 max-[680px]:text-[1.05rem]"
            />
            <nav
              className="mt-5 flex flex-wrap gap-2"
              aria-label="Redes sociais"
            >
              {profile.social.map((item) =>
                item.url ? (
                  <a
                    key={item.id}
                    className="inline-flex items-center gap-1.5 rounded-md border border-blue-900/15 bg-white/40 px-3.5 py-2 text-base font-semibold text-blue-950 transition-colors hover:bg-white/60 max-[680px]:[&>span]:hidden"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon icon={item.icon} width={22} height={22} />
                    <span>{item.label}</span>
                  </a>
                ) : null,
              )}
            </nav>
          </div>

          <div
            className="ml-auto h-[min(440px,56vw)] w-[min(520px,100%)] min-w-[300px] shrink-0 max-[980px]:mx-auto max-[980px]:h-[380px] max-[980px]:w-full"
            role="img"
            aria-label={`Crachá de ${profile.fullName}`}
          >
            <Lanyard
              frontImage={profile.avatar}
              backImage="/lanyard-back.svg"
              imageFit="cover"
              cardColor="#ffffff"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.3}
              size={0.7}
              anchor="center"
              strapLength={0.4}
              strapColor="#1e3a8a"
              strapWidth={0.65}
              metal="silver"
              gravity={1}
              damping={0.55}
              elasticity={0.45}
              breeze={0.35}
              interactive
              intro
            />
          </div>
        </div>
      </div>
    </section>
  );
}
