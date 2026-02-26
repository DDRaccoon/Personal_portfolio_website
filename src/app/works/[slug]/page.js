"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useLanguage, useSiteCopy } from "../../../components/i18n/LanguageProvider";
import { useAdmin } from "../../../components/auth/AdminProvider";
import WorkRenderer from "../../../components/works/WorkRenderer";
import { getWorkBySlug } from "../../../lib/worksStore";

export default function WorkDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { locale } = useLanguage();
  const siteCopy = useSiteCopy();
  const { isAdmin } = useAdmin();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const slug = useMemo(() => String(params.slug || ""), [params.slug]);

  useEffect(() => {
    let mounted = true;

    const fetchWork = async () => {
      setLoading(true);
      const nextWork = await getWorkBySlug(slug);
      if (!mounted) return;
      setWork(nextWork);
      setLoading(false);
    };

    fetchWork();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const title = locale === "zh" ? work?.title_zh || work?.title_en : work?.title_en;
  const summary = locale === "zh" ? work?.summary_zh || work?.summary_en : work?.summary_en;

  if (loading) {
    return <main className="mx-auto min-h-screen w-full max-w-4xl px-4 pb-16 pt-8 md:px-6 md:pt-12" />;
  }

  if (!work) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-8">
        <div className="rounded-xl border border-white/10 bg-black/50 px-8 py-10 text-center backdrop-blur-md">
          <p className="text-lg text-white/80">{siteCopy.common.workNotFound}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg border border-[#FF7A18]/40 bg-[#FF7A18]/10 px-5 py-2.5 text-sm font-medium text-[#FFB58C] transition-colors hover:bg-[#FF7A18]/20"
          >
            {siteCopy.common.backHome}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 md:px-6 md:pt-12">
      {/* Navigation bar */}
      <nav className="mb-8 flex items-center justify-between">
        <Link
          href={`/?cat=${work.category}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3.5 py-2 text-sm text-white/65 transition-colors hover:border-[#FF7A18]/40 hover:text-white/90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {siteCopy.common.back}
        </Link>
        {isAdmin && (
          <Link
            href={`/editor/${work.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF7A18]/35 bg-[#FF7A18]/8 px-3.5 py-2 text-sm text-[#FFB58C] transition-colors hover:bg-[#FF7A18]/15"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            {siteCopy.common.edit}
          </Link>
        )}
      </nav>

      {/* Cover image */}
      {work.cover && (
        <div className="mb-8 overflow-hidden rounded-xl border border-white/10">
          <img
            src={work.cover}
            alt={title}
            className="w-full object-cover"
            style={{ maxHeight: 420 }}
          />
        </div>
      )}

      <article>
        {/* Header */}
        <header className="mb-10 space-y-4">
          {/* Category + Year */}
          <div className="flex flex-wrap items-center gap-3">
            {work.category && (
              <span className="rounded-md bg-[#FF7A18]/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#FF7A18]">
                {work.category.replace("-", " ")}
              </span>
            )}
            {work.year && (
              <span className="text-xs tracking-wide text-white/40">{work.year}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>

          {/* Summary */}
          {summary && (
            <p className="max-w-3xl text-base leading-relaxed text-white/65 md:text-lg">
              {summary}
            </p>
          )}

          {/* Tags */}
          {(work.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#FF7A18]/30 bg-[#FF7A18]/8 px-3 py-1 text-xs tracking-wide text-[#FFB58C]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="pt-2">
            <div className="h-px bg-gradient-to-r from-[#FF7A18]/30 via-[#FF7A18]/10 to-transparent" />
          </div>
        </header>

        {/* Content blocks */}
        <WorkRenderer work={work} />
      </article>
    </main>
  );
}
