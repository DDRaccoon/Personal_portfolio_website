"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { siteCopy } from "../../content/copy/en";
import { CATEGORY_IDS, DEFAULT_CATEGORY, WORK_CATEGORIES } from "../../constants/workCategories";
import { getAllWorks, WORKS_UPDATED_EVENT } from "../../lib/worksStore";

function WorkCard({ work }) {
  return (
    <Link
      href={`/works/${work.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black transition-all duration-500 hover:border-[#FF7A18]/60 hover:shadow-[0_0_40px_rgba(255,122,24,0.12)]"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
        <img
          src={work.cover}
          alt={work.title_en}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
        {/* hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span
            className="rounded-full border border-[#FF7A18]/70 px-5 py-2 text-sm font-semibold tracking-widest text-white"
            style={{ background: "rgba(255,122,24,0.15)", backdropFilter: "blur(8px)" }}
          >
            VIEW DETAILS
          </span>
        </div>
        {/* year badge */}
        {work.year && (
          <span className="absolute right-3 top-3 rounded border border-white/20 bg-black/50 px-2 py-0.5 text-xs text-white/70 backdrop-blur-sm">
            {work.year}
          </span>
        )}
      </div>
      {/* Info */}
      <div className="space-y-2 p-5">
        <h3
          className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#FFB58C]"
        >
          {work.title_en}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">{work.summary_en}</p>
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {work.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded px-2 py-0.5 text-xs"
                style={{ background: "rgba(255,122,24,0.1)", color: "#FFB58C" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function EmptyCategoryCard({ category }) {
  return (
    <Link
      href={`/editor/new?cat=${category}`}
      className="group mx-auto flex min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#FF7A18]/30 bg-black/20 text-center transition-all duration-300 hover:border-[#FF7A18]/70 hover:bg-[#FF7A18]/5"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full border border-[#FF7A18]/40 text-3xl text-[#FF7A18] transition-all duration-300 group-hover:border-[#FF7A18] group-hover:shadow-[0_0_20px_rgba(255,122,24,0.3)]"
        style={{ background: "rgba(255,122,24,0.07)" }}
      >
        {siteCopy.works.emptyStateCta}
      </div>
      <p className="text-base text-white/60 group-hover:text-white/90">{siteCopy.works.emptyStateTitle}</p>
      <span className="rounded-full border border-[#FF7A18]/40 px-4 py-1.5 text-xs tracking-widest text-[#FF7A18] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        CREATE NOW
      </span>
    </Link>
  );
}

export default function WorksSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [works, setWorks] = useState([]);

  const activeCategory = useMemo(() => {
    const current = searchParams.get("cat") || DEFAULT_CATEGORY;
    return CATEGORY_IDS.includes(current) ? current : DEFAULT_CATEGORY;
  }, [searchParams]);

  useEffect(() => {
    const syncWorks = () => {
      setWorks(getAllWorks());
    };

    syncWorks();
    window.addEventListener(WORKS_UPDATED_EVENT, syncWorks);
    window.addEventListener("storage", syncWorks);

    return () => {
      window.removeEventListener(WORKS_UPDATED_EVENT, syncWorks);
      window.removeEventListener("storage", syncWorks);
    };
  }, []);

  const filteredWorks = useMemo(
    () => works.filter((item) => item.category === activeCategory),
    [works, activeCategory]
  );

  const setCategory = (categoryId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cat", categoryId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="w-full pb-20">
      {/* Full-width tab buttons — original red stripe style */}
      <div className="flex w-full">
        {WORK_CATEGORIES.map((tab) => {
          const isActive = tab.id === activeCategory;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className="group relative flex-1 overflow-hidden border-y border-red-900/50 py-7 transition-all duration-500 ease-out"
              style={{
                background: isActive
                  ? "repeating-linear-gradient(45deg, #cc3333 0px, #cc3333 6px, #992222 6px, #992222 22px)"
                  : "repeating-linear-gradient(45deg, #5c1f1f 0px, #5c1f1f 5px, #3a1010 5px, #3a1010 18px)",
              }}
            >
              {/* frosted overlay */}
              <span
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  backdropFilter: "blur(2px)",
                  background: isActive
                    ? "rgba(180,40,40,0.22)"
                    : "rgba(80,10,10,0.45)",
                }}
              />
              {/* hover shine */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              {/* label */}
              <span
                className="relative z-10 block font-bold uppercase tracking-wider"
                style={{
                  fontSize: "clamp(0.85rem, 2.5vw, 2rem)",
                  color: "#ffffff",
                  textShadow: isActive
                    ? "0 0 18px rgba(255,255,255,0.85), 0 0 40px rgba(255,120,50,0.5)"
                    : "0 0 8px rgba(255,255,255,0.4)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Works grid */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-12">
        {filteredWorks.length === 0 ? (
          <EmptyCategoryCard category={activeCategory} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
