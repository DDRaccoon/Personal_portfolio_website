"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSiteCopy } from "../../../components/i18n/LanguageProvider";
import WorkEditor from "../../../components/editor/WorkEditor";
import { getWorkById } from "../../../lib/worksStore";

export default function EditWorkPage() {
  const params = useParams();
  const router = useRouter();
  const siteCopy = useSiteCopy();

  const workId = useMemo(() => String(params.id || ""), [params.id]);
  const existingWork = useMemo(() => getWorkById(workId), [workId]);

  if (!existingWork) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-8">
        <div className="rounded-lg border border-white/10 bg-black/30 p-6 text-center">
          <p className="text-white/80">{siteCopy.common.workNotFound}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 rounded border border-[#FF7A18]/40 px-4 py-2 text-sm text-[#FFB58C]"
          >
            {siteCopy.common.backHome}
          </button>
        </div>
      </main>
    );
  }

  const backToCategory = (nextCategory = existingWork.category) => {
    router.push(`/?cat=${nextCategory}`);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold text-white">{siteCopy.common.editWork}</h1>
        <p className="text-sm text-white/60">{siteCopy.common.editWorkDesc}</p>
      </div>

      <WorkEditor
        mode="edit"
        workId={workId}
        initialWork={existingWork}
        initialCategory={existingWork.category}
        onSave={(savedWork) => backToCategory(savedWork.category)}
        onCancel={() => backToCategory(existingWork.category)}
      />
    </main>
  );
}
