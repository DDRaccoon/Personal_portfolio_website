"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LegacyWorkDetailRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const slug = String(params.slug || "");
    if (!slug) {
      router.replace("/");
      return;
    }

    router.replace(`/works/${slug}`);
  }, [params.slug, router]);

  return null;
}