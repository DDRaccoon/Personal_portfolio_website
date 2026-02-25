"use client";

import { useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useSiteCopy } from "../../../components/i18n/LanguageProvider";
import AdminGate from "../../../components/auth/AdminGate";
import WorkEditor from "../../../components/editor/WorkEditor";
import { CATEGORY_IDS, DEFAULT_CATEGORY } from "../../../constants/workCategories";

function NewWorkPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteCopy = useSiteCopy();

  const category = useMemo(() => {
    const cat = searchParams.get("cat") || DEFAULT_CATEGORY;
    return CATEGORY_IDS.includes(cat) ? cat : DEFAULT_CATEGORY;
  }, [searchParams]);

  const backToCategory = (nextCategory = category) => {
    router.push(`/?cat=${nextCategory}`);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold text-white">{siteCopy.common.createWork}</h1>
        <p className="text-sm text-white/60">{siteCopy.common.createWorkDesc}</p>
      </div>

      <WorkEditor
        mode="create"
        initialCategory={category}
        onSave={(savedWork) => backToCategory(savedWork.category)}
        onCancel={() => backToCategory(category)}
      />
    </main>
  );
}

export default function NewWorkPage() {
  return (
    <AdminGate>
      <Suspense fallback={<main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8" />}>
        <NewWorkPageContent />
      </Suspense>
    </AdminGate>
  );
}