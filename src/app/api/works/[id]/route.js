import { NextResponse } from "next/server";

import {
  deleteWorkInCms,
  getWorkByIdFromCms,
  isAdminRequest,
  updateWorkInCms,
} from "../../../../lib/server/cms";
import { getStaticWorkById, localizeKnownMediaUrls } from "../../../../lib/staticWorks";

const PUBLIC_WORKS_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";
const FRESH_WORKS_CACHE_CONTROL = "private, no-store";

function shouldBypassCache(request) {
  return request.nextUrl.searchParams.get("fresh") === "1" && isAdminRequest(request);
}

function worksResponse(body, { status = 200, source = "cms", cache = true } = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": cache ? PUBLIC_WORKS_CACHE_CONTROL : FRESH_WORKS_CACHE_CONTROL,
      "X-Works-Source": source,
    },
  });
}

export async function GET(request, context) {
  const cache = !shouldBypassCache(request);
  try {
    const { id } = await context.params;
    const work = localizeKnownMediaUrls(await getWorkByIdFromCms(id));
    if (!work) {
      return worksResponse({ error: "Work not found" }, { status: 404, cache });
    }
    return worksResponse(work, { cache });
  } catch (error) {
    console.error("Falling back to static work snapshot:", error);
    const { id } = await context.params;
    const fallbackWork = getStaticWorkById(id);
    if (!fallbackWork) {
      return worksResponse({ error: "Work not found" }, { status: 404, source: "static", cache });
    }
    return worksResponse(fallbackWork, { source: "static", cache });
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateWorkInCms(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update work" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteWorkInCms(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete work" },
      { status: 500 }
    );
  }
}
