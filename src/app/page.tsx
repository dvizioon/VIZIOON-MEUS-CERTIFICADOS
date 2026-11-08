import { CertificateVault } from "@/components/CertificateVault";
import { HeroProfile } from "@/components/HeroProfile";
import { PageBackground } from "@/components/PageBackground";
import { ProfileBoard } from "@/components/ProfileBoard";
import { SkillsSection } from "@/components/SkillsSection";
import {
  data,
  featuredCertificates,
  sortedCertificates,
} from "@/lib/portfolio";

const shell =
  "mx-auto w-[min(1180px,calc(100%-2rem))] max-[980px]:w-[min(1180px,calc(100%-1.25rem))]";

export default function Home() {
  const { profile } = data;
  const featured = featuredCertificates();
  const certificates = sortedCertificates();
  const site = profile.links.website ?? "https://dvizioon.com";

  return (
    <>
      <PageBackground />
      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        <main id="topo" className="pt-4">
          <HeroProfile profile={profile} />

          <div className={shell}>
            <SkillsSection skills={profile.skills} />
            <CertificateVault featured={featured} items={certificates} />
            <ProfileBoard profile={profile} />
          </div>
        </main>

        <footer className="mt-16 border-t border-white/10 py-8 text-[0.9rem] text-slate-300">
          <div
            className={`${shell} flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/45 bg-white/25 px-4 py-4 text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-inset ring-white/35 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/18`}
          >
            <p>{profile.fullName}</p>
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-800 hover:text-blue-950"
            >
              dvizioon.com
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
