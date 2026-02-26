"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useLanguage, useSiteCopy } from "../i18n/LanguageProvider";
import { useAdmin } from "../auth/AdminProvider";
import { CATEGORY_IDS, DEFAULT_CATEGORY } from "../../constants/workCategories";
import { deleteWork, getAllWorks, WORKS_UPDATED_EVENT } from "../../lib/worksStore";
import WorksTabs from "../works/WorksTabs";

function WorkCard({ work, locale, copy, isAdmin, deleting, onDelete }) {
  const title = locale === "zh" ? work.title_zh || work.title_en : work.title_en;
  const summary = locale === "zh" ? work.summary_zh || work.summary_en : work.summary_en;

  return (
    <Link
      href={`/works/${work.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black transition-all duration-500 hover:border-[#FF7A18]/60 hover:shadow-[0_0_40px_rgba(255,122,24,0.12)]"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
        <img
          src={work.cover}
          alt={title}
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
            {copy.works.viewDetails}
          </span>
        </div>
        {/* year badge */}
        {work.year && (
          <span className="absolute right-3 top-3 rounded border border-white/20 bg-black/50 px-2 py-0.5 text-xs text-white/70 backdrop-blur-sm">
            {work.year}
          </span>
        )}

        {isAdmin && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void onDelete(work);
            }}
            disabled={deleting}
            className="absolute left-3 top-3 rounded border border-red-400/50 bg-black/65 px-2 py-1 text-xs text-red-300 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
      {/* Info */}
      <div className="space-y-2 p-5">
        <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-[#FFB58C]">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-white/60">{summary}</p>
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

function AddWorkCard({ category, copy }) {
  return (
    <Link
      href={`/editor/new?cat=${category}`}
      className="group flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#FF7A18]/35 bg-black/20 text-center transition-all duration-300 hover:border-[#FF7A18]/70 hover:bg-[#FF7A18]/5"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#FF7A18]/40 text-2xl text-[#FF7A18] transition-all duration-300 group-hover:border-[#FF7A18]"
        style={{ background: "rgba(255,122,24,0.08)" }}
      >
        {copy.works.emptyStateCta}
      </div>
      <p className="text-sm text-white/65 group-hover:text-white/90">{copy.works.createNow}</p>
    </Link>
  );
}

function EmptyCategoryCard({ category, copy }) {
  return (
    <Link
      href={`/editor/new?cat=${category}`}
      className="group mx-auto flex min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[#FF7A18]/30 bg-black/20 text-center transition-all duration-300 hover:border-[#FF7A18]/70 hover:bg-[#FF7A18]/5"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full border border-[#FF7A18]/40 text-3xl text-[#FF7A18] transition-all duration-300 group-hover:border-[#FF7A18] group-hover:shadow-[0_0_20px_rgba(255,122,24,0.3)]"
        style={{ background: "rgba(255,122,24,0.07)" }}
      >
        {copy.works.emptyStateCta}
      </div>
      <p className="text-base text-white/60 group-hover:text-white/90">{copy.works.emptyStateTitle}</p>
      <span className="rounded-full border border-[#FF7A18]/40 px-4 py-1.5 text-xs tracking-widest text-[#FF7A18] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {copy.works.createNow}
      </span>
    </Link>
  );
}

export default function WorksSection() {
  const { locale } = useLanguage();
  const siteCopy = useSiteCopy();
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [works, setWorks] = useState([]);
  const [deletingWorkId, setDeletingWorkId] = useState("");

  const activeCategory = useMemo(() => {
    const current = searchParams.get("cat") || DEFAULT_CATEGORY;
    return CATEGORY_IDS.includes(current) ? current : DEFAULT_CATEGORY;
  }, [searchParams]);

  useEffect(() => {
    const syncWorks = async () => {
      const nextWorks = await getAllWorks();
      setWorks(nextWorks);
    };

    syncWorks();
    window.addEventListener(WORKS_UPDATED_EVENT, syncWorks);

    return () => {
      window.removeEventListener(WORKS_UPDATED_EVENT, syncWorks);
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

  const handleDeleteWork = async (work) => {
    if (!work?.id) return;
    const title = work.title_zh || work.title_en || "this work";
    const confirmed = window.confirm(`Delete \"${title}\"? This action cannot be undone.`);
    if (!confirmed) return;

    setDeletingWorkId(work.id);
    const ok = await deleteWork(work.id);
    setDeletingWorkId("");

    if (!ok) {
      window.alert("Failed to delete work.");
      return;
    }

    setWorks((prev) => prev.filter((item) => item.id !== work.id));
  };

  return (
    <section className="w-full pb-20">
      {/* Geometric tabs navigation (orange + black) */}
      <div className="mx-auto w-full max-w-7xl px-4">
        <WorksTabs
          activeCategory={activeCategory}
          onCategoryChange={setCategory}
          tabs={siteCopy.works.tabs}
          ariaLabel={siteCopy.works.tabAriaLabel}
        />
      </div>

      {/* Works grid */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-12">
        {filteredWorks.length === 0 ? (
          isAdmin ? (
            <EmptyCategoryCard category={activeCategory} copy={siteCopy} />
          ) : (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-sm text-white/40">No works in this category yet.</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                locale={locale}
                copy={siteCopy}
                isAdmin={isAdmin}
                deleting={deletingWorkId === work.id}
                onDelete={handleDeleteWork}
              />
            ))}
            {isAdmin && <AddWorkCard category={activeCategory} copy={siteCopy} />}
          </div>
        )}
      </div>
    </section>
  );
}
