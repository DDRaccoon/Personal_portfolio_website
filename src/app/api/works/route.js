import { NextResponse } from "next/server";

import {
  createWorkInCms,
  isAdminRequest,
  listWorksFromCms,
} from "../../../lib/server/cms";
import { getStaticWorks, localizeKnownMediaUrls } from "../../../lib/staticWorks";

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

function validatePayload(body) {
  return Boolean(
    body &&
      body.category &&
      body.title_en &&
      body.summary_en &&
      body.cover
  );
}

export async function GET(request) {
  const cache = !shouldBypassCache(request);
  try {
    const works = localizeKnownMediaUrls(await listWorksFromCms());
    return worksResponse(works, { cache });
  } catch (error) {
    console.error("Falling back to static works snapshot:", error);
    return worksResponse(getStaticWorks(), { source: "static", cache });
  }
}

export async function POST(request) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!validatePayload(body)) {
      return NextResponse.json(
        { error: "Missing required fields: category/title_en/summary_en/cover" },
        { status: 400 }
      );
    }

    const created = await createWorkInCms(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create work" },
      { status: 500 }
    );
  }
}
