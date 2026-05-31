import { NextResponse } from "next/server";

import { getWorkBySlugFromCms } from "../../../../../lib/server/cms";
import { getStaticWorkBySlug, localizeKnownMediaUrls } from "../../../../../lib/staticWorks";

const PUBLIC_WORKS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

function worksResponse(body, { status = 200, source = "cms" } = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": PUBLIC_WORKS_CACHE_CONTROL,
      "X-Works-Source": source,
    },
  });
}

export async function GET(_request, context) {
  try {
    const { slug } = await context.params;
    const work = localizeKnownMediaUrls(await getWorkBySlugFromCms(slug));
    if (!work) {
      return worksResponse({ error: "Work not found" }, { status: 404 });
    }
    return worksResponse(work);
  } catch (error) {
    console.error("Falling back to static work snapshot:", error);
    const { slug } = await context.params;
    const fallbackWork = getStaticWorkBySlug(slug);
    if (!fallbackWork) {
      return worksResponse({ error: "Work not found" }, { status: 404, source: "static" });
    }
    return worksResponse(fallbackWork, { source: "static" });
  }
}
