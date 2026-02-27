import { NextResponse } from "next/server";

import { getWorkBySlugFromCms } from "../../../../../lib/server/cms";

export async function GET(_request, context) {
  try {
    const { slug } = await context.params;
    const work = await getWorkBySlugFromCms(slug);
    if (!work) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 });
    }
    return NextResponse.json(work);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch work" },
      { status: 500 }
    );
  }
}
