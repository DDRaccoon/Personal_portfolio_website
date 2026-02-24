"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import WorkRenderer from "../../../components/works/WorkRenderer";
import { getWorkBySlug } from "../../../lib/worksStore";

export default function WorkDetailPage() {
  const router = useRouter();
  const params = useParams();

  const slug = useMemo(() => String(params.slug || ""), [params.slug]);
  const work = useMemo(() => getWorkBySlug(slug), [slug]);

  if (!work) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-8">
        <div className="rounded-lg border border-white/10 bg-black/40 p-6 text-center">
          <p className="text-white/80">Work not found.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 rounded border border-[#FF7A18]/40 px-4 py-2 text-sm text-[#FFB58C]"
          >
            Back Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
        <Link href={`/?cat=${work.category}`} className="rounded border border-white/20 px-3 py-1 hover:border-[#FF7A18]/50">
          Back
        </Link>
        <Link href={`/editor/${work.id}`} className="rounded border border-[#FF7A18]/40 px-3 py-1 text-[#FFB58C]">
          Edit
        </Link>
      </div>

      <article className="space-y-8">
        <header className="space-y-3 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">{work.title_en}</h1>
          <p className="max-w-3xl text-white/75">{work.summary_en}</p>
          <div className="flex flex-wrap gap-2">
            {(work.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#FF7A18]/35 bg-[#FF7A18]/10 px-3 py-1 text-xs text-[#FFB58C]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <WorkRenderer work={work} />
      </article>
    </main>
  );
}
